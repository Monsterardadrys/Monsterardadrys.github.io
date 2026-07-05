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

  // ---- Disclaimer / tool lock -----------------------------------------
  const lockTargets = ["topSection", "searchContainer", "bottomSection"];
  lockTargets.forEach(id => document.getElementById(id).classList.add("toolLocked"));
  document.getElementById("disclaimerCheckbox").addEventListener("change", function () {
    if (this.checked) lockTargets.forEach(id => document.getElementById(id).classList.remove("toolLocked"));
    else lockTargets.forEach(id => document.getElementById(id).classList.add("toolLocked"));
  });

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

      category.foods.slice().sort(function (a, b) { return a.name.localeCompare(b.name); }).forEach(function (food) {
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
    const grouped = {};
    const groupOrder = [];
    Object.keys(TRAITS).forEach(function (traitId) {
      const trait = TRAITS[traitId];
      if (!trait.filter) return;
      const g = trait.group || "Other";
      if (!grouped[g]) { grouped[g] = []; groupOrder.push(g); }
      grouped[g].push({ traitId, trait });
    });
    groupOrder.forEach(function (groupName) {
      const header = document.createElement("p");
      header.className = "filterGroupHeader";
      header.textContent = groupName;
      header.setAttribute("aria-expanded", "false");
      filterContainer.appendChild(header);

      const groupWrap = document.createElement("div");
      groupWrap.className = "filterGroup collapsed";
      grouped[groupName]
        .sort(function (a, b) { return (a.trait.order || 99) - (b.trait.order || 99); })
        .forEach(function (item) {
          const label = document.createElement("label");
          label.className = "checkboxStyle";
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.value = item.traitId;
          checkbox.addEventListener("change", recompute);
          label.appendChild(checkbox);
          label.appendChild(document.createTextNode(item.trait.label));
          groupWrap.appendChild(label);
        });
      filterContainer.appendChild(groupWrap);

      header.addEventListener("click", function () {
        const expanded = header.getAttribute("aria-expanded") === "true";
        header.setAttribute("aria-expanded", !expanded);
        groupWrap.classList.toggle("collapsed", expanded);
      });
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
  showAnalysisButton.addEventListener("click", function () {
    popupTextContainer.innerHTML = "";

    if (lastTopTraits.length === 0) {
      const p = document.createElement("p");
      p.className = "popupText";
      p.textContent = "Select foods to see a deeper summary and analysis of the foods.";
      popupTextContainer.appendChild(p);
    } else {
      lastTopTraits.forEach(function (item, index) {
        if (index > 0) {
          const hr = document.createElement("hr");
          hr.className = "popupDivider";
          popupTextContainer.appendChild(hr);
        }
        const trait = TRAITS[item.traitId];
        const heading = document.createElement("p");
        heading.className = "popupTraitHeading";
        heading.textContent = item.percent + "% — " + trait.label;
        popupTextContainer.appendChild(heading);
        const paragraphs = (trait.analysis && trait.analysis.length)
          ? trait.analysis
          : ["The most common shared trait among these foods is " + trait.label + "."];
        paragraphs.forEach(function (text, i) {
          const p = document.createElement("p");
          if (i === 0) p.className = "popupText";
          p.textContent = text;
          popupTextContainer.appendChild(p);
        });
        if (trait.articleId) {
          const p = document.createElement("p");
          const link = document.createElement("a");
          link.href = "articles.html#" + trait.articleId;
          link.target = "_blank";
          link.rel = "noopener";
          link.textContent = "Read the full article →";
          link.addEventListener("click", function (e) { e.stopPropagation(); });
          p.appendChild(link);
          popupTextContainer.appendChild(p);
        }
      });
    }

    popupContainer.classList.toggle("show");
  });

  popupContainer.addEventListener("click", function () {
    popupContainer.classList.toggle("show");
  });

  document.getElementById("printAnalysisButton").addEventListener("click", function (e) {
    e.stopPropagation();
    const foods = getSelectedFoods().map(function (f) { return f.name; });
    const list = document.getElementById("printFoodsList");
    list.innerHTML = "<h2>Selected foods</h2><p>" + foods.join(", ") + "</p>";
    window.print();
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
