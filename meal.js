/* =========================================================================
   meal.js — drives meal.html

   A meal is a list of { food, grams }. The analysis splits traits the same
   way the rest of the site does:

     - Amount-based traits (TRAITS[id].dose) are summed. A food contributes
       its weight divided by its own standard serving, so 250g of a food
       served in 125g portions counts as 2 servings.

     - FODMAPs are the exception among the categorical traits, because Monash
       publishes a serving size for them. fodmap-data.js holds the largest
       serving of each food that still rates low, and that decides whether an
       ingredient counts at the weight you gave it — not how much it counts.
       A traffic light is not a quantity. See fodmapStanding below.

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


  function haveNutrition() {
    return typeof NUTRITION !== "undefined" && Object.keys(NUTRITION).length > 0;
  }

  // ---- State -------------------------------------------------------------
  // Kept in this browser between visits, so a trip to the app and back does
  // not cost you the meal — see session.js.
  let meals = [{ name: "Meal 1", items: [] }];

  // A tap in the picker has to land somewhere, so one meal is always the
  // active one. It is the last one touched, and named above the picker.
  let activeMeal = 0;

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

  /* ---- FODMAPs: a threshold, not a sum -----------------------------------
     The only categorical family with a published amount, and the amount is
     coarser than it looks. Monash rates a stated serving low, moderate or
     high; it does not publish grams of fructans per 100g. So the honest use
     of the figure is a threshold, not a quantity: at or under the serving
     Monash rates low, this food is not what is loading the meal, and over it,
     it is. Dividing to two decimals would dress a traffic light up as a
     measurement, and only some foods have even that.

     So FODMAPs are reported exactly like the other categorical families —
     which types are present, from how many ingredients — with the amount
     deciding which ingredients count. Foods with no serving on file, and
     foods with no low serving at any amount (onion, garlic), always count;
     both are named so it is clear which is which.

     What a threshold cannot show is stacking, and stacking is real: low
     servings are set one food at a time. That is said in words rather than
     added up, because adding it up would need the grams the source does not
     give. */
  const FODMAP_TYPES = {};
  Object.keys(TRAITS).forEach(function (id) {
    if (TRAITS[id].group === "FODMAPs") FODMAP_TYPES[id] = true;
  });

  function haveServes() {
    return typeof FODMAP_SERVES !== "undefined" && Object.keys(FODMAP_SERVES).length > 0;
  }

  function fodmapStanding(items) {
    const counts = {};      // trait id -> ingredients counting towards it
    const over = [];        // weighed out above the serving rated low
    const within = [];      // at or under it, so not counted
    const noServe = [];     // no amount rates low
    const untested = [];    // no serving on file

    items.forEach(function (item) {
      const food = FOODS[item.food];
      if (!food) return;

      const types = food.traits.filter(function (id) { return FODMAP_TYPES[id]; });
      if (!types.length && food.traits.indexOf("fodmaps") < 0) return;

      const entry = FODMAP_SERVES[item.food];
      let counting = true;

      if (!entry) untested.push(item.food);
      else if (!entry.low) noServe.push(item.food);
      else if (item.grams > entry.low) over.push(item.food + " " + item.grams + "g, low at " + entry.low + "g");
      else { within.push(item.food + " " + item.grams + "g, low at " + entry.low + "g"); counting = false; }

      /* A food over its serving counts towards every subtype it carries. The
         serving was set by whichever one was limiting and the traffic light
         does not say which, so this overstates the others — but only as far
         as calling them present, which is what the rest of this section does
         to every categorical trait anyway. */
      if (counting) {
        // The umbrella follows the threshold too, or a meal could show no
        // subtype and still read as carrying FODMAPs from three ingredients.
        counts.fodmaps = (counts.fodmaps || 0) + 1;
        types.forEach(function (id) { counts[id] = (counts[id] || 0) + 1; });
      }
    });

    return { counts: counts, over: over, within: within, noServe: noServe, untested: untested };
  }

  /* Why each food counted or did not. Printed under the FODMAP sentence,
     because "counted at the amount you weighed out" is only useful if you can
     see which amounts were which. */
  function fodmapNotes(standing) {
    const notes = [];

    if (standing.within.length) {
      notes.push("Not counted, within the serving Monash rates low: " +
        joinList(standing.within) + ".");
    }
    if (standing.noServe.length) {
      notes.push(joinList(standing.noServe) + (standing.noServe.length === 1 ? " has" : " have") +
        " no low serving at any amount, so " +
        (standing.noServe.length === 1 ? "it counts" : "they count") + " whatever the weight.");
    }
    if (standing.untested.length) {
      notes.push("No serving on file for " + joinList(standing.untested) + ", so " +
        (standing.untested.length === 1 ? "it is" : "they are") +
        " counted on the tag alone, whatever the weight.");
    }

    // What a threshold cannot show, and only worth saying when there is
    // something to stack: two or more FODMAP foods on the same plate.
    const carrying = standing.over.length + standing.within.length +
      standing.noServe.length + standing.untested.length;
    if (carrying > 1) {
      notes.push("Each serving is rated low on its own, so several in one meal can still " +
        "add up — a plate of foods each within its own serving is not the same as one " +
        "low-FODMAP food.");
    }

    return notes;
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

  /* `counts` overrides how many ingredients count towards each type, and is
     how the FODMAP family gets its threshold: a food weighed out at or under
     the serving Monash rates low is in the meal but not counted here. Every
     other family passes nothing and counts plain presence. */
  function familySentence(family, found, counts) {
    function countFor(id) {
      if (counts) return counts[id] || 0;
      return found[id] ? found[id].count : 0;
    }

    const present = family.types
      .filter(function (id) { return countFor(id) > 0; })
      .map(function (id) {
        return { label: TRAITS[id].label, count: countFor(id) };
      })
      .sort(function (a, b) { return b.count - a.count || a.label.localeCompare(b.label); });

    const absent = family.types.filter(function (id) { return countFor(id) === 0; })
      .map(function (id) { return TRAITS[id].label; });

    // The umbrella can sit on a food whose mechanism has no subtype of its
    // own — an irritant that is neither capsaicin nor caffeine, say.
    const broadOnly = !counts && family.broad && found[family.broad] && !present.length;
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
      card.addEventListener("click", function () {
        if (activeMeal === index) return;
        activeMeal = index;
        render();
      });

      const head = document.createElement("div");
      head.className = "mealCardHead";

      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.className = "mealName";
      if (index === activeMeal) card.classList.add("mealCard--active");
      nameInput.value = meal.name;
      nameInput.setAttribute("aria-label", "Meal name");
      nameInput.addEventListener("input", function () { meal.name = nameInput.value; });
      nameInput.addEventListener("change", render);
      head.appendChild(nameInput);

      /* The question this tool gets asked is "what changes if I leave the
         cream out", which means the same meal twice with one thing different.
         Typing it in again is the slow way to ask. */
      const copyMeal = document.createElement("button");
      copyMeal.type = "button";
      copyMeal.className = "mealRemove";
      copyMeal.textContent = "Duplicate";
      copyMeal.addEventListener("click", function (e) {
        e.stopPropagation();
        meals.splice(index + 1, 0, {
          name: meal.name + " (copy)",
          items: meal.items.map(function (item) {
            return { food: item.food, grams: item.grams };
          })
        });
        activeMeal = index + 1;
        render();
      });
      head.appendChild(copyMeal);

      if (meals.length > 1) {
        const removeMeal = document.createElement("button");
        removeMeal.type = "button";
        removeMeal.className = "mealRemove";
        removeMeal.textContent = "Remove";
        removeMeal.addEventListener("click", function (e) {
          e.stopPropagation();
          meals.splice(index, 1);
          if (activeMeal >= meals.length) activeMeal = meals.length - 1;
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

      builder.appendChild(card);
    });
  }

  function addFood(name) {
    const food = FOODS[name];
    if (!food) return;
    if (!hasFigures(name)) {
      showError('"' + name + '" has no nutrient figures on file, so a meal holding it ' +
        "could not be totalled. It is still in the main app and in Foods without.");
      return;
    }
    showError("");
    const meal = meals[activeMeal] || meals[0];
    const existing = meal.items.filter(function (item) { return item.food === name; })[0];
    // Tapping the same food twice means a second helping, not a duplicate row.
    if (existing) existing.grams += food.portion;
    else meal.items.push({ food: name, grams: food.portion });
    render();
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

    // FODMAPs are the one family where the amount decides whether an
    // ingredient counts. Everything else counts on presence alone.
    const standing = haveServes() ? fodmapStanding(items) : null;

    const blocks = [];
    FAMILIES.forEach(function (family) {
      if (standing && family.broad === "fodmaps") {
        let block = familySentence(family, found, standing.counts);
        /* Every FODMAP food weighed out within its own low serving. Worth a
           block of its own: "you had FODMAP foods and none of them is above
           its serving" is the answer, and silence is not. */
        if (!block && standing.within.length) {
          block = {
            title: family.title, articleId: family.articleId,
            text: "No FODMAP type is counted in this meal — every food carrying one is " +
              "within the serving Monash rates low."
          };
        }
        if (block) { block.notes = fodmapNotes(standing); blocks.push(block); }
        return;
      }
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

        (block.notes || []).forEach(function (text) {
          const p = document.createElement("p");
          p.className = "mealCoverage";
          p.textContent = text;
          li.appendChild(p);
        });

        list.appendChild(li);
      });
      section.appendChild(list);
    }

    const note = document.createElement("p");
    note.className = "traitFoodsNote";
    note.textContent = "Under \"measured by amount\", servings are servings of trait-carrying " +
      "food, not grams of anything. Fat 3.4 means this meal holds as much fat-tagged food as " +
      "3.4 standard servings — it is not 3.4 times a threshold, and not a nutrient total. " +
      "Under \"present\", how prominent a " +
      "trait is means how many ingredients carry it, not how much of it is there: those traits " +
      "have no amount to add up, and a small amount of an allergen is still an amount. FODMAPs " +
      "are the exception — Monash rates a stated serving low, so a food weighed out within its " +
      "serving is in the meal without being counted there. To see which food carries what, use " +
      "the main app.";
    section.appendChild(note);

    container.appendChild(section);
  }

  /* ---- Side by side ------------------------------------------------------
     Rows are what varies, columns are the meals. Nutrients in grams, then
     the amount-based traits in servings, then a tick for every categorical
     trait any of the meals carries — that last table is where "I left the
     cream out" actually shows. */
  function comparisonTable(headings, rows) {
    const table = document.createElement("table");
    table.className = "mealTable mealCompare";

    const head = document.createElement("tr");
    headings.forEach(function (text) {
      const th = document.createElement("th");
      th.textContent = text;
      head.appendChild(th);
    });
    table.appendChild(head);

    rows.forEach(function (row) {
      const tr = document.createElement("tr");
      const label = document.createElement("th");
      label.textContent = row.label;
      tr.appendChild(label);
      row.cells.forEach(function (cell) {
        const td = document.createElement("td");
        td.textContent = cell;
        if (cell === "—") td.className = "mealCompareAbsent";
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });

    const wrap = document.createElement("div");
    wrap.className = "tableScroll";
    wrap.appendChild(table);
    return wrap;
  }

  function renderComparison(container, filled) {
    const section = document.createElement("section");
    section.className = "mealAnalysis";

    const h2 = document.createElement("h2");
    h2.textContent = "Side by side";
    section.appendChild(h2);

    const headings = ["", ].concat(filled.map(function (meal) { return meal.name; }));
    const tallies = filled.map(function (meal) { return tally(meal.items); });

    const weights = {
      label: "Total weight",
      cells: filled.map(function (meal) { return totalGrams(meal.items) + " g"; })
    };

    // ---- Nutrients, where we have figures for the whole meal
    if (haveNutrition()) {
      const totals = filled.map(function (meal) { return nutrientTotals(meal.items); });
      const rows = [weights];
      NUTRIENTS.forEach(function (nutrient) {
        const cells = totals.map(function (t) {
          return t.totals[nutrient.key] == null ? "—" : fmt(t.totals[nutrient.key]) + " g";
        });
        if (cells.some(function (c) { return c !== "—"; })) {
          rows.push({ label: nutrient.label, cells: cells });
        }
      });

      const h3 = document.createElement("h3");
      h3.textContent = "Nutrients";
      section.appendChild(h3);
      section.appendChild(comparisonTable(headings, rows));

      const short = totals.filter(function (t) { return t.uncovered.length; });
      if (short.length) {
        const note = document.createElement("p");
        note.className = "mealCoverage";
        note.textContent = "Some foods have no figures on file, so those columns are short: " +
          joinList(short.reduce(function (all, t) { return all.concat(t.uncovered); }, [])) + ".";
        section.appendChild(note);
      }
    } else {
      section.appendChild(comparisonTable(headings, [weights]));
    }

    // ---- Amount-based traits, in servings
    const dosedIds = Object.keys(TRAITS).filter(function (id) {
      return TRAITS[id].dose && tallies.some(function (t) { return t[id]; });
    });
    if (dosedIds.length) {
      const h3 = document.createElement("h3");
      h3.textContent = "Measured by amount, in servings";
      section.appendChild(h3);
      section.appendChild(comparisonTable(headings, dosedIds.map(function (id) {
        return {
          label: TRAITS[id].label,
          cells: tallies.map(function (t) { return t[id] ? fmt(t[id].servings) : "—"; })
        };
      })));
    }

    /* ---- Categorical traits, present or not
       FODMAP subtypes go through the same threshold as they do in a single
       meal's analysis, so leaving out the onion — or halving the avocado —
       changes the column here rather than only the grams above. */
    const standings = haveServes()
      ? filled.map(function (meal) { return fodmapStanding(meal.items); })
      : null;

    function countIn(index, id) {
      if (standings && (FODMAP_TYPES[id] || id === "fodmaps")) {
        return standings[index].counts[id] || 0;
      }
      return tallies[index][id] ? tallies[index][id].count : 0;
    }

    const presentIds = Object.keys(TRAITS).filter(function (id) {
      if (TRAITS[id].dose && !FODMAP_TYPES[id]) return false;
      return filled.some(function (_, i) { return countIn(i, id) > 0; });
    });
    if (presentIds.length) {
      const h3 = document.createElement("h3");
      h3.textContent = "Present in the meal";
      section.appendChild(h3);
      section.appendChild(comparisonTable(headings, presentIds.map(function (id) {
        return {
          label: TRAITS[id].label,
          cells: filled.map(function (_, i) {
            const n = countIn(i, id);
            return n ? "in " + ingredients(n) : "—";
          })
        };
      })));
    }

    const note = document.createElement("p");
    note.className = "traitFoodsNote";
    note.textContent = "The meals are compared, not added together: two meals side by side " +
      "answer what changed, which a total would hide. Servings are servings of " +
      "trait-carrying food, not grams of anything.";
    section.appendChild(note);

    container.appendChild(section);
  }

  function renderResults() {
    results.innerHTML = "";

    meals.forEach(function (meal) {
      renderAnalysis(results, meal.name, meal.items);
    });

    // Two meals are built to be compared, not added up: the question is what
    // changed, and a total hides exactly that.
    const filled = meals.filter(function (meal) { return meal.items.length; });
    if (filled.length > 1) renderComparison(results, filled);
  }

  function render() {
    Session.set("meals", meals);
    renderBuilder();
    renderResults();
    const target = document.getElementById("mealPickerTarget");
    if (target) target.textContent = (meals[activeMeal] || meals[0]).name || "this meal";
  }

  // ---- Buttons -----------------------------------------------------------
  document.getElementById("addMealButton").addEventListener("click", function () {
    meals.push({ name: "Meal " + (meals.length + 1), items: [] });
    activeMeal = meals.length - 1;
    render();
  });

  document.getElementById("clearMealsButton").addEventListener("click", function () {
    meals = [{ name: "Meal 1", items: [] }];
    activeMeal = 0;
    showError("");
    render();
  });

  document.getElementById("printMealsButton").addEventListener("click", function () {
    window.print();
  });

  document.getElementById("saveMealsButton").addEventListener("click", function () {
    showError("");
    SaveLoad.save("session", Session.snapshot(), "food-intolerance-guide");
  });

  document.getElementById("loadMealsButton").addEventListener("click", function () {
    SaveLoad.load("session", function (data) {
      Session.restore(data);
      if (!Array.isArray(data.meals) || !data.meals.length) {
        showError("That file holds no meals. Anything else in it has been restored.");
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

  /* Only foods with figures are offered: a meal is reported in grams, and a
     food with no numbers would sit in the list looking like it counted. */
  const foodPicker = FoodPicker.create({
    container: document.getElementById("foodPicker"),
    searchInput: document.getElementById("search"),
    mode: "pick",
    include: function (food) { return hasFigures(food.name); },
    onPick: addFood
  });

  document.getElementById("showAllButton").addEventListener("click", function () {
    document.getElementById("search").value = "";
    foodPicker.clearSearch();
    foodPicker.showAll();
  });

  const remembered = Session.get("meals");
  if (Array.isArray(remembered) && remembered.length) meals = remembered;

  render();
})();
