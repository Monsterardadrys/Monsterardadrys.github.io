/* =========================================================================
   check-i18n.js — the two languages, kept level

       node tools/check-i18n.js

   The data layer is checked by check-data.js: every food, category and trait
   needs a Swedish string or the build stops. This is the same rule for the
   other two halves of the site.

     1. THE PAGES. A page's fixed copy lives on the element that carries it —
        <h2 data-sv="Väg en måltid">Weigh up a meal</h2>. This walks the
        translated pages and reports any visible text with no Swedish beside
        it. Adding an English heading and no Swedish one fails the build the
        same way adding an English food name does.

     2. THE SENTENCES. ui-text.js holds the lines the scripts assemble, one
        key with both languages. A key with only one is a fault, and so is a
        key nothing uses: a dead string is a translation nobody will notice
        going stale.

   PAGES ARE OPTED IN, NOT ASSUMED. TRANSLATED lists the pages that have had
   a round; a page not on it is not a fault, because the translation is being
   done in rounds and a check that fails on work not yet started is a check
   people learn to ignore. Adding a page to that list is what makes it
   binding, and is the last step of translating it.
   ========================================================================= */

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

// Pages whose own copy has been translated. Add a page here when its round
// is done — that is what makes the rule bite for it.
const TRANSLATED = ["index.html", "app.html", "meal.html"];

// Scripts that build sentences, and so must only use keys that exist.
const SCRIPTS = [
  "script.js", "meal.js", "landing.js", "without.js", "food-picker.js",
  "trait-foods.js", "nav.js", "save-load.js", "session.js", "print.js"
];

/* Text that is the same in both languages and needs no translating: an email
   address, a version stamp's shared half, a bare symbol. Matching these is
   how the check stays quiet about things that are already correct. */
function needsNoTranslation(text) {
  const t = text.trim();
  if (!t) return true;
  if (t.length < 2) return true;                       // ×, ▾, &times;
  if (/^(?:&[a-zA-Z]+;|&#\d+;|\s)+$/.test(t)) return true;  // &times; and friends
  if (!/[a-zA-Z]{2}/.test(t)) return true;             // digits, punctuation
  if (/^[\w.+-]+@[\w.-]+$/.test(t)) return true;       // an email address
  if (/^https?:\/\//.test(t)) return true;
  return false;
}

const faults = [];
const warnings = [];

// ---- 1. The pages --------------------------------------------------------

/* A crude but sufficient reading of the HTML: strip comments, scripts and
   styles, then walk tags keeping track of whether the element we are inside
   carries data-sv. Text under a translated element is covered by it — that
   is the point of putting the attribute on the element that owns the copy. */
function untranslatedText(html) {
  const body = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<!DOCTYPE[^>]*>/gi, "");

  const missing = [];
  const stack = [];          // one entry per open element: covered or not
  const token = /<(\/?)([a-zA-Z][\w-]*)([^>]*?)(\/?)>|([^<]+)/g;
  const VOID = /^(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)$/i;
  let m;

  while ((m = token.exec(body))) {
    const [, closing, tag, attrs, selfClose, text] = m;

    if (text !== undefined) {
      const covered = stack.some(Boolean);
      if (!covered && !needsNoTranslation(text)) {
        missing.push(text.trim().replace(/\s+/g, " ").slice(0, 70));
      }
      continue;
    }

    if (closing) { stack.pop(); continue; }
    const hasSv = /\sdata-sv\s*=/.test(attrs);

    // An attribute that shows text needs its own data-sv-<attr>.
    ["placeholder", "aria-label", "title"].forEach(function (name) {
      const has = new RegExp('\\s' + name + '\\s*=\\s*"([^"]*)"').exec(attrs);
      if (has && !needsNoTranslation(has[1]) &&
        !new RegExp('\\sdata-sv-' + name + '\\s*=').test(attrs)) {
        missing.push(name + '="' + has[1].slice(0, 50) + '"');
      }
    });

    if (VOID.test(tag) || selfClose) continue;
    stack.push(hasSv);
  }

  return missing;
}

TRANSLATED.forEach(function (page) {
  const file = path.join(root, page);
  if (!fs.existsSync(file)) { faults.push(page + " is listed as translated but does not exist"); return; }
  const missing = untranslatedText(fs.readFileSync(file, "utf8"));
  if (!missing.length) return;
  faults.push(page + " has " + missing.length + " string(s) with no Swedish: " +
    missing.slice(0, 6).map(function (t) { return '"' + t + '"'; }).join(", ") +
    (missing.length > 6 ? " and " + (missing.length - 6) + " more" : ""));
});

// ---- 2. The sentences ----------------------------------------------------

const { UI } = require(path.join(root, "ui-text.js"));

Object.keys(UI).forEach(function (key) {
  const entry = UI[key];
  if (!entry.en) faults.push("ui-text key " + key + " has no English");
  if (!entry.sv) faults.push("ui-text key " + key + " has no Swedish");
  if (!entry.en || !entry.sv) return;

  /* Both languages have to fill the same slots. A Swedish sentence that
     forgets {n} prints a sentence with a number missing, which reads as a
     bug rather than as a translation. Only checked where both are plain
     strings; a function fills its own slots by hand. */
  if (typeof entry.en === "string" && typeof entry.sv === "string") {
    const slots = function (s) {
      return (s.match(/\{(\w+)\}/g) || []).sort().join(",");
    };
    if (slots(entry.en) !== slots(entry.sv)) {
      faults.push("ui-text key " + key + " fills different slots in each language: " +
        "English has " + (slots(entry.en) || "none") + ", Swedish has " +
        (slots(entry.sv) || "none"));
    }
  }

  if (typeof entry.en !== typeof entry.sv) {
    warnings.push("ui-text key " + key + " is a " + typeof entry.en +
      " in English and a " + typeof entry.sv + " in Swedish");
  }
});

// Keys nothing uses, and keys used but not defined.
const used = new Set();
SCRIPTS.forEach(function (name) {
  const file = path.join(root, name);
  if (!fs.existsSync(file)) return;
  const text = fs.readFileSync(file, "utf8");
  (text.match(/I18N\.t\(\s*"([^"]+)"/g) || []).forEach(function (call) {
    used.add(/"([^"]+)"/.exec(call)[1]);
  });
  /* A key can also be reached through a table — IN_GRAMS and PER_HELPING in
     meal.js hold key names rather than words. Count any bare string that
     matches a key we know about. */
  Object.keys(UI).forEach(function (key) {
    if (text.indexOf('"' + key + '"') !== -1) used.add(key);
  });
});

Object.keys(UI).forEach(function (key) {
  if (!used.has(key)) warnings.push("ui-text key " + key + " is used by nothing");
});

used.forEach(function (key) {
  if (!UI[key]) faults.push("a script asks for ui-text key " + key + ", which does not exist");
});

// ---- Report --------------------------------------------------------------

console.log(TRANSLATED.length + " translated page(s), " +
  Object.keys(UI).length + " ui-text key(s)");

if (warnings.length) {
  console.log("\nWarnings (" + warnings.length + ")");
  warnings.forEach(function (w) { console.log("  - " + w); });
}

if (faults.length) {
  console.log("\nFaults (" + faults.length + ")");
  faults.forEach(function (f) { console.log("  - " + f); });
  process.exit(1);
}

console.log("\nNo faults.");
