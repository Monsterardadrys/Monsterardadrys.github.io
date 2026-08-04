/* =========================================================================
   disclaimer.js — the disclaimer bar and popup, shared by every tool page

   Any page with a .disclaimerBar gets this behaviour for free. The elements
   to keep locked until the box is ticked are named on the bar itself:

       <div class="disclaimerBar" data-lock="topSection bottomSection">

   Ids that are not on the page are ignored, so one attribute can be copied
   between pages without breaking either.
   ========================================================================= */

(function () {
  "use strict";

  const bar = document.querySelector(".disclaimerBar");
  if (!bar) return;

  // ---- The popup ---------------------------------------------------------
  const popup = document.getElementById("disclaimerPopup");
  const openBtn = bar.querySelector(".disclaimerBtn");

  if (popup && openBtn) {
    openBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      popup.classList.add("active");
    });

    document.addEventListener("click", function () {
      if (popup.classList.contains("active")) popup.classList.remove("active");
    });
  }

  // ---- The lock ----------------------------------------------------------
  const lockTargets = (bar.dataset.lock || "").split(/\s+/)
    .filter(Boolean)
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  const checkRow = bar.querySelector(".disclaimerCheck");
  const checkbox = document.getElementById("disclaimerCheckbox");
  if (!checkbox) return;

  function apply() {
    lockTargets.forEach(function (el) {
      el.classList.toggle("toolLocked", !checkbox.checked);
    });
    if (checkRow) checkRow.classList.toggle("disclaimerCheck--done", checkbox.checked);
  }

  // Run once up front: a browser restoring a ticked box on reload must not
  // leave the page locked behind it.
  apply();
  checkbox.addEventListener("change", apply);
})();
