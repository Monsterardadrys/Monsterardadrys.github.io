/* =========================================================================
   check-free.js — the checks this repository can run on itself

       node tools/check-free.js

   THIS REPOSITORY IS INDEPENDENT. It was briefly described as generated
   output from a private source, and that was never how it worked: every
   release since the split has edited these pages, scripts and styles
   directly here. Only the food and article data was ever derived, and
   deriving it was a one-time cut, not a pipeline.

   So the two repositories are handled separately. The full database gets
   new foods, new rounds and new figures; this one gets a considered copy
   when something is worth putting in the sample. Neither waits for the
   other, and neither has to be checked out to work on the other.

   That leaves one property nobody else can guarantee, and it is the one
   that matters: NOTHING PAID MAY SHIP HERE. The risk lives in this
   repository, so the check does too. Rule 1 below is that check. The rest
   are the release checks the site used to have before tools/ was removed —
   they were being run by hand from a scratchpad every release, which is a
   check that works until the day somebody forgets.

     1. NOTHING LOCKED SHIPS ITS DATA. A locked food carries a name and a
        Swedish name and nothing else — no portion, no traits, no figures
        in any of the three data files. A locked article carries a title
        and nothing else. A trait the sample does not include is absent
        from the trait table and from every food that used to carry it.
        Finally the raw text of every shipped file is searched for phrases
        that exist only in locked articles, in case something survives
        outside the data structures.

     2. LINKS. Every local href resolves, and every #anchor exists on the
        page it points at.

     3. BOTH LANGUAGES. Every visible string has a Swedish one beside it,
        and the two carry the same markup and the same links. A Swedish
        paragraph that quietly loses a link is the failure this catches.

     4. THE RELEASE STAMP. All eight footers agree on one version and one
        date. The version used to live in sw.js and be compared against it;
        sw.js left with the offline build, so they are held to each other.

     5. NOTHING DANGLING. No page loads a script that does not exist, and
        no script sits in the root that no page loads.
   ========================================================================= */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
const faults = [];
const notes = [];

const pages = fs.readdirSync(ROOT).filter((f) => /\.html$/.test(f));
const scripts = fs.readdirSync(ROOT).filter((f) => /\.js$/.test(f));

// ---- 1. Nothing locked ships its data ------------------------------------

const { CATEGORIES, TRAITS } =
  new Function(read("foods-data.js") + "; return { CATEGORIES, TRAITS };")();
const { NUTRITION } = new Function(read("nutrition-data.js") + "; return { NUTRITION };")();
const { FODMAP_SERVES } = new Function(read("fodmap-data.js") + "; return { FODMAP_SERVES };")();
const { ARTICLES } = new Function(read("articles-data.js") + "; return { ARTICLES };")();

/* Everything a locked entry is allowed to carry. Anything else is data the
   sample was supposed to withhold, and the point of listing it as an
   allowance rather than a denial is that a field added later fails loudly
   instead of slipping through. */
const FOOD_ALLOWED = ["name", "sv", "locked"];
const ARTICLE_ALLOWED = ["title", "sv", "locked"];

let free = 0, locked = 0;
CATEGORIES.forEach((c) => c.foods.forEach((f) => {
  if (!f.locked) {
    free++;
    if (!Array.isArray(f.traits)) faults.push("free food " + f.name + " has no traits");
    return;
  }
  locked++;
  const extra = Object.keys(f).filter((k) => FOOD_ALLOWED.indexOf(k) === -1);
  if (extra.length) faults.push("locked food " + f.name + " ships " + extra.join(", "));
  if (NUTRITION[f.name]) faults.push("locked food " + f.name + " ships nutrition figures");
  if (FODMAP_SERVES[f.name]) faults.push("locked food " + f.name + " ships a low-FODMAP serving");
}));

let articlesFree = 0, articlesLocked = 0;
Object.keys(ARTICLES).forEach((id) => {
  const a = ARTICLES[id];
  if (!a.locked) {
    articlesFree++;
    if (!a.sections || !a.sections.length) faults.push("free article " + id + " has no text");
    return;
  }
  articlesLocked++;
  const extra = Object.keys(a).filter((k) => ARTICLE_ALLOWED.indexOf(k) === -1);
  if (extra.length) faults.push("locked article " + id + " ships " + extra.join(", "));
});

/* The specific tier the sample does not carry. Named here rather than
   worked out, because the list is the decision: if one of these is ever
   meant to come back, it comes back by being deleted from this line. */
const CUT_TRAITS = ["fructose", "polyols", "fructans", "galactans",
  "capsaicin", "peel_skin", "allyl_compounds", "carbonation", "aceticAcid",
  "cross_birch", "cross_grass", "cross_mugwort", "cross_latex"];

CUT_TRAITS.forEach((t) => {
  if (TRAITS[t]) faults.push("trait " + t + " is not in the sample but is still defined");
});
CATEGORIES.forEach((c) => c.foods.forEach((f) => (f.traits || []).forEach((t) => {
  if (CUT_TRAITS.indexOf(t) !== -1) faults.push(f.name + " still carries " + t);
  else if (!TRAITS[t]) faults.push(f.name + " carries " + t + ", which no trait table defines");
})));

/* Last resort, and the only rule here that does not trust the data
   structures: a phrase from the body of a locked article, searched for in
   the raw bytes of every file that ships. It has one false positive to know
   about — sources.html cites the EU annex the allergen article also names —
   so the needles are chosen to sit inside prose rather than in a citation. */
const NEEDLES = {
  "the histamine article": "diamine oxidase",
  "the salicylate article": "acetylsalicylic",
  "the alpha-gal article": "galactose-alpha-1,3-galactose"
};
const shipped = fs.readdirSync(ROOT).filter((f) => /\.(js|html|css|md)$/.test(f));
Object.keys(NEEDLES).forEach((label) => {
  shipped.forEach((f) => {
    if (read(f).indexOf(NEEDLES[label]) !== -1) {
      faults.push("text from " + label + " is in " + f);
    }
  });
});

notes.push(free + " free foods, " + locked + " locked · " +
  articlesFree + " free articles, " + articlesLocked + " locked · " +
  Object.keys(TRAITS).length + " traits · " +
  Object.keys(NUTRITION).length + " with figures");

// ---- 2. Links -------------------------------------------------------------

const idsOn = {};
pages.forEach((p) => {
  idsOn[p] = new Set(Array.from(read(p).matchAll(/\sid="([^"]+)"/g)).map((m) => m[1]));
});
const articleKeys = new Set(Object.keys(ARTICLES));

pages.forEach((p) => {
  Array.from(read(p).matchAll(/href="([^"]+)"/g)).map((m) => m[1]).forEach((href) => {
    if (/^(https?:|mailto:)/.test(href)) return;
    if (href[0] === "#") {
      if (!idsOn[p].has(href.slice(1))) faults.push(p + " links to " + href + ", no such id");
      return;
    }
    const [file, anchor] = href.split("#");
    if (file && !fs.existsSync(path.join(ROOT, file))) {
      faults.push(p + " links to " + file + ", which does not exist");
      return;
    }
    if (!anchor) return;
    // articles.html routes on the hash, so its anchors are article keys.
    if (file === "articles.html") {
      if (!articleKeys.has(anchor)) faults.push(p + " links to " + href + ", no such article");
    } else if (idsOn[file] && !idsOn[file].has(anchor)) {
      faults.push(p + " links to " + href + ", no such id");
    }
  });
});

// ---- 3. Both languages ----------------------------------------------------

/* Text that is the same in both languages and needs no translating: a name,
   an address, a bare symbol. Matching these is how the check stays quiet
   about what is already correct. */
function needsNoTranslation(text) {
  const t = text.trim();
  if (!t || t.length < 2) return true;
  if (/^(?:&[a-zA-Z]+;|&#\d+;|\s)+$/.test(t)) return true;
  if (!/[a-zA-Z]{2}/.test(t)) return true;
  if (/^[\w.+-]+@[\w.-]+$/.test(t)) return true;
  if (/^https?:\/\//.test(t)) return true;
  return false;
}

const VOID = /^(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)$/i;

pages.forEach((page) => {
  const body = read(page)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<!DOCTYPE[^>]*>/gi, "");

  const missing = [];
  const stack = [];
  const token = /<(\/?)([a-zA-Z][\w-]*)([^>]*?)(\/?)>|([^<]+)/g;
  let m;
  while ((m = token.exec(body))) {
    const [, closing, tag, attrs, selfClose, text] = m;
    if (text !== undefined) {
      if (!stack.some(Boolean) && !needsNoTranslation(text)) {
        missing.push(text.trim().replace(/\s+/g, " ").slice(0, 60));
      }
      continue;
    }
    if (closing) { stack.pop(); continue; }
    ["placeholder", "aria-label", "title"].forEach((name) => {
      const has = new RegExp('\\s' + name + '\\s*=\\s*"([^"]*)"').exec(attrs);
      if (has && !needsNoTranslation(has[1]) &&
        !new RegExp('\\sdata-sv-' + name + '\\s*=').test(attrs)) {
        missing.push(name + '="' + has[1].slice(0, 40) + '"');
      }
    });
    if (VOID.test(tag) || selfClose) continue;
    stack.push(/\sdata-sv\s*=/.test(attrs));
  }
  if (missing.length) {
    faults.push(page + " has " + missing.length + " string(s) with no Swedish: " +
      missing.slice(0, 4).map((t) => '"' + t + '"').join(", ") +
      (missing.length > 4 ? " and " + (missing.length - 4) + " more" : ""));
  }
});

/* data-sv is set as HTML when it contains markup, so a Swedish string can
   quietly lose a link or turn an <em> into a <strong>. Same tags, same
   order, same hrefs: the words change and the markup does not. */
const MARKUP = /<(a|strong|em|br|code|span)\b/gi;
function entities(t) {
  return t.replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}

pages.forEach((page) => {
  const html = read(page);
  const pattern = /<(\w+)((?:\s[^>]*?)?\sdata-sv="([^"]*)"(?:[^>]*?)?)>((?:(?!<\/\1>)[\s\S])*?)<\/\1>/g;
  let m;
  while ((m = pattern.exec(html))) {
    const body = m[4], sv = entities(m[3]);
    const label = body.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 45);
    const tagsOf = (t) => (t.match(MARKUP) || []).map((x) => x.slice(1).toLowerCase()).join(",");
    const hrefsOf = (t) => (t.match(/href="([^"]*)"/g) || []).join(" ");
    if (tagsOf(body) !== tagsOf(sv)) {
      faults.push(page + ' — "' + label + '" has markup [' + (tagsOf(body) || "none") +
        "] in English and [" + (tagsOf(sv) || "none") + "] in Swedish");
    } else if (hrefsOf(body) !== hrefsOf(sv)) {
      faults.push(page + ' — "' + label + '" links to ' + (hrefsOf(body) || "nothing") +
        " in English and " + (hrefsOf(sv) || "nothing") + " in Swedish");
    }
  }
});

// Every ui-text key needs both languages filling the same slots.
const { UI } = require(path.join(ROOT, "ui-text.js"));
Object.keys(UI).forEach((key) => {
  const entry = UI[key];
  if (!entry.en) faults.push("ui-text key " + key + " has no English");
  if (!entry.sv) faults.push("ui-text key " + key + " has no Swedish");
  if (typeof entry.en === "string" && typeof entry.sv === "string") {
    const slots = (s) => (s.match(/\{(\w+)\}/g) || []).sort().join(",");
    if (slots(entry.en) !== slots(entry.sv)) {
      faults.push("ui-text key " + key + " fills different slots in each language");
    }
  }
});

// Every article title needs both languages too.
Object.keys(ARTICLES).forEach((id) => {
  if (!ARTICLES[id].sv) faults.push("article " + id + " has no Swedish title");
});

// ---- 4. The release stamp -------------------------------------------------

const versions = {}, dates = {};
pages.forEach((p) => {
  const m = read(p).match(/Pre-beta (v[\d.]+) — updated ([^<]+)</);
  if (!m) { faults.push(p + " has no version line in its footer"); return; }
  (versions[m[1]] = versions[m[1]] || []).push(p);
  (dates[m[2]] = dates[m[2]] || []).push(p);
});
if (Object.keys(versions).length > 1) {
  faults.push("pages carry different versions: " + Object.keys(versions).map(
    (v) => v + " (" + versions[v].join(", ") + ")").join("; "));
}
if (Object.keys(dates).length > 1) {
  faults.push("pages carry different dates: " + Object.keys(dates).join(", "));
}
if (Object.keys(versions).length === 1) {
  notes.push("version " + Object.keys(versions)[0] + ", " + Object.keys(dates)[0]);
}

// ---- 5. Nothing dangling --------------------------------------------------

const loadedAnywhere = new Set();
pages.forEach((page) => {
  Array.from(read(page).matchAll(/<script src="([^"]+)"><\/script>/g)).forEach((m) => {
    loadedAnywhere.add(m[1]);
    if (!fs.existsSync(path.join(ROOT, m[1]))) {
      faults.push(page + " loads " + m[1] + ", which does not exist");
    }
  });
});
scripts.forEach((s) => {
  if (!loadedAnywhere.has(s)) faults.push(s + " sits in the root but no page loads it");
});

// ---- Report ---------------------------------------------------------------

console.log(pages.length + " pages, " + scripts.length + " scripts");
notes.forEach((n) => console.log("  " + n));

if (faults.length) {
  console.log("\nFaults (" + faults.length + ")");
  faults.forEach((f) => console.log("  - " + f));
  process.exit(1);
}

console.log("\nNo faults.");
