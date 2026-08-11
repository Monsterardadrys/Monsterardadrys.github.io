/* =========================================================================
   nutrition-ciqual.js — per 100g figures from France, GENERATED

       node tools/ciqual-audit.js <Table_Ciqual_*_ENG_*.xlsx> --write
       tools/ciqual-audit.html   (works on a phone)

   Third on the ladder — below Frida, above USDA — for the foods neither
   Livsmedelsverket nor Denmark has an entry for. Matched through
   tools/ciqual-aliases.json, confirmed by hand one food at a time. Each
   entry records the Ciqual food it came from in `ref`.

   Ciqual carries no confidence code per value, so unlike the American
   file these figures are taken on the table's standing rather than tested
   one at a time. Where a figure was read off "traces" or a detection
   limit rather than measured, `ref` says so in square brackets.

   Livsmedelsverket and Frida both still win wherever they have a figure:
   see tools/nutrition-core.js. Generated — never hand-edit it.

   6 foods, from: 31814c73-Table_Ciqual_2025_ENG_2025_11_03.xlsx
   ========================================================================= */

const NUTRITION_CIQUAL = {
  "Butter Beans": {
    src: "ciqual", ref: "Butter bean or yellow bean, boiled/cooked in water (Ciqual 20318) [lactose below 0,2, polyols below 0,5]",
    values: { fat: 0.3, protein: 2.19, carbs: 4.45, fiber: 2.7, sugars: 2.2, alcohol: 0, water: 89.6, lactose: 0, polyols: 0 }
  },
  "Corn Tortilla": {
    src: "ciqual", ref: "Maize/corn tortilla wrap, to be filled (Ciqual 7813) [lactose below 0,2]",
    values: { fat: 5.57, protein: 6.08, carbs: 58, fiber: 3.57, sugars: 2.37, alcohol: 0, water: 26, lactose: 0, polyols: 0 }
  },
  "Harissa": {
    src: "ciqual", ref: "Harissa (hot spicy sauce), prepacked (Ciqual 11112) [lactose below 0,5, polyols traces]",
    values: { fat: 2.9, protein: 2.72, carbs: 7.3, fiber: 5.1, sugars: 6.89, alcohol: 0, water: 77.9, lactose: 0, polyols: 0 }
  },
  "Kombucha": {
    src: "ciqual", ref: "Kombucha, prepacked (Ciqual 18025) [fat below 0,3, fiber below 0,5, lactose below 0,1]",
    values: { fat: 0, protein: 0.25, carbs: 1.45, fiber: 0, sugars: 1.45, alcohol: 0, water: 97.6, lactose: 0, polyols: 0 }
  },
  "Raclette": {
    src: "ciqual", ref: "Raclette cheese, from cow's milk (Ciqual 12749) [carbs traces, sugars traces, lactose below 0,1]",
    values: { fat: 27.5, protein: 23.4, carbs: 0, fiber: 0, sugars: 0, alcohol: 0, water: 44.7, lactose: 0, polyols: 0 }
  },
  "Teriyaki Sauce": {
    src: "ciqual", ref: "Teriyaki sauce, prepacked (Ciqual 11301) [polyols traces]",
    values: { fat: 0.02, protein: 5.93, carbs: 16, fiber: 0.1, sugars: 14.1, alcohol: 0, water: 67.7, polyols: 0 }
  }
};

const NUTRITION_CIQUAL_REFUSED = [];

/* Short of a full set, and why:
     Teriyaki Sauce — missing lactose (not in the file)
*/
