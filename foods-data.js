/* =========================================================================
   foods-data.js — all editable content for the Food Intolerance Guide
   =========================================================================

   This is the ONLY file you need to touch to add a category, a food, or a
   trait. index.html, styles.css and script.js read everything from here.

   ---------------------------------------------------------------------
   TIERED TRAITS (broad + specific) — fodmaps, irritant, allergen, cross_reactive
   ---------------------------------------------------------------------
   Several traits below follow a "broad + specific" pattern, the same way
   fodmaps works:

     - `fodmaps` (broad) + `fructose` / `polyols` / `fructans` / `galactans`
       (specific FODMAP subtypes — additive, a food can have several)
     - `irritant` (broad, catch-all GI irritant) + `capsaicin` / `peel_skin`
       / `allyl_compounds` / `carbonation` / `aceticAcid` / `alcohol` /
       `caffeine` (specific irritant mechanisms)
     - `allergen` (broad, "Big 9") + `allergen_milk` / `allergen_egg` /
       `allergen_wheat` / `allergen_fish` / `allergen_shellfish` /
       `allergen_peanut` / `allergen_treenut` / `allergen_soy` /
       `allergen_sesame`
     - `cross_reactive` (broad, pollen-food / oral allergy syndrome) +
       `cross_birch` / `cross_grass` / `cross_latex`

   The broad trait is what's most likely to surface in the top-3 shared
   traits for a typical selection (keeping fat/fiber/fodmaps/protein/carbs
   from getting drowned out by dozens of narrow traits). The specific
   traits exist for filtering/drilling down once a user has noticed the
   broad trait is shared.

   Note: the `reflux` trait used to exist as its own thing but overlapped
   almost entirely with `irritant` (fat, alcohol, caffeine, acidity, etc.
   all show up in both). It's been folded into `irritant` — see Chili.

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

  /* ---- FODMAPs: broad trait + 4 specific subtypes (additive) ---- */
  fodmaps: {
    order: 6,
    label: "FODMAPs",
    filter: true,
    articleId: "fodmaps",
    analysis: [
      "These foods are high in FODMAPs — fermentable carbs that can cause gas, bloating, and discomfort. Usually mild, but more pronounced and slower to resolve in IBS.",
      "See the FODMAPs article for the specific subtypes and the low-FODMAP approach."
    ]
  },
  fructose: {
    group: "FODMAPs",
    order: 1,
    label: "Fructose",
    filter: true,
    articleId: "fructose",
    analysis: [
      "These foods are high in free fructose relative to glucose, which can exceed the small intestine's absorption capacity and draw extra water into the bowel.",
      "This is one of several FODMAP subtypes tracked alongside the broader FODMAPs trait."
    ]
  },
  polyols: {
    group: "FODMAPs",
    order: 2,
    label: "Polyols",
    filter: true,
    articleId: "polyols",
    analysis: [
      "These foods naturally contain sugar alcohols such as sorbitol and mannitol, which are poorly absorbed and have an osmotic, water-drawing effect in the bowel.",
      "Stone fruits and mushrooms are common sources. This is one of several FODMAP subtypes tracked alongside the broader FODMAPs trait."
    ]
  },
  fructans: {
    group: "FODMAPs",
    order: 3,
    label: "Fructans",
    filter: true,
    articleId: "fructans",
    analysis: [
      "Fructans are chains of fructose molecules that humans lack the enzymes to digest, so they pass intact to the colon where gut bacteria ferment them.",
      "Wheat, onion and garlic are classic sources. This is one of several FODMAP subtypes tracked alongside the broader FODMAPs trait."
    ]
  },
  galactans: {
    group: "FODMAPs",
    order: 4,
    label: "GOS",
    filter: true,
    articleId: "galactans",
    analysis: [
      "Galacto-oligosaccharides are short chains of galactose the small intestine can't break down, so they reach the colon largely intact and get fermented by gut bacteria.",
      "Legumes and some nuts are the main sources. This is one of several FODMAP subtypes tracked alongside the broader FODMAPs trait."
    ]
  },

  /* ---- Macros ---- */
  over_10g_fat: {
    order: 1,
    label: "Fat",
    filter: true,
    articleId: "fat",
    analysis: [
      "These foods contain more than 10g fat per 100g, which can worsen symptoms in GERD, IBS, gallbladder disease, and pancreatic insufficiency (EPI).",
      "See the Fat article for warning signs of malabsorption and who is most affected."
    ]
  },
  bile_stimulant: {
    order: 8,
    label: "Bile stimulant",
    filter: true,
    articleId: "bile_stimulant",
    analysis: [
      "These foods strongly stimulate bile release via CCK, mainly through fat and protein content. Most relevant for gallstones or a history of gallbladder attacks.",
      "See the Bile Stimulants article for clinical detail."
    ]
  },
  fiber: {
    order: 4,
    label: "Fiber",
    filter: true,
    articleId: "fiber",
    analysis: [
      "These foods are high in fiber, which can cause gas and bloating at high intake, especially with dehydration or gut-microbial dysbiosis.",
      "See the Fiber article for benefits, sources, and the risks of a low-fiber diet."
    ]
  },
  protein: {
    order: 2,
    label: "Protein",
    filter: true,
    articleId: "protein",
    analysis: [
      "These foods are protein-rich. Protein moderately stimulates bile release and can add to digestive workload in large amounts. Symptoms are more often linked to what accompanies the protein (lactose, allergens, histamine) than protein itself, though pancreatitis, pancreatic tumors, and true food allergy can cause direct reactions."
    ]
  },
  carbs: {
    order: 3,
    label: "Carbohydrates",
    filter: true,
    articleId: "carbs",
    analysis: [
      "These foods are carbohydrate-rich. Symptoms attributed to carbs are usually driven by a specific subtype — FODMAPs, lactose, or excess fructose — rather than carbohydrate content as a whole. Check the more specific traits (FODMAPs, lactose) for the likely mechanism."
    ]
  },
  over_3g_lactose: {
    group: "FODMAPs",
    order: 5,
    label: "Lactose",
    filter: true,
    articleId: "lactose",
    analysis: [
      "These foods are high in lactose, a milk sugar that can cause gas, bloating, and diarrhea in lactose-intolerant individuals, and discomfort in anyone at high intake.",
      "See the Lactose article for types, IBS overlap, and why new-onset intolerance in adults deserves investigation."
    ]
  },

  /* ---- Histamine ---- */
  histamine: {
    order: 7,
    label: "Histamine",
    filter: true,
    articleId: "histamine",
    analysis: [
      "These foods are high in histamine, trigger histamine release, or block its breakdown — all producing similar symptoms (flushing, headache, hives, gut discomfort) in sensitive individuals.",
      "See the Histamine article for mechanisms, diagnosis, and dietary management."
    ]
  },

  /* ---- Alcohol / caffeine ---- */
  alcohol: {
    group: "GI Irritants",
    order: 6,
    label: "Alcohol",
    filter: true,
    analysis: [
      "These foods or drinks contain alcohol, which can directly irritate the gut lining, relax the lower esophageal sphincter (worsening reflux), and affect liver and pancreatic function with regular high intake."
    ]
  },
  caffeine: {
    group: "GI Irritants",
    order: 7,
    label: "Caffeine",
    filter: true,
    analysis: [
      "These foods or drinks contain caffeine, which stimulates gut motility and acid secretion and can worsen symptoms in people with IBS, GERD, or general gut sensitivity."
    ]
  },

  /* ---- Irritant: broad trait + specific mechanisms (additive) ---- */
  irritant: {
    order: 5,
    label: "General",
    filter: true,
    articleId: "irritant",
    analysis: [
      "These foods can worsen symptoms across GERD, IBS, gallbladder disease, and general gut sensitivity through varied mechanisms — some well-established, others based on clinical experience.",
      "See the GI Irritants article for the specific mechanisms tracked separately."
    ]
  },
  capsaicin: {
    group: "GI Irritants",
    order: 1,
    label: "Capsaicin",
    filter: true,
    analysis: [
      "Capsaicin, the compound responsible for the heat in chili peppers, directly activates pain/heat receptors (TRPV1) in the gut lining and can also stimulate CCK release.",
      "Sweet (non-hot) bell peppers contain little to no capsaicin and are not covered by this trait."
    ]
  },
  peel_skin: {
    group: "GI Irritants",
    order: 2,
    label: "Peel/skin",
    filter: true,
    analysis: [
      "The peel or skin of these foods is harder to digest than the flesh — it concentrates insoluble fiber and, in some cases, specific irritant compounds (like cucurbitacins in cucumber skin) that the inner flesh has much less of.",
      "Removing the peel/skin is a simple way to test whether it's the trigger rather than the food as a whole."
    ]
  },
  allyl_compounds: {
    group: "GI Irritants",
    order: 3,
    label: "Allyl/sulfur compounds",
    filter: true,
    analysis: [
      "Raw garlic, raw onion, mustard and similar foods contain pungent sulfur-based compounds (allicin, isothiocyanates) that directly irritate the gut lining through a different pathway than capsaicin.",
      "Cooking can reduce, but doesn't always eliminate, this effect."
    ]
  },
  carbonation: {
    group: "GI Irritants",
    order: 4,
    label: "Carbonation",
    filter: true,
    analysis: [
      "Carbon dioxide in carbonated drinks causes gastric distension and can worsen bloating, belching and reflux symptoms, independent of the drink's sugar or caffeine content."
    ]
  },
  aceticAcid: {
    group: "GI Irritants",
    order: 5,
    label: "Acetic acid",
    filter: true,
    analysis: [
      "Acetic acid (the active component in vinegar) is acidic enough to directly irritate the gut lining and esophagus in some individuals, especially undiluted or in large amounts."
    ]
  },

  /* ---- Allergen: broad "Big 9" trait + specific allergens (additive) ---- */
  allergen: {
    order: 9,
    label: "Big 9 (general)",
    filter: true,
    articleId: "allergen",
    analysis: [
      "These foods belong to the \"Big 9\" group responsible for the large majority of true, IgE-mediated food allergies: milk, egg, wheat, fish, shellfish, peanut, tree nuts, soy and sesame.",
      "This reflects known common allergens, not a dose-dependent intolerance. Allergen reactions can be severe or systemic. If a true allergy is suspected, refer for formal allergy testing rather than relying on this tool."
    ]
  },
  allergen_milk: {
    group: "Allergens",
    order: 1,
    label: "Milk",
    filter: true,
    analysis: [
      "Cow's milk allergy is mediated mainly by casein and whey proteins — distinct from lactose intolerance, which is a digestive enzyme issue, not an immune one."
    ]
  },
  allergen_egg: {
    group: "Allergens",
    order: 2,
    label: "Egg",
    filter: true,
    analysis: [
      "Egg allergy is mediated mainly by proteins in the egg white (ovalbumin, ovomucoid). The yolk is less allergenic but not necessarily safe for someone with an egg allergy."
    ]
  },
  allergen_wheat: {
    group: "Allergens",
    order: 3,
    label: "Wheat",
    filter: true,
    analysis: [
      "Wheat allergy is an immune reaction to wheat proteins — distinct from celiac disease and from non-celiac gluten sensitivity, which are not classic IgE-mediated allergies."
    ]
  },
  allergen_fish: {
    group: "Allergens",
    order: 4,
    label: "Fish",
    filter: true,
    analysis: [
      "Fish allergy is mediated mainly by parvalbumin, a muscle protein — a different allergen than shellfish tropomyosin, so an allergy to one doesn't necessarily mean an allergy to the other."
    ]
  },
  allergen_shellfish: {
    group: "Allergens",
    order: 5,
    label: "Shellfish",
    filter: true,
    analysis: [
      "Shellfish allergy is mediated mainly by tropomyosin, found in crustaceans and molluscs."
    ]
  },
  allergen_peanut: {
    group: "Allergens",
    order: 6,
    label: "Peanut",
    filter: true,
    analysis: [
      "Peanut allergy is one of the most common severe food allergies. Peanut is a legume, not a tree nut, and peanut allergy doesn't reliably predict tree nut allergy."
    ]
  },
  allergen_treenut: {
    group: "Allergens",
    order: 7,
    label: "Tree nut",
    filter: true,
    analysis: [
      "Tree nut allergy (almond, cashew, walnut, hazelnut, Brazil nut, etc.) is botanically and clinically distinct from peanut allergy."
    ]
  },
  allergen_soy: {
    group: "Allergens",
    order: 8,
    label: "Soy",
    filter: true,
    analysis: [
      "Soy allergy is mediated by several soy proteins and can occasionally cross-react with peanut, since both are legumes."
    ]
  },
  allergen_sesame: {
    group: "Allergens",
    order: 9,
    label: "Sesame",
    filter: true,
    analysis: [
      "Sesame is one of the more recently recognized \"Big 9\" allergens and can cause severe reactions."
    ]
  },

  /* ---- Cross-reactive: broad OAS trait + specific pollen syndromes ---- */
  cross_reactive: {
    order: 10,
    label: "General (OAS)",
    filter: true,
    articleId: "cross_reactive",
    analysis: [
      "These foods can trigger oral allergy syndrome (OAS) in people allergic to certain pollens, due to structurally similar proteins. Reactions are usually mild and often resolve with cooking.",
      "See the Cross-Reactivity article for the three pollen groups."
    ]
  },
  cross_birch: {
    group: "Cross-reactivity",
    order: 1,
    label: "Birch pollen",
    filter: true,
    analysis: [
      "Relevant for people with a birch pollen allergy, due to a shared protein family (PR-10) between birch pollen and these foods — classically apples, stone fruits, carrots, celery/celeriac, hazelnuts and soy."
    ]
  },
  cross_grass: {
    group: "Cross-reactivity",
    order: 2,
    label: "Grass pollen",
    filter: true,
    analysis: [
      "Relevant for people with a grass pollen allergy. Cross-reactive proteins are found in foods like melon, watermelon, tomato, orange, peanut and potato."
    ]
  },
  cross_latex: {
    group: "Cross-reactivity",
    order: 3,
    label: "Latex",
    filter: true,
    analysis: [
      "Relevant for people with a latex allergy (e.g. healthcare workers). Cross-reactive proteins (mainly chitinases) are found in foods like banana, avocado, kiwi and papaya."
    ]
  }
};

const CATEGORIES = [
  {
    id: "roots",
    label: "Roots",
    foods: [
      { name: "Beet Root", traits: ["fiber", "carbs"] },
      { name: "Carrot", traits: ["fiber", "carbs", "cross_reactive", "cross_birch"] },
      { name: "Celeriac Root", traits: ["fiber", "cross_reactive", "cross_birch"] },
      { name: "Jerusalem Artichoke", traits: ["fiber", "carbs", "fodmaps", "fructans"] },
      { name: "Parsnip", traits: ["fiber", "carbs"] },
      { name: "Potato", traits: ["fiber", "carbs", "cross_reactive", "cross_birch", "cross_grass"] },
      { name: "Suede", traits: ["fiber"] },
      { name: "Sweet Potato", traits: ["fiber", "carbs"] }
    ]
  },
  {
    id: "veggies",
    label: "Vegetables",
    foods: [
      { name: "Cabbage", traits: ["fiber", "fodmaps", "fructans"] },
      { name: "Kale", traits: ["fiber"] },
      { name: "Onion", traits: ["fiber", "fodmaps", "fructans", "irritant", "allyl_compounds"] },
      { name: "Tomato", traits: ["fiber", "histamine", "irritant", "cross_reactive", "cross_grass", "cross_latex"] },
      { name: "Cauliflower", traits: ["fiber", "fodmaps", "polyols"] },
      { name: "Aubergine", traits: ["fiber", "histamine"] },
      { name: "Parsley", traits: ["fiber"] },
      { name: "Leek", traits: ["fiber", "fodmaps", "fructans"] },
      { name: "Shiitake Mushrooms", traits: ["fiber", "fodmaps", "polyols"] },
      { name: "Oyster Mushrooms", traits: ["fiber", "fodmaps", "polyols"] },
      { name: "White Button Mushrooms", traits: ["fiber", "fodmaps", "polyols", "histamine"] },
      { name: "Spinach", traits: ["fiber", "histamine"] },
      { name: "Avocado", traits: ["over_10g_fat", "fiber", "bile_stimulant", "histamine", "cross_reactive", "cross_latex"] },
      { name: "Sauerkraut", traits: ["fiber", "histamine"] },
      { name: "Cucumber", traits: ["fiber", "irritant", "peel_skin"] },
      { name: "Pickled Cucumber", traits: ["histamine", "aceticAcid", "irritant"] },
      { name: "Bell Pepper (sweet)", traits: ["irritant"] },
      { name: "Bell Pepper (hot)", traits: ["histamine", "irritant", "capsaicin"] },
      { name: "Olives", traits: ["over_10g_fat", "bile_stimulant", "histamine"] },
      { name: "Asparagus", traits: ["fiber", "fodmaps", "fructans"] }
    ]
  },
  {
    id: "fruits",
    label: "Fruits",
    foods: [
      { name: "Apples", traits: ["fiber", "carbs", "fodmaps", "fructose", "polyols", "irritant", "peel_skin", "cross_reactive", "cross_birch"] },
      { name: "Oranges", traits: ["fiber", "histamine", "cross_reactive", "cross_grass"] },
      { name: "Pears", traits: ["fiber", "fodmaps", "fructose", "polyols", "irritant", "peel_skin", "cross_reactive", "cross_birch"] },
      { name: "Mangos", traits: ["fiber", "fodmaps", "fructose"] },
      { name: "Blueberry", traits: ["fiber"] },
      { name: "Strawberry", traits: ["fiber", "histamine"] },
      { name: "Cherries", traits: ["fiber", "fodmaps", "polyols", "cross_reactive", "cross_birch"] },
      { name: "Blackberries", traits: ["fiber", "fodmaps", "polyols"] },
      { name: "Raspberries", traits: ["fiber", "histamine"] },
      { name: "Lemon", traits: ["fiber", "histamine"] },
      { name: "Lime", traits: ["fiber", "histamine"] },
      { name: "Grapefruit", traits: ["fiber", "histamine"] },
      { name: "Grapes", traits: ["fiber"] },
      { name: "Rhubarb", traits: ["fiber"] },
      { name: "Cloudberries", traits: ["fiber"] },
      { name: "Lingonberry", traits: ["fiber"] },
      { name: "Banana", traits: ["fiber", "histamine", "cross_reactive", "cross_latex"] },
      { name: "Kiwi", traits: ["fiber", "histamine", "cross_reactive", "cross_birch", "cross_grass", "cross_latex"] },
      { name: "Pineapple", traits: ["fiber", "histamine"] },
      { name: "Papaya", traits: ["fiber", "histamine", "cross_reactive", "cross_latex"] },
      { name: "Watermelon", traits: ["fiber", "fodmaps", "fructose", "cross_reactive", "cross_grass"] },
      { name: "Melon", traits: ["fiber", "cross_reactive", "cross_grass"] },
      { name: "Apricot", traits: ["fiber", "cross_reactive", "cross_birch"] },
      { name: "Plum", traits: ["fiber", "histamine", "cross_reactive", "cross_birch"] }
    ]
  },
  {
    id: "nuts",
    label: "Nuts/Seeds",
    foods: [
      { name: "Almond", traits: ["fiber", "over_10g_fat", "bile_stimulant", "carbs", "protein", "fodmaps", "galactans", "cross_reactive", "cross_birch", "allergen", "allergen_treenut"] },
      { name: "Brazil Nut", traits: ["fiber", "over_10g_fat", "bile_stimulant", "carbs", "protein", "fodmaps", "galactans", "allergen", "allergen_treenut"] },
      { name: "Cashew Nut", traits: ["fiber", "over_10g_fat", "bile_stimulant", "carbs", "protein", "fodmaps", "galactans", "allergen", "allergen_treenut", "histamine"] },
      { name: "Chiaseeds (whole)", traits: ["fiber"] },
      { name: "Chiaseeds (ground)", traits: ["fiber", "over_10g_fat", "bile_stimulant", "carbs", "protein"] },
      { name: "Flaxseed (whole)", traits: ["fiber", "fodmaps", "fructans"] },
      { name: "Flaxseed (ground)", traits: ["fiber", "over_10g_fat", "bile_stimulant", "carbs", "protein", "fodmaps", "fructans"] },
      { name: "Hazelnut", traits: ["fiber", "over_10g_fat", "bile_stimulant", "carbs", "protein", "fodmaps", "fructans", "allergen", "allergen_treenut", "cross_reactive", "cross_birch", "histamine"] },
      { name: "Peanut", traits: ["fiber", "over_10g_fat", "bile_stimulant", "carbs", "protein", "fodmaps", "galactans", "allergen", "allergen_peanut", "cross_reactive", "cross_grass", "histamine"] },
      { name: "Pumpkin Seeds", traits: ["fiber", "over_10g_fat", "bile_stimulant", "carbs", "protein"] },
      { name: "Sunflower Seeds", traits: ["fiber", "over_10g_fat", "bile_stimulant", "carbs", "protein", "histamine"] },
      { name: "Walnut", traits: ["fiber", "over_10g_fat", "bile_stimulant", "protein", "carbs", "histamine", "allergen", "allergen_treenut"] },
      { name: "Sesame Seeds", traits: ["fiber", "over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_sesame", "histamine"] }
    ]
  },
  {
    id: "grains",
    label: "Grains",
    foods: [
      { name: "Oats", traits: ["fiber", "carbs", "protein"] },
      { name: "Wheat", traits: ["fiber", "carbs", "protein", "fodmaps", "fructans", "allergen", "allergen_wheat", "histamine"] },
      { name: "Rye", traits: ["fiber", "carbs", "protein", "fodmaps", "fructans", "histamine"] },
      { name: "Barley", traits: ["fiber", "carbs", "protein", "fodmaps", "fructans", "histamine"] },
      { name: "Quinoa", traits: ["fiber", "carbs", "protein"] },
      { name: "Buckwheat", traits: ["fiber", "carbs", "protein"] },
      { name: "Rice", traits: ["fiber", "carbs", "protein"] }
    ]
  },
  {
    id: "legumes",
    label: "Legumes",
    foods: [
      { name: "Black Bean", traits: ["fiber", "carbs", "protein", "fodmaps", "galactans", "histamine"] },
      { name: "Chickpea", traits: ["fiber", "carbs", "protein", "fodmaps", "galactans", "histamine"] },
      { name: "Common Peas", traits: ["fiber", "carbs", "protein", "fodmaps", "fructans"] },
      { name: "Lentils", traits: ["fiber", "carbs", "protein", "fodmaps", "galactans", "histamine"] },
      { name: "Tempeh", traits: ["fiber", "carbs", "protein", "allergen", "allergen_soy"] },
      { name: "Tofu (firm)", traits: ["fiber", "carbs", "protein", "allergen", "allergen_soy", "cross_reactive", "cross_birch"] },
      { name: "Tofu (silken)", traits: ["fiber", "carbs", "protein", "fodmaps", "galactans", "allergen", "allergen_soy", "cross_reactive", "cross_birch", "histamine"] },
      { name: "Soybeans", traits: ["fiber", "carbs", "protein", "over_10g_fat", "bile_stimulant", "fodmaps", "galactans", "allergen", "allergen_soy", "cross_reactive", "cross_birch"] },
      { name: "Edamame", traits: ["fiber", "carbs", "protein", "allergen", "allergen_soy", "cross_reactive", "cross_birch"] }
    ]
  },
  {
    id: "animals",
    label: "Animals",
    foods: [
      { name: "Cows Meat", traits: ["protein"] },
      { name: "Pork", traits: ["over_10g_fat", "bile_stimulant", "protein"] },
      { name: "Salmon", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_fish"] },
      { name: "Cod", traits: ["protein", "allergen", "allergen_fish"] },
      { name: "Oysters", traits: ["protein", "allergen", "allergen_shellfish", "histamine"] },
      { name: "Lobsters", traits: ["protein", "allergen", "allergen_shellfish", "histamine"] },
      { name: "Crayfish", traits: ["protein", "allergen", "allergen_shellfish", "histamine"] },
      { name: "Elk Meat", traits: ["protein"] },
      { name: "Shrimp", traits: ["protein", "allergen", "allergen_shellfish", "histamine"] },
      { name: "Egg White", traits: ["protein", "allergen", "allergen_egg"] },
      { name: "Egg Yolk", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_egg"] },
      { name: "Tuna", traits: ["protein", "allergen", "allergen_fish", "histamine"] },
      { name: "Anchovies", traits: ["protein", "allergen", "allergen_fish", "histamine"] },
      { name: "Smoked Salmon", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_fish", "histamine"] },
      { name: "Crab", traits: ["protein", "allergen", "allergen_shellfish", "histamine"] },
      { name: "Mussels", traits: ["protein", "allergen", "allergen_shellfish", "histamine"] },
      { name: "Salami", traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine"] },
      { name: "Dry-Cured Ham", traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine"] },
      { name: "Sausages", traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine"] },
      { name: "Minced Meat (pre-packed)", traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine"] }
    ]
  },
  {
    id: "dairy",
    label: "Dairy",
    foods: [
      { name: "Cows Milk", traits: ["protein", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Goats Milk", traits: ["protein", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Sheeps Milk", traits: ["protein", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Cheese", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk"] },
      { name: "Yogurt", traits: ["protein", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk", "histamine"] },
      { name: "Greek Yogurt", traits: ["over_10g_fat", "bile_stimulant", "protein", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk", "histamine"] },
      { name: "Butter", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_milk"] },
      { name: "Cream", traits: ["over_10g_fat", "bile_stimulant", "protein", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Quark Cheese", traits: ["protein", "allergen", "allergen_milk"] },
      { name: "Cottage Cheese", traits: ["protein", "allergen", "allergen_milk"] },
      { name: "Sour Cream", traits: ["over_10g_fat", "bile_stimulant", "protein", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk", "histamine"] },
      { name: "Cream Cheese", traits: ["over_10g_fat", "bile_stimulant", "protein", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Ricotta Cheese", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk"] },
      { name: "Mascarpone", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk"] },
      { name: "Parmesan", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine"] },
      { name: "Halloumi", traits: ["over_10g_fat", "bile_stimulant", "protein", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Blue Cheese", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine"] },
      { name: "Camembert", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine"] },
      { name: "Cheddar", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine"] },
      { name: "Aged Gouda", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine"] },
      { name: "Whey Protein", traits: ["protein", "allergen", "allergen_milk"] }
    ]
  },
  {
    id: "spices",
    label: "Spices",
    foods: [
      { name: "Chili", traits: ["histamine", "irritant", "capsaicin"] },
      { name: "Garlic", traits: ["fodmaps", "fructans", "irritant", "allyl_compounds"] },
      { name: "Turmeric", traits: ["fiber", "bile_stimulant"] },
      { name: "Vinegar", traits: ["aceticAcid", "irritant"] },
      { name: "Balsamic Vinegar", traits: ["aceticAcid", "irritant", "histamine"] },
      { name: "Mustard", traits: ["histamine", "irritant", "allyl_compounds"] },
      { name: "Black Pepper", traits: ["histamine"] },
      { name: "Soy Sauce", traits: ["histamine", "allergen", "allergen_soy", "allergen_wheat"] }
    ]
  },
  {
    id: "beverages",
    label: "Beverages",
    foods: [
      { name: "Red Wine", traits: ["alcohol", "histamine", "irritant"] },
      { name: "White Wine", traits: ["alcohol", "histamine", "irritant"] },
      { name: "Champagne", traits: ["alcohol", "histamine", "irritant", "carbonation"] },
      { name: "Beer", traits: ["alcohol", "carbs", "histamine", "irritant", "carbonation"] },
      { name: "Cider", traits: ["alcohol", "carbs", "irritant", "carbonation"] },
      { name: "Spirits (Liquor)", traits: ["alcohol", "irritant"] },
      { name: "Coffee", traits: ["caffeine", "irritant"] },
      { name: "Espresso", traits: ["caffeine", "irritant"] },
      { name: "Black Tea", traits: ["caffeine", "irritant", "histamine"] },
      { name: "Green Tea", traits: ["caffeine"] },
      { name: "Mate Tea", traits: ["caffeine"] },
      { name: "Energy Drinks", traits: ["caffeine", "irritant", "carbonation"] },
      { name: "Cola", traits: ["caffeine", "carbs", "carbonation", "irritant"] },
      { name: "Soy Milk", traits: ["protein", "carbs", "allergen", "allergen_soy"] },
      { name: "Oat Drink", traits: ["carbs", "fiber", "histamine"] }
    ]
  },
  {
    id: "ultraProcessed",
    label: "Ultra-Processed Foods",
    foods: [
      { name: "Potato chips", traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Candy bars", traits: ["over_10g_fat", "bile_stimulant", "carbs"] },
      { name: "Sugary soft drinks", traits: ["carbs", "carbonation", "irritant"] },
      { name: "Frozen pizza", traits: ["over_10g_fat", "bile_stimulant", "carbs"] },
      { name: "Milk chocolate", traits: ["over_10g_fat", "bile_stimulant", "carbs", "over_3g_lactose", "fodmaps", "caffeine", "allergen", "allergen_milk", "histamine"] },
      { name: "Ice Cream", traits: ["over_10g_fat", "bile_stimulant", "carbs", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Dark Chocolate", traits: ["over_10g_fat", "bile_stimulant", "carbs", "fiber", "caffeine", "histamine"] }
    ]
  }
];
