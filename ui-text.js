/* =========================================================================
   ui-text.js — the sentences the scripts build, in both languages

   A page's fixed copy lives in its own HTML, on the element that carries it
   (`data-sv="..."` — see applyDom in i18n.js). This file is the other half:
   the lines assembled at run time, where the words are not known until a
   count is.

   WHY EACH LANGUAGE OWNS THE WHOLE SENTENCE. The tempting shape is a
   dictionary of fragments — "of the", "types tracked here", "from" — glued
   together by shared code. It does not survive contact with a second
   language. English says "one of the five FODMAP types tracked here is in
   this meal"; Swedish puts the number, the noun and the verb in another
   order and inflects the adjective to match the noun. Sharing the assembly
   would mean the Swedish sentence is built by English grammar, which reads
   as a translation rather than as Swedish.

   So a key holds one whole sentence per language, with {slots}, and a
   function wherever the sentence has to branch — on a count, or on a noun's
   gender, which Swedish has and English does not.

       UI["meal.fromAll"] = {
         en: "From all {n} foods.",
         sv: "Från alla {n} livsmedel."
       }

       I18N.t("meal.fromAll", { n: 3 })

   Both languages sit on the same key for the same reason a food carries both
   names on one line: nobody edits one without the other in front of them,
   and check-i18n.js fails the build on a key that has only one.

   ---------------------------------------------------------------------
   THE TWO SWEDISH GENDERS
   ---------------------------------------------------------------------
   Swedish nouns are en- or ett-words and the words around them agree. The
   trait families are the place this bites: "en FODMAP" but "ett allergen".
   No rule predicts which, so the family carries its own — svNoun,
   svNounTypes and svGender on FILTER_SECTIONS in foods-data.js — and the
   sentence function reads it rather than guessing.
   ========================================================================= */

const UI = {

  /* SOME KEYS BELOW HAVE NO CALLER IN THE FREE BUILD, and are kept anyway:
     file.*, print.*, app.printFoodsHeading and meal.noMealsInFile belong to
     saving and printing, and without.* to the third tool. This file is
     copied between the two builds rather than generated, so a key deleted
     here is a key missing there. Fourteen unused strings cost less than two
     versions of a file that would drift. */

  /* ---- Landing page ---------------------------------------------------- */

  "demo.pickTwo": {
    en: "Select at least two foods to see what they share.",
    sv: "Välj minst två livsmedel för att se vad de har gemensamt."
  },
  "demo.nothingShared": {
    en: "These foods don't share a tracked trait — try a different combination.",
    sv: "De här livsmedlen delar ingen egenskap som följs här — prova en annan kombination."
  },
  "demo.topShared": {
    en: "Top shared traits among these {n} foods:",
    sv: "Främsta gemensamma egenskaper bland dessa {n} livsmedel:"
  },

  /* ---- Shared traits --------------------------------------------------- */

  "app.pickACategory": {
    en: "Click on a category to show lists of foods",
    sv: "Klicka på en kategori för att visa listor med livsmedel"
  },
  "app.remove": {
    en: "Remove {food}",
    sv: "Ta bort {food}"
  },
  "app.selectForSummary": {
    en: "Select foods to see a summary.",
    sv: "Välj livsmedel för att se en sammanfattning."
  },
  "app.selectForAnalysis": {
    en: "Select foods to see a deeper summary and analysis of the foods.",
    sv: "Välj livsmedel för att se en djupare sammanfattning och analys av livsmedlen."
  },
  "app.showLess": { en: "Show less ▴", sv: "Visa mindre ▴" },

  "app.noTrackedTraits": {
    en: "No tracked traits",
    sv: "Inga följda egenskaper"
  },
  /* "3 of these 12 foods carry no trait this tool tracks." The Swedish
     verb agrees with nothing here, but the count word does the same work in
     both, so this one is a plain template. */
  "app.untrackedNote": {
    en: "{n} of these {total} carry no trait this tool tracks. They still count " +
      "toward every percentage above.",
    sv: "{n} av dessa {total} bär ingen egenskap som verktyget följer. De räknas " +
      "fortfarande med i alla procentsatser ovan."
  },
  "app.foodsInAnalysis": {
    en: "Foods in this analysis — click one to leave it out, click again to bring it back:",
    sv: "Livsmedel i analysen — klicka på ett för att lämna det utanför, klicka igen för att ta med det:"
  },
  "app.exclude": { en: "Exclude", sv: "Uteslut" },
  "app.excludeAria": {
    en: "Exclude {trait} from the analysis",
    sv: "Uteslut {trait} ur analysen"
  },
  "app.fallbackAnalysis": {
    en: "The most common shared trait among these foods is {trait}.",
    sv: "Den vanligaste gemensamma egenskapen bland dessa livsmedel är {trait}."
  },
  "app.evidenceHeading": {
    en: "How well supported is this?",
    sv: "Hur väl belagt är det här?"
  },
  "app.readArticle": {
    en: "Read the full article →",
    sv: "Läs hela artikeln →"
  },
  "app.seeBelow": {
    en: "See \"{title}\" below.",
    sv: "Se \"{title}\" nedan."
  },
  "app.foodCountN": {
    en: function (v) { return v.n + (v.n === 1 ? " food" : " foods"); },
    sv: function (v) { return v.n + " livsmedel"; }
  },
  "app.chosenPlain": {
    en: "You have chosen {count} from the list.",
    sv: "Du har valt {count} ur listan."
  },
  "app.chosenNoShared": {
    en: "You have chosen {count} from the list, but they don't share a tracked " +
      "trait right now (or every relevant filter is excluded).",
    sv: "Du har valt {count} ur listan, men de delar ingen följd egenskap just nu " +
      "(eller så är alla relevanta filter uteslutna)."
  },
  "app.chosenShared": {
    en: "You have chosen {count} from the list. Shared traits:",
    sv: "Du har valt {count} ur listan. Gemensamma egenskaper:"
  },
  "app.untrackedOneFood": {
    en: "This food has no tracked traits yet, so there's nothing to compare.",
    sv: "Det här livsmedlet har inga följda egenskaper än, så det finns inget att jämföra."
  },
  "app.untrackedAllFoods": {
    en: "None of these {total} foods have tracked traits yet, so there's nothing to compare.",
    sv: "Inget av dessa {total} livsmedel har följda egenskaper än, så det finns inget att jämföra."
  },
  "app.untrackedSome": {
    en: "{n} of these {count} have no tracked traits yet.",
    sv: "{n} av dessa {count} har inga följda egenskaper än."
  },
  "app.untrackedCounted": {
    en: " They still count in the percentages above.",
    sv: " De räknas fortfarande med i procentsatserna ovan."
  },
  "app.untrackedStillCount": {
    en: "Foods with no tracked traits still count toward every percentage.",
    sv: "Livsmedel utan följda egenskaper räknas fortfarande med i varje procentsats."
  },
  "app.showNMore": { en: "Show {n} more ▾", sv: "Visa {n} till ▾" },
  "app.allExcluded": {
    en: "Every food above is left out of the analysis right now — click one to bring it back.",
    sv: "Alla livsmedel ovan är utelämnade ur analysen just nu — klicka på ett för att ta med det igen."
  },
  "app.macroNote": {
    en: "Note: this selection is also high in {list} (over 90% of foods) — these " +
      "rarely cause symptoms directly but can worsen other GI issues.",
    sv: "Obs: urvalet är också högt i {list} (över 90 % av livsmedlen) — de orsakar " +
      "sällan symtom direkt men kan förvärra andra magbesvär."
  },
  "app.caveat": {
    en: "This tool shows what the chosen foods have in common — not what is causing " +
      "the symptoms. A pattern is a hypothesis to test through structured elimination " +
      "and reintroduction, not a finding.",
    sv: "Verktyget visar vad de valda livsmedlen har gemensamt — inte vad som orsakar " +
      "symtomen. Ett mönster är en hypotes att pröva genom strukturerad eliminering " +
      "och återintroduktion, inte ett fynd."
  },
  "app.portionCaveat": {
    en: "Amounts are measured at one typical serving of each food. If you eat " +
      "noticeably more than that, a trait that does not appear here may still apply to you.",
    sv: "Mängderna är mätta vid en typisk portion av varje livsmedel. Äter du märkbart " +
      "mer än så kan en egenskap som inte syns här ändå gälla dig."
  },

  "app.printFoodsHeading": {
    en: "Foods in this analysis ({n})",
    sv: "Livsmedel i analysen ({n})"
  },

  /* ---- Meal builder ---------------------------------------------------- */

  "meal.noFoodsYet": { en: "No foods yet.", sv: "Inga livsmedel än." },
  "meal.noFoodsInMeal": {
    en: "No foods in this meal yet.",
    sv: "Inga livsmedel i måltiden än."
  },
  "meal.duplicate": { en: "Duplicate", sv: "Duplicera" },
  "meal.remove": { en: "Remove", sv: "Ta bort" },
  "meal.copySuffix": { en: "{name} (copy)", sv: "{name} (kopia)" },
  "meal.untitled": { en: "Meal {n}", sv: "Måltid {n}" },
  "meal.readMore": { en: "Read more →", sv: "Läs mer →" },
  "meal.whereFrom": {
    en: "Where each line comes from →",
    sv: "Var varje rad kommer ifrån →"
  },

  /* ---- Counting words --------------------------------------------------
     Swedish counts the same way English does up to fourteen, which is as far
     as either needs to go before a numeral reads better than a word. */
  "count.word": {
    en: function (v) {
      const w = ["no", "one", "two", "three", "four", "five", "six", "seven",
        "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen"];
      return w[v.n] || String(v.n);
    },
    sv: function (v) {
      const w = ["inga", "en", "två", "tre", "fyra", "fem", "sex", "sju",
        "åtta", "nio", "tio", "elva", "tolv", "tretton", "fjorton"];
      return w[v.n] || String(v.n);
    }
  },
  "count.ingredients": {
    en: function (v) { return v.n + (v.n === 1 ? " ingredient" : " ingredients"); },
    sv: function (v) { return v.n + (v.n === 1 ? " ingrediens" : " ingredienser"); }
  },
  "count.and": { en: " and ", sv: " och " },

  /* ---- Weight and coverage --------------------------------------------- */

  "meal.weightLine": {
    en: function (v) {
      return v.items + (v.items === 1 ? " food, " : " foods, ") + v.grams + "g in total";
    },
    sv: function (v) { return v.items + " livsmedel, " + v.grams + " g totalt"; }
  },
  "meal.inThisMeal": { en: "In this meal", sv: "I måltiden" },
  "meal.noFiguresAtAll": {
    en: "None of these foods has figures on file, so this meal cannot be " +
      "totalled in grams.",
    sv: "Inget av livsmedlen har siffror på fil, så måltiden går inte att " +
      "summera i gram."
  },
  "meal.fromAll": { en: "From all {n} foods.", sv: "Från alla {n} livsmedel." },
  "meal.fromSome": {
    en: function (v) {
      return "From " + v.covered + " of the " + v.total + " foods. " + v.missing +
        (v.n === 1 ? " has" : " have") + " no figures on file, so nothing above " +
        "counts " + (v.n === 1 ? "it" : "them") + " — the real totals are higher.";
    },
    sv: function (v) {
      return "Från " + v.covered + " av " + v.total + " livsmedel. " + v.missing +
        " har inga siffror på fil, så inget ovan räknar med " +
        (v.n === 1 ? "det" : "dem") + " — de verkliga summorna är högre.";
    }
  },
  "meal.shortColumns": {
    en: "Some foods have no figures on file, so those columns are short: {names}.",
    sv: "Vissa livsmedel har inga siffror på fil, så de kolumnerna är " +
      "ofullständiga: {names}."
  },

  /* ---- Section headings ------------------------------------------------- */

  "meal.aLotAtOnce": { en: "A lot at once", sv: "Mycket på en gång" },
  "meal.inHelpings": {
    en: "Counted in helpings, not grams",
    sv: "Räknas i portioner, inte gram"
  },
  "meal.presentInMeal": { en: "Present in the meal", sv: "Finns i måltiden" },
  "meal.sideBySide": { en: "Side by side", sv: "Sida vid sida" },
  "meal.nutrients": { en: "Nutrients", sv: "Näringsämnen" },
  "meal.colNutrient": { en: "Nutrient", sv: "Näringsämne" },
  "meal.colGrams": { en: "Grams", sv: "Gram" },
  "meal.inStandardHelpings": { en: "In standard helpings", sv: "I standardportioner" },
  "meal.nothingCategorical": {
    en: "Nothing in this meal carries a categorical trait.",
    sv: "Inget i måltiden bär en kategorisk egenskap."
  },

  /* ---- Nutrient names, as they head a row ------------------------------- */

  "nutrient.fat": { en: "Fat", sv: "Fett" },
  "nutrient.protein": { en: "Protein", sv: "Protein" },
  "nutrient.fiber": { en: "Fiber", sv: "Fiber" },
  "nutrient.alcohol": { en: "Alcohol", sv: "Alkohol" },
  "nutrient.bileLoad": {
    en: "the bile-stimulating load",
    sv: "den gallstimulerande belastningen"
  },

  /* ---- Helpings ---------------------------------------------------------
     A helping is not a weight, so the count is written out as a phrase with
     the unit named rather than printed as a bare number. */

  "meal.helpingPhrase": {
    en: function (v) {
      if (v.servings < 1) return "part of one standard helping";
      if (v.servings < 2) return "about one standard helping";
      return v.servings + " standard helpings";
    },
    sv: function (v) {
      if (v.servings < 1) return "en del av en standardportion";
      if (v.servings < 2) return "ungefär en standardportion";
      return v.servings + " standardportioner";
    }
  },
  "meal.helpingWeight": {
    en: function (v) {
      if (v.servings >= 6) return " — several times what one helping carries";
      if (v.servings >= 4) return " — a lot in one sitting";
      return "";
    },
    sv: function (v) {
      if (v.servings >= 6) return " — flera gånger vad en portion bär";
      if (v.servings >= 4) return " — mycket vid ett och samma tillfälle";
      return "";
    }
  },
  "meal.helpingRow": {
    en: function (v) {
      return v.count === 1
        ? "one ingredient carries it, " + v.phrase
        : v.countWord + " ingredients carry it, " + v.phrase + " between them";
    },
    sv: function (v) {
      return v.count === 1
        ? "en ingrediens bär den, " + v.phrase
        : v.countWord + " ingredienser bär den, " + v.phrase + " tillsammans";
    }
  },
  "meal.aHelpingHolds": {
    en: ". A helping holds {what}",
    sv: ". En portion innehåller {what}"
  },
  "perHelping.salicylate": {
    en: "at least 1mg of salicylic acid",
    sv: "minst 1 mg salicylsyra"
  },
  "perHelping.lactose": {
    en: "at least 5g of sugars",
    sv: "minst 5 g socker"
  },

  /* ---- One trait on its own --------------------------------------------- */

  "meal.onlyIngredient": {
    en: "in the only ingredient.",
    sv: "i den enda ingrediensen."
  },
  "meal.bothIngredients": {
    en: "in both ingredients.",
    sv: "i båda ingredienserna."
  },
  "meal.allIngredients": {
    en: "in all {n} ingredients.",
    sv: "i alla {n} ingredienser."
  },
  "meal.someIngredients": {
    en: "in {n} of the {total} ingredients.",
    sv: "i {n} av {total} ingredienser."
  },

  /* ---- The family sentences ---------------------------------------------
     `noun` and `nounTypes` are the family's own words and `gender` its
     Swedish article, all read off FILTER_SECTIONS. English needs a/an, which
     it works out from the noun; Swedish needs en/ett, which no rule
     predicts, so the family carries it. */

  "meal.familyBroadOnly": {
    en: function (v) {
      return "This meal carries " + (/^[aeiou]/i.test(v.noun) ? "an " : "a ") +
        v.noun + " from " + v.from + ", by a mechanism with no type of its own. " +
        "None of the " + v.totalWord + " types tracked here are in it.";
    },
    sv: function (v) {
      return "Måltiden bär " + v.gender + " " + v.noun + " från " + v.from +
        ", genom en mekanism utan egen typ. Ingen av de " + v.totalWord +
        " typer som följs här finns i den.";
    }
  },
  "meal.familyOne": {
    en: function (v) {
      return "One of the " + v.totalWord + " " + v.noun + " types tracked here is " +
        "in this meal: " + v.first + ", from " + v.from + ".";
    },
    sv: function (v) {
      return "En av de " + v.totalWord + " " + v.nounTypes + " som följs här finns " +
        "i måltiden: " + v.first + ", från " + v.from + ".";
    }
  },
  "meal.familyTied": {
    en: function (v) {
      return v.howMany + " " + v.noun + " types tracked here are in this meal: " +
        v.list + ", each from " + v.from + ".";
    },
    sv: function (v) {
      return v.howMany + " " + v.nounTypes + " som följs här finns i måltiden: " +
        v.list + ", var och en från " + v.from + ".";
    }
  },
  "meal.familyRanked": {
    en: function (v) {
      return v.howMany + " " + v.noun + " types tracked here are in this meal. " +
        v.first + " comes from the most ingredients (" + v.count + "), then " +
        v.rest + ".";
    },
    sv: function (v) {
      return v.howMany + " " + v.nounTypes + " som följs här finns i måltiden. " +
        v.first + " kommer från flest ingredienser (" + v.count + "), sedan " +
        v.rest + ".";
    }
  },
  /* "All five" beats "five of the five". */
  "meal.allOfThem": { en: "All {word}", sv: "Alla {word}" },
  "meal.someOfThem": { en: "{some} of the {total}", sv: "{some} av {total}" },

  /* Naming ten absent allergens one by one buries the four that are there,
     so past a handful they are counted rather than listed. */
  "meal.absentListed": {
    en: function (v) {
      return " " + v.list + (v.n === 1 ? " is" : " are") + " not in this meal.";
    },
    sv: function (v) {
      return " " + v.list + (v.n === 1 ? " finns" : " finns") + " inte i måltiden.";
    }
  },
  "meal.absentCounted": {
    en: " The other {word} are not in this meal.",
    sv: " De andra {word} finns inte i måltiden."
  },

  /* ---- "A lot at once" lines ---------------------------------------------
     A share is a ratio and does not move when the meal is scaled, which
     reads as a stuck number unless the amount it came from sits next to it.
     So the line names both, and then what it is measured against. */

  "signal.againstDry": {
    en: "under the {below}g per 100g below which a meal counts as dry.",
    sv: "under de {below} g per 100 g som en måltid räknas som torr under."
  },
  "signal.againstShare": {
    en: "against {line}g per 100g.",
    sv: "mot {line} g per 100 g."
  },
  "signal.againstTotal": {
    en: "against {line}g.",
    sv: "mot {line} g."
  },
  "signal.shareOfMeal": {
    en: "{value}g per 100g — {total}g in {meal}g of meal — {against}",
    sv: "{value} g per 100 g — {total} g i {meal} g måltid — {against}"
  },
  "signal.shareOnly": {
    en: "{value}g in the meal's 100g — {against}",
    sv: "{value} g i måltidens 100 g — {against}"
  },
  "signal.total": {
    en: "{value}g, {against}",
    sv: "{value} g, {against}"
  },
  "signal.lead": {
    en: "Not a judgement about the meal, and not a limit to stay under — most " +
      "people cross these at an ordinary dinner and notice nothing. It matters " +
      "when someone is eating well over what they are used to, or when the gut " +
      "is already sensitive or already restricted.",
    sv: "Inte ett omdöme om måltiden, och inte en gräns att hålla sig under — " +
      "de flesta passerar flera av dem vid en vanlig middag utan att märka något. " +
      "Det spelar roll när någon äter en bra bit över vad hen är van vid, eller " +
      "när magen redan är känslig eller redan begränsad."
  },
  "signal.coveredNote": {
    en: "Worked out over the {grams}g this meal has figures for, not its full " +
      "weight. Nothing crossing a line here is in doubt, but nothing staying " +
      "under one is settled either.",
    sv: "Uträknat över de {grams} g måltiden har siffror för, inte hela dess vikt. " +
      "Inget som passerar en gräns här är osäkert, men inget som stannar under " +
      "en gräns är avgjort heller."
  },
  "meal.bileNote": {
    en: "The bile-stimulating load is the fat above, counting protein at a fifth " +
      "of its weight — protein triggers the same hormone far more weakly. It is " +
      "the rule single foods are tagged by, applied to the meal.",
    sv: "Den gallstimulerande belastningen är fettet ovan, med protein räknat till " +
      "en femtedel av sin vikt — protein utlöser samma hormon långt svagare. Det " +
      "är regeln enskilda livsmedel märks efter, tillämpad på måltiden."
  },
  "meal.helpingsLead": {
    en: "These scale with how much is eaten, but this database has no figure per " +
      "100g for them — so they are counted in helpings, a helping being the " +
      "standard serving of whichever food carries it. A helping is at least the " +
      "amount the tag is set by, and can be well over it.",
    sv: "De här skalar med hur mycket som äts, men databasen har ingen siffra per " +
      "100 g för dem — så de räknas i portioner, där en portion är standardportionen " +
      "för det livsmedel som bär den. En portion är minst den mängd taggen är satt " +
      "efter, och kan vara en bra bit över."
  },
  "meal.closingNote": {
    en: "Grams above are real amounts. A helping is not: it is one standard serving " +
      "of a food that carries the trait, holding at least the amount the tag is set " +
      "by and possibly well over it. Under \"{present}\", how prominent a trait is " +
      "means how many ingredients carry it, not how much of it is there: those traits " +
      "have no amount to add up, and a small amount of an allergen is still an amount. " +
      "FODMAPs are the exception — Monash rates a stated serving low, so a food weighed " +
      "out within its serving is in the meal without being counted there. To see which " +
      "food carries what, use the main app.",
    sv: "Gram ovan är verkliga mängder. En portion är det inte: det är en " +
      "standardportion av ett livsmedel som bär egenskapen, med minst den mängd " +
      "taggen är satt efter och möjligen en bra bit mer. Under \"{present}\" betyder " +
      "hur framträdande en egenskap är hur många ingredienser som bär den, inte hur " +
      "mycket av den som finns: de egenskaperna har ingen mängd att summera, och en " +
      "liten mängd av ett allergen är fortfarande en mängd. FODMAP är undantaget — " +
      "Monash bedömer en angiven portion som låg, så ett livsmedel vägt inom sin " +
      "portion finns i måltiden utan att räknas där. Använd huvudverktyget för att " +
      "se vilket livsmedel som bär vad."
  },
  "meal.helpingsCompareNote": {
    en: "A helping is the standard serving of whichever food carries the trait — " +
      "these two have no figure per 100g in this database, so helpings are the " +
      "only quantity there is.",
    sv: "En portion är standardportionen för det livsmedel som bär egenskapen — de " +
      "här två har ingen siffra per 100 g i databasen, så portioner är det enda " +
      "mått som finns."
  },
  "meal.compareNote": {
    en: "The meals are compared, not added together: two meals side by side answer " +
      "what changed, which a total would hide.",
    sv: "Måltiderna jämförs, de summeras inte: två måltider sida vid sida svarar på " +
      "vad som ändrades, vilket en summa skulle dölja."
  },
  "meal.totalWeight": { en: "Total weight", sv: "Total vikt" },
  "meal.mealName": { en: "Meal name", sv: "Måltidens namn" },
  "meal.gramsOf": { en: "Grams of {food}", sv: "Gram {food}" },
  /* English writes "200g", Swedish "200 g". */
  "meal.gramsAfter": { en: "{n}g", sv: "{n} g" },
  "meal.removeFood": { en: "Remove {food}", sv: "Ta bort {food}" },
  "meal.servingNote": {
    en: "({n} × {portion}g serving)",
    sv: "({n} × {portion} g portion)"
  },
  "meal.noMealsInFile": {
    en: "That file holds no meals. Anything else in it has been restored.",
    sv: "Filen innehåller inga måltider. Allt annat i den har återställts."
  },
  "meal.droppedNoFigures": {
    /* Names no tool. The free build has two and the full one three, and a
       string that lists them is a string that has to be built twice. */
    en: "\"{food}\" has no nutrient figures on file, so a meal holding it could " +
      "not be totalled. Its traits are still tracked everywhere else.",
    sv: "\"{food}\" har inga näringssiffror på fil, så en måltid med det gick inte " +
      "att summera. Dess egenskaper följs fortfarande överallt annars."
  },

  /* ---- FODMAPs: why each food counted or did not ------------------------- */

  "fodmap.within": {
    en: "Not counted, within the serving Monash rates low: {list}.",
    sv: "Räknas inte, inom den portion Monash bedömer som låg: {list}."
  },
  "fodmap.noServe": {
    en: function (v) {
      return v.list + (v.n === 1 ? " has" : " have") + " no low serving at any amount, so " +
        (v.n === 1 ? "it counts" : "they count") + " whatever the weight.";
    },
    sv: function (v) {
      return v.list + " har ingen låg portion vid någon mängd, så " +
        (v.n === 1 ? "det räknas" : "de räknas") + " oavsett vikt.";
    }
  },
  "fodmap.untested": {
    en: function (v) {
      return "No serving on file for " + v.list + ", so " +
        (v.n === 1 ? "it is" : "they are") + " counted on the tag alone, whatever the weight.";
    },
    sv: function (v) {
      return "Ingen portion på fil för " + v.list + ", så " +
        (v.n === 1 ? "det räknas" : "de räknas") + " på taggen ensam, oavsett vikt.";
    }
  },
  "fodmap.stacking": {
    en: "Each serving is rated low on its own, so several in one meal can still add " +
      "up — a plate of foods each within its own serving is not the same as one " +
      "low-FODMAP food.",
    sv: "Varje portion bedöms som låg för sig, så flera i en måltid kan ändå " +
      "adderas — en tallrik med livsmedel som var för sig håller sin portion är " +
      "inte samma sak som ett enda låg-FODMAP-livsmedel."
  },
  "fodmap.overLine": {
    en: "{food} {grams}g, low at {low}g",
    sv: "{food} {grams} g, låg vid {low} g"
  },

  /* ---- Saving, loading and clearing -------------------------------------
     Shared by every tool page. A load failure has to say which of several
     wrong-file cases it is, because "could not load" sends someone looking
     for the wrong problem. */

  "file.unreadable": {
    en: "That file is not readable — it is not the kind of file this tool saves.",
    sv: "Filen går inte att läsa — det är inte den sortens fil verktyget sparar."
  },
  "file.notOurs": {
    en: "That file was not saved by this tool.",
    sv: "Filen sparades inte av det här verktyget."
  },
  "file.wrongTool": {
    en: "That file was saved by a different part of this tool{which}.",
    sv: "Filen sparades av en annan del av verktyget{which}."
  },
  "file.empty": {
    en: "That file carries no saved work.",
    sv: "Filen innehåller inget sparat arbete."
  },
  "file.readError": {
    en: "The file could not be read.",
    sv: "Filen gick inte att läsa."
  },
  "session.nothingStored": {
    en: "There is nothing stored on this device.",
    sv: "Det finns inget sparat på den här enheten."
  },
  "session.confirmClear": {
    en: "Clear everything this browser has kept — every selection, every " +
      "meal, every filter?\n\nThis cannot be undone, " +
      "and it does not touch any file you have saved.",
    sv: "Rensa allt den här webbläsaren har sparat — alla urval, alla " +
      "måltider, alla filter?\n\nDet går inte att " +
      "ångra, och det rör ingen fil du har sparat."
  },

  /* ---- Print ------------------------------------------------------------ */

  "print.stamp": { en: "Printed {date}", sv: "Utskriven {date}" },
  "print.footer": {
    en: "Food Intolerance Guide — {page} — a food property database, not a diagnosis. {host}",
    sv: "Guide till matintolerans — {page} — en databas över livsmedelsegenskaper, inte en diagnos. {host}"
  },

  /* ---- Foods without ---------------------------------------------------- */

  "without.pickOne": {
    en: "Pick at least one trait above. This database holds {total} foods.",
    sv: "Välj minst en egenskap ovan. Databasen rymmer {total} livsmedel."
  },
  /* English can say "carry no Lactose" for any trait name. Swedish would
     need ingen/inget/inga to agree with a noun whose gender the sentence
     cannot know, so it says "saknar" — lacks — which agrees with nothing. */
  "without.heading": {
    en: "{count} of {total} foods carry no {traits}",
    sv: "{count} av {total} livsmedel saknar {traits}"
  },
  "without.everyFood": {
    en: "Every food in this database carries at least one of those.",
    sv: "Varje livsmedel i databasen bär minst en av dem."
  },
  "without.note": {
    en: "These are the foods in this database not tagged with {traits}. That is all " +
      "it means. It is not a list of foods that are safe for you, and it is not a " +
      "diet — an untagged food can still cause symptoms, and a list built by " +
      "removing things can leave out something you need.",
    sv: "Det här är de livsmedel i databasen som inte är märkta med {traits}. Mer än " +
      "så betyder det inte. Det är ingen lista över livsmedel som är säkra för dig, " +
      "och det är ingen diet — ett omärkt livsmedel kan ändå ge symtom, och en lista " +
      "byggd genom att ta bort saker kan utelämna något du behöver."
  },
  "without.or": { en: " or ", sv: " eller " },

  /* ---- The food lists under an article ---------------------------------- */

  "traitFoods.heading": { en: "Which foods carry this?", sv: "Vilka livsmedel bär den här?" },
  "traitFoods.introOne": {
    en: "Every food in this database tagged with this trait.",
    sv: "Varje livsmedel i databasen som är märkt med den här egenskapen."
  },
  "traitFoods.introMany": {
    en: "Every food in this database tagged with each of these traits.",
    sv: "Varje livsmedel i databasen som är märkt med var och en av dessa egenskaper."
  },
  "traitFoods.note": {
    en: "These lists are the foods in this database carrying the tag, measured at " +
      "one standard serving each. They are not a list of foods to avoid.",
    sv: "Listorna är de livsmedel i databasen som bär taggen, mätta vid en " +
      "standardportion var. De är ingen lista över livsmedel att undvika."
  },
  "traitFoods.tagged": {
    en: "Foods tagged {trait} ({count})",
    sv: "Livsmedel märkta {trait} ({count})"
  },
  "traitFoods.summary": { en: "{trait} — {count}", sv: "{trait} — {count}" },
  "count.foods": {
    en: function (v) { return v.n === 1 ? "1 food" : v.n + " foods"; },
    sv: function (v) { return v.n + " livsmedel"; }
  },
  "category.other": { en: "Other", sv: "Övrigt" },
  "nav.menu": { en: "Menu", sv: "Meny" },

  /* The tooltip on a greyed-out food in the free build. Present in both
     builds: the full one has no locked foods, so nothing ever asks for it,
     and one key in two places is cheaper than two versions of a file. */
  /* Shown in place of an article the free build does not carry. */
  "article.locked": {
    en: "This article is in the full version. The seven here — the macronutrients, fibre, " +
      "FODMAPs and how certain any of this is — are the ones that explain what the " +
      "database is doing; the rest go into a single property in depth.",
    sv: "Den här artikeln finns i fullversionen. De sju som ligger här — makronäringsämnena, " +
      "fiber, FODMAP och hur säkert något av det här är — är de som förklarar vad databasen " +
      "gör; övriga går på djupet i en enskild egenskap."
  },

  "locked.hint": {
    en: "Not in the free version — this food's traits and figures are in the full one.",
    sv: "Ingår inte i gratisversionen — livsmedlets egenskaper och siffror finns i fullversionen."
  },

  /* ---- Articles ---------------------------------------------------------- */

  "articles.title": { en: "Articles", sv: "Artiklar" },
  "articles.landing": {
    en: "Pick a topic from the list to read a deep dive on how it can relate to " +
      "food intolerance.",
    sv: "Välj ett ämne ur listan för att läsa en fördjupning i hur det kan hänga " +
      "ihop med matintolerans."
  },
  "articles.notFound": { en: "Topic not found", sv: "Ämnet finns inte" },
  "articles.noSuchTopic": {
    en: "There's no article called \"{id}\". Pick a topic from the list instead.",
    sv: "Det finns ingen artikel som heter \"{id}\". Välj ett ämne ur listan i stället."
  }



};

if (typeof module === "object" && module.exports) module.exports = { UI: UI };
