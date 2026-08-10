# Worklist

493 foods · 43 traits · 378 matched to Livsmedelsverket, 28 to Denmark's Frida.
406 carry nutrient figures; 87 do not.

Before a release: `node tools/check-data.js && node tools/check-site.js`.

Start at **`tools/index.html`** — the workbench. It reads the files and says
what is outstanding and in what order. All the tools run on a phone.

## Done

**Livsmedelsverket audit** — 378 of 493 foods checked against the Swedish Food
Agency database, 115 confirmed absent, none unmatched. Each verified food
carries its entry name in `lmv`, and departures carry an `lmvNote`; both show on
`sources.html`.

Re-run it whenever foods, portions or doses change: open `tools/lmv-audit.html`
on a phone and feed it a fresh export, or `node tools/lmv-audit.js <export.xlsx>`.
New foods land in "to confirm" with three runner-up candidates each; confirmed
pairs go in `tools/lmv-aliases.json`, and anything genuinely missing from the
database goes in `tools/lmv-absent.json`.

**The workbench is never cached.** `sw.js` used to cache every same-origin GET,
`tools/` included, and serve it stale-while-revalidate. So an audit read
yesterday's `lmv-aliases.json` and `lmv-absent.json`: a food confirmed one day
was offered again the next, and foods just marked absent came straight back.
The page asking for `foods-data.js` with `cache: "no-store"` did nothing about
it — the service worker answers before the browser's own cache is consulted.
Requests under `/tools/` now skip the worker entirely.

**Livsmedelsverket carries one form of a herb and not the other, with no
pattern to it.** Basilika färsk and Dill färsk but neither dried; Oregano,
Timjan and Rosmarin only torkad. Fresh ginger and no ground. Garlic, and garlic
sauce, but no powder. Yellow chanterelle but no trumpet and no porcini. Every
one of those came back as its nearest wrong form — canned yellow chanterelle
for dried trumpet chanterelle, garlic sauce at 12% fat for garlic powder — so
all eight are on the absent list. The audit is at zero to confirm and zero
unmatched.

**Three places held the same fact and two of them were wrong.**
`lmv-aliases.json` says a food is a given database entry, `lmv-absent.json`
says it is in none, and the `lmv` field in `foods-data.js` is the claim the
site actually publishes. Nothing held them together, and they came apart in
both directions at once: **five foods sat on both lists** — dried mango and
dried papaya in their two versions each, and brie — and **six confirmed
matches had never been written back into `foods-data.js`**, so `sources.html`
said "not in the database" about foods the audit had already matched, and the
nutrition builder had no reason to give them figures.

The rule in `check-data.js` now holds all three to each other: an alias must
name a real food, that food must carry the same `lmv` string, an absent entry
must carry none, no food may be on both lists, and no food may be on neither.
Eleven faults on the first run, zero now. Same shape as `DELIBERATE` moving
into `lmv-core.js` — when one fact is written down twice, write the check that
makes them equal rather than trusting the copy.

**The builder never applied a recipe, and it took three rounds to see why.**
Every rebuild came back with rosehip soup undiluted — 91g of carbohydrate and
1.8g of water per 100g, the powder rather than the bowl.

The first explanation was a stale cache: `sw.js` stopped caching `/tools/` in
v1.25, but `foods-data.js` sits at the root and is cached like any other page
asset, so the phone looked like it was reading a food list from before
`madeUp` existed. **That was wrong, and hard-reloading would not have helped.**
The real cause was `flattenCategories` dropping the field before either the
builder or the audit ever saw it — see below. A plausible explanation that
predicts the symptom is not the same as the cause, and the way to tell them
apart was available: the cache story could not explain why the *audit* also
disagreed, on a different machine, in the same way.

Nothing was typed in to fix any of the rounds: `dilute()` from
`tools/nutrition-core.js` was applied to the affected foods, and it reproduced
the previous figures exactly. `check-data.js` named the fault three different
ways without being told what to look for, including "the dilution looks as
though it has not been applied". **Run the checks on a downloaded build before
committing it**, which is the whole reason they exist.

**Figures arriving is how a hand-made tag gets tested.** Brie had carried
`bile_stimulant` since before it had numbers. At 34.2% fat in a 20g portion the
load is 7.46 against a dose of 9.5, and every other cheese at that portion and
that fat — cheddar, aged gouda, emmental, parmesan — carries `over_10g_fat`
alone. The tag was a judgement about rich European cheese, not a mechanism
separate from its fat, so it is gone; brie keeps `over_10g_fat`, `histamine`
and `dao_competitor`.

Roquefort, Fontina and Raclette turned out to be worse, and the code said so
in a comment: *"Roquefort 30.6/21.5, Fontina 31.1/25.6, Raclette ~29/23 per
100g — all clear both thresholds"*. **Per 100g is the error.** A dose is what
arrives in one portion, and a portion here is 20g, so the fat line needs 30.5%
and the protein line needs 75% — which no cheese on earth reaches. All three
carried `over_10g_fat`, `bile_stimulant` and `protein` on that arithmetic.
Roquefort's Danish figures settled it at 29.5% fat, 5.9g in a portion against
a dose of 6.1, and the same applies to the other two. They now carry what Blue
Cheese and Camembert carry, both of which were matched to Livsmedelsverket and
so were checked properly. A comment recording *how* a tag was decided is what
made this fixable without figures for two of the three.

**An empty cell in a spreadsheet was stealing the next cell's value.**
`sheetToRows` in `lmv-core.js` pulled cells out with
`/<c[^>]*>[\s\S]*?<\/c>|<c[^>]*\/>/`. Put the self-closing form second and it
never gets tried: `<c[^>]*>` matches an empty `<c r="CS5" s="13"/>` right up
to its own bracket, and then `[\s\S]*?</c>` runs on and eats the next real
cell. So the empty cell took its neighbour's number, and **every column after
it shifted by one**.

Frida writes 76 empty cells in a single row, which is how it surfaced:
strawberry's sugars landed in the raffinose column and its own column read
blank. Both alternatives are now ordered self-closing first, for `<row>` as
well as `<c>`. Any export with an empty cell was affected — including
Livsmedelsverket's, whenever it has one.

Checked by reading the same 46 foods with openpyxl and comparing every figure:
368 cells, no differences.

**Denmark is wired up, and it needs no translation file.** Frida — the DTU
National Food Institute's table, `fcdb.fooddata.dk`, version 6.1 — is the
second source on the ladder, and it names every food in English as well as
Danish. So our names go straight into the scorer with no `lmv-swedish.json`
step, and for the first time the state words that decide fresh from dried are
in the same language on both sides. That is worth more than it sounds: every
wrong match this project has had was a form mismatch, and against Swedish the
scorer could not see one, because our states were English and its were not.

Figures are addressed by number, not by label. Frida gives every nutrient a
stable ParameterID, so `PARAMETERS` in `tools/frida-core.js` is the whole
mapping and there is no pattern-matching on column headings to drift: fat 141,
protein 218, available carbohydrate 172, fibre 168, sum sugars 245, alcohol 19,
water 268. **Lactose is its own figure (179)** — Livsmedelsverket gives only
total sugars, which is why lactose-free dairy still reports lactose here and
needs a soft marker. It is carried through so that caveat can eventually be
dropped for Danish-sourced foods.

The pipeline is the Swedish one, part for part: `tools/frida-audit.js` (or
`tools/frida-audit.html` on a phone) proposes three candidates a food,
confirmed pairs go in `tools/frida-aliases.json` by hand, and `--write`
produces `nutrition-frida.js`. That file arrives in the slot
`tools/nutrition-core.js` always had for a second source, so the builder
needed no change — Livsmedelsverket still wins wherever both have a figure,
and Frida wins over the hand-entered file, a national table read whole
beating figures copied one at a time.

Only foods with no figures are offered, and `check-data.js` fails a Danish
alias for a food that already carries an `lmv`. The first time
`nutrition-frida.js` is generated it has to be added to `ASSETS` in `sw.js`,
or the stray-root-file check will fail it — `frida-audit.js` says so on the
way out.

`sources.html` still reads `lmv` alone, so a Danish-sourced food will keep
saying "not in the database". True of Livsmedelsverket and misleading about
the tool. Fix it when there are real Danish entries to describe, not before.

**Picking, not transcribing.** The first real round of the Danish audit showed
the page had the wrong shape: it offered three candidates a food and told you
to go and type the winner into a JSON file. 113 foods, on a phone. Two things
were missing and both were the same mistake — the page knew the answer and made
you carry it somewhere else.

Candidates are a **choice** now. Tap to pick, tap again to unpick; the picked
one stays and the rest fold away. Every pick lands in a panel at the bottom
holding the whole of `frida-aliases.json`, ready to download or copy in one go,
and `nutrition-frida.js` is built from the picks directly — the second pass is
gone, since the page already has both the food and its record in hand. Picks
are kept in local storage as they are made, because a stray reload halfway
through 113 foods is not a survivable event.

And **the right entry is not always in the top three**. Chili is
"Pepper, hot chili, …" in Frida and scores below foods it has nothing to do
with; matcha shares no word at all with "Tea". Each food now carries a search
box over every name in the file, so nothing is unreachable. Anything already in
`frida-aliases.json` counts as picked, so a half-finished round carries on
rather than starting again.

**A recipe belongs to the food, not to the table.** `dilute()` was applied to
Livsmedelsverket matches only, so a `madeUp` food sourced from Denmark would
have gone in undiluted — the rosehip soup fault again, one source over. It is
applied to every source now, in `tools/nutrition-core.js`.

**Matcha is the one tea where the leaf is drunk.** Every other tea here is a
brew: the leaf is steeped and thrown away, so a ready-to-drink entry is the
right match and the 200g cup is already the portion. Matcha is powdered leaf
whisked into the water and swallowed, so it takes the dried-leaf figures with
a recipe — `madeUp: { parts: 1, water: 100 }`, about 2g in a 200ml bowl. Its
portion moves from 5g to 200g to match: a cup of matcha brings 200g of water
to a meal, and at 5g it would have counted as a spoonful of dust and pulled
the dry-meal line the wrong way.

**Sprouted legumes.** Every legume in that category carries galactans; these
carry none, which is the whole reason they are worth listing — the seed spends
its own stored oligosaccharides germinating. Mung bean, adzuki, lentil and
alfalfa sprouts, kept in Legumes rather than Vegetables so the contrast with
the row above them is visible. Monash rates mung bean and alfalfa sprouts low
at an ordinary serving. They carry no trait at all, which is a real answer
rather than an empty one: a legume that carries none of the things tracked here
is exactly what Foods without exists to find.

**Yeast extract is the spread, not the flakes.** "Yeast Extract" was ambiguous
enough that its own author could not tell which product it meant, and it
carried no traits at all. It is Marmite and Vegemite — renamed
**Yeast Extract (Marmite type)** and given `histamine`, which it has as much of
as anything on an elimination list. Nutritional yeast is a different product
and already had its own entry.

**Two checks were too strict to add a food through.** A food in neither the
confirmed nor the absent list is where every new food starts, and a `madeUp`
recipe on a food that has no figures yet is waiting, not wrong. Both are
warnings now. The faults are kept for the three files contradicting each other,
which is never a normal state.

**The first Danish round: 28 foods, and five more tags it disproved.** 94
foods are left without figures, down from 117. Every finding was a tag someone
had reasoned out before there was anything to check it against:

- **Goats Milk** gains `over_10g_fat` and `bile_stimulant`. At 4.1% fat a 200g
  glass holds 8.3g, where cow's milk at 3% holds 6.0 against a dose of 6.1 —
  so the two milks genuinely differ here, which is worth saying. Sheep's milk
  is fattier again and still has no figures.
- **Skyr** gains `protein` — 22g in a 200g pot against a dose of 15.
- **Seitan** gains `over_10g_fat` and `bile_stimulant`.
- **Dumplings** gains `bile_stimulant`.
- The three blue-and-washed-rind cheeses lose three tags each; see above.

**Tea is two foods and matcha is the third.** Black, green, mate, chai,
chamomile and peppermint are brews — the leaf is steeped and thrown away — so
they take Frida's *ready-to-drink* entry, which is water and almost nothing
else, and their 200g portion already assumed as much. Matcha takes *Tea,
leaves* with its recipe, and comes out at 99g of water per 100g, which is a
cup of matcha. Six foods pointing at one entry is not a mistake here: what is
drunk really is the same liquid.

**Fruit is analysed in syrup, not dried.** Frida carries very little dried
fruit and a good deal canned in syrup — which is also what a Swedish shop
stocks. Five added beside the peaches that were already there: pear,
pineapple, apricot, cherry and strawberry. Each is its fresh fruit's traits
plus `refined_carbs` for the syrup, the rule Canned Peaches was already built
on. Pear loses `peel_skin`, because canned pears are peeled.

The nine dried fruits without figures were **not** removed to make room. They
carry checked traits — sulphites, polyols, fructose, birch and latex
cross-reactivity — and those work in the app and in Foods without, which do
not need a gram figure at all; only the meal builder does. USDA SR Legacy
covers every one of them, so they are waiting on source three rather than
missing. Deleting them would throw away clinical information to tidy a count.

**Chili is still unmatched.** Frida has hot chili fresh and canned but not
dried, so `Chili (dried)` stays without figures; the canned entry went to
`Pickled Jalapeno`, where it belongs. Blackcurrant was already on the list
with Swedish figures.

**The Swedish audit picks too now.** What the first Danish round taught applies
here and the older page had none of it: candidates are tappable, each shows
fat, water, sugars and fibre so a wrong form is visible, every food has a
search box over the whole export, and picks survive a reload. The report is
untouched — it is still what carries the disagreements — but it now sits below
the part that needs doing.

Three things are its own, because Livsmedelsverket is not Frida:

**"Not in the database" is an answer, not a failure to answer.**
`lmv-absent.json` is an output of this page and 113 foods reached it one round
at a time, mostly by being described to me in a message. It is a button now,
and it writes the file.

**A download must not undo the last twenty rounds.** Frida's alias file was
empty when its page was written, so producing it from the picks alone was
safe. Here there are 371 confirmed matches and 113 absences on file, and a
file holding only this round's answers would erase all of it the moment it was
saved over the old one. Both downloads are *everything on file plus what was
just picked* — and `_comment` is carried through from the file that was read,
because the one in `lmv-absent.json` explains why Livsmedelsverket has dried
oregano and no fresh, which is worth more than the entries around it.

**A partial export makes settled foods look open.** Feeding the page a short
file put 368 already-confirmed foods into "unmatched", one tap away from being
overwritten with whatever the short file happened to contain. Anything already
in `lmv-aliases.json` is now kept out of the picking list whichever bucket the
audit put it in, and named in a warning instead: usually the export is partial,
and on a full one it means Livsmedelsverket has renamed the entry and the alias
needs redoing. Both readings are stated, since the page cannot tell them apart.

One thing the search box cannot fix by itself: our names are English and the
database is Swedish, so a food with no entry in `lmv-swedish.json` scores
nothing against anything and arrives with no candidates at all — every canned
fruit did. The box says so and suggests a Swedish word to try.

**A field that exists on the food should reach whatever reads the food.**
`flattenCategories` in `lmv-core.js` built a reduced object naming the five
fields the audit was thought to need. `madeUp` was never added to that list,
so `auditFood` asked for `food.madeUp`, got undefined on every food, and read
rosehip soup's powder against a 200g bowl — reporting a fiber tag missing that
a made-up bowl does not earn. **Four releases running**, in every report, while
`check-data.js` said the data was fine: it reads the built figures, which are
diluted, so the two could not see the same thing. The fix is to copy the food
and fill in the defaults rather than name the keepers. Exactly the same fault
the nutrition builder had in its own half, found the same way — by a number in
a report that did not match the number in the file.

`check-data.js` now also names foods that are matched but have no figures yet.
Harmless in itself, but it is the state six foods sat in unnoticed once,
confirmed on paper and missing from every meal.

**Three sprouts confirmed, and the download that could have gone wrong did
not.** Mungbönsgroddar, Linsgroddar and Alfalfagroddar. The returned files
carried exactly three additions, nothing removed, both `_comment` blocks
intact — which is what the "everything on file plus what was just picked" rule
was written for. Adzuki Bean Sprouts was left open, and Livsmedelsverket does
carry the other three, so it is worth another look rather than an absence.

**Adzuki sprouts: absent from Sweden, present in Denmark.** The three other
sprouts are in Livsmedelsverket and this one is not, which is the herb pattern
again in a different aisle. It is on the absent list, so the Swedish audit
stops offering it and the Danish page picks it up — the ladder working as
designed for the first time, rather than a food falling off the end of it.

**The canned fruit round, and the disagreement that finally went away.** Four
confirmed — pear, pineapple, apricot and cherry in syrup — and strawberry
recorded absent, which leaves the audit at zero to confirm and zero unmatched
again. **Rosehip soup is no longer among the disagreements**, for the first
time since the field was added: two remain and both are the deliberate ones.
That is the v1.33 fix showing up where it should, in a report generated on a
different machine from the one that made the change.

The cherry is worth reading twice. Livsmedelsverket's only canned cherry is
*Körsbär surkörsbär konserv. m. sockerlag* — **sour** cherries, where the fresh
Cherries entry above it is *Sötkörsbär*, the sweet kind. It is also what is
actually sold in a tin here, so the match stands with an `lmvNote` saying which
it is. Worth looking at the traits again once its figures arrive: sour cherries
carry less sugar and more acid than sweet.

**Re-running an audit shrank its own file, and would have cost 28 foods.**
The Danish round came back with 30 confirmed matches in `frida-aliases.json`
and a `nutrition-frida.js` holding **two**. Rebuilding with it would have
stripped the figures off the other 28 — Roquefort, Skyr, every tea, Pine Nuts,
the lot — silently, because the builder has no way to know a generated file is
short.

The cause is one list doing two jobs. `proposeMatches` walks the foods with no
figures, which is right for deciding what to *offer* a human: there is no point
asking about a food already covered. But the writer built the generated file
from that same result, so on a second run the foods confirmed the first time
already had figures, were never offered, never landed in `confirmed`, and fell
out of the file.

The alias file is the record of what has been confirmed; the generated file is
that record with figures attached. So `confirmedFrom` now builds it from the
aliases against the **whole** food list, in both readers and all four writers —
two command-line tools and two pages. Checked against the real 30-alias file:
the old path returns 2, the new one returns 30, nothing missing. A food an
earlier source now covers is harmless in there, because the ladder in
`nutrition-core.js` still puts that source first.

**And the workbench, `tools/index.html`.** Where the data stands and what to do
next, computed from the files rather than kept by hand — foods-data.js,
nutrition-data.js, the three alias files and the three generated files. It
knows three things go wrong and only the first is visible on the site:

1. foods with no figures → run the next audit
2. an alias file ahead of its generated file → re-run that audit's write
3. a generated file ahead of nutrition-data.js → rebuild

Number two is the one that just bit, so the page was tested by putting the real
two-food `nutrition-frida.js` and 30-alias file in place: it says *"30 matches
are confirmed but only 2 are in nutrition-frida.js. Rebuilding with it as it
stands would take the figures off the 28 that are missing."* A checklist would
have had to be told that. This works it out.

**The order, written down once.** Livsmedelsverket, then Frida, then USDA, then
by hand. It matters at audit time, not at build time: each audit offers the
foods without figures *as of the last build*, so whichever runs first claims
them. The build is safe either way — precedence is enforced there — so running
out of order costs confirming work, not correctness.

**The first real SR Legacy round found the gate's blind spot.** 37 foods
confirmed, and the "short of a full set" list at the bottom of the generated
file was full of `derivation BFSN`, `derivation BFZN`, `derivation T`,
`derivation JA` — codes neither ACCEPTED nor REJECTED knew. Unknown codes are
dropped, which is the safe direction, but they were dropped **silently**, and
the result was Kimchi reduced to `{ carbs: 2.4 }` and Worcestershire sauce with
no water figure at all. A food with one figure is worse than a food with none,
because it looks like data.

The fix was sitting in the file. Every derivation carries a `description` as
well as a `code` — `"Manufacturer supplied(industry or trade association),
Analytical data, incomplete documentation"` — and the reader was throwing it
away and printing the bare code. Now an unrecognised code is reported in USDA's
own words, and both audits list every unknown code with a count so it can be
classified once rather than rediscovered per food.

Three decisions came out of that list:

- **The BF family is rejected**, and named. It means the figure was taken from
  another form of the same food — raw applied to cooked. Every wrong match this
  project has had was a form mismatch, so a figure that is itself a form
  substitution is the last thing to admit quietly.
- **`Z` is now accepted.** USDA's wording is "insignificant amount or not
  naturally occurring in a food, such as fiber in meat" — the source stating a
  nutrient is not there, which is a fact about the food, not a number invented
  to fill a hole. Our rule against fabricated zeros is about *us* inventing
  them. Without this every dried herb lost its alcohol figure and could never be
  checked against the alcohol dose at all.
- **`T` and `JA` stay dropped** until the descriptions are read. They are now
  visible instead of buried.

**And nutrition-usda.js was not on the ladder at all.** `loadFallbacks` in both
builders read `nutrition-manual.js` and `nutrition-frida.js` and nothing else,
so the generated USDA file would have been produced, downloaded, put in the root
— and silently ignored. It is now third, in the order the ladder says: later
wins in `Object.assign`, so the list reads manual, USDA, Frida, which is the
ladder upside down. Livsmedelsverket still beats all three in
`nutrition-core.js`.

**Order matters, and only at audit time.** Each audit offers the foods with no
figures *as of the last build*, so whichever is run first claims them. Run them
in ladder order after adding foods — Livsmedelsverket, then Frida, then USDA —
or a food Denmark covers gets confirmed against America instead. The build is
safe either way, because precedence is enforced there; what is lost is the work
of confirming the wrong match by hand.

**The USDA audit runs on the phone, because the file cannot come here.**
SR Legacy is 64MB and all three sets together are 200MB — more than a chat
window carries, and splitting it into parts was a worse idea than it looked.
`tools/usda-audit.html` is the same two-pass tool as the Swedish and Danish
audits, with `tools/usda-audit.js` as its command-line twin, and the file never
leaves the device.

**It is scanned, not parsed.** `JSON.parse` on 70MB costs 240MB of memory
against 70MB for the streaming reader, measured on the same file — and the real
gap is wider, because SR Legacy carries far more nutrients per food than the
fixture did. So the file is read 4MB at a time and each food is parsed alone,
reduced to the seven figures we keep, and dropped.

Two details that would each have been a bug:

- **Boundaries are found by depth, not by newline.** Both exports put one food
  per line and splitting on `"\n"` would have been less code, but that is a
  property of today's file rather than of the format. The scanner tracks brace
  depth and quoting, so a brace inside a description cannot end a food early —
  checked with `Weird {food} "quoted" [x]` as a name.
- **Chunks are decoded with a streaming `TextDecoder`.** Slicing a Blob cuts
  bytes, and the µ in "µg" is two of them; decoding each slice on its own would
  corrupt every record straddling a boundary.

Verified rather than assumed. Fed the same file at 3-byte, 997-byte and 64KB
chunks, the reader returns identical results, and agrees with the whole-file
path on all 355 records. The page itself was driven in a real browser: 70MB in,
87 food blocks rendered, a pick made, the alias file and the figures preview
updated, and the pick still there after a reload. No page errors.

One thing the run makes obvious. Against Foundation the candidates are honestly
bad — Durian's best offer is "Cheese, American, restaurant" at 0.27 — and that
is the tool working. The score is shown, the figures are shown, and a human
throws it out in a second. A silent importer would have taken it.

**SR Legacy is not uniformly laboratory-analysed, and the file says so.**
`method.html` called it that, on the strength of its reputation. Its opening
entries are Pillsbury refrigerated dough and a Kraft coating mix, and their
figures carry derivation codes `MA` (manufacturer supplied, incomplete
documentation), `MC` (manufacturer supplied, calculated by manufacturer or
unknown) and `LC` (back-calculated from the label). Label data rounded to legal
tolerances is precisely what Branded Foods is excluded for — sitting inside the
set we were about to trust wholesale.

The fix is not to reject SR Legacy but to stop trusting sources and start
trusting figures. Every `foodNutrient` in FoodData Central records its own
derivation, so `tools/usda-core.js` tests each number rather than the file it
came in. Accepted: `A`, `AS`, and `NC` — the last because carbohydrate by
difference and protein from nitrogen are calculations every national table
performs by definition, and rejecting `NC` would empty the carbohydrate column
for every source we have. Rejected: manufacturer-supplied, label-derived,
recipe- and formulation-estimated, copied-from-another-nutrient, assumed-zero.
A dropped figure keeps its reason, so it can be explained rather than silently
missing.

Tested both ways before it is trusted. Against Foundation it drops **nothing** —
918 `A`, 138 `AS`, 638 `NC` across the figures we use, which is why that set
never raised the question. Against the SR Legacy entries the codes were read
from, the cinnamon rolls lose every figure, the biscuits keep only the one
carbohydrate that was calculated rather than supplied, and a laboratory-measured
waffle keeps all six. The graham-cracker crust loses its sugars to `NR`, "copied
from another nutrient" — its Total Sugars is 18.1 and its sucrose is 18.1,
the same number twice.

Nothing is imported yet; SR Legacy is 64MB and arrives split. But the gate is
built and checked, so the import is a matching problem now rather than a trust
problem.

**USDA Foundation Foods covers none of our gaps, and proves something better.**
395 entries, of which 32 are literal `null` — a quirk any parser has to tolerate
— leaving 363 real foods, weighted heavily toward raw commodity produce. That is
the part Livsmedelsverket already covers well. Against our 87 foods without
figures it lands **three** name matches: enoki, maitake and lion's mane. All
three are missing a sugars figure, with no individual sugars to sum, so under our
own rule — a food with no figure gets none rather than a fabricated zero — the
usable yield is **zero**. A naive token match claimed 44 of 87, which is worth
recording as a warning: it paired "Dried Lychee" with "Figs, dried" on the word
*dried*, and every one of our eight sauces with "Tomato, sauce, canned" on the
word *sauce*. Same form-mismatch failure as every bad match this project has had.

What it does carry is the only direct evidence we have for the fiber caution on
the method page. Foundation runs both dietary-fiber methods on some of the same
samples — 17 foods carry AOAC 991.43 and AOAC 2011.25 side by side — and the
newer method reads higher on **all seventeen**, median +1.8g per 100g, which is
30% of our 6.1g fiber dose. The gap falls on starch: white rice 0.15 → 2.77,
potato flour 5.4 → 16.6, ripe banana 1.7 → 4.6. Resistant starch is what 2011.25
counts and 991.43 misses. So mixing sources does not blur fiber randomly, it
under-reads starchy foods specifically. "A couple of grams" was a hedge; it is
now a measured, directional bias, and `method.html` says so.

**Next source is SR Legacy, not FNDDS.** Our long tail is 18 spices, 8 sauces, 9
dried fruits, 9 mushrooms — SR Legacy has a full spice and sauce set and roughly
7,800 foods against Foundation's 363. FNDDS is survey data: mixed dishes costed
out of recipes rather than analysed, which is the same objection that keeps
Branded Foods off the ladder. Take it only where nothing else exists, if at all.

**The syrup figures argue for themselves, and caught one thing.** Canned in
syrup roughly doubles the sugar against the same fruit fresh — apricot 6.6 to
18.5 per 100g, pineapple 10.1 to 20, cherry 11.5 to 20.2, peach 8.3 to 16.6 —
and fibre falls, because the fruit is peeled and softened. `refined_carbs` on
all five is not a guess about syrup, it is the difference in the column.

The warning about foods carrying `irritant` with no subtype earned its keep the
same run: **Canned Pears in Syrup** turned up in it, the only canned fruit
there. The fresh pear carries the umbrella for its peel and nothing else, so
dropping `peel_skin` when the fruit is peeled — which v1.31 did — left the
umbrella standing on a mechanism that had been removed. A warning nobody had to
read closely was enough, because it named the odd one out.

**Read the runners-up, not just the top line.** The scorer matches names, and
a name matches best across the very difference that matters: it offered *Mango*
for dried mango, *Papaya* for dried papaya, *Dill färsk* for dried dill and
*Tofu fast* for silken tofu. Five of the six real matches in the last round
were runners-up. Where every candidate is the wrong form and no right-form
entry is offered at all, the food is absent, not unmatched.

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

**Nutrition per 100g** — 406 foods carry fat, protein, carbohydrate, fiber,
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

All 406 foods carry a water figure. Adding the column immediately exposed two
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

**Both halves of a pair** — a food sold fresh and dried had only one of them
on the list, which is fine at 5g and not at 20g. Twelve added: Basil (dried),
Dill (dried), Mint (dried), Oregano (fresh), Thyme (fresh), Rosemary (fresh),
Ginger (dried), Chili (dried), Garlic Powder, Sun-dried Tomato, and dried
porcini and trumpet chanterelle.

Which pairs matter is not the same question as which pairs exist. For the herbs
it is only weight and water — basil carries no trait either way. It is the four
where drying concentrates a trait that change what the tool says: garlic powder
(fructans), chili (capsaicin), sun-dried tomato (histamine) and above all dried
mushrooms, where 10g of dried porcini is 100g of fresh in mannitol.

`bothWays` is for the same jar in two versions, so the name has to say which.
Garlic powder, sun-dried tomatoes and raisins have their own names and their
own shelf — they get a `form` and no suffix.

The twelve have no `lmv` match yet, so they carry no figures and cannot go in a
meal. The audit will offer candidates for them next time it runs; confirm them
into `lmv-aliases.json` and rebuild.

## Open

- **The FODMAP serving table is partial and unverified.** 50 foods have a
  serving, 50 of the 139 FODMAP foods that can go in a meal. Every figure was
  typed in from the Monash app and none has been checked against the current
  version — serving sizes are revised as foods are re-tested. Monash publishes
  no export, so this will always be hand-entered. Checked in the app: cauliflower
  is fructans, as we had it. Asparagus was not — it is excess fructose, and the
  tag has been corrected.
- **87 foods still have no figures**, so they cannot go in a meal — down from
  117 after the first Danish round. What is left is the long tail Frida does
  not carry either: branded products, most Asian sauces, the vegan cheeses,
  and the dried fruits below.

  The source ladder is decided and short — Frida (DK), then USDA SR Legacy,
  then Ciqual for the European cheeses — and `nutrition-manual.js` is where
  entries go, one per food with `src` and a verbatim `ref`. Roughly fifteen of
  the 113 (the vegan cheeses, protein bars, kombucha) are branded products no
  national table analyses; they will stay without.

  Where the 113 sit, largest groups first: spices 21, beverages 11,
  condiments 10, sauces 10, dried fruit 9, mushrooms 9, grains 8, dairy 8,
  ferments 7. The spices and mushrooms are the ones that change what the tool
  says — dried porcini and trumpet chanterelle carry mannitol, garlic powder
  fructans, dried chili capsaicin — and a spice portion is 2g, so a figure
  that is merely close is good enough there. The dairy is where precision
  matters and where Frida is likely to be thinnest on the European cheeses.

  Hand-entering 113 foods is not the plan. `tools/lmv-core.js` already holds
  the parts a second source needs — the xlsx/csv/zip readers, the bigram
  scorer, the audit rules, `DOSE` — with the Swedish-specific parts sitting
  next to them as data: `NUTRIENT_PATTERNS`, `NAME_KEYS`, `STOPWORDS`,
  `WEAK_TOKENS` and the `ENDINGS` stemmer. A Danish import is that seam plus
  a language pack, not a fork. Frida publishes English food names alongside
  Danish ones, so the `lmv-swedish.json` step may not be needed at all —
  worth checking against the real file before building anything.

## Known and expected

- **113 foods have no Livsmedelsverket entry** — Roquefort, Fontina, za'atar,
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
