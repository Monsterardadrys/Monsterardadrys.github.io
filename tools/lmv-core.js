/*
    Shared logic for auditing foods-data.js against a Livsmedelsverket export.

    No file or network access in here — callers hand in text and get results
    back. That way the same code runs in the browser (tools/lmv-audit.html)
    and on the command line (tools/lmv-audit.js).

    Thresholds mirror the ones described in about.html. Note the lactose
    caveat: the database reports total sugars, not lactose. For plain dairy
    those are effectively the same number, which is the reasoning already used
    for halloumi and mozzarella. For anything with added sugar it is not, so
    lactose findings are flagged as needing a look rather than stated flatly.
*/

(function (root) {
    "use strict";

    /* ---- thresholds (per 100 g) ------------------------------------- */

    const RULES = [
        { trait: "over_10g_fat",    nutrient: "fat",     min: 10 },
        { trait: "protein",         nutrient: "protein", min: 20 },
        { trait: "fiber",           nutrient: "fiber",   min: 6 },
        { trait: "over_3g_lactose", nutrient: "sugars",  min: 1, soft: true },
        { trait: "alcohol",         nutrient: "alcohol", min: 0.5 }
    ];

    // bile_stimulant is the one trait with two ways in
    function bileExpected(n) {
        return (n.fat != null && n.fat > 17.5) || (n.protein != null && n.protein > 20);
    }

    /* ---- reading the export ----------------------------------------- */

    // Swedish nutrient labels, matched against a lowercased key
    const NUTRIENT_PATTERNS = [
        ["fat",     [/^fett$/, /fett,?\s*totalt/, /^summa fett/]],
        ["protein", [/^protein/]],
        ["fiber",   [/fibrer/, /^fiber/, /kostfiber/]],
        ["sugars",  [/sockerarter/, /^socker\b/]],
        ["alcohol", [/^alkohol/]],
        ["carbs",   [/kolhydrater/]]
    ];

    const NAME_KEYS = ["namn", "livsmedelsnamn", "livsmedel", "name", "foodname"];
    const ID_KEYS = ["nummer", "livsmedelsnummer", "id", "number"];

    function norm(s) {
        return String(s == null ? "" : s).toLowerCase().trim();
    }

    function matchNutrient(label) {
        const l = norm(label);
        for (let i = 0; i < NUTRIENT_PATTERNS.length; i++) {
            const key = NUTRIENT_PATTERNS[i][0];
            const patterns = NUTRIENT_PATTERNS[i][1];
            if (patterns.some(function (p) { return p.test(l); })) return key;
        }
        return null;
    }

    function toNumber(v) {
        if (v == null || v === "") return null;
        const n = parseFloat(String(v).replace(",", ".").replace(/\s/g, ""));
        return Number.isFinite(n) ? n : null;
    }

    function pickKey(obj, candidates) {
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            if (candidates.indexOf(norm(keys[i])) !== -1) return keys[i];
        }
        return null;
    }

    /* Turns one export record into { id, name, nutrients }, handling both a
       flat object (CSV-style, one column per nutrient) and the nested shape
       the API uses (a list of { namn, varde } under some key). */
    function normalizeRecord(raw) {
        if (!raw || typeof raw !== "object") return null;
        const nameKey = pickKey(raw, NAME_KEYS);
        if (!nameKey) return null;
        const idKey = pickKey(raw, ID_KEYS);

        const nutrients = {};

        // nested: any array-valued property whose entries look like name/value pairs
        Object.keys(raw).forEach(function (k) {
            const v = raw[k];
            if (!Array.isArray(v)) return;
            v.forEach(function (entry) {
                if (!entry || typeof entry !== "object") return;
                const en = pickKey(entry, NAME_KEYS) || pickKey(entry, ["forkortning", "namn"]);
                const evKey = pickKey(entry, ["varde", "värde", "value", "mangd", "mängd"]);
                if (!en || !evKey) return;
                const key = matchNutrient(entry[en]);
                if (key && nutrients[key] == null) nutrients[key] = toNumber(entry[evKey]);
            });
        });

        // flat: one column per nutrient
        Object.keys(raw).forEach(function (k) {
            if (Array.isArray(raw[k]) || (raw[k] && typeof raw[k] === "object")) return;
            const key = matchNutrient(k);
            if (key && nutrients[key] == null) nutrients[key] = toNumber(raw[k]);
        });

        return {
            id: idKey ? raw[idKey] : null,
            name: String(raw[nameKey]),
            nutrients: nutrients
        };
    }

    function parseCsv(text) {
        // Livsmedelsverket exports are semicolon-separated; handle comma too.
        const firstLine = text.slice(0, text.indexOf("\n"));
        const sep = (firstLine.match(/;/g) || []).length >= (firstLine.match(/,/g) || []).length ? ";" : ",";
        const rows = [];
        let row = [], field = "", quoted = false;
        for (let i = 0; i < text.length; i++) {
            const c = text[i];
            if (quoted) {
                if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
                else if (c === '"') quoted = false;
                else field += c;
            } else if (c === '"') quoted = true;
            else if (c === sep) { row.push(field); field = ""; }
            else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
            else if (c !== "\r") field += c;
        }
        if (field || row.length) { row.push(field); rows.push(row); }
        if (!rows.length) return [];

        const header = rows.shift().map(function (h) { return h.trim(); });
        return rows.filter(function (r) { return r.some(Boolean); }).map(function (r) {
            const o = {};
            header.forEach(function (h, i) { o[h] = r[i]; });
            return o;
        });
    }

    // Accepts the raw text of a JSON or CSV export and returns normalized records.
    function parseExport(text) {
        const trimmed = text.trim();
        let records;
        if (trimmed[0] === "[" || trimmed[0] === "{") {
            let data = JSON.parse(trimmed);
            if (!Array.isArray(data)) {
                // find the array inside a wrapper object
                const arr = Object.keys(data).map(function (k) { return data[k]; })
                    .find(function (v) { return Array.isArray(v); });
                data = arr || [data];
            }
            records = data;
        } else {
            records = parseCsv(text);
        }
        return records.map(normalizeRecord).filter(Boolean);
    }

    /* ---- fuzzy matching ---------------------------------------------- */

    const STOPWORDS = ["raw", "fresh", "dried", "cooked", "roasted", "canned",
        "whole", "ground", "fat", "free", "low", "full", "added", "sugar",
        "cheese", "of", "and", "the"];

    function tokens(name) {
        return norm(name)
            .replace(/\([^)]*\)/g, " ")
            .replace(/[^a-zåäöéü0-9]+/g, " ")
            .split(" ")
            .filter(function (t) { return t.length > 2 && STOPWORDS.indexOf(t) === -1; });
    }

    function bigrams(s) {
        const out = {};
        for (let i = 0; i < s.length - 1; i++) out[s.slice(i, i + 2)] = true;
        return out;
    }

    function dice(a, b) {
        const A = bigrams(a), B = bigrams(b);
        const ka = Object.keys(A), kb = Object.keys(B);
        if (!ka.length || !kb.length) return 0;
        let hits = 0;
        ka.forEach(function (g) { if (B[g]) hits++; });
        return (2 * hits) / (ka.length + kb.length);
    }

    function score(ourName, lmvName) {
        const ta = tokens(ourName), tb = tokens(lmvName);
        const a = ta.join(" "), b = tb.join(" ");
        if (!a || !b) return 0;
        let s = dice(a, b);
        // a full token appearing in both is strong evidence across languages
        // ("roquefort", "halloumi", "quinoa" are spelled the same in Swedish)
        const shared = ta.filter(function (t) { return tb.indexOf(t) !== -1; });
        if (shared.length) s = Math.max(s, 0.6 + 0.1 * shared.length);
        return Math.min(s, 1);
    }

    /* ---- the audit ---------------------------------------------------- */

    function auditFood(food, record) {
        const n = record.nutrients;
        const findings = [];

        RULES.forEach(function (rule) {
            const value = n[rule.nutrient];
            if (value == null) return;
            const has = food.traits.indexOf(rule.trait) !== -1;
            const expected = value > rule.min;
            if (has === expected) return;
            findings.push({
                trait: rule.trait,
                soft: Boolean(rule.soft),
                missing: expected,
                text: (expected ? "missing" : "extra") + " — " + rule.nutrient + " " +
                      value + " g/100g vs threshold " + rule.min
            });
        });

        if (n.fat != null || n.protein != null) {
            const has = food.traits.indexOf("bile_stimulant") !== -1;
            const expected = bileExpected(n);
            if (has !== expected) {
                findings.push({
                    trait: "bile_stimulant",
                    soft: false,
                    missing: expected,
                    text: (expected ? "missing" : "extra") + " — fat " + n.fat +
                          ", protein " + n.protein + " (needs fat>17.5 or protein>20)"
                });
            }
        }

        return findings;
    }

    /* ours:    [{ name, category, traits }]
       lmv:     normalized records from parseExport
       aliases: { "our name": "Livsmedelsverket name" } */
    function runAudit(ours, lmv, aliases) {
        aliases = aliases || {};

        const detected = {};
        lmv.forEach(function (r) {
            Object.keys(r.nutrients).forEach(function (k) {
                if (r.nutrients[k] != null) detected[k] = (detected[k] || 0) + 1;
            });
        });

        const byName = {};
        lmv.forEach(function (r) { byName[norm(r.name)] = r; });

        const disagreements = [], suggestions = [], unmatched = [], clean = [];

        ours.forEach(function (food) {
            const alias = aliases[food.name];
            const record = alias ? byName[norm(alias)] : null;

            if (record) {
                const findings = auditFood(food, record);
                if (findings.length) disagreements.push({ food: food, record: record, findings: findings });
                else clean.push({ food: food, record: record });
                return;
            }

            let best = null, bestScore = 0;
            lmv.forEach(function (r) {
                const s = score(food.name, r.name);
                if (s > bestScore) { bestScore = s; best = r; }
            });

            if (best && bestScore >= 0.55) suggestions.push({ food: food, record: best, score: bestScore });
            else unmatched.push(food);
        });

        suggestions.sort(function (a, b) { return b.score - a.score; });

        return {
            detected: detected,
            confirmed: disagreements.length + clean.length,
            disagreements: disagreements,
            clean: clean,
            suggestions: suggestions,
            unmatched: unmatched
        };
    }

    // Flattens CATEGORIES from foods-data.js into what runAudit wants.
    function flattenCategories(categories) {
        const out = [];
        categories.forEach(function (cat) {
            cat.foods.forEach(function (food) {
                out.push({ name: food.name, category: cat.label, traits: food.traits });
            });
        });
        return out;
    }

    const LMV = {
        RULES: RULES,
        parseExport: parseExport,
        parseCsv: parseCsv,
        score: score,
        auditFood: auditFood,
        runAudit: runAudit,
        flattenCategories: flattenCategories
    };

    if (typeof module === "object" && module.exports) module.exports = LMV;
    else root.LMV = LMV;
})(typeof self !== "undefined" ? self : this);
