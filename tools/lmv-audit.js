/*
    Command-line wrapper around lmv-core.js.

        node tools/lmv-audit.js <export-file> [--all] [--unmatched]

    <export-file> is whatever you pulled from Livsmedelsverket — JSON from the
    dataportal API, or a CSV from Sök näringsinnehåll. The shape is sniffed
    rather than assumed, and the detected nutrients are printed first so a
    wrong guess is obvious immediately.

    If you'd rather not use a terminal, tools/lmv-audit.html does the same
    thing in a browser and works fine on a phone.
*/

const fs = require("fs");
const path = require("path");
const LMV = require("./lmv-core.js");

const ROOT = path.join(__dirname, "..");

function loadOurFoods() {
    const src = fs.readFileSync(path.join(ROOT, "foods-data.js"), "utf8");
    const { CATEGORIES } = new Function(src + "; return { CATEGORIES };")();
    return LMV.flattenCategories(CATEGORIES);
}

function loadAliases() {
    const p = path.join(__dirname, "lmv-aliases.json");
    if (!fs.existsSync(p)) return {};
    const raw = JSON.parse(fs.readFileSync(p, "utf8"));
    const out = {};
    Object.keys(raw).forEach(function (k) { if (k[0] !== "_") out[k] = raw[k]; });
    return out;
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
    const aliases = loadAliases();

    // .xlsx has to be unzipped, which is async
    const load = /\.xlsx$/i.test(file)
        ? LMV.parseXlsx(fs.readFileSync(file).buffer)
        : Promise.resolve(LMV.parseExport(fs.readFileSync(file, "utf8")));

    load.then(function (lmv) {
        report(ours, lmv, aliases, showAll, showUnmatched);
    }).catch(function (err) {
        console.error("Could not read " + file + ": " + err.message);
        process.exit(1);
    });
}

function report(ours, lmv, aliases, showAll, showUnmatched) {
    const result = LMV.runAudit(ours, lmv, aliases);

    const detected = Object.keys(result.detected);
    console.log("Livsmedelsverket records: " + lmv.length);
    console.log("Nutrients detected: " + (detected.length
        ? detected.map(function (k) { return k + " (" + result.detected[k] + ")"; }).join(", ")
        : "NONE — the column names were not recognised, check the export"));
    console.log("Our foods: " + ours.length + ", aliases on file: " + Object.keys(aliases).length);
    console.log("");

    if (showAll) {
        result.clean.forEach(function (c) {
            console.log("ok    " + c.food.name + "  <-  " + c.record.name);
        });
    }

    if (result.disagreements.length) {
        console.log("=== Disagreements on confirmed matches (" + result.disagreements.length + ") ===");
        result.disagreements.forEach(function (d) {
            console.log("\n" + d.food.name + "  <-  " + d.record.name);
            d.findings.forEach(function (f) {
                console.log("   " + (f.soft ? "[check] " : "        ") + f.trait + ": " + f.text);
            });
        });
        console.log("");
    } else if (result.confirmed) {
        console.log("No disagreements on the " + result.confirmed + " confirmed matches.\n");
    }

    if (result.suggestions.length) {
        console.log("=== Suggested matches to confirm (" + result.suggestions.length + ") ===");
        console.log("Add the right ones to tools/lmv-aliases.json, then re-run.\n");
        result.suggestions.forEach(function (s) {
            const n = s.record.nutrients;
            console.log("  \"" + s.food.name + "\": \"" + s.record.name + "\",   " +
                "(" + s.score.toFixed(2) + ")  fat " + n.fat + " protein " + n.protein +
                " fiber " + n.fiber + " sugars " + n.sugars);
        });
        console.log("");
    }

    console.log("Unmatched: " + result.unmatched.length + " of " + ours.length +
        (showUnmatched ? "" : "  (--unmatched to list them)"));
    if (showUnmatched) result.unmatched.forEach(function (f) { console.log("  " + f.name); });
}

main();
