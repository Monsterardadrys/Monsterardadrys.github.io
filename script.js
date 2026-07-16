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

  // ---- Disclaimer popup close-on-click -----------------------------------
  const disclaimerPopup = document.getElementById("disclaimerPopup");
  const disclaimerBtn = document.querySelector(".disclaimerBtn");

  disclaimerBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    disclaimerPopup.classList.add("active");
  });

  document.addEventListener("click", function () {
    if (!disclaimerPopup.classList.contains("active")) return;
    disclaimerPopup.classList.remove("active");
  });

  // ---- Disclaimer / tool lock -----------------------------------------
  const lockTargets = ["topSection", "searchContainer", "bottomSection"];
  const disclaimerCheckRow = document.querySelector(".disclaimerCheck");
  lockTargets.forEach(id => document.getElementById(id).classList.add("toolLocked"));
  document.getElementById("disclaimerCheckbox").addEventListener("change", function () {
    if (this.checked) {
      lockTargets.forEach(id => document.getElementById(id).classList.remove("toolLocked"));
      disclaimerCheckRow.classList.add("disclaimerCheck--done");
    } else {
      lockTargets.forEach(id => document.getElementById(id).classList.add("toolLocked"));
      disclaimerCheckRow.classList.remove("disclaimerCheck--done");
    }
  });

  // ---- Build the food category boxes from CATEGORIES / CATEGORY_GROUPS --
  function renderCategories() {
    function renderCategoryBox(container, category) {
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
      container.appendChild(box);
    }

    const byId = {};
    CATEGORIES.forEach(function (category) { byId[category.id] = category; });
    const placedIds = new Set();

    CATEGORY_GROUPS.forEach(function (categoryGroup) {
      const categories = categoryGroup.categories
        .map(function (id) { return byId[id]; })
        .filter(Boolean);
      if (categories.length === 0) return;

      const section = document.createElement("div");
      section.className = "categoryGroup";

      const title = document.createElement("p");
      title.className = "categoryGroupTitle";
      title.textContent = categoryGroup.title;
      section.appendChild(title);

      const row = document.createElement("div");
      row.className = "categoryGroupRow";
      categories.forEach(function (category) {
        placedIds.add(category.id);
        renderCategoryBox(row, category);
      });
      section.appendChild(row);

      topSection.appendChild(section);
    });

    const leftover = CATEGORIES.filter(function (category) { return !placedIds.has(category.id); });
    if (leftover.length > 0) {
      const section = document.createElement("div");
      section.className = "categoryGroup";

      const title = document.createElement("p");
      title.className = "categoryGroupTitle";
      title.textContent = "Other";
      section.appendChild(title);

      const row = document.createElement("div");
      row.className = "categoryGroupRow";
      leftover.forEach(function (category) { renderCategoryBox(row, category); });
      section.appendChild(row);

      topSection.appendChild(section);
    }
  }

  // ---- Build the filter checkboxes from FILTER_SECTIONS / TRAITS --------
  function renderFilters() {
    function renderCheckbox(container, traitId, trait, extraClass) {
      const label = document.createElement("label");
      label.className = extraClass ? "checkboxStyle " + extraClass : "checkboxStyle";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = traitId;
      checkbox.addEventListener("change", recompute);
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(trait.label));
      container.appendChild(label);
    }

    function getGroupTraits(groupName) {
      return Object.keys(TRAITS)
        .filter(function (id) { return TRAITS[id].filter && TRAITS[id].group === groupName; })
        .map(function (id) { return { traitId: id, trait: TRAITS[id] }; })
        .sort(function (a, b) { return (a.trait.order || 99) - (b.trait.order || 99); });
    }

    FILTER_SECTIONS.forEach(function (section) {
      const card = document.createElement("div");
      card.className = section.wide ? "filterCard wide" : "filterCard";

      const title = document.createElement("p");
      title.className = "filterCardTitle";
      title.textContent = section.title;
      card.appendChild(title);

      if (section.broad) {
        renderCheckbox(card, section.broad, TRAITS[section.broad], "broad");
      }

      if (section.group) {
        const specificWrap = document.createElement("div");
        specificWrap.className = "specificWrap checkRow";
        getGroupTraits(section.group).forEach(function (item) {
          renderCheckbox(specificWrap, item.traitId, item.trait);
        });
        card.appendChild(specificWrap);
      }

      if (section.items) {
        const row = document.createElement("div");
        row.className = section.group ? "checkRow extraRow" : "checkRow";
        section.items.forEach(function (traitId) {
          renderCheckbox(row, traitId, TRAITS[traitId]);
        });
        card.appendChild(row);
      }

      filterContainer.appendChild(card);
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

  // Renders each chosen food as a chip with its own remove (×) button, wired
  // directly to the checkbox that put it there so removal always finds the
  // right one, even if two foods share a name substring.
  function renderChosenFoods() {
    const checkboxes = Array.from(topSection.querySelectorAll("input[type='checkbox']:checked"));
    chosenText.innerHTML = "";

    if (checkboxes.length === 0) {
      chosenText.textContent = "Click on a category to show lists of foods";
      return;
    }

    checkboxes.forEach(function (checkbox) {
      const chip = document.createElement("span");
      chip.className = "chosenFoodChip";
      chip.appendChild(document.createTextNode(checkbox.value));

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "chosenFoodRemove";
      removeBtn.setAttribute("aria-label", "Remove " + checkbox.value);
      removeBtn.textContent = "×";
      removeBtn.addEventListener("click", function () {
        checkbox.checked = false;
        recompute();
      });
      chip.appendChild(removeBtn);
      chosenText.appendChild(chip);
    });
  }

  function getExcludedTraitIds() {
    const checked = filterContainer.querySelectorAll("input[type='checkbox']:checked");
    return new Set(Array.from(checked).map(function (checkbox) {
      return checkbox.value;
    }));
  }

  const MACRO_TRAIT_IDS = ["over_10g_fat", "protein", "carbs"];

  function getRankedTraits(counts, totalSelected, limit) {
    const list = Object.keys(counts)
      .filter(function (id) { return counts[id] > 0 && MACRO_TRAIT_IDS.indexOf(id) === -1; })
      .sort(function (a, b) { return counts[b] - counts[a]; })
      .map(function (id) {
        return { traitId: id, count: counts[id], percent: Math.floor((counts[id] / totalSelected) * 100) };
      });
    return typeof limit === "number" ? list.slice(0, limit) : list;
  }

  function getMacroNotes(counts, totalSelected) {
    if (totalSelected === 0) return [];
    return MACRO_TRAIT_IDS
      .filter(function (id) { return ((counts[id] || 0) / totalSelected) * 100 > 90; })
      .map(function (id) { return TRAITS[id].label; });
  }

  // ---- Main recompute — runs on every food or filter checkbox change ---
  function recompute() {
    const selectedFoods = getSelectedFoods();
    const excluded = getExcludedTraitIds();

    renderChosenFoods();

    const counts = {};
    selectedFoods.forEach(function (food) {
      food.traits.forEach(function (traitId) {
        if (excluded.has(traitId)) return;
        if (!TRAITS[traitId]) return;
        counts[traitId] = (counts[traitId] || 0) + 1;
      });
    });

    const allTraits = getRankedTraits(counts, selectedFoods.length);
    updateSummaryText(selectedFoods.length, allTraits);
  }

  function updateSummaryText(total, allTraits) {
    const summaryTraitList = document.getElementById("summaryTraitList");
    const summaryToggle = document.getElementById("summaryToggle");
    const visibleCount = 3;

    if (total === 0) {
      summaryText.textContent = "Select foods to see a summary.";
      summaryTraitList.innerHTML = "";
      summaryToggle.style.display = "none";
      return;
    }
    if (allTraits.length === 0) {
      summaryText.textContent =
        "You have chosen " + total + " foods from the list, but they don't share a tracked trait right now (or every relevant filter is excluded).";
      summaryTraitList.innerHTML = "";
      summaryToggle.style.display = "none";
      return;
    }

    summaryText.textContent = "You have chosen " + total + " foods from the list. Shared traits:";
    summaryTraitList.innerHTML = "";
    summaryTraitList.classList.remove("expanded");
    allTraits.forEach(function (t, i) {
      const li = document.createElement("li");
      li.textContent = t.percent + "% — " + TRAITS[t.traitId].label;
      if (i >= visibleCount) li.className = "extraTrait";
      summaryTraitList.appendChild(li);
    });

    const extraCount = allTraits.length - visibleCount;
    if (extraCount > 0) {
      summaryToggle.style.display = "inline-block";
      summaryToggle.textContent = "Show " + extraCount + " more ▾";
      summaryToggle.dataset.expanded = "false";
    } else {
      summaryToggle.style.display = "none";
    }
  }

  document.getElementById("summaryToggle").addEventListener("click", function () {
    const btn = this;
    const summaryTraitList = document.getElementById("summaryTraitList");
    const expanded = btn.dataset.expanded === "true";
    summaryTraitList.classList.toggle("expanded", !expanded);
    btn.dataset.expanded = String(!expanded);
    if (expanded) {
      const extraCount = summaryTraitList.querySelectorAll(".extraTrait").length;
      btn.textContent = "Show " + extraCount + " more ▾";
    } else {
      btn.textContent = "Show less ▴";
    }
  });

  // ---- Analysis popup ----------------------------------------------------
  // The popup keeps its own live, self-contained view: all selected foods
  // are listed and can be toggled out of the analysis one at a time without
  // touching the real selection (so they're easy to bring back), and each
  // shown trait can be excluded on the spot — which reuses the real filter
  // checkbox, so it stays in sync with the main Filter Analysis section.
  let popupAllFoods = [];
  let popupExcludedFoods = new Set();
  let popupActiveFoods = [];
  let popupActiveTraits = [];

  function renderPopupAnalysis() {
    popupTextContainer.innerHTML = "";

    if (popupAllFoods.length === 0) {
      popupActiveFoods = [];
      popupActiveTraits = [];
      const p = document.createElement("p");
      p.className = "popupText";
      p.textContent = "Select foods to see a deeper summary and analysis of the foods.";
      popupTextContainer.appendChild(p);
      return;
    }

    const activeFoods = popupAllFoods.filter(function (food) { return !popupExcludedFoods.has(food.name); });
    const excludedTraitIds = getExcludedTraitIds();
    const counts = {};
    activeFoods.forEach(function (food) {
      food.traits.forEach(function (traitId) {
        if (excludedTraitIds.has(traitId)) return;
        if (!TRAITS[traitId]) return;
        counts[traitId] = (counts[traitId] || 0) + 1;
      });
    });
    const topTraits = getRankedTraits(counts, activeFoods.length, 3);
    const macroNotes = getMacroNotes(counts, activeFoods.length);

    popupActiveFoods = activeFoods;
    popupActiveTraits = topTraits;

    const foodsIntro = document.createElement("p");
    foodsIntro.className = "popupFoodsIntro noPrint";
    foodsIntro.textContent = "Foods in this analysis — click one to leave it out, click again to bring it back:";
    popupTextContainer.appendChild(foodsIntro);

    const chipRow = document.createElement("div");
    chipRow.className = "popupFoodChips noPrint";
    popupAllFoods.forEach(function (food) {
      const isExcluded = popupExcludedFoods.has(food.name);
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = isExcluded ? "popupFoodChip excluded" : "popupFoodChip";
      chip.textContent = food.name;
      chip.setAttribute("aria-pressed", String(!isExcluded));
      chip.addEventListener("click", function (e) {
        e.stopPropagation();
        if (isExcluded) popupExcludedFoods.delete(food.name);
        else popupExcludedFoods.add(food.name);
        renderPopupAnalysis();
      });
      chipRow.appendChild(chip);
    });
    popupTextContainer.appendChild(chipRow);

    const introHr = document.createElement("hr");
    introHr.className = "popupDivider";
    popupTextContainer.appendChild(introHr);

    if (activeFoods.length === 0) {
      const p = document.createElement("p");
      p.className = "popupText";
      p.textContent = "Every food above is left out of the analysis right now — click one to bring it back.";
      popupTextContainer.appendChild(p);
      return;
    }

    if (topTraits.length === 0) {
      const p = document.createElement("p");
      p.className = "popupText";
      p.textContent = "These foods don't share a tracked trait right now (or every relevant factor is excluded).";
      popupTextContainer.appendChild(p);
      return;
    }

    topTraits.forEach(function (item, index) {
      if (index > 0) {
        const hr = document.createElement("hr");
        hr.className = "popupDivider";
        popupTextContainer.appendChild(hr);
      }
      const trait = TRAITS[item.traitId];

      const headingRow = document.createElement("div");
      headingRow.className = "popupTraitHeadingRow";

      const heading = document.createElement("p");
      heading.className = "popupTraitHeading";
      heading.textContent = item.percent + "% — " + trait.label;
      headingRow.appendChild(heading);

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "popupTraitRemove noPrint";
      removeBtn.textContent = "Exclude";
      removeBtn.setAttribute("aria-label", "Exclude " + trait.label + " from the analysis");
      removeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        const filterCheckbox = filterContainer.querySelector('input[value="' + item.traitId + '"]');
        if (filterCheckbox) {
          filterCheckbox.checked = true;
          recompute();
        }
        renderPopupAnalysis();
      });
      headingRow.appendChild(removeBtn);

      popupTextContainer.appendChild(headingRow);

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
        p.className = "noPrint";
        const link = document.createElement("a");
        link.href = "articles.html#" + trait.articleId;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = "Read the full article →";
        link.addEventListener("click", function (e) { e.stopPropagation(); });
        p.appendChild(link);
        popupTextContainer.appendChild(p);

        const printNote = document.createElement("p");
        printNote.className = "printOnly";
        const articleTitle = (typeof ARTICLES !== "undefined" && ARTICLES[trait.articleId])
          ? ARTICLES[trait.articleId].title : trait.label;
        printNote.textContent = "See \"" + articleTitle + "\" below.";
        popupTextContainer.appendChild(printNote);
      }
    });

    if (macroNotes.length > 0) {
      const hr = document.createElement("hr");
      hr.className = "popupDivider";
      popupTextContainer.appendChild(hr);
      const note = document.createElement("p");
      note.className = "popupMacroNote";
      const joined = macroNotes.length > 1
        ? macroNotes.slice(0, -1).join(", ") + " and " + macroNotes[macroNotes.length - 1]
        : macroNotes[0];
      note.textContent = "Note: this selection is also high in " + joined +
        " (over 90% of foods) — these rarely cause symptoms directly but can worsen other GI issues.";
      popupTextContainer.appendChild(note);
    }
  }

  showAnalysisButton.addEventListener("click", function () {
    popupAllFoods = getSelectedFoods();
    popupExcludedFoods = new Set();
    renderPopupAnalysis();
    popupContainer.classList.add("show");
  });

  function closePopup() {
    popupContainer.classList.remove("show");
  }

  document.getElementById("popupCloseBtn").addEventListener("click", function (e) {
    e.stopPropagation();
    closePopup();
  });

  document.getElementById("popupCloseBottomBtn").addEventListener("click", function (e) {
    e.stopPropagation();
    closePopup();
  });

  document.getElementById("printAnalysisButton").addEventListener("click", function (e) {
    e.stopPropagation();

    const foods = popupActiveFoods.map(function (f) { return f.name; }).sort();
    const foodsList = document.getElementById("printFoodsList");
    foodsList.innerHTML = "<h2>Foods in this analysis (" + foods.length + ")</h2>";
    const ul = document.createElement("ul");
    ul.className = "printFoodsUl";
    foods.forEach(function (name) {
      const li = document.createElement("li");
      li.textContent = name;
      ul.appendChild(li);
    });
    foodsList.appendChild(ul);

    const articlesBox = document.getElementById("printArticlesList");
    articlesBox.innerHTML = "";
    if (typeof ARTICLES !== "undefined") {
      const seen = new Set();
      popupActiveTraits.forEach(function (item) {
        const trait = TRAITS[item.traitId];
        if (!trait.articleId || seen.has(trait.articleId)) return;
        const article = ARTICLES[trait.articleId];
        if (!article) return;
        seen.add(trait.articleId);

        const section = document.createElement("div");
        section.id = "print-article-" + trait.articleId;
        const h2 = document.createElement("h2");
        h2.textContent = article.title;
        section.appendChild(h2);

        article.sections.forEach(function (sec) {
          if (sec.heading) {
            const h3 = document.createElement("h3");
            h3.textContent = sec.heading;
            section.appendChild(h3);
          }
          sec.blocks.forEach(function (block) {
            if (block.type === "list") {
              const ul2 = document.createElement("ul");
              block.items.forEach(function (i) {
                const li = document.createElement("li");
                li.textContent = i.replace(/\*\*/g, "");
                ul2.appendChild(li);
              });
              section.appendChild(ul2);
            } else {
              const p = document.createElement("p");
              p.textContent = (block.text || "").replace(/\*\*/g, "");
              section.appendChild(p);
            }
          });
        });

        articlesBox.appendChild(section);
      });
    }

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

  function runSearch() {
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
  }

  searchButton.addEventListener("click", runSearch);

  searchField.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      runSearch();
    }
  });

  showAllButton.addEventListener("click", function () {
    topSection.querySelectorAll("label").forEach(function (label) {
      label.style.display = "";
    });
    showAllCategories();
  });

  // ---- Clear selection (Foods / Filter / All) -----------------------------
  document.getElementById("clearFoodsButton").addEventListener("click", function () {
    if (!window.confirm("Clear all selected foods?")) return;
    topSection.querySelectorAll("input[type='checkbox']").forEach(function (cb) { cb.checked = false; });
    recompute();
  });

  document.getElementById("clearFiltersButton").addEventListener("click", function () {
    if (!window.confirm("Clear all filters?")) return;
    filterContainer.querySelectorAll("input[type='checkbox']").forEach(function (cb) { cb.checked = false; });
    recompute();
  });

  restartButton.addEventListener("click", function () {
    if (!window.confirm("Clear everything — foods, filters, and search?")) return;
    topSection.querySelectorAll("input[type='checkbox']").forEach(function (cb) { cb.checked = false; });
    filterContainer.querySelectorAll("input[type='checkbox']").forEach(function (cb) { cb.checked = false; });
    topSection.querySelectorAll("label").forEach(function (label) { label.style.display = ""; });
    searchField.value = "";
    hideAllCategories();
    recompute();
    document.getElementById("chosenFoods").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // ---- Boot ----------------------------------------------------------------
  renderCategories();
  renderFilters();
  recompute();
})();
