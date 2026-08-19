# Food Intolerance Guide — the free version

Live at [monsterardadrys.github.io](https://monsterardadrys.github.io).

A database of the food properties that can cause discomfort — FODMAPs,
histamine, the fourteen declarable allergens, salicylates, bile stimulants.
Mark several foods and it lists what they have in common. Two tools:
**Shared traits** and the **Meal builder**. Everything runs in the browser
and stores nothing anywhere but the device.

Built by a dietitian for dietitians and other health professions, as
continuing-education material. It describes foods, not people.

## Two repositories, handled separately

This one is the free version and owns itself: its pages, its scripts, its
styles and its data. The full database lives in a private repository and
owns itself too. Neither is generated from the other, and neither has to be
checked out to work on the other.

The data here started as a cut of the full database — 100 of its foods,
30 of its 43 properties, 7 of its 21 articles — but that was a decision
taken once, not a pipeline. When the full database gains a round of foods,
this one gets a considered copy of whatever is worth putting in the sample,
or it gets nothing.

**It is not expected to keep up, and falling behind is not a fault.** A
sample is meant to show what the tool does and what its data looks like,
which does not change when a hundred and first food is added somewhere
else. Treating it as a mirror would mean every round of work in the full
database owing this repository a release; it does not.

An earlier version of this file said nothing was authored here. That was
never how it worked: every release since the split has edited these pages
directly, which is right, and the claim only made the repository harder to
work on.

What does have to hold is that **nothing paid ships here** — and that is
checked in this repository rather than promised by the other one, because
this is where the risk is:

    node tools/check-free.js

It fails if a locked food carries anything but its two names, if a locked
article carries its text, if a property the sample excludes reappears, or
if text from a locked article turns up anywhere in the shipped bytes. It
also runs the release checks the site used to have: every link resolves,
every visible string has a Swedish one carrying the same markup, and all
eight footers agree on one version and one date.

| | Free (here) | Full |
|---|---|---|
| Foods | 100, with figures and traits | 582 |
| Other foods | shown by name, greyed | — |
| Traits | 30 | 43 |
| FODMAP detail | one trait, plus lactose | fructose, polyols, fructans, GOS |
| Irritant detail | one trait, plus alcohol and caffeine | capsaicin, peel, allyl compounds, carbonation, acetic acid |
| Cross-reaction detail | one trait | birch, grass, mugwort, latex |
| Allergens | all 14 declarable | all 14 declarable |
| Articles | 7 of 21, the rest by title | 21 |
| Tools | Shared traits, Meal builder | and Foods without |
| Print, save to file | — | yes |
| Install as an app, offline | — | yes |
| Languages, method, sources | whole | whole |

The two share most of their scripts and pages by having been copied from
one another, not by a build step. The visible difference is in the data,
plus one place in `food-picker.js` that draws a locked food and one in
`articles.js` that draws a locked article.

**What is never cut:** the disclaimer, the method page, the data sources,
and the second language. A tool that puts its own provenance behind a
paywall has the priorities backwards, and a health tool that ships fewer
allergens is not a smaller version of itself.

## Running it

Any static server. There is no build step and no dependency to install:

    python3 -m http.server 8000
    node tools/check-free.js

## What this is not

Not a diagnosis, not a diet, and not a substitute for a dietitian or a
doctor. A food carrying a trait does not mean anyone reacts to it, and a
food carrying none does not mean it is safe. See the disclaimer on every
tool page, and `method.html` for how every threshold in it was set.
