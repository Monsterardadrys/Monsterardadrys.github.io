# Foods that need a real number

If the full-database download works, the audit tool covers all of this
automatically and you can ignore this file. This is the fallback: the foods
whose tags currently rest on a search result rather than a source, listed so
they can be looked up one by one in Sök näringsinnehåll.

29 lookups, not 368. Note the value and the food you looked it up as — the
name matters, since "regular" and "lean" versions differ.

## Fat — does it clear 17.5 g/100g?

All of these already carry `over_10g_fat` but not `bile_stimulant`. Above
17.5 g they should have both; between 10 and 17.5 the current tagging is
right. Entries whose name already states the fat content (12% minced meat,
15% hard cheese, 10% Greek yogurt, 10% sour cream, 11% quark) are settled by
the name and are not listed.

| Food | Also worth noting |
| --- | --- |
| Durian | Looks like it may be under 10 g — if so it should lose `over_10g_fat` too |
| Naan Bread | Same suspicion |
| Whole Egg | ~10 g, likely correct as is |
| Chicken Nuggets | |
| Cream Cheese (>10% fat) | The name only sets a floor |
| Ricotta Cheese | |
| French Fries | |
| Dumplings | |
| Guacamole | Also check fiber against 6 g — it currently carries `fiber` |
| Horseradish Sauce | Varies a lot by recipe |
| Ranch Dressing | Also check sugars, it carries `allergen_milk` but no lactose tag |
| Thousand Island Dressing | |
| Remoulade | |
| Ice Cream | |
| Olives | |

## Protein — does it clear 20 g/100g?

| Food | Current tag | Question |
| --- | --- | --- |
| Salami | has `protein` | Confirm it is above 20 |
| Dry-Cured Ham (lean) | has `protein` | Confirm |
| Dry-Cured Ham (fatty cut) | has `protein` | Confirm |
| Sausages (lean) | has `protein` | Confirm |
| Sausages (regular) | no `protein` | Confirm it is below 20 |
| Hot Dog Sausage | no `protein` | Confirm it is below 20 |
| Crayfish | has `protein` | Crayfish is often ~15 g — may be wrong |
| Fish Roe Spread | no `protein` | Roe is protein-dense, but spreads are diluted |
| Chicken Nuggets | no `protein` | |

## Fiber — does it clear 6 g/100g?

| Food | Current tag | Question |
| --- | --- | --- |
| Cloudberries | no `fiber` | Cloudberries are usually cited well above 6 g |
| Tempeh | no `fiber` | Around 6 g, right on the line |
| Sorghum/Durra | no tags at all | Whole grain, likely above 6 g |
| Guacamole | has `fiber` | Avocado is 6.7 g; guacamole is diluted with other ingredients |

## How to feed the answers back

Either paste them here in any readable form, or add the pairs to
`lmv-aliases.json` and re-run the audit — once a food is in the alias file
its numbers are checked automatically on every future run.
