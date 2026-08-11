/*
    ciqual-core.js — reading ANSES's Ciqual, the French national table.

    Third on the ladder: below Frida, above USDA. Denmark still describes food
    off the same shelf as Sweden, so it stays second. France goes above America
    because it is a European table for a European diet — the Mediterranean and
    French tail is exactly what Sweden and Denmark do not carry, and where SR
    Legacy answers at all it answers about a different shelf.

    WHAT IS DIFFERENT FROM THE OTHER READERS, and why this file exists.

    1. NO PER-FIGURE PROVENANCE. USDA records how every single number was
       arrived at, and usda-core.js tests each one on its own. This export does
       not: the English Ciqual workbook carries no confidence code per value.
       So Ciqual is taken on the table's standing, exactly as Livsmedelsverket
       and Frida are, and unlike USDA. That is a real step back in scrutiny and
       it is why France sits below Denmark rather than beside it.

    2. FOUR THINGS IN A CELL ARE NOT A NUMBER, and they do not mean the same:

         "-"        not measured                  -> missing
         "traces"   present, below quantification  -> 0
         "< 0,2"    below the limit of detection   -> 0
         "0,5"      a number, comma-separated, stored as text

       `traces` and `< x` are read as zero rather than left missing. Left
       missing they would put the food's whole weight into the meal builder's
       headroom, which buys a great deal of silence to avoid an error of at
       most a few tenths of a gram. The largest limits in the 2025 file are 3g
       per 100g and they sit on fibre in cream, cheese, cured meat and wine,
       where zero is the truth rather than an approximation of it.

    3. Columns are found by their heading, not by position. Ciqual's headings
       carry line breaks inside them — "Water\n(g\n100g)" — so they are
       flattened before matching, and "Protein" has to be told apart from
       "Protein, crude, N x 6.25".

    4. Lactose and polyols come free. Both have their own column here, as
       lactose does in Frida. Polyols are carried through because we tag a
       polyols trait on 47 foods and no other source has ever given us a
       figure for it.

    5. THE FIBRE METHOD IS NOT STATED, and the file says so itself. Ciqual
       publishes INFOODS tagnames for its columns on a second sheet, and the
       one against Fibres is `FIB-`. The suffix is how INFOODS names the
       method — `FIBTG` is gravimetric AOAC, `FIBTS` is the sum of measured
       components — and a bare tag with a hyphen means the method is
       unspecified. So whether resistant starch is counted is not knowable
       from this table.

       That matters more here than it would elsewhere. The two AOAC methods
       differ by a median of 1.8g per 100g on the same food, 30% of our fibre
       dose, and the gap falls on starch precisely because resistant starch is
       what the newer one catches. USDA labels the method per figure and we
       record which was used; Ciqual cannot be asked. It is the one column
       where this source is the weakest of the four, and it is another reason
       France sits below Denmark rather than above it.

    Matching is not confirmed here. This produces candidates; a human confirms
    them into ciqual-aliases.json, exactly as with the other three.
*/

(function (root) {
    "use strict";

    const LMV = (typeof module === "object" && module.exports)
        ? require("./lmv-core.js") : root.LMV;

    /* Heading patterns, matched against the flattened header row. First match
       wins, so the more specific pattern has to come first where two could
       both hit — "Protein" would otherwise take "Protein, crude". */
    const COLUMNS = [
        ["water", /^water \(g/],
        ["protein", /^protein \(g/],
        ["carbs", /^carbohydrate \(g/],
        ["fat", /^fat \(g/],
        ["sugars", /^sugars \(g/],
        ["fiber", /^fibres? \(g/],
        ["alcohol", /^alcohol \(g/],
        ["lactose", /^lactose \(g/],
        ["polyols", /^polyols \(g/]
    ];

    const NAME_HEADING = "alim_nom_eng";
    const CODE_HEADING = "alim_code";
    const GROUP_HEADING = "alim_grp_nom_eng";

    function flat(v) {
        return String(v == null ? "" : v).replace(/\s+/g, " ").trim().toLowerCase();
    }

    /* One cell. Returns the number and, when the cell said something other
       than a number, what it said — so the audit can report how much of a
       food's figures were read off "traces" rather than measured. */
    function readCell(v) {
        if (v == null) return { value: null };
        if (typeof v === "number") return { value: isNaN(v) ? null : v };

        const s = String(v).trim();
        if (!s || s === "-") return { value: null };
        if (/^traces?$/i.test(s)) return { value: 0, note: "traces" };

        const limit = /^<\s*([\d.,]+)$/.exec(s);
        if (limit) return { value: 0, note: "below " + limit[1] };

        const n = Number(s.replace(",", "."));
        return isNaN(n) ? { value: null, note: "unreadable: " + s } : { value: n };
    }

    /* Finds the food table among the sheets. Ciqual puts it first and calls it
       "food composition", but it is found by the column it must have rather
       than by name or position — a renamed sheet should not break the tool. */
    function findTable(sheets) {
        for (let s = 0; s < sheets.length; s++) {
            const rows = sheets[s] || [];
            for (let r = 0; r < Math.min(rows.length, 8); r++) {
                const header = (rows[r] || []).map(flat);
                const nameCol = header.indexOf(NAME_HEADING);
                if (nameCol !== -1) {
                    return { rows: rows, headerRow: r, header: header, nameCol: nameCol };
                }
            }
        }
        return null;
    }

    function recordsFromSheets(sheets) {
        const table = findTable(sheets);
        if (!table) {
            throw new Error("no Ciqual food table in this file — expected a column headed " +
                NAME_HEADING + ". Is this the English export?");
        }

        const column = {};
        COLUMNS.forEach(function (pair) {
            const key = pair[0], pattern = pair[1];
            if (column[key] != null) return;
            for (let i = 0; i < table.header.length; i++) {
                if (pattern.test(table.header[i])) { column[key] = i; return; }
            }
        });

        const missing = COLUMNS.map(function (p) { return p[0]; })
            .filter(function (k) { return column[k] == null; });

        const codeCol = table.header.indexOf(CODE_HEADING);
        const groupCol = table.header.indexOf(GROUP_HEADING);

        const records = [];
        let softened = 0;
        for (let r = table.headerRow + 1; r < table.rows.length; r++) {
            const row = table.rows[r] || [];
            const name = String(row[table.nameCol] == null ? "" : row[table.nameCol]).trim();
            if (!name) continue;

            const nutrients = {}, notes = {};
            Object.keys(column).forEach(function (key) {
                const cell = readCell(row[column[key]]);
                if (cell.value != null) nutrients[key] = cell.value;
                if (cell.note) { notes[key] = cell.note; softened += 1; }
            });

            records.push({
                name: name,
                id: codeCol === -1 ? "" : String(row[codeCol] == null ? "" : row[codeCol]),
                group: groupCol === -1 ? "" : String(row[groupCol] == null ? "" : row[groupCol]),
                nutrients: nutrients,
                notes: notes
            });
        }

        return { records: records, missing: missing, softened: softened };
    }

    function fromXlsx(arrayBuffer) {
        return LMV.sheetsFromXlsx(arrayBuffer).then(recordsFromSheets);
    }

    /* ---- matching -------------------------------------------------------

       English on both sides, as with Frida and USDA, so `score` can see a
       state word that disagrees. Only foods with no figures are offered: a
       food a source above this one covers keeps that figure. */
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

    /* Every confirmed pair, whether or not the food now has figures — the
       alias file is the record of what has been confirmed, and the generated
       file is that record with figures attached. Building it from the offer
       list instead once shrank thirty confirmed matches to two. */
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

    const KEEP = ["fat", "protein", "carbs", "fiber", "sugars", "alcohol", "water",
        "lactose", "polyols"];

    /* The backbone, and the same four the American reader requires. A partial
       entry is not merely less useful than a full one: a food with no figures
       is set aside from a meal entirely, while a food with some figures puts
       its whole weight into the denominator of every concentration. So a gap
       buys silence in proportion to the portion, and these four are what every
       line leans on. Kept in step with usda-core.js by check-data.js, because
       one rule written down twice is one rule that drifts. */
    const REQUIRED = ["fat", "protein", "carbs", "water"];

    function toManualEntries(confirmed) {
        const out = {}, incomplete = [], refused = [];

        confirmed.forEach(function (m) {
            const values = {}, missing = [];
            KEEP.forEach(function (k) {
                const v = m.record.nutrients[k];
                if (typeof v === "number" && !isNaN(v)) values[k] = Math.round(v * 100) / 100;
                else missing.push(k + " (not in the file)");
            });
            if (!Object.keys(values).length) return;

            const short = REQUIRED.filter(function (k) { return values[k] == null; });
            if (short.length) {
                refused.push({
                    name: m.food.name,
                    missing: short,
                    why: "no " + short.join(", ") + " — a food with no figures at all is cleaner " +
                        "than one that holds a place in every meal and answers nothing"
                });
                return;
            }

            if (missing.length) incomplete.push({ name: m.food.name, missing: missing });

            /* Which figures were read off a "traces" or a "< 0,2" rather than
               measured. Small, but it is the difference between a zero the
               table stated and a zero it merely could not see past. */
            const soft = Object.keys(m.record.notes || {})
                .filter(function (k) { return KEEP.indexOf(k) !== -1; })
                .map(function (k) { return k + " " + m.record.notes[k]; });

            out[m.food.name] = {
                src: "ciqual",
                ref: m.record.name + " (Ciqual " + m.record.id + ")" +
                    (soft.length ? " [" + soft.join(", ") + "]" : ""),
                values: values
            };
        });

        return { entries: out, incomplete: incomplete, refused: refused };
    }

    const Ciqual = {
        COLUMNS: COLUMNS,
        REQUIRED: REQUIRED,
        readCell: readCell,
        recordsFromSheets: recordsFromSheets,
        fromXlsx: fromXlsx,
        proposeMatches: proposeMatches,
        confirmedFrom: confirmedFrom,
        toManualEntries: toManualEntries
    };

    if (typeof module === "object" && module.exports) module.exports = Ciqual;
    else root.Ciqual = Ciqual;
})(typeof self !== "undefined" ? self : this);
