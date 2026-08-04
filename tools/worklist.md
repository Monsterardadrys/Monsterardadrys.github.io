# Worklist

474 foods · 43 traits · 365 checked against Livsmedelsverket, 109 with no entry
there.

Before a release: `node tools/check-data.js && node tools/check-site.js`.

## Done

**Livsmedelsverket audit** — 365 of 474 foods checked against the Swedish Food
Agency database, 109 confirmed absent, none unmatched. Each verified food
carries its entry name in `lmv`, and departures carry an `lmvNote`; both show on
`sources.html`.

Re-run it whenever foods, portions or doses change: open `tools/lmv-audit.html`
on a phone and feed it a fresh export, or `node tools/lmv-audit.js <export.xlsx>`.
New foods land in "to confirm" with three runner-up candidates each; confirmed
pairs go in `tools/lmv-aliases.json`, and anything genuinely missing from the
database goes in `tools/lmv-absent.json`.

**Evidence levels** — every trait carries one, on a three-step ladder: well
established (29), limited (10), preliminary (4).

**Portions and doses** — every food carries a typical serving in grams, set per
food group, seventeen sizes in all. Threshold traits are a dose in one portion
rather than a figure per 100g: fat 6.1g, fiber 6.1g, protein 15g, lactose 5g,
bile 9.5g of fat counting protein at a fifth of its weight. Alcohol stays a
concentration. Tuning behaviour is a change to `DOSE` in `tools/lmv-core.js`.

**Allergens** — thirteen of the EU's fourteen declarable allergens plus
onion/garlic and mushroom: fourteen traits with no broad umbrella above them.
Crustaceans and molluscs are separate, and `allergen_wheat` covers every gluten
cereal, so oats, rye and barley products carry it too. Sulphites are declarable
under the same rule but are a preservative, not a protein, so they sit with the
other digestive factors. Lupin is deliberately absent: declarable, but not a
Swedish food.

**Cross-reactivity** — four pollen groups: birch, mugwort, grass, latex. Mugwort
is the one most often missed here, because it flowers late and the foods it
involves are spices.

**Two method pages** — `about.html#methodology` is the short one, written for a
first-time reader with no history. `method.html` is the working one. A rule
change belongs in both.

**Three tools, one data file** — the app (what do these foods share), the meal
builder (what is this meal loaded with) and Foods without (what carries none of
these). All three build their food lists and trait pickers from `foods-data.js`;
the shared pieces are `trait-foods.js` (lists and the trait picker),
`disclaimer.js` and `save-load.js`.

**Save and load** — the app saves a selection, the meal builder saves meals,
both as JSON files on the user's own device. Every file carries
`{ app, tool, version }` so one tool cannot open another's file.

**Checks that used to be done by eye** — `tools/check-data.js` for the food data
(unknown traits, missing portions, umbrella/subtype consistency) and
`tools/check-site.js` for the site (version stamps, service-worker coverage,
every link and anchor, the scripts each page needs, and the numbers quoted in
About and the method page against the code). Each exits non-zero on a fault.

**Nutrition per 100g** — `node tools/build-nutrition.js <export>` writes
`nutrition-data.js` from a Livsmedelsverket export, using the same confirmed
matches as the audit. Generated: never hand-edit it. The meal builder totals a
meal in grams from it and says how much of the meal the figures cover.

## Open

- **`nutrition-data.js` is empty until the generator is run**, because the
  export is not in the repo. Until then the meal builder counts servings, which
  is what it did before. One command settles it.
- **The 109 foods with no Livsmedelsverket entry will still have no figures**
  once it has been run. They need published values entered by hand with a source
  per food, which means a second curated file the generator merges rather than
  overwrites — `nutrition-data.js` must stay purely generated.
- **FODMAP dose in a meal** is deliberately not attempted yet. Monash publishes
  per-serving thresholds, the one categorical trait where a dose is established.
  Next step after nutrient values land.
- **Meal-level thresholds are not set.** A normal mixed meal holds 20–30g of
  fat, so the single-food doses cannot be reused as they are: the unit of
  analysis is different, not more lenient.
- **The audit has not been re-run since the allergen rework.** Nothing since has
  touched a nutrient threshold or a portion, so a run should come back clean —
  but 24 foods gained a mugwort tag and the umbrella fixes touched 30 more.

## Known and expected

- **109 foods have no Livsmedelsverket entry** — Roquefort, Fontina, za'atar,
  sumak, kombucha, seitan, most Asian sauces, the vegan cheeses and yoghurts.
  Their figures come from published nutrition data and clinical literature, and
  `sources.html` says so per food. Not a backlog.
- **Lactose-free dairy reports missing lactose** because the database gives
  total sugars, and lactose-free products still contain the glucose and
  galactose the lactose was split into. That is what the soft `*` marker is for.
- **Three deliberate departures**: turmeric carries `bile_stimulant` on its own
  evidence, dark chocolate's fiber figure is a gap in the source, and the
  cinnamon bun's sugar is sucrose rather than lactose.
- **Seventeen foods carry `irritant` with no subtype.** Isothiocyanates,
  piperine, menthol and plain acidity are irritant mechanisms with no subtype of
  their own. `check-data.js` reports these as a warning with the reason recorded.
