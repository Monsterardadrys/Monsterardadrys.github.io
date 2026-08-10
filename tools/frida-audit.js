/* =========================================================================
   frida-audit.js — offer Danish matches for the foods Livsmedelsverket
   does not cover.

       node tools/frida-audit.js <FCDB_dataset.xlsx>            report
       node tools/frida-audit.js <FCDB_dataset.xlsx> --write    write figures

   The report lists each unfigured food with its three best Frida candidates.
   Confirm the right one by putting the pair in tools/frida-aliases.json, then
   run again with --write to produce nutrition-frida.js.

   Only foods with no figures are offered. A food Livsmedelsverket covers
   keeps its Swedish figure.
   ========================================================================= */

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const LMV = require("./lmv-core.js");
const Frida = require("./frida-core.js");

const { CATEGORIES } = new Function(
  fs.readFileSync(path.join(root, "foods-data.js"), "utf8") + "; return { CATEGORIES };")();
const { NUTRITION } = new Function(
  fs.readFileSync(path.join(root, "nutrition-data.js"), "utf8") + "; return { NUTRITION };")();

const aliasPath = path.join(__dirname, "frida-aliases.json");
const aliasFile = fs.existsSync(aliasPath)
  ? JSON.parse(fs.readFileSync(aliasPath, "utf8")) : {};
const aliases = {};
Object.keys(aliasFile).forEach(function (k) { if (k[0] !== "_") aliases[k] = aliasFile[k]; });

const file = process.argv[2];
const write = process.argv.indexOf("--write") !== -1;
if (!file) {
  console.error("usage: node tools/frida-audit.js <FCDB_dataset.xlsx> [--write]");
  process.exit(2);
}

/* Two lists, and they are not the same. `needing` is what gets offered for
   confirming — foods with no figures. `allFoods` is what the generated file is
   built from, because a match confirmed last time still belongs in it even
   though the food now has figures. */
const needing = [], allFoods = [];
CATEGORIES.forEach(function (c) {
  c.foods.forEach(function (f) {
    allFoods.push(f);
    if (!NUTRITION[f.name]) needing.push(f);
  });
});

const buf = fs.readFileSync(file);
const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

Frida.fromXlsx(ab).then(function (parsed) {
  const { records, missing } = parsed;
  console.log(records.length + " foods in " + path.basename(file) +
    ", " + needing.length + " of ours have no figures");
  if (missing.length) {
    console.log("WARNING: no column for " + missing.join(", ") +
      " — the file may be an abridged export");
  }

  const result = Frida.proposeMatches(needing, records, aliases);

  console.log("\nconfirmed " + result.confirmed.length +
    " · to confirm " + result.toConfirm.length +
    " · nothing close " + result.unmatched.length);

  if (result.toConfirm.length) {
    console.log("\n--- to confirm (best three, read all three) ---");
    result.toConfirm.forEach(function (t) {
      console.log("\n" + t.food.name);
      t.candidates.forEach(function (c, i) {
        const n = c.record.nutrients;
        console.log("  " + (i + 1) + ". " + c.score.toFixed(2) + "  " + c.record.name +
          "   [fat " + fmt(n.fat) + " · water " + fmt(n.water) + " · sugars " + fmt(n.sugars) + "]");
      });
    });
  }

  if (result.unmatched.length) {
    console.log("\n--- nothing close (" + result.unmatched.length + ") ---");
    result.unmatched.forEach(function (u) { console.log("  " + u.food.name + " — " + u.why); });
  }

  if (!write) {
    if (result.confirmed.length) {
      console.log("\n" + result.confirmed.length +
        " confirmed pair(s) ready — rerun with --write to produce nutrition-frida.js");
    }
    return;
  }

  const all = Frida.confirmedFrom(allFoods, records, aliases);
  if (all.missing.length) {
    console.log("\nconfirmed but not written:");
    all.missing.forEach(function (m) { console.log("  " + m.name + " — " + m.why); });
  }
  const entries = Frida.toManualEntries(all.confirmed);
  const names = Object.keys(entries).sort();
  const lines = [
    "/* =========================================================================",
    "   nutrition-frida.js — per 100g figures from Denmark, GENERATED",
    "",
    "       node tools/frida-audit.js <FCDB_dataset.xlsx> --write",
    "",
    "   The second source on the ladder, for the foods Livsmedelsverket has no",
    "   entry for. Matched through tools/frida-aliases.json — confirmed by hand,",
    "   one food at a time, the same way the Swedish matches are. Each entry",
    "   records the Frida food it came from in `ref`.",
    "",
    "   Livsmedelsverket still wins wherever both have a figure: see",
    "   tools/nutrition-core.js. Generated — never hand-edit it.",
    "",
    "   " + names.length + (names.length === 1 ? " food" : " foods") + ", from: " + path.basename(file),
    "   ========================================================================= */",
    "",
    "const NUTRITION_FRIDA = {"
  ];
  names.forEach(function (name, i) {
    const e = entries[name];
    const vals = Object.keys(e.values).map(function (k) { return k + ": " + e.values[k]; });
    lines.push('  "' + name.replace(/"/g, '\\"') + '": {');
    lines.push('    src: "' + e.src + '", ref: "' + e.ref.replace(/"/g, '\\"') + '",');
    lines.push("    values: { " + vals.join(", ") + " }");
    lines.push("  }" + (i === names.length - 1 ? "" : ","));
  });
  lines.push("};");
  lines.push("");

  fs.writeFileSync(path.join(root, "nutrition-frida.js"), lines.join("\n"));
  console.log("\nwrote nutrition-frida.js — " + names.length + " foods");
  console.log("Next: add \"nutrition-frida.js\" to ASSETS in sw.js the first time — until\n" +
    "then check-site.js will call it a stray root file. Then rebuild nutrition-data.js.");
}).catch(function (e) {
  console.error("failed: " + e.message);
  process.exit(1);
});

function fmt(v) { return typeof v === "number" ? v.toFixed(1) : "–"; }
