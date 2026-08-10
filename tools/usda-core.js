/*
    usda-core.js — reading USDA's FoodData Central JSON.

    Third on the ladder, behind Livsmedelsverket and Frida. One reader serves
    both sets we accept, because they share a schema: Foundation Foods
    ("FoundationFoods") and SR Legacy ("SRLegacyFoods"). FNDDS is deliberately
    not read — it is survey data costed out of recipes rather than measured,
    which is the objection that keeps Branded Foods off the ladder entirely.

    WHAT IS DIFFERENT FROM THE OTHER TWO READERS, and why this file exists.

    1. NOT EVERY FIGURE IN SR LEGACY IS MEASURED. The method page used to call
       SR Legacy "laboratory-analysed", and that is true of much of it and
       false of the rest. Its opening entries are Pillsbury biscuits and
       Kraft coating mix, and their figures carry derivation codes MC
       ("Manufacturer supplied; calculated by manufacturer or unknown") and LC
       ("Label claim, back calculated from label"). Label data rounded to legal
       tolerances is precisely what Branded Foods was rejected for, and here it
       sits inside a set we were about to trust wholesale.

       So the ladder's rule is applied per figure rather than per source.
       Every foodNutrient records how it was arrived at, so ACCEPT below is a
       test each number passes or fails on its own, and a food keeps only the
       figures that pass. Nothing is averaged and nothing is filled in.

    2. Foundation is clean by this test and SR Legacy is not, which is the
       point of testing rather than assuming. Across the figures we use,
       Foundation carries only A, AS and NC.

    3. The export contains literal nulls. Foundation's 2026-04-30 file has 395
       entries of which 32 are `null`, so anything walking the array has to
       tolerate them rather than assume a food.

    4. Figures are addressed by nutrient id, like Frida's ParameterIDs, so
       NUTRIENTS below is the whole mapping and there is no heading to drift.
       Two ids can carry sugars and two can carry fibre; the order in each
       list is the order of preference.

    Matching is not confirmed here. This produces candidates; a human confirms
    them into usda-aliases.json, exactly as with the other two.
*/

(function (root) {
    "use strict";

    const LMV = (typeof module === "object" && module.exports)
        ? require("./lmv-core.js") : root.LMV;

    /* FoodData Central nutrient ids. Stable across releases.

       Sugars and fibre each have two ids and we take the first one present.
       For fibre that choice is not cosmetic: 1079 is AOAC 991.43 and 2033 is
       AOAC 2011.25, and on the 17 Foundation foods carrying both, the newer
       method reads higher every time, by a median of 1.8g per 100g — 30% of
       our fibre dose, concentrated on starchy foods, because resistant starch
       is what it counts and the older method misses. 1079 is listed first to
       match what Livsmedelsverket and Frida report, so the column stays
       comparable; `fiberMethod` on each record says which was used, so a food
       measured the other way can be told apart later. */
    const NUTRIENTS = {
        fat: [1004],           // Total lipid (fat)
        protein: [1003],       // Protein
        carbs: [1005],         // Carbohydrate, by difference
        fiber: [1079, 2033],   // AOAC 991.43, then AOAC 2011.25
        sugars: [1063, 2000],  // Sugars NLEA, then Total Sugars
        alcohol: [1018],       // Alcohol, ethyl
        water: [1051],         // Water
        lactose: [1013]        // Lactose — its own figure, as in Frida
    };

    /* How a figure was arrived at, and whether we take it.

       ACCEPTED is measurement, plus the two calculations every national table
       performs by definition: carbohydrate by difference and protein from
       nitrogen. Both are NC, and rejecting NC would empty the carbohydrate
       column for every source we have.

       REJECTED is everything a manufacturer supplied, everything read off a
       label, and everything estimated from an ingredient list or a recipe.
       The reason is kept so a dropped figure can be explained rather than
       silently missing. */
    const ACCEPTED = {
        A: "analytical",
        AS: "analytical, summed",
        NC: "calculated — carbohydrate by difference, protein from nitrogen"
    };

    const REJECTED = {
        MA: "manufacturer supplied, incomplete documentation",
        MC: "manufacturer supplied, calculated by manufacturer or unknown",
        LC: "back-calculated from the label",
        FLA: "estimated from the ingredient list",
        RA: "estimated from a recipe",
        NR: "copied from another nutrient",
        Z: "assumed zero"
    };

    function derivationOf(nutrient) {
        const d = nutrient && nutrient.foodNutrientDerivation;
        return (d && d.code) ? String(d.code) : "";
    }

    /* The figures one food offers, after the test above. Returns the values
       kept, and what was dropped and why, so the audit can show it. */
    function nutrientsOf(food) {
        const byId = {};
        (food.foodNutrients || []).forEach(function (n) {
            const id = n && n.nutrient && n.nutrient.id;
            if (id != null && n.amount != null && byId[id] === undefined) byId[id] = n;
        });

        const values = {}, dropped = {};
        let fiberMethod = null;

        Object.keys(NUTRIENTS).forEach(function (key) {
            const ids = NUTRIENTS[key];
            for (let i = 0; i < ids.length; i++) {
                const n = byId[ids[i]];
                if (!n) continue;
                const code = derivationOf(n);
                if (ACCEPTED[code] || code === "") {
                    // An absent code means the export did not say. Foundation
                    // leaves it off only on figures it also marks analytical
                    // elsewhere, so it is taken and recorded as unstated.
                    values[key] = n.amount;
                    if (key === "fiber") fiberMethod = ids[i] === 2033 ? "AOAC 2011.25" : "AOAC 991.43";
                    return;
                }
                dropped[key] = REJECTED[code] || ("derivation " + code);
                return;                  // do not fall through to a worse id
            }
        });

        return { values: values, dropped: dropped, fiberMethod: fiberMethod };
    }

    /* ---- reading without holding the file -------------------------------

       SR Legacy is 64MB and FNDDS is bigger. JSON.parse on that returns an
       object several times the size of the file, which a phone will not do,
       and the audit runs on a phone. So the file is scanned in chunks and
       each food is parsed alone, reduced to the handful of figures we keep,
       and thrown away. Peak memory is one food plus one chunk.

       The scan finds object boundaries by depth rather than by line. Both
       exports we have put one food per line and it would have been less code
       to split on "\n", but that is a property of today's file rather than of
       the format, and a wrong guess here is a tool that fails on a phone with
       no way to see why. Depth 1 is the wrapper object, depth 2 the array, so
       a food is what opens at depth 3 and closes back to 2. Quoting is
       tracked, so a brace inside a description cannot end a food early. */
    function makeScanner(onFood) {
        let depth = 0, inString = false, escaped = false;
        let collecting = false, carry = "";

        return function (chunk) {
            let start = collecting ? 0 : -1;

            for (let i = 0; i < chunk.length; i++) {
                const ch = chunk.charCodeAt(i);

                if (inString) {
                    if (escaped) escaped = false;
                    else if (ch === 92) escaped = true;        // backslash
                    else if (ch === 34) inString = false;      // closing quote
                    continue;
                }
                if (ch === 34) { inString = true; continue; }

                if (ch === 123 || ch === 91) {                 // { or [
                    depth += 1;
                    if (!collecting && ch === 123 && depth === 3) {
                        collecting = true;
                        start = i;
                    }
                } else if (ch === 125 || ch === 93) {           // } or ]
                    depth -= 1;
                    if (collecting && depth === 2) {
                        onFood(carry + chunk.slice(start < 0 ? 0 : start, i + 1));
                        carry = "";
                        collecting = false;
                        start = -1;
                    }
                }
            }

            if (collecting) carry += chunk.slice(start < 0 ? 0 : start);
        };
    }

    /* A food object's text -> a record, or null for the nulls in the array
       and for anything that keeps no figure at all. A record that lost every
       figure to the derivation test cannot contribute to a match, so it is
       not offered as one; the count of those is worth reporting, because for
       SR Legacy it is the size of the manufacturer-supplied part. */
    function recordFromText(text, set) {
        let food;
        try { food = JSON.parse(text); } catch (e) { return null; }
        if (!food || !food.description) return null;

        const read = nutrientsOf(food);
        return {
            name: String(food.description),
            id: String(food.fdcId == null ? "" : food.fdcId),
            dataType: String(food.dataType || set || ""),
            category: (food.foodCategory && food.foodCategory.description) || "",
            nutrients: read.values,
            dropped: read.dropped,
            fiberMethod: read.fiberMethod
        };
    }

    /* Push text in, take records out. The caller owns the file handle and the
       decoding, so the same reader serves a Blob in the browser and a read
       stream in node, and neither has to hold the file. */
    function makeReader(set) {
        const records = [];
        let seen = 0, empty = 0;

        const feed = makeScanner(function (text) {
            seen += 1;
            const r = recordFromText(text, set);
            if (!r) return;
            if (!Object.keys(r.nutrients).length) { empty += 1; return; }
            records.push(r);
        });

        return {
            push: feed,
            done: function () {
                return { records: records, seen: seen, empty: empty, set: set || "" };
            }
        };
    }

    /* One record per food, in the shape lmv-core's audit already consumes.
       Nulls in the array are skipped rather than assumed to be foods. */
    function recordsFromJson(parsed) {
        const key = Object.keys(parsed || {}).find(function (k) {
            return Array.isArray(parsed[k]);
        });
        if (!key) throw new Error("no food array in this file — expected FoundationFoods or SRLegacyFoods");

        const raw = parsed[key];
        const records = [];
        let nulls = 0;

        raw.forEach(function (food) {
            if (!food || !food.description) { nulls += 1; return; }
            const read = nutrientsOf(food);
            records.push({
                name: String(food.description),
                id: String(food.fdcId == null ? "" : food.fdcId),
                dataType: String(food.dataType || key),
                category: (food.foodCategory && food.foodCategory.description) || "",
                nutrients: read.values,
                dropped: read.dropped,
                fiberMethod: read.fiberMethod
            });
        });

        return { records: records, nulls: nulls, set: key };
    }

    function fromText(text) { return recordsFromJson(JSON.parse(text)); }

    /* ---- matching -------------------------------------------------------

       Both sides are English, as with Frida, so the state words carry and
       `score` can push down a candidate that disagrees about fresh or dried.
       Only foods with no figures are offered: a food an earlier source covers
       keeps that figure, because one table applied consistently beats a
       mixture and this is here to fill gaps. */
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

    /* The confirmed matches as a nutrition-manual.js-shaped object, the same
       slot Frida arrives in, so the builder needs no change.

       A match that lost a figure to the derivation test is reported rather
       than emitted half-built: `incomplete` lists what is missing and why, so
       the choice to accept a partial food is made by a human looking at the
       reason, not by the builder defaulting a number to zero. */
    const KEEP = ["fat", "protein", "carbs", "fiber", "sugars", "alcohol", "water"];

    function toManualEntries(confirmed) {
        const out = {}, incomplete = [];

        confirmed.forEach(function (m) {
            const values = {}, missing = [];
            KEEP.forEach(function (k) {
                const v = m.record.nutrients[k];
                if (typeof v === "number" && !isNaN(v)) values[k] = Math.round(v * 100) / 100;
                else missing.push(k + (m.record.dropped[k] ? " (" + m.record.dropped[k] + ")" : " (not in the file)"));
            });
            if (!Object.keys(values).length) return;
            if (missing.length) incomplete.push({ name: m.food.name, missing: missing });

            out[m.food.name] = {
                src: "usda",
                ref: m.record.name + " (FDC " + m.record.id + ", " + m.record.dataType +
                    (m.record.fiberMethod ? ", fibre " + m.record.fiberMethod : "") + ")",
                values: values
            };
        });

        return { entries: out, incomplete: incomplete };
    }

    /* Reads a Blob or File without holding it. 4MB at a time, decoded with a
       streaming TextDecoder — slicing a Blob cuts bytes, not characters, and
       the µ in "µg" is two of them, so decoding each slice on its own would
       corrupt every record that straddles a boundary. */
    const CHUNK = 4 * 1024 * 1024;

    function fromBlob(blob, onProgress) {
        const reader = makeReader("");
        const decoder = new TextDecoder("utf-8");

        function step(offset) {
            if (offset >= blob.size) {
                reader.push(decoder.decode());       // flush a trailing partial character
                return Promise.resolve(reader.done());
            }
            const end = Math.min(offset + CHUNK, blob.size);
            return blob.slice(offset, end).arrayBuffer().then(function (buf) {
                reader.push(decoder.decode(buf, { stream: true }));
                if (onProgress) onProgress(end, blob.size);
                return step(end);
            });
        }

        return Promise.resolve().then(function () { return step(0); });
    }

    const USDA = {
        NUTRIENTS: NUTRIENTS,
        ACCEPTED: ACCEPTED,
        REJECTED: REJECTED,
        makeReader: makeReader,
        fromBlob: fromBlob,
        recordsFromJson: recordsFromJson,
        fromText: fromText,
        proposeMatches: proposeMatches,
        toManualEntries: toManualEntries
    };

    if (typeof module === "object" && module.exports) module.exports = USDA;
    else root.USDA = USDA;
})(typeof self !== "undefined" ? self : this);
