/* =========================================================================
   build-free.js — the free build, generated from the full one

       node tools/build-free.js            writes build/free/
       node tools/build-free.js --check    reports without writing

   THIS FILE AND ITS INPUT NEVER LEAVE THE PRIVATE REPOSITORY. What ships
   publicly is what it writes: three generated data files that carry a
   hundred foods and no more. The reason it is a build rather than a flag is
   that a flag ships the data it claims to be hiding — anyone can read a
   static site's own JavaScript, so the only limit that holds is one where
   the bytes are not there.

   THREE THINGS ARE CUT, AND ONLY THREE.

     1. FOODS. The hundred marked `free: true` in foods-data.js, chosen with
        a floor of two per category so every category is represented and the
        picker looks like the tool rather than a sample of it. The other
        482 ship as NAMES ONLY — no traits, no figures, no Swedish beyond
        the name — so the list reads as a limit rather than a gap. Somebody
        who cannot find their food assumes a bad database; somebody who sees
        it greyed out knows what they would be buying.

     2. TRAIT DETAIL. The specific tier goes: fructose, polyols, fructans
        and GOS under FODMAPs; capsaicin, peel, allyl compounds,
        carbonation and acetic acid under irritants; birch, grass, mugwort
        and latex under cross-reactivity. Thirteen of forty-three.

        This is safe for one measured reason and would be indefensible
        without it: EVERY food carrying a subtype also carries its broad
        parent, in all three tiers, with no exceptions. So the free build is
        less precise — "a FODMAP" rather than "fructans" — and never
        silent. Not one food ends up with no trait at all.

        Lactose, alcohol and caffeine stay despite sitting in those groups.
        They are not finer grades of a broad concern: somebody avoiding
        caffeine is not asking a question about GI irritation, and alcohol
        has a meaning that is not digestive at all.

        All fourteen declarable allergens stay whole. An earlier version of
        this cut by how often a trait was used, which dropped peanut, egg,
        soy, celery, sesame, crustacean, mollusc, mustard and lactose and
        left nine foods with nothing at all. That is not a smaller app, it
        is a wrong one.

     3. FOODS WITHOUT. The third tool needs a long list to answer from, so
        it is the one that costs the free build least to leave out.

   Everything else ships whole: both languages, the meal builder, the
   articles, the method page and the sources. A tool that puts its own
   provenance behind a paywall has the priorities backwards.
   ========================================================================= */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "build", "free");
const checkOnly = process.argv.indexOf("--check") !== -1;

function read(f) { return fs.readFileSync(path.join(ROOT, f), "utf8"); }

const foodsSrc = read("foods-data.js");
const { CATEGORIES, CATEGORY_GROUPS, TRAITS, FILTER_SECTIONS, PORTION_BANDS } =
  new Function(foodsSrc + "; return { CATEGORIES, CATEGORY_GROUPS, TRAITS, FILTER_SECTIONS, PORTION_BANDS };")();
const { NUTRITION } = new Function(read("nutrition-data.js") + "; return { NUTRITION };")();
const { FODMAP_SERVES } = new Function(read("fodmap-data.js") + "; return { FODMAP_SERVES };")();

const faults = [];

// ---- 1. Which traits survive ---------------------------------------------

const COLLAPSED = ["FODMAPs", "GI Irritants", "Cross-reactivity"];
// In one of those groups and kept anyway — see the header.
const KEEP_ANYWAY = ["over_3g_lactose", "alcohol", "caffeine"];

const dropped = Object.keys(TRAITS).filter(function (t) {
  return COLLAPSED.indexOf(TRAITS[t].group) !== -1 && KEEP_ANYWAY.indexOf(t) === -1;
});
const keptTraits = Object.keys(TRAITS).filter(function (t) { return dropped.indexOf(t) === -1; });
const keeps = new Set(keptTraits);

/* The property the whole cut rests on, asserted rather than remembered: a
   food that carries a subtype must also carry its broad parent, or dropping
   the subtype takes away its only signal. */
const PARENT = { FODMAPs: "fodmaps", "GI Irritants": "irritant", "Cross-reactivity": "cross_reactive" };
CATEGORIES.forEach(function (c) {
  c.foods.forEach(function (f) {
    f.traits.forEach(function (t) {
      const group = TRAITS[t] && TRAITS[t].group;
      if (!group || dropped.indexOf(t) === -1) return;
      const parent = PARENT[group];
      if (f.traits.indexOf(parent) === -1) {
        faults.push(f.name + " carries " + t + " but not " + parent +
          " — dropping the subtype would leave it with no signal for that concern");
      }
    });
    if (f.traits.length && !f.traits.some(function (t) { return keeps.has(t); })) {
      faults.push(f.name + " would have no traits left at all in the free build");
    }
  });
});

// ---- 2. Which foods -------------------------------------------------------

const free = [];
const locked = [];
CATEGORIES.forEach(function (c) {
  const mine = c.foods.filter(function (f) { return f.free; });
  if (!mine.length) faults.push("category " + c.id + " has no free food — it would render empty");
  mine.forEach(function (f) {
    if (!NUTRITION[f.name]) {
      faults.push(f.name + " is marked free but has no figures — the meal builder would refuse it");
    }
    free.push(f.name);
  });
  c.foods.forEach(function (f) { if (!f.free) locked.push(f.name); });
});

/* A filter with no food behind it is a dead checkbox, and a trait carried by
   one food can never be a SHARED trait, which is the question this tool
   exists to answer. Three rare allergens cannot reach three carriers because
   the full database barely has three — those are reported, not failed. */
const carriers = {};
CATEGORIES.forEach(function (c) {
  c.foods.forEach(function (f) {
    if (!f.free) return;
    f.traits.forEach(function (t) { if (keeps.has(t)) carriers[t] = (carriers[t] || 0) + 1; });
  });
});
const thin = keptTraits.filter(function (t) {
  return TRAITS[t].filter && (carriers[t] || 0) < 3;
});
keptTraits.forEach(function (t) {
  if (TRAITS[t].filter && !carriers[t]) {
    faults.push("no free food carries " + t + " — its filter would be a dead checkbox");
  }
});

// ---- 3. Write -------------------------------------------------------------

const stamp = "/* GENERATED by tools/build-free.js — do not edit.\n" +
  "   The free build: " + free.length + " foods with figures and traits, " +
  locked.length + " more by name only,\n" +
  "   " + keptTraits.length + " of " + Object.keys(TRAITS).length + " traits. " +
  "Edit foods-data.js in the private repository\n   and rebuild. */\n\n";

/* Food lines are copied from the source verbatim wherever nothing has to
   change, the same way every other generator here works: a re-serialised
   line is a line that can differ from the one that was checked. Only the
   trait list is rewritten, and only when something was dropped from it. */
const literalFrom = foodsSrc.indexOf("const CATEGORIES = [");
const literalTo = foodsSrc.indexOf("\n];\n", literalFrom);
const sourceLine = {};
foodsSrc.slice(literalFrom, literalTo).split("\n").forEach(function (raw) {
  const m = /^\s*\{ name: "((?:[^"\\]|\\.)*)"/.exec(raw);
  if (m) sourceLine[JSON.parse('"' + m[1] + '"')] = raw.replace(/,\s*$/, "");
});

function freeLine(food) {
  let line = sourceLine[food.name];
  line = line.replace(/ free: true,/, "");
  const after = food.traits.filter(function (t) { return keeps.has(t); });
  if (after.length !== food.traits.length) {
    line = line.replace(/traits: \[[^\]]*\]/,
      "traits: [" + after.map(function (t) { return JSON.stringify(t); }).join(", ") + "]");
  }
  return line;
}

/* A locked food is a name and nothing else. Not even its traits: the point
   is to show that the food exists, and its traits are the thing being sold. */
function lockedLine(food) {
  return '      { name: ' + JSON.stringify(food.name) + ', sv: ' + JSON.stringify(food.sv) +
    ", locked: true }";
}

const catBlocks = CATEGORIES.map(function (c) {
  const rows = c.foods.map(function (f) { return f.free ? freeLine(f) : lockedLine(f); });
  return "  {\n    id: " + JSON.stringify(c.id) + ",\n    label: " + JSON.stringify(c.label) +
    ",\n    sv: " + JSON.stringify(c.sv) + ",\n    foods: [\n" + rows.join(",\n") + "\n    ]\n  }";
});

/* TRAITS, FILTER_SECTIONS, CATEGORY_GROUPS and PORTION_BANDS are re-emitted
   as JSON rather than copied, because the trait table has to lose thirteen
   entries and the filter cards have to lose the checkboxes that pointed at
   them. JSON.stringify is safe here: none of the four holds a function. */
const freeTraits = {};
keptTraits.forEach(function (t) { freeTraits[t] = TRAITS[t]; });

const freeSections = FILTER_SECTIONS.map(function (s) {
  const out = {};
  Object.keys(s).forEach(function (k) { out[k] = s[k]; });
  if (out.items) out.items = out.items.filter(function (t) { return keeps.has(t); });
  return out;
}).filter(function (s) {
  // A card with no broad trait and nothing left in it would render empty.
  if (s.broad && keeps.has(s.broad)) return true;
  if (s.group && keptTraits.some(function (t) { return TRAITS[t].group === s.group; })) return true;
  return Boolean(s.items && s.items.length);
});

const foodsOut = stamp +
  "const PORTION_BANDS = " + JSON.stringify(PORTION_BANDS, null, 2) + ";\n\n" +
  "function portionBand(grams) {\n" +
  "  for (let i = 0; i < PORTION_BANDS.length; i++) {\n" +
  "    const max = PORTION_BANDS[i].max;\n" +
  "    if (max == null || grams <= max) return PORTION_BANDS[i].band;\n" +
  "  }\n  return PORTION_BANDS.length;\n}\n\n" +
  "const TRAITS = " + JSON.stringify(freeTraits, null, 2) + ";\n\n" +
  "const FILTER_SECTIONS = " + JSON.stringify(freeSections, null, 2) + ";\n\n" +
  "const CATEGORIES = [\n" + catBlocks.join(",\n") + "\n];\n\n" +
  "const CATEGORY_GROUPS = " + JSON.stringify(CATEGORY_GROUPS, null, 2) + ";\n";

const freeNutrition = {};
free.forEach(function (n) { if (NUTRITION[n]) freeNutrition[n] = NUTRITION[n]; });
const nutritionOut = stamp + "const NUTRITION = " + JSON.stringify(freeNutrition, null, 2) + ";\n";

const freeServes = {};
Object.keys(FODMAP_SERVES).forEach(function (n) {
  if (free.indexOf(n) !== -1) freeServes[n] = FODMAP_SERVES[n];
});
const fodmapOut = stamp + "const FODMAP_SERVES = " + JSON.stringify(freeServes, null, 2) + ";\n";

// ---- Report ---------------------------------------------------------------

console.log(free.length + " free foods, " + locked.length + " locked by name, " +
  CATEGORIES.length + " categories");
console.log(keptTraits.length + " of " + Object.keys(TRAITS).length + " traits, " +
  keptTraits.filter(function (t) { return TRAITS[t].filter; }).length + " filterable, " +
  freeSections.length + " filter cards");
console.log("dropped: " + dropped.map(function (t) { return TRAITS[t].label; }).join(", "));
console.log(Object.keys(freeNutrition).length + " with figures, " +
  Object.keys(freeServes).length + " with a low-FODMAP serving");

if (thin.length) {
  console.log("\nFilters with fewer than three foods behind them — thin, not broken.\n" +
    "Each of these is rare in the full database too:");
  thin.forEach(function (t) {
    console.log("  - " + TRAITS[t].label + " (" + (carriers[t] || 0) + ")");
  });
}

if (faults.length) {
  console.log("\nFaults (" + faults.length + ")");
  faults.forEach(function (f) { console.log("  - " + f); });
  process.exit(1);
}

if (checkOnly) { console.log("\nNo faults. Nothing written (--check)."); process.exit(0); }

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "foods-data.js"), foodsOut);
fs.writeFileSync(path.join(OUT, "nutrition-data.js"), nutritionOut);
fs.writeFileSync(path.join(OUT, "fodmap-data.js"), fodmapOut);
console.log("\nNo faults. Written to build/free/");
