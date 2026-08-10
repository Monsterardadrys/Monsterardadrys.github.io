/* =========================================================================
   usda-audit.js — offer American matches for the foods neither
   Livsmedelsverket nor Frida covers.

       node tools/usda-audit.js <FoodData_Central_*.json>            report
       node tools/usda-audit.js <FoodData_Central_*.json> --write    write figures

   The report lists each unfigured food with its three best USDA candidates.
   Confirm the right one by putting the pair in tools/usda-aliases.json, then
   run again with --write to produce nutrition-usda.js.

   Reads SR Legacy and Foundation Foods. FNDDS is not read: it is survey data
   costed out of recipes rather than measured, the same objection that keeps
   Branded Foods off the ladder.

   The file is streamed rather than parsed whole — SR Legacy is 64MB, and the
   browser version of this tool has to run on a phone. Both use the same
   reader, so what the command line reports is what the page will show.
   ========================================================================= */

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const LMV = require("./lmv-core.js");
const USDA = require("./usda-core.js");

const { CATEGORIES } = new Function(
  fs.readFileSync(path.join(root, "foods-data.js"), "utf8") + "; return { CATEGORIES };")();
const { NUTRITION } = new Function(
  fs.readFileSync(path.join(root, "nutrition-data.js"), "utf8") + "; return { NUTRITION };")();

const aliasPath = path.join(__dirname, "usda-aliases.json");
const aliasFile = fs.existsSync(aliasPath)
  ? JSON.parse(fs.readFileSync(aliasPath, "utf8")) : {};
const aliases = {};
Object.keys(aliasFile).forEach(function (k) { if (k[0] !== "_") aliases[k] = aliasFile[k]; });

const file = process.argv[2];
const write = process.argv.indexOf("--write") !== -1;
if (!file) {
  console.error("usage: node tools/usda-audit.js <FoodData_Central_*.json> [--write]");
  process.exit(2);
}

/* Two lists, and they are not the same. `needing` is what gets offered for
   confirming — foods with no figures from either earlier source. `allFoods` is
   what the generated file is built from, because a match confirmed last time
   still belongs in it even though the food now has figures. */
const needing = [], allFoods = [];
CATEGORIES.forEach(function (c) {
  c.foods.forEach(function (f) {
    allFoods.push(f);
    if (!NUTRITION[f.name]) needing.push(f);
  });
});

/* Streamed, not read whole. A TextDecoder in stream mode is what makes the
   chunk boundaries safe: they fall on bytes, and "µg" is two of them. */
function read(filename) {
  return new Promise(function (resolve, reject) {
    const reader = USDA.makeReader("");
    const decoder = new TextDecoder("utf-8");
    const stream = fs.createReadStream(filename);
    stream.on("data", function (buf) { reader.push(decoder.decode(buf, { stream: true })); });
    stream.on("error", reject);
    stream.on("end", function () {
      reader.push(decoder.decode());
      resolve(reader.done());
    });
  });
}

read(file).then(function (out) {
  if (!out.records.length) {
    console.error("No usable foods in " + path.basename(file) + ".");
    console.error("If this is FNDDS, that set is not read — see the note at the top of this file.");
    process.exit(1);
  }

  console.log(out.seen + " foods in " + path.basename(file) + ", " +
    out.records.length + " usable, " + out.empty +
    " kept no figure once the manufacturer-supplied ones were dropped");
  console.log(needing.length + " of ours have no figures");

  /* Codes neither list knows were dropped, which is safe but arbitrary until
     somebody looks. Reported in the export's own words so the call can be
     made once and written into ACCEPTED or REJECTED in usda-core.js. */
  const unknown = Object.keys(out.unclassified || {});
  if (unknown.length) {
    console.log("\n--- derivation codes neither list knows (dropped for now) ---");
    unknown.sort(function (a, b) { return out.unclassified[b].count - out.unclassified[a].count; })
      .forEach(function (code) {
        console.log("  " + code + " (" + out.unclassified[code].count + " figures) — " +
          out.unclassified[code].says);
      });
    console.log("  Decide each in ACCEPTED or REJECTED in tools/usda-core.js.");
  }

  const result = USDA.proposeMatches(needing, out.records, aliases);

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
        const lost = Object.keys(c.record.dropped || {});
        if (lost.length) {
          console.log("       dropped: " + lost.map(function (k) {
            return k + " — " + c.record.dropped[k];
          }).join("; "));
        }
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
        " confirmed pair(s) ready — rerun with --write to produce nutrition-usda.js");
    }
    return;
  }

  const all = USDA.confirmedFrom(allFoods, out.records, aliases);
  if (all.missing.length) {
    console.log("\nconfirmed but not written:");
    all.missing.forEach(function (m) { console.log("  " + m.name + " — " + m.why); });
  }
  const built = USDA.toManualEntries(all.confirmed);
  const entries = built.entries;
  const names = Object.keys(entries).sort();
  const lines = [
    "/* =========================================================================",
    "   nutrition-usda.js — per 100g figures from the United States, GENERATED",
    "",
    "       node tools/usda-audit.js <FoodData_Central_*.json> --write",
    "       tools/usda-audit.html   (works on a phone)",
    "",
    "   The third source on the ladder, for the foods neither Livsmedelsverket",
    "   nor Frida has an entry for. Matched through tools/usda-aliases.json —",
    "   confirmed by hand, one food at a time, the same way the other two are.",
    "   Each entry records the USDA food it came from in `ref`.",
    "",
    "   Figures are taken per figure, not per food: anything a manufacturer",
    "   supplied, anything read off a label and anything estimated from a recipe",
    "   is dropped by tools/usda-core.js before it reaches here. So an entry",
    "   below may carry fewer fields than a Swedish or Danish one, and the",
    "   missing ones are missing on purpose.",
    "",
    "   Livsmedelsverket and Frida both still win wherever they have a figure:",
    "   see tools/nutrition-core.js. Generated — never hand-edit it.",
    "",
    "   " + names.length + (names.length === 1 ? " food" : " foods") + ", from: " + path.basename(file),
    "   ========================================================================= */",
    "",
    "const NUTRITION_USDA = {"
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

  if (built.refused.length) {
    lines.push("/* Confirmed, but not imported — too little to be worth a place in a meal:");
    built.refused.forEach(function (row) {
      lines.push("     " + row.name + " — " + row.why);
    });
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

  fs.writeFileSync(path.join(root, "nutrition-usda.js"), lines.join("\n"));
  console.log("\nwrote nutrition-usda.js — " + names.length + " foods");
  if (built.refused.length) {
    console.log(built.refused.length + " confirmed but not imported, for want of a backbone figure:");
    built.refused.forEach(function (r) { console.log("  " + r.name + " — no " + r.missing.join(", ")); });
  }
  if (built.incomplete.length) {
    console.log(built.incomplete.length + " of them are short of a full set — the reasons are in the file");
  }
  console.log("Next: add \"nutrition-usda.js\" to ASSETS in sw.js the first time — until\n" +
    "then check-site.js will call it a stray root file. Then rebuild nutrition-data.js.");
}).catch(function (e) {
  console.error("failed: " + e.message);
  process.exit(1);
});

function fmt(v) { return typeof v === "number" ? v.toFixed(1) : "–"; }
