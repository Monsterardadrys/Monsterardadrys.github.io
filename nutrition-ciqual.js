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

   83 foods, from: Table_Ciqual_2025_ENG_2025_11_03.xlsx
   ========================================================================= */

const NUTRITION_CIQUAL = {
  "Almond Thins": {
    src: "ciqual", ref: "Biscuit (cookie), thin, with almonds (Ciqual 24615)",
    values: { fat: 18.1, protein: 7.8, carbs: 68, fiber: 2.1, sugars: 49.1, alcohol: 0, water: 3.2, polyols: 0 }
  },
  "Apricot Jam": {
    src: "ciqual", ref: "Jam, apricot (Ciqual 31037)",
    values: { fat: 0.3, protein: 0.25, carbs: 59.7, fiber: 1.1, sugars: 56.8, alcohol: 0, water: 39.2, lactose: 0, polyols: 0 }
  },
  "Beaufort": {
    src: "ciqual", ref: "Beaufort cheese, from cow's milk (Ciqual 12105)",
    values: { fat: 33, protein: 26.7, carbs: 0.72, fiber: 0.06, sugars: 0.1, alcohol: 0, water: 34.3, polyols: 0 }
  },
  "Beef Kidney": {
    src: "ciqual", ref: "Kidney, beef, cooked (Ciqual 40403)",
    values: { fat: 7, protein: 27, carbs: 0, fiber: 0, sugars: 0, alcohol: 0, water: 66.9, polyols: 0 }
  },
  "Biscuit (reduced fat)": {
    src: "ciqual", ref: "Biscuit (cookie), without chocolate, reduced fat (Ciqual 24031)",
    values: { fat: 6, protein: 6, carbs: 71, fiber: 13, sugars: 35, alcohol: 0, water: 1.5, lactose: 0, polyols: 0 }
  },
  "Blackberry Jelly": {
    src: "ciqual", ref: "Jelly, blackberry (Ciqual 30991)",
    values: { fat: 0.28, protein: 0.53, carbs: 60, fiber: 0.73, sugars: 57.4, alcohol: 0, water: 37.2, lactose: 0, polyols: 0 }
  },
  "Blueberry Jam": {
    src: "ciqual", ref: "Jam, blueberry (Ciqual 31068)",
    values: { fat: 0.4, protein: 0.25, carbs: 58.9, fiber: 2.1, sugars: 58.9, alcohol: 0, water: 37.8, lactose: 0, polyols: 0 }
  },
  "Butter Beans": {
    src: "ciqual", ref: "Butter bean or yellow bean, boiled/cooked in water (Ciqual 20318) [lactose below 0,2, polyols below 0,5]",
    values: { fat: 0.3, protein: 2.19, carbs: 4.45, fiber: 2.7, sugars: 2.2, alcohol: 0, water: 89.6, lactose: 0, polyols: 0 }
  },
  "Candied Chestnut": {
    src: "ciqual", ref: "Candied chestnut (Ciqual 31023)",
    values: { fat: 0.54, protein: 0.89, carbs: 77.5, fiber: 2.67, sugars: 55.3, alcohol: 0, water: 18.2, lactose: 0, polyols: 1.5 }
  },
  "Candied Fruit": {
    src: "ciqual", ref: "Candied fruit (Ciqual 31027)",
    values: { fat: 0.06, protein: 0.25, carbs: 72.4, fiber: 3.3, sugars: 62.9, alcohol: 0, water: 23.5, lactose: 0, polyols: 0 }
  },
  "Candied Orange Peel": {
    src: "ciqual", ref: "Candied orange peel (Ciqual 31021)",
    values: { fat: 0.08, protein: 0.59, carbs: 75.6, fiber: 1.1, sugars: 65.2, alcohol: 0, water: 16, polyols: 0 }
  },
  "Caramel Hard Candy": {
    src: "ciqual", ref: "Hard candy, caramel (Ciqual 31094)",
    values: { fat: 7.09, protein: 1.33, carbs: 86.6, fiber: 0.13, sugars: 72.7, alcohol: 0, water: 2.7, polyols: 0 }
  },
  "Cherry Jam": {
    src: "ciqual", ref: "Jam, cherry (Ciqual 31038)",
    values: { fat: 0.19, protein: 0.48, carbs: 58.1, fiber: 1.1, sugars: 57.5, alcohol: 0, water: 39.5, lactose: 0, polyols: 0 }
  },
  "Chewy Caramel": {
    src: "ciqual", ref: "Chewy candy, caramel (Ciqual 31081)",
    values: { fat: 9.98, protein: 2.23, carbs: 79.1, fiber: 0.19, sugars: 59.8, alcohol: 0, water: 1.42, lactose: 2.4, polyols: 0 }
  },
  "Chicken Liver": {
    src: "ciqual", ref: "Liver, chicken, cooked (Ciqual 40116)",
    values: { fat: 6.51, protein: 24.5, carbs: 0.86, fiber: 0, sugars: 0, alcohol: 0, water: 66.8, polyols: 0 }
  },
  "Chocolate Bar with Dried Fruit": {
    src: "ciqual", ref: "Chocolate bar with dried fruits (Ciqual 31071)",
    values: { fat: 26, protein: 7.23, carbs: 57.6, fiber: 1.53, sugars: 45.1, alcohol: 0, water: 4.42, lactose: 6.77, polyols: 1.69 }
  },
  "Chocolate Chip Biscuit": {
    src: "ciqual", ref: "Butter biscuit (cookie), with chocolate (chocolate chips or covering) (Ciqual 24017)",
    values: { fat: 22.8, protein: 6.88, carbs: 63.8, fiber: 4, sugars: 35.4, alcohol: 0, water: 1, lactose: 4.62, polyols: 0 }
  },
  "Chocolate Spread (hazelnut)": {
    src: "ciqual", ref: "Chocolate spread with hazelnuts (Ciqual 31032)",
    values: { fat: 32.4, protein: 5.02, carbs: 57.9, fiber: 3.23, sugars: 56.2, alcohol: 0, water: 0.38, lactose: 6.13 }
  },
  "Coconut Chocolate Bar": {
    src: "ciqual", ref: "Coconut bar, chocolate-coated (Ciqual 31002)",
    values: { fat: 23.8, protein: 3.88, carbs: 60.2, fiber: 3, sugars: 53, alcohol: 0, water: 7.83, lactose: 3.8, polyols: 0.81 }
  },
  "Cod Liver (canned)": {
    src: "ciqual", ref: "Cod liver, canned, drained (Ciqual 26142)",
    values: { fat: 44.4, protein: 7.25, carbs: 1, fiber: 0, sugars: 0, alcohol: 0, water: 45.7, lactose: 0, polyols: 0 }
  },
  "Cod Liver Oil": {
    src: "ciqual", ref: "Cod liver oil (Ciqual 17630)",
    values: { fat: 100, protein: 0, carbs: 0, fiber: 0, sugars: 0, alcohol: 0, water: 0, lactose: 0, polyols: 0 }
  },
  "Corn Tortilla": {
    src: "ciqual", ref: "Maize/corn tortilla wrap, to be filled (Ciqual 7813) [lactose below 0,2]",
    values: { fat: 5.57, protein: 6.08, carbs: 58, fiber: 3.57, sugars: 2.37, alcohol: 0, water: 26, lactose: 0, polyols: 0 }
  },
  "Dark Chocolate with Nuts": {
    src: "ciqual", ref: "Dark chocolate, with dried fruits (nuts, almonds, raisin, praliné), bar (Ciqual 31070)",
    values: { fat: 39, protein: 8.69, carbs: 40.7, fiber: 8.4, sugars: 38.2, alcohol: 0, water: 0.9, lactose: 0.21, polyols: 0 }
  },
  "Dark Chocolate with Praline": {
    src: "ciqual", ref: "Dark chocolate, filled with praliné, bar (Ciqual 31080)",
    values: { fat: 34.8, protein: 6.38, carbs: 52.4, fiber: 5.07, sugars: 48.8, alcohol: 0, water: 0.5, lactose: 1.1 }
  },
  "Dried Tropical Fruit Mix": {
    src: "ciqual", ref: "Tropical fruit mix, sweetened, for snack, dried (Ciqual 13051)",
    values: { fat: 10.5, protein: 2.19, carbs: 69.5, fiber: 3.4, sugars: 59.4, alcohol: 0, water: 11.7, lactose: 0, polyols: 1.7 }
  },
  "Dulce de Leche": {
    src: "ciqual", ref: "Dulce de leche or confiture de lait (Ciqual 31040)",
    values: { fat: 7.35, protein: 6.84, carbs: 61.7, fiber: 0, sugars: 49.7, alcohol: 0, water: 25.4, lactose: 4.92, polyols: 0 }
  },
  "Fig Jam": {
    src: "ciqual", ref: "Jam, fig (Ciqual 30994)",
    values: { fat: 0.17, protein: 0.63, carbs: 59.1, fiber: 1.31, sugars: 56.8, alcohol: 0, water: 38, lactose: 0, polyols: 0 }
  },
  "Filled Wafer Biscuit": {
    src: "ciqual", ref: "Wafer biscuit, with vanilla filling (Ciqual 24313)",
    values: { fat: 30.1, protein: 5.75, carbs: 60.1, fiber: 1.6, sugars: 32.9, alcohol: 0, water: 1.1, lactose: 5.93, polyols: 0 }
  },
  "Foie Gras": {
    src: "ciqual", ref: "Foie gras, duck, whole, cooked (Ciqual 8321)",
    values: { fat: 54.6, protein: 8.41, carbs: 0.03, fiber: 0.35, sugars: 0.03, alcohol: 0, water: 35.1, lactose: 0, polyols: 0 }
  },
  "Fourme d'Ambert": {
    src: "ciqual", ref: "Fourme d'Ambert cheese, from cow's milk (Ciqual 12522)",
    values: { fat: 28.4, protein: 20.6, carbs: 0, fiber: 0, sugars: 0, alcohol: 0, water: 46.6, lactose: 0, polyols: 0 }
  },
  "Goat Meat": {
    src: "ciqual", ref: "Kid meat, cooked (Ciqual 21801)",
    values: { fat: 3.03, protein: 27.1, carbs: 0, fiber: 0, sugars: 0, alcohol: 0, water: 68.2, polyols: 0 }
  },
  "Gorgonzola": {
    src: "ciqual", ref: "Gorgonzola cheese, from cow's milk (Ciqual 12524)",
    values: { fat: 26.9, protein: 19.5, carbs: 0, fiber: 0, sugars: 0, alcohol: 0, water: 51.1, lactose: 0, polyols: 0 }
  },
  "Gruyere": {
    src: "ciqual", ref: "Gruyere cheese, from cow's milk (Ciqual 12114)",
    values: { fat: 33.5, protein: 26.3, carbs: 0.78, fiber: 0, sugars: 0, alcohol: 0, water: 32.5, lactose: 0, polyols: 0 }
  },
  "Hard Candy": {
    src: "ciqual", ref: "Hard candy and lollipop (Ciqual 31059)",
    values: { fat: 0.18, protein: 0.16, carbs: 95.3, fiber: 0.91, sugars: 70.4, alcohol: 0, water: 1.3, polyols: 0 }
  },
  "Harissa": {
    src: "ciqual", ref: "Harissa (hot spicy sauce), prepacked (Ciqual 11112) [lactose below 0,5, polyols traces]",
    values: { fat: 2.9, protein: 2.72, carbs: 7.3, fiber: 5.1, sugars: 6.89, alcohol: 0, water: 77.9, lactose: 0, polyols: 0 }
  },
  "Ice Cream Cone": {
    src: "ciqual", ref: "Ice cream, cone (normal size) (Ciqual 39509)",
    values: { fat: 13.5, protein: 3.51, carbs: 36.8, fiber: 0, sugars: 25.1, alcohol: 1, water: 42.5, lactose: 3.32, polyols: 0 }
  },
  "Kombucha": {
    src: "ciqual", ref: "Kombucha, prepacked (Ciqual 18025) [fat below 0,3, fiber below 0,5, lactose below 0,1]",
    values: { fat: 0, protein: 0.25, carbs: 1.45, fiber: 0, sugars: 1.45, alcohol: 0, water: 97.6, lactose: 0, polyols: 0 }
  },
  "Lamb Kidney": {
    src: "ciqual", ref: "Kidney, lamb, braised (Ciqual 40406)",
    values: { fat: 3.62, protein: 23.7, carbs: 0.99, fiber: 0, sugars: 0, alcohol: 0, water: 70.5, polyols: 0 }
  },
  "Liqueur": {
    src: "ciqual", ref: "Liqueur (Ciqual 1003)",
    values: { fat: 0.23, protein: 0.1, carbs: 25.4, fiber: 0, sugars: 17.4, alcohol: 17.3, water: 55.8, lactose: 0, polyols: 0 }
  },
  "Liver Sausage": {
    src: "ciqual", ref: "Liver sausage (Ciqual 30176)",
    values: { fat: 35.9, protein: 11.7, carbs: 0.9, fiber: 0.3, sugars: 0.9, alcohol: 0, water: 50.7, lactose: 0.9, polyols: 0 }
  },
  "Low-alcohol Beer": {
    src: "ciqual", ref: "Beer, low alcohol-content (3° alcohol) (Ciqual 5008)",
    values: { fat: 0, protein: 0.31, carbs: 4.62, fiber: 0, sugars: 1.33, alcohol: 2.23, water: 94.9, lactose: 0 }
  },
  "Maasdam": {
    src: "ciqual", ref: "Firm cheese, Maasdam-type, from cow's milk (Ciqual 12741)",
    values: { fat: 28.4, protein: 25.5, carbs: 0, fiber: 0, sugars: 0, alcohol: 0, water: 41.1, lactose: 0, polyols: 0 }
  },
  "Marshmallow": {
    src: "ciqual", ref: "Marshmallow (Ciqual 31050)",
    values: { fat: 0.08, protein: 3.31, carbs: 80.7, fiber: 0.01, sugars: 69.9, alcohol: 0, water: 16.4, polyols: 0 }
  },
  "Meringue": {
    src: "ciqual", ref: "Meringue (Ciqual 24520)",
    values: { fat: 0.52, protein: 4.82, carbs: 93.2, fiber: 0, sugars: 87.6, alcohol: 0, water: 1.36, lactose: 0, polyols: 0 }
  },
  "Milk Chocolate with Praline": {
    src: "ciqual", ref: "Milk chocolate, filled with praliné, bar (Ciqual 31084)",
    values: { fat: 34.9, protein: 7.29, carbs: 52.9, fiber: 2.51, sugars: 49.9, alcohol: 0, water: 0.6, lactose: 6.55 }
  },
  "Mint Chocolate": {
    src: "ciqual", ref: "Dark chocolate, filled with mint confectionery (Ciqual 31072)",
    values: { fat: 16, protein: 2.9, carbs: 70.2, fiber: 4, sugars: 69, alcohol: 0, water: 6.2, lactose: 0 }
  },
  "Nougat Chocolate Bar": {
    src: "ciqual", ref: "Chocolate bar, milk chocolate, with nougat (Ciqual 31098)",
    values: { fat: 29, protein: 5.8, carbs: 60.5, fiber: 2.9, sugars: 60.1, alcohol: 0, water: 0.6, lactose: 5.84, polyols: 0 }
  },
  "Offal (mixed, cooked)": {
    src: "ciqual", ref: "Offal, cooked (average) (Ciqual 40601)",
    values: { fat: 4.58, protein: 27.4, carbs: 2.18, fiber: 0, sugars: 0, alcohol: 0, water: 64.1, polyols: 0 }
  },
  "Onion Powder": {
    src: "ciqual", ref: "Onion, dried (Ciqual 20180)",
    values: { fat: 0.46, protein: 8.95, carbs: 74.1, fiber: 9.2, sugars: 37.4, alcohol: 0, water: 3.93 }
  },
  "Orange Marmalade": {
    src: "ciqual", ref: "Marmalade or jam, orange (Ciqual 31039)",
    values: { fat: 0.4, protein: 0.25, carbs: 59.3, fiber: 1.5, sugars: 56.9, alcohol: 0, water: 38.1, lactose: 0, polyols: 0 }
  },
  "Ostrich": {
    src: "ciqual", ref: "Ostrich, meat, cooked (Ciqual 36801)",
    values: { fat: 7.07, protein: 26.2, carbs: 0, fiber: 0, sugars: 0, alcohol: 0, water: 67.1, polyols: 0 }
  },
  "Panna Cotta": {
    src: "ciqual", ref: "Panna cotta, with fruit preparation or caramel, refrigerated (Ciqual 19685)",
    values: { fat: 12.1, protein: 2.69, carbs: 15.9, fiber: 1.44, sugars: 15.8, alcohol: 1.1, water: 66.1, lactose: 3.32, polyols: 0 }
  },
  "Pecorino": {
    src: "ciqual", ref: "Pecorino cheese, from ewe's milk (Ciqual 12122)",
    values: { fat: 31, protein: 25.5, carbs: 1, fiber: 0, sugars: 0, alcohol: 0, water: 32.2, polyols: 0 }
  },
  "Pelardon (goat cheese)": {
    src: "ciqual", ref: "Pélardon cheese, from goat's milk (Ciqual 12831)",
    values: { fat: 27.8, protein: 23.8, carbs: 0, fiber: 0, sugars: 0, alcohol: 0, water: 43.6, lactose: 0, polyols: 0 }
  },
  "Plum Jam": {
    src: "ciqual", ref: "Jam, plum (Ciqual 31053)",
    values: { fat: 0.09, protein: 0.28, carbs: 58.9, fiber: 1.27, sugars: 58, alcohol: 0, water: 39.3, lactose: 0, polyols: 0 }
  },
  "Porcini Mushrooms": {
    src: "ciqual", ref: "Cep or boletus mushroom, raw (Ciqual 20160)",
    values: { fat: 0.49, protein: 3.23, carbs: 2, fiber: 2.12, sugars: 1.28, alcohol: 0, water: 90.3, polyols: 0.45 }
  },
  "Provolone": {
    src: "ciqual", ref: "Provolone cheese, from cow's milk (Ciqual 12716)",
    values: { fat: 26.6, protein: 25.6, carbs: 0, fiber: 0, sugars: 0, alcohol: 0, water: 41, polyols: 0 }
  },
  "Quail": {
    src: "ciqual", ref: "Quail, meat and skin, cooked (Ciqual 36102)",
    values: { fat: 10.9, protein: 26.8, carbs: 0, fiber: 0, sugars: 0, alcohol: 0, water: 60.5, polyols: 0 }
  },
  "Rabbit": {
    src: "ciqual", ref: "Rabbit, wild, meat, cooked (Ciqual 34004)",
    values: { fat: 3.51, protein: 33, carbs: 0, fiber: 0, sugars: 0, alcohol: 0, water: 61.4, polyols: 0 }
  },
  "Raclette": {
    src: "ciqual", ref: "Raclette cheese, from cow's milk (Ciqual 12749) [carbs traces, sugars traces, lactose below 0,1]",
    values: { fat: 27.5, protein: 23.4, carbs: 0, fiber: 0, sugars: 0, alcohol: 0, water: 44.7, lactose: 0, polyols: 0 }
  },
  "Raspberry Jam": {
    src: "ciqual", ref: "Jam, raspberry (Ciqual 31062)",
    values: { fat: 0.17, protein: 0.56, carbs: 55.2, fiber: 2.69, sugars: 55.2, alcohol: 0, water: 39.9, lactose: 0, polyols: 0 }
  },
  "Reblochon": {
    src: "ciqual", ref: "Reblochon cheese, from cow's milk (Ciqual 12045)",
    values: { fat: 26.9, protein: 20.3, carbs: 0, fiber: 0, sugars: 0, alcohol: 0, water: 49.1, lactose: 0, polyols: 0 }
  },
  "Redcurrant Jelly": {
    src: "ciqual", ref: "Jelly, currant (red) (Ciqual 31095)",
    values: { fat: 0.04, protein: 0.25, carbs: 59.7, fiber: 0, sugars: 58.7, alcohol: 0, water: 37.9, lactose: 0, polyols: 0 }
  },
  "Rose Wine": {
    src: "ciqual", ref: "Wine, rose (Ciqual 5216)",
    values: { fat: 0, protein: 0.15, carbs: 1.4, fiber: 0, sugars: 1.4, alcohol: 9, water: 88.1 }
  },
  "Sake": {
    src: "ciqual", ref: "Sake or rice wine (Ciqual 1026)",
    values: { fat: 0, protein: 0, carbs: 0, fiber: 0, sugars: 0, alcohol: 16.1, water: 78.4, polyols: 0 }
  },
  "Salers": {
    src: "ciqual", ref: "Salers cheese, from cow's milk (Ciqual 12725)",
    values: { fat: 31.4, protein: 25.9, carbs: 0, fiber: 0, sugars: 0, alcohol: 0, water: 38.6, lactose: 0, polyols: 0 }
  },
  "Sangria": {
    src: "ciqual", ref: "Sangria (Ciqual 1017)",
    values: { fat: 0.05, protein: 0, carbs: 11, fiber: 0, sugars: 9.5, alcohol: 6.32, water: 83 }
  },
  "Shandy": {
    src: "ciqual", ref: "Shandy (beer + lemonade) (Ciqual 5004)",
    values: { fat: 0, protein: 0, carbs: 6.33, fiber: 0, sugars: 5.4, alcohol: 1.95, water: 92.3, polyols: 0 }
  },
  "Sponge Fingers": {
    src: "ciqual", ref: "Biscuit (cookie), sponge fingers or lady fingers (Ciqual 24430)",
    values: { fat: 3.4, protein: 7.75, carbs: 74.5, fiber: 2.9, sugars: 48.8, alcohol: 0, water: 10.8, lactose: 0, polyols: 0 }
  },
  "Squid": {
    src: "ciqual", ref: "Squid, boiled/cooked in water (Ciqual 10037)",
    values: { fat: 1.4, protein: 32.5, carbs: 1.64, fiber: 0, sugars: 0, alcohol: 0, water: 61.1, polyols: 0 }
  },
  "Strawberry Jam": {
    src: "ciqual", ref: "Jam, strawberry (Ciqual 31024)",
    values: { fat: 0.5, protein: 0.25, carbs: 60.5, fiber: 0.7, sugars: 60.1, alcohol: 0, water: 38.4, lactose: 0, polyols: 0 }
  },
  "Strawberry Jam (reduced sugar)": {
    src: "ciqual", ref: "Jam, strawberry, reduced sugar (Ciqual 30995)",
    values: { fat: 0.1, protein: 0.31, carbs: 40.3, fiber: 1.37, sugars: 39.6, alcohol: 0, water: 54.3, lactose: 0, polyols: 0 }
  },
  "Sugared Almond": {
    src: "ciqual", ref: "Sugared almond (Ciqual 31036)",
    values: { fat: 14.7, protein: 5.25, carbs: 75.7, fiber: 4.6, sugars: 68.3, alcohol: 0, water: 1.45, polyols: 0 }
  },
  "Sweet Wine": {
    src: "ciqual", ref: "Wine, sweet (Ciqual 1006)",
    values: { fat: 0, protein: 0.2, carbs: 9.96, fiber: 0, sugars: 7.78, alcohol: 15.3, water: 70.5 }
  },
  "Teriyaki Sauce": {
    src: "ciqual", ref: "Teriyaki sauce, prepacked (Ciqual 11301) [polyols traces]",
    values: { fat: 0.02, protein: 5.93, carbs: 16, fiber: 0.1, sugars: 14.1, alcohol: 0, water: 67.7, polyols: 0 }
  },
  "Tomme": {
    src: "ciqual", ref: "Tomme cheese, from cow's milk (Ciqual 12758)",
    values: { fat: 29.4, protein: 21.6, carbs: 3.37, fiber: 0, sugars: 0, alcohol: 0, water: 42.3, lactose: 0, polyols: 0 }
  },
  "Turkey Heart": {
    src: "ciqual", ref: "Heart, turkey, cooked (Ciqual 40057)",
    values: { fat: 7.52, protein: 24.9, carbs: 0, fiber: 0, sugars: 0, alcohol: 0, water: 67.2, polyols: 0 }
  },
  "Turkey Liver": {
    src: "ciqual", ref: "Liver, turkey, cooked (Ciqual 40118)",
    values: { fat: 8.18, protein: 27, carbs: 0, fiber: 0, sugars: 0, alcohol: 0, water: 64, polyols: 0 }
  },
  "Veal Kidney": {
    src: "ciqual", ref: "Kidney, veal, braised or grilled/pan-fried (Ciqual 40408)",
    values: { fat: 7, protein: 26, carbs: 0, fiber: 0, sugars: 0, alcohol: 0, water: 67.7, polyols: 0 }
  },
  "Vegan Cheese (Cashew)": {
    src: "ciqual", ref: "Plant-based cheese, with cashew, prepacked (Ciqual 1028) [lactose below 0,1]",
    values: { fat: 35.3, protein: 14.5, carbs: 15.2, fiber: 2.6, sugars: 0.28, alcohol: 0, water: 29.5, lactose: 0, polyols: 1 }
  },
  "Wafer Biscuit": {
    src: "ciqual", ref: "Wafer biscuit without filling (Ciqual 24300)",
    values: { fat: 9.7, protein: 6.51, carbs: 80, fiber: 2.05, sugars: 34.6, alcohol: 0, water: 2.93, polyols: 0 }
  },
  "White Beans (cooked)": {
    src: "ciqual", ref: "Haricot bean, boiled/cooked in water (Ciqual 20502)",
    values: { fat: 1.1, protein: 6.75, carbs: 12, fiber: 13.8, sugars: 0.3, alcohol: 0, water: 66.9, lactose: 0, polyols: 0 }
  },
  "White Chocolate with Nuts": {
    src: "ciqual", ref: "White chocolate, with dried fruits (nuts, almonds, raisins, praliné), bar (Ciqual 31026)",
    values: { fat: 39.1, protein: 7.64, carbs: 48, fiber: 2.43, sugars: 45.1, alcohol: 0, water: 0.5 }
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
  "Cows Milk (3% fat)": {
    src: "ciqual", ref: "Milk, whole (average) (Ciqual 19016)",
    values: { lactose: 4.29, polyols: 0 }
  },
  "Cream (40% fat)": {
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
  "Lactose-free Cream (40% fat)": {
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
  "Yogurt (3% fat)": {
    src: "ciqual", ref: "Yoghurt or fermented milk, plain (average) (Ciqual 19600)",
    values: { lactose: 3.21, polyols: 0 }
  }
};
