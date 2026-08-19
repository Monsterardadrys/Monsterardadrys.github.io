/* =========================================================================
   trait-foods.js — "which foods carry this trait?"

   Reads CATEGORIES and TRAITS from foods-data.js and builds the food lists
   that appear at the foot of every article and in the printed analysis.
   Load after foods-data.js.

   The lists answer one question and no other: which foods in this database
   carry this tag. They are not a list of foods to avoid — see the standing
   note at the bottom of each one.
   ========================================================================= */

const TraitFoods = (function () {
  "use strict";

  /* Foods carrying `traitId`, grouped by the category they live in and
     keeping the category order from foods-data.js.

     A locked food has no `traits` at all — the free build ships it as a
     name and nothing else — so every loop over foods here has to say so.
     Missing that threw on every article page for three releases: the
     landing list renders no article, so loading articles.html without a
     hash looked clean while every article on it was broken. */
  function hasTraits(food) {
    return Array.isArray(food.traits);
  }

  function byCategory(traitId) {
    const groups = [];
    CATEGORIES.forEach(function (category) {
      const names = category.foods
        .filter(function (food) { return hasTraits(food) && food.traits.indexOf(traitId) !== -1; })
        .map(function (food) { return food.name; });
      if (names.length) groups.push({ label: I18N.pick(category, "label"), names: names });
    });
    return groups;
  }

  function countFor(traitId) {
    return byCategory(traitId).reduce(function (total, group) {
      return total + group.names.length;
    }, 0);
  }

  // Every trait pointing at this article, in the order TRAITS declares them.
  // Most articles have exactly one; the allergens article has fifteen.
  //
  // Where that trait is the broad one at the head of a filter card — GI
  // irritants, FODMAPs, cross-reactivity — the specific traits underneath it
  // come too. They have no article of their own, and the broad list on its
  // own would hide which foods are the caffeine ones and which the capsaicin.
  function traitsForArticle(articleId) {
    const ids = [];
    Object.keys(TRAITS).forEach(function (id) {
      if (TRAITS[id].articleId !== articleId) return;
      ids.push(id);

      if (typeof FILTER_SECTIONS === "undefined") return;
      FILTER_SECTIONS.forEach(function (section) {
        if (section.broad !== id || !section.group) return;
        Object.keys(TRAITS).forEach(function (other) {
          if (TRAITS[other].group === section.group && ids.indexOf(other) === -1) {
            ids.push(other);
          }
        });
      });
    });
    return ids;
  }

  function plural(n) { return I18N.t("count.foods", { n: n }); }

  // One trait's lists, as a <details> so a long article stays scannable.
  function buildTraitBlock(traitId, openByDefault) {
    const groups = byCategory(traitId);
    if (!groups.length) return null;

    const details = document.createElement("details");
    details.className = "traitFoods";
    if (openByDefault) details.open = true;

    const summary = document.createElement("summary");
    summary.textContent = I18N.t("traitFoods.summary", {
      trait: I18N.traitLabel(TRAITS[traitId]), count: plural(countFor(traitId))
    });
    details.appendChild(summary);

    groups.forEach(function (group) {
      const h4 = document.createElement("h4");
      h4.className = "traitFoodsCategory";
      h4.textContent = group.label;
      details.appendChild(h4);

      const ul = document.createElement("ul");
      ul.className = "traitFoodsList";
      group.names.forEach(function (name) {
        const li = document.createElement("li");
        li.textContent = I18N.nameOf(name);
        ul.appendChild(li);
      });
      details.appendChild(ul);
    });

    return details;
  }

  // Appends the whole "which foods carry this" section for one article.
  // Returns true if anything was added.
  function render(container, articleId) {
    if (typeof CATEGORIES === "undefined" || typeof TRAITS === "undefined") return false;

    const traitIds = traitsForArticle(articleId).filter(function (id) {
      return countFor(id) > 0;
    });
    if (!traitIds.length) return false;

    const wrap = document.createElement("section");
    wrap.className = "traitFoodsSection";

    const h2 = document.createElement("h2");
    h2.textContent = I18N.t("traitFoods.heading");
    wrap.appendChild(h2);

    const intro = document.createElement("p");
    intro.textContent = I18N.t(traitIds.length === 1
      ? "traitFoods.introOne" : "traitFoods.introMany");
    wrap.appendChild(intro);

    // A single trait is worth showing straight away; fifteen are not.
    const openByDefault = traitIds.length === 1;
    traitIds.forEach(function (id) {
      const block = buildTraitBlock(id, openByDefault);
      if (block) wrap.appendChild(block);
    });

    const note = document.createElement("p");
    note.className = "traitFoodsNote";
    note.textContent = "What this list is: the foods in this database carrying the tag, " +
      "measured at one standard serving each. What it is not: a list of foods to avoid. " +
      "Most people react to none of them, and a food's presence here says nothing about " +
      "whether it affects you.";
    wrap.appendChild(note);

    container.appendChild(wrap);
    return true;
  }

  // Flat version for the printout, where <details> and nesting are noise.
  // Takes explicit trait ids rather than an article: the printout should
  // carry the traits the analysis actually found, not every trait that
  // happens to share an article.
  function renderForPrint(container, ids) {
    const traitIds = ids.filter(function (id) {
      return TRAITS[id] && countFor(id) > 0;
    });
    if (!traitIds.length) return false;

    traitIds.forEach(function (traitId) {
      const h3 = document.createElement("h3");
      // The label verbatim — lowercasing it would wreck DAO, GOS and FODMAPs.
      h3.textContent = I18N.t("traitFoods.tagged", {
        trait: I18N.traitLabel(TRAITS[traitId]), count: plural(countFor(traitId))
      });
      container.appendChild(h3);

      const ul = document.createElement("ul");
      ul.className = "printFoodsUl";
      byCategory(traitId).forEach(function (group) {
        group.names.forEach(function (name) {
          const li = document.createElement("li");
          li.textContent = I18N.nameOf(name);
          ul.appendChild(li);
        });
      });
      container.appendChild(ul);
    });

    const note = document.createElement("p");
    note.className = "traitFoodsNote";
    note.textContent = I18N.t("traitFoods.note");
    container.appendChild(note);
    return true;
  }

  /* ---- The trait picker ------------------------------------------------
     One set of checkboxes built from FILTER_SECTIONS, shared by the app's
     filter panel and the "foods without" page. Each checkbox carries the
     trait id as its value, so a caller reads its own container with
     querySelectorAll("input:checked"). */
  function renderPicker(container, onChange) {
    function checkbox(parent, traitId, extraClass) {
      const label = document.createElement("label");
      label.className = extraClass ? "checkboxStyle " + extraClass : "checkboxStyle";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = traitId;
      if (onChange) input.addEventListener("change", onChange);
      label.appendChild(input);
      label.appendChild(document.createTextNode(I18N.traitLabel(TRAITS[traitId])));
      parent.appendChild(label);
    }

    function groupTraits(groupName) {
      return Object.keys(TRAITS)
        .filter(function (id) { return TRAITS[id].filter && TRAITS[id].group === groupName; })
        .sort(function (a, b) { return (TRAITS[a].order || 99) - (TRAITS[b].order || 99); });
    }

    FILTER_SECTIONS.forEach(function (section) {
      const card = document.createElement("div");
      card.className = section.wide ? "filterCard wide" : "filterCard";

      const title = document.createElement("p");
      title.className = "filterCardTitle";
      title.textContent = I18N.pick(section, "title");
      card.appendChild(title);

      if (section.broad) checkbox(card, section.broad, "broad");

      if (section.group) {
        const wrap = document.createElement("div");
        // Without a broad trait above it there is nothing to indent under.
        wrap.className = section.broad
          ? "specificWrap checkRow"
          : "specificWrap checkRow flat";
        groupTraits(section.group).forEach(function (id) { checkbox(wrap, id); });
        card.appendChild(wrap);
      }

      if (section.items) {
        const row = document.createElement("div");
        row.className = section.group ? "checkRow extraRow" : "checkRow";
        section.items.forEach(function (id) { checkbox(row, id); });
        card.appendChild(row);
      }

      container.appendChild(card);
    });
  }

  // Foods carrying none of `traitIds`, grouped by category. With nothing
  // selected this is every food in the database.
  function withoutTraits(traitIds) {
    const groups = [];
    CATEGORIES.forEach(function (category) {
      const names = category.foods.filter(function (food) {
        // A locked food is not "a food without these traits" — it is a food
        // whose traits this build does not know. Leaving it out is the only
        // honest answer, and the only safe one.
        if (!hasTraits(food)) return false;
        return !traitIds.some(function (id) { return food.traits.indexOf(id) !== -1; });
      }).map(function (food) { return food.name; });
      if (names.length) groups.push({ label: I18N.pick(category, "label"), names: names });
    });
    return groups;
  }

  return {
    byCategory: byCategory,
    countFor: countFor,
    traitsForArticle: traitsForArticle,
    render: render,
    renderForPrint: renderForPrint,
    renderPicker: renderPicker,
    withoutTraits: withoutTraits
  };
})();
