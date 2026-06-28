/* =========================================================================
   script.js — Food Intolerance Guide interactivity

   This file is fully generic: it builds the category boxes and filter
   checkboxes from CATEGORIES and TRAITS (see foods-data.js), and never
   hardcodes a food, category, or trait name. To add content, edit
   foods-data.js only.

   Bug fix note: the old version kept a running tally of trait counts and
   incremented/decremented it on every checkbox click. Unchecking a FILTER
   checkbox after foods were already selected left that tally wrong,
   because the increment/decrement logic for filters didn't perfectly
   mirror the logic for foods. This version has no running tally at all —
   on every change it reads which food checkboxes and which filter
   checkboxes are currently checked directly from the page, and recomputes
   the whole analysis from that. There's nothing to get out of sync.
   ========================================================================= */

(function () {
  "use strict";

  const topSection = document.getElementById("topSection");
  const filterContainer = document.getElementById("filterContainer");
  const chosenText = document.getElementById("chosenText");
  const summaryText = document.getElementById("summaryText");
  const searchField = document.getElementById("search");
  const searchButton = document.getElementById("searchButton");
  const showAllButton = document.getElementById("showAllButton");
  const restartButton = document.getElementById("restartButton");
  const showAnalysisButton = document.getElementById("showAnalysisButton");
  const popupContainer = document.getElementById("popupContainer");
  const popupTextContainer = document.getElementById("popupTextContainer");

  let lastTopTraits = [];

  // ---- Disclaimer popup (unchanged behaviour) --------------------------
  function openDisclaimer() {
    window.location.hash = "disclaimerPopup";
  }
  window.onload = openDisclaimer;

  // ---- Build the food category boxes from CATEGORIES -------------------
  function renderCategories() {
    CATEGORIES.forEach(function (category) {
      const box = document.createElement("div");
      box.className = "foodBox";

      const button = document.createElement("button");
      button.type = "button";
      button.className = "button";
      button.textContent = category.label;

      const group = document.createElement("div");
      group.className = "foodGroup";

      category.foods.forEach(function (food) {
        const label = document.createElement("label");
        label.className = "checkboxStyle";
        label.dataset.traits = food.traits.join(" ");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = food.name;
        checkbox.addEventListener("change", recompute);

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(food.name));
        group.appendChild(label);
      });

      button.addEventListener("click", function () {
        group.classList.toggle("open");
      });

      box.appendChild(button);
      box.appendChild(group);
      topSection.appendChild(box);
    });
  }

  // ---- Build the filter checkboxes from TRAITS --------------------------
  function renderFilters() {
    Object.keys(TRAITS).forEach(function (traitId) {
      const trait = TRAITS[traitId];
      if (!trait.filter) return;

      const label = document.createElement("label");
      label.className = "checkboxStyle";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = traitId;
      checkbox.addEventListener("change", recompute);

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(trait.label));
      filterContainer.appendChild(label);
    });
  }

  // ---- Read current state straight from the DOM ------------------------
  function getSelectedFoods() {
    const checked = topSection.querySelectorAll("input[type='checkbox']:checked");
    return Array.from(checked).map(function (checkbox) {
      const traitString = checkbox.closest("label").dataset.traits || "";
      return {
        name: checkbox.value,
        traits: traitString.split(" ").filter(Boolean)
      };
    });
  }

  function getExcludedTraitIds() {
    const checked = filterContainer.querySelectorAll("input[type='checkbox']:checked");
    return new Set(Array.from(checked).map(function (checkbox) {
      return checkbox.value;
    }));
  }

  function getTopTraits(counts, totalSelected) {
    return Object.keys(counts)
      .filter(function (traitId) { return counts[traitId] > 0; })
      .sort(function (a, b) { return counts[b] - counts[a]; })
      .slice(0, 3)
      .map(function (traitId) {
        return {
          traitId: traitId,
          count: counts[traitId],
          percent: Math.floor((counts[traitId] / totalSelected) * 100)
        };
      });
  }

  // ---- Main recompute — runs on every food or filter checkbox change ---
  function recompute() {
    const selectedFoods = getSelectedFoods();
    const excluded = getExcludedTraitIds();

    chosenText.textContent = selectedFoods.length
      ? selectedFoods.map(function (f) { return f.name; }).join(", ")
      : "Click on a category to show lists of foods";

    const counts = {};
    selectedFoods.forEach(function (food) {
      food.traits.forEach(function (traitId) {
        if (excluded.has(traitId)) return;
        if (!TRAITS[traitId]) return;
        counts[traitId] = (counts[traitId] || 0) + 1;
      });
    });

    lastTopTraits = getTopTraits(counts, selectedFoods.length);
    updateSummaryText(selectedFoods.length, lastTopTraits);
  }

  function updateSummaryText(total, topTraits) {
    if (total === 0) {
      summaryText.textContent = "Select foods to see a summary.";
      return;
    }
    if (topTraits.length === 0) {
      summaryText.textContent =
        "You have chosen " + total + " foods from the list, but they don't share a tracked trait right now (or every relevant filter is excluded).";
      return;
    }

    const phrases = topTraits.map(function (t) {
      return t.percent + "% have " + TRAITS[t.traitId].label;
    });

    let tail;
    if (phrases.length === 1) {
      tail = "and " + phrases[0] + " in common.";
    } else {
      const last = phrases.pop();
      tail = "and their commonalities are: " + phrases.join(", ") + " and " + last + " in common.";
    }

    summaryText.textContent = "You have chosen " + total + " foods from the list " + tail;
  }

  // ---- Analysis popup ----------------------------------------------------
  function addPopupParagraph(text, isLead) {
    const p = document.createElement("p");
    if (isLead) p.className = "popupText";
    p.textContent = text;
    popupTextContainer.appendChild(p);
  }

  function addPopupArticleLink(articleId) {
    const p = document.createElement("p");
    const link = document.createElement("a");
    link.href = "articles.html#" + articleId;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Read the full article →";
    // Stop the click from also triggering the popup's own close-on-click handler.
    link.addEventListener("click", function (e) { e.stopPropagation(); });
    p.appendChild(link);
    popupTextContainer.appendChild(p);
  }

  showAnalysisButton.addEventListener("click", function () {
    popupTextContainer.innerHTML = "";

    if (lastTopTraits.length === 0) {
      addPopupParagraph("Select foods to see a deeper summary and analysis of the foods.", true);
    } else {
      const trait = TRAITS[lastTopTraits[0].traitId];
      const paragraphs = (trait.analysis && trait.analysis.length)
        ? trait.analysis
        : ["The most common shared trait among these foods is " + trait.label + "."];
      paragraphs.forEach(function (text, i) {
        addPopupParagraph(text, i === 0);
      });
      if (trait.articleId) {
        addPopupArticleLink(trait.articleId);
      }
    }

    popupContainer.classList.toggle("show");
  });

  popupContainer.addEventListener("click", function () {
    popupContainer.classList.toggle("show");
  });

  // ---- Search / show-all -------------------------------------------------
  function showAllCategories() {
    topSection.querySelectorAll(".foodGroup").forEach(function (group) {
      group.classList.add("open");
    });
  }

  function hideAllCategories() {
    topSection.querySelectorAll(".foodGroup").forEach(function (group) {
      group.classList.remove("open");
    });
  }

  searchButton.addEventListener("click", function () {
    const filter = searchField.value.toUpperCase();
    let found = false;
    showAllCategories();

    const checkboxes = topSection.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(function (checkbox) {
      const matches = checkbox.value.toUpperCase().indexOf(filter) > -1;
      if (matches) found = true;
      checkbox.closest("label").style.display = matches ? "" : "none";
    });

    if (!found) {
      checkboxes.forEach(function (checkbox) {
        checkbox.closest("label").style.display = "";
      });
    }

    searchField.value = "";
  });

  showAllButton.addEventListener("click", function () {
    topSection.querySelectorAll("label").forEach(function (label) {
      label.style.display = "";
    });
    showAllCategories();
  });

  // ---- Restart ------------------------------------------------------------
  restartButton.addEventListener("click", function () {
    topSection.querySelectorAll("input[type='checkbox']").forEach(function (cb) { cb.checked = false; });
    filterContainer.querySelectorAll("input[type='checkbox']").forEach(function (cb) { cb.checked = false; });
    topSection.querySelectorAll("label").forEach(function (label) { label.style.display = ""; });
    searchField.value = "";
    hideAllCategories();
    recompute();
  });

  // ---- Boot ----------------------------------------------------------------
  renderCategories();
  renderFilters();
  recompute();
})();
