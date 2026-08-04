/* =========================================================================
   check-data.js — consistency checks over foods-data.js

       node tools/check-data.js

   Exits non-zero on anything it considers a fault, so it can be run before
   a release. It checks the things that went wrong once and would otherwise
   drift again quietly:

     - unknown trait ids, missing portions, duplicate food names
     - traits defined but carried by no food
     - a subtype without its umbrella: a food tagged fructans but not fodmaps
       counts in one filter and not the other, which is always a mistake
     - an umbrella without a subtype: legitimate where the broad trait covers
       mechanisms no subtype names, so these are listed as a warning rather
       than a fault. ALLOWED_BROAD_ONLY says which are deliberate.
   ========================================================================= */

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const source = fs.readFileSync(path.join(root, "foods-data.js"), "utf8");
const { TRAITS, CATEGORIES, FILTER_SECTIONS } =
  new Function(source + "; return { TRAITS, CATEGORIES, FILTER_SECTIONS };")();

// Broad traits that legitimately stand alone, and why.
const ALLOWED_BROAD_ONLY = {
  irritant: "isothiocyanates, piperine, menthol and plain acidity are irritant " +
    "mechanisms with no subtype of their own",
  cross_reactive: "mugwort and ragweed cross-reactivity has no pollen subtype here"
};

const faults = [];
const warnings = [];

const foods = [];
CATEGORIES.forEach(function (category) {
  category.foods.forEach(function (food) {
    foods.push(Object.assign({ category: category.label }, food));
  });
});

// ---- Basics --------------------------------------------------------------
const names = new Set();
const used = {};
foods.forEach(function (food) {
  if (names.has(food.name)) faults.push("duplicate food name: " + food.name);
  names.add(food.name);
  if (!food.portion) faults.push(food.name + " has no portion");
  food.traits.forEach(function (id) {
    if (!TRAITS[id]) faults.push(food.name + " carries unknown trait " + id);
    used[id] = (used[id] || 0) + 1;
  });
});

Object.keys(TRAITS).forEach(function (id) {
  if (!used[id]) faults.push("trait " + id + " is carried by no food");
});

// ---- Umbrella and subtype ------------------------------------------------
FILTER_SECTIONS.forEach(function (section) {
  if (!section.broad || !section.group) return;

  const subtypes = Object.keys(TRAITS).filter(function (id) {
    return TRAITS[id].group === section.group;
  });

  const subWithoutBroad = foods.filter(function (food) {
    return food.traits.indexOf(section.broad) === -1 &&
      subtypes.some(function (id) { return food.traits.indexOf(id) !== -1; });
  });

  subWithoutBroad.forEach(function (food) {
    faults.push(food.name + " carries a " + section.title +
      " subtype but not " + section.broad);
  });

  const broadWithoutSub = foods.filter(function (food) {
    return food.traits.indexOf(section.broad) !== -1 &&
      !subtypes.some(function (id) { return food.traits.indexOf(id) !== -1; });
  });

  if (broadWithoutSub.length) {
    const reason = ALLOWED_BROAD_ONLY[section.broad];
    const line = broadWithoutSub.length + " food(s) carry " + section.broad +
      " with no subtype: " + broadWithoutSub.map(function (f) { return f.name; }).join(", ");
    if (reason) warnings.push(line + "\n    deliberate — " + reason);
    else faults.push(line);
  }
});

// ---- Report --------------------------------------------------------------
console.log(foods.length + " foods, " + Object.keys(TRAITS).length + " traits");

if (warnings.length) {
  console.log("\nWarnings (" + warnings.length + ")");
  warnings.forEach(function (w) { console.log("  - " + w); });
}

if (faults.length) {
  console.log("\nFaults (" + faults.length + ")");
  faults.forEach(function (f) { console.log("  - " + f); });
  process.exit(1);
}

console.log("\nNo faults.");
