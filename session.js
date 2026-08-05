/* =========================================================================
   session.js — one working session across all three tools

   The three tools used to forget everything the moment you left the page,
   so going from the app to the meal builder to check one thing cost you
   whatever you had built. They now share a single record in this browser's
   local storage, and each tool reads and writes its own slice of it.

       { version, app: {...}, meals: [...], without: {...} }

   Saving to a file saves that whole record, so one file is a snapshot of
   everything, and loading one restores every tool at once.

   WHERE THIS LIVES. The browser's local storage, on this device, and
   nowhere else. It is not sent anywhere and no account holds it. But it is
   also not nothing: on a shared clinic machine it outlives the tab, the
   session and the working day. Every page therefore carries "Clear local
   data" in the menu, and every page that stores anything says so in plain
   words rather than claiming nothing is kept.
   ========================================================================= */

const Session = (function () {
  "use strict";

  const KEY = "food-intolerance-guide-session";
  const VERSION = 1;

  function empty() {
    return { version: VERSION, app: null, meals: null, without: null };
  }

  function read() {
    let raw;
    try {
      raw = window.localStorage.getItem(KEY);
    } catch (e) {
      // Private mode, or storage switched off. Nothing to do but carry on
      // without it: the tools all work, they just forget again.
      return empty();
    }
    if (!raw) return empty();
    try {
      const data = JSON.parse(raw);
      if (!data || data.version !== VERSION) return empty();
      return data;
    } catch (e) {
      return empty();
    }
  }

  function write(data) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      // Full, or blocked. Losing the memory is not worth an error message
      // in the middle of someone's work.
    }
  }

  function get(tool) {
    return read()[tool] || null;
  }

  function set(tool, value) {
    const data = read();
    data[tool] = value;
    write(data);
  }

  // The whole record, for saving to a file.
  function snapshot() {
    const data = read();
    return { app: data.app, meals: data.meals, without: data.without };
  }

  function restore(data) {
    write({
      version: VERSION,
      app: data.app || null,
      meals: data.meals || null,
      without: data.without || null
    });
  }

  function clear() {
    try {
      window.localStorage.removeItem(KEY);
    } catch (e) { /* nothing kept means nothing to clear */ }
  }

  function isEmpty() {
    const data = read();
    return !data.app && !data.meals && !data.without;
  }

  /* Put "Clear local data" in every nav drawer from here rather than in each
     page's markup: it has to be everywhere, and a page that forgot to add it
     would be a page where the data cannot be got rid of. */
  function addClearToMenu() {
    const list = document.querySelector(".navDrawer ul");
    if (!list) return;

    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = "#";
    link.className = "navClearData";
    link.textContent = "Clear local data";
    link.addEventListener("click", function (e) {
      e.preventDefault();
      if (isEmpty()) {
        window.alert("There is nothing stored on this device.");
        return;
      }
      if (!window.confirm(
        "Clear everything this browser has kept — the app's selection, every " +
        "meal, and the traits picked in Foods without?\n\nThis cannot be undone, " +
        "and it does not touch any file you have saved."
      )) return;
      clear();
      window.location.reload();
    });
    li.appendChild(link);
    list.appendChild(li);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addClearToMenu);
  } else {
    addClearToMenu();
  }

  return {
    get: get,
    set: set,
    snapshot: snapshot,
    restore: restore,
    clear: clear,
    isEmpty: isEmpty
  };
})();
