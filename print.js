/* =========================================================================
   print.js — the two things every printout on this site needs

   1. A date. A printout that goes into a patient file is undated otherwise,
      and "generated from foodintoleranceguide" says nothing about when.
   2. Collapsed <details> opened before printing. CSS alone does not reliably
      force a closed one onto paper, so the food lists in the articles would
      print as a row of empty headings.

   Any page with a .printOnly header gets the stamp; any page with <details>
   gets them opened. Loading this on a page with neither is harmless.
   ========================================================================= */

(function () {
  "use strict";

  function stamp() {
    const el = document.getElementById("printStamp");
    if (!el) return;
    // Day, month name and year: unambiguous on paper in any country.
    el.textContent = "Printed " + new Date().toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric"
    });
  }

  function openDetails() {
    document.querySelectorAll("details").forEach(function (d) { d.open = true; });
  }

  window.addEventListener("beforeprint", function () {
    stamp();
    openDetails();
  });

  // Safari fires no beforeprint, so fill the date up front as well. It is
  // only ever read on paper, where a page open since yesterday would
  // otherwise carry yesterday's date.
  stamp();
})();
