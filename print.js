/* =========================================================================
   print.js — the two things every printout on this site needs

   1. A date, and a footer that repeats on every page so loose sheets can be
      told apart. Browsers give a stylesheet no page counter, so the footer
      identifies rather than numbers — there is no way to print "page 2 of 5"
      from a web page, and pretending otherwise would be worse than a name.
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

  function runningFooter() {
    const el = document.getElementById("printRunningFooter");
    if (!el) return;
    el.textContent = "Food Intolerance Guide — " + document.title.split("—")[0].trim() +
      " — a triage aid, not a diagnosis. " + window.location.host;
  }

  function openDetails() {
    document.querySelectorAll("details").forEach(function (d) { d.open = true; });
  }

  window.addEventListener("beforeprint", function () {
    stamp();
    runningFooter();
    openDetails();
  });

  // Safari fires no beforeprint, so fill the date up front as well. It is
  // only ever read on paper, where a page open since yesterday would
  // otherwise carry yesterday's date.
  stamp();
  runningFooter();
})();
