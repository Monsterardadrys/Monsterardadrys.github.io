/* =========================================================================
   meal.js — drives meal.html

   A meal is a list of { food, grams }. The analysis splits traits the same
   way the rest of the site does:

     - Amount-based traits (TRAITS[id].dose) are summed. A food contributes
       its weight divided by its own standard serving, so 250g of a food
       served in 125g portions counts as 2 servings.

     - Everything else is categorical. An allergen is present or it is not,
       and 2g of peanut is still peanut. Those are listed, never scored.

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

  Object.keys(FOODS).sort().forEach(function (name) {
    const option = document.createElement("option");
    option.value = name;
    datalist.appendChild(option);
  });

  // ---- State -------------------------------------------------------------
  let meals = [{ name: "Meal 1", items: [] }];

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = !message;
  }

  // ---- Analysis ----------------------------------------------------------
  // Servings of trait-carrying food in a meal, plus who contributed.
  function analyse(items) {
    const found = {};
    items.forEach(function (item) {
      const food = FOODS[item.food];
      if (!food) return;
      const servings = food.portion ? item.grams / food.portion : 0;
      food.traits.forEach(function (traitId) {
        if (!TRAITS[traitId]) return;
        const entry = found[traitId] || (found[traitId] = { servings: 0, foods: [] });
        entry.servings += servings;
        entry.foods.push(item.food + " " + item.grams + "g");
      });
    });

    const dosed = [];
    const present = [];
    Object.keys(found).forEach(function (traitId) {
      const row = {
        traitId: traitId,
        label: TRAITS[traitId].label,
        servings: found[traitId].servings,
        foods: found[traitId].foods
      };
      (TRAITS[traitId].dose ? dosed : present).push(row);
    });

    dosed.sort(function (a, b) { return b.servings - a.servings; });
    present.sort(function (a, b) {
      return b.foods.length - a.foods.length || a.label.localeCompare(b.label);
    });

    return { dosed: dosed, present: present };
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

    const result = analyse(items);

    // ---- Amount-based
    const h3a = document.createElement("h3");
    h3a.textContent = "Measured by amount";
    section.appendChild(h3a);

    if (!result.dosed.length) {
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

      result.dosed.forEach(function (row) {
        const tr = document.createElement("tr");
        const label = document.createElement("th");
        label.textContent = row.label;
        tr.appendChild(label);

        const servings = document.createElement("td");
        servings.textContent = fmt(row.servings);
        tr.appendChild(servings);

        const from = document.createElement("td");
        from.className = "mealFrom";
        from.textContent = row.foods.join(", ");
        tr.appendChild(from);

        table.appendChild(tr);
      });

      const wrap = document.createElement("div");
      wrap.className = "tableScroll";
      wrap.appendChild(table);
      section.appendChild(wrap);
    }

    // ---- Categorical
    const h3b = document.createElement("h3");
    h3b.textContent = "Present in the meal";
    section.appendChild(h3b);

    if (!result.present.length) {
      const p = document.createElement("p");
      p.className = "mealEmpty";
      p.textContent = "Nothing in this meal carries a categorical trait.";
      section.appendChild(p);
    } else {
      const ul = document.createElement("ul");
      ul.className = "mealPresentList";
      result.present.forEach(function (row) {
        const li = document.createElement("li");
        const strong = document.createElement("strong");
        strong.textContent = row.label;
        li.appendChild(strong);
        li.appendChild(document.createTextNode(" — " + row.foods.join(", ")));
        ul.appendChild(li);
      });
      section.appendChild(ul);
    }

    const note = document.createElement("p");
    note.className = "traitFoodsNote";
    note.textContent = "Servings are servings of trait-carrying food, not grams of anything. " +
      "Fat 3.4 means this meal holds as much fat-tagged food as 3.4 standard servings — it is not " +
      "3.4 times a threshold, and not a nutrient total. The traits under \"present\" have no " +
      "amount to add up: an allergen is in the meal or it is not, and a small amount is still an " +
      "amount.";
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
          if (FOODS[item.food] && item.grams > 0) return true;
          dropped.push(item.food);
          return false;
        }).map(function (item) {
          return { food: item.food, grams: Math.round(item.grams) };
        });
        return { name: meal.name || "Meal " + (index + 1), items: items };
      });
      showError(dropped.length
        ? "Loaded, but " + dropped.length + " food(s) are no longer in the database: " + dropped.join(", ")
        : "");
      render();
    }, showError);
  });

  render();
})();
