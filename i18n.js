/*
    i18n.js — two languages, side by side.

    The site is written in English and read mostly in Swedish. The hard part of
    that is not the translating, it is keeping the two from drifting: a food
    renamed in one language and not the other, a trait whose Swedish text still
    argues the point the English one stopped making.

    So the shape is chosen to make drift visible rather than to make the files
    tidy. Two rules:

      1. BOTH LANGUAGES LIVE IN THE SAME PLACE. A food carries `name` and `sv`
         on the same line; a trait carries `label` and an `sv` block beside it.
         Nobody edits one without the other in front of them. Parallel files —
         en/foods.js and sv/foods.js — are tidier and drift silently, which is
         the failure this is built to avoid.

      2. THE CHECK FAILS ON A GAP. check-data.js requires a Swedish string for
         every food, every category and every trait. Adding a food in English
         alone stops the build, the same way a food with no portion does.

    English is the source of truth. Everything is written in English first, the
    comments and the worklist are English, and a Swedish string with no English
    counterpart is the anomaly rather than the other way round.

    The language lives in localStorage and can be forced with ?lang=sv, which is
    what makes a link shareable.
*/

(function (root) {
    "use strict";

    const KEY = "language";
    const LANGUAGES = ["en", "sv"];

    function fromQuery() {
        if (typeof location === "undefined") return null;
        const m = /[?&]lang=(\w+)/.exec(location.search);
        return m && LANGUAGES.indexOf(m[1]) !== -1 ? m[1] : null;
    }

    function stored() {
        try {
            const v = localStorage.getItem(KEY);
            return LANGUAGES.indexOf(v) !== -1 ? v : null;
        } catch (e) { return null; }
    }

    /* Swedish is the default when the browser asks for it, because the audience
       is Swedish and the food data is Swedish. English is the fallback, and the
       fallback is never empty — that is what the check guarantees. */
    function fromBrowser() {
        if (typeof navigator === "undefined") return null;
        const langs = navigator.languages || [navigator.language || ""];
        for (let i = 0; i < langs.length; i++) {
            if (/^sv\b/i.test(langs[i])) return "sv";
            if (/^en\b/i.test(langs[i])) return "en";
        }
        return null;
    }

    let current = fromQuery() || stored() || fromBrowser() || "en";

    /* The <html lang> attribute is what a screen reader and a translate
       prompt read, so it has to say what the page actually says. */
    if (typeof document !== "undefined" && document.documentElement) {
        document.documentElement.setAttribute("lang", current);
    }

    function lang() { return current; }

    function set(next) {
        if (LANGUAGES.indexOf(next) === -1) return;
        current = next;
        try { localStorage.setItem(KEY, next); } catch (e) { /* private mode */ }
        if (typeof document !== "undefined") {
            document.documentElement.setAttribute("lang", next);
        }
    }

    /* Read one string off an object that carries both.

       `pick(food, "name")` gives the Swedish name when the language is Swedish
       and there is one, and the English name otherwise. It never returns
       undefined: a missing Swedish string falls back rather than blanking the
       page, and the check is what stops it being missing in the first place.
       Those are two different jobs and both are needed — the check protects the
       repo, the fallback protects the reader from a repo that got past it. */
    function pick(obj, field) {
        if (!obj) return "";
        if (current === "sv" && obj.sv) {
            const v = typeof obj.sv === "string" ? obj.sv : obj.sv[field];
            if (v) return v;
        }
        return obj[field] || "";
    }

    /* The same, for a list: a trait's analysis paragraphs. */
    function pickList(obj, field) {
        if (!obj) return [];
        if (current === "sv" && obj.sv && obj.sv[field] && obj.sv[field].length) {
            return obj.sv[field];
        }
        return obj[field] || [];
    }

    /* A food's name in whichever language is showing. Used everywhere a food
       is displayed; the English name stays the key in every data file, so
       nothing about matching, aliases or figures changes. */
    function foodName(food) { return pick(food, "name"); }
    function traitLabel(trait) { return pick(trait, "label"); }

    /* The same, when all you are holding is the English name.

       Half the site passes food names around as bare strings — a Set of
       excluded foods, a saved meal's ingredient list, the value on a
       checkbox. Those strings are keys and must stay English, so the
       translation happens at the moment of display instead: nameOf("Carrot")
       is "Morot" while the key is still "Carrot".

       The index is built once, off CATEGORIES, the first time it is asked
       for. Rebuilt if the food list somehow grows afterwards. */
    let index = null;
    let indexed = 0;

    function buildIndex() {
        index = {};
        indexed = 0;
        const cats = typeof CATEGORIES !== "undefined" ? CATEGORIES : root.CATEGORIES;
        if (!cats) return;
        cats.forEach(function (category) {
            (category.foods || []).forEach(function (food) {
                if (food.sv) index[food.name] = food.sv;
                indexed++;
            });
        });
    }

    function swedishName(name) {
        const cats = typeof CATEGORIES !== "undefined" ? CATEGORIES : root.CATEGORIES;
        let total = 0;
        if (cats) cats.forEach(function (c) { total += (c.foods || []).length; });
        if (!index || total !== indexed) buildIndex();
        return index[name] || name;
    }

    function nameOf(name) {
        return current === "sv" ? swedishName(name) : name;
    }

    /* Both names, for searching. A reader on the Swedish page may still know
       a food as "cottage cheese", and a reader on the English page may type
       "kvarg"; neither should come up empty, so the haystack is both. */
    function bothNames(name) {
        const sv = swedishName(name);
        return sv === name ? name : name + " " + sv;
    }

    /* Sort by what the reader sees. A list ordered by English name reads as
       unordered once the names are Swedish. */
    function compareNames(a, b) {
        return nameOf(a).localeCompare(nameOf(b), current === "sv" ? "sv" : "en");
    }

    const I18N = {
        LANGUAGES: LANGUAGES,
        lang: lang,
        set: set,
        pick: pick,
        pickList: pickList,
        foodName: foodName,
        traitLabel: traitLabel,
        nameOf: nameOf,
        bothNames: bothNames,
        compareNames: compareNames
    };

    if (typeof module === "object" && module.exports) module.exports = I18N;
    else root.I18N = I18N;
})(typeof self !== "undefined" ? self : this);
