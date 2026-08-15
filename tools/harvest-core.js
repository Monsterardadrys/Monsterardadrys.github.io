/*
    harvest-core.js — reading a national table the other way round.

    Every other tool here starts from a food we decided to list and goes
    looking for figures. This one starts from the figures. It takes a whole
    export, throws away everything we could not use or already have, and ranks
    what is left by how likely it is to be worth listing — so the question
    stops being "does this food have data" and becomes "which of this data is
    worth a food".

    Three filters, in order, because each is cheaper than the next:

      1. COMPLETE — a record missing fibre or sugars cannot answer the
         questions this site is for, whatever else it has. Stricter than
         REQUIRED in the two readers: that one decides whether a figure may be
         kept at all, this one decides whether a record is worth a hand
         looking at it, and there is no reason to spend attention on a record
         that arrives already short.

      2. KNOWN — the record is already matched to one of our foods. Read out
         of the alias and extras files, so it needs no list of its own.

      3. NOTABLE — how far out on any axis the record sits, as a percentile
         within its own table. This is the whole idea: a table is mostly
         unremarkable food, and a record that is unremarkable on every axis we
         tag is not worth adding however complete it is. Percentiles rather
         than fixed thresholds, because the three tables are not on the same
         scale and a threshold tuned to one would silently mis-sort another.

    What it deliberately does NOT do is decide. It cannot tell a food from a
    prepared dish, and it does not know whether anyone buys the thing. The
    output is a shortlist for a person, with the nearest food we already have
    printed next to each one so a near-duplicate is visible rather than
    discovered later.
*/

(function (root) {
    "use strict";

    /* Alcohol is not here on purpose: most tables leave the column out
       entirely for anything that is not a drink, and its absence means zero
       rather than unknown. Demanding it would throw away every solid food. */
    const COMPLETE = ["fat", "protein", "carbs", "fiber", "sugars", "water"];

    /* Below this many usable records the ranking is switched off and
       everything comes back. See rank(). */
    const MIN_POPULATION = 40;

    /* How alike two names have to look, by letters alone, before the nearest
       column will offer one with no word in common. Dice on bigrams runs high
       for short names that share a few letters — Matolja and Tomato reach
       0.60 — so this sits above where the wrong answers were and below the
       real near-misses. See the fallback in rank(). */
    const LETTERS_FLOOR = 0.75;

    /* The axes worth being extreme on, and which end is interesting. Water is
       the one where low is the signal — a dry food concentrates everything
       else, and it is how the dried-fruit and spice end of the list was found
       the first time round. */
    const AXES = [
        { key: "fat", label: "fat", high: true },
        { key: "fiber", label: "fibre", high: true },
        { key: "sugars", label: "sugar", high: true },
        { key: "protein", label: "protein", high: true },
        { key: "alcohol", label: "alcohol", high: true },
        { key: "water", label: "dryness", high: false }
    ];

    function values(records, key) {
        const out = [];
        records.forEach(function (r) {
            const v = r.nutrients[key];
            if (typeof v === "number" && !isNaN(v)) out.push(v);
        });
        return out.sort(function (a, b) { return a - b; });
    }

    /* How far out a value sits, 0 to 1, and ties always take the bottom of
       their own run — which needs counting from a different end depending on
       which direction is the interesting one.

       Getting this wrong is not subtle in its effect and is very subtle to
       read: a first version counted only strictly-lower values and inverted
       that for the low-is-interesting axis, so fifty identical records at 80g
       of water all came back at the 96th percentile for dryness and buried
       the one food that was actually dry. */
    function countBelow(sorted, v) {
        let lo = 0, hi = sorted.length;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (sorted[mid] < v) lo = mid + 1; else hi = mid;
        }
        return lo;
    }

    function countAtOrBelow(sorted, v) {
        let lo = 0, hi = sorted.length;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (sorted[mid] <= v) lo = mid + 1; else hi = mid;
        }
        return lo;
    }

    function percentile(sorted, v, high) {
        if (!sorted.length) return 0;
        return high
            ? countBelow(sorted, v) / sorted.length
            : 1 - countAtOrBelow(sorted, v) / sorted.length;
    }

    /* Words, lowercased and stripped of accents, with only the connectives
       and the packaging boilerplate removed.

       What is NOT removed is the form — dried, raw, cooked, canned. Every bad
       match this project has had was fresh-for-dried or raw-for-cooked, so the
       one word that must count is the one it would be tempting to call noise.
       Keeping it is what puts "Apricot, pitted, dried" next to our "Dried
       Apricot" rather than next to our "Apricot".

       Accents come off because "Pork liver pâté" and our "Liver Pate" are the
       same three words and one of them is spelt two ways. */
    const NOISE = /^(from|with|without|and|or|the|in|of|a|an|type|prepacked|average|normal|size|refrigerated|s)$/;

    function tokens(name) {
        const out = {};
        String(name).toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .split(/[^a-z0-9]+/)
            .forEach(function (w) {
                if (w.length > 1 && !NOISE.test(w)) out[w] = true;
            });
        return Object.keys(out);
    }

    /* `same` decides when two words count as one. Exact match is the default
       and is right for English. Reading a Swedish table it is not: LMV writes
       plurals and definite forms where our names are singular indefinite, so
       "Jordgubbar frysta" shares no exact word with "Jordgubbe" and the record
       falls through to the letters fallback. lmv-core knows the endings; the
       caller passes its sameWord in rather than this file growing a second,
       drifting copy of Swedish morphology.

       `weak` marks the preparation words — färsk, kokt, torkad, konserv. They
       are weighted down rather than dropped, and the difference matters both
       ways round:

         - Dropping them loses the distinction this file exists to keep. Every
           bad match this project has had was fresh-for-dried or raw-for-
           cooked, so "Apricot, pitted, dried" has to stay nearer our Dried
           Apricot than our Apricot.

         - Counting them in full lets them decide on their own. "Bondbönor
           färska kokta" came back as Fresh Pasta, because our pasta is
           recorded as "Pasta färsk kokt" and two shared preparation words
           outvoted the one word that names the food.

       So a shared preparation word breaks a tie between foods that already
       share a real word; it cannot make a match by itself. That is two rules,
       and both are needed:

         - WEIGHT. A shared preparation word counts for a quarter, so it can
           separate two foods that are otherwise equal.

         - THE GATE. If every shared word is a preparation word, the score is
           zero. Weighting alone was not enough: "Blandfärs stekt m. salt"
           still came back as our Salt, because a quarter of a point beats the
           nothing every other food scored. A record and a food that have only
           "salt" in common have nothing in common.

       A bare number is treated as a preparation word for the same reason. It
       is usually a fat or alcohol percentage, and "Whisky vol. % 40" found
       Cream (40% fat) on the strength of the 40 alone. */
    const WEAK_WEIGHT = 0.25;

    function isWeak(word, weak) {
        if (/^\d+$/.test(word)) return true;
        return Boolean(weak && weak(word));
    }

    function jaccard(a, b, same, weak) {
        if (!a.length || !b.length) return 0;
        const eq = same || function (x, y) { return x === y; };
        const w = function (x) { return isWeak(x, weak) ? WEAK_WEIGHT : 1; };

        let shared = 0;
        let content = 0;
        a.forEach(function (x) {
            if (!b.some(function (y) { return eq(x, y); })) return;
            shared += w(x);
            if (!isWeak(x, weak)) content += 1;
        });
        if (!content) return 0;

        let total = 0;
        a.forEach(function (x) { total += w(x); });
        b.forEach(function (y) { total += w(y); });
        return total ? shared / (total - shared) : 0;
    }

    function missingFrom(record) {
        return COMPLETE.filter(function (k) {
            const v = record.nutrients[k];
            return typeof v !== "number" || isNaN(v);
        });
    }

    /* A row whose macros cannot fit in 100g is not a food, it is a parsing
       fault or a per-portion row that slipped in. Ten grams of slack, because
       fibre is counted inside carbohydrate in some tables and beside it in
       others, and rounding does the rest. */
    function impossible(record) {
        const n = record.nutrients;
        const sum = (n.fat || 0) + (n.protein || 0) + (n.carbs || 0) +
            (n.water || 0) + (n.alcohol || 0);
        return sum > 110;
    }

    /*
        records — from any of the three readers; all three give {name, nutrients}
        opts.claimed — record name -> our food name, for everything already matched
        opts.ours    — our food names, for the near-duplicate check
        opts.sameWord — optional (a, b) => boolean, when two words are the
                       same word. See jaccard.
        opts.isWeakWord — optional (w) => boolean, a preparation word rather
                       than the name of a food. See jaccard.
        opts.aka     — our food name -> what it is called in the table's own
                       language, so a Swedish record can be compared with a
                       Swedish name instead of an English one
        opts.score   — LMV.score, the bigram scorer the audits use
        opts.cutoff  — how far out a record has to sit on its best axis (0.9)
    */
    function rank(records, opts) {
        opts = opts || {};
        const claimed = opts.claimed || {};
        const ours = opts.ours || [];
        const aka = opts.aka || {};
        const sameWord = opts.sameWord || null;
        const isWeakWord = opts.isWeakWord || null;
        const score = opts.score;
        const cutoff = opts.cutoff == null ? 0.9 : opts.cutoff;

        const usable = [], incomplete = [], known = [], junk = [];

        records.forEach(function (r) {
            if (claimed[r.name]) { known.push({ record: r, food: claimed[r.name] }); return; }
            if (impossible(r)) { junk.push(r); return; }
            const missing = missingFrom(r);
            if (missing.length) { incomplete.push({ record: r, missing: missing }); return; }
            usable.push(r);
        });

        /* Percentiles are taken over the usable set, not the whole table: the
           question is how this record compares with the others we could still
           take, and the ones we have already taken are not in the running.

           A percentile needs a population, though. Once the filters have done
           their work the remainder can be small — a Swedish re-run leaves
           almost nothing, since we have most of that table already — and
           "top 10% of four records" is not a fact about anything. Below
           MIN_POPULATION the notability filter is skipped entirely and
           everything usable comes back, which is the right answer for a list
           short enough to read whole. */
        const ranked = usable.length >= MIN_POPULATION;
        const sorted = {};
        AXES.forEach(function (a) { sorted[a.key] = values(usable, a.key); });

        const candidates = usable.map(function (r) {
            const signals = [];
            AXES.forEach(function (a) {
                const v = r.nutrients[a.key];
                if (typeof v !== "number" || isNaN(v)) return;
                const rankAt = percentile(sorted[a.key], v, a.high);
                if (!ranked || rankAt >= cutoff) {
                    signals.push({ axis: a.label, key: a.key, value: v, at: rankAt });
                }
            });
            signals.sort(function (x, y) { return y.at - x.at; });

            /* Two ways of being close, and the first round needed both.

               The bigram scorer the audits use compares whole strings, so word
               order matters to it. Ciqual writes "Apple, dried" where we write
               "Dried Apple" and it scored those near zero — six straight
               duplicates came through the first harvest untouched, including
               "Pork liver pâté" against our "Liver Pate". The overlap of the
               words themselves does not care about order, and catches exactly
               that. Take whichever reads higher. */
            /* Words first, letters second, and not the larger of the two.

               The bigram scorer the audits use compares whole strings, so word
               order matters to it and a short name scores well against a long
               one that contains it — which is why the first harvest offered
               our fresh "Apricot" for Ciqual's "Apricot, pitted, dried" and
               let six straight duplicates through, "Pork liver pâté" against
               our "Liver Pate" among them.

               Shared words do not care about order and do care about the form
               word, which is the one that distinguishes those pairs. Taking
               the larger of the two scores was tried and is wrong: the bigram
               number is on a different scale and wins for the wrong reason.
               Words decide; letters only break a tie of nothing at all. */
            let nearest = null;
            if (ours.length) {
                const mine = tokens(r.name);
                let best = null;
                ours.forEach(function (name) {
                    /* Against both names this food goes by, and the better one
                       wins. Unlike the words-versus-letters pair below, these
                       two are the same measurement of the same thing — an
                       English name and a Swedish one for one food — so taking
                       the larger is right rather than a scale confusion.

                       Without it a Swedish table is unreadable: every record is
                       compared with an English list, so "Ren kött kokt m. salt"
                       came back closest to "Salt" and the whole column was
                       noise. tools/lmv-swedish.json has held the bridge for
                       312 foods all along. */
                    /* Every name this food goes by — its English one and any
                       Swedish ones — and the best of them wins. Unlike the
                       words-versus-letters pair below, these are the same
                       measurement of the same thing, so taking the larger is
                       right rather than a scale confusion.

                       There are two Swedish names because there are two
                       sources: the everyday name the site shows, and the
                       phrasing this particular table uses. Mussels is
                       "Musslor" on the site and "Blåmusslor" in the alias
                       file; the record says "Mussla", which only one of them
                       reaches. Keeping one and discarding the other loses a
                       match for no reason. */
                    let overlap = jaccard(mine, tokens(name), sameWord, isWeakWord);
                    const alt = aka[name];
                    (Array.isArray(alt) ? alt : [alt]).forEach(function (other) {
                        if (!other) return;
                        overlap = Math.max(overlap,
                            jaccard(mine, tokens(other), sameWord, isWeakWord));
                    });
                    if (!best || overlap > best.score) best = { name: name, score: overlap, byWords: true };
                });
                if (best && best.score > 0) {
                    nearest = best;
                } else if (score) {
                    /* No word in common with anything we list. Letters are all
                       that is left, and letters alone are weak evidence: they
                       matched "Matolja" to Tomato and "Maräng" to Dried Mango,
                       which is worse than useless — a wrong neighbour reads as
                       a checked one and hides that nothing was found.

                       So the fallback has to clear a floor before it is
                       allowed to speak. Below it the column stays empty, which
                       is the honest answer: this record looks like nothing we
                       have. */
                    let letters = null;
                    ours.forEach(function (name) {
                        const s = score(r.name, name);
                        if (!letters || s > letters.score) {
                            letters = { name: name, score: s, byWords: false };
                        }
                    });
                    if (letters && letters.score >= LETTERS_FLOOR) nearest = letters;
                }
            }

            return {
                record: r,
                signals: signals,
                best: signals.length ? signals[0].at : 0,
                nearest: nearest
            };
        }).filter(function (c) { return !ranked || c.signals.length; });

        candidates.sort(function (a, b) {
            if (b.best !== a.best) return b.best - a.best;
            return b.signals.length - a.signals.length;
        });

        return {
            candidates: candidates,
            ranked: ranked,
            counts: {
                read: records.length,
                known: known.length,
                incomplete: incomplete.length,
                junk: junk.length,
                usable: usable.length,
                notable: candidates.length
            },
            known: known,
            incomplete: incomplete
        };
    }

    /* Everything the repo has already spoken for, as record name -> our food.
       Takes the alias and extras maps as they are on disk; the caller decides
       which ones apply to the table in hand. */
    function claimedFrom(maps) {
        const out = {};
        (maps || []).forEach(function (m) {
            Object.keys(m || {}).forEach(function (food) {
                if (food[0] === "_") return;
                const record = m[food];
                if (typeof record === "string") out[record] = food;
            });
        });
        return out;
    }

    const Harvest = {
        COMPLETE: COMPLETE,
        MIN_POPULATION: MIN_POPULATION,
        LETTERS_FLOOR: LETTERS_FLOOR,
        AXES: AXES,
        percentile: percentile,
        rank: rank,
        claimedFrom: claimedFrom,
        // Exported so the matching can be tested against a list of names
        // without building a whole export around it. That is how the
        // Matolja/Tomato class of bad neighbour was found.
        tokens: tokens,
        jaccard: jaccard
    };

    if (typeof module === "object" && module.exports) module.exports = Harvest;
    else root.Harvest = Harvest;
})(typeof self !== "undefined" ? self : this);
