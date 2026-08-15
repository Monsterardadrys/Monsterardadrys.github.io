/* =========================================================================
   check-harvest.js — is the "nearest food we already have" column any good?

       node tools/check-harvest.js

   The harvest prints, beside every record it offers, the food from our own
   list that looks closest to it. That column is the whole point: it is how a
   near-duplicate becomes visible before it is added twice.

   It is also the part with no obvious way to tell whether it works. A wrong
   neighbour reads exactly like a checked one, and the failures found by hand
   — "Matolja" offered Tomato, "Maräng" offered Dried Mango — were found only
   because someone happened to know both foods.

   So this measures it. lmv-aliases.json is ground truth: for every food a
   person confirmed against the Swedish table, it records which record belongs
   to which food. Feed the matcher the record name and see whether it names
   the food the person chose.

   THREE OUTCOMES, NOT TWO. A wrong answer is not one thing:

     - RIGHT — the food the person picked.
     - A SIBLING — a different food in the same category. "Ost hårdost fett
       31%" offered Hard Cheese where the alias says Aged Gouda. The hint
       still lands you in the right aisle, and often the matcher's answer is
       as defensible as the alias.
     - MISLEADING — a food from a different category. This is the one that
       costs something, because it hides that nothing was found.
     - SILENT — nothing offered. Not a failure. A record with no counterpart
       should come back empty rather than be given a neighbour it does not
       have.

   The thresholds below are set just under what the matcher currently does, so
   a change that makes it worse fails and a change that makes it better does
   not have to touch this file until it wants to raise the bar.
   ========================================================================= */

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const Harvest = require("./harvest-core.js");
const LMV = require("./lmv-core.js");

const { CATEGORIES } = new Function(
  fs.readFileSync(path.join(root, "foods-data.js"), "utf8") + "; return { CATEGORIES };")();

// What the harvest page builds: our names, and every Swedish name each goes by.
const ours = [];
const category = {};
const aka = {};

function alsoKnownAs(food, name) {
  if (!name) return;
  if (!aka[food]) aka[food] = [];
  if (aka[food].indexOf(name) === -1) aka[food].push(name);
}

CATEGORIES.forEach(function (c) {
  c.foods.forEach(function (f) {
    ours.push(f.name);
    category[f.name] = c.label;
    alsoKnownAs(f.name, f.sv);
  });
});

function readJson(file) {
  const p = path.join(__dirname, file);
  if (!fs.existsSync(p)) return {};
  const raw = JSON.parse(fs.readFileSync(p, "utf8"));
  const out = {};
  Object.keys(raw).forEach(function (k) { if (k[0] !== "_") out[k] = raw[k]; });
  return out;
}

const swedish = readJson("lmv-swedish.json");
Object.keys(swedish).forEach(function (k) {
  const v = swedish[k];
  (Array.isArray(v) ? v : [v]).forEach(function (n) { alsoKnownAs(k, n); });
});

/* The matcher, as rank() runs it. Kept here rather than exported from
   harvest-core because rank() needs a whole export around it and this needs
   one name at a time. If the two drift the numbers below stop meaning
   anything, so the shape is deliberately a plain transcription. */
function nearest(recordName) {
  const mine = Harvest.tokens(recordName);
  let best = null;
  ours.forEach(function (name) {
    let overlap = Harvest.jaccard(mine, Harvest.tokens(name), LMV.sameWord, LMV.isWeakWord);
    (aka[name] || []).forEach(function (other) {
      overlap = Math.max(overlap,
        Harvest.jaccard(mine, Harvest.tokens(other), LMV.sameWord, LMV.isWeakWord));
    });
    if (!best || overlap > best.score) best = { name: name, score: overlap };
  });
  if (best && best.score > 0) return best.name;

  let letters = null;
  ours.forEach(function (name) {
    const s = LMV.score(recordName, name);
    if (!letters || s > letters.score) letters = { name: name, score: s };
  });
  return letters && letters.score >= Harvest.LETTERS_FLOOR ? letters.name : null;
}

// ---- Ground truth --------------------------------------------------------

const aliases = readJson("lmv-aliases.json");
const truth = [];
Object.keys(aliases).forEach(function (food) {
  const v = aliases[food];
  const record = Array.isArray(v) ? v[0] : (typeof v === "string" ? v : v && v.lmv);
  if (typeof record === "string" && record) truth.push({ record: record, food: food });
});

const faults = [];

if (truth.length < 100) {
  faults.push("only " + truth.length + " confirmed record→food pairs to measure against — " +
    "too few for the rates below to mean anything");
}

let right = 0, sibling = 0, misleading = 0, silent = 0;
const strays = [];

truth.forEach(function (pair) {
  const got = nearest(pair.record);
  if (!got) { silent++; return; }
  if (got === pair.food) { right++; return; }
  if (category[got] && category[got] === category[pair.food]) { sibling++; return; }
  misleading++;
  strays.push(pair.record + " → wanted " + pair.food + ", got " + got);
});

const share = function (n) { return n / truth.length * 100; };
const pct = function (n) { return share(n).toFixed(1) + "%"; };

/* Set under what the matcher does today. Raise them when it improves; a
   change that drops below one of them is a regression and says so. */
const MIN_RIGHT = 72;
const MAX_MISLEADING = 6;

if (share(right) < MIN_RIGHT) {
  faults.push("the nearest-food column names the right food for " + pct(right) +
    " of confirmed pairs, below the " + MIN_RIGHT + "% this has been holding");
}
if (share(misleading) > MAX_MISLEADING) {
  faults.push("the nearest-food column offers a food from the wrong category for " +
    pct(misleading) + " of confirmed pairs, above the " + MAX_MISLEADING + "% ceiling");
}

// ---- Report --------------------------------------------------------------

console.log(truth.length + " hand-confirmed record→food pairs\n");
console.log("  right                " + String(right).padStart(4) + pct(right).padStart(9));
console.log("  a sibling            " + String(sibling).padStart(4) + pct(sibling).padStart(9) +
  "   same category — the hint still lands");
console.log("  misleading           " + String(misleading).padStart(4) + pct(misleading).padStart(9) +
  "   different category");
console.log("  nothing offered      " + String(silent).padStart(4) + pct(silent).padStart(9) +
  "   honest silence, not a failure");

if (strays.length) {
  console.log("\nThe misleading ones, in full — each is a record whose column a\n" +
    "reader would have to already know was wrong:");
  strays.forEach(function (s) { console.log("  - " + s); });
}

if (faults.length) {
  console.log("\nFaults (" + faults.length + ")");
  faults.forEach(function (f) { console.log("  - " + f); });
  process.exit(1);
}

console.log("\nNo faults.");
