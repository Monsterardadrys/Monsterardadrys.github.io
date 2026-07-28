/*
    Shared logic for auditing foods-data.js against a Livsmedelsverket export.

    No file or network access in here — callers hand in text and get results
    back. That way the same code runs in the browser (tools/lmv-audit.html)
    and on the command line (tools/lmv-audit.js).

    Thresholds mirror the ones described in about.html. Note the lactose
    caveat: the database reports total sugars, not lactose. For plain dairy
    those are effectively the same number, which is the reasoning already used
    for halloumi and mozzarella. For anything with added sugar it is not, so
    lactose findings are flagged as needing a look rather than stated flatly.
*/

(function (root) {
    "use strict";

    /* ---- thresholds (per 100 g) ------------------------------------- */

    const RULES = [
        { trait: "over_10g_fat",    nutrient: "fat",     min: 10 },
        { trait: "protein",         nutrient: "protein", min: 20 },
        { trait: "fiber",           nutrient: "fiber",   min: 6 },
        // Gated on allergen_milk: the database reports total sugars, not
        // lactose, so without this every piece of fruit reports a missing
        // lactose tag. Still soft — for anything with added sugar the two
        // numbers are not the same.
        { trait: "over_3g_lactose", nutrient: "sugars",  min: 1, soft: true, requires: "allergen_milk" },
        { trait: "alcohol",         nutrient: "alcohol", min: 0.5 }
    ];

    // bile_stimulant is the one trait with two ways in
    function bileExpected(n) {
        return (n.fat != null && n.fat > 17.5) || (n.protein != null && n.protein > 20);
    }

    /* ---- reading the export ----------------------------------------- */

    // Swedish nutrient labels, matched against a lowercased key
    const NUTRIENT_PATTERNS = [
        ["fat",     [/^fett$/, /fett,?\s*totalt/, /^summa fett/]],
        ["protein", [/^protein/]],
        ["fiber",   [/fibrer/, /^fiber/, /kostfiber/]],
        ["sugars",  [/sockerarter/, /^socker\b/]],
        ["alcohol", [/^alkohol/]],
        ["carbs",   [/kolhydrater/]]
    ];

    const NAME_KEYS = ["namn", "livsmedelsnamn", "livsmedel", "name", "foodname"];
    const ID_KEYS = ["nummer", "livsmedelsnummer", "id", "number"];

    function norm(s) {
        return String(s == null ? "" : s).toLowerCase().trim();
    }

    function matchNutrient(label) {
        const l = norm(label);
        for (let i = 0; i < NUTRIENT_PATTERNS.length; i++) {
            const key = NUTRIENT_PATTERNS[i][0];
            const patterns = NUTRIENT_PATTERNS[i][1];
            if (patterns.some(function (p) { return p.test(l); })) return key;
        }
        return null;
    }

    function toNumber(v) {
        if (v == null || v === "") return null;
        const n = parseFloat(String(v).replace(",", ".").replace(/\s/g, ""));
        return Number.isFinite(n) ? n : null;
    }

    function pickKey(obj, candidates) {
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            if (candidates.indexOf(norm(keys[i])) !== -1) return keys[i];
        }
        return null;
    }

    /* Turns one export record into { id, name, nutrients }, handling both a
       flat object (CSV-style, one column per nutrient) and the nested shape
       the API uses (a list of { namn, varde } under some key). */
    function normalizeRecord(raw) {
        if (!raw || typeof raw !== "object") return null;
        const nameKey = pickKey(raw, NAME_KEYS);
        if (!nameKey) return null;
        const idKey = pickKey(raw, ID_KEYS);

        const nutrients = {};

        // nested: any array-valued property whose entries look like name/value pairs
        Object.keys(raw).forEach(function (k) {
            const v = raw[k];
            if (!Array.isArray(v)) return;
            v.forEach(function (entry) {
                if (!entry || typeof entry !== "object") return;
                const en = pickKey(entry, NAME_KEYS) || pickKey(entry, ["forkortning", "namn"]);
                const evKey = pickKey(entry, ["varde", "värde", "value", "mangd", "mängd"]);
                if (!en || !evKey) return;
                const key = matchNutrient(entry[en]);
                if (key && nutrients[key] == null) nutrients[key] = toNumber(entry[evKey]);
            });
        });

        // flat: one column per nutrient
        Object.keys(raw).forEach(function (k) {
            if (Array.isArray(raw[k]) || (raw[k] && typeof raw[k] === "object")) return;
            const key = matchNutrient(k);
            if (key && nutrients[key] == null) nutrients[key] = toNumber(raw[k]);
        });

        return {
            id: idKey ? raw[idKey] : null,
            name: String(raw[nameKey]),
            nutrients: nutrients
        };
    }

    function csvToRows(text) {
        // Livsmedelsverket exports are semicolon-separated; handle comma too.
        const firstLine = text.slice(0, text.indexOf("\n"));
        const sep = (firstLine.match(/;/g) || []).length >= (firstLine.match(/,/g) || []).length ? ";" : ",";
        const rows = [];
        let row = [], field = "", quoted = false;
        for (let i = 0; i < text.length; i++) {
            const c = text[i];
            if (quoted) {
                if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
                else if (c === '"') quoted = false;
                else field += c;
            } else if (c === '"') quoted = true;
            else if (c === sep) { row.push(field); field = ""; }
            else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
            else if (c !== "\r") field += c;
        }
        if (field || row.length) { row.push(field); rows.push(row); }
        return rows;
    }

    /* Turns a grid of cells into objects.

       The header is not assumed to be row 1: Livsmedelsverket's Excel export
       opens with a few lines of title and version info. So every row in the
       first stretch of the file is tried as a header, and the one that yields
       the most recognisable nutrient columns wins. */
    function tableToObjects(rows) {
        rows = rows.filter(function (r) { return r.some(function (c) { return String(c || "").trim(); }); });
        if (!rows.length) return [];

        let headerIndex = 0, bestScore = -1;
        const limit = Math.min(rows.length, 30);
        for (let i = 0; i < limit; i++) {
            const cells = rows[i].map(function (c) { return String(c == null ? "" : c).trim(); });
            let score = 0;
            const seen = {};
            cells.forEach(function (c) {
                const key = matchNutrient(c);
                if (key && !seen[key]) { seen[key] = true; score += 2; }
                if (NAME_KEYS.indexOf(norm(c)) !== -1) score += 3;
            });
            if (score > bestScore) { bestScore = score; headerIndex = i; }
        }

        const header = rows[headerIndex].map(function (h) { return String(h == null ? "" : h).trim(); });
        return rows.slice(headerIndex + 1).map(function (r) {
            const o = {};
            header.forEach(function (h, i) { if (h) o[h] = r[i]; });
            return o;
        });
    }

    function parseCsv(text) {
        return tableToObjects(csvToRows(text));
    }

    /* ---- .xlsx ------------------------------------------------------- */

    /* An .xlsx is a ZIP of XML. Rather than pull in a library, the two parts
       we need are unzipped by hand: the browser's DecompressionStream does
       the actual inflating. Only the first worksheet is read, which is all
       Livsmedelsverket's export has. */

    function findZipEntries(buf) {
        const view = new DataView(buf);
        const bytes = new Uint8Array(buf);

        // end-of-central-directory record, scanned backwards from the tail
        let eocd = -1;
        for (let i = bytes.length - 22; i >= 0 && i > bytes.length - 66000; i--) {
            if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
        }
        if (eocd < 0) throw new Error("not a zip file");

        const count = view.getUint16(eocd + 10, true);
        let p = view.getUint32(eocd + 16, true);
        const entries = {};
        const decoder = new TextDecoder();

        for (let i = 0; i < count; i++) {
            if (view.getUint32(p, true) !== 0x02014b50) break;
            const method = view.getUint16(p + 10, true);
            const compressedSize = view.getUint32(p + 20, true);
            const nameLen = view.getUint16(p + 28, true);
            const extraLen = view.getUint16(p + 30, true);
            const commentLen = view.getUint16(p + 32, true);
            const localOffset = view.getUint32(p + 42, true);
            const name = decoder.decode(bytes.subarray(p + 46, p + 46 + nameLen));

            // the local header repeats the name/extra lengths, and its extra
            // field can differ from the central one — always read it here
            const lNameLen = view.getUint16(localOffset + 26, true);
            const lExtraLen = view.getUint16(localOffset + 28, true);
            const dataStart = localOffset + 30 + lNameLen + lExtraLen;

            entries[name] = {
                method: method,
                data: bytes.subarray(dataStart, dataStart + compressedSize)
            };
            p += 46 + nameLen + extraLen + commentLen;
        }
        return entries;
    }

    function inflateEntry(entry) {
        if (entry.method === 0) return Promise.resolve(new TextDecoder().decode(entry.data));
        if (typeof DecompressionStream === "undefined") {
            return Promise.reject(new Error("this browser cannot unzip .xlsx — save the file as CSV instead"));
        }
        const stream = new Blob([entry.data]).stream()
            .pipeThrough(new DecompressionStream("deflate-raw"));
        return new Response(stream).text();
    }

    function unescapeXml(s) {
        return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&#(\d+);/g, function (_, d) { return String.fromCharCode(+d); })
            .replace(/&amp;/g, "&");
    }

    function sharedStringsFrom(xml) {
        if (!xml) return [];
        // each <si> is one string, possibly split across several <t> runs
        return (xml.match(/<si>[\s\S]*?<\/si>/g) || []).map(function (si) {
            return (si.match(/<t[^>]*>([\s\S]*?)<\/t>/g) || []).map(function (t) {
                return unescapeXml(t.replace(/<t[^>]*>/, "").replace(/<\/t>/, ""));
            }).join("");
        });
    }

    function colToIndex(ref) {
        const letters = (ref.match(/^[A-Z]+/) || [""])[0];
        let n = 0;
        for (let i = 0; i < letters.length; i++) n = n * 26 + (letters.charCodeAt(i) - 64);
        return n - 1;
    }

    function sheetToRows(xml, shared) {
        const rows = [];
        (xml.match(/<row[^>]*>[\s\S]*?<\/row>|<row[^>]*\/>/g) || []).forEach(function (rowXml) {
            const cells = [];
            (rowXml.match(/<c[^>]*>[\s\S]*?<\/c>|<c[^>]*\/>/g) || []).forEach(function (cellXml) {
                const ref = (cellXml.match(/ r="([A-Z]+\d+)"/) || [])[1];
                const type = (cellXml.match(/ t="([^"]+)"/) || [])[1];
                let value = "";
                if (type === "inlineStr") {
                    const t = cellXml.match(/<t[^>]*>([\s\S]*?)<\/t>/);
                    value = t ? unescapeXml(t[1]) : "";
                } else {
                    const v = cellXml.match(/<v>([\s\S]*?)<\/v>/);
                    value = v ? unescapeXml(v[1]) : "";
                    if (type === "s") value = shared[parseInt(value, 10)] || "";
                }
                cells[ref ? colToIndex(ref) : cells.length] = value;
            });
            for (let i = 0; i < cells.length; i++) if (cells[i] === undefined) cells[i] = "";
            rows.push(cells);
        });
        return rows;
    }

    function parseXlsx(arrayBuffer) {
        const entries = findZipEntries(arrayBuffer);
        const sheetName = Object.keys(entries)
            .filter(function (n) { return /^xl\/worksheets\/sheet\d+\.xml$/.test(n); })
            .sort()[0];
        if (!sheetName) throw new Error("no worksheet found in the file");

        const sharedEntry = entries["xl/sharedStrings.xml"];
        return Promise.all([
            sharedEntry ? inflateEntry(sharedEntry) : Promise.resolve(""),
            inflateEntry(entries[sheetName])
        ]).then(function (parts) {
            const rows = sheetToRows(parts[1], sharedStringsFrom(parts[0]));
            return tableToObjects(rows).map(normalizeRecord).filter(Boolean);
        });
    }

    // Accepts the raw text of a JSON or CSV export and returns normalized records.
    function parseExport(text) {
        const trimmed = text.trim();
        let records;
        if (trimmed[0] === "[" || trimmed[0] === "{") {
            let data = JSON.parse(trimmed);
            if (!Array.isArray(data)) {
                // find the array inside a wrapper object
                const arr = Object.keys(data).map(function (k) { return data[k]; })
                    .find(function (v) { return Array.isArray(v); });
                data = arr || [data];
            }
            records = data;
        } else {
            records = parseCsv(text);
        }
        return records.map(normalizeRecord).filter(Boolean);
    }

    /* ---- fuzzy matching ---------------------------------------------- */

    const STOPWORDS = ["raw", "fresh", "dried", "cooked", "roasted", "canned",
        "whole", "ground", "fat", "free", "low", "full", "added", "sugar",
        "cheese", "of", "and", "the"];

    /* Swedish preparation and state words. These stay in the bigram
       comparison, where they usefully separate "Fikon" from "Fikon torkade",
       but they never earn the shared-token boost on their own — otherwise
       every dried food matches every other dried food. */
    const WEAK_TOKENS = ["rått", "råa", "kokt", "kokta", "kokad", "torkad",
        "torkat", "torkade", "stekt", "stekta", "färsk", "färska", "fryst",
        "frysta", "inlagd", "inlagda", "rökt", "rökta", "saltad", "saltat",
        "normalsaltat", "osaltat", "berikad", "berikat", "med", "utan", "och",
        "okokt", "otillagad", "obehandlad",
        // packaging and seasoning notes: "u. salt", "konserv.", "frysvara"
        // describe how an entry was recorded, not what the food is
        "salt", "socker", "kryddad", "kryddor", "konserv", "avrunna", "lag",
        "frysvara", "hemlagad", "tillagad", "restaurang", "naturell",
        "fett", "fetthalt", "ekologisk", "hel", "hela", "malen", "malet"];

    function tokens(name) {
        const cleaned = norm(name)
            .replace(/\([^)]*\)/g, " ")
            .replace(/[^a-zåäöéü0-9]+/g, " ")
            .split(" ")
            .filter(Boolean);
        const kept = cleaned.filter(function (t) {
            return t.length > 2 && STOPWORDS.indexOf(t) === -1;
        });
        // short Swedish names ("Öl", "Te", "Ris") would otherwise vanish entirely
        return kept.length ? kept : cleaned;
    }

    function bigrams(s) {
        const out = {};
        for (let i = 0; i < s.length - 1; i++) out[s.slice(i, i + 2)] = true;
        return out;
    }

    function dice(a, b) {
        const A = bigrams(a), B = bigrams(b);
        const ka = Object.keys(A), kb = Object.keys(B);
        if (!ka.length || !kb.length) return 0;
        let hits = 0;
        ka.forEach(function (g) { if (B[g]) hits++; });
        return (2 * hits) / (ka.length + kb.length);
    }

    /* Swedish inflects nouns with a small closed set of endings, so "kikärt"
       and "kikärtor" are the same word. Compounds are not: "majsolja" is an
       oil and "pepparrot" is a root, however much they look like majs and
       peppar. Only a known ending counts, which is the difference between
       matching an inflection and matching a different food entirely. */
    const ENDINGS = ["or", "orna", "er", "erna", "ar", "arna", "en", "et",
        "na", "n", "t", "a", "s", "ter", "terna"];   // nöt -> nötter

    function sameWord(a, b) {
        if (a === b) return true;
        const short = a.length < b.length ? a : b;
        const long = a.length < b.length ? b : a;
        if (short.length >= 4 && long.indexOf(short) === 0 &&
            ENDINGS.indexOf(long.slice(short.length)) !== -1) return true;
        // räka/räkor and kaka/kakor replace the ending rather than add to it,
        // so compare the stems once each has had its ending taken off
        return short.length >= 4 && stem(a) === stem(b);
    }

    function stem(w) {
        for (let i = 0; i < ENDINGS.length; i++) {
            const e = ENDINGS[i];
            if (w.length - e.length >= 3 && w.slice(-e.length) === e) {
                return w.slice(0, w.length - e.length);
            }
        }
        return w;
    }

    /* Fat percentages are the whole point of several of our entries — 5, 12
       and 20 percent mince are three different foods — but they vanish in
       tokenisation: parentheses are stripped and "5" is too short to survive.
       Read as numbers instead, and let the closest one win. */
    function percents(name) {
        const out = [];
        String(name).replace(/(\d+(?:[.,]\d+)?)\s*%/g, function (_, n) {
            out.push(parseFloat(n.replace(",", ".")));
            return "";
        });
        return out;
    }

    function percentAdjust(a, b) {
        const pa = percents(a), pb = percents(b);
        if (!pa.length || !pb.length) return 0;
        let diff = Infinity;
        pa.forEach(function (x) {
            pb.forEach(function (y) { diff = Math.min(diff, Math.abs(x - y)); });
        });
        return diff <= 1 ? 0.08 : -Math.min(0.35, diff * 0.02);
    }

    function score(ourName, lmvName, hint) {
        const ta = tokens(ourName), tb = tokens(lmvName);
        if (!ta.length || !tb.length) return 0;

        // Qualifiers are dropped from the letter-pattern comparison too, or
        // "Timjan torkad" and "Banan torkad" look alike on the strength of
        // "torkad" alone — which is how thyme ended up matching dried banana.
        const a = ta.filter(function (t) { return WEAK_TOKENS.indexOf(t) === -1; }).join(" ") || ta.join(" ");
        const b = tb.filter(function (t) { return WEAK_TOKENS.indexOf(t) === -1; }).join(" ") || tb.join(" ");

        // a full token appearing in both is strong evidence across languages
        // ("roquefort", "halloumi", "quinoa" are spelled the same in Swedish)
        const shared = ta.filter(function (t) {
            if (WEAK_TOKENS.indexOf(t) !== -1) return false;
            return tb.some(function (u) { return sameWord(t, u); });
        });
        /* No word in common — fall back to letter-pattern similarity, but
           capped below the shared-word range. "Ättika" and "Rättika" differ by
           one letter and would otherwise outrank the real "Ättika 12%". */
        if (!shared.length) return Math.min(dice(a, b), 0.8);

        /* How much of each name the shared words actually account for.

           Without this, "Lax" and "Bagel m. rökt lax färskost sallad" score
           the same for "Salmon" — both contain "lax" — and the composite dish
           wins on iteration order. The database is full of prepared dishes, so
           a candidate carrying a pile of unrelated words has to rank below the
           plain ingredient. Weak words (rå, kokt, torkad) are not counted as
           clutter, since "Lax rå" is still just salmon. */
        const strongB = tb.filter(function (t) {
            return WEAK_TOKENS.indexOf(t) === -1 &&
                !shared.some(function (u) { return sameWord(t, u); });
        });
        const clutter = strongB.length;
        const strongA = ta.filter(function (t) { return WEAK_TOKENS.indexOf(t) === -1; });
        const coverage = shared.length /
            Math.max(1, strongA.length, shared.length + clutter);

        /* A state word we asked for and did not get is a mismatch, not clutter:
           searching "Mango torkad" and being handed fresh "Mango" is wrong, and
           so is "Linser kokta" answered with "Linser torkade". Weak words are
           ignored when the candidate has them and we did not — "Lax rå" is
           still salmon — but never the other way round. */
        const wantedState = ta.filter(function (t) { return WEAK_TOKENS.indexOf(t) !== -1; });
        const missingState = wantedState.filter(function (t) {
            return !tb.some(function (u) { return sameWord(t, u); });
        });

        /* Livsmedelsverket names lead with the ingredient — "Lax rå", "Ägg
           hönsägg", "Ost halloumi" — while dishes bury it: "Våffla m. ägg".
           So a match on the first word counts for more. */
        const headMatch = shared.some(function (t) { return sameWord(t, tb[0]); }) ? 0.05 : 0;

        // the hint carries the food's own name, so "(~12% fat)" still counts
        // even when the Swedish search term omits the percentage
        const pct = percentAdjust(percents(ourName).length ? ourName : (hint || ourName), lmvName);

        const s = 0.45 + 0.45 * coverage - 0.04 * clutter + headMatch
            - 0.25 * missingState.length + pct;
        return Math.max(0, Math.min(s, 1));
    }

    /* ---- the audit ---------------------------------------------------- */

    function auditFood(food, record) {
        const n = record.nutrients;
        const findings = [];

        /* Foods eaten in gram amounts are exempt from the per-100g fat,
           protein and fiber thresholds — cinnamon is 53g fiber per 100g, but
           nobody eats 100g of cinnamon. Only the concentration-based traits
           (lactose, alcohol) still apply. */
        const servingRules = ["over_10g_fat", "protein", "fiber"];

        RULES.forEach(function (rule) {
            const value = n[rule.nutrient];
            if (value == null) return;
            if (rule.requires && food.traits.indexOf(rule.requires) === -1) return;
            if (food.smallServing && servingRules.indexOf(rule.trait) !== -1) return;
            // whole seeds are tagged on fiber alone — the fat stays in the shell
            if (food.wholeSeed && rule.trait !== "fiber") return;
            // lactose-free dairy still reports those sugars as glucose and galactose
            if (rule.trait === "over_3g_lactose" && /lactose-free/i.test(food.name)) return;
            const has = food.traits.indexOf(rule.trait) !== -1;
            const expected = value > rule.min;
            if (has === expected) return;
            findings.push({
                trait: rule.trait,
                soft: Boolean(rule.soft),
                missing: expected,
                text: (expected ? "missing" : "extra") + " — " + rule.nutrient + " " +
                      value + " g/100g vs threshold " + rule.min
            });
        });

        if (!food.smallServing && !food.wholeSeed && (n.fat != null || n.protein != null)) {
            const has = food.traits.indexOf("bile_stimulant") !== -1;
            const expected = bileExpected(n);
            if (has !== expected) {
                findings.push({
                    trait: "bile_stimulant",
                    soft: false,
                    missing: expected,
                    text: (expected ? "missing" : "extra") + " — fat " + n.fat +
                          ", protein " + n.protein + " (needs fat>17.5 or protein>20)"
                });
            }
        }

        return findings;
    }

    /* ours:    [{ name, category, traits }]
       lmv:     normalized records from parseExport
       aliases: { "our name": "exact Livsmedelsverket name" } — treated as certain
       swedish: { "our name": "Swedish term" | [terms] } — only steers the fuzzy
                match, so a wrong term shows up as an obviously wrong suggestion */
    function runAudit(ours, lmv, aliases, swedish, absent) {
        aliases = aliases || {};
        swedish = swedish || {};
        absent = absent || {};

        /* Where curated Swedish terms exist they replace our English name
           rather than joining it. The English name carries no preparation
           word, so keeping it as a fallback let it match an uncooked entry
           with no penalty and beat the cooked term we actually asked for. */
        function searchTerms(name) {
            const extra = swedish[name];
            if (!extra) return [name];
            return Array.isArray(extra) ? extra : [extra];
        }

        const detected = {};
        lmv.forEach(function (r) {
            Object.keys(r.nutrients).forEach(function (k) {
                if (r.nutrients[k] != null) detected[k] = (detected[k] || 0) + 1;
            });
        });

        const byName = {};
        lmv.forEach(function (r) { byName[norm(r.name)] = r; });

        const disagreements = [], suggestions = [], unmatched = [], clean = [], skipped = [];

        ours.forEach(function (food) {
            if (absent[food.name]) { skipped.push(food); return; }
            const alias = aliases[food.name];
            const record = alias ? byName[norm(alias)] : null;

            if (record) {
                const findings = auditFood(food, record);
                if (findings.length) disagreements.push({ food: food, record: record, findings: findings });
                else clean.push({ food: food, record: record });
                return;
            }

            const terms = searchTerms(food.name);
            let best = null, bestScore = 0;
            lmv.forEach(function (r) {
                terms.forEach(function (term, rank) {
                    const s = score(term, r.name, food.name) - 0.04 * rank;
                    if (s > bestScore) { bestScore = s; best = r; }
                });
            });

            if (best && bestScore >= 0.62) suggestions.push({ food: food, record: best, score: bestScore });
            else unmatched.push(food);
        });

        suggestions.sort(function (a, b) { return b.score - a.score; });

        return {
            detected: detected,
            confirmed: disagreements.length + clean.length,
            disagreements: disagreements,
            clean: clean,
            suggestions: suggestions,
            unmatched: unmatched,
            skipped: skipped
        };
    }

    // Flattens CATEGORIES from foods-data.js into what runAudit wants.
    function flattenCategories(categories) {
        const out = [];
        categories.forEach(function (cat) {
            cat.foods.forEach(function (food) {
                out.push({
                    name: food.name,
                    category: cat.label,
                    traits: food.traits,
                    smallServing: Boolean(food.smallServing || cat.smallServing),
                    wholeSeed: Boolean(food.wholeSeed)
                });
            });
        });
        return out;
    }

    const LMV = {
        RULES: RULES,
        parseExport: parseExport,
        parseCsv: parseCsv,
        parseXlsx: parseXlsx,
        score: score,
        auditFood: auditFood,
        runAudit: runAudit,
        flattenCategories: flattenCategories
    };

    if (typeof module === "object" && module.exports) module.exports = LMV;
    else root.LMV = LMV;
})(typeof self !== "undefined" ? self : this);
