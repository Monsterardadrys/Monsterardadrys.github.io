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
   session and the working day. "Clear local data" is therefore in NAV_LINKS
   in nav.js, so it is on every page's menu by construction rather than by
   each page remembering to add it, and every page that stores anything says
   so in plain words rather than claiming nothing is kept.
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

  /* Empty means nothing worth keeping, not "no key written". Every tool
     writes its state on load, so a visit to Foods without leaves
     `{ traits: [] }` behind — a record of nothing. Counting that as stored
     data meant the "there is nothing here" path could never be reached, and
     clearing was always followed by a confirm dialog over an empty store. */
  function isEmpty() {
    const data = read();
    const app = data.app || {};
    const hasApp = (app.foods || []).length > 0 || (app.filters || []).length > 0;
    const hasMeals = (data.meals || []).some(function (meal) {
      return (meal.items || []).length > 0;
    });
    const hasWithout = ((data.without || {}).traits || []).length > 0;
    return !hasApp && !hasMeals && !hasWithout;
  }

  /* "Clear local data" is a menu item, and nav.js builds the menu — see
     NAV_LINKS there. This used to append itself to the drawer on
     DOMContentLoaded, which worked only as long as nothing else rewrote the
     list afterwards. Something did. The item belongs in the same list as
     every other one, so there is no order to get wrong.

     What stays here is the behaviour, because the data lives here. */
  function clearFromMenu() {
    if (isEmpty()) {
      window.alert(I18N.t("session.nothingStored"));
      return;
    }
    if (!window.confirm(I18N.t("session.confirmClear"))) return;
    clear();
    window.location.reload();
  }

  return {
    clearFromMenu: clearFromMenu,
    get: get,
    set: set,
    snapshot: snapshot,
    restore: restore,
    clear: clear,
    isEmpty: isEmpty
  };
})();
