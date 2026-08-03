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

**Two method pages** — `about.html#methodology` is the short one, written for a
first-time reader with no history. `method.html` is the working one. A rule
change belongs in both.

## Open

- **The audit has not been re-run since the doses changed.** v0.89 and v0.90
  moved fat and fiber to 6.1g, corrected eight portions and retagged about 45
  foods — but from figures recovered out of earlier reports, not from a fresh
  run. Roughly 28 of the foods still carrying `fiber` have never been checked
  against a per-portion dose at all. One run settles it.
- **Allergens.** The broad "Big 9" trait does little now that all nine specific
  allergens exist alongside it, and the list is American rather than European.
  Worth replacing with the EU-14 plus the non-labelled allergies that come up in
  practice — onion and mushroom.

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
