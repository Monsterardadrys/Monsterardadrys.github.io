/*
    frida-core.js — reading Denmark's national food table.

    Frida is the DTU National Food Institute's food composition database
    (fcdb.fooddata.dk), version 6.1. It is the second source on the ladder,
    behind Livsmedelsverket: 113 of our foods have no Swedish entry, and most
    of them are things a Nordic table might still hold — dried mushrooms,
    herbs, the European cheeses, tea.

    WHAT IS DIFFERENT FROM THE SWEDISH READER, and why this file exists.

    1. Frida names every food in English as well as Danish. So there is no
       translation step: our own names go straight into the scorer, and the
       state words that decide fresh from dried — "raw", "dried", "cooked" —
       appear in the same language on both sides for the first time. That is
       worth more than it sounds. Every wrong match this project has had was
       a form mismatch, and against Swedish the scorer could not see one,
       because our states were English and its were not. Here it can, so a
       candidate that disagrees about the state is pushed down rather than
       left for a human to catch.

    2. The workbook has seven sheets and the one we want is not the first.
       It is picked by what it contains rather than by name or position.

    3. Figures are addressed by number, not by label. Frida gives every
       nutrient a stable ParameterID, so there is no pattern-matching on
       column headings the way the Swedish reader needs — PARAMETERS below is
       the whole mapping and it cannot drift.

    4. Lactose is its own figure. Livsmedelsverket gives total sugars, which
       is why lactose-free dairy still reports lactose here and has to carry a
       soft marker saying so. For a food sourced from Frida that caveat does
       not apply, and `lactose` is carried through so it can eventually be
       used instead of the sugars column.

    Matching is not confirmed here. This produces candidates; a human confirms
    them into frida-aliases.json, exactly as with the Swedish table.
*/

(function (root) {
    "use strict";

    const LMV = (typeof module === "object" && module.exports)
        ? require("./lmv-core.js") : root.LMV;

    /* Frida ParameterIDs. Stable across releases, so this is a mapping rather
       than a guess. Carbohydrate is the "available" figure (172) and not
       "by difference" (170), to match what Livsmedelsverket reports. */
    const PARAMETERS = {
        fat: 141,        // Fat
        protein: 218,    // Protein
        carbs: 172,      // Available carbohydrates
        fiber: 168,      // Dietary fibre
        sugars: 245,     // Sum sugars
        alcohol: 19,     // Alcohol
        water: 268,      // Water
        lactose: 179     // Lactose — no Swedish equivalent
    };

    /* The wide sheet's own markers. Frida writes an arrow into the corner
       cells to say which way each header runs, and they are the most
       reliable thing in the file to find it by. */
    const FOOD_NAME_MARK = "↓FoodName";      // ↓FoodName
    const PARAM_ID_MARK = "↓FoodID/→ParameterID";

    function text(v) { return v == null ? "" : String(v).trim(); }

    function toNumber(v) {
        if (typeof v === "number") return isNaN(v) ? null : v;
        const s = text(v).replace(",", ".");
        if (!s || s === "NULL") return null;
        const n = Number(s);
        return isNaN(n) ? null : n;
    }

    /* Finds the food table among the sheets and returns its header rows.
       Frida stacks four of them: Danish parameter name, English parameter
       name, unit, then the ParameterIDs — which is the row we address by. */
    function findFoodTable(sheets) {
        for (let s = 0; s < sheets.length; s++) {
            const rows = sheets[s];
            for (let r = 0; r < Math.min(rows.length, 12); r++) {
                const cells = (rows[r] || []).map(text);
                const nameCol = cells.indexOf(FOOD_NAME_MARK);
                const idRow = cells.indexOf(PARAM_ID_MARK);
                if (nameCol !== -1 && idRow !== -1) {
                    return { rows: rows, headerRow: r, nameCol: nameCol, idCol: idRow };
                }
            }
        }
        return null;
    }

    /* One record per food, in the shape lmv-core's audit already consumes:
       a name, an id, and a nutrients object keyed the way we key ours. */
    function recordsFromSheets(sheets) {
        const table = findFoodTable(sheets);
        if (!table) {
            throw new Error("no Frida food table in this file — expected a sheet " +
                "with a " + FOOD_NAME_MARK + " column (the Data_Table sheet)");
        }

        const header = (table.rows[table.headerRow] || []).map(text);
        const column = {};                       // our key -> column index
        Object.keys(PARAMETERS).forEach(function (key) {
            const at = header.indexOf(String(PARAMETERS[key]));
            if (at !== -1) column[key] = at;
        });

        const missing = Object.keys(PARAMETERS).filter(function (k) { return column[k] == null; });

        const records = [];
        for (let r = table.headerRow + 1; r < table.rows.length; r++) {
            const row = table.rows[r] || [];
            const name = text(row[table.nameCol]);
            if (!name) continue;                 // trailing blanks, and the Danish-only rows
            const nutrients = {};
            Object.keys(column).forEach(function (key) {
                const n = toNumber(row[column[key]]);
                if (n != null) nutrients[key] = n;
            });
            records.push({
                name: name,
                danish: text(row[table.nameCol - 1]),
                id: text(row[table.idCol]),
                nutrients: nutrients
            });
        }
        return { records: records, missing: missing };
    }

    function fromXlsx(arrayBuffer) {
        return LMV.sheetsFromXlsx(arrayBuffer).then(recordsFromSheets);
    }

    /* ---- matching -------------------------------------------------------

       Both sides are English now, so the state words carry. `score` already
       treats a candidate that drops a wanted state as worse; feeding it our
       name unchanged is all that takes.

       Only foods with no figures are offered. A food Livsmedelsverket covers
       keeps its Swedish figure — one national table applied consistently
       beats a mixture, and this is here to fill gaps. */
    function proposeMatches(foods, records, aliases, take) {
        take = take || 3;
        aliases = aliases || {};

        const confirmed = [], toConfirm = [], unmatched = [];

        foods.forEach(function (food) {
            const wanted = aliases[food.name];
            if (wanted) {
                const hit = records.find(function (r) { return r.name === wanted; });
                if (hit) confirmed.push({ food: food, record: hit });
                else unmatched.push({ food: food, why: "confirmed as \"" + wanted +
                    "\", which is not in this file" });
                return;
            }
            const ranked = records.map(function (r) {
                return { record: r, score: LMV.score(food.name, r.name, food.lmvNote) };
            }).sort(function (a, b) { return b.score - a.score; }).slice(0, take);

            if (!ranked.length || ranked[0].score <= 0) unmatched.push({ food: food, why: "nothing close" });
            else toConfirm.push({ food: food, candidates: ranked });
        });

        return { confirmed: confirmed, toConfirm: toConfirm, unmatched: unmatched };
    }

    /* Every confirmed pair, regardless of whether the food currently has
       figures — which is not the same set proposeMatches walks.

       proposeMatches only offers foods with no figures, because there is no
       point asking a human to confirm a match for a food already covered.
       Building the generated file from that set was a bug with teeth: on a
       second run the foods confirmed the first time already had figures, so
       they were never offered, never landed in `confirmed`, and the rewritten
       file held only the new ones. Thirty confirmed matches came out as a
       two-food file, and rebuilding with it would have taken the figures off
       the other twenty-eight.

       The alias file is the record of what has been confirmed. The generated
       file is that record with figures attached, so it is built from the
       aliases and from the whole food list. A food an earlier source now
       covers is harmless here: the ladder in nutrition-core.js still puts that
       source first. */
    function confirmedFrom(allFoods, records, aliases) {
        const byFood = {};
        allFoods.forEach(function (f) { byFood[f.name] = f; });
        const byRecord = {};
        records.forEach(function (r) { if (byRecord[r.name] === undefined) byRecord[r.name] = r; });

        const confirmed = [], missing = [];
        Object.keys(aliases || {}).forEach(function (name) {
            const food = byFood[name];
            const record = byRecord[aliases[name]];
            if (food && record) confirmed.push({ food: food, record: record });
            else missing.push({
                name: name,
                why: !food ? "no food of that name any more"
                    : "\"" + aliases[name] + "\" is not in this file"
            });
        });
        return { confirmed: confirmed, missing: missing };
    }

    /* The confirmed matches as a nutrition-manual.js-shaped object, which is
       what tools/nutrition-core.js already merges in for the foods
       Livsmedelsverket does not cover. Frida therefore needs no change to the
       builder at all — it arrives in the slot the ladder always had for it. */
    const KEEP = ["fat", "protein", "carbs", "fiber", "sugars", "alcohol", "water",
        "lactose"];

    function toManualEntries(confirmed) {
        const out = {};
        confirmed.forEach(function (m) {
            const values = {};
            KEEP.forEach(function (k) {
                if (typeof m.record.nutrients[k] === "number") {
                    values[k] = Math.round(m.record.nutrients[k] * 100) / 100;
                }
            });
            if (!Object.keys(values).length) return;
            out[m.food.name] = {
                src: "frida",
                ref: m.record.name + " (Frida " + m.record.id + ")",
                values: values
            };
        });
        return out;
    }

    /* Extras: matches made for foods Livsmedelsverket already answers, to take
       the one column it does not publish for anything. Frida has lactose and
       no polyols, so lactose is all it can lend.

       Nothing else comes with it — not the fat, not the water. An extras match
       adds one number to a food that is already whole, which is why it needs
       no backbone and cannot dilute anything. */
    const EXTRA_KEYS = ["lactose"];

    function toExtrasEntries(confirmed) {
        const out = {}, empty = [];
        confirmed.forEach(function (m) {
            const values = {};
            EXTRA_KEYS.forEach(function (k) {
                if (typeof m.record.nutrients[k] === "number") {
                    values[k] = Math.round(m.record.nutrients[k] * 100) / 100;
                }
            });
            if (!Object.keys(values).length) {
                empty.push({ name: m.food.name, why: "the Danish record carries no lactose figure" });
                return;
            }
            out[m.food.name] = {
                src: "frida",
                ref: m.record.name + " (Frida " + m.record.id + ")",
                values: values
            };
        });
        return { entries: out, empty: empty };
    }

    const Frida = {
        PARAMETERS: PARAMETERS,
        EXTRA_KEYS: EXTRA_KEYS,
        recordsFromSheets: recordsFromSheets,
        fromXlsx: fromXlsx,
        proposeMatches: proposeMatches,
        confirmedFrom: confirmedFrom,
        toManualEntries: toManualEntries,
        toExtrasEntries: toExtrasEntries
    };

    if (typeof module === "object" && module.exports) module.exports = Frida;
    else root.Frida = Frida;
})(typeof self !== "undefined" ? self : this);
