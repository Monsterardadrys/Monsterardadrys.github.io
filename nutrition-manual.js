/* =========================================================================
   nutrition-manual.js — per 100g figures entered by hand, WITH A SOURCE

   The counterpart to nutrition-data.js. That file is generated from the
   Livsmedelsverket export and must never be hand-edited; this one is the
   opposite, and the builder merges the two with Livsmedelsverket winning.

   ---------------------------------------------------------------------
   ADDING A FOOD
   ---------------------------------------------------------------------
     "Roquefort": {
       src: "ciqual",
       ref: "Roquefort (fromage), 12750",
       values: { fat: 32.9, protein: 19.2, carbs: 1.5, fiber: 0, sugars: 0.5 }
     }

   `src` must be one of SOURCES below. `ref` is the entry as it appears in
   that source, verbatim, so anyone can look it up and disagree. Both are
   required: a number without a traceable origin is worse than no number,
   because it looks like the rest.

   Only fat, protein, carbs, fiber, sugars and alcohol are used. Leave a
   nutrient out rather than writing a zero you are not sure of — a missing
   value is reported as missing, a wrong zero is not.
   ========================================================================= */

/* The sources we will take a figure from, in the order we prefer them.
   Deliberately short: every source added is another set of laboratory
   methods mixed into the same column, and fiber especially does not
   survive that unnoticed — AOAC 985.29 and AOAC 2011.25 can differ by a
   couple of grams, which matters against a 6.1g dose. */
const NUTRITION_SOURCES = {
  lmv: {
    label: "Livsmedelsverket",
    note: "The Swedish national food database. Everything it covers comes from there."
  },
  frida: {
    label: "Frida (DTU, Denmark)",
    note: "The Danish national database. Nordic products off the same shelf as ours, " +
      "which is why it comes before the larger tables."
  },
  usda: {
    label: "USDA SR Legacy",
    note: "Laboratory-analysed, ~7,800 foods, frozen in 2018. The long tail of plain " +
      "foods and imported sauces. Not the Branded Foods set, which is manufacturer " +
      "label data rather than analysis."
  },
  ciqual: {
    label: "Ciqual (ANSES, France)",
    note: "The French national table, taken only for the European cheeses it analyses " +
      "at source — a French Roquefort figure beats an American one."
  }
};

/* Empty for now. Foods that appear in neither file have no figures at all,
   and the meal builder will not let them into a meal — see meal.js. */
const NUTRITION_MANUAL = {};
