/* =========================================================================
   nav.js — the drawer menu, and the menu itself

   THE MENU IS BUILT HERE, NOT IN THE PAGES. Every page used to carry its own
   copy of the list and leave itself out of it. They drifted: Foods without
   lost the Meal builder link entirely, so the only way between two of the
   three tools was via the front page. One list in one place cannot drift, and
   the page you are on is marked rather than removed — a menu that hides where
   you are makes you check the menu to find out where you are.

   A new page needs a line in NAV_LINKS and an empty <ul> in its drawer.
   Nothing else. An entry with `action` instead of `href` is a button rather
   than a link — "Clear local data" is one, and it is in this list rather than
   appended by session.js so that nothing can rewrite the list out from under
   it. That is how it went missing from every page but the front one.
   ========================================================================= */

const NAV_LINKS = [
  // The three tools first: they are what the site is for, and someone
  // holding a phone should reach any of them from any of them.
  { href: "app.html", label: "Shared traits", sv: "Gemensamma egenskaper" },
  { href: "meal.html", label: "Meal builder", sv: "Måltidsbyggare" },
  { href: "without.html", label: "Foods without", sv: "Livsmedel utan" },
  { href: "articles.html", label: "Articles", sv: "Artiklar" },
  { href: "about.html", label: "About", sv: "Om" },
  { href: "sources.html", label: "Data sources", sv: "Datakällor" },
  { href: "contact.html", label: "Contact", sv: "Kontakt" },
  // Not a page. Every page stores something, so it has to be on every page.
  { action: "clearData", label: "Clear local data", sv: "Rensa lokal data" }
];

const NAV_ACTIONS = {
  clearData: function () {
    if (typeof Session !== "undefined") Session.clearFromMenu();
  }
};

(function buildMenu() {
  const drawer = document.querySelector(".navDrawer");
  const list = drawer && drawer.querySelector("ul");
  if (!list) return;

  // "index.html", "", "/" and "/food-intolerance-guide/" all mean the front page.
  const file = window.location.pathname.split("/").pop() || "index.html";

  /* A heading rather than a gap. The drawer used to reserve blank space at
     the top for the close button, which read as a missing first item. */
  if (!drawer.querySelector(".navTitle")) {
    const title = document.createElement("p");
    title.className = "navTitle";
    title.textContent = typeof I18N !== "undefined" && I18N.lang() === "sv" ? "Meny" : "Menu";
    drawer.insertBefore(title, drawer.firstChild);
  }

  /* The language switch, built here for the same reason the menu is: one
     copy, on every page, that no page can be missing. Switching reloads —
     the food names, trait labels and analysis text are all read at render
     time, and a reload re-renders all of them without every page needing
     to know how to redraw itself. */
  if (typeof I18N !== "undefined" && !drawer.querySelector(".langSwitch")) {
    const FLAGS = { en: { flag: "🇬🇧", label: "English" }, sv: { flag: "🇸🇪", label: "Svenska" } };
    const box = document.createElement("div");
    box.className = "langSwitch";
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", "Language / Språk");

    I18N.LANGUAGES.forEach(function (code) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "langBtn" + (I18N.lang() === code ? " langBtn--on" : "");
      btn.lang = code;
      btn.setAttribute("aria-pressed", I18N.lang() === code ? "true" : "false");
      btn.innerHTML = "<span class=\"langFlag\" aria-hidden=\"true\">" + FLAGS[code].flag +
        "</span><span class=\"langName\">" + FLAGS[code].label + "</span>";
      btn.addEventListener("click", function () {
        if (I18N.lang() === code) return;
        I18N.set(code);
        // ?lang= in the address bar would outrank the choice just stored.
        const url = new URL(window.location.href);
        url.searchParams.delete("lang");
        window.location.replace(url.toString());
      });
      box.appendChild(btn);
    });

    drawer.insertBefore(box, drawer.querySelector(".navTitle").nextSibling);
  }

  // Home sits above the list, as its own link, on every page but the front one.
  const home = drawer.querySelector(".backToMain");
  if (home && file === "index.html") home.remove();

  list.innerHTML = "";
  NAV_LINKS.forEach(function (item) {
    const li = document.createElement("li");
    const text = typeof I18N !== "undefined" ? I18N.pick(item, "label") : item.label;

    if (item.action) {
      const button = document.createElement("a");
      button.href = "#";
      button.className = "navClearData";
      button.textContent = text;
      button.addEventListener("click", function (e) {
        e.preventDefault();
        NAV_ACTIONS[item.action]();
      });
      li.appendChild(button);
    } else if (item.href === file) {
      // Marked, not removed. A span rather than a link to itself.
      const here = document.createElement("span");
      here.className = "navHere";
      here.setAttribute("aria-current", "page");
      here.textContent = text;
      li.appendChild(here);
    } else {
      const link = document.createElement("a");
      link.href = item.href;
      link.textContent = text;
      li.appendChild(link);
    }

    list.appendChild(li);
  });
})();

document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector("header");
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navDrawer = document.getElementById("navDrawer");
  const navOverlay = document.getElementById("navOverlay");
  const navDrawerClose = document.getElementById("navDrawerClose");

  if (!header || !hamburgerBtn || !navDrawer) return;

  function openDrawer() {
    navDrawer.classList.add("open");
    if (navOverlay) navOverlay.classList.add("open");
    hamburgerBtn.classList.add("open");
    hamburgerBtn.setAttribute("aria-expanded", "true");
    navDrawer.setAttribute("aria-hidden", "false");
  }

  function closeDrawer() {
    navDrawer.classList.remove("open");
    if (navOverlay) navOverlay.classList.remove("open");
    hamburgerBtn.classList.remove("open");
    hamburgerBtn.setAttribute("aria-expanded", "false");
    navDrawer.setAttribute("aria-hidden", "true");
  }

  hamburgerBtn.addEventListener("click", function () {
    if (navDrawer.classList.contains("open")) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (navDrawerClose) navDrawerClose.addEventListener("click", closeDrawer);
  if (navOverlay) navOverlay.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDrawer();
  });

  navDrawer.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeDrawer);
  });

  // Header is fixed, so reserve the equivalent space at the top of the page.
  // The --header-height variable lets .disclaimerBar (see styles.css) extend
  // its own background up behind the header instead of leaving a gap.
  function syncHeaderHeight() {
    document.body.style.paddingTop = header.offsetHeight + "px";
    document.documentElement.style.setProperty("--header-height", header.offsetHeight + "px");
  }
  syncHeaderHeight();
  window.addEventListener("resize", syncHeaderHeight);

  // Hide the header on scroll-down, reveal it on scroll-up or near the top.
  let lastScrollY = window.scrollY;
  let ticking = false;
  const SCROLL_DELTA = 6;

  function onScroll() {
    const currentY = window.scrollY;

    if (!navDrawer.classList.contains("open")) {
      if (currentY <= 10) {
        header.classList.remove("header--hidden");
      } else if (currentY > lastScrollY + SCROLL_DELTA) {
        header.classList.add("header--hidden");
      } else if (currentY < lastScrollY - SCROLL_DELTA) {
        header.classList.remove("header--hidden");
      }
    }

    lastScrollY = currentY;
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  // ---- Collapsible article menu (mobile only — see the .collapsed rules
  // scoped inside the mobile media query in styles.css) --------------------
  document.querySelectorAll(".articleIndex").forEach(function (articleNav) {
    const heading = articleNav.querySelector("h2");
    const list = articleNav.querySelector("ul");
    if (!heading || !list) return;

    articleNav.classList.add("collapsed");
    heading.setAttribute("role", "button");
    heading.setAttribute("tabindex", "0");
    heading.setAttribute("aria-expanded", "false");

    function toggle() {
      const collapsed = articleNav.classList.toggle("collapsed");
      heading.setAttribute("aria-expanded", collapsed ? "false" : "true");
    }

    heading.addEventListener("click", toggle);
    heading.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });

    list.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        articleNav.classList.add("collapsed");
        heading.setAttribute("aria-expanded", "false");
      }
    });
  });
});
