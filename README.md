# Food Intolerance Guide — the free version

Live at [monsterardadrys.github.io](https://monsterardadrys.github.io).

Pick a handful of foods someone reacts to and the tool ranks what they have
in common — a FODMAP, a histamine load, a hidden allergen. Two tools:
**Shared traits** and the **Meal builder**. Everything runs in the browser,
works offline once loaded, and stores nothing anywhere but the device.

## Nothing here is authored here

**This repository is output.** The data files are generated, the pages are
copies, and an edit made here is an edit that the next build overwrites
without noticing. The source — the full food database, the tools that read
the national food tables, and the checks that hold the two languages level —
lives in a private repository, and so does every change.

That is not tidiness. It is the only arrangement that works for a static
site: a browser is handed the JavaScript it runs, so the difference between
the free version and the full one has to be a difference in which bytes
were shipped. A flag that hides data ships the data it is hiding.

| | Free (here) | Full |
|---|---|---|
| Foods | 100, with figures and traits | 582 |
| Other foods | shown by name, greyed | — |
| Traits | 30 | 43 |
| FODMAP detail | one trait, plus lactose | fructose, polyols, fructans, GOS |
| Irritant detail | one trait, plus alcohol and caffeine | capsaicin, peel, allyl compounds, carbonation, acetic acid |
| Cross-reaction detail | one trait | birch, grass, mugwort, latex |
| Allergens | all 14 declarable | all 14 declarable |
| Tools | Shared traits, Meal builder | and Foods without |
| Languages, articles, method, sources | whole | whole |

Both builds share every script and every page. The cut is in the data, and
in one place in `food-picker.js` that draws a locked food.

**What is never cut:** the disclaimer, the method page, the data sources,
and the second language. A tool that puts its own provenance behind a
paywall has the priorities backwards, and a health tool that ships fewer
allergens is not a smaller version of itself.

## Running it

Any static server. There is no build step here and no dependency to install:

    python3 -m http.server 8000

## What this is not

Not a diagnosis, not a diet, and not a substitute for a dietitian or a
doctor. A food carrying a trait does not mean anyone reacts to it, and a
food carrying none does not mean it is safe. See the disclaimer on every
tool page, and `method.html` for how every threshold in it was set.
