/* =========================================================================
   check-site.js — the release checks that were being done by eye

       node tools/check-site.js

   Every one of these caught a real mistake at least once. Exits non-zero on
   a fault so it can gate a release; run it together with check-data.js.

     1. Version — the footer line on every page matches VERSION in sw.js,
        and the date is the same everywhere.
     2. Service worker — every .html/.js/.css in the repo root is precached,
        and every precached path exists. A file missing from ASSETS works
        online and breaks offline, which is exactly the sort of thing nobody
        notices for three releases.
     3. Links — every href to a local page resolves, and every #anchor
        resolves to an id on the target page or to an article key.
     4. Scripts — a page using a shared behaviour loads the file providing
        it. The disclaimer popup was dead on Foods without for a release
        because the page never loaded the script that runs it.
     5. Prose against data — the food count and the doses quoted in About
        and the method page match what the code actually does.
   ========================================================================= */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const faults = [];
const notes = [];

function read(f) { return fs.readFileSync(path.join(ROOT, f), "utf8"); }
function exists(f) { return fs.existsSync(path.join(ROOT, f)); }

/* editor.html is a workbench for editing foods-data.js by hand, not part of
   the published site: it carries no footer, and precaching it would put a
   content editor on every visitor's phone. */
const NOT_PUBLISHED = ["editor.html"];

const pages = fs.readdirSync(ROOT).filter(function (f) {
  return /\.html$/.test(f) && NOT_PUBLISHED.indexOf(f) === -1;
});
const scripts = fs.readdirSync(ROOT).filter(function (f) { return /\.js$/.test(f); });

const foodsSource = read("foods-data.js");
const { TRAITS, CATEGORIES } =
  new Function(foodsSource + "; return { TRAITS, CATEGORIES };")();
const { ARTICLES } =
  new Function(read("articles-data.js") + "; return { ARTICLES };")();

// ---- 1. Version ----------------------------------------------------------
const swVersion = (read("sw.js").match(/const VERSION = "(v[\d.]+)"/) || [])[1];
if (!swVersion) faults.push("sw.js has no VERSION");

const stamps = {};
pages.forEach(function (page) {
  const m = read(page).match(/Pre-beta (v[\d.]+) — updated ([^<]+)</);
  if (!m) { faults.push(page + " has no version line in its footer"); return; }
  if (m[1] !== swVersion) {
    faults.push(page + " says " + m[1] + ", sw.js says " + swVersion);
  }
  (stamps[m[2]] = stamps[m[2]] || []).push(page);
});
if (Object.keys(stamps).length > 1) {
  faults.push("pages carry different dates: " + Object.keys(stamps).map(function (d) {
    return d + " (" + stamps[d].join(", ") + ")";
  }).join("; "));
}

// ---- 2. Service worker ---------------------------------------------------
const assets = (read("sw.js").match(/const ASSETS = \[([\s\S]*?)\];/) || [])[1] || "";
const cached = (assets.match(/"([^"]+)"/g) || []).map(function (s) { return s.slice(1, -1); });

cached.forEach(function (asset) {
  if (asset === "./") return;
  if (!exists(asset)) faults.push("sw.js precaches " + asset + ", which does not exist");
});

pages.concat(scripts).concat(["styles.css"]).forEach(function (file) {
  if (file === "sw.js") return;   // the worker never caches itself
  if (NOT_PUBLISHED.indexOf(file) !== -1) return;
  if (cached.indexOf(file) === -1) faults.push(file + " is not in the sw.js precache list");
});

// ---- 3. Links ------------------------------------------------------------
const idsOn = {};
pages.forEach(function (page) {
  const html = read(page);
  idsOn[page] = new Set((html.match(/\sid="([^"]+)"/g) || []).map(function (s) {
    return s.match(/id="([^"]+)"/)[1];
  }));
});

// The articles page routes on the hash, so its anchors are article keys.
const articleKeys = new Set(Object.keys(ARTICLES));

function checkHref(where, href) {
  if (/^(https?:|mailto:|#)/.test(href)) {
    if (href[0] === "#") {
      const id = href.slice(1);
      if (!idsOn[where].has(id)) faults.push(where + " links to #" + id + ", no such id");
    }
    return;
  }
  const parts = href.split("#");
  const file = parts[0];
  if (!file) return;
  if (!exists(file)) { faults.push(where + " links to " + file + ", which does not exist"); return; }
  if (parts.length < 2 || !/\.html$/.test(file)) return;

  const anchor = parts[1];
  if (file === "articles.html") {
    if (!articleKeys.has(anchor)) {
      faults.push(where + " links to articles.html#" + anchor + ", no such article");
    }
  } else if (!idsOn[file].has(anchor)) {
    faults.push(where + " links to " + file + "#" + anchor + ", no such id");
  }
}

pages.forEach(function (page) {
  const html = read(page);
  (html.match(/href="([^"]+)"/g) || []).forEach(function (m) {
    checkHref(page, m.match(/href="([^"]+)"/)[1]);
  });
});

/* The menu is data now, not markup, so the link check has to reach into it.
   It also has to cover every published page: the reason the menu moved into
   nav.js is that Foods without had quietly lost the Meal builder link. */
// Read the array out of the source rather than running the file: nav.js
// touches the DOM the moment it loads, and there is no DOM here.
const NAV_LINKS = new Function("return " +
  (read("nav.js").match(/const NAV_LINKS = (\[[\s\S]*?\n\]);/) || [])[1])();
// Entries with `action` instead of `href` are buttons, not pages.
const menuPages = NAV_LINKS.filter(function (item) { return item.href; });
const inMenu = new Set(menuPages.map(function (item) { return item.href; }));

menuPages.forEach(function (item) {
  if (!exists(item.href)) faults.push("the menu links to " + item.href + ", which does not exist");
});
NAV_LINKS.forEach(function (item) {
  if (!item.href && !item.action) faults.push("a menu entry has neither href nor action");
});
/* Deliberately not in the menu. index.html is the Home link above the list,
   and method.html is the long working version — reached from About, where
   someone who wants that depth is already standing. */
const NOT_IN_MENU = ["index.html", "method.html"];

pages.forEach(function (page) {
  if (NOT_IN_MENU.indexOf(page) === -1 && !inMenu.has(page)) {
    faults.push(page + " is published but not in the menu (NAV_LINKS in nav.js)");
  }
  const html = read(page);
  if (!/<nav class="navDrawer"[\s\S]*?<ul><\/ul>[\s\S]*?<\/nav>/.test(html)) {
    faults.push(page + " does not leave its menu list empty for nav.js to fill");
  }
});

// Article links written in data rather than markup
Object.keys(ARTICLES).forEach(function (key) {
  JSON.stringify(ARTICLES[key]).replace(/articles\.html#([a-z_]+)/g, function (_, id) {
    if (!articleKeys.has(id)) faults.push("article " + key + " links to #" + id + ", no such article");
    return "";
  });
});

Object.keys(TRAITS).forEach(function (id) {
  const articleId = TRAITS[id].articleId;
  if (articleId && !articleKeys.has(articleId)) {
    faults.push("trait " + id + " points at article " + articleId + ", which does not exist");
  }
});

// ---- 4. Scripts a page needs ---------------------------------------------
// marker in the page -> file that has to be loaded for it to do anything
const NEEDS = [
  [/class="disclaimerBar"/, "disclaimer.js"],
  [/class="hamburgerBtn"/, "nav.js"],
  [/rel="manifest"/, "pwa.js"],
  [/id="traitPicker"/, "trait-foods.js"],
  [/id="mealBuilder"/, "nutrition-data.js"],
  [/id="mealBuilder"/, "fodmap-data.js"],
  [/SaveLoad|id="saveMealsButton"|id="saveSelectionButton"/, "save-load.js"]
];

pages.forEach(function (page) {
  const html = read(page);
  const loaded = (html.match(/<script src="([^"]+)"/g) || []).map(function (s) {
    return s.match(/src="([^"]+)"/)[1];
  });
  NEEDS.forEach(function (pair) {
    if (pair[0].test(html) && loaded.indexOf(pair[1]) === -1) {
      faults.push(page + " needs " + pair[1] + " but does not load it");
    }
  });
  // Order matters: a module using foods-data has to come after it.
  ["trait-foods.js", "without.js", "meal.js", "script.js"].forEach(function (dependant) {
    const i = loaded.indexOf(dependant);
    const j = loaded.indexOf("foods-data.js");
    if (i !== -1 && (j === -1 || j > i)) {
      faults.push(page + " loads " + dependant + " before foods-data.js");
    }
  });
});

// ---- 5. Prose against data -----------------------------------------------
const foodCount = CATEGORIES.reduce(function (sum, c) { return sum + c.foods.length; }, 0);

["about.html", "method.html"].forEach(function (page) {
  const html = read(page);
  (html.match(/all (\d+) foods/g) || []).forEach(function (m) {
    const n = Number(m.match(/(\d+)/)[1]);
    if (n !== foodCount) faults.push(page + ' says "' + m + '", the database holds ' + foodCount);
  });
});

// The doses quoted in prose, checked against tools/lmv-core.js.
const coreSource = read("tools/lmv-core.js");
const DOSE = {};
(coreSource.match(/const DOSE = \{([\s\S]*?)\};/) || ["", ""])[1]
  .replace(/(\w+):\s*([\d.]+)/g, function (_, k, v) { DOSE[k] = Number(v); return ""; });

const QUOTED = [
  [/<strong>Fat:<\/strong> ([\d.]+)g in a portion/, "fat"],
  [/<strong>Protein:<\/strong> ([\d.]+)g in a portion/, "protein"],
  [/<strong>Fiber:<\/strong> ([\d.]+)g in a portion/, "fiber"],
  [/<strong>Lactose:<\/strong> ([\d.]+)g in a portion/, "sugars"],
  [/<strong>Bile stimulant:<\/strong> ([\d.]+)g of fat/, "bile"]
];

["about.html", "method.html"].forEach(function (page) {
  const html = read(page);
  QUOTED.forEach(function (pair) {
    const m = html.match(pair[0]);
    if (!m) return;
    const quoted = Number(m[1]);
    if (DOSE[pair[1]] != null && quoted !== DOSE[pair[1]]) {
      faults.push(page + " quotes " + pair[1] + " at " + quoted +
        "g, tools/lmv-core.js uses " + DOSE[pair[1]] + "g");
    }
  });
});

// Coverage claims: how many foods have been checked against Livsmedelsverket.
const withLmv = [];
CATEGORIES.forEach(function (c) {
  c.foods.forEach(function (f) { if (f.lmv) withLmv.push(f.name); });
});
notes.push(withLmv.length + " of " + foodCount + " foods carry an lmv entry name");

const aboutClaim = read("about.html").match(/Around (\d+) of the foods here have been through that/);
if (aboutClaim) {
  const claimed = Number(aboutClaim[1]);
  if (Math.abs(claimed - withLmv.length) > 10) {
    faults.push('about.html says "around ' + claimed + ' foods" checked against ' +
      "Livsmedelsverket; " + withLmv.length + " carry an lmv name");
  }
}

// ---- Report --------------------------------------------------------------
console.log(pages.length + " pages, " + scripts.length + " scripts, version " + swVersion);
notes.forEach(function (n) { console.log("  " + n); });

if (faults.length) {
  console.log("\nFaults (" + faults.length + ")");
  faults.forEach(function (f) { console.log("  - " + f); });
  process.exit(1);
}

console.log("\nNo faults.");
