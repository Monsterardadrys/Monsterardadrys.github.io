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
     - the amount-based tags against nutrition-data.js. This is the audit's
       own arithmetic, and now that the figures live in the repo it runs
       without the Livsmedelsverket export in hand — so a portion or a dose
       can be changed and checked in the same sitting. It only covers the
       365 foods with figures; the audit is still what checks the matching.
   ========================================================================= */

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const source = fs.readFileSync(path.join(root, "foods-data.js"), "utf8");
const { TRAITS, CATEGORIES, FILTER_SECTIONS } =
  new Function(source + "; return { TRAITS, CATEGORIES, FILTER_SECTIONS };")();

const { NUTRITION } = new Function(
  fs.readFileSync(path.join(root, "nutrition-data.js"), "utf8") + "; return { NUTRITION };")();

// Read straight out of lmv-core.js so there is one place a dose is set.
const coreSource = fs.readFileSync(path.join(__dirname, "lmv-core.js"), "utf8");
const DOSE = {};
(coreSource.match(/const DOSE = \{([\s\S]*?)\};/) || ["", ""])[1]
  .replace(/(\w+):\s*([\d.]+)/g, function (_, k, v) { DOSE[k] = Number(v); return ""; });
const PROTEIN_WEIGHT = Number(
  (coreSource.match(/const PROTEIN_WEIGHT = ([\d.]+)/) || [])[1] || 0.2);

// Broad traits that legitimately stand alone, and why.
const ALLOWED_BROAD_ONLY = {
  irritant: "isothiocyanates, piperine, menthol and plain acidity are irritant " +
    "mechanisms with no subtype of their own",
  cross_reactive: "ragweed cross-reactivity has no pollen subtype here"
};

/* Deliberate departures from what the numbers alone would say, read out of
   lmv-core.js so the audit and this check cannot disagree about which ones
   are intended. Each is argued in tools/worklist.md and on the method page. */
const DOSE_EXCEPTIONS = require("./lmv-core.js").DELIBERATE;

/* Denmark's confirmed matches, if a round has been run. Read here rather than
   where the rule sits, because the madeUp check needs it too — a recipe can
   now be applied to figures from either table. */
const ciqualAliasPath = path.join(__dirname, "ciqual-aliases.json");
const ciqualAliases = {};
if (fs.existsSync(ciqualAliasPath)) {
  const raw = JSON.parse(fs.readFileSync(ciqualAliasPath, "utf8"));
  Object.keys(raw).forEach(function (k) { if (k[0] !== "_") ciqualAliases[k] = raw[k]; });
}

const ciqualDeclinedPath = path.join(__dirname, "ciqual-declined.json");
const ciqualDeclined = {};
if (fs.existsSync(ciqualDeclinedPath)) {
  const raw = JSON.parse(fs.readFileSync(ciqualDeclinedPath, "utf8"));
  Object.keys(raw).forEach(function (k) { if (k[0] !== "_") ciqualDeclined[k] = raw[k]; });
}

const usdaAliasPath = path.join(__dirname, "usda-aliases.json");
const usdaAliases = {};
if (fs.existsSync(usdaAliasPath)) {
  const raw = JSON.parse(fs.readFileSync(usdaAliasPath, "utf8"));
  Object.keys(raw).forEach(function (k) { if (k[0] !== "_") usdaAliases[k] = raw[k]; });
}

const usdaDeclinedPath = path.join(__dirname, "usda-declined.json");
const usdaDeclined = {};
if (fs.existsSync(usdaDeclinedPath)) {
  const raw = JSON.parse(fs.readFileSync(usdaDeclinedPath, "utf8"));
  Object.keys(raw).forEach(function (k) { if (k[0] !== "_") usdaDeclined[k] = raw[k]; });
}

/* The foods a source matched and we then turned down because the figures
   were too thin to be worth carrying. They are settled, not pending, so
   they must not be reported as work left to do. Each generated file
   declares its own list; collect them all. */
const refused = {};
fs.readdirSync(root).filter(function (f) {
  return /^nutrition-.*\.js$/.test(f);
}).forEach(function (f) {
  const text = fs.readFileSync(path.join(root, f), "utf8");
  const decl = /const NUTRITION_\w+_REFUSED = \[([\s\S]*?)\];/.exec(text);
  if (!decl) return;
  (decl[1].match(/"([^"]+)"/g) || []).forEach(function (q) {
    refused[q.slice(1, -1)] = f;
  });
});

const fridaAliasPath = path.join(__dirname, "frida-aliases.json");
const fridaAliases = {};
if (fs.existsSync(fridaAliasPath)) {
  const raw = JSON.parse(fs.readFileSync(fridaAliasPath, "utf8"));
  Object.keys(raw).forEach(function (k) { if (k[0] !== "_") fridaAliases[k] = raw[k]; });
}

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

// ---- Amount-based tags against the figures --------------------------------
/* One entry per trait that is measured rather than classified. `soft` marks
   the lactose one: the database reports total sugars, so a mismatch there is
   worth a look but is not by itself wrong — lactose-free dairy still carries
   the glucose and galactose the lactose was split into. */
const DOSE_TRAITS = [
  { trait: "over_10g_fat", dose: DOSE.fat, fatBased: true, of: function (n) { return n.fat; } },
  { trait: "protein", dose: DOSE.protein, of: function (n) { return n.protein; } },
  { trait: "fiber", dose: DOSE.fiber, of: function (n) { return n.fiber; } },
  /* Gated on allergen_milk, exactly as the audit gates it: the database
     reports total sugars, and the sugar in an apple is not lactose. */
  {
    /* The real lactose column where the source has one, total sugars where it
       does not. Livsmedelsverket reports only sugars, so a Swedish dairy food
       is still checked against a figure that counts every sugar in it — which
       is why the marker stays soft there and why lactose-free milk reads as
       full of lactose. Frida, Ciqual and USDA all publish lactose on its own,
       and where they do the answer is exact and says so. */
    trait: "over_3g_lactose", dose: DOSE.sugars, requires: "allergen_milk",
    soft: function (n) { return n.lactose == null; },
    of: function (n) { return n.lactose != null ? n.lactose : n.sugars; }
  },
  {
    trait: "bile_stimulant", dose: DOSE.bile, fatBased: true,
    of: function (n) { return (n.fat || 0) + PROTEIN_WEIGHT * (n.protein || 0); }
  }
];

let checkedAgainstFigures = 0;

foods.forEach(function (food) {
  const n = NUTRITION[food.name];
  if (!n) return;
  checkedAgainstFigures += 1;

  DOSE_TRAITS.forEach(function (rule) {
    if (rule.dose == null) return;
    if (rule.requires && food.traits.indexOf(rule.requires) === -1) return;
    /* A seed swallowed intact keeps its fat inside the shell, so the figure
       for the seed overstates what reaches the gut. Fiber still applies —
       that is the whole point of eating it. See wholeSeed in foods-data.js. */
    if (food.wholeSeed && rule.fatBased) return;
    const per100g = rule.of(n);
    if (per100g == null) return;

    const inPortion = Math.round(per100g * food.portion) / 100;
    const tagged = food.traits.indexOf(rule.trait) !== -1;
    const qualifies = inPortion >= rule.dose;
    if (tagged === qualifies) return;

    const why = DOSE_EXCEPTIONS[food.name + "|" + rule.trait];
    const line = food.name + " " + (tagged ? "carries" : "does not carry") + " " +
      rule.trait + " — " + inPortion + "g in a " + food.portion + "g portion, dose " + rule.dose;

    if (why) warnings.push(line + "\n    deliberate — " + why);
    else if (typeof rule.soft === "function" ? rule.soft(n) : rule.soft) {
      warnings.push(line + "\n    soft — the figure is total sugars, not lactose");
    }
    else faults.push(line);
  });
});

/* ---- Dry figures against a wet portion -------------------------------------
   A food matched to the dry or powdered form of itself, but carrying the
   portion of the cooked or made-up form, is wrong by whatever it lost in the
   drying — several times over, not a few percent. Nothing caught it until the
   water column arrived: rosehip soup powder against a 200g bowl put 142g of
   sugar in a serving, and cracked rye against a cooked-grain portion was out
   by three.

   A portion of 100g or more is a cooked dish, a drink or a whole vegetable.
   None of those is nearly waterless. Smoked pork belly at 43% is the driest
   thing that legitimately reaches that size, so the line sits below it. */
const WET_PORTION = 100;
const DRY_ENOUGH = 30;

/* ---- The form a food is in, declared rather than guessed --------------------
   The fault above is always the same underneath: the figures describe one
   state of a food and the portion describes another. A food can say which
   state it is in, and then the water settles it — dried basil is not fresh
   basil at a tenth the weight, and cooked rice is not rice.

     fresh   as picked, and wet          — herbs, produce
     dried   the dried version of something that also comes fresh
     dry     a dry pantry staple, eaten after cooking or as an ingredient
     cooked  made up with water and heat, as eaten

   `form` is optional: an apple has one state and needs no field. Where it is
   given it is checked, and where the name would otherwise be ambiguous — the
   herb shelf has both — it has to be in the name too, because a shopper
   reading the list is the person who has to tell them apart. */
const FORM_WATER = {
  fresh:  { min: 60, is: "wet, as picked" },
  dried:  { max: 25, is: "dried" },
  dry:    { max: 25, is: "a dry staple" },
  cooked: { min: 45, is: "made up with water" }
};

/* Only where both are genuinely on the shelf. Nobody buys fresh nutmeg or
   dried-versus-fresh curry powder, and demanding "(dried)" on those would be
   noise on nine foods to catch none. `bothWays` is the editorial judgement
   that a shopper has a choice to make. */

foods.forEach(function (food) {
  if (!food.form) return;
  const rule = FORM_WATER[food.form];
  if (!rule) {
    faults.push(food.name + ' has form "' + food.form + '", which is not one of ' +
      Object.keys(FORM_WATER).join(", "));
    return;
  }
  if (food.bothWays && food.name.toLowerCase().indexOf("(" + food.form + ")") === -1) {
    faults.push(food.name + ' is ' + food.form + ' and sold both ways, but does not ' +
      'say which in its name — the list is what someone reads in a shop');
  }
  const n = NUTRITION[food.name];
  if (!n || n.water == null) return;
  if (rule.min != null && n.water < rule.min) {
    faults.push(food.name + ' is marked ' + food.form + ' (' + rule.is + ') but holds ' +
      n.water + 'g of water per 100g');
  }
  if (rule.max != null && n.water > rule.max) {
    faults.push(food.name + ' is marked ' + food.form + ' (' + rule.is + ') but holds ' +
      n.water + 'g of water per 100g');
  }
});

/* The mirror case — figures for the made-up form against the portion of the
   dry one — is just as wrong and cannot be caught this way. Beef bouillon at
   98% water on a 5g portion was one, but so is every fresh herb, leaf and
   vinegar: rocket is 93% water and a portion is 20g, basil 91% and 2g. There
   is no line between them, because there is nothing wrong with those. That one
   was found by reading the source entry — "ätf.", ready to eat — and it stays
   a thing to read for rather than a rule that cries wolf. */

foods.forEach(function (food) {
  const n = NUTRITION[food.name];
  if (!n || n.water == null) return;
  if (food.portion < WET_PORTION || n.water >= DRY_ENOUGH) return;
  faults.push(food.name + " has a " + food.portion + "g portion but only " + n.water +
    "g of water per 100g — the figures look like the dry form of a food served wet" +
    (food.lmv ? " (matched to \"" + food.lmv + "\")" : "") +
    ". If it is made up from a mix, give it a recipe: madeUp: { parts, water }");
});

/* A recipe has to be a recipe, and it must not be applied to figures that are
   already made up — that would dilute a bowl of soup a second time. */
foods.forEach(function (food) {
  const made = food.madeUp;
  if (!made) return;
  if (!(made.parts > 0) || !(made.water > 0)) {
    faults.push(food.name + " has a madeUp recipe that is not parts and water");
    return;
  }
  /* A source can now be Swedish or Danish, so the recipe is checked against
     whether figures actually arrived rather than against the `lmv` field
     alone. A food still waiting for a match is a normal state to sit in. */
  if (!NUTRITION[food.name]) {
    warnings.push(food.name + " has a madeUp recipe and no figures yet — " +
      "the recipe applies once it is matched to a source");
  } else if (!food.lmv && !fridaAliases[food.name]) {
    faults.push(food.name + " has figures and a madeUp recipe but no source entry " +
      "naming where the figures came from");
  }
  const n = NUTRITION[food.name];
  if (n && n.water != null && n.water < (made.water / (made.parts + made.water)) * 90) {
    faults.push(food.name + " is made up 1:" + (made.water / made.parts) +
      " but its figures hold only " + n.water + "g of water per 100g — " +
      "the dilution looks as though it has not been applied");
  }
});

/* ---- The FODMAP serving table ---------------------------------------------
   fodmap-data.js is hand-entered, so the two ways it can rot are a food that
   has been renamed out from under it and a serving on a food that carries no
   FODMAP tag. Coverage is reported as a count rather than a fault: the table
   is meant to be partial, and the meal builder says which foods it could not
   take. */
const { FODMAP_SERVES, FODMAP_SOURCES } = new Function(
  fs.readFileSync(path.join(root, "fodmap-data.js"), "utf8") +
  "; return { FODMAP_SERVES, FODMAP_SOURCES };")();

const byName = {};
foods.forEach(function (food) { byName[food.name] = food; });

const FODMAP_TYPE_IDS = Object.keys(TRAITS).filter(function (id) {
  return TRAITS[id].group === "FODMAPs";
});

function carriesFodmap(food) {
  return food.traits.indexOf("fodmaps") !== -1 ||
    FODMAP_TYPE_IDS.some(function (id) { return food.traits.indexOf(id) !== -1; });
}

Object.keys(FODMAP_SERVES).forEach(function (name) {
  const entry = FODMAP_SERVES[name];
  const food = byName[name];
  if (!food) {
    faults.push("fodmap-data.js holds a serving for \"" + name + "\", which is not a food");
    return;
  }
  if (!carriesFodmap(food)) {
    faults.push(name + " has a low-FODMAP serving but carries no FODMAP trait");
  }
  if (typeof entry.low !== "number" || entry.low < 0) {
    faults.push(name + " has a low-FODMAP serving that is not a number of grams");
  }
  if (!entry.src || !FODMAP_SOURCES[entry.src]) {
    faults.push(name + " has a low-FODMAP serving with no known source");
  }
});

/* ---- The audit's two memories against the food data ---------------------

   lmv-aliases.json says "this food is that database entry"; lmv-absent.json
   says "this food is in no entry"; and foods-data.js carries the published
   claim in `lmv`, which is what sources.html shows. Three places, one
   question — so they can disagree, and did: five foods sat on both lists at
   once and six confirmed matches were never written back, so the site said
   "not in the database" about foods the audit had already matched. */
const aliases = JSON.parse(
  fs.readFileSync(path.join(__dirname, "lmv-aliases.json"), "utf8"));
const absentList = JSON.parse(
  fs.readFileSync(path.join(__dirname, "lmv-absent.json"), "utf8"));

function entries(o) { return Object.keys(o).filter(function (k) { return k[0] !== "_"; }); }

entries(aliases).forEach(function (name) {
  const food = byName[name];
  if (!food) {
    faults.push("lmv-aliases.json confirms \"" + name + "\", which is not a food");
    return;
  }
  if (absentList[name]) {
    faults.push(name + " is both confirmed in lmv-aliases.json and listed absent");
  }
  if (!food.lmv) {
    faults.push(name + " is confirmed as \"" + aliases[name] +
      "\" but carries no lmv entry name, so sources.html calls it unlisted");
  } else if (food.lmv !== aliases[name]) {
    faults.push(name + " carries lmv \"" + food.lmv +
      "\" but lmv-aliases.json confirms \"" + aliases[name] + "\"");
  }
});

/* A confirmed match whose figures have not been built yet. Harmless in
   itself, but it is the state six foods sat in unnoticed once, matched on
   paper and missing from every meal — so it gets said out loud.

   A refused food looks identical from here — matched, no figures — but no
   rebuild will ever fill it, so it is separated out and reported as the
   settled decision it is. */
const pendingBuild = entries(aliases).filter(function (name) {
  return byName[name] && !NUTRITION[name];
}).concat(entries(fridaAliases).filter(function (name) {
  return byName[name] && !NUTRITION[name];
})).concat(entries(ciqualAliases).filter(function (name) {
  return byName[name] && !NUTRITION[name];
})).concat(entries(usdaAliases).filter(function (name) {
  return byName[name] && !NUTRITION[name];
}));

const stillPending = pendingBuild.filter(function (name) { return !refused[name]; });
const wasRefused = pendingBuild.filter(function (name) { return refused[name]; });

if (stillPending.length) {
  warnings.push(stillPending.length + " food(s) are matched but have no figures yet — " +
    "rebuild nutrition-data.js: " + stillPending.join(", "));
}

if (wasRefused.length) {
  warnings.push(wasRefused.length + " food(s) are matched but deliberately left without " +
    "figures — the match was right, the figures too thin: " + wasRefused.join(", "));
}

entries(absentList).forEach(function (name) {
  const food = byName[name];
  if (!food) {
    faults.push("lmv-absent.json lists \"" + name + "\", which is not a food");
  } else if (food.lmv) {
    faults.push(name + " is listed absent but carries lmv \"" + food.lmv + "\"");
  }
});

/* A food in neither list is where every new food starts: it has not been
   through an audit round yet. That is a normal state to add a food in, so it
   is a warning — the faults above are for the three files contradicting each
   other, which is never normal. */
foods.forEach(function (food) {
  if (!aliases[food.name] && !absentList[food.name]) {
    warnings.push(food.name + " is neither confirmed nor listed absent — no audit has seen it yet");
  }
});

/* Denmark's Frida is the second source on the ladder and is only ever asked
   about foods Livsmedelsverket has no entry for. A confirmed Danish match for
   a food that already has a Swedish one is dead weight at best and a second
   opinion nobody reads at worst. */
  entries(fridaAliases).forEach(function (name) {
    const food = byName[name];
    if (!food) {
      faults.push("frida-aliases.json confirms \"" + name + "\", which is not a food");
    } else if (food.lmv) {
      faults.push(name + " has a Danish match but already carries Livsmedelsverket's \"" +
        food.lmv + "\" — Frida is only for the foods with no Swedish entry");
    }
  });

/* USDA is third on the ladder and is only ever asked about foods neither of
   the two above it covers. A confirmed American match for a food that already
   has a Swedish or a Danish one is dead weight — and it is the shape the wrong
   audit order produces, so it is worth failing on rather than tidying later.

   This is the same rule Frida carries one rung up. It exists because the audit
   pages can only offer what had no figures at the last build: run them out of
   order and a food Denmark covers gets confirmed against America instead. */
entries(usdaAliases).forEach(function (name) {
  const food = byName[name];
  if (!food) {
    faults.push("usda-aliases.json confirms \"" + name + "\", which is not a food");
  } else if (food.lmv) {
    faults.push(name + " has an American match but already carries Livsmedelsverket's \"" +
      food.lmv + "\" — USDA is only for the foods no table above it has");
  } else if (fridaAliases[name]) {
    faults.push(name + " has both a Danish and an American match — Denmark is above " +
      "America on the ladder, so the American one is dead weight. Drop it from " +
      "usda-aliases.json.");
  } else if (ciqualAliases[name]) {
    faults.push(name + " has both a French and an American match — France is above " +
      "America on the ladder, so the American one is dead weight. Drop it from " +
      "usda-aliases.json.");
  }
});

/* Ciqual is third, between Denmark and America, and the same rule applies one
   rung up: it is only ever asked about foods neither table above it covers. */
entries(ciqualAliases).forEach(function (name) {
  const food = byName[name];
  if (!food) {
    faults.push("ciqual-aliases.json confirms \"" + name + "\", which is not a food");
  } else if (food.lmv) {
    faults.push(name + " has a French match but already carries Livsmedelsverket's \"" +
      food.lmv + "\" — Ciqual is only for the foods no table above it has");
  } else if (fridaAliases[name]) {
    faults.push(name + " has both a Danish and a French match — Denmark is above France " +
      "on the ladder, so the French one is dead weight. Drop it from ciqual-aliases.json.");
  }
});

entries(ciqualDeclined).forEach(function (name) {
  if (!byName[name]) {
    faults.push("ciqual-declined.json names \"" + name + "\", which is not a food");
  } else if (ciqualAliases[name]) {
    faults.push(name + " is in both ciqual-aliases.json and ciqual-declined.json — " +
      "a match is either confirmed or declined, not both");
  }
});

/* The backbone rule is written down in two readers, so it is checked here
   rather than trusted. Same shape as DOSE moving into lmv-core.js: when one
   fact is written twice, write the check that makes them equal. */
(function () {
  const a = require("./usda-core.js").REQUIRED.slice().sort().join(",");
  const b = require("./ciqual-core.js").REQUIRED.slice().sort().join(",");
  if (a !== b) {
    faults.push("REQUIRED disagrees between the readers — usda-core.js says [" + a +
      "] and ciqual-core.js says [" + b + "]. A food kept by one and refused by the " +
      "other is the ladder contradicting itself.");
  }
})();

/* A declined American match is a decision written down so it is not made
   again — the counterpart of lmv-absent.json. It only means anything while it
   contradicts nothing: a food cannot be both confirmed and declined, and
   declining a name that is not a food is a leftover from a rename. */
entries(usdaDeclined).forEach(function (name) {
  if (!byName[name]) {
    faults.push("usda-declined.json names \"" + name + "\", which is not a food");
  } else if (usdaAliases[name]) {
    faults.push(name + " is in both usda-aliases.json and usda-declined.json — " +
      "a match is either confirmed or declined, not both");
  }
});

const fodmapFoods = foods.filter(carriesFodmap);
const withServe = fodmapFoods.filter(function (f) { return FODMAP_SERVES[f.name]; });
const inMeals = fodmapFoods.filter(function (f) { return NUTRITION[f.name]; });
const inMealsWithServe = inMeals.filter(function (f) { return FODMAP_SERVES[f.name]; });

// ---- Report --------------------------------------------------------------
console.log(foods.length + " foods, " + Object.keys(TRAITS).length + " traits, " +
  checkedAgainstFigures + " checked against nutrition-data.js");
console.log(fodmapFoods.length + " FODMAP foods, " + withServe.length +
  " with a low-FODMAP serving (" + inMealsWithServe.length + " of the " +
  inMeals.length + " that can go in a meal)");

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
