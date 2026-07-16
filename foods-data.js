/* =========================================================================
   foods-data.js — all editable content for the Food Intolerance Guide
   =========================================================================

   This is the ONLY file you need to touch to add a category, a food, or a
   trait. app.html, styles.css and script.js read everything from here.
   (index.html is the landing page and also reads from here, for its demo.)

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
   traits for a typical selection (keeping fat/fiber/fodmaps/protein
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

     { name: "Jackfruit", traits: ["fiber"] }

   That's it — no HTML, CSS, or JS changes needed anywhere else.

   A new category should also be listed under a group in CATEGORY_GROUPS
   below (just its `id`, in whichever group it fits best) so it's shown
   next to related categories instead of on its own. If you forget, it
   still renders — grouped at the end under "Other".

   ---------------------------------------------------------------------
   FILTER LIST LAYOUT (the cards under "Filter Analysis" in the app)
   ---------------------------------------------------------------------
   FILTER_SECTIONS (below TRAITS) controls how filterable traits are
   grouped into cards, independent of any food/trait data. Each entry:

     {
       title: "Card heading",
       broad: "traitId",   // optional — rendered as the card's bold parent
                            // checkbox (usually a "broad" trait, see above)
       group: "GroupName", // optional — pulls every trait whose `group`
                            // matches, sorted by `order`, indented under
                            // the broad checkbox
       items: ["traitId"], // optional — extra standalone checkboxes with no
                            // broad/specific nesting (or the card's only
                            // content, if `broad`/`group` are omitted)
       wide: true           // optional — card spans both grid columns
     }

   A new trait with `filter: true` needs to be added to one of these
   sections (via `group` or `items`) to actually show up in the filter
   list — TRAITS alone only makes it filterable in principle.

   Fat and Protein are deliberately NOT filterable and don't appear in any
   section — they're tracked in the background and only ever surface as an
   automatic side note in the analysis popup when over 90% of the selected
   foods share one (see MACRO_TRAIT_IDS in script.js). Leave them out of
   FILTER_SECTIONS.

   Refined Carbohydrates (`refined_carbs`) used to be part of that passive
   macro group, but it's a categorical tag (assigned by food type/processing,
   not a g/100g cutoff) rather than a continuous macro, so it's filterable
   like any other trait — see "Other Digestive Factors" in FILTER_SECTIONS.
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
    articleId: "protein",
    analysis: [
      "These foods are protein-rich. Protein moderately stimulates bile release and can add to digestive workload in large amounts. Symptoms are more often linked to what accompanies the protein (lactose, allergens, histamine) than protein itself, though pancreatitis, pancreatic tumors, and true food allergy can cause direct reactions."
    ]
  },
  refined_carbs: {
    order: 6,
    label: "Refined carbs",
    filter: true,
    articleId: "refined_carbs",
    analysis: [
      "These foods are refined or ultra-processed carb sources — white bread, sugar, refined grains, and similar — rather than whole grains, legumes, or vegetables.",
      "This is a categorical tag based on food type and processing, not carbohydrate content."
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
    label: "Irritant",
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
    label: "Allergy",
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
    label: "Cross-reaction",
    filter: true,
    articleId: "cross_reactive",
    analysis: [
      "These foods can trigger oral allergy syndrome (OAS) in people allergic to certain pollens, due to structurally similar proteins. Reactions are usually mild and often resolve with cooking.",
      "See the Cross-Reactivity article for the three pollen groups."
    ]
  },
  alpha_gal: {
    order: 11,
    label: "Alpha-gal syndrome",
    filter: true,
    articleId: "alpha_gal",
    analysis: [
      "These foods are mammalian meat, which can trigger a delayed allergic reaction (alpha-gal syndrome) in people sensitized by a prior tick bite. Reactions often appear 3-8 hours after eating, making the food link easy to miss.",
      "See the Alpha-Gal Syndrome article for the tick-bite mechanism and diagnostic testing."
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

/* See "FILTER LIST LAYOUT" in the comment block above for the shape of
   each entry. */
const FILTER_SECTIONS = [
  {
    title: "GI Irritants",
    broad: "irritant",
    group: "GI Irritants"
  },
  {
    title: "FODMAPs",
    broad: "fodmaps",
    group: "FODMAPs"
  },
  {
    title: "Other Digestive Factors",
    items: ["fiber", "histamine", "bile_stimulant", "refined_carbs"]
  },
  {
    title: "Allergens",
    broad: "allergen",
    group: "Allergens"
  },
  {
    title: "Cross-Reactivity & Delayed Allergy",
    broad: "cross_reactive",
    group: "Cross-reactivity",
    items: ["alpha_gal"],
    wide: true
  }
];

const CATEGORIES = [
  {
    id: "roots",
    label: "Roots",
    foods: [
      { name: "Beet Root", traits: ["fodmaps", "fructans"] },
      { name: "Carrot", traits: ["cross_reactive", "cross_birch"] },
      { name: "Celeriac Root", traits: ["cross_reactive", "cross_birch"] },
      { name: "Jerusalem Artichoke", traits: ["fodmaps", "fructans"] },
      { name: "Parsnip", traits: [] },
      { name: "Potato", traits: ["cross_reactive", "cross_birch", "cross_grass"] },
      { name: "Suede", traits: [] },
      { name: "Sweet Potato", traits: [] },
      { name: "Radish", traits: ["irritant"] },
      { name: "Turnip", traits: ["histamine"] },
      { name: "Horseradish", traits: ["irritant", "histamine"] },
      { name: "Black Salsify", traits: ["fodmaps", "fructans"] },
      { name: "Kohlrabi", traits: ["histamine"] }
    ]
  },
  {
    id: "veggies",
    label: "Vegetables",
    foods: [
      { name: "Cabbage", traits: ["fodmaps", "fructans"] },
      { name: "Kale", traits: ["histamine"] },
      { name: "Onion", traits: ["fodmaps", "fructans", "irritant", "allyl_compounds", "histamine"] },
      { name: "Tomato", traits: ["histamine", "irritant", "cross_reactive", "cross_grass", "cross_latex"] },
      { name: "Cauliflower", traits: ["fodmaps", "fructans"] },
      { name: "Aubergine", traits: ["histamine", "fodmaps", "fructans"] },
      { name: "Parsley", traits: [] },
      { name: "Leek", traits: ["fodmaps", "fructans", "histamine"] },
      { name: "Spinach", traits: ["histamine"] },
      { name: "Avocado", traits: ["over_10g_fat", "fiber", "histamine", "cross_reactive", "cross_latex", "fodmaps", "polyols"] },
      { name: "Cucumber", traits: ["irritant", "peel_skin"] },
      { name: "Bell Pepper (sweet)", traits: ["irritant"] },
      { name: "Bell Pepper (hot)", traits: ["histamine", "irritant", "capsaicin"] },
      { name: "Asparagus", traits: ["fodmaps", "fructans"] },
      { name: "Fennel Bulb", traits: ["fodmaps", "fructans"] },
      { name: "Broccoli", traits: ["fodmaps", "fructans"] },
      { name: "Brussels Sprouts", traits: ["fodmaps", "fructans", "galactans", "histamine"] },
      { name: "Green Beans", traits: ["histamine"] },
      { name: "Zucchini", traits: [] },
      { name: "Pumpkin", traits: [] },
      { name: "Swiss Chard", traits: ["histamine"] },
      { name: "Romaine Lettuce", traits: [] },
      { name: "Rocket", traits: ["irritant"] },
      { name: "Celery", traits: ["fodmaps", "polyols", "cross_reactive", "cross_birch"] },
      { name: "Bok Choy", traits: [] },
      { name: "Daikon Radish", traits: ["irritant"] },
      { name: "Rhubarb", traits: ["histamine"] }
    ]
  },
  {
    id: "fruits",
    label: "Fruits",
    foods: [
      { name: "Apples", traits: ["fodmaps", "fructose", "polyols", "irritant", "peel_skin", "cross_reactive", "cross_birch"] },
      { name: "Oranges", traits: ["histamine", "cross_reactive", "cross_grass"] },
      { name: "Pears", traits: ["fodmaps", "fructose", "polyols", "irritant", "peel_skin", "cross_reactive", "cross_birch", "histamine"] },
      { name: "Mangos", traits: ["fodmaps", "fructose", "histamine"] },
      { name: "Lemon", traits: ["histamine"] },
      { name: "Lime", traits: ["histamine"] },
      { name: "Grapefruit", traits: ["histamine"] },
      { name: "Grapes", traits: [] },
      { name: "Banana", traits: ["histamine", "cross_reactive", "cross_latex"] },
      { name: "Kiwi", traits: ["histamine", "cross_reactive", "cross_birch", "cross_grass", "cross_latex"] },
      { name: "Pineapple", traits: ["histamine"] },
      { name: "Papaya", traits: ["histamine", "cross_reactive", "cross_latex"] },
      { name: "Watermelon", traits: ["fodmaps", "fructose", "cross_reactive", "cross_grass", "histamine"] },
      { name: "Melon", traits: ["cross_reactive", "cross_grass"] },
      { name: "Apricot", traits: ["cross_reactive", "cross_birch", "fodmaps", "polyols"] },
      { name: "Plum", traits: ["histamine", "cross_reactive", "cross_birch", "fodmaps", "polyols"] },
      { name: "Dates", traits: ["fiber", "fructose"] },
      { name: "Figs", traits: ["fodmaps", "fructose"] },
      { name: "Pomegranate", traits: [] },
      { name: "Lychee", traits: ["fructose", "fodmaps", "polyols"] },
      { name: "Star Fruit", traits: [] },
      { name: "Durian", traits: ["over_10g_fat", "fodmaps", "fructose", "histamine"] },
      { name: "Peach", traits: ["fodmaps", "polyols", "cross_reactive", "cross_birch"] },
      { name: "Nectarine", traits: ["fodmaps", "polyols", "cross_reactive", "cross_birch"] },
      { name: "Passion Fruit", traits: ["fiber"] }
    ]
  },
  {
    id: "berries",
    label: "Berries",
    foods: [
      { name: "Blueberry", traits: [] },
      { name: "Strawberry", traits: ["histamine"] },
      { name: "Cherries", traits: ["fodmaps", "polyols", "fructose", "cross_reactive", "cross_birch"] },
      { name: "Blackberries", traits: ["fodmaps", "polyols"] },
      { name: "Raspberries", traits: ["fiber", "histamine"] },
      { name: "Cloudberries", traits: [] },
      { name: "Lingonberry", traits: [] },
      { name: "Redcurrant", traits: [] },
      { name: "Blackcurrant", traits: [] },
      { name: "Gooseberry", traits: [] },
      { name: "Elderberry", traits: ["fiber"] },
      { name: "Cranberry", traits: [] }
    ]
  },
  {
    id: "nuts",
    label: "Nuts/Seeds",
    foods: [
      { name: "Almond", traits: ["fiber", "over_10g_fat", "bile_stimulant", "protein", "fodmaps", "galactans", "cross_reactive", "cross_birch", "allergen", "allergen_treenut", "histamine"] },
      { name: "Brazil Nut", traits: ["fiber", "over_10g_fat", "bile_stimulant", "fodmaps", "galactans", "allergen", "allergen_treenut"] },
      { name: "Cashew Nut", traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "galactans", "fructans", "allergen", "allergen_treenut", "histamine"] },
      { name: "Chiaseeds (whole)", traits: ["fiber"] },
      { name: "Chiaseeds (ground)", traits: ["fiber", "over_10g_fat", "bile_stimulant"] },
      { name: "Flaxseed (whole)", traits: ["fiber", "fodmaps", "fructans"] },
      { name: "Flaxseed (ground)", traits: ["fiber", "over_10g_fat", "bile_stimulant", "fodmaps", "fructans"] },
      { name: "Hazelnut", traits: ["fiber", "over_10g_fat", "bile_stimulant", "fodmaps", "fructans", "allergen", "allergen_treenut", "cross_reactive", "cross_birch", "histamine"] },
      { name: "Peanut", traits: ["fiber", "over_10g_fat", "bile_stimulant", "protein", "fodmaps", "galactans", "allergen", "allergen_peanut", "cross_reactive", "cross_grass", "histamine"] },
      { name: "Pumpkin Seeds", traits: ["fiber", "over_10g_fat", "bile_stimulant", "protein"] },
      { name: "Sunflower Seeds", traits: ["fiber", "over_10g_fat", "bile_stimulant", "protein", "histamine"] },
      { name: "Walnut", traits: ["fiber", "over_10g_fat", "bile_stimulant", "histamine", "allergen", "allergen_treenut"] },
      { name: "Sesame Seeds", traits: ["fiber", "over_10g_fat", "bile_stimulant", "allergen", "allergen_sesame", "histamine"] },
      { name: "Macadamia", traits: ["fiber", "over_10g_fat", "bile_stimulant", "allergen", "allergen_treenut"] },
      { name: "Pecan", traits: ["fiber", "over_10g_fat", "bile_stimulant", "allergen", "allergen_treenut"] }
    ]
  },
  {
    id: "grains",
    label: "Grains/pseudo grains",
    foods: [
      { name: "Oats", traits: [] },
      { name: "Wheat", traits: ["fodmaps", "fructans", "allergen", "allergen_wheat", "histamine"] },
      { name: "Rye", traits: ["fodmaps", "fructans", "histamine"] },
      { name: "Barley", traits: ["fodmaps", "fructans", "histamine"] },
      { name: "Quinoa", traits: [] },
      { name: "Buckwheat", traits: ["histamine"] },
      { name: "Rice", traits: [] },
      { name: "Couscous", traits: ["refined_carbs", "allergen", "allergen_wheat", "fodmaps", "fructans"] },
      { name: "Bulgur", traits: ["allergen", "allergen_wheat", "fodmaps", "fructans", "histamine"] },
      { name: "Freekeh", traits: ["allergen", "allergen_wheat", "fodmaps", "fructans", "histamine"] },
      { name: "Pita Bread", traits: ["allergen", "allergen_wheat", "fodmaps", "fructans", "refined_carbs", "histamine"] },
      { name: "Naan Bread", traits: ["allergen", "allergen_wheat", "fodmaps", "fructans", "refined_carbs", "over_10g_fat", "histamine"] },
      { name: "Soba Noodles", traits: ["refined_carbs", "allergen", "allergen_wheat", "fodmaps", "fructans"] },
      { name: "Rice Noodles", traits: ["refined_carbs"] },
      { name: "White Bread", traits: ["allergen", "allergen_wheat", "fodmaps", "fructans", "refined_carbs", "histamine"] },
      { name: "Pasta (no egg)", traits: ["refined_carbs", "allergen", "allergen_wheat", "fodmaps", "fructans"] },
      { name: "Teff", traits: [] },
      { name: "Sorghum/Durra", traits: [] }
    ]
  },
  {
    id: "legumes",
    label: "Legumes",
    foods: [
      { name: "Black Bean", traits: ["fiber", "fodmaps", "galactans", "histamine"] },
      { name: "Chickpea (whole/flour)", traits: ["fiber", "fodmaps", "galactans", "histamine"] },
      { name: "Common Peas", traits: ["fodmaps", "fructans", "histamine"] },
      { name: "Lentils", traits: ["fiber", "fodmaps", "galactans", "histamine"] },
      { name: "Tempeh", traits: ["protein", "allergen", "allergen_soy", "histamine"] },
      { name: "Tofu (firm)", traits: ["allergen", "allergen_soy", "cross_reactive", "cross_birch", "histamine"] },
      { name: "Tofu (silken)", traits: ["fodmaps", "galactans", "allergen", "allergen_soy", "cross_reactive", "cross_birch", "histamine"] },
      { name: "Soybeans", traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "galactans", "allergen", "allergen_soy", "cross_reactive", "cross_birch", "histamine"] },
      { name: "Edamame", traits: ["allergen", "allergen_soy", "cross_reactive", "cross_birch", "histamine"] },
      { name: "Falafel", traits: ["fodmaps", "galactans", "histamine"] },
      { name: "Fava Beans", traits: ["fodmaps", "galactans", "histamine"] },
      { name: "Kidney Beans", traits: ["fiber", "fodmaps", "galactans", "histamine"] },
      { name: "Pinto Beans", traits: ["fiber", "fodmaps", "galactans", "histamine"] },
      { name: "Split Peas", traits: ["fiber", "fodmaps", "galactans", "histamine"] }
    ]
  },
  {
    id: "landAnimals",
    label: "Land Animals",
    foods: [
      { name: "Cows Meat", traits: ["protein", "alpha_gal"] },
      { name: "Pork (lean cut)", traits: ["protein", "alpha_gal"] },
      { name: "Pork (fatty cut)", traits: ["over_10g_fat", "bile_stimulant", "protein", "alpha_gal"] },
      { name: "Elk Meat", traits: ["protein", "alpha_gal"] },
      { name: "Egg White", traits: ["allergen", "allergen_egg"] },
      { name: "Egg Yolk", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_egg"] },
      { name: "Salami", traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine", "alpha_gal"] },
      { name: "Dry-Cured Ham (lean)", traits: ["protein", "histamine", "alpha_gal"] },
      { name: "Dry-Cured Ham (fatty cut)", traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine", "alpha_gal"] },
      { name: "Sausages (lean)", traits: ["protein", "histamine"] },
      { name: "Sausages (regular)", traits: ["over_10g_fat", "bile_stimulant", "histamine", "alpha_gal"] },
      { name: "Minced Meat (~5% fat)", traits: ["protein", "histamine", "alpha_gal"] },
      { name: "Minced Meat (~12% fat)", traits: ["over_10g_fat", "protein", "histamine", "alpha_gal"] },
      { name: "Minced Meat (~20% fat)", traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine", "alpha_gal"] },
      { name: "Lamb", traits: ["over_10g_fat", "bile_stimulant", "protein", "alpha_gal"] },
      { name: "Duck", traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Turkey", traits: ["protein"] },
      { name: "Frozen Meatballs", traits: ["over_10g_fat", "bile_stimulant", "histamine", "alpha_gal"] },
      { name: "Hot Dog Sausage", traits: ["over_10g_fat", "bile_stimulant", "histamine", "alpha_gal"] },
      { name: "Chicken Nuggets", traits: ["over_10g_fat", "allergen", "allergen_wheat"] }
    ]
  },
  {
    id: "seafood",
    label: "Seafood",
    foods: [
      { name: "Salmon", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_fish"] },
      { name: "Cod", traits: ["protein", "allergen", "allergen_fish"] },
      { name: "Oysters", traits: ["allergen", "allergen_shellfish", "histamine"] },
      { name: "Lobsters", traits: ["protein", "allergen", "allergen_shellfish", "histamine"] },
      { name: "Crayfish", traits: ["protein", "allergen", "allergen_shellfish", "histamine"] },
      { name: "Shrimp", traits: ["protein", "allergen", "allergen_shellfish", "histamine"] },
      { name: "Tuna", traits: ["protein", "allergen", "allergen_fish", "histamine"] },
      { name: "Anchovies", traits: ["protein", "allergen", "allergen_fish", "histamine"] },
      { name: "Smoked Salmon", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_fish", "histamine"] },
      { name: "Crab", traits: ["allergen", "allergen_shellfish", "histamine"] },
      { name: "Mussels", traits: ["protein", "allergen", "allergen_shellfish", "histamine"] },
      { name: "Fish Balls", traits: ["allergen", "allergen_fish", "histamine"] },
      { name: "Fish Fingers", traits: ["allergen", "allergen_fish", "allergen_wheat"] },
      { name: "Nori", traits: ["fiber", "histamine"] }
    ]
  },
  {
    id: "dairy",
    label: "Dairy",
    foods: [
      { name: "Cows Milk", traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Goats Milk", traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Sheeps Milk", traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Cream Cheese (<10% fat)", traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Cream Cheese (>10% fat)", traits: ["over_10g_fat", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Hard Cheese (~15% fat)", traits: ["over_10g_fat", "protein", "allergen", "allergen_milk", "histamine"] },
      { name: "Hard Cheese (~28-35% fat)", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine"] },
      { name: "White Cheese (~0% fat)", traits: ["allergen", "allergen_milk", "over_3g_lactose"] },
      { name: "Yogurt", traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk", "histamine"] },
      { name: "Greek Yogurt (0% fat)", traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk", "histamine"] },
      { name: "Greek Yogurt (2% fat)", traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk", "histamine"] },
      { name: "Greek Yogurt (10% fat)", traits: ["over_10g_fat", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk", "histamine"] },
      { name: "Butter", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_milk"] },
      { name: "Cream", traits: ["over_10g_fat", "bile_stimulant", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Quark Cheese (~0.2% fat)", traits: ["allergen", "allergen_milk", "over_3g_lactose"] },
      { name: "Quark Cheese (~11% fat)", traits: ["over_10g_fat", "allergen", "allergen_milk", "over_3g_lactose"] },
      { name: "Cottage Cheese", traits: ["allergen", "allergen_milk", "over_3g_lactose"] },
      { name: "Sour Cream (~10% fat)", traits: ["over_10g_fat", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk", "histamine"] },
      { name: "Sour Cream (~20% fat)", traits: ["over_10g_fat", "bile_stimulant", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk", "histamine"] },
      { name: "Ricotta Cheese", traits: ["over_10g_fat", "allergen", "allergen_milk", "over_3g_lactose"] },
      { name: "Mascarpone", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_milk", "over_3g_lactose"] },
      { name: "Parmesan", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine"] },
      { name: "Halloumi", traits: ["over_10g_fat", "bile_stimulant", "protein", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Blue Cheese", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine"] },
      { name: "Camembert", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine"] },
      { name: "Cheddar", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine"] },
      { name: "Aged Gouda", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine"] },
      { name: "Whey Protein", traits: ["protein", "allergen", "allergen_milk", "over_3g_lactose"] },
      { name: "Feta Cheese", traits: ["over_10g_fat", "allergen", "allergen_milk", "histamine", "over_3g_lactose"] },
      { name: "Labneh", traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk", "histamine"] },
      { name: "Paneer", traits: ["protein", "allergen", "allergen_milk", "over_3g_lactose"] },
      { name: "Skyr", traits: ["over_3g_lactose", "allergen", "allergen_milk", "histamine"] },
      { name: "Buttermilk", traits: ["over_3g_lactose", "allergen", "allergen_milk", "histamine"] },
      { name: "Kefir", traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk", "histamine"] },
    ]
  },
  {
    id: "spices",
    label: "Spices",
    foods: [
      { name: "Chili", traits: ["histamine", "irritant", "capsaicin"] },
      { name: "Garlic", traits: ["fodmaps", "fructans", "irritant", "allyl_compounds", "histamine"] },
      { name: "Ginger", traits: ["histamine"] },
      { name: "Dill", traits: [] },
      { name: "Turmeric", traits: ["bile_stimulant"] },
      { name: "Mustard", traits: ["histamine", "irritant", "allyl_compounds"] },
      { name: "Black Pepper", traits: ["histamine"] },
      { name: "Za'atar", traits: ["irritant"] },
      { name: "Sumac", traits: ["irritant", "aceticAcid"] },
      { name: "Cumin", traits: ["histamine"] },
      { name: "Shawarma Spice Mix", traits: ["irritant"] },
      { name: "Wasabi", traits: ["irritant", "allyl_compounds"] },
      { name: "Curry Powder", traits: ["irritant", "capsaicin", "histamine"] },
      { name: "Sichuan Peppercorn", traits: ["irritant"] },
      { name: "Nutmeg", traits: ["histamine"] }
    ]
  },
  {
    id: "beverages",
    label: "Beverages",
    foods: [
      { name: "Red Wine", traits: ["alcohol", "histamine", "irritant"] },
      { name: "White Wine", traits: ["alcohol", "histamine", "irritant"] },
      { name: "Champagne", traits: ["alcohol", "histamine", "irritant", "carbonation"] },
      { name: "Beer", traits: ["alcohol", "histamine", "irritant", "carbonation"] },
      { name: "Cider", traits: ["alcohol", "irritant", "carbonation", "histamine"] },
      { name: "Spirits (Liquor)", traits: ["alcohol", "irritant", "histamine"] },
      { name: "Coffee", traits: ["caffeine", "irritant", "histamine"] },
      { name: "Espresso", traits: ["caffeine", "irritant", "histamine"] },
      { name: "Black Tea", traits: ["caffeine", "irritant", "histamine"] },
      { name: "Green Tea", traits: ["caffeine", "histamine"] },
      { name: "Mate Tea", traits: ["caffeine", "histamine"] },
      { name: "Energy Drinks", traits: ["caffeine", "irritant", "carbonation", "histamine"] },
      { name: "Soy Milk", traits: ["allergen", "allergen_soy", "histamine", "fodmaps", "galactans"] },
      { name: "Oat Drink", traits: ["histamine"] },
      { name: "Coconut Milk", traits: ["over_10g_fat", "fodmaps", "polyols", "histamine"] },
      { name: "Matcha", traits: ["caffeine", "histamine"] },
      { name: "Chai Tea", traits: ["caffeine", "histamine"] },
      { name: "Kombucha", traits: ["histamine", "carbonation"] }
    ]
  },
  {
    id: "ultraProcessed",
    label: "Processed Foods",
    foods: [
      { name: "Frozen pizza", traits: ["over_10g_fat", "bile_stimulant", "refined_carbs"] },
      { name: "French Fries", traits: ["over_10g_fat", "refined_carbs"] },
      { name: "Instant Ramen", traits: ["allergen", "allergen_wheat", "fodmaps", "fructans", "histamine"] },
      { name: "Margarine", traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Instant Soup / Bouillon Cubes", traits: ["fodmaps", "fructans", "histamine"] },
      { name: "Flavored Yogurt", traits: ["over_3g_lactose", "fodmaps", "refined_carbs", "allergen", "allergen_milk", "histamine"] },
      { name: "Pretzels", traits: ["allergen", "allergen_wheat", "refined_carbs", "histamine"] },
      { name: "Instant Mashed Potato", traits: ["refined_carbs"] },
      { name: "Dumplings", traits: ["allergen", "allergen_wheat", "over_10g_fat"] },
      { name: "Fresh Pasta (w/ egg)", traits: ["refined_carbs", "allergen", "allergen_wheat", "allergen_egg", "fodmaps", "fructans"] }
    ]
  },
  {
    id: "condiments",
    label: "Condiments",
    foods: [
      { name: "Soy Sauce", traits: ["histamine", "allergen", "allergen_soy", "allergen_wheat"] },
      { name: "Vinegar", traits: ["aceticAcid", "irritant"] },
      { name: "Balsamic Vinegar", traits: ["aceticAcid", "irritant", "histamine"] },
      { name: "Aioli", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_egg", "irritant", "allyl_compounds", "histamine"] },
      { name: "Pesto", traits: ["over_10g_fat", "allergen", "allergen_treenut", "allergen_milk", "histamine", "fodmaps", "fructans"] },
      { name: "Tzatziki", traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk", "histamine"] },
      { name: "Hummus", traits: ["fodmaps", "galactans", "histamine"] },
      { name: "Guacamole", traits: ["over_10g_fat", "fiber", "histamine", "cross_reactive", "cross_latex"] },
      { name: "Mango Chutney", traits: ["refined_carbs", "histamine"] },
      { name: "Cranberry Sauce", traits: ["refined_carbs", "fructose"] },
      { name: "Fish Roe Spread", traits: ["histamine", "allergen", "allergen_fish"] },
      { name: "Yeast Extract", traits: ["histamine"] },
      { name: "Ajvar", traits: ["irritant", "histamine"] },
      { name: "Harissa", traits: ["irritant", "capsaicin", "histamine"] },
      { name: "Tahini", traits: ["over_10g_fat", "allergen", "allergen_sesame"] },
      { name: "Baba Ganoush", traits: ["histamine"] },
      { name: "Preserved Lemon", traits: ["histamine", "aceticAcid"] },
      { name: "Sesame Oil", traits: ["over_10g_fat", "allergen", "allergen_sesame"] },
      { name: "Olive Oil", traits: ["over_10g_fat"] },
      { name: "Sunflower Oil", traits: ["over_10g_fat"] },
      { name: "Rapeseed Oil", traits: ["over_10g_fat"] },
      { name: "Coconut Oil", traits: ["over_10g_fat"] },
      { name: "Ghee", traits: ["over_10g_fat", "bile_stimulant", "histamine"] },
      { name: "Tamarind", traits: ["aceticAcid"] }
    ]
  },
  {
    id: "sauces",
    label: "Sauces",
    foods: [
      { name: "Ketchup", traits: ["histamine", "aceticAcid", "irritant"] },
      { name: "Mayonnaise", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_egg"] },
      { name: "Barbecue Sauce", traits: ["histamine", "aceticAcid", "irritant", "refined_carbs"] },
      { name: "Hot Sauce", traits: ["histamine", "irritant", "capsaicin"] },
      { name: "Worcestershire Sauce", traits: ["histamine", "allergen", "allergen_fish"] },
      { name: "Horseradish Sauce", traits: ["irritant", "over_10g_fat", "histamine"] },
      { name: "Tartar Sauce", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_egg", "histamine"] },
      { name: "Salsa", traits: ["histamine", "irritant"] },
      { name: "Ranch Dressing", traits: ["over_10g_fat", "allergen", "allergen_milk", "allergen_egg", "histamine"] },
      { name: "Thousand Island Dressing", traits: ["over_10g_fat", "allergen", "allergen_egg", "histamine"] },
      { name: "Teriyaki Sauce", traits: ["histamine", "allergen", "allergen_soy", "allergen_wheat", "refined_carbs"] },
      { name: "Fish Sauce", traits: ["histamine", "allergen", "allergen_fish"] },
      { name: "Oyster Sauce", traits: ["histamine", "allergen", "allergen_shellfish"] },
      { name: "Hoisin Sauce", traits: ["histamine", "allergen", "allergen_soy", "allergen_wheat", "refined_carbs"] },
      { name: "Brown Gravy", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_wheat", "histamine"] },
      { name: "Béarnaise Sauce", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_egg", "allergen_milk", "histamine"] },
      { name: "Hollandaise Sauce", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_egg", "allergen_milk", "histamine"] },
      { name: "Remoulade", traits: ["over_10g_fat", "allergen", "allergen_egg", "irritant", "histamine"] }
    ]
  },
  {
    id: "mushrooms",
    label: "Mushrooms",
    foods: [
      { name: "Shiitake Mushrooms", traits: ["fodmaps", "polyols", "histamine"] },
      { name: "Oyster Mushrooms", traits: ["histamine"] },
      { name: "White Button Mushrooms", traits: ["fodmaps", "polyols", "histamine"] },
      { name: "Portobello Mushrooms", traits: ["fodmaps", "polyols", "histamine"] },
      { name: "Cremini Mushrooms", traits: ["fodmaps", "polyols", "histamine"] },
      { name: "Enoki Mushrooms", traits: ["fodmaps", "polyols", "histamine"] },
      { name: "Chanterelle Mushrooms", traits: ["fodmaps", "polyols", "histamine"] },
      { name: "Porcini Mushrooms", traits: ["fodmaps", "polyols", "histamine"] },
      { name: "Morel Mushrooms", traits: ["fodmaps", "polyols", "histamine"] },
      { name: "King Oyster Mushrooms", traits: ["histamine"] }
    ]
  },
  {
    id: "snacksSweets",
    label: "Snacks & Sweets",
    foods: [
      { name: "Potato chips", traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Candy bars", traits: ["over_10g_fat", "bile_stimulant", "refined_carbs"] },
      { name: "Milk chocolate", traits: ["over_10g_fat", "bile_stimulant", "refined_carbs", "over_3g_lactose", "fodmaps", "caffeine", "allergen", "allergen_milk", "histamine"] },
      { name: "Dark Chocolate", traits: ["over_10g_fat", "bile_stimulant", "refined_carbs", "fiber", "caffeine", "histamine"] },
      { name: "Cheese Puffs / Snacks", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_milk"] },
      { name: "Granola Bar", traits: ["refined_carbs", "allergen", "allergen_treenut"] },
      { name: "Protein Bar", traits: ["protein", "refined_carbs", "allergen", "allergen_milk"] },
      { name: "Microwave Popcorn", traits: ["over_10g_fat", "bile_stimulant", "fiber"] },
      { name: "Sugary Breakfast Cereal", traits: ["refined_carbs", "allergen", "allergen_wheat"] },
      { name: "Sugary soft drinks", traits: ["refined_carbs", "carbonation", "irritant", "histamine"] },
      { name: "Cola", traits: ["caffeine", "refined_carbs", "carbonation", "irritant", "histamine"] },
      { name: "Ice Cream", traits: ["over_10g_fat", "refined_carbs", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Halva", traits: ["over_10g_fat", "allergen", "allergen_sesame", "refined_carbs", "histamine"] },
      { name: "Baklava", traits: ["over_10g_fat", "refined_carbs", "allergen", "allergen_treenut", "allergen_wheat"] }
    ]
  },
  {
    id: "picklesFerments",
    label: "Pickles & Ferments",
    foods: [
      { name: "Kimchi", traits: ["histamine", "fodmaps", "fructans", "irritant"] },
      { name: "Sauerkraut", traits: ["histamine"] },
      { name: "Pickled Cucumber", traits: ["histamine", "aceticAcid", "irritant"] },
      { name: "Pickle Relish", traits: ["histamine", "aceticAcid", "irritant"] },
      { name: "Olives", traits: ["over_10g_fat", "histamine"] },
      { name: "Miso Paste", traits: ["histamine", "allergen", "allergen_soy", "fodmaps"] }
    ]
  }
];

/* Groups the category buttons under "Choose foods" into labeled clusters.
   List category `id`s (from CATEGORIES above), not labels. Any category id
   not listed here still renders, grouped under a trailing "Other" section —
   see FOOD_CATEGORY logic in script.js. */
const CATEGORY_GROUPS = [
  {
    title: "Produce",
    categories: ["roots", "veggies", "fruits", "berries", "mushrooms"]
  },
  {
    title: "Grains, Legumes & Nuts",
    categories: ["grains", "legumes", "nuts"]
  },
  {
    title: "Animal-Based",
    categories: ["landAnimals", "seafood", "dairy"]
  },
  {
    title: "Flavor & Extras",
    categories: ["spices", "condiments", "sauces", "picklesFerments"]
  },
  {
    title: "Processed & Beverages",
    categories: ["ultraProcessed", "snacksSweets", "beverages"]
  }
];
