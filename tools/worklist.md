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
these). Everything shared lives in one place: `food-picker.js` (the category
boxes and their search, in the app's tick mode and the meal builder's tap-to-add
mode), `trait-foods.js` (the trait picker and the "which foods carry this"
lists), `session.js`, `save-load.js`, `disclaimer.js` and `print.js`. None of
them hardcodes a food, a category or a trait.

**One session across three tools** — `session.js` keeps the app's selection,
every meal and the traits picked in Foods without in this browser's local
storage, so moving between the tools costs nothing. Saving to a file saves the
whole record; loading one restores every tool. "Clear local data" is injected
into every nav drawer from `session.js` rather than written into each page, so
no page can exist where the data cannot be removed. Each page that stores
anything says so — the old "Nothing here is saved" was true and is not now.

**Comparing meals** — two or more meals with food in them get a side-by-side
table rather than a total: nutrients in grams, amount-based traits in servings,
and a row per categorical trait any of them carries. Duplicate a meal, change
one thing, read the difference.

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

**FODMAPs as a threshold** — `fodmap-data.js` holds the largest serving of a
food Monash rates low, and the meal builder uses it to decide whether an
ingredient counts, not how much it counts. Monash rates a serving low, moderate
or high; it publishes no grams of fructan per 100g, so there is nothing to add
up. FODMAPs are therefore reported like every other categorical family, with the
weight deciding which ingredients are in the sentence.

Summing was built first and dropped: dividing grams by the low serving produced
"polyols 6.7" on an ordinary plate, with two decimals, an implied common scale
between subtypes and an implied linearity, none of which a traffic light
supports — and every total was a floor with holes, because the table is partial.
The threshold keeps what the figure can carry and throws away what it cannot.

Named rather than folded in: foods with no low serving at any amount (onion,
garlic) count at any weight; foods with no serving on file count on the tag
alone; a food over its serving counts towards every subtype it carries, which
overstates the one that was not limiting. Stacking is printed as a sentence, not
a number.

**One menu, built in nav.js** — every page used to carry its own copy of the
list and leave itself out of it, and they drifted: Foods without had lost the
Meal builder link, so the only way between two of the three tools was via the
front page. `NAV_LINKS` in `nav.js` is the list now, the page you are on is
marked rather than removed, and a page's drawer holds an empty `<ul>`.
`check-site.js` fails a published page that is missing from the menu or that
carries its own list. The three tools are named the same way everywhere:
**Shared traits**, **Meal builder**, **Foods without** — the first had been
"Launch App", which named the button rather than the tool.

## Open

- **The FODMAP serving table is partial and unverified.** 50 foods have a
  serving, 49 of the 131 FODMAP foods that can go in a meal. Every figure was
  typed in from the Monash app and none has been checked against the current
  version — serving sizes are revised as foods are re-tested. Monash publishes
  no export, so this will always be hand-entered. Checked in the app: cauliflower
  is fructans, as we had it. Asparagus was not — it is excess fructose, and the
  tag has been corrected.
- **107 foods still have no figures**, so they cannot go in a meal. The source
  ladder is decided and short — Frida (DK), then USDA SR Legacy, then Ciqual
  for the European cheeses — and `nutrition-manual.js` is where entries go, one
  per food with `src` and a verbatim `ref`. Nobody has downloaded those tables
  yet. Roughly fifteen of the 107 (the vegan cheeses, protein bars, kombucha)
  are branded products no national table analyses; they will stay without.
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
