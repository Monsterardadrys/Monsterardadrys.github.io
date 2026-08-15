/* =========================================================================
   meal.js — drives meal.html

   A meal is a list of { food, grams }. The analysis splits traits the same
   way the rest of the site does:

     - Amount-based traits (TRAITS[id].dose) are reported in real grams
       wherever nutrition-data.js has the figure — fat, protein, fiber,
       alcohol, and the bile-stimulating load derived from fat and protein.
       Salicylates and lactose have no figure, so those two are counted in
       helpings and said in a sentence that explains the unit.

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

   WHY HELPINGS ARE NEARLY GONE. Every amount-based trait was once reported
   as a count of standard servings of tagged food, in a table. It read as a
   multiple of the threshold and was not one: "Fat 2" meant two servings of
   fat-tagged food, each AT LEAST the dose and possibly far over, so it could
   be 13g of fat or 80g. Now that the grams exist, they are used, and the two
   traits with no gram figure get a sentence that names the unit instead of a
   bare number in a column. Do not reintroduce the table.
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
      FOODS[food.name] = { name: food.name, sv: food.sv, portion: food.portion, traits: food.traits, category: I18N.pick(category, "label") };
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
  let meals = [{ name: I18N.t("meal.untitled", { n: 1 }), items: [] }];

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
      title: I18N.pick(section, "title"),
      noun: section.noun || section.title.toLowerCase(),
      svNoun: section.svNoun || (section.sv || section.title).toLowerCase(),
      svNounTypes: section.svNounTypes || (section.sv || section.title).toLowerCase(),
      svGender: section.svGender || "en",
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
    { key: "fat", label: "Fat", sv: "Fett" },
    { key: "protein", label: "Protein", sv: "Protein" },
    { key: "carbs", label: "Carbohydrate", sv: "Kolhydrat" },
    { key: "sugars", label: "Sugars", sv: "Socker" },
    { key: "fiber", label: "Fiber", sv: "Fiber" },
    // Only worth a row when there is any. Most meals have none.
    { key: "alcohol", label: "Alcohol", sv: "Alkohol", whenAbove: 0 },
    // Not in the file until the build is re-run against an export carrying
    // the column — see tools/lmv-core.js. Absent until then, and everything
    // reading it copes with that.
    { key: "water", label: "Water", sv: "Vatten" }
  ];

  /* The bile-stimulating load is not a nutrient anyone measures — it is the
     rule this database tags foods by, worked out over the whole meal: fat,
     counting protein at a fifth of its weight, because protein triggers the
     same hormone far more weakly. Reported here because it can be, and in
     the same grams as everything else. */
  function bileLoad(totals) {
    if (totals.fat == null && totals.protein == null) return null;
    return (totals.fat || 0) + 0.2 * (totals.protein || 0);
  }

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

    // Concentrations need the weight the figures actually cover, not the
    // weight of the plate — a food with no figures contributes grams but no
    // sugar, and would water every concentration down.
    let coveredGrams = 0;
    const gramsWith = {};
    items.forEach(function (item) {
      const values = NUTRITION[item.food];
      if (!values) return;
      coveredGrams += item.grams;
      NUTRIENTS.forEach(function (n) {
        if (values[n.key] != null) gramsWith[n.key] = (gramsWith[n.key] || 0) + item.grams;
      });
    });

    /* What is not known, in grams. A food missing a figure contributes weight
       to the denominator and nothing to the numerator, so the meal reads
       leaner, drier or less sugary than it is — the direction that hides a
       real load rather than inventing one. Water alone used to be guarded,
       by refusing the question outright if any food lacked it.

       Refusing outright is too blunt now. The American set takes figures one
       at a time, so a food can legitimately arrive with fat and no sugars —
       26 of its 41 do — and a 5g pinch of oregano would silence the sugar
       line for the whole plate.

       So the unknown is bounded instead of assumed. A food cannot hold more
       of a nutrient than it weighs, so its grams are the most it could be
       hiding. `headroom` is that bound per nutrient, and a signal is reported
       only when it reads the same way at both ends of it. */
    const headroom = {};
    NUTRIENTS.forEach(function (n) {
      headroom[n.key] = coveredGrams - (gramsWith[n.key] || 0);
    });

    return {
      totals: totals, covered: covered, uncovered: uncovered,
      coveredGrams: coveredGrams,
      headroom: headroom
    };
  }

  /* ---- A lot at once -----------------------------------------------------
     NOT a nutritional judgement. Nothing here says a meal is unhealthy, and
     nothing here is advice. It says one thing only: this meal holds enough of
     something, or holds it concentrated enough, that the gut is likely to
     notice — which is a different question from whether the meal is good.

     Two units, because two different mechanisms:

       - AN AMOUNT. Fat and protein leave the stomach slowly and slow it
         further; fiber arrives in the colon as bulk to ferment. What matters
         is how much lands in one sitting.

       - A CONCENTRATION, per 100g of meal. Sugar draws water into the lumen
         by osmosis, and osmolality is a property of the solution, not of the
         total: 15g of sugar in a glass of squash and the same 15g spread
         through a plate of food are not the same event. Fat is here twice for
         the same reason — it does not dissolve into the watery phase, so a
         meal that is a sixth fat by weight behaves differently from one where
         the same fat is spread thin.

     A share also carries a floor — the grams of the substance needed before
     its concentration means anything. 7g of honey is three quarters sugar and
     is nobody's osmotic load; without the floor it was reported as one.

     WHAT THESE LINES ARE NOT. They are not a level anyone should stay under,
     and crossing one is not a fault. Most people cross several of them at a
     normal dinner and notice nothing. They matter in two situations: when
     someone is eating well over what they are used to, and when the gut is
     already irritable or already restricted. Fiber is the clearest case — a
     consistently high intake is rarely the problem, and a sudden jump usually
     is. The wording has to keep saying that, because a number on a screen
     reads as a limit unless it is told not to. */
  const MEAL_SIGNALS = [
    {
      key: "fat", kind: "total", line: 25, label: "Fat",
      why: "Fat is the slowest thing to leave the stomach, and it triggers the " +
        "hormones that slow it further. The line is where low-fat advice for fat " +
        "malabsorption puts a single meal.",
      sv: {
        label: "Fett",
        why: "Fett är det som lämnar magsäcken långsammast, och det utlöser de " +
          "hormoner som bromsar den ytterligare. Gränsen ligger där fettsnåla råd " +
          "vid fettmalabsorption lägger en enskild måltid."
      }
    },
    {
      key: "fat", kind: "share", line: 15, floor: 15, label: "Fat as a share of the meal",
      why: "Fat does not dissolve into the watery part of a meal — it travels as " +
        "its own phase. The same grams spread through a larger meal behave more gently.",
      sv: {
        label: "Fett som andel av måltiden",
        why: "Fett löser sig inte i måltidens vattniga del — det färdas som en egen " +
          "fas. Samma antal gram utspridda i en större måltid beter sig mildare."
      }
    },
    {
      key: "sugars", kind: "share", line: 10, floor: 15, label: "Sugars as a share of the meal",
      why: "Sugar pulls water into the bowel, and that depends on how concentrated " +
        "it is rather than how much there is. Above roughly this much per 100g a meal " +
        "is hypertonic — the line sports drinks are formulated to stay under. It " +
        "counts hardest in something drunk, which reaches the small bowel fast.",
      sv: {
        label: "Socker som andel av måltiden",
        why: "Socker drar vatten in i tarmen, och det beror på hur koncentrerat det " +
          "är snarare än hur mycket det finns. Över ungefär så här mycket per 100 g " +
          "är en måltid hyperton — gränsen sportdrycker är formulerade att hålla sig " +
          "under. Det väger tyngst i något man dricker, som når tunntarmen snabbt."
      }
    },
    {
      key: "fiber", kind: "total", line: 10, label: "Fiber",
      why: "The line is about a third of a day's fiber arriving at once. A " +
        "consistently high fiber intake is rarely what causes trouble; a sudden rise " +
        "over what someone is used to usually is.",
      sv: {
        label: "Fiber",
        why: "Gränsen motsvarar ungefär en tredjedel av ett dygns fiber på en gång. " +
          "Ett jämnt högt fiberintag är sällan det som ställer till det; en plötslig " +
          "ökning över vad någon är van vid är det oftast."
      }
    },
    /* The one that fires on too little rather than too much, and the only one
       with a precondition. Osmolality is solutes per unit water, so a dry meal
       and a sweet meal are the same event seen from two sides — and it is the
       pair that hurts, not either alone. A dry meal of plain starch has little
       osmotically active in it and is not flagged; a sweet drink brings its own
       water and is not flagged here either. Dried fruit and a dense sweet dough
       are what this is for.

       `needs` keeps it honest: with too little solute there is nothing to pull
       water in, and the line would be reporting that bread is dry. */
    {
      key: "water", kind: "share", below: 40, needs: { sugars: 20 },
      label: "Water in the meal",
      why: "Sugar draws water into the stomach and small bowel until what is there " +
        "is dilute enough to pass on. A meal that brings little of its own takes that " +
        "water from the body, and the stretching is what is felt. Dried fruit and " +
        "dense sweet doughs are the sharpest version of it.",
      sv: {
        label: "Vatten i måltiden",
        why: "Socker drar vatten in i magsäck och tunntarm tills det som finns där är " +
          "tillräckligt utspätt för att passera vidare. En måltid som bär med sig lite " +
          "eget vatten tar det vattnet från kroppen, och det är utspänningen som känns. " +
          "Torkad frukt och täta söta degar är den skarpaste varianten av det."
      }
    },
    {
      /* 60g, not 40g. At 40g an ordinary plate of chicken and rice tripped it,
         and a line that fires on an ordinary dinner teaches people to skip the
         section. Protein is also the weakest of these mechanisms, so it should
         be the last one to speak. */
      key: "protein", kind: "total", line: 60, label: "Protein",
      why: "A large protein load also leaves the stomach slowly, and sits there while " +
        "it is broken down. This is a lot of it — well past a normal main course.",
      sv: {
        label: "Protein",
        why: "En stor proteinmängd lämnar också magsäcken långsamt, och ligger kvar " +
          "medan den bryts ned. Det här är mycket av det — en bra bit över en vanlig " +
          "huvudrätt."
      }
    }
  ];

  function mealSignals(n) {
    if (!n.coveredGrams) return [];
    return MEAL_SIGNALS.map(function (signal) {
      const total = n.totals[signal.key];
      if (total == null) return null;
      /* A concentration needs enough of the substance to be worth a
         concentration. A teaspoon of honey is three quarters sugar and
         nobody's osmotic load; without this floor it was flagged as one. */
      if (signal.floor != null && total < signal.floor) return null;

      /* Both ends of what is not known. `total` is the least this meal can
         hold of the nutrient; `most` is the largest, since a food cannot hold
         more of anything than it weighs. */
      const most = total + (n.headroom[signal.key] || 0);
      const asValue = function (grams) {
        return signal.kind === "share" ? grams / n.coveredGrams * 100 : grams;
      };
      const fires = function (v) {
        // Most lines are a ceiling. Water is a floor: too little, not too much.
        // Both boundaries are inclusive, as they were before this was a range.
        return signal.below != null ? v <= signal.below : v >= signal.line;
      };
      /* Report only what holds at both ends. Where they disagree the honest
         answer is silence: the figures cannot settle it. */
      if (fires(asValue(total)) !== fires(asValue(most))) return null;
      if (!fires(asValue(total))) return null;

      // A signal can depend on there being enough of something else, and that
      // has to be certain too — not merely true of the figures that arrived.
      if (signal.needs && Object.keys(signal.needs).some(function (key) {
        return !(n.totals[key] >= signal.needs[key]);
      })) return null;

      const value = asValue(total);
      /* A share is a ratio, so it does not move when the whole meal is
         scaled — the same 60g per 100g at 30g of raisins and at 400g. That
         reads as a stuck number unless the amount it came from is next to
         it, so both are shown. */
      const against = signal.below != null
        ? I18N.t("signal.againstDry", { below: signal.below })
        : I18N.t(signal.kind === "share" ? "signal.againstShare" : "signal.againstTotal",
          { line: signal.line });
      /* On a meal that happens to weigh about 100g the two are the same
         sentence twice — "58g per 100g — 58g in 100g of meal". Say it once. */
      const meal = Math.round(n.coveredGrams);
      const sameTwice = meal === 100;
      const text = signal.kind === "share" && !sameTwice
        ? I18N.t("signal.shareOfMeal", { value: fmt(value), total: fmt(total), meal: meal, against: against })
        : signal.kind === "share"
          ? I18N.t("signal.shareOnly", { value: fmt(value), against: against })
          : I18N.t("signal.total", { value: fmt(value), against: against });
      return {
        label: I18N.pick(signal, "label"),
        text: text,
        why: I18N.pick(signal, "why")
      };
    }).filter(Boolean);
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
      else if (item.grams > entry.low) over.push(fodmapLine(item, entry));
      else { within.push(fodmapLine(item, entry)); counting = false; }

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

  function fodmapLine(item, entry) {
    return I18N.t("fodmap.overLine", {
      food: I18N.nameOf(item.food), grams: item.grams, low: entry.low
    });
  }

  /* Why each food counted or did not. Printed under the FODMAP sentence,
     because "counted at the amount you weighed out" is only useful if you can
     see which amounts were which. */
  function fodmapNotes(standing) {
    const notes = [];

    if (standing.within.length) {
      notes.push(I18N.t("fodmap.within", { list: joinList(standing.within) }));
    }
    if (standing.noServe.length) {
      notes.push(I18N.t("fodmap.noServe", {
        list: joinList(standing.noServe.map(I18N.nameOf)), n: standing.noServe.length
      }));
    }
    if (standing.untested.length) {
      notes.push(I18N.t("fodmap.untested", {
        list: joinList(standing.untested.map(I18N.nameOf)), n: standing.untested.length
      }));
    }

    // What a threshold cannot show, and only worth saying when there is
    // something to stack: two or more FODMAP foods on the same plate.
    const carrying = standing.over.length + standing.within.length +
      standing.noServe.length + standing.untested.length;
    if (carrying > 1) {
      notes.push(I18N.t("fodmap.stacking"));
    }

    return notes;
  }

  /* ---- Helpings ----------------------------------------------------------
     This used to be a table of every amount-based trait with a figure like
     "Fat 2". Nobody could read it, and the number was easy to take for
     something it was not: 2 does not mean twice the fat threshold, it means
     the plate holds two standard servings of fat-tagged food, each of which
     is AT LEAST the dose and may be far over it. Two helpings can be 13g of
     fat or 80g.

     Most of those traits no longer need it. Fat, protein, fiber, alcohol and
     the bile-stimulating load are all real grams in the table above, and a
     gram figure beats a proxy that has to be explained. What is left is the
     two the database cannot put a number on:

       - Salicylates: no figure per 100g anywhere in this data.
       - Lactose: the source reports total sugars, and the sugar in an apple
         is not lactose.

     For those, helpings are the only quantity there is, so they are written
     as a sentence with the unit explained rather than printed as a bare
     number, and the wording leans harder as the count climbs. */
  const IN_GRAMS = {
    over_10g_fat: "nutrient.fat", protein: "nutrient.protein",
    fiber: "nutrient.fiber", alcohol: "nutrient.alcohol",
    bile_stimulant: "nutrient.bileLoad"
  };

  // What one helping of a carrying food holds, at minimum — the dose the tag
  // is set by. See DOSE in tools/lmv-core.js; these must match it.
  const PER_HELPING = {
    salicylate: "perHelping.salicylate",
    over_3g_lactose: "perHelping.lactose"
  };

  function helpingPhrase(servings) {
    return I18N.t("meal.helpingPhrase", { servings: fmt(servings) });
  }

  // The emphasis the count earns, as its own clause at the end of the
  // sentence so it never lands mid-phrase.
  function helpingWeight(servings) {
    return I18N.t("meal.helpingWeight", { servings: servings });
  }

  function helpingRows(found) {
    return Object.keys(found)
      .filter(function (id) { return TRAITS[id].dose && !IN_GRAMS[id]; })
      .map(function (id) {
        return {
          label: I18N.traitLabel(TRAITS[id]),
          text: I18N.t("meal.helpingRow", {
            count: found[id].count,
            countWord: countWord(found[id].count),
            phrase: helpingPhrase(found[id].servings)
          }) +
            helpingWeight(found[id].servings) +
            (PER_HELPING[id]
              ? I18N.t("meal.aHelpingHolds", { what: I18N.t(PER_HELPING[id]) })
              : "") + ".",
          servings: found[id].servings
        };
      })
      .sort(function (a, b) { return b.servings - a.servings; });
  }

  /* ---- Wording ----------------------------------------------------------
     The words themselves live in ui-text.js, one whole sentence per language.
     English builds "one of the five FODMAP types" out of fragments in an
     order Swedish does not use, so what stays here is the arithmetic — which
     branch, which count — and each language writes its own sentence around
     it. "an cross-reaction" was once printable; the article is now the
     language's problem rather than this file's. */
  function countWord(n) { return I18N.t("count.word", { n: n }); }

  function ingredients(n) { return I18N.t("count.ingredients", { n: n }); }

  function joinList(parts) {
    if (parts.length === 1) return parts[0];
    return parts.slice(0, -1).join(", ") + I18N.t("count.and") + parts[parts.length - 1];
  }

  // Naming ten absent allergens one by one buries the four that are there.
  const NAME_ABSENT_UP_TO = 4;

  function absentSentence(absent) {
    if (!absent.length) return "";
    if (absent.length <= NAME_ABSENT_UP_TO) {
      return I18N.t("meal.absentListed", { list: joinList(absent), n: absent.length });
    }
    return I18N.t("meal.absentCounted", { word: countWord(absent.length) });
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
        return { label: I18N.traitLabel(TRAITS[id]), count: countFor(id) };
      })
      .sort(function (a, b) { return b.count - a.count || a.label.localeCompare(b.label); });

    const absent = family.types.filter(function (id) { return countFor(id) === 0; })
      .map(function (id) { return I18N.traitLabel(TRAITS[id]); });

    // The umbrella can sit on a food whose mechanism has no subtype of its
    // own — an irritant that is neither capsaicin nor caffeine, say.
    const broadOnly = !counts && family.broad && found[family.broad] && !present.length;
    if (!present.length && !broadOnly) return null;

    const total = family.types.length;
    // "Five of the five" is a long way of saying all of them.
    const howMany = present.length === total
      ? I18N.t("meal.allOfThem", { word: countWord(total) })
      : I18N.t("meal.someOfThem", {
        some: countWord(present.length), total: countWord(total)
      });
    // Nothing "comes from the most ingredients" when they all come from the
    // same number — that read as a ranking of a tie.
    const tied = present.every(function (row) { return row.count === present[0].count; });

    // The words each family answers to, in whichever language is showing.
    const words = {
      noun: family.noun,
      nounTypes: family.svNounTypes,
      gender: family.svGender,
      totalWord: countWord(total)
    };
    let text;

    if (broadOnly) {
      text = I18N.t("meal.familyBroadOnly", Object.assign({}, words, {
        noun: I18N.lang() === "sv" ? family.svNoun : family.noun,
        from: ingredients(found[family.broad].count)
      }));
    } else if (present.length === 1) {
      text = I18N.t("meal.familyOne", Object.assign({}, words, {
        first: present[0].label,
        from: ingredients(present[0].count)
      })) + absentSentence(absent);
    } else if (tied) {
      text = I18N.t("meal.familyTied", Object.assign({}, words, {
        howMany: howMany,
        list: joinList(present.map(function (row) { return row.label; })),
        from: ingredients(present[0].count)
      })) + absentSentence(absent);
    } else {
      const rest = present.slice(1).map(function (row) {
        return row.label + " (" + row.count + ")";
      });
      text = I18N.t("meal.familyRanked", Object.assign({}, words, {
        howMany: howMany,
        first: present[0].label,
        count: present[0].count,
        rest: joinList(rest)
      })) + absentSentence(absent);
    }

    // Every branch above builds a sentence; only one of them starts with a
    // capital by construction.
    return {
      title: family.title,
      text: text.charAt(0).toUpperCase() + text.slice(1),
      articleId: family.articleId
    };
  }

  /* A trait with `modifierOf` only means something alongside the trait it
     modifies: a DAO competitor with no histamine in the meal has nothing to
     compete with. The app drops those rather than reporting them as findings
     — see modifierIsIdle in script.js — and this has to agree with it, or the
     same plate says different things in two places. */
  function modifierIsIdle(traitId, found) {
    const target = TRAITS[traitId].modifierOf;
    return Boolean(target) && !found[target];
  }

  function singleSentence(traitId, found, totalItems) {
    if (!found[traitId] || modifierIsIdle(traitId, found)) return null;
    const count = found[traitId].count;
    let where;
    if (totalItems === 1) where = I18N.t("meal.onlyIngredient");
    // "in all 2 ingredients" is not how anyone says it.
    else if (count === totalItems && totalItems === 2) where = I18N.t("meal.bothIngredients");
    else if (count === totalItems) where = I18N.t("meal.allIngredients", { n: totalItems });
    else where = I18N.t("meal.someIngredients", { n: count, total: totalItems });
    return {
      title: I18N.traitLabel(TRAITS[traitId]),
      text: where,
      articleId: TRAITS[traitId].articleId || null
    };
  }

  /* A meal with its name field cleared still has to be called something —
     an analysis under a blank heading belongs to nothing. The stored name
     stays empty, so typing a name back in works; only the display falls back. */
  function mealTitle(meal, index) {
    return (meal.name || "").trim() || I18N.t("meal.untitled", { n: index + 1 });
  }

  function totalGrams(items) {
    return items.reduce(function (sum, item) { return sum + item.grams; }, 0);
  }

  /* One decimal, and the decimal separator the reader uses. Swedish writes
     25,4 where English writes 25.4, and a page that mixes the two looks like
     two pages. */
  function fmt(n) {
    const rounded = (Math.round(n * 10) / 10).toString();
    return I18N.lang() === "sv" ? rounded.replace(".", ",") : rounded;
  }

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
      nameInput.setAttribute("aria-label", I18N.t("meal.mealName"));
      nameInput.addEventListener("input", function () { meal.name = nameInput.value; });
      nameInput.addEventListener("change", render);
      head.appendChild(nameInput);

      /* The question this tool gets asked is "what changes if I leave the
         cream out", which means the same meal twice with one thing different.
         Typing it in again is the slow way to ask. */
      const copyMeal = document.createElement("button");
      copyMeal.type = "button";
      copyMeal.className = "mealRemove";
      copyMeal.textContent = I18N.t("meal.duplicate");
      copyMeal.addEventListener("click", function (e) {
        e.stopPropagation();
        meals.splice(index + 1, 0, {
          name: I18N.t("meal.copySuffix", { name: meal.name }),
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
        removeMeal.textContent = I18N.t("meal.remove");
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
        empty.textContent = I18N.t("meal.noFoodsYet");
        card.appendChild(empty);
      } else {
        const list = document.createElement("ul");
        list.className = "mealItems";
        meal.items.forEach(function (item, itemIndex) {
          const li = document.createElement("li");

          const name = document.createElement("span");
          name.className = "mealItemName";
          name.textContent = I18N.nameOf(item.food);
          li.appendChild(name);

          const grams = document.createElement("input");
          grams.type = "number";
          grams.min = "1";
          grams.className = "mealItemGrams";
          grams.value = item.grams;
          grams.setAttribute("aria-label", I18N.t("meal.gramsOf", { food: I18N.nameOf(item.food) }));
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
          remove.setAttribute("aria-label", I18N.t("meal.removeFood", { food: I18N.nameOf(item.food) }));
          remove.textContent = "×";
          remove.addEventListener("click", function () {
            meal.items.splice(itemIndex, 1);
            render();
          });
          li.appendChild(remove);

          const servings = document.createElement("span");
          servings.className = "mealItemServings";
          servings.textContent = food && food.portion
            ? I18N.t("meal.servingNote", {
              n: fmt(item.grams / food.portion), portion: food.portion
            })
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
      showError(I18N.t("meal.droppedNoFigures", { food: I18N.nameOf(name) }));
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
      p.textContent = I18N.t("meal.noFoodsInMeal");
      section.appendChild(p);
      container.appendChild(section);
      return;
    }

    const weight = document.createElement("p");
    weight.className = "mealWeight";
    weight.textContent = I18N.t("meal.weightLine", {
      items: items.length, grams: totalGrams(items)
    });
    section.appendChild(weight);

    /* What the meal was, in words. Only on paper: on screen the builder above
       already shows it, but the builder is a form and does not print, so
       without this a printout would report totals for a meal it never names. */
    const ingredientLine = document.createElement("p");
    ingredientLine.className = "mealIngredients printOnly";
    ingredientLine.textContent = items.map(function (item) {
      return I18N.nameOf(item.food) + " " + I18N.t("meal.gramsAfter", { n: item.grams });
    }).join(" · ");
    section.appendChild(ingredientLine);

    const found = tally(items);

    // ---- What the meal actually contains, in grams
    if (haveNutrition()) {
      const n = nutrientTotals(items);

      const h3n = document.createElement("h3");
      h3n.textContent = I18N.t("meal.inThisMeal");
      section.appendChild(h3n);

      if (!n.covered.length) {
        const p = document.createElement("p");
        p.className = "mealEmpty";
        p.textContent = I18N.t("meal.noFiguresAtAll");
        section.appendChild(p);
      } else {
        const table = document.createElement("table");
        table.className = "mealTable";
        const header = document.createElement("tr");
        [I18N.t("meal.colNutrient"), I18N.t("meal.colGrams")].forEach(function (text) {
          const th = document.createElement("th");
          th.textContent = text;
          header.appendChild(th);
        });
        table.appendChild(header);

        function gramsRow(label, grams) {
          const tr = document.createElement("tr");
          const th = document.createElement("th");
          th.textContent = label;
          tr.appendChild(th);
          const td = document.createElement("td");
          td.textContent = fmt(grams) + " g";
          tr.appendChild(td);
          table.appendChild(tr);
        }

        NUTRIENTS.forEach(function (nutrient) {
          const grams = n.totals[nutrient.key];
          if (grams == null) return;
          if (nutrient.whenAbove != null && grams <= nutrient.whenAbove) return;
          gramsRow(I18N.pick(nutrient, "label"), grams);
        });

        const bile = bileLoad(n.totals);
        /* Not worth a row, or the paragraph under the table that explains
           it, when it would print as "0 g" — a meal of pure sugar has no bile
           story to tell. Tested against what is shown, not against zero: a
           spoon of honey carries 0.02g of protein, which is truthy and rounds
           to nothing. */
        const showBile = bile != null && Math.round(bile * 10) > 0;
        if (showBile) gramsRow("Bile-stimulating load", bile);

        const wrap = document.createElement("div");
        wrap.className = "tableScroll";
        wrap.appendChild(table);
        section.appendChild(wrap);

        const coverage = document.createElement("p");
        coverage.className = "mealCoverage";
        coverage.textContent = n.uncovered.length
          ? I18N.t("meal.fromSome", {
            covered: n.covered.length, total: items.length, n: n.uncovered.length,
            missing: joinList(n.uncovered.map(I18N.nameOf))
          })
          : I18N.t("meal.fromAll", { n: items.length });
        section.appendChild(coverage);

        if (showBile) {
          const bileNote = document.createElement("p");
          bileNote.className = "mealCoverage";
          bileNote.textContent = I18N.t("meal.bileNote");
          section.appendChild(bileNote);
        }

        /* ---- A lot at once. Only what crosses a line, and silence when
           nothing does — a section that always says something teaches people
           to stop reading it. */
        const signals = mealSignals(n);
        if (signals.length) {
          const h3s = document.createElement("h3");
          h3s.textContent = I18N.t("meal.aLotAtOnce");
          section.appendChild(h3s);

          const lead = document.createElement("p");
          lead.className = "mealVerdict";
          lead.textContent = I18N.t("signal.lead");
          section.appendChild(lead);

          const list = document.createElement("ul");
          list.className = "mealFamilyList";
          signals.forEach(function (signal) {
            const li = document.createElement("li");
            const strong = document.createElement("strong");
            strong.textContent = signal.label + ": ";
            li.appendChild(strong);
            li.appendChild(document.createTextNode(signal.text + " " + signal.why));
            list.appendChild(li);
          });
          section.appendChild(list);

          /* Not every line here rests on the same kind of evidence, and the
             page should not pretend otherwise. */
          const basis = document.createElement("p");
          basis.className = "mealCoverage noPrint";
          const basisLink = document.createElement("a");
          basisLink.href = "method.html#a-lot-at-once";
          basisLink.className = "mealFamilyLink";
          basisLink.textContent = I18N.t("meal.whereFrom");
          basis.appendChild(basisLink);
          section.appendChild(basis);

          if (n.uncovered.length) {
            const p = document.createElement("p");
            p.className = "mealCoverage";
            p.textContent = I18N.t("signal.coveredNote", { grams: n.coveredGrams });
            section.appendChild(p);
          }
        }
      }
    }

    /* ---- Counted in helpings, for the two traits with no gram figure.
       Everything else that scales with amount is in the grams table above. */
    const helpings = helpingRows(found);
    if (helpings.length) {
      const h3a = document.createElement("h3");
      h3a.textContent = I18N.t("meal.inHelpings");
      section.appendChild(h3a);

      const lead = document.createElement("p");
      lead.className = "mealVerdict";
      lead.textContent = I18N.t("meal.helpingsLead");
      section.appendChild(lead);

      const list = document.createElement("ul");
      list.className = "mealFamilyList";
      helpings.forEach(function (row) {
        const li = document.createElement("li");
        const strong = document.createElement("strong");
        strong.textContent = row.label + ": ";
        li.appendChild(strong);
        li.appendChild(document.createTextNode(row.text));
        list.appendChild(li);
      });
      section.appendChild(list);
    }

    // ---- Present in the meal, family by family
    const h3b = document.createElement("h3");
    h3b.textContent = I18N.t("meal.presentInMeal");
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
            text: standing.within.length === 1
              ? "No FODMAP type is counted in this meal — the one food carrying any is " +
                "within the serving Monash rates low."
              : "No FODMAP type is counted in this meal — every food carrying one is " +
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
      p.textContent = I18N.t("meal.nothingCategorical");
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
          link.textContent = I18N.t("meal.readMore");
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
    note.textContent = I18N.t("meal.closingNote", { present: I18N.t("meal.presentInMeal") });
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
    h2.textContent = I18N.t("meal.sideBySide");
    section.appendChild(h2);

    const headings = ["", ].concat(filled.map(function (meal) {
      return mealTitle(meal, meals.indexOf(meal));
    }));
    const tallies = filled.map(function (meal) { return tally(meal.items); });

    const weights = {
      label: I18N.t("meal.totalWeight"),
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
          rows.push({ label: I18N.pick(nutrient, "label"), cells: cells });
        }
      });
      // The derived row, same as in a single meal's analysis.
      const bileCells = totals.map(function (t) {
        const bile = bileLoad(t.totals);
        return bile == null ? "—" : fmt(bile) + " g";
      });
      if (bileCells.some(function (c) { return c !== "—"; })) {
        rows.push({ label: "Bile-stimulating load", cells: bileCells });
      }

      const h3 = document.createElement("h3");
      h3.textContent = I18N.t("meal.nutrients");
      section.appendChild(h3);
      section.appendChild(comparisonTable(headings, rows));

      const short = totals.filter(function (t) { return t.uncovered.length; });
      if (short.length) {
        const note = document.createElement("p");
        note.className = "mealCoverage";
        note.textContent = I18N.t("meal.shortColumns", {
          names: joinList(short.reduce(function (all, t) {
            return all.concat(t.uncovered.map(I18N.nameOf));
          }, []))
        });
        section.appendChild(note);
      }
    } else {
      section.appendChild(comparisonTable(headings, [weights]));
    }

    /* ---- Helpings, for the two traits with no gram figure. Everything else
       that scales with amount is a row in the grams table above. */
    const helpingIds = Object.keys(TRAITS).filter(function (id) {
      return TRAITS[id].dose && !IN_GRAMS[id] &&
        tallies.some(function (t) { return t[id]; });
    });
    if (helpingIds.length) {
      const h3 = document.createElement("h3");
      h3.textContent = I18N.t("meal.inStandardHelpings");
      section.appendChild(h3);
      section.appendChild(comparisonTable(headings, helpingIds.map(function (id) {
        return {
          label: I18N.traitLabel(TRAITS[id]),
          cells: tallies.map(function (t) { return t[id] ? fmt(t[id].servings) : "—"; })
        };
      })));
      const note = document.createElement("p");
      note.className = "mealCoverage";
      note.textContent = I18N.t("meal.helpingsCompareNote");
      section.appendChild(note);
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
      return filled.some(function (_, i) {
        return countIn(i, id) > 0 && !modifierIsIdle(id, tallies[i]);
      });
    });
    if (presentIds.length) {
      const h3 = document.createElement("h3");
      h3.textContent = I18N.t("meal.presentInMeal");
      section.appendChild(h3);
      section.appendChild(comparisonTable(headings, presentIds.map(function (id) {
        return {
          label: I18N.traitLabel(TRAITS[id]),
          cells: filled.map(function (_, i) {
            const n = modifierIsIdle(id, tallies[i]) ? 0 : countIn(i, id);
            return n ? "in " + ingredients(n) : "—";
          })
        };
      })));
    }

    const note = document.createElement("p");
    note.className = "traitFoodsNote";
    note.textContent = I18N.t("meal.compareNote");
    section.appendChild(note);

    container.appendChild(section);
  }

  function renderResults() {
    results.innerHTML = "";

    meals.forEach(function (meal, index) {
      renderAnalysis(results, mealTitle(meal, index), meal.items);
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
    const active = meals[activeMeal] || meals[0];
    if (target) target.textContent = mealTitle(active, meals.indexOf(active));
  }

  // ---- Buttons -----------------------------------------------------------
  document.getElementById("addMealButton").addEventListener("click", function () {
    meals.push({ name: I18N.t("meal.untitled", { n: meals.length + 1 }), items: [] });
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
        showError(I18N.t("meal.noMealsInFile"));
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
        return { name: meal.name || I18N.t("meal.untitled", { n: index + 1 }), items: items };
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
