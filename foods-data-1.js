/* =========================================================================
   foods-data.js — all editable content for the Food Intolerance Guide
   =========================================================================

   This is the ONLY file you need to touch to add a category, a food, or a
   trait. index.html, styles.css and script.js read everything from here.

   ---------------------------------------------------------------------
   ADD A NEW TRAIT (e.g. "histamine", "fodmaps", a new one you invent)
   ---------------------------------------------------------------------
   Add a key to TRAITS below:

     myNewTrait: {
       label: "Display name shown in filters & summaries",
       filter: true,      // false/omit = tracked in analysis but no filter checkbox
       articleId: "fiber", // optional — id of an article in articles-data.js.
                           // Adds a "Read the full article" link under the
                           // analysis popup text. Omit if there's no article yet.
       analysis: [        // paragraphs shown in the "Show Analysis" popup
         "First paragraph...",
         "Second paragraph (optional)...",
       ]
     }

   Then reference the key (e.g. "myNewTrait") in any food's `traits` array.

   ---------------------------------------------------------------------
   ADD A NEW CATEGORY
   ---------------------------------------------------------------------
   Add an object to CATEGORIES below:

     {
       id: "berries",
       label: "Berries",
       foods: [
         { name: "Blueberry", traits: ["fiber"] },
       ]
     }

   ---------------------------------------------------------------------
   ADD A NEW FOOD TO AN EXISTING CATEGORY
   ---------------------------------------------------------------------
   Add an object to that category's `foods` array:

     { name: "Jackfruit", traits: ["fiber", "carbs"] }

   That's it — no HTML, CSS, or JS changes needed anywhere else.
   ========================================================================= */

const TRAITS = {
  fodmaps: {
    label: "FODMAPs",
    filter: true,
    articleId: "fodmaps",
    analysis: [
      "The number one commonality of these foods is FODMAPs which can cause mild or moderate gastrointestinal discomfort for anyone going from a low intake to a high intake.",
      "For most people the symptoms of a high intake of FODMAPs is mild and improves over time even when the intake stays high, as the gut microbiome is the main reason for the symptoms and it adapts to the new diet.",
      "For sensitive individuals on the other hand, like people with Irritable Bowel Syndrome (IBS), moderate symptoms can occur at a relatively low intake and the adaptation of the gut microbiome takes a longer time. With high daily intake the gastrointestinal symptoms can become severe, causing acute diarrhea and severe abdominal pain."
    ]
  },
  over_10g_fat: {
    label: "Fat",
    filter: true,
    articleId: "fat",
    analysis: [
      "The number one commonality of these foods is a fat content of more than 10g per 100g of the food, which can cause symptoms in several cases of GI-disorders.",
      "This is likely to cause clear symptoms in people with a number of disorders. An increase of symptoms is expected in people with GERD, Gastro Esophageal Reflux Disorder, or IBS, Irritable Bowel Syndrome. Severe and acute symptoms within 1-2 hours after a meal, like chronic diarrhea and pain/cramps, is common in malabsorption disorders like EPI, Exocrine Pancreatic Insufficiency.",
      "EPI can be a severe disorder that is usually followed by unplanned weight loss, muscle loss and deteriorating health, most importantly it can be a sign of pancreatic cancer. Indicators of severe fat malabsorption is acute diarrhea within 1-2 hours of fatty meals, a yellow coloring of the stool and oily traces on the toilet paper or in the toilet. The oil content can make it harder than usual to flush the toilet clean and to wipe the behind clean."
    ]
  },
  fiber: {
    label: "Fiber",
    filter: true,
    articleId: "fiber",
    analysis: [
      "The number one commonality of these foods is Fiber which can cause mild or moderate gas and bloating for anyone if the intake is high enough.",
      "High fiber intake during dehydration can contribute to constipation and if the dehydration is not corrected the constipation can cause severe gastrointestinal discomfort and lowered appetite, which in the worst case scenario will worsen the dehydration.",
      "For sensitive individuals, like people with gut-microbial dysbiosis, gastrointestinal discomfort can occur at a relatively low intake. Common foods high in Fiber are among others: Flax seeds, Chia seeds, Wheat/Oat bran, Whole grain pasta/bread/rice, beans and peas."
    ]
  },
  protein: {
    label: "Protein",
    filter: true,
    articleId: "protein",
    analysis: [
      "Detailed analysis for protein is coming soon."
    ]
  },
  carbs: {
    label: "Carbohydrates",
    filter: true,
    articleId: "carbs",
    analysis: [
      "Detailed analysis for carbohydrates is coming soon."
    ]
  },
  over_3g_lactose: {
    label: "Lactose",
    filter: true,
    analysis: [
      "The number one commonality of these foods is Lactose which is a sugar (di-saccharide) that comes with the milk from all mammals.",
      "Lactose can cause discomfort or even diarrhea for most people if eaten in very high amounts. Sensitive individuals, like people with celiac disease, IBD, IBS or lactose intolerance, can get moderate to severe pain, gas and diarrhea even in relatively low doses.",
      "It is mainly found in dairy products (no matter what animal the milk has come from) and it is added as a sweetener to some processed foods, supplements and medications. Fermented foods like yoghurt and cheese will have lower levels of lactose, the longer the ferment and/or aging of the product the lower the levels of lactose will be."
    ]
  },
  histamine: {
    label: "Histamine",
    filter: false,
    analysis: [
      "Detailed analysis for histamine is coming soon."
    ]
  },
  reflux: {
    label: "Reflux trigger",
    filter: false
  },
  aceticAcid: {
    label: "Acetic acid",
    filter: false
  }
};

const CATEGORIES = [
  {
    id: "roots",
    label: "Roots",
    foods: [
      { name: "Beet Root", traits: ["fiber", "carbs"] },
      { name: "Carrot", traits: ["fiber", "carbs"] },
      { name: "Celeriac Root", traits: ["fiber"] },
      { name: "Jerusalem Artichoke", traits: ["fiber", "carbs"] },
      { name: "Parsnip", traits: ["fiber", "carbs"] },
      { name: "Potato", traits: ["fiber", "carbs"] },
      { name: "Suede", traits: ["fiber"] },
      { name: "Sweet Potato", traits: ["fiber", "carbs"] }
    ]
  },
  {
    id: "veggies",
    label: "Vegetables",
    foods: [
      { name: "Cabbage", traits: ["fiber", "fodmaps"] },
      { name: "Kale", traits: ["fiber"] },
      { name: "Onion", traits: ["fiber", "fodmaps"] },
      { name: "Tomato", traits: ["fiber", "histamine"] },
      { name: "Cauliflower", traits: ["fiber"] },
      { name: "Aubergine", traits: ["fiber"] },
      { name: "Parsley", traits: ["fiber"] },
      { name: "Leek", traits: ["fiber"] },
      { name: "Shiitake Mushrooms", traits: ["fiber"] },
      { name: "Oyster Mushrooms", traits: ["fiber"] },
      { name: "White Button Mushrooms", traits: ["fiber"] }
    ]
  },
  {
    id: "fruits",
    label: "Fruits",
    foods: [
      { name: "Apples", traits: ["fiber", "carbs", "fodmaps"] },
      { name: "Oranges", traits: ["fiber"] },
      { name: "Pears", traits: ["fiber"] },
      { name: "Mangos", traits: ["fiber"] },
      { name: "Blueberry", traits: ["fiber"] },
      { name: "Strawberry", traits: ["fiber", "histamine"] },
      { name: "Cherries", traits: ["fiber"] },
      { name: "Blackberries", traits: ["fiber"] },
      { name: "Raspberries", traits: ["fiber"] },
      { name: "Lemon", traits: ["fiber"] },
      { name: "Lime", traits: ["fiber"] },
      { name: "Grapefruit", traits: ["fiber"] },
      { name: "Grapes", traits: ["fiber"] },
      { name: "Rhubarb", traits: ["fiber"] },
      { name: "Cloudberries", traits: ["fiber"] },
      { name: "Lingonberry", traits: ["fiber"] }
    ]
  },
  {
    id: "nuts",
    label: "Nuts/Seeds",
    foods: [
      { name: "Almond", traits: ["fiber", "over_10g_fat", "carbs", "protein", "fodmaps"] },
      { name: "Brazil Nut", traits: ["fiber", "over_10g_fat", "carbs", "protein", "fodmaps"] },
      { name: "Cashew Nut", traits: ["fiber", "over_10g_fat", "carbs", "protein", "fodmaps"] },
      { name: "Chiaseeds (whole)", traits: ["fiber"] },
      { name: "Chiaseeds (ground)", traits: ["fiber", "over_10g_fat", "carbs", "protein"] },
      { name: "Flaxseed (whole)", traits: ["fiber", "fodmaps"] },
      { name: "Flaxseed (ground)", traits: ["fiber", "over_10g_fat", "carbs", "protein", "fodmaps"] },
      { name: "Hazelnut", traits: ["fiber", "over_10g_fat", "carbs", "protein", "fodmaps"] },
      { name: "Peanut", traits: ["fiber", "over_10g_fat", "carbs", "protein", "fodmaps"] },
      { name: "Pumpkin Seeds", traits: ["fiber", "over_10g_fat", "carbs", "protein"] },
      { name: "Sunflower Seeds", traits: ["fiber", "over_10g_fat", "carbs", "protein"] }
    ]
  },
  {
    id: "grains",
    label: "Grains",
    foods: [
      { name: "Oats", traits: ["fiber", "carbs", "protein"] },
      { name: "Wheat", traits: ["fiber", "carbs", "protein", "fodmaps"] },
      { name: "Rye", traits: ["fiber", "carbs", "protein", "fodmaps"] },
      { name: "Barley", traits: ["fiber", "carbs", "protein", "fodmaps"] },
      { name: "Quinoa", traits: ["fiber", "carbs", "protein"] },
      { name: "Buckwheat", traits: ["fiber", "carbs", "protein"] },
      { name: "Rice", traits: ["fiber", "carbs", "protein"] }
    ]
  },
  {
    id: "legumes",
    label: "Legumes",
    foods: [
      { name: "Black Bean", traits: ["fiber", "carbs", "protein", "fodmaps"] },
      { name: "Chickpea", traits: ["fiber", "carbs", "protein", "fodmaps"] },
      { name: "Common Peas", traits: ["fiber", "carbs", "protein", "fodmaps"] },
      { name: "Lentils", traits: ["fiber", "carbs", "protein", "fodmaps"] },
      { name: "Tempeh", traits: ["fiber", "carbs", "protein"] },
      { name: "Tofu (firm)", traits: ["fiber", "carbs", "protein"] },
      { name: "Tofu (silken)", traits: ["fiber", "carbs", "protein", "fodmaps"] }
    ]
  },
  {
    id: "animals",
    label: "Animals",
    foods: [
      { name: "Cows Meat", traits: ["protein"] },
      { name: "Pork", traits: ["over_10g_fat", "protein"] },
      { name: "Salmon", traits: ["over_10g_fat", "protein"] },
      { name: "Cod", traits: ["protein"] },
      { name: "Oysters", traits: ["protein"] },
      { name: "Lobsters", traits: ["protein"] },
      { name: "Crayfish", traits: ["protein"] },
      { name: "Elk Meat", traits: ["protein"] },
      { name: "Shrimp", traits: ["protein"] },
      { name: "Egg White", traits: ["protein"] },
      { name: "Egg Yolk", traits: ["over_10g_fat"] }
    ]
  },
  {
    id: "dairy",
    label: "Dairy",
    foods: [
      { name: "Cows Milk", traits: ["protein", "over_3g_lactose"] },
      { name: "Goats Milk", traits: ["protein", "over_3g_lactose"] },
      { name: "Sheeps Milk", traits: ["protein", "over_3g_lactose"] },
      { name: "Cheese", traits: ["over_10g_fat", "protein"] },
      { name: "Yogurt", traits: ["protein", "over_3g_lactose"] },
      { name: "Greek Yogurt", traits: ["over_10g_fat", "protein", "over_3g_lactose"] },
      { name: "Butter", traits: ["over_10g_fat"] },
      { name: "Cream", traits: ["over_10g_fat", "protein", "over_3g_lactose"] },
      { name: "Quark Cheese", traits: ["protein"] },
      { name: "Cottage Cheese", traits: ["protein"] },
      { name: "Sour Cream", traits: ["over_10g_fat", "protein", "over_3g_lactose"] },
      { name: "Cream Cheese", traits: ["over_10g_fat", "protein", "over_3g_lactose"] },
      { name: "Ricotta Cheese", traits: ["over_10g_fat", "protein"] },
      { name: "Mascarpone", traits: ["over_10g_fat", "protein"] },
      { name: "Parmesan", traits: ["over_10g_fat", "protein"] },
      { name: "Halloumi", traits: ["over_10g_fat", "protein", "over_3g_lactose"] }
    ]
  },
  {
    id: "spices",
    label: "Spices",
    foods: [
      { name: "Chili", traits: ["reflux", "histamine"] },
      { name: "Garlic", traits: ["fodmaps"] },
      { name: "Turmeric", traits: ["fiber"] },
      { name: "Vinegar", traits: ["aceticAcid"] }
    ]
  },
  {
    id: "ultraProcessed",
    label: "Ultra-Processed Foods",
    foods: [
      { name: "Potato chips", traits: ["over_10g_fat"] },
      { name: "Candy bars", traits: ["over_10g_fat", "carbs"] },
      { name: "Sugary soft drinks", traits: ["carbs"] },
      { name: "Frozen pizza", traits: ["over_10g_fat", "carbs"] },
      { name: "Milk chocolate", traits: ["over_10g_fat", "carbs", "over_3g_lactose"] },
      { name: "Ice Cream", traits: ["over_10g_fat", "carbs", "over_3g_lactose"] }
    ]
  }
];
