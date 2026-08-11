/* =========================================================================
   ciqual-audit.js — offer French matches for the foods neither
   Livsmedelsverket nor Frida covers.

       node tools/ciqual-audit.js <Table_Ciqual_*_ENG_*.xlsx>            report
       node tools/ciqual-audit.js <Table_Ciqual_*_ENG_*.xlsx> --write    write figures

   The report lists each unfigured food with its three best Ciqual candidates.
   Confirm the right one by putting the pair in tools/ciqual-aliases.json, then
   run again with --write to produce nutrition-ciqual.js.

   Third on the ladder: below Frida, above USDA. France goes above America
   because it is a European table for a European diet — the Mediterranean and
   French tail is what Sweden and Denmark do not carry.

   Take the ENGLISH export. The French one names every food in French, and the
   scorer's whole advantage over the Swedish audit is that both sides speak the
   same language, so a candidate that disagrees about fresh or dried can be
   pushed down rather than left for a human to catch.
   ========================================================================= */

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const LMV = require("./lmv-core.js");
const Ciqual = require("./ciqual-core.js");

const { CATEGORIES } = new Function(
  fs.readFileSync(path.join(root, "foods-data.js"), "utf8") + "; return { CATEGORIES };")();
const { NUTRITION } = new Function(
  fs.readFileSync(path.join(root, "nutrition-data.js"), "utf8") + "; return { NUTRITION };")();

const aliasPath = path.join(__dirname, "ciqual-aliases.json");
const aliasFile = fs.existsSync(aliasPath)
  ? JSON.parse(fs.readFileSync(aliasPath, "utf8")) : {};
const aliases = {};
Object.keys(aliasFile).forEach(function (k) { if (k[0] !== "_") aliases[k] = aliasFile[k]; });

const file = process.argv[2];
const write = process.argv.indexOf("--write") !== -1;
if (!file) {
  console.error("usage: node tools/ciqual-audit.js <Table_Ciqual_*_ENG_*.xlsx> [--write]");
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

Ciqual.fromXlsx(ab).then(function (parsed) {
  const records = parsed.records;

  console.log(records.length + " foods in " + path.basename(file) +
    ", " + needing.length + " of ours have no figures");
  if (parsed.missing.length) {
    console.log("WARNING: no column for " + parsed.missing.join(", ") +
      " — is this the English export?");
  }
  if (parsed.softened) {
    console.log(parsed.softened + " cells read as zero because the table said " +
      "\"traces\" or gave a limit rather than a value");
  }

  const result = Ciqual.proposeMatches(needing, records, aliases);

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
        " confirmed pair(s) ready — rerun with --write to produce nutrition-ciqual.js");
    }
    return;
  }

  const all = Ciqual.confirmedFrom(allFoods, records, aliases);
  if (all.missing.length) {
    console.log("\nconfirmed but not written:");
    all.missing.forEach(function (m) { console.log("  " + m.name + " — " + m.why); });
  }

  const built = Ciqual.toManualEntries(all.confirmed);
  const entries = built.entries;
  const names = Object.keys(entries).sort();
  const lines = [
    "/* =========================================================================",
    "   nutrition-ciqual.js — per 100g figures from France, GENERATED",
    "",
    "       node tools/ciqual-audit.js <Table_Ciqual_*_ENG_*.xlsx> --write",
    "       tools/ciqual-audit.html   (works on a phone)",
    "",
    "   Third on the ladder — below Frida, above USDA — for the foods neither",
    "   Livsmedelsverket nor Denmark has an entry for. Matched through",
    "   tools/ciqual-aliases.json, confirmed by hand one food at a time. Each",
    "   entry records the Ciqual food it came from in `ref`.",
    "",
    "   Ciqual carries no confidence code per value, so unlike the American",
    "   file these figures are taken on the table's standing rather than tested",
    "   one at a time. Where a figure was read off \"traces\" or a detection",
    "   limit rather than measured, `ref` says so in square brackets.",
    "",
    "   Livsmedelsverket and Frida both still win wherever they have a figure:",
    "   see tools/nutrition-core.js. Generated — never hand-edit it.",
    "",
    "   " + names.length + (names.length === 1 ? " food" : " foods") + ", from: " + path.basename(file),
    "   ========================================================================= */",
    "",
    "const NUTRITION_CIQUAL = {"
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

  /* The refusals, for a reader rather than a person: without this the
     workbench sees a generated file shorter than its alias file and calls it
     drift, which is what a half-written file looks like. */
  lines.push("const NUTRITION_CIQUAL_REFUSED = [" +
    built.refused.map(function (r) { return '"' + r.name.replace(/"/g, '\\"') + '"'; }).join(", ") +
    "];");
  lines.push("");

  if (built.refused.length) {
    lines.push("/* Confirmed, but not imported — too little to be worth a place in a meal:");
    built.refused.forEach(function (row) { lines.push("     " + row.name + " — " + row.why); });
    lines.push("*/");
    lines.push("");
  }

  if (built.incomplete.length) {
    lines.push("/* Short of a full set, and why:");
    built.incomplete.forEach(function (row) {
      lines.push("     " + row.name + " — missing " + row.missing.join(", "));
    });
    lines.push("*/");
    lines.push("");
  }

  fs.writeFileSync(path.join(root, "nutrition-ciqual.js"), lines.join("\n"));
  console.log("\nwrote nutrition-ciqual.js — " + names.length + " foods");
  if (built.refused.length) {
    console.log(built.refused.length + " confirmed but not imported, for want of a backbone figure:");
    built.refused.forEach(function (r) { console.log("  " + r.name + " — no " + r.missing.join(", ")); });
  }
  console.log("Next: add \"nutrition-ciqual.js\" to ASSETS in sw.js the first time — until\n" +
    "then check-site.js will call it a stray root file. Then rebuild nutrition-data.js.");
}).catch(function (e) {
  console.error("failed: " + e.message);
  process.exit(1);
});

function fmt(v) { return typeof v === "number" ? v.toFixed(1) : "–"; }
