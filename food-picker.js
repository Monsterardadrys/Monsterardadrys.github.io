/* =========================================================================
   food-picker.js — the category boxes and the search over them

   Built from CATEGORIES and CATEGORY_GROUPS in foods-data.js, and shared by
   the app (which ticks foods) and the meal builder (which adds one at a
   time). Neither hardcodes a food or a category.

   The meal builder used to offer a bare <datalist> of every food, which
   works only if you already know what the food is called. At 472 foods that
   was thin; it gets worse with every food added, which is the reason to have
   one picker rather than two.

       FoodPicker.create({
         container,      // where the category boxes go
         searchInput,    // optional <input> to filter by name
         mode,           // "check" (app) or "pick" (meal builder)
         include,        // optional (food) => boolean, to leave some out
         onChange,       // "check": something was ticked or unticked
         onPick          // "pick": a food name was chosen
       })

   Returns { showAll, hideAll, search, clearSearch, revealChecked, values,
   setValues } — the operations both callers turned out to need.
   ========================================================================= */

const FoodPicker = (function () {
  "use strict";

  function create(options) {
    const container = options.container;
    const mode = options.mode === "pick" ? "pick" : "check";
    const include = options.include || function () { return true; };

    function renderCategoryBox(parent, category) {
      const foods = category.foods.filter(include);
      if (!foods.length) return;

      const box = document.createElement("div");
      box.className = "foodBox";

      const button = document.createElement("button");
      button.type = "button";
      button.className = "button";
      button.textContent = category.label;

      const group = document.createElement("div");
      group.className = "foodGroup";

      foods.slice().sort(function (a, b) {
        return a.name.localeCompare(b.name);
      }).forEach(function (food) {
        if (mode === "pick") {
          // One tap adds the food, so it is a button rather than a checkbox:
          // a meal holds an amount of a food, not a yes or no.
          const pick = document.createElement("button");
          pick.type = "button";
          pick.className = "foodPick";
          pick.dataset.food = food.name;
          pick.textContent = food.name;
          pick.addEventListener("click", function () {
            if (options.onPick) options.onPick(food.name);
          });
          group.appendChild(pick);
          return;
        }

        const label = document.createElement("label");
        label.className = "checkboxStyle";
        label.dataset.traits = food.traits.join(" ");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = food.name;
        if (options.onChange) checkbox.addEventListener("change", options.onChange);

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(food.name));
        group.appendChild(label);
      });

      button.addEventListener("click", function () {
        group.classList.toggle("open");
      });

      box.appendChild(button);
      box.appendChild(group);
      parent.appendChild(box);
    }

    function renderGroupSection(title, categories) {
      const section = document.createElement("div");
      section.className = "categoryGroup";

      const heading = document.createElement("p");
      heading.className = "categoryGroupTitle";
      heading.textContent = title;
      section.appendChild(heading);

      const row = document.createElement("div");
      row.className = "categoryGroupRow";
      categories.forEach(function (category) { renderCategoryBox(row, category); });
      section.appendChild(row);

      // A whole group can end up empty once `include` has had its say.
      if (row.children.length) container.appendChild(section);
    }

    function render() {
      const byId = {};
      CATEGORIES.forEach(function (category) { byId[category.id] = category; });
      const placed = new Set();

      CATEGORY_GROUPS.forEach(function (group) {
        const categories = group.categories
          .map(function (id) { return byId[id]; })
          .filter(Boolean);
        if (!categories.length) return;
        categories.forEach(function (c) { placed.add(c.id); });
        renderGroupSection(group.title, categories);
      });

      // Any category not named in CATEGORY_GROUPS still shows, under "Other",
      // so adding one to foods-data.js is never a silent disappearance.
      const leftover = CATEGORIES.filter(function (c) { return !placed.has(c.id); });
      if (leftover.length) renderGroupSection("Other", leftover);
    }

    function entries() {
      return container.querySelectorAll(mode === "pick" ? ".foodPick" : ".checkboxStyle");
    }

    function nameOf(entry) {
      return mode === "pick" ? entry.dataset.food : entry.querySelector("input").value;
    }

    function showAll() {
      container.querySelectorAll(".foodGroup").forEach(function (g) { g.classList.add("open"); });
    }

    function hideAll() {
      container.querySelectorAll(".foodGroup").forEach(function (g) { g.classList.remove("open"); });
    }

    /* Opens every category and hides the foods that do not match. A search
       that matches nothing puts everything back rather than leaving a blank
       page — a typo should not look like an empty database. */
    /* Every word, anywhere, in any order.

       A substring match makes you guess the word order someone else chose:
       "cheese cream" finds nothing when the food is called "Cream Cheese", and
       "dried mango" finds nothing when it is "Dried Mango (No Sugar Added)"
       only because of where the brackets fall. Splitting the query and asking
       for each word separately removes the guessing, and costs nothing — a
       single word behaves exactly as it did. */
    function matchesWords(name, words) {
      const hay = name.toUpperCase();
      return words.every(function (w) { return hay.indexOf(w) > -1; });
    }

    function search(term) {
      const words = String(term || "").toUpperCase().split(/\s+/)
        .filter(function (w) { return w.length; });
      let found = false;
      showAll();

      const all = entries();
      all.forEach(function (entry) {
        const matches = !words.length || matchesWords(nameOf(entry), words);
        if (matches) found = true;
        entry.style.display = matches ? "" : "none";
      });

      if (!found) all.forEach(function (entry) { entry.style.display = ""; });
      return found;
    }

    function clearSearch() {
      entries().forEach(function (entry) { entry.style.display = ""; });
    }

    // "check" only: which foods are ticked, and setting them.
    function values() {
      return Array.from(container.querySelectorAll("input[type='checkbox']:checked"))
        .map(function (cb) { return cb.value; });
    }

    function setValues(names) {
      const wanted = new Set(names || []);
      const missing = new Set(wanted);
      container.querySelectorAll("input[type='checkbox']").forEach(function (cb) {
        cb.checked = wanted.has(cb.value);
        missing.delete(cb.value);
      });
      return Array.from(missing);
    }

    // Opens the categories holding anything ticked, so a restored selection
    // is visible rather than hidden behind closed boxes.
    function revealChecked() {
      hideAll();
      container.querySelectorAll("input[type='checkbox']:checked").forEach(function (cb) {
        const group = cb.closest(".foodGroup");
        if (group) group.classList.add("open");
      });
    }

    render();

    if (options.searchInput) {
      const input = options.searchInput;
      input.addEventListener("input", function () { search(input.value); });
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); search(input.value); }
      });
    }

    return {
      showAll: showAll,
      hideAll: hideAll,
      search: search,
      clearSearch: clearSearch,
      values: values,
      setValues: setValues,
      revealChecked: revealChecked
    };
  }

  return { create: create };
})();
