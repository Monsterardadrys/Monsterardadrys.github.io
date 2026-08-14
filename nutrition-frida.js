/* =========================================================================
   nutrition-frida.js — per 100g figures from Denmark, GENERATED

       node tools/frida-audit.js <FCDB_dataset.xlsx> --write

   The second source on the ladder, for the foods Livsmedelsverket has no
   entry for. Matched through tools/frida-aliases.json — confirmed by hand,
   one food at a time, the same way the Swedish matches are. Each entry
   records the Frida food it came from in `ref`.

   Livsmedelsverket still wins wherever both have a figure: see
   tools/nutrition-core.js. Generated — never hand-edit it.

   30 foods, from: FCDB_6.1_Dataset.xlsx
   ========================================================================= */

const NUTRITION_FRIDA = {
  "Adzuki Bean Sprouts": {
    src: "frida", ref: "Bean, adzuki, sprouted, raw (Frida 384)",
    values: { fat: 0.18, protein: 10, carbs: 19.62, fiber: 5.2, sugars: 0.8, alcohol: 0, water: 64.2 }
  },
  "Barbecue Sauce": {
    src: "frida", ref: "Sauce, barbeque (Frida 459)",
    values: { fat: 0.29, protein: 0, carbs: 35.76, fiber: 0.5, sugars: 33.24, alcohol: 0, water: 60.34 }
  },
  "Black Pepper": {
    src: "frida", ref: "Pepper, black (Frida 236)",
    values: { fat: 3.26, protein: 10.95, carbs: 44.45, fiber: 26.5, sugars: 0.6, alcohol: 0, water: 10.51 }
  },
  "Black Tea": {
    src: "frida", ref: "Tea, ready-to-drink (Frida 115)",
    values: { fat: 0, protein: 0, carbs: 0, fiber: 0, sugars: 0, alcohol: 0, water: 99.9 }
  },
  "Canned Strawberries in Syrup": {
    src: "frida", ref: "Strawberries, canned (Frida 497)",
    values: { fat: 0.4, protein: 0.4, carbs: 18.59, fiber: 0.91, sugars: 20.1, alcohol: 0, water: 79.4 }
  },
  "Cassava": {
    src: "frida", ref: "Cassava, raw (Frida 939)",
    values: { fat: 0.28, protein: 1.36, carbs: 36.26, fiber: 1.8, sugars: 1.5, alcohol: 0, water: 59.68 }
  },
  "Chai Tea": {
    src: "frida", ref: "Tea, ready-to-drink (Frida 115)",
    values: { fat: 0, protein: 0, carbs: 0, fiber: 0, sugars: 0, alcohol: 0, water: 99.9 }
  },
  "Chamomile Tea": {
    src: "frida", ref: "Tea, ready-to-drink (Frida 115)",
    values: { fat: 0, protein: 0, carbs: 0, fiber: 0, sugars: 0, alcohol: 0, water: 99.9 }
  },
  "Champagne": {
    src: "frida", ref: "Wine, white, sparkling, champagne (Frida 246)",
    values: { fat: 0, protein: 0.3, carbs: 1.4, fiber: 0, sugars: 1.4, alcohol: 9.9, water: 88.2 }
  },
  "Curry Powder": {
    src: "frida", ref: "Curry powder (Frida 657)",
    values: { fat: 13.81, protein: 12.7, carbs: 5.42, fiber: 53, sugars: 2.8, alcohol: 0, water: 9.5 }
  },
  "Dumplings": {
    src: "frida", ref: "Dumplings, frozen (Frida 1406)",
    values: { fat: 14, protein: 7, carbs: 13.65, fiber: 1.1, sugars: 0.2, alcohol: 0, water: 63 }
  },
  "Garlic Powder": {
    src: "frida", ref: "Garlic, dried, powder (Frida 650)",
    values: { fat: 0.8, protein: 16.8, carbs: 62.7, fiber: 9.9, sugars: 2.4, alcohol: 0, water: 6.5 }
  },
  "Goats Milk": {
    src: "frida", ref: "Goat milk (Frida 1320)",
    values: { fat: 4.14, protein: 3.56, carbs: 4.45, fiber: 0, sugars: 4.4, alcohol: 0, water: 87.03 }
  },
  "Green Tea": {
    src: "frida", ref: "Tea, ready-to-drink (Frida 115)",
    values: { fat: 0, protein: 0, carbs: 0, fiber: 0, sugars: 0, alcohol: 0, water: 99.9 }
  },
  "Matcha": {
    src: "frida", ref: "Tea, leaves (Frida 537)",
    values: { fat: 2, protein: 19.6, carbs: 6.3, fiber: 55.8, sugars: 3, alcohol: 0, water: 9.3 }
  },
  "Mate Tea": {
    src: "frida", ref: "Tea, ready-to-drink (Frida 115)",
    values: { fat: 0, protein: 0, carbs: 0, fiber: 0, sugars: 0, alcohol: 0, water: 99.9 }
  },
  "Peppermint Tea": {
    src: "frida", ref: "Tea, ready-to-drink (Frida 115)",
    values: { fat: 0, protein: 0, carbs: 0, fiber: 0, sugars: 0, alcohol: 0, water: 99.9 }
  },
  "Pickled Jalapeno": {
    src: "frida", ref: "Pepper, hot chili, canned (Frida 470)",
    values: { fat: 0.1, protein: 0.9, carbs: 4.9, fiber: 1.2, sugars: 5.1, alcohol: 0, water: 92.5 }
  },
  "Pine Nuts": {
    src: "frida", ref: "Pine nuts, dried (Frida 806)",
    values: { fat: 61.9, protein: 13.99, carbs: 13.03, fiber: 6.35, sugars: 4.85, alcohol: 0, water: 2.19, lactose: 0 }
  },
  "Rice Cakes": {
    src: "frida", ref: "Rice cake/cracker, puffed brown rice, plain (Frida 1748)",
    values: { fat: 2.8, protein: 8.2, carbs: 77.3, fiber: 4.2, sugars: 0.89, alcohol: 0, water: 5.8 }
  },
  "Roquefort": {
    src: "frida", ref: "Cheese, Roquefort, Danish, 50 % fidm. (Frida 136)",
    values: { fat: 29.5, protein: 19.36, carbs: 0, fiber: 0, sugars: 0.12, alcohol: 0, water: 44.7, lactose: 0.12 }
  },
  "Salty Liquorice": {
    src: "frida", ref: "Liquorice, salt (Frida 1114)",
    values: { fat: 1, protein: 6.7, carbs: 76.65, fiber: 3.1, sugars: 43.4, alcohol: 0, water: 10.4 }
  },
  "Seitan": {
    src: "frida", ref: "Seitan (Frida 1784)",
    values: { fat: 7.16, protein: 26.46, carbs: 5.07, fiber: 2.15, sugars: 0.48, alcohol: 0, water: 57.2, lactose: 0 }
  },
  "Skyr": {
    src: "frida", ref: "Skyr, 0.2 % fat (Frida 1693)",
    values: { fat: 0.2, protein: 11, carbs: 6.05, fiber: 0, sugars: 4, alcohol: 0, water: 82 }
  },
  "Spring Onion": {
    src: "frida", ref: "Onions, spring, raw (Frida 740)",
    values: { fat: 0.19, protein: 1.83, carbs: 4.74, fiber: 2.6, sugars: 2.8, alcohol: 0, water: 89.83 }
  },
  "Tamarind": {
    src: "frida", ref: "Tamarind, Indian date, raw (Frida 222)",
    values: { fat: 0.6, protein: 2.8, carbs: 57.4, fiber: 5.1, sugars: 38.8, alcohol: 0, water: 31.4 }
  },
  "Vegan Mayonnaise": {
    src: "frida", ref: "Mayonnaise, vegan (Frida 1967)",
    values: { fat: 63.5, protein: 0.38, carbs: 5.51, fiber: 0, sugars: 2.3, alcohol: 0, water: 29.18, lactose: 0 }
  },
  "Vinegar": {
    src: "frida", ref: "Vinegar (Frida 226)",
    values: { fat: 0, protein: 0.4, carbs: 0.4, fiber: 0, sugars: 0.6, alcohol: 0.2, water: 93.7 }
  },
  "Whey Protein": {
    src: "frida", ref: "Whey protein powder (Frida 1747)",
    values: { fat: 5.13, protein: 66.67, carbs: 17.94, fiber: 0, sugars: 11.52, alcohol: 0, water: 6.61 }
  },
  "Yeast Extract (Marmite type)": {
    src: "frida", ref: "Yeast extract, Marmite (Frida 1207)",
    values: { fat: 0.6, protein: 27.8, carbs: 8.2, fiber: 3, sugars: 0, alcohol: 0, water: 37 }
  }
};

/* The extras: lactose only, for foods Livsmedelsverket already answers.
   It publishes no lactose column for anything, so this is not a Danish
   figure beating a Swedish one — there is no Swedish one, and no Swedish
   round that could produce it. Every other figure on those foods stays
   Swedish, and nutrition-data.js marks each borrowed number in
   `borrowed`. Matched through tools/frida-extras.json. */

const NUTRITION_FRIDA_EXTRAS = {
  "Blue Cheese": {
    src: "frida", ref: "Cheese, Danish Blue, 50 % fidm. (Frida 138)",
    values: { lactose: 0 }
  },
  "Brie": {
    src: "frida", ref: "Cheese, Brie, 60 % fidm. (Frida 139)",
    values: { lactose: 0 }
  },
  "Butter": {
    src: "frida", ref: "Butter, salt added (Frida 1052)",
    values: { lactose: 0.57 }
  },
  "Buttermilk": {
    src: "frida", ref: "Milk, buttermilk (Frida 32)",
    values: { lactose: 3.67 }
  },
  "Camembert": {
    src: "frida", ref: "Cheese, Camembert, 45 % fidm. (Frida 1235)",
    values: { lactose: 0.1 }
  },
  "Cheddar": {
    src: "frida", ref: "Cheese, hard, Cheddar, Danish (Frida 321)",
    values: { lactose: 0 }
  },
  "Cottage Cheese (4% fat)": {
    src: "frida", ref: "Cheese, cottage, 20 % fidm. (Frida 517)",
    values: { lactose: 2.5 }
  },
  "Cows Milk (3% fat)": {
    src: "frida", ref: "Milk, whole, konventional (not organic), 3.5 % fat (Frida 6)",
    values: { lactose: 4.6 }
  },
  "Emmental": {
    src: "frida", ref: "Cheese, hard, Emmentaler, 45 % fidm. (Frida 261)",
    values: { lactose: 0 }
  },
  "Feta Cheese": {
    src: "frida", ref: "Cheese, semihard, Feta, 40 % fidm (Frida 73)",
    values: { lactose: 0.16 }
  },
  "Flavored Yogurt": {
    src: "frida", ref: "Yogurt, with fruit, 1.5 % fat (Frida 1169)",
    values: { lactose: 2.55 }
  },
  "Greek Yogurt (10% fat)": {
    src: "frida", ref: "Cream yoghurt, plain, 10% fat (Greek and Turkish style) (Frida 1764)",
    values: { lactose: 2.95 }
  },
  "Hard Cheese (~28-35% fat)": {
    src: "frida", ref: "Cheese, hard, Cheddar, Danish (Frida 321)",
    values: { lactose: 0 }
  },
  "Ice Cream": {
    src: "frida", ref: "Chocolate ice cream (Frida 1921)",
    values: { lactose: 3.35 }
  },
  "Kefir": {
    src: "frida", ref: "Milk, 1.5 % fat, cultured, kefir (Frida 1153)",
    values: { lactose: 3.78 }
  },
  "Milk chocolate": {
    src: "frida", ref: "Chocolate, milk (Frida 675)",
    values: { lactose: 7.4 }
  },
  "Mozzarella": {
    src: "frida", ref: "Cheese, semihard, Mozzarella, 45 % fidm. (Frida 97)",
    values: { lactose: 0 }
  },
  "Parmesan": {
    src: "frida", ref: "Cheese, hard, Parmesan, 32 % fidm. (Frida 309)",
    values: { lactose: 0 }
  },
  "Yogurt (0.5% fat)": {
    src: "frida", ref: "Yogurt low fat, 0.1 % fat (Frida 1598)",
    values: { lactose: 2.8 }
  },
  "Yogurt (3% fat)": {
    src: "frida", ref: "Yogurt plain, whole milk (Frida 12)",
    values: { lactose: 2.5 }
  }
};

/* Picked and carrying nothing to lend:
     Cinnamon Bun — the Danish record carries no lactose figure
*/
