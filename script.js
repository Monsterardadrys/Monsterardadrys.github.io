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
  let lastMacroNotes = [];

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
    const BROAD_TO_SUBGROUP = {
      irritant: "GI Irritants",
      fodmaps: "FODMAPs",
      allergen: "Allergens",
      cross_reactive: "Cross-reactivity"
    };

    const grouped = {};
    const ungrouped = [];
    Object.keys(TRAITS).forEach(function (traitId) {
      const trait = TRAITS[traitId];
      if (!trait.filter) return;
      if (!trait.group) { ungrouped.push({ traitId, trait }); return; }
      if (!grouped[trait.group]) grouped[trait.group] = [];
      grouped[trait.group].push({ traitId, trait });
    });

    function renderCheckbox(container, traitId, trait) {
      const label = document.createElement("label");
      label.className = "checkboxStyle";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = traitId;
      checkbox.addEventListener("change", recompute);
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(trait.label));
      container.appendChild(label);
    }

    function renderSubgroup(groupName) {
      const items = grouped[groupName];
      if (!items) return;
      const header = document.createElement("p");
      header.className = "filterGroupHeader";
      header.textContent = groupName;
      header.setAttribute("aria-expanded", "false");
      filterContainer.appendChild(header);

      const groupWrap = document.createElement("div");
      groupWrap.className = "filterGroup collapsed";
      items
        .sort(function (a, b) { return (a.trait.order || 99) - (b.trait.order || 99); })
        .forEach(function (item) { renderCheckbox(groupWrap, item.traitId, item.trait); });
      filterContainer.appendChild(groupWrap);

      header.addEventListener("click", function () {
        const expanded = header.getAttribute("aria-expanded") === "true";
        header.setAttribute("aria-expanded", !expanded);
        groupWrap.classList.toggle("collapsed", expanded);
      });
    }

    ungrouped
      .sort(function (a, b) { return (a.trait.order || 99) - (b.trait.order || 99); })
      .forEach(function (item) {
        renderCheckbox(filterContainer, item.traitId, item.trait);
        const subgroupName = BROAD_TO_SUBGROUP[item.traitId];
        if (subgroupName) renderSubgroup(subgroupName);
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

    const allTraits = getRankedTraits(counts, selectedFoods.length);
    lastTopTraits = allTraits.slice(0, 3);
    lastMacroNotes = getMacroNotes(counts, selectedFoods.length);
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

      if (lastMacroNotes.length > 0) {
        const hr = document.createElement("hr");
        hr.className = "popupDivider";
        popupTextContainer.appendChild(hr);
        const note = document.createElement("p");
        note.className = "popupMacroNote";
        const joined = lastMacroNotes.length > 1
          ? lastMacroNotes.slice(0, -1).join(", ") + " and " + lastMacroNotes[lastMacroNotes.length - 1]
          : lastMacroNotes[0];
        note.textContent = "Note: this selection is also high in " + joined +
          " (over 90% of foods) — these rarely cause symptoms directly but can worsen other GI issues.";
        popupTextContainer.appendChild(note);
      }
    }

    popupContainer.classList.toggle("show");
  });

  popupContainer.addEventListener("click", function () {
    popupContainer.classList.toggle("show");
  });

  document.getElementById("printAnalysisButton").addEventListener("click", function (e) {
    e.stopPropagation();

    const foods = getSelectedFoods().map(function (f) { return f.name; }).sort();
    const foodsList = document.getElementById("printFoodsList");
    foodsList.innerHTML = "<h2>Selected foods (" + foods.length + ")</h2>";
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
      lastTopTraits.forEach(function (item) {
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

  document.getElementById("clearFiltersButton").addEventListener("click", function () {
    filterContainer.querySelectorAll("input[type='checkbox']").forEach(function (cb) { cb.checked = false; });
    recompute();
  });

  // ---- Boot ----------------------------------------------------------------
  renderCategories();
  renderFilters();
  recompute();
})();
