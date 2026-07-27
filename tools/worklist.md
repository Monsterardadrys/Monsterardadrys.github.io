# Open questions from the Livsmedelsverket audit

The hand-lookup list this file used to hold is done — the full-database
download settled it. What is left are cases the audit surfaces on every run
but that a number cannot decide.

## The database entry does not match what we mean

Each of these needs a better alias in `lmv-aliases.json`, not a data change.

| Food | Matched to | Problem |
| --- | --- | --- |
| Duck | Anka bröst rå | Skinless breast, 4.3g fat. Whole duck with skin is ~28g. |
| French Fries | Pommes frites … värmd i ugn fett ca 7% | Oven-heated frozen, not deep-fried. |
| Béarnaise Sauce | Bearnaisesås fett 8% | The light version. |
| Instant Mashed Potato | Potatismos pulver | Fiber 8.3g is the dry powder, not the prepared mash. |

## Suspect source value

- **Dark Chocolate** is listed at 0g fiber. 70% chocolate is around 11g, so
  this looks like a gap in the database rather than a real zero. Tag left as is.

## Working as intended

- **Lactose-free Milk and Yogurt** report missing lactose because the database
  gives total sugars, and lactose-free products still contain the glucose and
  galactose the lactose was split into. This is exactly what the `[check]`
  marker is for. Leave untagged.

## Still not in the database

Roughly 80 foods have no Livsmedelsverket entry at all — Roquefort, Fontina,
za'atar, sumak, kombucha, seitan, most of the Asian sauces and several
mushrooms. Their tags stay sourced from the literature, and the audit will
keep listing them as unmatched. That is expected, not a backlog.
