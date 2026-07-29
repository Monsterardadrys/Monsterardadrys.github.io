# Worklist

## Done

**Livsmedelsverket audit** — closed at v0.65. 298 of 376 foods checked against
the Swedish Food Agency database, 78 confirmed absent, none unmatched. Five
disagreements remain and all are deliberate, each carrying an `lmvNote` that
shows up on `sources.html`: the yoghurt and quark that measure off their label,
dark chocolate's missing fiber, and two soft lactose flags where the sugar is
flavouring rather than lactose.

Re-run it whenever foods are added: open `tools/lmv-audit.html` on a phone and
feed it a fresh export, or `node tools/lmv-audit.js <export.xlsx>`. New foods
land in "to confirm" with three runner-up candidates each; confirmed pairs go in
`tools/lmv-aliases.json`, and anything genuinely missing from the database goes
in `tools/lmv-absent.json` so it stops being offered a bad match.

**Evidence levels** — all 37 traits carry one, on a three-step ladder: well
established (26), limited (7), preliminary (4). Explained on `about.html` and in
the uncertainty article.

## Open

- **The mince grades disagree on `bile_stimulant`.** 10% has it (protein
  20.1 g), 15% does not (19.4 g), 20% does (23.3 g). All three sit either side
  of the 20 g line, so the tag flickers across what is really one food.
- **Dry-Cured Ham** is split into lean and fatty, but the database holds only
  one air-dried ham, so the fatty one is marked absent. Merging them is an
  option.

## Known and expected

- **Roughly 78 foods have no Livsmedelsverket entry** — Roquefort, Fontina,
  za'atar, sumak, kombucha, seitan, most Asian sauces, several mushrooms. Their
  figures come from published nutrition data and clinical literature, and
  `sources.html` says so per food. Not a backlog.
- **Lactose-free milk reports missing lactose** because the database gives total
  sugars, and lactose-free products still contain the glucose and galactose the
  lactose was split into. That is what the soft `*` marker is for.
