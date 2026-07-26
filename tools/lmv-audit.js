/*
    Audits foods-data.js against a Livsmedelsverket export.

        node tools/lmv-audit.js <export-file> [--all] [--unmatched]

    <export-file> is whatever you pulled from Livsmedelsverket — the JSON from
    dataportal.livsmedelsverket.se, or a CSV from Sök näringsinnehåll. The
    script sniffs the shape rather than assuming one, and prints what it found
    so a wrong guess is obvious immediately.

    Our food names are English and Livsmedelsverket's are Swedish, so matching
    is the hard part. It works in two passes:

      1. tools/lmv-aliases.json maps our name -> the exact Livsmedelsverket
         name. Anything listed there is matched with certainty.
      2. Everything else is fuzzy-matched, and low-confidence matches are
         reported as suggestions to confirm, never used as evidence.

    Confirm a suggestion by adding it to lmv-aliases.json. The file grows once
    and the audit gets more automatic every time it runs.

    Thresholds mirror the ones in about.html. Note the lactose caveat: the
    database reports total sugars, not lactose. For plain dairy those are
    effectively the same number, which is the reasoning already used for
    halloumi and mozzarella. For anything with added sugar it is not, so
    lactose findings are marked as needing a look rather than stated flatly.
*/

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

/* ---- thresholds (per 100 g) ---------------------------------------- */

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

/* ---- reading our own data ------------------------------------------ */

function loadOurFoods() {
    const src = fs.readFileSync(path.join(ROOT, "foods-data.js"), "utf8");
    const { CATEGORIES } = new Function(src + "; return { CATEGORIES };")();
    const out = [];
    CATEGORIES.forEach(function (cat) {
        cat.foods.forEach(function (food) {
            out.push({ name: food.name, category: cat.label, traits: food.traits });
        });
    });
    return out;
}

/* ---- reading the Livsmedelsverket export --------------------------- */

// Swedish nutrient labels, matched as substrings on a lowercased key
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
    for (const [key, patterns] of NUTRIENT_PATTERNS) {
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
    for (const k of Object.keys(obj)) {
        if (candidates.indexOf(norm(k)) !== -1) return k;
    }
    return null;
}

/* Turns one export record into { id, name, nutrients }, handling both a flat
   object (CSV-style, one column per nutrient) and the nested shape the API
   uses (a list of { namn, varde } under some key). */
function normalizeRecord(raw) {
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

    const header = rows.shift().map(function (h) { return h.trim(); });
    return rows.filter(function (r) { return r.some(Boolean); }).map(function (r) {
        const o = {};
        header.forEach(function (h, i) { o[h] = r[i]; });
        return o;
    });
}

function loadExport(file) {
    const text = fs.readFileSync(file, "utf8");
    let records;
    if (text.trim()[0] === "[" || text.trim()[0] === "{") {
        let data = JSON.parse(text);
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

/* ---- fuzzy matching ------------------------------------------------- */

const STOPWORDS = new Set([
    "raw", "fresh", "dried", "cooked", "roasted", "canned", "whole", "ground",
    "fat", "free", "low", "full", "added", "sugar", "cheese", "of", "and", "the"
]);

function tokens(name) {
    return norm(name)
        .replace(/\([^)]*\)/g, " ")
        .replace(/[^a-zåäöéü0-9]+/g, " ")
        .split(" ")
        .filter(function (t) { return t.length > 2 && !STOPWORDS.has(t); });
}

function bigrams(s) {
    const out = new Set();
    for (let i = 0; i < s.length - 1; i++) out.add(s.slice(i, i + 2));
    return out;
}

function dice(a, b) {
    const A = bigrams(a), B = bigrams(b);
    if (!A.size || !B.size) return 0;
    let hits = 0;
    A.forEach(function (g) { if (B.has(g)) hits++; });
    return (2 * hits) / (A.size + B.size);
}

function score(ourName, lmvName) {
    const a = tokens(ourName).join(" "), b = tokens(lmvName).join(" ");
    if (!a || !b) return 0;
    let s = dice(a, b);
    // a full token appearing in both is strong evidence across languages
    // ("roquefort", "halloumi", "quinoa" are spelled the same in Swedish)
    const shared = tokens(ourName).filter(function (t) { return tokens(lmvName).indexOf(t) !== -1; });
    if (shared.length) s = Math.max(s, 0.6 + 0.1 * shared.length);
    return Math.min(s, 1);
}

/* ---- the audit ------------------------------------------------------ */

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
                text: (expected ? "missing" : "extra") + " — fat " + n.fat +
                      ", protein " + n.protein + " (needs fat>17.5 or protein>20)"
            });
        }
    }

    return findings;
}

function main() {
    const args = process.argv.slice(2);
    const file = args.find(function (a) { return a[0] !== "-"; });
    if (!file) {
        console.error("usage: node tools/lmv-audit.js <export-file> [--all] [--unmatched]");
        process.exit(1);
    }
    const showAll = args.indexOf("--all") !== -1;
    const showUnmatched = args.indexOf("--unmatched") !== -1;

    const ours = loadOurFoods();
    const lmv = loadExport(file);

    const aliasPath = path.join(__dirname, "lmv-aliases.json");
    const aliases = fs.existsSync(aliasPath) ? JSON.parse(fs.readFileSync(aliasPath, "utf8")) : {};

    const detected = {};
    lmv.forEach(function (r) {
        Object.keys(r.nutrients).forEach(function (k) {
            if (r.nutrients[k] != null) detected[k] = (detected[k] || 0) + 1;
        });
    });

    console.log("Livsmedelsverket records: " + lmv.length);
    console.log("Nutrients detected: " + (Object.keys(detected).length
        ? Object.keys(detected).map(function (k) { return k + " (" + detected[k] + ")"; }).join(", ")
        : "NONE — the column names were not recognised, check the export"));
    console.log("Our foods: " + ours.length + ", aliases on file: " + Object.keys(aliases).length);
    console.log("");

    const byName = new Map();
    lmv.forEach(function (r) { byName.set(norm(r.name), r); });

    const disagreements = [];
    const suggestions = [];
    const unmatched = [];
    let confirmed = 0;

    ours.forEach(function (food) {
        let record = null;
        if (aliases[food.name]) record = byName.get(norm(aliases[food.name])) || null;

        if (record) {
            confirmed++;
            const findings = auditFood(food, record);
            if (findings.length) disagreements.push({ food: food, record: record, findings: findings });
            else if (showAll) console.log("ok    " + food.name + "  <-  " + record.name);
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

    if (disagreements.length) {
        console.log("=== Disagreements on confirmed matches (" + disagreements.length + ") ===");
        disagreements.forEach(function (d) {
            console.log("\n" + d.food.name + "  <-  " + d.record.name);
            d.findings.forEach(function (f) {
                console.log("   " + (f.soft ? "[check] " : "        ") + f.trait + ": " + f.text);
            });
        });
        console.log("");
    } else if (confirmed) {
        console.log("No disagreements on the " + confirmed + " confirmed matches.\n");
    }

    if (suggestions.length) {
        suggestions.sort(function (a, b) { return b.score - a.score; });
        console.log("=== Suggested matches to confirm (" + suggestions.length + ") ===");
        console.log("Add the right ones to tools/lmv-aliases.json, then re-run.\n");
        suggestions.forEach(function (s) {
            const n = s.record.nutrients;
            console.log("  \"" + s.food.name + "\": \"" + s.record.name + "\",   " +
                "(" + s.score.toFixed(2) + ")  fat " + n.fat + " protein " + n.protein +
                " fiber " + n.fiber + " sugars " + n.sugars);
        });
        console.log("");
    }

    console.log("Unmatched: " + unmatched.length + " of " + ours.length +
        (showUnmatched ? "" : "  (--unmatched to list them)"));
    if (showUnmatched) unmatched.forEach(function (f) { console.log("  " + f.name); });
}

main();
