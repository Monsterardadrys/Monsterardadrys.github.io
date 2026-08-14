# Worklist

539 foods · 43 traits · 375 matched to Livsmedelsverket, 30 to Denmark's Frida,
84 to France's Ciqual, 33 to USDA's SR Legacy. 521 carry nutrient figures; 18 have
none from any source. 110 carry a real lactose figure and 94 a polyols figure,
41 of them borrowed from a table that has the column for a food that does not.

Before a release: `node tools/check-data.js && node tools/check-site.js`.

Start at **`tools/index.html`** — the workbench. It reads the files and says what
is outstanding and in what order, and it now carries the durable notes too:
where each source file is downloaded from, the decisions already settled, and
the traps that have actually bitten. It is written to be enough on its own after
a long gap; this file is the long version behind it.

## Done

**Livsmedelsverket audit** — 375 of 539 foods checked against the Swedish Food
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

**A generated file can be complete and still be out of date.** Widening `KEEP`
to carry lactose and polyols did not make any file wrong — all three still hold
exactly the foods their alias files confirm, so nothing drifted and nothing
complained. But two of the three were written before the column existed, and so
carry none of it: `nutrition-frida.js` and `nutrition-usda.js` hold no lactose
at all, though Frida publishes it as ParameterID 179 and USDA as nutrient 1013.
Only the French file has it, because it happened to be regenerated afterwards.

Rebuilding `nutrition-data.js` in that state gains almost nothing — six French
foods' worth of zeros. The lactose that would actually matter, for the 51 Swedish
dairy foods, needs the Danish and American audits re-run first so their generated
files pick the column up.

The workbench knows this now. It compares what a reader *can* fetch against what
the file actually holds, and says which audit to re-run. It is a prompt rather
than a fault, because a source with no dairy among its foods would honestly have
no lactose and there is no way to tell those two cases apart from the file alone
— so it will keep saying so until the re-run proves it either way.

**Ciqual's polyols column is not what it looks like, and the number says so.**
The idea was sound — borrow only the columns the sources above do not publish,
and keep the rest from Sweden and Denmark — but it is worth for lactose and not
for polyols, and the difference is measurable.

Of Ciqual's 3,484 records, 3,036 carry a polyols figure and **only 182 are above
zero**. The top of that list is sugar-free confectionery: hard candy 95.6g,
breath mints 94.6, chewing gum 65.7, no-added-sugar chocolate 42.6. The column
is measuring *added* sweeteners, which is what a French label must declare. The
naturally occurring sorbitol and mannitol the trait is about barely register —
mushroom 0.45, peach 0.72, apple 0.59, pear 2.02, and avocado, blackberry and
watermelon flat zero, though Monash rates all three as polyol foods. Fresh plum
has no figure at all.

So it cannot audit the tagging, and it could not drive it either: `polyols` has
**no dose**. It is a categorical FODMAP subtype tagged from Monash servings, and
`check-data.js` measures only fat, protein, fibre, lactose and the bile load
against figures. A polyol figure would be carried and never read. Of our 46
polyol-tagged foods, exactly one — Sugar-free Chewing Gum — is the kind the
column is authoritative about.

**Lactose is the opposite case and the mechanism is worth building there.** It
has a dose, it is checked, and Livsmedelsverket has no such column: 51 dairy
foods are checked against total sugars today with a soft marker saying the
figure is not really lactose, which is why lactose-free milk still reads as
full of it. Borrowing the lactose column from Frida or Ciqual for a
Swedish-sourced food would turn 51 soft warnings into hard checks and settle a
reading we know is wrong.

That needs three things and none of them are free: a per-key merge in
`nutrition-core.js` so a lower source can fill a column the higher one does not
publish without touching the seven it does; a separate record of "this food is
that food, for the extra columns only", because `check-data.js` rightly fails
today on a French match for a food Sweden already covers; and per-figure
provenance, since `src` would no longer name one table. Not built — the
evidence changed the shape of it, and the shape should be chosen rather than
assumed.

**Nothing holds a lactose or polyols figure yet in any case.** `KEEP` was
extended after the last build, so the columns are ready and empty until
`nutrition-data.js` is rebuilt. `nutrition-ciqual.js` has been regenerated and
now carries both; all six read zero, and none of the six is tagged `polyols`.

**The French round landed, and the answer to "rank it higher?" is no — but not
for the reason it looked like.** Six foods: Butter Beans, Corn Tortilla,
Harissa, Kombucha, Raclette and a complete Teriyaki Sauce, which is the one the
American reader had refused for want of a fat figure. 450 with figures.

**Lactose and polyols were not an argument about rank at all.** `KEEP` was the
same seven in every reader — fat, protein, carbohydrate, fibre, sugars, alcohol,
water — so the lactose and polyols columns were read out of Frida and Ciqual and
then thrown away before they reached `nutrition-data.js`. No ordering of the
ladder would have delivered them. What was wanted was to *keep* them, so they
are kept now: lactose from Frida, Ciqual and USDA, polyols from Ciqual, which is
the only source that publishes one at all and the only figure the 47 foods
tagged `polyols` have ever had.

That pays for itself immediately in `check-data.js`. The lactose line used to
read total sugars and carry a soft marker saying so — which is why lactose-free
milk still reads as full of lactose. It now takes the real column where the
source has one and stays soft only where it does not, so the caveat applies to
Swedish dairy and to nothing else.

**And the fibre question answered itself out of the file.** Ciqual publishes
INFOODS tagnames on a second sheet, and the one against Fibres is **`FIB-`**. In
that system the suffix names the method — `FIBTG` is gravimetric AOAC, `FIBTS`
is the sum of measured components — and a bare tag with a hyphen means the
method is unspecified. So whether resistant starch is counted in a French fibre
figure is not knowable from the table.

That is the opposite of an argument for promotion. The two AOAC methods differ
by a median of 1.8g per 100g, 30% of our fibre dose, and the gap falls on starch
precisely because resistant starch is what the newer one catches. USDA labels
the method per figure and we record which was used. Ciqual cannot be asked. It
is the one column where France is the weakest of the four sources, and it
belongs where it is.

**Two faults, both from rules written the day before.** Butter Beans came in at
2.7g of fibre — 4.05g in a 150g portion against a dose of 6.1 — and lost the
`fiber` trait it had been carrying on a guess. And Teriyaki Sauce turned up with
both a French and an American match, which the new ladder rule fails on: France
is above America, so the American alias was dead weight and is gone.

**Ciqual is on the ladder, third — below Frida, above USDA.** ANSES's French
table, 3,484 foods, English names, every figure we keep in its own column plus
lactose and **polyols**, which nothing else has ever given us and which we tag
a trait for.

**The placement is the interesting part.** Denmark stays second because it
describes food off the same shelf as Sweden. France goes above America because
where the two overlap, the American set is answering about a different shelf —
the Mediterranean and French tail is exactly what the Nordic tables do not
carry. But France stays *below* Denmark because Ciqual publishes no confidence
code per figure. It has to be taken on the table's standing, the way Sweden and
Denmark are, while every American figure can be tested one at a time. Being
checkable more closely does not make a source better; between two tables of
equal standing, the one describing the food you actually buy wins.

**Four things in a Ciqual cell are not a number**, and they do not mean the
same: `-` is not measured, `traces` and `< 0,2` are below quantification, and
plain numbers are stored as text with a comma. The first is left missing; the
other two are read as zero, and the entry says which figures came that way —
Raclette's carbohydrate and sugars both do. Reading them as missing instead
would put the food's whole weight into the meal builder's headroom, buying a
great deal of silence to avoid an error of a few tenths of a gram. The largest
limits in the file are 3g per 100g and they sit on fibre in cream, cheese,
cured meat and wine, where zero is the truth rather than an approximation.

**What it is worth**, checked before building anything: 2,862 of 3,484 pass the
backbone rule, and the finds against our 49 empty foods are Raclette, Kombucha,
Harissa, Butter Beans, Freekeh (Ciqual calls it *Frik*), Porcini (*Cep or
boletus*), Rice Milk, Corn Tortilla and a complete Teriyaki Sauce — which
rescues one of the five the American reader refused.

**Raclette is the one that mattered.** It had been sitting on an inference since
Fontina: Roquefort's Danish figure of 29.5% fat gives 5.9g in a 20g portion,
just under the dose, and Fontina and Raclette were both given that answer by
analogy. Fontina's own figure later proved the analogy wrong by a third of a
gram. Raclette's own figure is 27.5% — **5.50g, under**. The analogy was right
for this one. It no longer rests on it either way.

**One rule now written down twice, and checked.** `REQUIRED` — the fat, protein,
carbohydrate and water backbone — lives in both `usda-core.js` and
`ciqual-core.js`, so `check-data.js` compares them and fails if they drift. It
found something immediately: `usda-core.js` had never exported `REQUIRED` at
all. Same shape as `DOSE` moving into `lmv-core.js` — when one fact is written
twice, write the check that makes them equal.

`check-data.js` also holds the French rung to the two above it: a French match
for a food with a Swedish entry, or with a Danish match, is dead weight and
fails. So does an American match for a food France covers. All four rules
checked by planting them.

**The workbench cried wolf about work that was already decided.** It read 36
foods in `nutrition-usda.js` against 41 in `usda-aliases.json` and called it
drift — the same shape as a half-written file, and exactly the fault it was
built to catch. But five of those were refused on purpose, and two more picks
still sitting in the browser were matches the repo had looked at and turned
down. Neither is unfinished work, and a tool that cannot tell the difference
between "not done yet" and "decided against" is a tool that gets ignored.

Two kinds of exclusion, so two records:

- **The match is right, the figures are too thin.** The tool refuses those
  itself, and the generated file now ends with `NUTRITION_USDA_REFUSED` — the
  names, in a form a reader can use rather than a comment for a person. They
  stay in the alias file, because the match still stands and re-confirming it
  next round would be work done twice.
- **The match is wrong.** `tools/usda-declined.json`, food to reason, the
  counterpart of `lmv-absent.json`. Instant Ramen and Brown Gravy are its first
  two entries, each with what was wrong with it and what it would take to fix.
  `check-data.js` holds it to the alias file: a food cannot be both confirmed
  and declined, and declining something that is not a food is a leftover from a
  rename.

The drift rule is now `written + refused < confirmed`, and a pick the repo has
declined stops being reported as outstanding. Checked with the real 43 picks in
a browser against the repo as it stands: no alarms, and the only thing left to
say is that 49 foods still have no figures.

**Search stopped caring about word order.** Every search box here matched a
substring, so finding a food meant guessing the word order somebody else chose.
Ciqual writes *Jam, apricot* and *Apricot, pitted, dried*; Frida writes *Cheese,
hard, Cheddar, Danish*. There is no pattern to learn, and where a food has only
one or two near neighbours there is nothing to learn it from. Every box now
splits the query and asks for each word separately, anywhere, in any order — the
four audit pages, the harvest page, and the site's own food filter, which had
the same problem with our own names: *cheese cream* found nothing for **Cream
Cheese**. A single-word query behaves exactly as it did.

**Is the ladder a claim about laboratories? No, and it should never have been
allowed to read as one.** The question came from the harvest: if all three
tables are laboratory analyses, what makes Sweden's figure better than France's?
Nothing, and the ladder does not say it is. It answers one question — when two
tables both have a figure for the *same food*, which do we take — and its two
reasons are neither about measurement quality:

- **Consistency.** A food's figures should come from one analysis of one
  product. Taking its fat from one country and its fibre from another makes the
  food incoherent whatever the labs did.
- **Which product.** A Swedish entry describes what is on a Swedish shelf.
  Gräddfil at 12% is not crème fraîche at 34%, however well either was analysed
  — and that was a real duplicate here, not a hypothetical.

Where between-country genuinely does beat between-batch we have measured it, and
it is the fibre method: AOAC 2011.25 reads a median 1.8g/100g above 991.43 on
the 17 foods carrying both, which is 30% of the dose. That is a real reason to
prefer tables that agree on method, and it is the only such reason we have
evidence for. Everything else in the ordering is product and consistency.

**So the harvest does not use the ladder, and should not.** It is choosing which
foods to list, not which figure to believe, and neither reason above applies to
that. It drops a record only when *some* source already answers for that food,
whichever source that is, and sorts what is left on the figures rather than on
where they came from. That was already how it worked; it is now said out loud on
the page, because the question was a fair one to have to ask.

**The first harvest: 90 records in, 75 foods out, and six duplicates the tool
should have caught.** France's table gave 90 records worth a look. What came out
of them:

- **Six were foods we already had**, under a name the near-duplicate check could
  not see. Ciqual writes *Apple, dried* where we write *Dried Apple*, *Apricot,
  pitted, dried* for *Dried Apricot*, *Pork liver pâté* for *Liver Pate*. The
  check used the audits' bigram scorer, which compares whole strings — so word
  order matters to it, and every one of those scored near zero. It offered
  *Milk chocolate* as the closest thing to *Beaufort cheese*.
- **Five spirits left out.** Gin, rum, vodka, whisky and brandy are water and
  ethanol; `Spirits (Liquor)` already answers for them. Liqueur is in, because
  its 17g of sugar makes it a different food.
- **Four records collapsed into two foods.** Gruyère and Tomme each came twice,
  and Ciqual gives flageolet and haricot beans byte-identical figures, which
  means one analysis serving two names — the Sour Cream duplicate again, seen
  before it landed this time.
- **Eleven jams stay eleven.** The sugar is the same 55-60g in all of them, but
  the pollen cross-reactivity the fruit brings is not, and that is a real
  difference in what the tool says.
- **Thirteen named cheeses stay thirteen.** The precedent was already set by
  Roquefort, Fontina and Raclette: a shopper reads the name off the packet, so
  the name is the food.

**Nine trait tags were wrong and the arithmetic said so.** Every dose-based tag
on the 75 was checked against the figures before anything was written, the same
way `check-data.js` checks the existing ones. Sugared almond does not reach the
fat dose in 30g; a nougat bar's 5.84g of lactose is 2.92g in a 50g portion, not
5; a reduced-fat biscuit's 13g of fibre is 3.9g in 30g. Four more needed the
`irritant` umbrella that `caffeine`, `peel_skin` and `alcohol` imply. Writing
seventy-five trait lists by eye and checking none of them would have put nine
wrong claims on the site.

**The fix: words before letters.** The near-duplicate check now compares the
*set of words* in the two names, accents stripped, keeping the form word —
dried, raw, cooked — because every bad match this project has had was
fresh-for-dried or raw-for-cooked, so the one word it would be tempting to
discard as noise is the one that must count. Taking the larger of the two
scores was tried first and is wrong: the bigram number is on a different scale
and wins for the wrong reason, still offering fresh *Apricot* for the dried
one. Words decide; letters only break a tie of nothing at all. All six
duplicates are caught by it.

**And a warning that buried the report.** Adding 75 foods at once produced 75
identical lines saying no Swedish audit had seen them — which is true, and is
the next thing to do, but as 75 lines it hid everything else. One line now,
with the names and the reason: Livsmedelsverket sits above France, so a Swedish
round should look at them before their figures are taken as settled.

**Reading a table the other way round.** Every tool here starts from a food we
decided to list and goes looking for figures for it. That is why the list has
foods with no figures after four national tables, and why the last two rounds
were spent deciding which of them to give up on. The inverse question is
better posed: not *does this food have data* but *which of this data is worth a
food*.

`tools/harvest.html` asks it. It takes any of the three exports — it works out
which from the first four bytes and the columns, not the file name — and puts
every record through three filters, each cheaper than the next:

- **Complete.** Fat, protein, carbohydrate, fibre, sugars and water, all six.
  Stricter than the `REQUIRED` backbone the audits use, and deliberately: that
  rule decides whether a figure may be kept, this one decides whether a record
  is worth a person's attention, and there is no reason to spend attention on
  one that arrives already short. Alcohol is not required — most tables omit
  the column for anything that is not a drink, and its absence means zero.
- **New.** Every alias and extras file, all four sources, read as one map of
  record name to our food. A Swedish re-run recognised 376 of 380 rows as
  already ours in testing, which is the number that makes the rest readable.
- **Notable.** How far out the record sits on fat, fibre, sugar, protein,
  alcohol or dryness, as a percentile *within what is left after the first two
  filters* — the comparison that matters is against the records we could still
  take, not against the ones we already have. Top tenth on any axis to appear
  at all.

Percentiles rather than fixed thresholds because the three tables are not on
one scale, and a threshold tuned to Ciqual would silently mis-sort Frida. Two
things that took a test to see: ties have to take the bottom of their own run
from **both** ends, or fifty identical records at 80g of water all read as the
96th percentile for dryness and bury the one food that is actually dry; and a
percentile needs a population, so below forty usable records the ranking is
switched off and everything comes back, which is the right answer for a list
short enough to read whole.

What it does not do is decide. It cannot tell a food from a prepared dish and
it does not know whether anyone buys the thing. It gives back
`harvest-picks.json` — records and figures, with the nearest food we already
have printed beside each so a near-duplicate is visible rather than discovered
later. The name, the category, the portion and the trait list are decisions,
and they are made in the repo.

**Twenty-four foods removed, and a sugars figure derived rather than typed.**
A pass over everything still without figures, deciding what the list is actually
for. Three groups came off.

*Foods nobody eats in the state we list them.* Every dried mushroom — porcini,
trumpet chanterelle — plus dried chilli. They are rehydrated and cooked, so a
per-100g figure for the dry thing describes a state that never reaches a plate,
and the 10g portion pretends otherwise. Their fresh counterparts stay.
`Chili (fresh)` keeps `bothWays` and its suffix for the same reason
`Oregano (dried)` does: the choice in the shop is real whether or not we list
the other half.

*Foods with nothing to say.* Dried strawberries carried one trait, fiber. Dried
cherries, dried lychee, currants, enoki, lion's mane, trumpet chanterelle,
za'atar, shawarma mix, tiger nut, nori, labneh, coconut yoghurt, kvass — a
trait list that is either empty of anything actionable or duplicates a food
already here, and no figures after four national tables.

*Matches already turned down.* Worcestershire Sauce and the two in
`usda-declined.json`, Brown Gravy and Instant Ramen. Kept as records they were
proof against re-deciding; as foods they were rows that could never be filled.
Hoisin, oyster sauce and pickle relish went with them — all three were in the
19 whose USDA sugars figure failed the derivation gate, and none is worth a
round of its own.

**464 foods, 446 with figures. 18 without, down from 39.**

**Maple syrup: a figure worked out rather than left missing.** USDA gives 67.4g
of carbohydrate, 32.2g of water and no sugars, because the derivation code on
that one value is not one we accept. But maple syrup is sucrose, glucose and
fructose in water and very little else. Leaving it missing put a 25g portion of
almost pure sugar into the meal builder's unknown.

So a food may now declare `sugarsOfCarbs: 0.9` and the builder works the figure
out from the food's own carbohydrate — 60.66g, 15.2g in a portion. Worked out
rather than typed in, so it follows the source if the source changes, and the
line records it as `derived`. `check-data.js` holds the fraction to a fraction,
allows it on `sugars` only, and fails a derived figure whose food does not
declare one. This is deliberately narrow: it is for a food whose sugar fraction
is not in doubt, not a way to fill gaps in general.

**Two rows that did nothing.** `Oregano (fresh)` and `Rice Milk` carried no
figures and no traits — nothing to put in a meal, nothing to filter on, nothing
to say on a food page. An entry that answers no question the tool asks is worse
than an absent one, because it reads as covered. Both removed. 488 foods.

Oregano (fresh) was one of the twelve added to complete a fresh/dried pair;
eleven of those found figures and it never did. `Oregano (dried)` keeps
`bothWays` and its suffix, since the choice a shopper faces is real whether or
not we list the other half. Rice Milk was among Ciqual's nine finds and was
never picked; if it comes back it comes back as a new food with figures
attached.

**The borrowing landed, and immediately disproved four tags.** 61 figures on 41
foods — 40 lactose, 21 polyols, 7 held down to the food's own sugars. 64 foods
now carry a real lactose figure where none did two rounds ago, and 29 a polyols
figure where none did ever. Three of the four tags it broke were `over_3g_lactose`
resting on total sugars, which is exactly what the column was borrowed to stop:

- **Milk chocolate** — tagged on 56.2g of sugars, nearly all sucrose. Real
  lactose 7.4g/100g, so 2.22g in a 30g piece against a 5g dose.
- **Ice Cream** — tagged on 16.5g of sugars. Real lactose 3.35g in a 100g
  serving.
- **Quark (~1%)** — 4.82g in a 200g tub against the 5g dose. The closest call
  the borrowing produced, 0.18g under. Tag dropped, and `fodmaps` with it, since
  the lactose was the FODMAP. `Quark (~10%)` is 6.00g and keeps both.

**Two of those three stay tagged anyway, and the reason matters.** Monash
measured milk chocolate and ice cream directly and gives a low-FODMAP serving
under our portion — 20g for the chocolate, none at all for the ice cream. Their
lactose threshold is lower than our 5g. A direct measurement of the food beats
our arithmetic on a column borrowed from another country's comparable food, so
both keep the tag, recorded in `DELIBERATE` next to the cinnamon bun and the
turmeric. Quark has no Monash entry either way, so nothing outranks the
arithmetic there and the tag goes.

That is the shape of the whole thing: the borrowed column is better than total
sugars and worse than a measurement of the food itself, and it should win
against exactly one of them.

The fourth was **Vegan Cheese (Cashew)**, whose figures arrived with the French
round: `bile_stimulant` had been assigned by hand and comes to 7.64 fat
equivalents in a 20g portion against a dose of 9.5. Dropped. Figures arriving is
how a hand-made tag gets tested, again.

**The same warning had two opposite answers, and it only gave one.** Once the
three foods above were restored in the repo, feeding the builder the *same*
download warned about the *same* three — correctly, because that file really is
missing them. But the advice was "re-run that audit", and re-running was the one
thing that would not help: the repo's copy was already right, and step 3 is
optional, so the fix was to leave the file out.

A count cannot tell those apart; the names can. The builder now lists which
foods would go, and separates the two cases by asking whether the repo's copy is
a superset of the uploaded one. If it is, the file is simply older — *leave it
out, nothing to re-run*. Only a file with something new **and** something missing
is the half-written one the warning was built for. The extras object gets the
same net, since a dropped borrowed column is invisible: the food keeps every
other figure it had.

**A food must never be offered its own source's extras, and three lost their
figures proving it.** Goats Milk, Skyr and Whey Protein take their figures from
Frida — Livsmedelsverket has none of them. The extras list was built from "has
figures, carries `allergen_milk`, has no lactose figure", which all three
satisfy, so the Danish audit offered them back to Denmark. A pick belongs to
exactly one file, and they were now extras picks, so all three vanished from
`frida-aliases.json` and came back as extras lending *nothing* — Frida has no
lactose for any of them. The builder caught it as three foods about to lose
their figures, which is exactly the alarm it was built for.

The rule was already written down one line up — a full match brings every column
that table has — but only as a check on two files disagreeing, not as a
constraint on what gets offered. Both audit pages now skip a food whose figures
came from that same table, and `check-data.js` fails the state directly.

**And a fourth kind of stale pick: the food renamed away.** `Cows Milk` came
back in the alias file as a confirmed match for a name that no longer exists,
because the browser had it from before the rename. All three audit pages now
drop picks for names the repo does not have. That is the whole set of ways a
pick can be settled or void: declined, refused, superseded, and gone.

**Nothing was reading the generated files, and one of them stopped parsing.**
The dairy rename swept the repo with a regex; one of its patterns matched the
*key line* of the last entry in `nutrition-ciqual.js` and deleted it, leaving
the body attached to the entry above. The file was broken JavaScript from that
moment, and **both checks passed** — `check-data.js` reads `nutrition-data.js`
and the alias files, `check-site.js` reads pages, and the refused-list scan uses
a regex rather than a parse. It shipped in v1.61 and would have taken France's
whole rung off the ladder silently.

`check-data.js` now evaluates every generated file and holds it to the files it
was built from: a written entry must be a food and be in the alias file, an
alias must be written or refused, an extras entry must be confirmed. Verified by
breaking `nutrition-ciqual.js` again on purpose.

**An English dairy name does not name one product.** *Cream* is anything from
18% to 48% depending on which country's shelf it came off; *sour cream* is 20%
in America and 12% in Sweden; *crème fraîche* is 34% unless it is the *légère*
at 15%. The figures behind those names are one specific product each, and the
name was not saying which. Eight now do: **Creme Fraiche (34% fat)**, **Sour
Cream (12% fat)**, **Cream (40% fat)**, **Lactose-free Cream (40% fat)**, **Cows
Milk (3% fat)**, **Cottage Cheese (4% fat)**, and the two plain yoghurts.

The number in the name is the **shelf** figure — the one on the tub — not the
measured one, which is what makes it useful when you are standing in front of
the tub. Gräddfil is sold as 12% and analyses at 11.5.

Not every food gets one. Butter is 80% everywhere, parmesan is parmesan, and a
suffix that distinguishes nothing is noise on the list. The rule is whether the
same English word buys materially different things in different countries.

The landing page's demo strips the parenthesis for display — one of each food
there, so the fat level is answering a question nobody asked.

**Two more of the same duplicate as Sour Cream.** `Yogurt` and `Yoghurt 3%` were
the same Livsmedelsverket entry, the same portion and the same three traits —
one product under two names, and the bare one was also the only food spelling it
the Swedish way while `Greek Yogurt`, `Flavored Yogurt` and `Lactose-free
Yogurt` did not. Now `Yogurt (0.5% fat)` and `Yogurt (3% fat)`, and the bare one
is gone.

**And `White Cheese (~0% fat)` was a third quark.** It matched *Kvarg naturell
fett 0,2%*, and the mistake goes back further than the match: `lmv-swedish.json`
gave its search term as *Kvarg*, so the audit was asked for a quark and found
one. Everything downstream followed — a 0.2% "fat" level no brined white cheese
has, sitting on a 30g cheese portion where the two real quarks carry 200g. The
French round confirmed it from the other side by offering it a feta's lactose,
which would have reported a sixth of what a quark holds.

White cheese is a brined feta- or halloumi-like cheese — beyaz peynir, sirene,
brynza — and Livsmedelsverket's word for that shelf is *salladsost*, which
`Feta Cheese` already holds at 22%. So the food was removed rather than
re-pointed: what it added was a near-zero-fat variant that does not exist, and
what it would become is a food we have. If a genuinely low-fat white cheese is
wanted later it is a new food with its own search term, not this one repaired.
490 foods.

**The first extras round: 39 foods, and a rule the borrowing needed.** France
lent lactose to 37 foods and polyols to two, which is most of the dairy shelf.
Three of the numbers are the ones worth having: flavoured yoghurt was being
checked against 10g of total sugars and has 3.19g of lactose, ice cream against
16.5g and has 4.69g, milk chocolate against 56.2g and has 11.5g. Checking
lactose against total sugars does not merely lack precision there — it is wrong
by a factor of three to five, and always in the direction that says *avoid*.

But eight came back **above** the food's own Swedish sugars figure: butter 0.5
against 0.2, plain yoghurt 3.21 against 2.9, mozzarella 0.7 against 0.4. No
single table can produce that — lactose is one of the sugars — but two tables
measuring two samples can, and the borrowing is precisely that. A row saying it
holds more lactose than sugar is wrong on its face.

So a borrowed lactose figure is **capped at the food's own total sugars**. That
is not arithmetic tidying: for plain dairy every gram of sugar *is* lactose, so
the cap is the right answer rather than a tolerable one, and it cannot inflate
anything — which matters more here, since the thing it replaces overstates.
`check-data.js` fails any row with more lactose than sugar, so the cap is
checked rather than trusted.

**Two extras picks declined, both the same failure.** `White Cheese (~0% fat)`
was offered a feta's lactose, 0.5g — but the food's own Swedish entry is *Kvarg
naturell fett 0,2%* and its figures are a quark's, 5.2g carbohydrate and 3.2g
sugar where a feta has about 1g. Lending a feta's lactose to a quark's backbone
would report a sixth of what is there, and understating lactose is the one
direction that matters. (Whether the *Swedish* match is the right one is a
separate question, and still open.) `Cheese Puffs / Snacks` was offered a butter
feuilleté's; the food is Ostbågar, an extruded corn snack. Both in
`ciqual-declined.json` with the reasoning, and `check-data.js` now fails a name
that is in both the extras file and the declined file — the same rule the alias
file already had.

**Sour Cream (~20% fat) was Creme Fraiche.** Same Livsmedelsverket entry —
*Crème fraiche fett 34%* — same seven figures, and a name claiming 20% fat for a
34% figure. Two rows, one product. Dropped; `Creme Fraiche` keeps the entry
under its own name. `Sour Cream (~10% fat)` is *Gräddfil fett 12%*, a genuinely
different product and the only one of the three under the fat dose, so it stays
— renamed `Sour Cream`, since the pair it was distinguishing itself from is
gone. Crème fraîche and soured cream are not the same thing in general: different
cultures, different fat, and crème fraîche does not split when boiled. They were
the same thing *here* because both pointed at the same row. 492 foods.

**Lactose and polyols can be borrowed a column at a time, and nothing else
can.** Everywhere else on the ladder a source answers for a food or it does
not, and Livsmedelsverket wins where both have a figure. These two are
different in kind: Livsmedelsverket publishes neither for any food, so there is
no Swedish figure to override and no Swedish round that could ever produce one.
51 foods with `allergen_milk` had Swedish figures and no lactose figure, so
their lactose line is checked against total sugars — which is why lactose-free
milk still reads as full of it — and 35 foods tagged `polyols` have never had a
figure behind the tag.

So an **extras match**: `tools/frida-extras.json` and `tools/ciqual-extras.json`,
confirmed by hand one food at a time exactly like a full match, but made *for* a
food a table above already covers. It lends lactose and polyols and nothing
else. The backbone stays wholly Swedish, and each borrowed number is marked
`borrowed: { lactose: "ciqual" }` on its own line so a reader can see it is not
the row's own source.

The backbone rule deliberately does not apply here. It exists to keep a food
with a hole in the middle of it out of meals; an extras match adds no food to
any meal and no weight to any denominator, it adds one number to a food that is
already whole. A French record with a lactose figure and no water is useless as
a food and perfectly good as a lactose figure.

The ladder rules in `check-data.js` run backwards for extras, and that is the
point: a food with *no* figures cannot take one — it would arrive carrying
lactose and nothing else, which is exactly the partial entry the backbone keeps
out — and a food cannot hold both a full match and an extras match from the same
table, because the full match already brings every column that table has. Which
columns may be borrowed is written down in three places, so that is checked too.
All five rules verified by planting them.

Frida lends lactose only; it has no polyols column. Ciqual lends both. Both
audit pages now offer these foods at the bottom of the list behind their own
heading, with their own download, and say plainly that skipping them changes
nothing that works today.

**A declined food came back, because the browser outlived the decision.** The
next USDA export carried 38 foods instead of 36: Brown Gravy and Instant Ramen,
declined in v1.53 and written up with reasons, were back — and `check-data.js`
caught it as six faults the moment the files landed. Neither the audit nor the
export was wrong. The picks were still sitting in `localStorage` on the phone
that made them, and the audit page filled its picks from the alias file and the
browser without ever reading `usda-declined.json`. Only the workbench read it.

So a record the repo keeps was being enforced in one place and ignored in the
one place that could act on it. Both audit pages now fetch their declined list
alongside the alias file, drop any pick the repo has turned down, save the
result, and say which ones they dropped and where the reason is written. A
decision made in the repo now survives contact with a browser that disagrees.

**And the workbench had the same blind spot, twice over.** It read the browser's
picks against the alias files and called anything missing outstanding work. Two
things are missing from an alias file without being unfinished. A *refused*
food: the match was right and the figures too thin. And a *superseded* one:
Teriyaki Sauce was an American match until France produced a complete record for
it, so the American alias was dropped — correctly — while the pick stayed in the
browser that made it, where it read as a whole round gone missing. Both are
settled now, alongside declined.

Superseded and extras look identical from there — a pick for a food that already
has figures — so they are told apart by whether a column is left to lend. If
there is one, the pick is real work waiting for its file, and the page says
which file.

The same round found `check-data.js` reporting the five *refused* foods as
"matched but have no figures yet — rebuild nutrition-data.js". No rebuild will
ever fill them; that is the point of refusing. The rule now reads the
`NUTRITION_*_REFUSED` lists out of the generated files and reports those
separately, as the settled decision they are.

**A partial entry can be worse than no entry, and the meal builder is where
that shows.** The doubt was about mixing in foods with thin data, and it turned
out to be sharper than it sounded. A food with *no* figures is set aside: it
contributes neither weight nor nutrient, so it changes nothing. A food with
*some* figures puts its whole weight into the denominator of every
concentration and its missing figures into the numerator as zero — so the meal
reads leaner, drier and less sugary than it is. That is the direction that
hides a real load rather than inventing one, and only water was guarded
against it.

**The fix is to bound the unknown rather than assume it.** A food cannot hold
more of a nutrient than it weighs, so its grams are the most it can be hiding.
Every signal is now read at both ends of that bound and reported only where
they agree; where they disagree the honest answer is silence. Refusing outright
whenever any figure is missing was tried first and is too blunt: 26 of the
American entries lack sugars, so a 5g pinch of oregano would have silenced the
sugar line for a whole plate.

Checked on real meals. 200g of raisins with 50g of kimchi: sugars 48–68% of the
meal, so the sugar line holds at both ends and is reported; fat is 1g known
against 51g possible, so the fat line goes quiet. Fully figured meals have zero
headroom, so nothing about them changed.

**And then five entries were refused outright, by a rule in the tool.** Fat,
protein, carbohydrate and water are the backbone every line leans on, and
`REQUIRED` in `usda-core.js` now turns away any food short of one. Kimchi is
the case that settled it: two figures of seven, *neither of which drives any
signal*, and 50g of missing fat, protein and water able to quiet all of them.
It gave nothing and cost the meal its answers. Currants, Enoki, Teriyaki Sauce
and Worcestershire Sauce go with it — 36 of 41 stay.

Fibre, sugars and alcohol are deliberately not in that rule. A gap there
silences its own line and nothing else, and most of the foods carrying one are
spices at 5g, where the headroom is far too small to change any answer.
Refusing those would throw away 26 sound entries to avoid a rounding error.

The rule lives in the tool rather than in a decision made once, so the next
round applies it without anyone remembering to, and both the page and the
command line say what they turned away and why.

**The American round landed, and figures arriving retagged eight foods.** 41
confirmed out of 43 picked, 449 with figures. The build was +43 and nothing
else, so the ladder held: no Swedish or Danish food moved.

**`T` and `JA` finally said what they are**, because the export explains its own
codes and the reader now keeps the description. `T` is *"taken from another
source — other tables of food composition"*: a figure borrowed from a table USDA
does not name, which is the one thing this ladder cannot allow, since every rung
exists so a food can say which national table its figure came from. `JA` is
*"aggregated data involving combinations of data with only source codes 1 and 12
and/or 13"* — analytical mixed with a manufacturer's own analysis. Both are now
named in `REJECTED` rather than sitting unclassified.

**Eight foods were tagged by hand and the numbers disagreed.** Five carried a
trait their figures do not reach: Lotus Root and Currants lose `fiber`, Durian
and Naan Bread lose `over_10g_fat`, Sunflower Seed Butter loses `protein` and
`fiber` while keeping the fat it genuinely has. Three reached a dose nobody had
tagged: Sheeps Milk gains `over_10g_fat` and `bile_stimulant` at 14g of fat in a
200g glass, and Horseradish Sauce gains `bile_stimulant` at 50.9% fat.

**Fontina is the interesting one.** It had been reasoned about rather than
measured: Roquefort's Danish figure of 29.5% fat gives 5.9g in a 20g portion,
just under the 6.1 dose, and Fontina and Raclette were given the same answer by
analogy. Fontina's own figure is 31.1%, which is 6.22g — just over. So it gains
`over_10g_fat` and the analogy was wrong by a third of a gram. Raclette still
has no figures and still sits on the inference.

**Two matches were dropped rather than imported.** *Instant Ramen* matched
"Soup, ramen noodle, any flavor, dry" — 6.52g of water per 100g against a 175g
served portion, which `check-data` names on its own as the dry form of a food
served wet. *Brown Gravy* matched "Gravy, au jus, canned" at 0.2% fat, which is
a thin pan juice and not a thickened gravy; the traits and the figures disagree
by two orders of magnitude. Both are form mismatches of exactly the kind this
project keeps meeting, and neither is fixable by retagging — the ramen needs a
`madeUp` ratio off the packet or a prepared entry, the gravy needs a different
food. They are out of `usda-aliases.json` until then.

**Three foods arrive without a water figure** — Enoki, Kimchi and Worcestershire
Sauce, all of it lost to `T` or `JA`. That is not silently wrong: the meal
builder already refuses to report how dry a meal is unless every food in it has
water, so those meals simply do not get the water signal. Kimchi is the thinnest
entry in the file at two figures out of seven, and it is worth deciding whether
it earns its place at all.

**The Danish round landed: 30 confirmed, 408 with figures.** Adzuki Bean
Sprouts and Canned Strawberries in Syrup, both of which had been sitting in the
American audit's offer list waiting for Denmark to be asked first. The build
came back +2 and nothing else: no food changed, none was dropped, 378 from
Livsmedelsverket and 30 from Frida.

`nutrition-frida.js` was reconstructed rather than re-downloaded, because it
could be proved rather than guessed: the repo's 28 entries plus the two from
the earlier short download, all with their `ref` lines. Every value was checked
against the built `nutrition-data.js` — 29 matched exactly and **Matcha did
not**, by a factor of a hundred. That is the dilution, not a fault:
`madeUp: { parts: 1, water: 100 }`, powder in the source file and bowl in the
build, and `dilute()` reproduces the built figures to the last decimal. The
check that looked like a mismatch is the one that confirms the dilution is
still being applied.

Canned strawberries came in at 20.1g of sugar against fresh strawberry's ~5,
which is the same pattern the four canned fruits showed in v1.36, and it
carries `refined_carbs` already.

**Does uploading one source drop the other? No — and the page proves it now.**
A fair thing to be suspicious of: the build always needs the Livsmedelsverket
export, so what happens to the Danish foods when you hand it the American file?
Nothing. `Object.assign` walks the rungs in ladder order and an uploaded file
replaces **that rung only**; the rest still come from the repo.

Measured rather than asserted, with a stand-in USDA file in the repo and a
Danish file carrying one food more than the committed one:

- nothing uploaded → `lmv 378 · frida 28 · usda 2`
- only the new Danish file uploaded → `lmv 378 · frida 29 · usda 2`

The extra Danish food arrives, the American ones stay. The caveat is the obvious
one and worth saying out loud: a rung falls back to *what is in the repo*, so a
round that has not been committed contributes nothing to a build that does not
upload it.

So the build page prints the rungs: *"Below Livsmedelsverket: by hand 0 foods
(nothing in the repo) · USDA 2 foods (the repo) · Frida 29 foods (the file you
added)."* The question answers itself every build, instead of needing to be
asked.

**Chasing the extension was the wrong fight, and the real fault was elsewhere.**
Setting the blob to `text/javascript` so a phone would write `.js` made it write
`.bin` instead, which the widened `accept` list did not cover either. There is
no type that reliably yields `.js`, so the page stopped asking: `text/plain` at
least gives a `.txt` you can open, and the picker has **no** `accept` filter at
all. Nothing was ever trusted from the name — `symbolFrom` reads the file — so
the filter was only ever hiding the file you actually had.

The thing that was really blocking, though, was not the extension. Loading the
generated file in step 3 reported *"Using: … → Frida, 30 foods"* and then
produced nothing, for as long as it took to work out that **step 2 was still
empty**. There is nothing to build without the Livsmedelsverket export — 378 of
406 foods come from it, and these files only fill in the rest — but the page
said none of that, so it read as a hang. It says it now, in the same status
line, and the heading admits that step 3 is optional while step 2 is not.

Reproduced end to end: a `.bin` in step 3 with step 2 empty is accepted, named
as Frida with its food count, and told what is missing; adding the export then
builds 406 and downloads `nutrition-data.js`.

**A phone renamed the download and the builder then refused to show it.**
`nutrition-frida.js` arrived in the downloads folder as
`0d4ebe24-37ce-4567-ac1e-ac34f102abbd.txt`, and step 3's
`accept=".js,text/javascript"` hid it from the picker completely. Two ends of
one problem, and both are fixed at the end that can actually be relied on.

The download helper was asking for it: a `text/plain` blob for a `.js` file,
an anchor that was never put in the document, and the object URL revoked on the
very next line. All three are things a desktop forgives and a phone does not.
It picks the type from the extension now, appends the link before clicking, and
waits before revoking.

But a phone may rename the file regardless, so the picker stopped caring.
`accept` is deliberately wide — `.js`, `.json`, `.txt` and their types — and
nothing is trusted from the name anyway: `symbolFrom` reads the file and takes
it for whichever of `NUTRITION_FRIDA`, `NUTRITION_USDA` or `NUTRITION_MANUAL`
it declares. Checked with the real filename from the phone: a file called
`0d4ebe24-….txt` is read, reported as *"→ Frida, 28 foods"*, and builds 406.

The step says so too, and so does the workbench: **the filename does not
matter.**

**"No food records found" was true, unhelpful, and partly the page's own fault.**
The Danish workbook went into the build page's step 2, which takes
Livsmedelsverket's export, and the answer was *"no row had a recognisable name
column"* — accurate, and useless: it reads as a fault in the file rather than a
file in the wrong slot.

Step 2 invited it. Its text said *"the same file the audit takes"*, written when
there was one audit. There are three now, and it reads as "whichever audit you
just ran". It names Livsmedelsverket outright, and says in as many words that
Frida's workbook and USDA's JSON go into their own audits while the small
`nutrition-*.js` that comes back goes in step 3.

And the failure diagnoses the file instead of the columns. Both are recognisable
on sight: Frida's sheet carries `↓FoodName` and `ParameterID` markers, USDA's
JSON carries `SRLegacyFoods` or `FoundationFoods`, and a generated file declares
`NUTRITION_FRIDA` and friends. All three now come back naming the file and the
page it belongs on. The Swedish audit had the identical message and the
identical trap, so it got the same treatment.

Checked in a browser, four files each: Frida-shaped workbook, USDA JSON, a
generated file, and the real export — the first three named correctly, the
fourth still reading 378 records and building 406.

**The workbench sent you to the wrong tool, because it could only see the repo.**
It read frida 28 aliases / 28 generated / 28 live, found no drift, and moved on
to "87 foods have no figures" — while a finished Danish round sat in the
downloads folder, uncommitted. From the repo's side everything was consistent.
The state that mattered was not in the repo at all.

It is in the browser, though. Every audit page keeps its picks in
`localStorage` so a half-finished round survives a reload, and that same store
says when a round is *finished* and merely uncommitted. The workbench reads all
three keys now and leads with what has not landed: *"2 Danish picks have not
reached the repo yet — Adzuki Bean Sprouts, Canned Strawberries in Syrup.
Finish this before starting a source further down the ladder."* The shapes
differ and both are handled: the Swedish page records `{record}` or
`{kind:"absent"}`, because "not in the database" is an answer there; the other
two record a plain name.

**And it stopped guessing which audit is next.** The old rule was
`frida aliases === 0 ? Denmark : America` — which is not ladder order, it is
"has Denmark ever been run". Whether a source covers a given food is only
knowable with that file open, so the page states the order and leaves the
choice rather than naming a tool it cannot actually choose.

**The whole chain, checked as one thing rather than four.** Driven in a browser
with nothing touching the repo: the American audit read Foundation, a match was
picked for Lion's Mane, both files downloaded, and those went into the build
page together with the export. Out came `nutrition-data.js` with **407** foods —
`lmv 378 · frida 28 · usda 1` — and Lion's Mane carrying `src: "usda"`. That the
Danish 28 survived is the point: the build page had to read the repo's
`nutrition-frida.js` correctly while the American file was being overridden.

Two faults found doing it.

**The build page was reading root files through the service worker.** It pulled
`nutrition-manual.js`, `nutrition-usda.js` and `nutrition-frida.js` with
`<script src="../...">`. `/tools/` bypasses the worker, but those requests are
for files at the *root*, so they went through it and could be served stale —
the same staleness that once had the audit offering foods it had already
matched. All three are fetched with `cache: "no-store"` now, and the file inputs
wait on that fetch rather than telling you to try again in a moment.

**`usda-aliases.json` was validated by nothing.** `check-data.js` held the three
Swedish files to each other and had a rule for Frida, and the American file had
walked in without one. It now fails on an alias that names no food, on a food
that already carries an `lmv` entry, and on a food that has **both** a Danish
and an American match — which is exactly the shape running the audits out of
order produces. Checked by planting all three: all three faults fired, and the
file restored clean.

**And the handoff is written down on the workbench**, because that is the page
that gets opened on a phone: what you do, what each tool hands back, what Claude
does in the repo, and the one constraint that is easy to trip over — a commit is
needed *between* sources, since each audit offers the foods with no figures as
of the `nutrition-data.js` in the repo. Finish Denmark, send it, let it land,
then start America. `check-data.js` now fails on that pair rather than leaving
it to be spotted.

**The build page never read the files you had just downloaded.** It pulled
`nutrition-frida.js`, `nutrition-usda.js` and `nutrition-manual.js` from
`<script src="../...">` — the copies committed in the repo. So the working
round-trip was: run the audit, get the generated file into the repo, *then*
build. It worked, but only because the commit happened in between, and the
workbench described the page as building "from an export plus the generated
files", which was not true of anything the page could see.

It takes them now. An optional input on the build page accepts the generated
files, and each one replaces the repo's copy of that source outright — a
generated file is meant to be the whole of that source, so a short one is a
warning rather than something to merge around. The warning is the same net as
the workbench, one step later: *"holds 2 foods but the repo's copy holds 28.
Building with it drops the other 26."* Uploading after a build rebuilds, so the
figures follow the files.

**The obvious way to identify the files was wrong, and quietly.** Evaluate the
text and ask `typeof NUTRITION_FRIDA` — except this page already carries all
three as globals from its own script tags, and a name inside `new Function`
falls through to the global when the file did not declare it. Every file
matched the first rung and came back as the page's own empty hand-entered
object, reporting "0 foods" and silently changing nothing. Testing the text for
the declaration first fixes it: then the `const` inside the function body
shadows the global and the value is the file's.

Driven in a browser, four ways: the repo's own files build 406 as before; the
real two-food Frida file is identified as Frida, warns, and rebuilds to 380 so
the 26 lost are on screen; the full 28-food file restores 406 with no warning;
`lmv-core.js` is ignored by name with a reason.

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

*Oregano (fresh) has since been removed — see "two rows that did nothing"
below. Eleven of the twelve found figures; that one never did, and never
carried a trait either.*

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
