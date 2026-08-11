/* =========================================================================
   nutrition-ciqual.js — per 100g figures from France, GENERATED

       node tools/ciqual-audit.js <Table_Ciqual_*_ENG_*.xlsx> --write
       tools/ciqual-audit.html   (works on a phone)

   The third source on the ladder, for the foods neither Livsmedelsverket
   nor Frida has an entry for. Matched through tools/ciqual-aliases.json —
   confirmed by hand, one food at a time, the same way the other two are.
   Each entry records the Ciqual food it came from in `ref`.

   Ciqual carries no confidence code per value, so unlike the American
   file these figures are taken on the table's standing rather than
   tested one at a time. Where a figure was read off "traces" or a
   detection limit rather than measured, `ref` says so in brackets.

   Livsmedelsverket and Frida both still win wherever they have a figure:
   see tools/nutrition-core.js. Generated — never hand-edit it.

   8 foods, from: Table_Ciqual_2025_ENG_2025_11_03.xlsx
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
  "Porcini Mushrooms": {
    src: "ciqual", ref: "Cep or boletus mushroom, raw (Ciqual 20160)",
    values: { fat: 0.49, protein: 3.23, carbs: 2, fiber: 2.12, sugars: 1.28, alcohol: 0, water: 90.3, polyols: 0.45 }
  },
  "Raclette": {
    src: "ciqual", ref: "Raclette cheese, from cow's milk (Ciqual 12749) [carbs traces, sugars traces, lactose below 0,1]",
    values: { fat: 27.5, protein: 23.4, carbs: 0, fiber: 0, sugars: 0, alcohol: 0, water: 44.7, lactose: 0, polyols: 0 }
  },
  "Teriyaki Sauce": {
    src: "ciqual", ref: "Teriyaki sauce, prepacked (Ciqual 11301) [polyols traces]",
    values: { fat: 0.02, protein: 5.93, carbs: 16, fiber: 0.1, sugars: 14.1, alcohol: 0, water: 67.7, polyols: 0 }
  },
  "Vegan Cheese (Cashew)": {
    src: "ciqual", ref: "Plant-based cheese, with cashew, prepacked (Ciqual 1028) [lactose below 0,1]",
    values: { fat: 35.3, protein: 14.5, carbs: 15.2, fiber: 2.6, sugars: 0.28, alcohol: 0, water: 29.5, lactose: 0, polyols: 1 }
  }
};

const NUTRITION_CIQUAL_REFUSED = ["Truffle"];

/* Confirmed, but not imported — too little to be worth a place in a meal:
     Truffle — no carbs — a food with no figures at all is cleaner than one that holds a place in every meal and answers nothing
*/

/* Short of a full set, and why:
     Teriyaki Sauce — missing lactose (not in the file)
     Porcini Mushrooms — missing lactose (not in the file)
*/

/* The extras: lactose and polyols only, for foods Livsmedelsverket already
   answers. It publishes neither column for anything, so this is not a
   French figure beating a Swedish one — there is no Swedish one, and no
   Swedish round that could produce it. Every other figure on those foods
   stays Swedish, and nutrition-data.js marks each borrowed number in
   `borrowed`. Matched through tools/ciqual-extras.json. */

const NUTRITION_CIQUAL_EXTRAS = {
  "Aged Gouda": {
    src: "ciqual", ref: "Gouda cheese, from cow's milk (Ciqual 12736) [lactose below 0,05]",
    values: { lactose: 0, polyols: 0 }
  },
  "Apples": {
    src: "ciqual", ref: "Apple, Canada, flesh without skin, raw (Ciqual 13085)",
    values: { polyols: 0.59 }
  },
  "Blue Cheese": {
    src: "ciqual", ref: "Blue cheese, from cow's milk (Ciqual 12520) [lactose below 0,2]",
    values: { lactose: 0, polyols: 0 }
  },
  "Brie": {
    src: "ciqual", ref: "Brie cheese, from cow's milk (Ciqual 12020) [lactose below 0,2]",
    values: { lactose: 0, polyols: 0 }
  },
  "Butter": {
    src: "ciqual", ref: "Butter, 80% fat minimum, half-salted (Ciqual 16402)",
    values: { lactose: 0.5, polyols: 0 }
  },
  "Béarnaise Sauce": {
    src: "ciqual", ref: "Béarnaise sauce, prepacked (Ciqual 11102) [lactose below 0,2]",
    values: { lactose: 0, polyols: 0 }
  },
  "Camembert": {
    src: "ciqual", ref: "Camembert cheese, from cow's milk (Ciqual 12001) [lactose below 0,1]",
    values: { lactose: 0, polyols: 0 }
  },
  "Cheddar": {
    src: "ciqual", ref: "Cheddar cheese, from cow's milk (Ciqual 12726) [lactose below 0,01]",
    values: { lactose: 0, polyols: 0 }
  },
  "Cows Milk": {
    src: "ciqual", ref: "Milk, whole (average) (Ciqual 19016)",
    values: { lactose: 4.29, polyols: 0 }
  },
  "Cream": {
    src: "ciqual", ref: "Cream 30% fat, thick, refrigerated (Ciqual 19410)",
    values: { lactose: 1.38, polyols: 0 }
  },
  "Cream Cheese (<10% fat)": {
    src: "ciqual", ref: "Fresh cream cheese, petit-suisse type, plain, around 4% fat (Ciqual 19664)",
    values: { lactose: 3.02, polyols: 0 }
  },
  "Cream Cheese (>10% fat)": {
    src: "ciqual", ref: "Fresh cream cheese, petit-suisse type, plain, around 10% fat (Ciqual 19666)",
    values: { lactose: 2.61, polyols: 0 }
  },
  "Emmental": {
    src: "ciqual", ref: "Emmental cheese, from cow's milk (Ciqual 12115) [lactose below 0,1]",
    values: { lactose: 0, polyols: 0 }
  },
  "Feta Cheese": {
    src: "ciqual", ref: "Feta-type cheese, 100% from cow's milk (Ciqual 12060)",
    values: { lactose: 0.84, polyols: 0 }
  },
  "Flavored Yogurt": {
    src: "ciqual", ref: "Yoghurtor fermented milk, plain or with fruits (average) (Ciqual 19624)",
    values: { lactose: 3.19, polyols: 0.01 }
  },
  "Goats Milk": {
    src: "ciqual", ref: "Goat milk, whole, raw (Ciqual 19202)",
    values: { lactose: 4.01, polyols: 0 }
  },
  "Greek Yogurt (10% fat)": {
    src: "ciqual", ref: "Yogurt, Greek-style, ewe's milk (Ciqual 19550)",
    values: { lactose: 2.21, polyols: 0 }
  },
  "Hard Cheese (~15% fat)": {
    src: "ciqual", ref: "Hard cheese, emmental-type cheese, reduced fat, from cow's milk (Ciqual 12116) [lactose below 0,01]",
    values: { lactose: 0, polyols: 0 }
  },
  "Hard Cheese (~28-35% fat)": {
    src: "ciqual", ref: "Hard cheese (average) (Ciqual 12100) [lactose below 0,15]",
    values: { lactose: 0, polyols: 0 }
  },
  "Hollandaise Sauce": {
    src: "ciqual", ref: "Hollandaise sauce, prepacked (Ciqual 11105)",
    values: { lactose: 0.5, polyols: 0 }
  },
  "Hot Chocolate": {
    src: "ciqual", ref: "Chocolate mousse (milk-based), refrigerated (Ciqual 39206)",
    values: { lactose: 3.58, polyols: 0 }
  },
  "Ice Cream": {
    src: "ciqual", ref: "Ice cream, in box (Ciqual 39515) [polyols traces]",
    values: { lactose: 4.69, polyols: 0 }
  },
  "Kefir": {
    src: "ciqual", ref: "Milk kefir (Ciqual 19865)",
    values: { lactose: 3.38, polyols: 0 }
  },
  "Lactose-free Cheese": {
    src: "ciqual", ref: "Emmental cheese, from cow's milk, from Savoy (Ciqual 12099) [lactose below 0,1]",
    values: { lactose: 0, polyols: 0 }
  },
  "Lactose-free Cream": {
    src: "ciqual", ref: "Milk, semi-skimmed, UHT, reduced lactose (Ciqual 19060) [lactose below 0,2]",
    values: { lactose: 0, polyols: 0 }
  },
  "Lactose-free Milk": {
    src: "ciqual", ref: "Milk, semi-skimmed, UHT, reduced lactose (Ciqual 19060) [lactose below 0,2]",
    values: { lactose: 0, polyols: 0 }
  },
  "Lactose-free Yogurt": {
    src: "ciqual", ref: "Milk, semi-skimmed, UHT, reduced lactose (Ciqual 19060) [lactose below 0,2]",
    values: { lactose: 0, polyols: 0 }
  },
  "Mascarpone": {
    src: "ciqual", ref: "Mascarpone cheese, from cow's milk (Ciqual 19584)",
    values: { lactose: 2.99, polyols: 0 }
  },
  "Milk chocolate": {
    src: "ciqual", ref: "Milk chocolate, bar (Ciqual 31004) [polyols traces]",
    values: { lactose: 11.5, polyols: 0 }
  },
  "Mozzarella": {
    src: "ciqual", ref: "Mozzarella cheese, from cow's milk (Ciqual 19590)",
    values: { lactose: 0.7, polyols: 0 }
  },
  "Parmesan": {
    src: "ciqual", ref: "Parmesan cheese, from cow's milk (Ciqual 12120) [lactose below 0,1]",
    values: { lactose: 0, polyols: 0 }
  },
  "Pesto": {
    src: "ciqual", ref: "Pesto sauce, prepacked (Ciqual 11179) [polyols below 0,5]",
    values: { lactose: 1, polyols: 0 }
  },
  "Quark (~1%)": {
    src: "ciqual", ref: "Quark, plain, 0% fat (Ciqual 19644)",
    values: { lactose: 2.41, polyols: 0 }
  },
  "Quark (~10%)": {
    src: "ciqual", ref: "Quark, plain, 7-8% fat (Ciqual 19711)",
    values: { lactose: 3.67, polyols: 0 }
  },
  "Ricotta Cheese": {
    src: "ciqual", ref: "Ricotta cheese, from cow's milk (Ciqual 19585)",
    values: { lactose: 3.48, polyols: 0 }
  },
  "Sheeps Milk": {
    src: "ciqual", ref: "Sheep milk, whole (Ciqual 19250)",
    values: { lactose: 4.5, polyols: 0 }
  },
  "Tzatziki": {
    src: "ciqual", ref: "Tzatziki, with yogurt, prepacked (Ciqual 19863) [polyols traces]",
    values: { lactose: 1.9, polyols: 0 }
  },
  "Yoghurt 3%": {
    src: "ciqual", ref: "Yoghurt or fermented milk, plain (average) (Ciqual 19600)",
    values: { lactose: 3.21, polyols: 0 }
  },
  "Yogurt": {
    src: "ciqual", ref: "Yoghurt or fermented milk, plain (average) (Ciqual 19600)",
    values: { lactose: 3.21, polyols: 0 }
  }
};
