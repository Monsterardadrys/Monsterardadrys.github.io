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

**Allergens** — the EU's 14 declarable allergens plus onion/garlic and
mushroom, sixteen traits with no broad umbrella above them. Crustaceans and
molluscs are separate, and `allergen_wheat` covers every gluten cereal, so
oats, rye and barley products carry it too.

**Two method pages** — `about.html#methodology` is the short one, written for a
first-time reader with no history. `method.html` is the working one. A rule
change belongs in both.

## Open

- **Re-run the audit after the allergen rework.** The last run (v0.92) came back
  with six disagreements, four of which were applied; the two left are the
  documented exceptions. Nothing since then has touched a nutrient threshold,
  but Lupin Flour is new.
- **Lupin Flour has never been checked against Livsmedelsverket.** It was added
  so that `allergen_lupin` has a food at all. The next audit will put it in "to
  confirm"; if the database has no entry, it belongs in `lmv-absent.json`.

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
