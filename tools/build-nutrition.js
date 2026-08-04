/*
    Builds nutrition-data.js from a Livsmedelsverket export.

        node tools/build-nutrition.js <export-file>

    <export-file> is the same file the audit takes — the .xlsx from Sök
    näringsinnehåll, or a CSV or JSON export.

    If you'd rather not use a terminal, tools/build-nutrition.html does the
    same thing in a browser and works fine on a phone. Both go through
    nutrition-core.js, so they cannot produce different files.
*/

const fs = require("fs");
const path = require("path");
const LMV = require("./lmv-core.js");
const NutritionCore = require("./nutrition-core.js");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "nutrition-data.js");

function loadFoods() {
    const src = fs.readFileSync(path.join(ROOT, "foods-data.js"), "utf8");
    const { CATEGORIES } = new Function(src + "; return { CATEGORIES };")();
    return LMV.flattenCategories(CATEGORIES);
}

// The hand-entered figures, if any. Same file the browser builder reads.
function loadManual() {
    const p = path.join(ROOT, "nutrition-manual.js");
    if (!fs.existsSync(p)) return {};
    const src = fs.readFileSync(p, "utf8");
    return new Function(src + "; return NUTRITION_MANUAL;")() || {};
}

function loadMap(name) {
    const p = path.join(__dirname, name);
    if (!fs.existsSync(p)) return {};
    const raw = JSON.parse(fs.readFileSync(p, "utf8"));
    const out = {};
    Object.keys(raw).forEach(function (k) { if (k[0] !== "_") out[k] = raw[k]; });
    return out;
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
        const manual = loadManual();
        const built = NutritionCore.build(result, ours.length, path.basename(file), manual);

        fs.writeFileSync(OUT, built.text, "utf8");

        console.log("Nutrients detected: " + Object.keys(result.detected).join(", "));
        console.log("Wrote " + built.rows.length + " of " + ours.length + " foods to nutrition-data.js" +
            " (" + built.manualUsed + " from nutrition-manual.js)");
        console.log("No Livsmedelsverket entry: " + built.skipped);
        if (built.unmatched.length) {
            console.log("Unmatched (no figures, and not on the absent list): " + built.unmatched.length);
            built.unmatched.forEach(function (n) { console.log("  " + n); });
        }
        if (built.empty.length) {
            console.log("Matched but the export carried no usable figures: " + built.empty.length);
            built.empty.forEach(function (n) { console.log("  " + n); });
        }
    }).catch(function (err) {
        console.error("Could not read " + file + ": " + err.message);
        process.exit(1);
    });
}

main();
