/*
    Shared logic for building nutrition-data.js out of a Livsmedelsverket
    export. No file or network access in here — callers hand in an audit
    result and get the file text back, so the same code runs in the browser
    (tools/build-nutrition.html) and on the command line
    (tools/build-nutrition.js).

    Matching is not done here: it is the audit's, from lmv-core.js, so a food
    gets figures only where the match has already been confirmed by hand in
    lmv-aliases.json. Nothing is guessed and nothing is matched twice.

    Hand-entered figures from nutrition-manual.js are merged in for the foods
    Livsmedelsverket does not cover. Livsmedelsverket always wins where both
    have a figure — one national table applied consistently beats a mixture,
    and the manual file exists to fill gaps, not to override.
*/

(function (root) {
    "use strict";

    /* What we keep.

       Lactose and polyols are the last two and they behave differently from
       the rest: no source has them for every food, and Livsmedelsverket has
       neither. They are kept anyway because each answers a question the seven
       above cannot.

       Lactose lets the lactose line stop guessing. Livsmedelsverket reports
       total sugars only, which is why lactose-free milk still reads as full of
       it and the check has to carry a soft marker saying the figure is not
       really lactose. Where Frida, Ciqual or USDA give the real column, that
       caveat does not apply and check-data.js says so.

       Polyols we tag a trait for on 47 foods and have never had a figure for.
       Ciqual is the only source that publishes one. */
    const KEEP = ["fat", "protein", "carbs", "fiber", "sugars", "alcohol", "water",
        "lactose", "polyols"];

    function round(n) { return Math.round(n * 100) / 100; }

    /* Foods sold dry and eaten made up — soup powder, custard powder, a
       drink mix. Livsmedelsverket lists the powder, not the bowl, and the
       food here carries the bowl's portion. Taking one against the other is
       wrong by the whole dilution: rosehip soup powder against a 200g bowl
       came out at 142g of sugar a serving.

       A food says its own recipe — `madeUp: { parts: 1, water: 8 }` — and the
       figures are scaled by it here rather than entered by hand, so the
       arithmetic is in one place and a changed source figure follows through.
       Water is the powder's own, scaled, plus what was added. */
    function dilute(values, madeUp) {
        const total = madeUp.parts + madeUp.water;
        const factor = madeUp.parts / total;
        const out = {};
        Object.keys(values).forEach(function (k) {
            out[k] = round(values[k] * factor);
        });
        out.water = round((values.water || 0) * factor + (madeUp.water / total) * 100);
        return out;
    }

    function valuesFrom(record) {
        const values = {};
        KEEP.forEach(function (key) {
            const v = record.nutrients[key];
            if (typeof v === "number" && !isNaN(v)) values[key] = round(v);
        });
        return Object.keys(values).length ? values : null;
    }

    /*
        Takes what LMV.runAudit returned and produces the file.

        Both `clean` and `disagreements` count as matched: a disagreement is a
        tag that needs a second look, not a match that is wrong. Foods on the
        absent list never had a record to read, so they come out with nothing
        and every page reading the file has to cope with that.
    */
    function build(result, ourCount, sourceName, manual) {
        const matched = result.clean.concat(result.disagreements);

        const rows = [];
        const empty = [];
        const fromLmv = {};
        matched.forEach(function (m) {
            let values = valuesFrom(m.record);
            if (values && m.food.madeUp) values = dilute(values, m.food.madeUp);
            if (values) {
                rows.push({ name: m.food.name, src: "lmv", values: values });
                fromLmv[m.food.name] = true;
            } else {
                empty.push(m.food.name);
            }
        });

        /* Gaps only. A food Livsmedelsverket covers keeps its figure.

           `madeUp` is a property of the food, not of the table it was read
           from, so the dilution applies here too — a matcha or a soup powder
           sourced from Denmark is as much a powder as one sourced from
           Sweden. Applying it only to the Swedish half was how rosehip soup
           went wrong once already. */
        const byName = {};
        matched.forEach(function (m) { byName[m.food.name] = m.food; });
        (result.skipped || []).forEach(function (f) {
            const food = f && f.food ? f.food : f;
            if (food && food.name) byName[food.name] = food;
        });

        let manualUsed = 0;
        Object.keys(manual || {}).forEach(function (name) {
            if (fromLmv[name]) return;
            const entry = manual[name];
            if (!entry || !entry.values) return;
            let values = {};
            KEEP.forEach(function (k) {
                const v = entry.values[k];
                if (typeof v === "number" && !isNaN(v)) values[k] = round(v);
            });
            if (!Object.keys(values).length) return;
            const food = byName[name];
            if (food && food.madeUp) values = dilute(values, food.madeUp);
            rows.push({ name: name, src: entry.src || "manual", values: values });
            manualUsed += 1;
        });

        rows.sort(function (a, b) { return a.name.localeCompare(b.name); });

        const lines = [];
        lines.push("/* =========================================================================");
        lines.push("   nutrition-data.js — per 100g figures, GENERATED, do not hand-edit");
        lines.push("");
        lines.push("   Rebuild from a Livsmedelsverket export with either of:");
        lines.push("     node tools/build-nutrition.js <export-file>");
        lines.push("     tools/build-nutrition.html   (works on a phone)");
        lines.push("");
        lines.push("   Mostly Livsmedelsverket's food database, matched food by food through");
        lines.push("   tools/lmv-aliases.json — the same confirmed matches the audit uses. A");
        lines.push("   food appears from there only if its match was confirmed by hand. The");
        lines.push("   rest come from nutrition-manual.js, which records a source per food;");
        lines.push("   `src` on each line below says which.");
        lines.push("");
        lines.push("   " + rows.length + " of " + ourCount + " foods have figures — " +
            (rows.length - manualUsed) + " from Livsmedelsverket, " + manualUsed + " entered by");
        lines.push("   hand. The rest have none, and the meal builder will not let them into a");
        lines.push("   meal.");
        lines.push("");
        lines.push("   Built from: " + sourceName);
        lines.push("   ========================================================================= */");
        lines.push("");
        lines.push("const NUTRITION = {");
        rows.forEach(function (row, i) {
            const parts = KEEP.filter(function (k) { return row.values[k] != null; })
                .map(function (k) { return k + ": " + row.values[k]; });
            lines.push('  "' + row.name.replace(/"/g, '\\"') + '": { src: "' + row.src +
                '", ' + parts.join(", ") + " }" + (i === rows.length - 1 ? "" : ","));
        });
        lines.push("};");
        lines.push("");

        return {
            text: lines.join("\n"),
            rows: rows,
            empty: empty,
            manualUsed: manualUsed,
            skipped: result.skipped.length,
            unmatched: result.unmatched.map(function (f) { return f.name; })
        };
    }

    const NutritionCore = { KEEP: KEEP, build: build, dilute: dilute };

    if (typeof module === "object" && module.exports) module.exports = NutritionCore;
    else root.NutritionCore = NutritionCore;
})(typeof self !== "undefined" ? self : this);
