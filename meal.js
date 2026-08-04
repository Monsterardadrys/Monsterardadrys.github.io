/* =========================================================================
   meal.js — drives meal.html

   A meal is a list of { food, grams }. The analysis splits traits the same
   way the rest of the site does:

     - Amount-based traits (TRAITS[id].dose) are summed. A food contributes
       its weight divided by its own standard serving, so 250g of a food
       served in 125g portions counts as 2 servings.

     - Everything else is categorical. An allergen is present or it is not,
       and 2g of peanut is still peanut. Those are reported family by family
       — all the FODMAP types in one sentence, all the allergens in another —
       naming which are present, which is most widespread across the meal's
       ingredients, and which are absent. Prominence there means how many
       ingredients carry it, never how much.

   WHAT THE SUM IS NOT. The database holds each food's traits and serving
   size, not its nutrient content, so "Fat 3.4 servings" means the meal holds
   as much fat-tagged food as 3.4 standard servings — not 3.4 times any
   threshold, and not a figure in grams. Keep every label saying that.
   ========================================================================= */

(function () {
  "use strict";

  const builder = document.getElementById("mealBuilder");
  const results = document.getElementById("mealResults");
  const errorBox = document.getElementById("mealError");
  const datalist = document.getElementById("foodOptions");

  // ---- The food index ----------------------------------------------------
  const FOODS = {};
  CATEGORIES.forEach(function (category) {
    category.foods.forEach(function (food) {
      FOODS[food.name] = { name: food.name, portion: food.portion, traits: food.traits, category: category.label };
    });
  });

  /* Only foods with figures can go in a meal. A meal is reported in grams of
     fat and fiber, and a food with no numbers would sit in the list looking
     like it counted while contributing nothing — worse than not being there.
     They are still in the app and in Foods without, which do not need figures.

     Before the figures have been built at all, nothing is gated: an empty
     nutrition-data.js would otherwise leave an empty food list. */
  function hasFigures(name) {
    return !haveNutrition() || Boolean(NUTRITION[name]);
  }

  Object.keys(FOODS).sort().forEach(function (name) {
    if (!hasFigures(name)) return;
    const option = document.createElement("option");
    option.value = name;
    datalist.appendChild(option);
  });

  function haveNutrition() {
    return typeof NUTRITION !== "undefined" && Object.keys(NUTRITION).length > 0;
  }

  // ---- State -------------------------------------------------------------
  let meals = [{ name: "Meal 1", items: [] }];

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = !message;
  }

  // ---- Trait families ----------------------------------------------------
  /* The categorical traits are reported family by family — FODMAPs together,
     allergens together — rather than as one flat list, because "three of the
     five FODMAP types, fructans the most prominent" says something a list of
     fourteen bullet points does not.

     Families come straight from FILTER_SECTIONS, so a new trait joins the
     right sentence without this file changing. Anything ungrouped gets a line
     of its own. */
  const FAMILIES = [];
  const claimed = {};

  FILTER_SECTIONS.forEach(function (section) {
    if (!section.group) return;
    const members = [];
    if (section.broad) members.push(section.broad);
    Object.keys(TRAITS).forEach(function (id) {
      if (TRAITS[id].group === section.group) members.push(id);
    });
    members.forEach(function (id) { claimed[id] = true; });

    // The umbrella is the family, not a member of it — counting it as a type
    // would make "one of six" out of a meal carrying a single subtype.
    const types = members.filter(function (id) { return id !== section.broad; });
    const withArticle = members.filter(function (id) { return TRAITS[id].articleId; })[0];

    FAMILIES.push({
      title: section.title,
      noun: section.noun || section.title.toLowerCase(),
      broad: section.broad || null,
      types: types,
      articleId: withArticle ? TRAITS[withArticle].articleId : null
    });
  });

  // Categorical traits belonging to no family — histamine, refined carbs and
  // the like. The amount-based ones are already in the table above.
  const SINGLES = Object.keys(TRAITS).filter(function (id) {
    return !claimed[id] && !TRAITS[id].dose;
  });

  // ---- Analysis ----------------------------------------------------------
  // For each trait: how many of the meal's ingredients carry it, and how many
  // servings' worth they add up to.
  function tally(items) {
    const found = {};
    items.forEach(function (item) {
      const food = FOODS[item.food];
      if (!food) return;
      const servings = food.portion ? item.grams / food.portion : 0;
      food.traits.forEach(function (traitId) {
        if (!TRAITS[traitId]) return;
        const entry = found[traitId] || (found[traitId] = { servings: 0, count: 0 });
        entry.servings += servings;
        entry.count += 1;
      });
    });
    return found;
  }

  /* Real grams, where we have them. nutrition-data.js is generated from a
     Livsmedelsverket export and covers the foods with an entry there — around
     three quarters of the database — so a meal is often part-covered and the
     total has to say so rather than quietly under-reporting. */
  const NUTRIENTS = [
    { key: "fat", label: "Fat" },
    { key: "protein", label: "Protein" },
    { key: "carbs", label: "Carbohydrate" },
    { key: "sugars", label: "Sugars" },
    { key: "fiber", label: "Fiber" }
  ];

  function nutrientTotals(items) {
    const totals = {};
    const covered = [];
    const uncovered = [];

    items.forEach(function (item) {
      const values = NUTRITION[item.food];
      if (!values) { uncovered.push(item.food); return; }
      covered.push(item.food);
      NUTRIENTS.forEach(function (n) {
        if (values[n.key] == null) return;
        totals[n.key] = (totals[n.key] || 0) + values[n.key] * item.grams / 100;
      });
    });

    return { totals: totals, covered: covered, uncovered: uncovered };
  }

  function dosedRows(found) {
    return Object.keys(found)
      .filter(function (id) { return TRAITS[id].dose; })
      .map(function (id) {
        return { label: TRAITS[id].label, servings: found[id].servings, count: found[id].count };
      })
      .sort(function (a, b) { return b.servings - a.servings; });
  }

  // ---- Wording -----------------------------------------------------------
  const COUNT_WORDS = ["no", "one", "two", "three", "four", "five", "six",
    "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen"];

  function countWord(n) { return COUNT_WORDS[n] || String(n); }

  function ingredients(n) { return n + (n === 1 ? " ingredient" : " ingredients"); }

  function joinList(parts) {
    if (parts.length === 1) return parts[0];
    return parts.slice(0, -1).join(", ") + " and " + parts[parts.length - 1];
  }

  // Naming ten absent allergens one by one buries the four that are there.
  const NAME_ABSENT_UP_TO = 4;

  function absentSentence(absent) {
    if (!absent.length) return "";
    if (absent.length <= NAME_ABSENT_UP_TO) {
      return " " + joinList(absent) + (absent.length === 1 ? " is" : " are") +
        " not in this meal.";
    }
    return " The other " + countWord(absent.length) + " are not in this meal.";
  }

  function familySentence(family, found) {
    const present = family.types
      .filter(function (id) { return found[id]; })
      .map(function (id) {
        return { label: TRAITS[id].label, count: found[id].count };
      })
      .sort(function (a, b) { return b.count - a.count || a.label.localeCompare(b.label); });

    const absent = family.types.filter(function (id) { return !found[id]; })
      .map(function (id) { return TRAITS[id].label; });

    // The umbrella can sit on a food whose mechanism has no subtype of its
    // own — an irritant that is neither capsaicin nor caffeine, say.
    const broadOnly = family.broad && found[family.broad] && !present.length;
    if (!present.length && !broadOnly) return null;

    const total = family.types.length;
    let text;

    if (broadOnly) {
      text = "This meal carries an " + family.noun + " from " +
        ingredients(found[family.broad].count) + ", by a mechanism with no type of " +
        "its own. None of the " + countWord(total) + " types tracked here are in it.";
    } else if (present.length === 1) {
      text = "One of the " + countWord(total) + " " + family.noun +
        " types tracked here is in this meal: " + present[0].label + ", from " +
        ingredients(present[0].count) + "." + absentSentence(absent);
    } else {
      const rest = present.slice(1).map(function (row) {
        return row.label + " (" + row.count + ")";
      });
      text = countWord(present.length) + " of the " + countWord(total) + " " +
        family.noun + " types tracked here are in this meal. " + present[0].label +
        " comes from the most ingredients (" + present[0].count + "), then " +
        joinList(rest) + "." + absentSentence(absent);
      text = text.charAt(0).toUpperCase() + text.slice(1);
    }

    return { title: family.title, text: text, articleId: family.articleId };
  }

  function singleSentence(traitId, found, totalItems) {
    if (!found[traitId]) return null;
    return {
      title: TRAITS[traitId].label,
      text: "in " + found[traitId].count + " of the " + totalItems + " ingredients.",
      articleId: TRAITS[traitId].articleId || null
    };
  }

  function totalGrams(items) {
    return items.reduce(function (sum, item) { return sum + item.grams; }, 0);
  }

  function fmt(n) { return (Math.round(n * 10) / 10).toString(); }

  // ---- The builder -------------------------------------------------------
  function renderBuilder() {
    builder.innerHTML = "";

    meals.forEach(function (meal, index) {
      const card = document.createElement("section");
      card.className = "mealCard";

      const head = document.createElement("div");
      head.className = "mealCardHead";

      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.className = "mealName";
      nameInput.value = meal.name;
      nameInput.setAttribute("aria-label", "Meal name");
      nameInput.addEventListener("input", function () { meal.name = nameInput.value; });
      nameInput.addEventListener("change", render);
      head.appendChild(nameInput);

      if (meals.length > 1) {
        const removeMeal = document.createElement("button");
        removeMeal.type = "button";
        removeMeal.className = "mealRemove";
        removeMeal.textContent = "Remove meal";
        removeMeal.addEventListener("click", function () {
          meals.splice(index, 1);
          render();
        });
        head.appendChild(removeMeal);
      }

      card.appendChild(head);

      if (!meal.items.length) {
        const empty = document.createElement("p");
        empty.className = "mealEmpty";
        empty.textContent = "No foods yet.";
        card.appendChild(empty);
      } else {
        const list = document.createElement("ul");
        list.className = "mealItems";
        meal.items.forEach(function (item, itemIndex) {
          const li = document.createElement("li");

          const name = document.createElement("span");
          name.className = "mealItemName";
          name.textContent = item.food;
          li.appendChild(name);

          const grams = document.createElement("input");
          grams.type = "number";
          grams.min = "1";
          grams.className = "mealItemGrams";
          grams.value = item.grams;
          grams.setAttribute("aria-label", "Grams of " + item.food);
          grams.addEventListener("change", function () {
            const value = parseInt(grams.value, 10);
            item.grams = value > 0 ? value : 1;
            render();
          });
          li.appendChild(grams);

          const unit = document.createElement("span");
          unit.className = "mealItemUnit";
          unit.textContent = "g";
          li.appendChild(unit);

          // How the weight compares with the serving this food is measured at.
          // Appended last: it takes a full row, so anything after it would
          // be pushed onto a third line.
          const food = FOODS[item.food];

          const remove = document.createElement("button");
          remove.type = "button";
          remove.className = "mealItemRemove";
          remove.setAttribute("aria-label", "Remove " + item.food);
          remove.textContent = "×";
          remove.addEventListener("click", function () {
            meal.items.splice(itemIndex, 1);
            render();
          });
          li.appendChild(remove);

          const servings = document.createElement("span");
          servings.className = "mealItemServings";
          servings.textContent = food && food.portion
            ? "(" + fmt(item.grams / food.portion) + " × " + food.portion + "g serving)"
            : "";
          li.appendChild(servings);

          list.appendChild(li);
        });
        card.appendChild(list);
      }

      // ---- Add a food to this meal
      const addRow = document.createElement("div");
      addRow.className = "mealAddRow";

      const foodInput = document.createElement("input");
      foodInput.type = "text";
      foodInput.className = "mealAddFood";
      foodInput.setAttribute("list", "foodOptions");
      foodInput.placeholder = "Food";
      foodInput.setAttribute("aria-label", "Food to add");
      addRow.appendChild(foodInput);

      const gramsInput = document.createElement("input");
      gramsInput.type = "number";
      gramsInput.min = "1";
      gramsInput.className = "mealAddGrams";
      gramsInput.placeholder = "g";
      gramsInput.setAttribute("aria-label", "Grams");
      addRow.appendChild(gramsInput);

      const addButton = document.createElement("button");
      addButton.type = "button";
      addButton.className = "button2 mealAddButton";
      addButton.textContent = "Add";
      addRow.appendChild(addButton);

      function addFood() {
        const name = foodInput.value.trim();
        if (!name) return;
        const food = FOODS[name];
        if (!food) {
          showError('"' + name + '" is not in this database. Start typing to pick from the list.');
          return;
        }
        if (!hasFigures(name)) {
          showError('"' + name + '" has no nutrient figures on file, so a meal holding it ' +
            "could not be totalled. It is still in the main app and in Foods without.");
          return;
        }
        // No weight given: fall back to the food's own standard serving.
        const typed = parseInt(gramsInput.value, 10);
        const grams = typed > 0 ? typed : food.portion;
        showError("");
        meal.items.push({ food: name, grams: grams });
        render();
      }

      addButton.addEventListener("click", addFood);
      [foodInput, gramsInput].forEach(function (input) {
        input.addEventListener("keydown", function (e) {
          if (e.key === "Enter") { e.preventDefault(); addFood(); }
        });
      });

      card.appendChild(addRow);

      const hint = document.createElement("p");
      hint.className = "mealAddHint";
      hint.textContent = "Leave the weight blank to use the food's standard serving.";
      addRow.appendChild(hint);

      builder.appendChild(card);
    });
  }

  // ---- The analysis ------------------------------------------------------
  function renderAnalysis(container, title, items) {
    const section = document.createElement("section");
    section.className = "mealAnalysis";

    const h2 = document.createElement("h2");
    h2.textContent = title;
    section.appendChild(h2);

    if (!items.length) {
      const p = document.createElement("p");
      p.className = "mealEmpty";
      p.textContent = "No foods in this meal yet.";
      section.appendChild(p);
      container.appendChild(section);
      return;
    }

    const weight = document.createElement("p");
    weight.className = "mealWeight";
    weight.textContent = items.length + (items.length === 1 ? " food, " : " foods, ") +
      totalGrams(items) + "g in total";
    section.appendChild(weight);

    /* What the meal was, in words. Only on paper: on screen the builder above
       already shows it, but the builder is a form and does not print, so
       without this a printout would report totals for a meal it never names. */
    const ingredientLine = document.createElement("p");
    ingredientLine.className = "mealIngredients printOnly";
    ingredientLine.textContent = items.map(function (item) {
      return item.food + " " + item.grams + "g";
    }).join(" · ");
    section.appendChild(ingredientLine);

    const found = tally(items);

    // ---- What the meal actually contains, in grams
    if (haveNutrition()) {
      const n = nutrientTotals(items);

      const h3n = document.createElement("h3");
      h3n.textContent = "In this meal";
      section.appendChild(h3n);

      if (!n.covered.length) {
        const p = document.createElement("p");
        p.className = "mealEmpty";
        p.textContent = "None of these foods has figures on file, so this meal cannot be " +
          "totalled in grams.";
        section.appendChild(p);
      } else {
        const table = document.createElement("table");
        table.className = "mealTable";
        const header = document.createElement("tr");
        ["Nutrient", "Grams"].forEach(function (text) {
          const th = document.createElement("th");
          th.textContent = text;
          header.appendChild(th);
        });
        table.appendChild(header);

        NUTRIENTS.forEach(function (nutrient) {
          if (n.totals[nutrient.key] == null) return;
          const tr = document.createElement("tr");
          const label = document.createElement("th");
          label.textContent = nutrient.label;
          tr.appendChild(label);
          const value = document.createElement("td");
          value.textContent = fmt(n.totals[nutrient.key]) + " g";
          tr.appendChild(value);
          table.appendChild(tr);
        });

        const wrap = document.createElement("div");
        wrap.className = "tableScroll";
        wrap.appendChild(table);
        section.appendChild(wrap);

        const coverage = document.createElement("p");
        coverage.className = "mealCoverage";
        coverage.textContent = n.uncovered.length
          ? "From " + n.covered.length + " of the " + items.length + " foods. " +
            joinList(n.uncovered) + (n.uncovered.length === 1 ? " has" : " have") +
            " no figures on file, so nothing above counts " +
            (n.uncovered.length === 1 ? "it" : "them") + " — the real totals are higher."
          : "From all " + items.length + " foods.";
        section.appendChild(coverage);
      }
    }

    // ---- Measured by amount
    const h3a = document.createElement("h3");
    h3a.textContent = "Measured by amount";
    section.appendChild(h3a);

    const rows = dosedRows(found);
    if (!rows.length) {
      const p = document.createElement("p");
      p.className = "mealEmpty";
      p.textContent = "Nothing in this meal carries an amount-based trait.";
      section.appendChild(p);
    } else {
      const table = document.createElement("table");
      table.className = "mealTable";
      const header = document.createElement("tr");
      ["Trait", "Servings", "From"].forEach(function (text) {
        const th = document.createElement("th");
        th.textContent = text;
        header.appendChild(th);
      });
      table.appendChild(header);

      rows.forEach(function (row) {
        const tr = document.createElement("tr");
        const label = document.createElement("th");
        label.textContent = row.label;
        tr.appendChild(label);

        const servings = document.createElement("td");
        servings.textContent = fmt(row.servings);
        tr.appendChild(servings);

        const from = document.createElement("td");
        from.textContent = ingredients(row.count);
        tr.appendChild(from);

        table.appendChild(tr);
      });

      const wrap = document.createElement("div");
      wrap.className = "tableScroll";
      wrap.appendChild(table);
      section.appendChild(wrap);
    }

    // ---- Present in the meal, family by family
    const h3b = document.createElement("h3");
    h3b.textContent = "Present in the meal";
    section.appendChild(h3b);

    const blocks = [];
    FAMILIES.forEach(function (family) {
      const block = familySentence(family, found);
      if (block) blocks.push(block);
    });
    SINGLES.forEach(function (traitId) {
      const block = singleSentence(traitId, found, items.length);
      if (block) blocks.push(block);
    });

    if (!blocks.length) {
      const p = document.createElement("p");
      p.className = "mealEmpty";
      p.textContent = "Nothing in this meal carries a categorical trait.";
      section.appendChild(p);
    } else {
      const list = document.createElement("ul");
      list.className = "mealFamilyList";
      blocks.forEach(function (block) {
        const li = document.createElement("li");

        const strong = document.createElement("strong");
        strong.textContent = block.title + ": ";
        li.appendChild(strong);

        li.appendChild(document.createTextNode(block.text + " "));

        if (block.articleId) {
          const link = document.createElement("a");
          link.href = "articles.html#" + block.articleId;
          link.className = "mealFamilyLink noPrint";
          link.textContent = "Read more →";
          li.appendChild(link);
        }

        list.appendChild(li);
      });
      section.appendChild(list);
    }

    const note = document.createElement("p");
    note.className = "traitFoodsNote";
    note.textContent = "Servings are servings of trait-carrying food, not grams of anything. " +
      "Fat 3.4 means this meal holds as much fat-tagged food as 3.4 standard servings — it is " +
      "not 3.4 times a threshold, and not a nutrient total. Under \"present\", how prominent a " +
      "trait is means how many ingredients carry it, not how much of it is there: those traits " +
      "have no amount to add up, and a small amount of an allergen is still an amount. To see " +
      "which food carries what, use the main app.";
    section.appendChild(note);

    container.appendChild(section);
  }

  function renderResults() {
    results.innerHTML = "";

    meals.forEach(function (meal) {
      renderAnalysis(results, meal.name, meal.items);
    });

    // A combined view only says something the single meals do not once there
    // is more than one meal with food in it.
    const filled = meals.filter(function (meal) { return meal.items.length; });
    if (filled.length > 1) {
      const all = [];
      filled.forEach(function (meal) { all.push.apply(all, meal.items); });
      renderAnalysis(results, "All meals together", all);
    }
  }

  function render() {
    renderBuilder();
    renderResults();
  }

  // ---- Buttons -----------------------------------------------------------
  document.getElementById("addMealButton").addEventListener("click", function () {
    meals.push({ name: "Meal " + (meals.length + 1), items: [] });
    render();
  });

  document.getElementById("clearMealsButton").addEventListener("click", function () {
    meals = [{ name: "Meal 1", items: [] }];
    showError("");
    render();
  });

  document.getElementById("printMealsButton").addEventListener("click", function () {
    window.print();
  });

  document.getElementById("saveMealsButton").addEventListener("click", function () {
    showError("");
    SaveLoad.save("meals", { meals: meals }, "meals");
  });

  document.getElementById("loadMealsButton").addEventListener("click", function () {
    SaveLoad.load("meals", function (data) {
      if (!Array.isArray(data.meals) || !data.meals.length) {
        showError("That file holds no meals.");
        return;
      }
      // Keep only what this tool understands, and only foods it still has.
      const dropped = [];
      meals = data.meals.map(function (meal, index) {
        const items = (meal.items || []).filter(function (item) {
          if (FOODS[item.food] && hasFigures(item.food) && item.grams > 0) return true;
          dropped.push(item.food);
          return false;
        }).map(function (item) {
          return { food: item.food, grams: Math.round(item.grams) };
        });
        return { name: meal.name || "Meal " + (index + 1), items: items };
      });
      showError(dropped.length
        ? "Loaded, but " + dropped.length + " food(s) were left out — no longer in the " +
          "database, or with no nutrient figures on file: " + dropped.join(", ")
        : "");
      render();
    }, showError);
  });

  render();
})();
