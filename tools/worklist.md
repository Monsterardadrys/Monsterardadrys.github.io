# Worklist

## Done

**Livsmedelsverket audit** — 365 of 475 foods checked against the Swedish Food
Agency database, 110 confirmed absent, none unmatched. Each verified food
carries its entry name in `lmv`, and departures carry an `lmvNote`; both show on
`sources.html`.

Re-run it whenever foods, portions or doses change: open `tools/lmv-audit.html`
on a phone and feed it a fresh export, or `node tools/lmv-audit.js <export.xlsx>`.
New foods land in "to confirm" with three runner-up candidates each; confirmed
pairs go in `tools/lmv-aliases.json`, and anything genuinely missing from the
database goes in `tools/lmv-absent.json`.

**Evidence levels** — all 37 traits carry one, on a three-step ladder: well
established (26), limited (7), preliminary (4).

**Portions and doses** — every food carries a typical serving in grams, set per
food group, seventeen sizes in all. Threshold traits are a dose in one portion
rather than a figure per 100g: fat 6.1g, fiber 6.1g, protein 15g, lactose 5g,
bile 9.5g of fat counting protein at a fifth of its weight. Alcohol stays a
concentration. Tuning behaviour is a change to `DOSE` in `tools/lmv-core.js`.

**Allergens** — thirteen of the EU's fourteen declarable allergens plus
onion/garlic and mushroom, fourteen traits with no broad umbrella above them.
Sulphites are declarable under the same rule but are a preservative, not a
protein, so they sit with the other digestive factors.
Crustaceans and molluscs are separate, and `allergen_wheat` covers every gluten
cereal, so oats, rye and barley products carry it too. Lupin is deliberately
absent: declarable, but not a Swedish food.

**Two method pages** — `about.html#methodology` is the short one, written for a
first-time reader with no history. `method.html` is the working one. A rule
change belongs in both.

**Three tools, one data file** — the app (what do these foods share), the
meal builder (what is this meal loaded with) and Foods without (what carries
none of these). All three build their food lists and trait pickers from
`foods-data.js`; the shared pieces are `trait-foods.js` (lists and the trait
picker), `disclaimer.js` and `save-load.js`.

**Save and load** — the app saves a selection, the meal builder saves meals,
both as JSON files on the user's own device. Every file carries
`{ app, tool, version }` so one tool cannot open another's file.

## Open

- **The meal builder counts servings, not grams.** `foods-data.js` holds each
  food's traits and serving size but no nutrient values, so a meal cannot be
  totalled in grams of fat or fiber. Until it can, "Fat 3.4" means 3.4 standard
  servings' worth of fat-tagged food. Real totals need per-100g figures on
  every food — the same numbers the audit reads out of the Livsmedelsverket
  export, so the data exists, it is just not in the repo.
- **FODMAP dose in a meal** is deliberately not attempted yet. Monash publishes
  per-serving thresholds, which is the one categorical trait where a dose is
  established; that is the next step after nutrient values land.
- **Meal-level thresholds are not set.** A normal mixed meal holds 20–30g of
  fat, so the single-food doses cannot be reused as they are — the unit of
  analysis is different, not more lenient.

- **Re-run the audit after the allergen rework.** The last run (v0.92) came back
  with six disagreements, four of which were applied; the two left are the
  documented exceptions. Nothing since then has touched a nutrient threshold or
  a portion, so a run should come back clean.

## Known and expected

- **110 foods have no Livsmedelsverket entry** — Roquefort, Fontina, za'atar,
  sumak, kombucha, seitan, most Asian sauces, the vegan cheeses and yoghurts.
  Their figures come from published nutrition data and clinical literature, and
  `sources.html` says so per food. Not a backlog.
- **Lactose-free dairy reports missing lactose** because the database gives
  total sugars, and lactose-free products still contain the glucose and
  galactose the lactose was split into. That is what the soft `*` marker is for.
- **Three deliberate departures**: turmeric carries `bile_stimulant` on its own
  evidence, dark chocolate's fiber figure is a gap in the source, and the
  cinnamon bun's sugar is sucrose rather than lactose.
