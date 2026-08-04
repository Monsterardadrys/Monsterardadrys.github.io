/*
    Builds nutrition-data.js from a Livsmedelsverket export.

        node tools/build-nutrition.js <export-file>

    <export-file> is the same file the audit takes — the .xlsx from Sök
    näringsinnehåll, or a CSV or JSON export. Matching reuses lmv-core.js and
    tools/lmv-aliases.json, so a food gets figures only where the match has
    already been confirmed by hand. Nothing is guessed.

    The output is generated, not curated: never hand-edit nutrition-data.js,
    re-run this instead. Foods with no Livsmedelsverket entry (see
    lmv-absent.json) come out with no figures, and every page that uses the
    data has to cope with that.
*/

const fs = require("fs");
const path = require("path");
const LMV = require("./lmv-core.js");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "nutrition-data.js");

// What we keep. Anything else in the export is not used by any page.
const KEEP = ["fat", "protein", "carbs", "fiber", "sugars", "alcohol"];

function loadFoods() {
    const src = fs.readFileSync(path.join(ROOT, "foods-data.js"), "utf8");
    const { CATEGORIES } = new Function(src + "; return { CATEGORIES };")();
    return LMV.flattenCategories(CATEGORIES);
}

function loadMap(name) {
    const p = path.join(__dirname, name);
    if (!fs.existsSync(p)) return {};
    const raw = JSON.parse(fs.readFileSync(p, "utf8"));
    const out = {};
    Object.keys(raw).forEach(function (k) { if (k[0] !== "_") out[k] = raw[k]; });
    return out;
}

function round(n) {
    return Math.round(n * 100) / 100;
}

function entryFor(record) {
    const values = {};
    KEEP.forEach(function (key) {
        const v = record.nutrients[key];
        if (typeof v === "number" && !isNaN(v)) values[key] = round(v);
    });
    return Object.keys(values).length ? values : null;
}

function write(rows, exportName) {
    const lines = [];
    lines.push("/* =========================================================================");
    lines.push("   nutrition-data.js — per 100g figures, GENERATED, do not hand-edit");
    lines.push("");
    lines.push("   Rebuild with:  node tools/build-nutrition.js <export-file>");
    lines.push("");
    lines.push("   Source: Livsmedelsverket's food database, matched food by food through");
    lines.push("   tools/lmv-aliases.json — the same confirmed matches the audit uses. A");
    lines.push("   food appears here only if its match was confirmed by hand.");
    lines.push("");
    lines.push("   " + rows.length + " of the database's foods have figures. The rest have no");
    lines.push("   Livsmedelsverket entry (see tools/lmv-absent.json), so every page reading");
    lines.push("   this has to cope with a food that is simply missing.");
    lines.push("");
    lines.push("   Built from: " + exportName);
    lines.push("   ========================================================================= */");
    lines.push("");
    lines.push("const NUTRITION = {");
    rows.forEach(function (row, i) {
        const parts = KEEP.filter(function (k) { return row.values[k] != null; })
            .map(function (k) { return k + ": " + row.values[k]; });
        lines.push('  "' + row.name.replace(/"/g, '\\"') + '": { ' + parts.join(", ") + " }" +
            (i === rows.length - 1 ? "" : ","));
    });
    lines.push("};");
    lines.push("");
    fs.writeFileSync(OUT, lines.join("\n"), "utf8");
}

function main() {
    const file = process.argv.slice(2).find(function (a) { return a[0] !== "-"; });
    if (!file) {
        console.error("usage: node tools/build-nutrition.js <export-file>");
        process.exit(1);
    }

    const ours = loadFoods();
    const aliases = loadMap("lmv-aliases.json");
    const swedish = loadMap("lmv-swedish.json");
    const absent = loadMap("lmv-absent.json");

    const load = /\.xlsx$/i.test(file)
        ? LMV.parseXlsx(fs.readFileSync(file).buffer)
        : Promise.resolve(LMV.parseExport(fs.readFileSync(file, "utf8")));

    load.then(function (lmv) {
        const result = LMV.runAudit(ours, lmv, aliases, swedish, absent);

        // Both buckets are confirmed matches — a disagreement is a tag that
        // needs a look, not a match that is wrong.
        const matched = result.clean.concat(result.disagreements);

        const rows = [];
        const empty = [];
        matched.forEach(function (m) {
            const values = entryFor(m.record);
            if (values) rows.push({ name: m.food.name, values: values });
            else empty.push(m.food.name);
        });
        rows.sort(function (a, b) { return a.name.localeCompare(b.name); });

        write(rows, path.basename(file));

        console.log("Nutrients detected: " + Object.keys(result.detected).join(", "));
        console.log("Wrote " + rows.length + " of " + ours.length + " foods to nutrition-data.js");
        console.log("No Livsmedelsverket entry: " + result.skipped.length);
        if (result.unmatched.length) {
            console.log("Unmatched (no figures, and not on the absent list): " +
                result.unmatched.length);
            result.unmatched.forEach(function (f) { console.log("  " + f.name); });
        }
        if (empty.length) {
            console.log("Matched but the export carried no usable figures: " + empty.length);
            empty.forEach(function (n) { console.log("  " + n); });
        }
    }).catch(function (err) {
        console.error("Could not read " + file + ": " + err.message);
        process.exit(1);
    });
}

main();
