# Worklist

472 foods · 43 traits · 365 with nutrient figures, 107 without.

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
(unknown traits, missing portions, umbrella/subtype consistency, and every
amount-based tag against `nutrition-data.js` — the audit's own arithmetic,
running without the export in hand) and
`tools/check-site.js` for the site (version stamps, service-worker coverage,
every link and anchor, the scripts each page needs, and the numbers quoted in
About and the method page against the code). Each exits non-zero on a fault.

**Nutrition per 100g** — 365 foods carry fat, protein, carbohydrate, fiber,
sugars and alcohol per 100g, each recording its `src`. Livsmedelsverket for
all of them so far; `nutrition-manual.js` holds hand-entered figures for the
foods it does not cover, and the builder merges the two with Livsmedelsverket
winning. Only foods with figures can go in a meal — see meal.js. Rebuilt from the same
Livsmedelsverket export the audit takes, matched through the same confirmed
list. Two front ends over one `tools/nutrition-core.js`, so they cannot produce
different files: `tools/build-nutrition.html` on a phone (download the result
into the project root) or `node tools/build-nutrition.js <export>`. Generated:
never hand-edit it. The meal builder totals a meal in grams from it and says
how much of the meal the figures cover.

## Open

- **107 foods still have no figures**, so they cannot go in a meal. The source
  ladder is decided and short — Frida (DK), then USDA SR Legacy, then Ciqual
  for the European cheeses — and `nutrition-manual.js` is where entries go, one
  per food with `src` and a verbatim `ref`. Nobody has downloaded those tables
  yet. Roughly fifteen of the 107 (the vegan cheeses, protein bars, kombucha)
  are branded products no national table analyses; they will stay without.
- **FODMAP dose in a meal** is deliberately not attempted yet. Monash publishes
  per-serving thresholds, the one categorical trait where a dose is established.
  Next step after nutrient values land.
- **Meal-level thresholds are not set.** A normal mixed meal holds 20–30g of
  fat, so the single-food doses cannot be reused as they are: the unit of
  analysis is different, not more lenient.

## Known and expected

- **107 foods have no Livsmedelsverket entry** — Roquefort, Fontina, za'atar,
  sumak, kombucha, seitan, most Asian sauces, the vegan cheeses and yoghurts.
  Their figures come from published nutrition data and clinical literature, and
  `sources.html` says so per food. Not a backlog.
- **Lactose-free dairy reports missing lactose** because the database gives
  total sugars, and lactose-free products still contain the glucose and
  galactose the lactose was split into. That is what the soft `*` marker is for.
- **Pure additives are deliberately not in the database.** Erythritol and pea
  protein powder were removed: an isolate is not a food, and its trait list
  either says nothing or says one thing that is true by definition. Whey
  protein stays — it carries milk allergen and lactose, which is real clinical
  information. Flours, brans, psyllium, starches and yeast extract stay: pantry
  items, and psyllium is a first-line IBS intervention.
- **Three deliberate departures**: turmeric carries `bile_stimulant` on its own
  evidence, dark chocolate's fiber figure is a gap in the source, and the
  cinnamon bun's sugar is sucrose rather than lactose.
- **Seventeen foods carry `irritant` with no subtype.** Isothiocyanates,
  piperine, menthol and plain acidity are irritant mechanisms with no subtype of
  their own. `check-data.js` reports these as a warning with the reason recorded.
