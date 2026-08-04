/*
    Shared logic for building nutrition-data.js out of a Livsmedelsverket
    export. No file or network access in here — callers hand in an audit
    result and get the file text back, so the same code runs in the browser
    (tools/build-nutrition.html) and on the command line
    (tools/build-nutrition.js).

    Matching is not done here: it is the audit's, from lmv-core.js, so a food
    gets figures only where the match has already been confirmed by hand in
    lmv-aliases.json. Nothing is guessed and nothing is matched twice.
*/

(function (root) {
    "use strict";

    // What we keep. Anything else in the export is not used by any page.
    const KEEP = ["fat", "protein", "carbs", "fiber", "sugars", "alcohol"];

    function round(n) { return Math.round(n * 100) / 100; }

    function valuesFrom(record) {
        const values = {};
        KEEP.forEach(function (key) {
            const v = record.nutrients[key];
            if (typeof v === "number" && !isNaN(v)) values[key] = round(v);
        });
        return Object.keys(values).length ? values : null;
    }

    /*
        Takes what LMV.runAudit returned and produces the file.

        Both `clean` and `disagreements` count as matched: a disagreement is a
        tag that needs a second look, not a match that is wrong. Foods on the
        absent list never had a record to read, so they come out with nothing
        and every page reading the file has to cope with that.
    */
    function build(result, ourCount, sourceName) {
        const matched = result.clean.concat(result.disagreements);

        const rows = [];
        const empty = [];
        matched.forEach(function (m) {
            const values = valuesFrom(m.record);
            if (values) rows.push({ name: m.food.name, values: values });
            else empty.push(m.food.name);
        });
        rows.sort(function (a, b) { return a.name.localeCompare(b.name); });

        const lines = [];
        lines.push("/* =========================================================================");
        lines.push("   nutrition-data.js — per 100g figures, GENERATED, do not hand-edit");
        lines.push("");
        lines.push("   Rebuild from a Livsmedelsverket export with either of:");
        lines.push("     node tools/build-nutrition.js <export-file>");
        lines.push("     tools/build-nutrition.html   (works on a phone)");
        lines.push("");
        lines.push("   Source: Livsmedelsverket's food database, matched food by food through");
        lines.push("   tools/lmv-aliases.json — the same confirmed matches the audit uses. A");
        lines.push("   food appears here only if its match was confirmed by hand.");
        lines.push("");
        lines.push("   " + rows.length + " of " + ourCount + " foods have figures. The rest either have no");
        lines.push("   Livsmedelsverket entry (see tools/lmv-absent.json) or were not matched in");
        lines.push("   this export, so every page reading this has to cope with a food that is");
        lines.push("   simply missing.");
        lines.push("");
        lines.push("   Built from: " + sourceName);
        lines.push("   ========================================================================= */");
        lines.push("");
        lines.push("const NUTRITION = {");
        rows.forEach(function (row, i) {
            const parts = KEEP.filter(function (k) { return row.values[k] != null; })
                .map(function (k) { return k + ": " + row.values[k]; });
            lines.push('  "' + row.name.replace(/"/g, '\\"') + '": { ' + parts.join(", ") + " }" +
                (i === rows.length - 1 ? "" : ","));
        });
        lines.push("};");
        lines.push("");

        return {
            text: lines.join("\n"),
            rows: rows,
            empty: empty,
            skipped: result.skipped.length,
            unmatched: result.unmatched.map(function (f) { return f.name; })
        };
    }

    const NutritionCore = { KEEP: KEEP, build: build };

    if (typeof module === "object" && module.exports) module.exports = NutritionCore;
    else root.NutritionCore = NutritionCore;
})(typeof self !== "undefined" ? self : this);
