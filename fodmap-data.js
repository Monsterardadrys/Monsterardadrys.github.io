/* =========================================================================
   fodmap-data.js — how much of a food counts as one low-FODMAP serving

   The FODMAP tags in foods-data.js say which types a food carries. They do
   not say how much. That is the one categorical trait where an amount is
   actually established: Monash University tests foods at measured serving
   sizes and publishes the largest one that still rates low.

   `low` is that serving, in grams of the food as eaten.

     "Avocado": { low: 30, note: "sorbitol sets the limit", src: "monash" }

   `low: 0` means no serving rates low — onion and garlic are the classic
   ones. Those are reported by name rather than counted, because there is no
   number to divide by.

   WHAT THE MEAL BUILDER DOES WITH IT — A THRESHOLD, NOT A QUANTITY. Monash
   rates a stated serving low, moderate or high. It does not publish grams of
   fructans per 100g, and no arithmetic on this file can recover them. So the
   figure decides whether a food counts, not how much it counts: weighed out
   at or under `low`, the food is in the meal but is not what is loading it;
   over `low`, it counts. FODMAPs are then reported exactly like allergens and
   the other categorical families.

   Dividing grams by `low` to two decimals was tried and thrown away. It reads
   as a measurement, and it is a traffic light.

   A food over its serving counts towards every subtype it carries, which
   overstates whichever one was not limiting. `low` was set by the limiting
   subtype and the traffic light does not say which, so that is as far as the
   published data goes.

   ---------------------------------------------------------------------
   STATUS: PARTIAL, AND NOT YET CHECKED AGAINST THE APP
   ---------------------------------------------------------------------
   This table is hand-entered and covers a fraction of the FODMAP-tagged
   foods in the database. Every figure needs checking against the current
   Monash app before this stops being pre-beta: serving sizes are revised
   as foods are re-tested, and a stale figure looks exactly like a fresh
   one. Foods not listed here are reported as having no serving on file —
   the meal builder says so and does not guess.

   Leave a food out rather than entering a figure you are not sure of. A
   missing serving is reported as missing; a wrong one is not.
   ========================================================================= */

const FODMAP_SOURCES = {
  monash: {
    label: "Monash University FODMAP Diet app",
    note: "The FODMAP content of foods is laboratory-measured at Monash and published " +
      "as a traffic light against a stated serving size. There is no bulk export, so " +
      "every figure here was entered by hand."
  }
};

const FODMAP_SERVES = {

  /* ---- Vegetables and roots ---- */
  "Beet Root":            { low: 20,  note: "two slices", src: "monash" },
  "Jerusalem Artichoke":  { low: 0,   note: "one of the densest fructan sources there is", src: "monash" },
  "Globe Artichoke":      { low: 0,   src: "monash" },
  "Onion":                { low: 0,   note: "cooking, browning and straining do not remove fructans — they are water-soluble, not volatile", src: "monash" },
  "Shallot":              { low: 0,   src: "monash" },
  "Garlic":               { low: 0,   note: "garlic-infused oil is the usual way round it: fructans do not dissolve into oil", src: "monash" },
  "Leek":                 { low: 0,   note: "the white bulb; the green leaves rate low", src: "monash" },
  "Avocado":              { low: 30,  note: "sorbitol sets the limit", src: "monash" },
  "Brussels Sprouts":     { low: 38,  note: "two sprouts", src: "monash" },
  "Celery":               { low: 10,  note: "a quarter of a stalk — mannitol", src: "monash" },
  "Sweetcorn":            { low: 38,  note: "half a cob", src: "monash" },
  "Broccoli":             { low: 75,  note: "heads; the stalks are the fructan part", src: "monash" },
  "Aubergine":            { low: 75,  src: "monash" },
  "Cabbage":              { low: 75,  note: "common green cabbage; savoy is lower", src: "monash" },
  "White Button Mushrooms": { low: 0, note: "mannitol; canned button mushrooms rate low because the mannitol leaches into the brine", src: "monash" },
  "Shiitake Mushrooms":   { low: 10,  src: "monash" },

  /* ---- Fruit and berries ---- */
  "Apples":               { low: 20,  src: "monash" },
  "Mangos":               { low: 40,  src: "monash" },
  "Watermelon":           { low: 15,  src: "monash" },
  "Apricot":              { low: 30,  note: "half a fresh apricot", src: "monash" },
  "Cherries":             { low: 20,  note: "three cherries", src: "monash" },

  /* ---- Dried fruit ---- */
  "Raisins":              { low: 13,  note: "a tablespoon", src: "monash" },
  "Sultanas":             { low: 13,  note: "a tablespoon", src: "monash" },
  "Dried Cranberry (Added Sugar)":    { low: 13, note: "a tablespoon", src: "monash" },
  "Dried Cranberry (No Sugar Added)": { low: 13, note: "a tablespoon", src: "monash" },

  /* ---- Nuts and seeds ---- */
  "Almond":               { low: 12,  note: "ten almonds", src: "monash" },
  "Hazelnut":             { low: 15,  note: "ten hazelnuts", src: "monash" },
  "Brazil Nut":           { low: 40,  src: "monash" },
  "Peanut":               { low: 28,  src: "monash" },
  "Cashew Nut":           { low: 0,   src: "monash" },
  "Pine Nuts":            { low: 14,  src: "monash" },
  "Flaxseed (whole)":     { low: 15,  note: "a tablespoon", src: "monash" },
  "Flaxseed (ground)":    { low: 15,  note: "a tablespoon", src: "monash" },

  /* ---- Grains ---- */
  "Oats":                 { low: 52,  note: "rolled, dry weight", src: "monash" },
  "Oat Bran":             { low: 23,  src: "monash" },
  "Pasta (no egg)":       { low: 74,  note: "cooked", src: "monash" },
  "Couscous":             { low: 77,  note: "cooked", src: "monash" },
  "Bulgur":               { low: 44,  note: "cooked", src: "monash" },

  /* ---- Legumes ---- */
  "Chickpea (whole/flour)": { low: 42, note: "canned and drained; the GOS leaches into the liquid, so drained beats boiled", src: "monash" },
  "Lentils":              { low: 46,  note: "canned and drained", src: "monash" },
  "Black Bean":           { low: 45,  note: "canned and drained", src: "monash" },
  "Common Peas":          { low: 15,  src: "monash" },
  "Soybeans":             { low: 0,   src: "monash" },

  /* ---- Dairy ---- */
  "Cows Milk (3% fat)":            { low: 0,   note: "lactose; the lactose-free version is unrestricted", src: "monash" },
  "Kefir":                { low: 0,   src: "monash" },
  "Ice Cream":            { low: 0,   src: "monash" },
  "Milk chocolate":       { low: 20,  note: "four squares", src: "monash" },

  /* ---- Condiments ---- */
  "Honey":                { low: 7,   note: "a teaspoon", src: "monash" },
  "Peanut Butter":        { low: 50,  note: "two tablespoons", src: "monash" },
  "Hummus":               { low: 20,  note: "a tablespoon", src: "monash" }
};
