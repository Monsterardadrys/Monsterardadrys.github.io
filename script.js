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

  // The disclaimer bar and popup live in disclaimer.js — shared with
  // without.html, which needs exactly the same behaviour.

  // ---- The food category boxes and their search --------------------------
  // Shared with the meal builder — see FoodPicker in food-picker.js.
  const picker = FoodPicker.create({
    container: topSection,
    searchInput: searchField,
    mode: "check",
    onChange: recompute
  });

  // ---- Build the filter checkboxes ---------------------------------------
  // Shared with the "foods without" page — see renderPicker in trait-foods.js.
  function renderFilters() {
    TraitFoods.renderPicker(filterContainer, recompute);
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
      chosenText.textContent = I18N.t("app.pickACategory");
      return;
    }

    checkboxes.forEach(function (checkbox) {
      const chip = document.createElement("span");
      chip.className = "chosenFoodChip";
      chip.appendChild(document.createTextNode(I18N.nameOf(checkbox.value)));

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "chosenFoodRemove";
      removeBtn.setAttribute("aria-label", I18N.t("app.remove", { food: I18N.nameOf(checkbox.value) }));
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

  const MACRO_TRAIT_IDS = ["over_10g_fat", "protein"];

  // A trait with `modifierOf` only means something alongside the trait it
  // modifies — dao_competitor is about competing for an enzyme, so with no
  // histamine in the selection there is nothing to compete with. Drop it
  // rather than report it as a finding. Filtering out the target trait counts
  // as taking it out of play too, which is the behaviour we want.
  function modifierIsIdle(traitId, counts) {
    const target = TRAITS[traitId].modifierOf;
    return Boolean(target) && !(counts[target] > 0);
  }

  function getRankedTraits(counts, totalSelected, limit) {
    const list = Object.keys(counts)
      .filter(function (id) {
        return counts[id] > 0 &&
          MACRO_TRAIT_IDS.indexOf(id) === -1 &&
          !modifierIsIdle(id, counts);
      })
      .sort(function (a, b) { return counts[b] - counts[a]; })
      .map(function (id) {
        return { traitId: id, count: counts[id], percent: Math.floor((counts[id] / totalSelected) * 100) };
      });
    return typeof limit === "number" ? list.slice(0, limit) : list;
  }

  // Foods carrying no trait the tool actually tracks. They still count in the
  // percentage denominator (which is correct — the user chose them), but that
  // silently drags every share down, so the analysis says so out loud.
  // Deliberately ignores filters: this is about gaps in the data, not about
  // what the user is excluding right now, so the note shouldn't flicker as
  // filter checkboxes are toggled.
  function countUntrackedFoods(foods) {
    return foods.filter(function (food) {
      return !food.traits.some(function (traitId) { return TRAITS[traitId]; });
    }).length;
  }

  function foodCount(n) {
    return I18N.t("app.foodCountN", { n: n });
  }

  // `showingPercentages` is false when every trait has been filtered out, so
  // the note doesn't point at percentages that aren't on screen.
  function untrackedNoteText(untracked, total, showingPercentages) {
    if (untracked === 0) return "";
    if (untracked === total) {
      return total === 1
        ? I18N.t("app.untrackedOneFood")
        : I18N.t("app.untrackedAllFoods", { total: total });
    }
    const base = I18N.t("app.untrackedSome", { n: untracked, count: foodCount(total) });
    return showingPercentages ? base + I18N.t("app.untrackedCounted") : base;
  }

  const UNTRACKED_LABEL = I18N.t("app.noTrackedTraits");

  // Weaves an untracked-foods row into the ranked traits so every percentage
  // in a list adds up against the same denominator. It's a display row only —
  // it has no trait id, so it can't be filtered, excluded or linked to an
  // article, and callers must keep it out of anything that expects real traits
  // (the printed article list, for one).
  function withUntrackedRow(rankedTraits, untracked, total) {
    if (untracked === 0 || total === 0) return rankedTraits.slice();
    const row = {
      untracked: true,
      label: UNTRACKED_LABEL,
      percent: Math.floor((untracked / total) * 100)
    };
    return rankedTraits.concat([row]).sort(function (a, b) { return b.percent - a.percent; });
  }

  function rowLabel(item) {
    return item.untracked ? item.label : I18N.traitLabel(TRAITS[item.traitId]);
  }

  function getMacroNotes(counts, totalSelected) {
    if (totalSelected === 0) return [];
    return MACRO_TRAIT_IDS
      .filter(function (id) { return ((counts[id] || 0) / totalSelected) * 100 > 90; })
      .map(function (id) { return I18N.traitLabel(TRAITS[id]); });
  }

  // ---- Main recompute — runs on every food or filter checkbox change ---
  function recompute() {
    // Every change passes through here, so this is where the session is kept.
    Session.set("app", {
      foods: checkedValues(topSection),
      filters: checkedValues(filterContainer)
    });
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
    updateSummaryText(selectedFoods.length, allTraits, countUntrackedFoods(selectedFoods));
  }

  function updateSummaryText(total, allTraits, untracked) {
    const summaryTraitList = document.getElementById("summaryTraitList");
    const summaryToggle = document.getElementById("summaryToggle");
    const untrackedNote = document.getElementById("untrackedNote");
    const visibleCount = 3;

    function setNote(text) {
      untrackedNote.textContent = text;
      untrackedNote.hidden = !text;
    }

    if (total === 0) {
      summaryText.textContent = I18N.t("app.selectForSummary");
      summaryTraitList.innerHTML = "";
      summaryToggle.style.display = "none";
      setNote("");
      return;
    }
    if (allTraits.length === 0) {
      summaryText.textContent = untracked === total
        ? I18N.t("app.chosenPlain", { count: foodCount(total) })
        : I18N.t("app.chosenNoShared", { count: foodCount(total) });
      summaryTraitList.innerHTML = "";
      summaryToggle.style.display = "none";
      setNote(untrackedNoteText(untracked, total, false));
      return;
    }

    // The count now lives in the list as its own row, so the note only has to
    // explain what it means rather than repeat the number.
    setNote(untracked > 0 ? I18N.t("app.untrackedStillCount") : "");

    summaryText.textContent = I18N.t("app.chosenShared", { count: foodCount(total) });
    summaryTraitList.innerHTML = "";
    summaryTraitList.classList.remove("expanded");
    const rows = withUntrackedRow(allTraits, untracked, total);
    rows.forEach(function (t, i) {
      const li = document.createElement("li");
      li.textContent = t.percent + "% — " + rowLabel(t);
      const classes = [];
      if (i >= visibleCount) classes.push("extraTrait");
      if (t.untracked) classes.push("untrackedRow");
      if (classes.length) li.className = classes.join(" ");
      summaryTraitList.appendChild(li);
    });

    const extraCount = rows.length - visibleCount;
    if (extraCount > 0) {
      summaryToggle.style.display = "inline-block";
      summaryToggle.textContent = I18N.t("app.showNMore", { n: extraCount });
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
      btn.textContent = I18N.t("app.showNMore", { n: extraCount });
    } else {
      btn.textContent = I18N.t("app.showLess");
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
      p.textContent = I18N.t("app.selectForAnalysis");
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
    foodsIntro.textContent = I18N.t("app.foodsInAnalysis");
    popupTextContainer.appendChild(foodsIntro);

    const chipRow = document.createElement("div");
    chipRow.className = "popupFoodChips noPrint";
    popupAllFoods.forEach(function (food) {
      const isExcluded = popupExcludedFoods.has(food.name);
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = isExcluded ? "popupFoodChip excluded" : "popupFoodChip";
      chip.textContent = I18N.nameOf(food.name);
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
      p.textContent = I18N.t("app.allExcluded");
      popupTextContainer.appendChild(p);
      return;
    }

    const untracked = countUntrackedFoods(activeFoods);

    if (topTraits.length === 0) {
      const p = document.createElement("p");
      p.className = "popupText";
      p.textContent = untracked === activeFoods.length
        ? untrackedNoteText(untracked, activeFoods.length, false)
        : "These foods don't share a tracked trait right now (or every relevant factor is excluded).";
      popupTextContainer.appendChild(p);

      // Some (but not all) foods being untracked is still worth saying here —
      // otherwise the popup stays silent about it while the summary explains it.
      if (untracked > 0 && untracked !== activeFoods.length) {
        const note = document.createElement("p");
        note.className = "popupMacroNote";
        note.textContent = untrackedNoteText(untracked, activeFoods.length, false);
        popupTextContainer.appendChild(note);
      }
      return;
    }

    withUntrackedRow(topTraits, untracked, activeFoods.length).forEach(function (item, index) {
      if (index > 0) {
        const hr = document.createElement("hr");
        hr.className = "popupDivider";
        popupTextContainer.appendChild(hr);
      }

      // The untracked row is informational: percentage plus one line of
      // explanation, no Exclude button and no article to read.
      if (item.untracked) {
        const heading = document.createElement("p");
        heading.className = "popupTraitHeading";
        heading.textContent = item.percent + "% — " + item.label;
        popupTextContainer.appendChild(heading);

        const p = document.createElement("p");
        p.className = "popupText";
        p.textContent = I18N.t("app.untrackedNote", {
          n: untracked, total: foodCount(activeFoods.length)
        });
        popupTextContainer.appendChild(p);
        return;
      }

      const trait = TRAITS[item.traitId];

      const headingRow = document.createElement("div");
      headingRow.className = "popupTraitHeadingRow";

      const heading = document.createElement("p");
      heading.className = "popupTraitHeading";
      heading.textContent = item.percent + "% — " + I18N.traitLabel(trait);
      headingRow.appendChild(heading);

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "popupTraitRemove noPrint";
      removeBtn.textContent = I18N.t("app.exclude");
      removeBtn.setAttribute("aria-label", I18N.t("app.excludeAria", { trait: I18N.traitLabel(trait) }));
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

      const analysis = I18N.pickList(trait, "analysis");
      const paragraphs = analysis.length
        ? analysis
        : [I18N.t("app.fallbackAnalysis", { trait: I18N.traitLabel(trait) })];
      paragraphs.forEach(function (text, i) {
        const p = document.createElement("p");
        if (i === 0) p.className = "popupText";
        p.textContent = text;
        popupTextContainer.appendChild(p);
      });

      // How well-grounded the trait is, under its own heading and below the
      // explanation — what the trait is comes first, how sure we are second.
      const evidence = I18N.lang() === "sv" && trait.sv && trait.sv.evidence
        ? trait.sv.evidence : trait.evidence;
      if (evidence) {
        const evHeading = document.createElement("p");
        evHeading.className = "evidenceHeading";
        evHeading.textContent = I18N.t("app.evidenceHeading");
        popupTextContainer.appendChild(evHeading);

        const ev = document.createElement("p");
        ev.className = "evidenceLine";
        const badge = document.createElement("span");
        /* The class comes off the English level so the colour does not
           depend on the language; the text comes off the shown one. */
        badge.className = "evidenceBadge evidence--" +
          trait.evidence.level.toLowerCase().replace(/[^a-z]+/g, "-");
        badge.textContent = evidence.level;
        ev.appendChild(badge);
        ev.appendChild(document.createTextNode(" " + evidence.detail));
        popupTextContainer.appendChild(ev);
      }
      if (trait.articleId) {
        const p = document.createElement("p");
        p.className = "noPrint";
        const link = document.createElement("a");
        link.href = "articles.html#" + trait.articleId;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = I18N.t("app.readArticle");
        link.addEventListener("click", function (e) { e.stopPropagation(); });
        p.appendChild(link);
        popupTextContainer.appendChild(p);

        const printNote = document.createElement("p");
        printNote.className = "printOnly";
        const articleTitle = (typeof ARTICLES !== "undefined" && ARTICLES[trait.articleId])
          ? ARTICLES[trait.articleId].title : I18N.traitLabel(trait);
        printNote.textContent = I18N.t("app.seeBelow", { title: articleTitle });
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
        ? macroNotes.slice(0, -1).join(", ") + I18N.t("count.and") + macroNotes[macroNotes.length - 1]
        : macroNotes[0];
      note.textContent = I18N.t("app.macroNote", { list: joined });
      popupTextContainer.appendChild(note);
    }

    // Closes every analysis that produced findings. Deliberately not marked
    // noPrint: the printout is what a patient takes home, which is exactly
    // where the distinction between a pattern and a cause matters most.
    const caveat = document.createElement("p");
    caveat.className = "popupCaveat";
    caveat.textContent = I18N.t("app.caveat");
    popupTextContainer.appendChild(caveat);

    // The amount-based traits are measured at one typical serving, so a larger
    // helping is invisible here. Says so where it is read, not only on About.
    const portionCaveat = document.createElement("p");
    portionCaveat.className = "popupCaveat";
    portionCaveat.textContent = I18N.t("app.portionCaveat");
    popupTextContainer.appendChild(portionCaveat);
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

    const foods = popupActiveFoods.map(function (f) { return I18N.nameOf(f.name); })
      .sort(function (a, b) { return a.localeCompare(b, I18N.lang()); });
    const foodsList = document.getElementById("printFoodsList");
    foodsList.innerHTML = "";
    const foodsHeading = document.createElement("h2");
    foodsHeading.textContent = I18N.t("app.printFoodsHeading", { n: foods.length });
    foodsList.appendChild(foodsHeading);
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
    const depth = document.getElementById("articleDepth").value;
    if (typeof ARTICLES !== "undefined" && depth !== "none") {
      // Several traits can share one article — all fifteen allergens do. The
      // article prints once, listing the foods for the traits this analysis
      // actually found rather than all fifteen.
      const traitsByArticle = {};
      popupActiveTraits.forEach(function (item) {
        const articleId = TRAITS[item.traitId].articleId;
        if (!articleId) return;
        (traitsByArticle[articleId] = traitsByArticle[articleId] || []).push(item.traitId);
      });

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

        // "short" is the first section — every article opens with what the
        // trait is, which is the part a patient needs on paper.
        const sections = depth === "short" ? article.sections.slice(0, 1) : article.sections;
        sections.forEach(function (sec) {
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

        // Every food carrying the trait, so the printout stands on its own
        // away from the app — see trait-foods.js.
        if (typeof TraitFoods !== "undefined" && depth === "full") {
          TraitFoods.renderForPrint(section, traitsByArticle[trait.articleId] || []);
        }

        articlesBox.appendChild(section);
      });
    }

    window.print();
  });

  searchButton.addEventListener("click", function () { picker.search(searchField.value); });

  showAllButton.addEventListener("click", function () {
    searchField.value = "";
    picker.clearSearch();
    picker.showAll();
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
    picker.setValues([]);
    filterContainer.querySelectorAll("input[type='checkbox']").forEach(function (cb) { cb.checked = false; });
    searchField.value = "";
    picker.clearSearch();
    picker.hideAll();
    recompute();
    document.getElementById("chosenFoods").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // ---- Save / load ---------------------------------------------------------
  // The selection lives in this browser between visits (session.js) and a
  // file is a snapshot of every tool at once — see save-load.js.
  const saveError = document.getElementById("saveError");

  function showSaveError(message) {
    saveError.textContent = message;
    saveError.hidden = !message;
  }

  function checkedValues(container) {
    return Array.from(container.querySelectorAll("input[type='checkbox']:checked"))
      .map(function (cb) { return cb.value; });
  }

  function applyValues(container, values) {
    const wanted = new Set(values);
    const missing = new Set(wanted);
    container.querySelectorAll("input[type='checkbox']").forEach(function (cb) {
      cb.checked = wanted.has(cb.value);
      missing.delete(cb.value);
    });
    return Array.from(missing);
  }

  document.getElementById("saveSelectionButton").addEventListener("click", function () {
    showSaveError("");
    SaveLoad.save("session", Session.snapshot(), "food-intolerance-guide");
  });

  document.getElementById("loadSelectionButton").addEventListener("click", function () {
    SaveLoad.load("session", function (data) {
      Session.restore(data);
      const app = data.app || {};
      const missingFoods = applyValues(topSection, app.foods || []);
      applyValues(filterContainer, app.filters || []);

      // A saved food that has since been renamed or removed would otherwise
      // vanish without a word.
      showSaveError(missingFoods.length
        ? "Loaded, but " + missingFoods.length + " food(s) are no longer in the database: " +
          missingFoods.join(", ")
        : "");

      picker.revealChecked();
      recompute();
    }, showSaveError);
  });

  // ---- Boot ----------------------------------------------------------------
  renderFilters();

  const remembered = Session.get("app");
  if (remembered) {
    picker.setValues(remembered.foods || []);
    applyValues(filterContainer, remembered.filters || []);
    picker.revealChecked();
  }

  recompute();
})();
