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
whole record; loading one restores every tool. "Clear local data" is a menu
entry like any other (see below), so no page can exist where the data cannot be
removed. Each page that stores anything says so — the old "Nothing here is saved" was true and is not now.

**Comparing meals** — two or more meals with food in them get a side-by-side
table rather than a total: nutrients in grams, helpings for the two traits with
no gram figure, and a row per categorical trait any of them carries. Duplicate a meal, change
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
carries its own list. "Clear local data" is an entry in that same list rather
than something `session.js` appends afterwards — appending only worked while
nothing rewrote the list after it, and then something did.

The three tools are named the same way everywhere:
**Shared traits**, **Meal builder**, **Foods without** — the first had been
"Launch App", which named the button rather than the tool.

**Deploying** — GitHub Pages builds from `master` on merge. If a release does
not appear on the site, check Actions before checking the code: a build that is
cancelled skips the deploy silently, and the run shows it. That happened for
half a day once, on GitHub's side — two builds cancelled at exactly fifteen
minutes, then a rerun that sat queued with no jobs scheduled at all. Reverting
the release did not help and was not the cure; GitHub recovering was.
`.nojekyll` turns the Jekyll step off, which this site has no use for, and
`check-site.js` fails anything sitting at the site root that is not part of the
site — a Playwright screenshot shipped that way once.

**A lot at once** — the meal-level lines, in `MEAL_SIGNALS` in `meal.js`. Not a
nutritional assessment and it must not drift into one: the question is whether a
component arrives in an amount, or at a concentration, the gut is likely to
notice. Two units, two mechanisms — an amount for fat, protein and fiber; a
concentration per 100g of meal for sugar, because osmolality is a property of
the solution. A share prints the amount it came from alongside the ratio — a
ratio does not move when the meal is scaled, and looked like a stuck number
without it. Fat is under both, being hydrophobic. Fat 25g and 15g/100g,
sugars 10g/100g, fiber 10g, protein 60g.

Protein started at 40g and tripped on chicken, rice and carrot; a line that
fires on an ordinary dinner teaches people to skip the section. Nothing is
printed when nothing crosses. The wording exists to stop the numbers reading as
limits — they matter when someone eats well over their usual, and when the gut
is already sensitive, and the tool cannot know anyone's usual.

**Helpings, mostly retired** — every amount-based trait used to be a count of
standard servings of tagged food, in a table. It read as a multiple of the
threshold and was not one: "Fat 2" meant two servings of fat-tagged food, each
at least the dose and possibly far over, so 13g of fat or 80g. Fat, protein,
fiber and alcohol are real grams now, and the bile-stimulating load is derived
in the same table (fat + a fifth of protein, the single-food rule applied to
the plate). Only salicylates and lactose have no gram figure — no table
measures salicylate, and lactose is reported as total sugars — so those two
keep helpings, as a sentence naming the unit with emphasis that climbs with the
count. `IN_GRAMS` in `meal.js` decides which is which. Do not bring the table
back.

**Saved files were unloadable, v1.07 to v1.15** — `save-load.js` built its file
with `Object.assign(envelope, payload)`, and `Session.snapshot()` carries an
`app` key of its own. It overwrote the envelope's `app` identity field, so every
file failed its own check on the way back in: "That file was not saved by this
tool." Nobody had round-tripped a file since the shared session landed. The
payload now sits under `data`, where a key cannot collide with an envelope key.
Do not flatten it back.

**Printing** — `@page` sets the frame: 16mm top, 12mm sides, 22mm bottom, on
every sheet. Before that the only margins were whatever the browser and its
print dialog agreed on, which can be none.

The running footer was `position: fixed`, on the belief that a fixed element
repeats on every printed page. **It does not** — measured by rendering to PDF
and reading the text positions back: page two either had no footer at all or
had it stranded at the top of the sheet, over the text. It is in the flow now
and prints once at the end. A footer that really repeats needs the document
wrapped in a table with a `<tfoot>`, which browsers do repeat; that is the
route if per-sheet identification is ever worth the layout it would cost.

**Wording, checked against ten contrasting meals** — "in 1 of the 1
ingredients", "Five of the five FODMAP types", a tie reported as a ranking
("Alcohol comes from the most ingredients (1), then Carbonation (1)"), whole
sentences starting lowercase, and "an cross-reaction". Also `modifierOf`: a DAO
competitor with no histamine in the meal was reported as a finding, which the
app has always suppressed — nineteen foods can trigger it.

**Water, and the dry-meal line** — `water` is read from the Livsmedelsverket
export like any other nutrient (`tools/lmv-core.js`), kept in the generated file
(`tools/nutrition-core.js`), and used for one signal: a meal under 40g of water
per 100g that also carries 20g of sugars. Osmolality is solutes per unit water,
so dry and sweet are one event, not two — and the pair is what hurts. Dryness
alone is not flagged; a drink alongside clears it.

Deriving water as 100 minus everything else was tried and dropped: within a
couple of grams on most foods, twelve out on raisins, which is the food it
would have been used on. The signal also requires a water figure for *every*
food in the meal, since a food short of one puts weight in the denominator and
no water in the numerator.

All 365 foods carry a water figure. Adding the column immediately exposed two
faults nothing else could see, both of the same kind — dry figures against a
wet portion:

- **Rosehip Soup** was matched to the powder and given a 200g bowl's portion,
  which put 142g of sugar in a serving and earned it a fiber tag. It keeps the
  powder match and carries `madeUp: { parts: 1, water: 8 }`, the packet's own
  recipe; `tools/nutrition-core.js` does the dilution, so the arithmetic sits
  in one place and a changed source figure follows through. A prepared bowl
  holds 1.1g of fiber, so the tag is gone.
- **Instant Soup / Bouillon Cubes** was the mirror of it — "Köttbuljong
  tärning ätf." is the ready-to-eat broth, 98% water, against a 5g cube's
  portion. A teaspoon of stock, counting as nothing. The portion is a 200g mug
  now. That direction cannot be caught by a rule: rocket is 93% water in a 20g
  portion and basil 91% in 2g, and there is nothing wrong with either. It is a
  thing to read the source entry for.
- **Rye** was matched to dry cracked grain and given the 175g cooked-grain
  portion — three times what a plate holds, which is also what had put a
  protein tag on it (5.4g in a real portion, dose 15). The portion is 60g dry
  now, which makes about 175g cooked. Livsmedelsverket lists no cooked rye.

`check-data.js` now fails any food with a portion of 100g or more and under 30g
of water per 100g. Smoked pork belly at 43% is the driest thing that
legitimately reaches that size.

The evidence behind each line in this section is set out one at a time on the
method page, because they are not equally well founded — the osmolality
mechanism is textbook, the dry-meal line is physiology plus clinical
experience and says so.

**Which form a food is in** — `form: "fresh" | "dried" | "dry" | "cooked"` on
63 foods, and `check-data.js` holds the water figure to it. Nearly every data
fault found here has had one shape: the figures describe one state of a food
and the portion describes another. Declaring the state turns that from
something spotted by eye into something the checks catch.

`bothWays: true` marks the foods a shopper has a real choice about, and their
name has to say which — **Basil (fresh)**, **Turmeric (dried)**. Eleven herbs
and spices were renamed. Nutmeg, cinnamon, curry powder and the rest are dried
and nothing else, so they carry the form without the suffix; demanding it there
would be noise on nine foods to catch none.

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
