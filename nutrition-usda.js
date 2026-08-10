/* =========================================================================
   nutrition-usda.js — per 100g figures from the United States, GENERATED

       node tools/usda-audit.js <FoodData_Central_*.json> --write
       tools/usda-audit.html   (works on a phone)

   The third source on the ladder, for the foods neither Livsmedelsverket
   nor Frida has an entry for. Matched through tools/usda-aliases.json —
   confirmed by hand, one food at a time, the same way the other two are.
   Each entry records the USDA food it came from in `ref`.

   Figures are taken per figure, not per food: anything a manufacturer
   supplied, anything read off a label and anything estimated from a recipe
   is dropped by tools/usda-core.js before it reaches here. So an entry
   below may carry fewer fields than a Swedish or Danish one, and the
   missing ones are missing on purpose.

   Livsmedelsverket and Frida both still win wherever they have a figure:
   see tools/nutrition-core.js. Generated — never hand-edit it.

   36 foods, from: FoodData_Central_sr_legacy_food_json_2018-04.json
   ========================================================================= */

const NUTRITION_USDA = {
  "Adzuki Beans": {
    src: "usda", ref: "Beans, adzuki, mature seeds, cooked, boiled, without salt (FDC 173728, SR Legacy)",
    values: { fat: 0.1, protein: 7.52, carbs: 24.8, water: 66.3 }
  },
  "Agave Syrup": {
    src: "usda", ref: "Sweetener, syrup, agave (FDC 170277, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 0.45, protein: 0.09, carbs: 76.4, fiber: 0.2, sugars: 68, alcohol: 0, water: 22.9 }
  },
  "Allspice": {
    src: "usda", ref: "Spices, allspice, ground (FDC 171315, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 8.69, protein: 6.09, carbs: 72.1, fiber: 21.6, alcohol: 0, water: 8.46 }
  },
  "Basil (dried)": {
    src: "usda", ref: "Spices, basil, dried (FDC 171317, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 4.07, protein: 23, carbs: 47.8, fiber: 37.7, sugars: 1.71, alcohol: 0, water: 10.4 }
  },
  "Capers": {
    src: "usda", ref: "Capers, canned (FDC 172238, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 0.86, protein: 2.36, carbs: 4.89, fiber: 3.2, alcohol: 0, water: 83.8 }
  },
  "Cranberry Sauce": {
    src: "usda", ref: "Cranberry sauce, canned, sweetened (FDC 173961, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 0.15, protein: 0.9, carbs: 40.4, fiber: 1.1, sugars: 31.8, alcohol: 0, water: 58.4 }
  },
  "Dill (dried)": {
    src: "usda", ref: "Spices, dill weed, dried (FDC 171322, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 4.36, protein: 20, carbs: 55.8, fiber: 13.6, water: 7.3 }
  },
  "Durian": {
    src: "usda", ref: "Durian, raw or frozen (FDC 168192, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 5.33, protein: 1.47, carbs: 27.1, fiber: 3.8, water: 65 }
  },
  "Fontina": {
    src: "usda", ref: "Cheese, fontina (FDC 170843, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 31.1, protein: 25.6, carbs: 1.55, fiber: 0, alcohol: 0, water: 37.9 }
  },
  "Ginger (dried)": {
    src: "usda", ref: "Spices, ginger, ground (FDC 170926, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 4.24, protein: 8.98, carbs: 71.6, fiber: 14.1, sugars: 3.39, alcohol: 0, water: 9.94 }
  },
  "Hoisin Sauce": {
    src: "usda", ref: "Sauce, hoisin, ready-to-serve (FDC 172886, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 3.39, protein: 3.31, carbs: 44.1, fiber: 2.8, alcohol: 0, water: 44.2 }
  },
  "Horseradish Sauce": {
    src: "usda", ref: "Sauce, horseradish (FDC 171833, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 50.9, protein: 1.09, carbs: 10, fiber: 1, sugars: 8.98, water: 35.8 }
  },
  "Lotus Root": {
    src: "usda", ref: "Lotus root, raw (FDC 169250, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 0.1, protein: 2.6, carbs: 17.2, fiber: 4.9, water: 79.1 }
  },
  "Maitake Mushrooms": {
    src: "usda", ref: "Mushrooms, maitake, raw (FDC 169403, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 0.19, protein: 1.94, carbs: 6.97, fiber: 2.7, sugars: 2.07, alcohol: 0, water: 90.4 }
  },
  "Maple Syrup": {
    src: "usda", ref: "Syrup, maple, Canadian (FDC 170276, SR Legacy)",
    values: { fat: 0, protein: 0, carbs: 67.4, water: 32.2 }
  },
  "Mint (dried)": {
    src: "usda", ref: "Spearmint, dried (FDC 172239, SR Legacy)",
    values: { fat: 6.03, protein: 19.9, carbs: 52, water: 11.3 }
  },
  "Mint (fresh)": {
    src: "usda", ref: "Spearmint, fresh (FDC 173475, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 0.73, protein: 3.29, carbs: 8.41, fiber: 6.8, water: 85.6 }
  },
  "Morel Mushrooms": {
    src: "usda", ref: "Mushrooms, morel, raw (FDC 168423, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 0.57, protein: 3.12, carbs: 5.1, fiber: 2.8, sugars: 0.6, water: 89.6 }
  },
  "Naan Bread": {
    src: "usda", ref: "Bread, naan, plain, commercially prepared, refrigerated (FDC 171845, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 5.65, protein: 9.62, carbs: 50.4, fiber: 2.2, sugars: 3.55, water: 32.6 }
  },
  "Natto": {
    src: "usda", ref: "Natto (FDC 172443, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 11, protein: 19.4, carbs: 12.7, fiber: 5.4, alcohol: 0, water: 55 }
  },
  "Oregano (dried)": {
    src: "usda", ref: "Spices, oregano, dried (FDC 171328, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 4.28, protein: 9, carbs: 68.9, fiber: 42.5, sugars: 4.09, alcohol: 0, water: 9.93 }
  },
  "Oyster Sauce": {
    src: "usda", ref: "Sauce, oyster, ready-to-serve (FDC 174529, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 0.25, protein: 1.35, carbs: 10.9, fiber: 0.3, alcohol: 0, water: 80 }
  },
  "Paprika Powder": {
    src: "usda", ref: "Spices, paprika (FDC 171329, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 12.9, protein: 14.1, carbs: 54, fiber: 34.9, sugars: 10.3, alcohol: 0, water: 11.2 }
  },
  "Pickle Relish": {
    src: "usda", ref: "Pickle relish, sweet (FDC 168561, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 0.47, protein: 0.37, carbs: 35.1, fiber: 1.1, alcohol: 0, water: 62.1 }
  },
  "Pickled Ginger": {
    src: "usda", ref: "Ginger root, pickled, canned, with artificial sweetener (FDC 169765, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 0.1, protein: 0.33, carbs: 4.83, fiber: 2.6, sugars: 0, alcohol: 0, water: 92.3 }
  },
  "Rosemary (dried)": {
    src: "usda", ref: "Spices, rosemary, dried (FDC 171333, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 15.2, protein: 4.88, carbs: 64.1, fiber: 42.6, alcohol: 0, water: 9.31 }
  },
  "Rosemary (fresh)": {
    src: "usda", ref: "Rosemary, fresh (FDC 173473, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 5.86, protein: 3.31, carbs: 20.7, fiber: 14.1, water: 67.8 }
  },
  "Sheeps Milk": {
    src: "usda", ref: "Milk, sheep, fluid (FDC 170882, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 7, protein: 5.98, carbs: 5.36, fiber: 0, water: 80.7 }
  },
  "Soba Noodles": {
    src: "usda", ref: "Noodles, japanese, soba, cooked (FDC 168907, SR Legacy)",
    values: { fat: 0.1, protein: 5.06, carbs: 21.4, water: 73 }
  },
  "Sourdough Bread (wheat)": {
    src: "usda", ref: "Bread, french or vienna (includes sourdough) (FDC 172675, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 2.42, protein: 10.8, carbs: 51.9, fiber: 2.2, sugars: 4.62, water: 33 }
  },
  "Sunflower Seed Butter": {
    src: "usda", ref: "Seeds, sunflower seed butter, with salt added (Includes foods for USDA's Food Distribution Program) (FDC 168595, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 55.2, protein: 17.3, carbs: 23.3, fiber: 5.7, sugars: 10.5, water: 0.62 }
  },
  "Tapioca": {
    src: "usda", ref: "Tapioca, pearl, dry (FDC 169717, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 0.02, protein: 0.19, carbs: 88.7, fiber: 0.9, alcohol: 0, water: 11 }
  },
  "Taro": {
    src: "usda", ref: "Taro, cooked, without salt (FDC 168486, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 0.11, protein: 0.52, carbs: 34.6, fiber: 5.1, alcohol: 0, water: 63.8 }
  },
  "Thyme (dried)": {
    src: "usda", ref: "Spices, thyme, dried (FDC 170938, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 7.43, protein: 9.11, carbs: 63.9, fiber: 37, alcohol: 0, water: 7.79 }
  },
  "Thyme (fresh)": {
    src: "usda", ref: "Thyme, fresh (FDC 173470, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 1.68, protein: 5.56, carbs: 24.4, fiber: 14, water: 65.1 }
  },
  "Tofu (silken)": {
    src: "usda", ref: "Tofu, soft, prepared with calcium sulfate and magnesium chloride (nigari) (FDC 172449, SR Legacy, fibre AOAC 991.43)",
    values: { fat: 3.69, protein: 7.17, carbs: 1.18, fiber: 0.2, sugars: 0.7, alcohol: 0, water: 87.3 }
  }
};

/* Confirmed, but not imported — too little to be worth a place in a meal:
     Currants (dried) — no fat
     Enoki Mushrooms — no water
     Kimchi — no fat, protein, water
     Teriyaki Sauce — no fat
     Worcestershire Sauce — no water
   A food with no figures at all is cleaner than one that holds a place in
   every meal and answers nothing. See REQUIRED in tools/usda-core.js.
*/

/* Short of a full set, and why:
     Lotus Root — missing sugars (not in the file), alcohol (not in the file)
     Taro — missing sugars (taken from another form of the food)
     Durian — missing sugars (not in the file), alcohol (not in the file)
     Sunflower Seed Butter — missing alcohol (not in the file)
     Naan Bread — missing alcohol (not in the file)
     Soba Noodles — missing fiber (not in the file), sugars (not in the file), alcohol (not in the file)
     Tapioca — missing sugars (taken from another form of the food)
     Sourdough Bread (wheat) — missing alcohol (estimated formulation based on ingredient list; linear program used to estimate ingredients; claim on label/serving)
     Adzuki Beans — missing fiber (taken from another form of the food), sugars (not in the file), alcohol (not in the file)
     Sheeps Milk — missing sugars (not in the file), alcohol (not in the file)
     Fontina — missing sugars (copied from another nutrient)
     Dill (dried) — missing sugars (not in the file), alcohol (not in the file)
     Thyme (dried) — missing sugars (taken from another form of the food)
     Thyme (fresh) — missing sugars (not in the file), alcohol (not in the file)
     Rosemary (dried) — missing sugars (not in the file)
     Rosemary (fresh) — missing sugars (not in the file), alcohol (not in the file)
     Mint (fresh) — missing sugars (not in the file), alcohol (not in the file)
     Mint (dried) — missing fiber (manufacturer supplied, incomplete documentation), sugars (not in the file), alcohol (not in the file)
     Allspice — missing sugars (not in the file)
     Maple Syrup — missing fiber (taken from another source--other tables of food composition), sugars (taken from another source--other tables of food composition), alcohol (not in the file)
     Horseradish Sauce — missing alcohol (estimated from the ingredient list)
     Hoisin Sauce — missing sugars (estimated from the ingredient list)
     Oyster Sauce — missing sugars (estimated from the ingredient list)
     Morel Mushrooms — missing alcohol (not in the file)
     Pickle Relish — missing sugars (taken from another form of the food)
     Capers — missing sugars (taken from another form of the food)
     Natto — missing sugars (taken from another form of the food)
*/
