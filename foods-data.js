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
    evidence: {
      level: "Well established",
      detail: "Measured histamine levels in food, and a well-characterised enzyme mechanism (DAO) for why it affects some people and not others."
    },
    analysis: [
      "These foods either contain histamine or form it during fermentation, ripening or as freshness declines. The mechanism is well established: histamine is broken down by DAO in the gut, and where that enzyme activity is reduced, more of it reaches the bloodstream.",
      "Levels vary enormously between products and between batches — aged cheese runs from undetectable to nearly 400 mg/kg. Freshness and storage time often matter more than which food it is.",
      "Fermentation on its own is not enough of an explanation. Yogurt and fresh cheese are not tagged, because a short set with a defined starter culture never releases the free histidine that bacteria need as substrate."
    ]
  },
  // Putrescine and cadaverine occupy DAO so histamine passes through — a
  // modifier, not a trigger. `modifierOf` keeps it out of the results whenever
  // the trait it modifies isn't in play; see getRankedTraits in script.js.
  dao_competitor: {
    order: 12,
    label: "DAO competitor",
    filter: true,
    articleId: "dao_competitor",
    modifierOf: "histamine",
    evidence: {
      level: "Preliminary",
      detail: "Test-tube enzyme assays and animal models only. No human studies, and no threshold for an effect has been established."
    },
    analysis: [
      "These foods contain putrescine or cadaverine — diamines that compete with histamine for the same enzyme, DAO. They add no histamine of their own, but may in theory slow the breakdown of whatever histamine the meal does contain.",
      "This is the weakest-evidenced trait in the tool. It rests on enzyme assays in test tubes and on animal models; there are no human studies. No threshold for an effect has been established, and the effect appears to depend on the ratio between the amines rather than on the amount in any one food.",
      "Likely relevant only for particularly sensitive people, and only alongside histamine-rich food — which is why it is shown only when the selection also contains histamine. A food high in putrescine but without histamine has nothing to compete with."
    ]
  },
  // Tagged from portion data, not concentration: cumin runs 605 mg/kg but a
  // portion is 2g, which puts it below a serving of green peas. The <10g
  // serving rule is therefore already built into the measure.
  salicylate: {
    order: 13,
    label: "Salicylates",
    filter: true,
    articleId: "salicylate",
    evidence: {
      level: "Limited",
      detail: "One blinded dietary trial, negative overall, with a clear response in a single participant. Food levels come from one country's measurements and conflict with another's."
    },
    analysis: [
      "These foods carry at least 1 mg of salicylic acid per normal portion. Salicylic acid is the same active principle as in aspirin, and sensitivity to it shows up as hives, itching, headache and gut symptoms.",
      "The only blinded dietary trial (Tuck 2021, n=10 in IBS) was negative overall. Clear symptom provocation appeared in a single participant — the one with known aspirin-induced urticaria — and a trend in one other. Estimated prevalence is around 2.5%.",
      "Ask about reactions to aspirin or NSAIDs. That is the phenotype where the signal actually sits, and a better way in than the food pattern itself.",
      "Preparation matters more than which food is chosen: peeling lowers the level three to fourfold and boiling lowers it, while pickling, marinating and concentrating raise it. The figures come from Australian measurements — a European study found no salicylates at all in Polish apple and pear varieties, and no Nordic data exists."
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
    items: ["fiber", "histamine", "dao_competitor", "salicylate", "bile_stimulant", "refined_carbs"]
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
      { name: "Beet Root", lmv: "Rödbeta", traits: ["fodmaps", "fructans", "salicylate"] },
      { name: "Carrot", lmv: "Morot", traits: ["cross_reactive", "cross_birch"] },
      { name: "Celeriac Root", lmv: "Rotselleri", traits: ["cross_reactive", "cross_birch"] },
      { name: "Jerusalem Artichoke", lmv: "Jordärtskocka", traits: ["fodmaps", "fructans"] },
      { name: "Parsnip", lmv: "Palsternacka", traits: [] },
      { name: "Potato", lmv: "Potatis rå", traits: ["cross_reactive", "cross_birch", "cross_grass"] },
      { name: "Swede", lmv: "Kålrot", traits: [] },
      { name: "Sweet Potato", lmv: "Sötpotatis rå", traits: ["salicylate"] },
      { name: "Radish", lmv: "Rädisa", traits: ["irritant"] },
      { name: "Turnip", lmv: "Majrova", traits: [] },
      { name: "Horseradish", smallServing: true, lmv: "Pepparrot", traits: ["irritant"] },
      { name: "Black Salsify", lmv: "Svartrot", traits: ["fodmaps", "fructans"] },
      { name: "Kohlrabi", lmv: "Kålrabbi", traits: ["fodmaps", "fructans"] }
    ]
  },
  {
    id: "veggies",
    label: "Vegetables",
    foods: [
      { name: "Cabbage", lmv: "Vitkål", traits: ["fodmaps", "fructans"] },
      { name: "Kale", lmv: "Grönkål", traits: [] },
      { name: "Onion", lmv: "Lök gul", traits: ["fodmaps", "fructans", "irritant", "allyl_compounds"] },
      { name: "Tomato", lmv: "Tomat", traits: ["histamine", "irritant", "cross_reactive", "cross_grass", "cross_latex", "dao_competitor"] },
      { name: "Cauliflower", lmv: "Blomkål", traits: ["fodmaps", "fructans"] },
      { name: "Aubergine", lmv: "Aubergine", traits: ["histamine", "fodmaps", "fructans", "dao_competitor"] },
      { name: "Parsley", lmv: "Persilja blad", traits: [] },
      { name: "Leek", lmv: "Purjolök", traits: ["fodmaps", "fructans"] },
      { name: "Spinach", lmv: "Spenat frysvara", traits: ["histamine"] },
      { name: "Avocado", lmv: "Avokado", traits: ["over_10g_fat", "bile_stimulant", "cross_reactive", "cross_latex", "fodmaps", "polyols", "salicylate"] },
      { name: "Cucumber", lmv: "Gurka", traits: ["irritant", "peel_skin"] },
      { name: "Bell Pepper (sweet)", lmv: "Paprika röd", traits: ["irritant"] },
      { name: "Bell Pepper (hot)", lmv: "Chilipeppar färsk", traits: ["irritant", "capsaicin"] },
      { name: "Asparagus", traits: ["fodmaps", "fructans"] },
      { name: "Fennel Bulb", lmv: "Fänkål", traits: ["fodmaps", "fructans"] },
      { name: "Broccoli", lmv: "Broccoli", traits: ["fodmaps", "fructans"] },
      { name: "Brussels Sprouts", lmv: "Brysselkål", traits: ["fodmaps", "fructans", "galactans"] },
      { name: "Green Beans", lmv: "Gröna bönor", traits: ["salicylate"] },
      { name: "Zucchini", lmv: "Squash", traits: [] },
      { name: "Pumpkin", lmv: "Pumpa", traits: ["dao_competitor"] },
      { name: "Swiss Chard", lmv: "Mangold", traits: [] },
      { name: "Romaine Lettuce", lmv: "Romansallat", traits: [] },
      { name: "Rocket", lmv: "Ruccolasallat", traits: ["irritant"] },
      { name: "Celery", traits: ["fodmaps", "polyols", "cross_reactive", "cross_birch"] },
      { name: "Bok Choy", lmv: "Sellerikål pak choi", traits: [] },
      { name: "Daikon Radish", lmv: "Rättika", traits: ["irritant"] },
      { name: "Rhubarb", lmv: "Rabarber tillagad u. socker", traits: [] },
      { name: "Sweetcorn", lmv: "Majskorn frysvara", traits: ["fodmaps", "polyols", "fructans", "salicylate"] }
    ]
  },
  {
    id: "fruits",
    label: "Fruits",
    foods: [
      { name: "Apples", lmv: "Äpple m. skal", traits: ["fodmaps", "fructose", "polyols", "irritant", "peel_skin", "cross_reactive", "cross_birch", "salicylate"] },
      { name: "Oranges", lmv: "Apelsin", traits: ["cross_reactive", "cross_grass", "dao_competitor"] },
      { name: "Pears", lmv: "Päron", traits: ["fodmaps", "fructose", "polyols", "irritant", "peel_skin", "cross_reactive", "cross_birch", "salicylate"] },
      { name: "Mangos", lmv: "Mango", traits: ["fodmaps", "fructose"] },
      { name: "Lemon", lmv: "Citron", traits: ["dao_competitor"] },
      { name: "Lime", lmv: "Lime", traits: ["dao_competitor"] },
      { name: "Grapefruit", lmv: "Grapefrukt", traits: ["dao_competitor"] },
      { name: "Grapes", lmv: "Vindruvor", traits: ["salicylate"] },
      { name: "Banana", lmv: "Banan", traits: ["cross_reactive", "cross_latex", "dao_competitor"] },
      { name: "Kiwi", lmv: "Kiwi grön", traits: ["cross_reactive", "cross_birch", "cross_grass", "cross_latex", "salicylate"] },
      { name: "Pineapple", lmv: "Ananas", traits: ["cross_reactive", "cross_latex"] },
      { name: "Papaya", lmv: "Papaya", traits: ["cross_reactive", "cross_latex"] },
      { name: "Watermelon", lmv: "Vattenmelon", traits: ["fodmaps", "fructose", "cross_reactive", "cross_grass", "salicylate"] },
      { name: "Melon", lmv: "Nätmelon", traits: ["cross_reactive", "cross_grass"] },
      { name: "Apricot", lmv: "Aprikos", traits: ["cross_reactive", "cross_birch", "fodmaps", "polyols"] },
      { name: "Plum", lmv: "Plommon", traits: ["cross_reactive", "cross_birch", "fodmaps", "polyols"] },
      { name: "Figs", lmv: "Fikon", traits: ["fodmaps", "fructose"] },
      { name: "Pomegranate", lmv: "Granatäpple", traits: ["salicylate"] },
      { name: "Lychee", lmv: "Litchi", traits: ["fructose", "fodmaps", "polyols"] },
      { name: "Star Fruit", lmv: "Carambole stjärnfrukt", traits: [] },
      { name: "Durian", traits: ["over_10g_fat", "fodmaps", "fructose"] },
      { name: "Peach", lmv: "Persika", traits: ["fodmaps", "polyols", "cross_reactive", "cross_birch"] },
      { name: "Nectarine", lmv: "Nektarin", traits: ["fodmaps", "polyols", "cross_reactive", "cross_birch", "salicylate"] },
      { name: "Passion Fruit", lmv: "Passionsfrukt", traits: ["fiber"] },
      // Monash: low FODMAP up to 64g, moderate fructans above that — a whole
      // persimmon is ~170g, so a normal serving is over the line.
      { name: "Persimmon", lmv: "Sharon", traits: ["fodmaps", "fructans", "salicylate"] }
    ]
  },
  {
    id: "berries",
    label: "Berries",
    foods: [
      { name: "Blueberry", lmv: "Blåbär", traits: [] },
      { name: "Strawberry", lmv: "Jordgubbar", traits: ["salicylate"] },
      { name: "Cherries", lmv: "Sötkörsbär", traits: ["fodmaps", "polyols", "fructose", "cross_reactive", "cross_birch"] },
      { name: "Blackberries", lmv: "Björnbär", traits: ["fodmaps", "polyols"] },
      { name: "Raspberries", lmv: "Hallon", traits: [] },
      { name: "Cloudberries", lmv: "Hjortron", traits: ["fiber"] },
      { name: "Lingonberry", lmv: "Lingon", traits: [] },
      { name: "Redcurrant", lmv: "Vinbär röda", traits: [] },
      { name: "Blackcurrant", lmv: "Vinbär svarta", traits: [] },
      { name: "Gooseberry", lmv: "Krusbär", traits: [] },
      { name: "Elderberry", lmv: "Fläderbär", traits: ["fiber"] },
      { name: "Cranberry", lmv: "Tranbär", traits: [] }
    ]
  },
  {
    id: "driedFruits",
    label: "Dried Fruits/Berries",
    foods: [
      { name: "Dates", lmv: "Dadlar torkade", traits: ["fiber", "polyols", "fructans", "salicylate"] },
      { name: "Raisins", lmv: "Russin", traits: ["fiber", "fructans"] },
      { name: "Sultanas", lmv: "Russin", traits: ["fiber", "fructans"] },
      { name: "Dried Apricot", lmv: "Aprikos torkad", traits: ["cross_reactive", "cross_birch", "fodmaps", "polyols", "fructans"] },
      { name: "Dried Fig", lmv: "Fikon torkade", traits: ["fiber", "fodmaps", "polyols", "fructans"] },
      { name: "Prunes", lmv: "Katrinplommon torkade", traits: ["cross_reactive", "cross_birch", "fodmaps", "polyols"] },
      { name: "Dried Cranberry (Added Sugar)", lmv: "Tranbär torkade", traits: ["fodmaps", "fructans", "refined_carbs"] },
      { name: "Dried Cranberry (No Sugar Added)", lmv: "Tranbär torkade", traits: ["fodmaps", "fructans"] },
      { name: "Dried Cherry (Added Sugar)", traits: ["fodmaps", "polyols", "fructose", "cross_reactive", "cross_birch", "refined_carbs"] },
      { name: "Dried Cherry (No Sugar Added)", traits: ["fiber", "fodmaps", "polyols", "fructose", "cross_reactive", "cross_birch"] },
      { name: "Dried Mango (Added Sugar)", traits: ["fodmaps", "fructose", "refined_carbs"] },
      { name: "Dried Mango (No Sugar Added)", traits: ["fodmaps", "fructose"] },
      { name: "Dried Pineapple (Added Sugar)", traits: ["fiber", "fodmaps", "fructose", "refined_carbs"] },
      { name: "Dried Pineapple (No Sugar Added)", traits: ["fodmaps", "fructose", "fiber"] },
      { name: "Dried Papaya (Added Sugar)", traits: ["cross_reactive", "cross_latex", "refined_carbs"] },
      { name: "Dried Papaya (No Sugar Added)", traits: ["cross_reactive", "cross_latex"] },
      { name: "Dried Banana", lmv: "Banan torkad", traits: ["fiber", "cross_reactive", "cross_latex"] },
      { name: "Dried Apple", lmv: "Äpple torkat", traits: ["fiber", "fodmaps", "fructose", "polyols", "irritant", "peel_skin", "cross_reactive", "cross_birch"] },
      { name: "Dried Pear", lmv: "Päron torkade", traits: ["fodmaps", "fructose", "polyols", "irritant", "peel_skin", "cross_reactive", "cross_birch"] },
      { name: "Dried Blueberries (Added Sugar)", lmv: "Blåbär torkade", traits: ["fiber", "refined_carbs"] },
      { name: "Dried Blueberries (No Sugar Added)", lmv: "Blåbär torkade", traits: ["fiber"] },
      { name: "Dried Strawberries", traits: ["fiber"] },
      { name: "Dried Peach", lmv: "Persika torkad", traits: ["fiber", "fodmaps", "polyols", "cross_reactive", "cross_birch"] },
      { name: "Dried Coconut", lmv: "Kokosflingor", traits: ["fiber", "over_10g_fat", "bile_stimulant"] },
      { name: "Dried Goji Berry", lmv: "Gojibär torkade", traits: ["fiber", "fodmaps", "fructans"] },
      { name: "Dried Kiwi (Added Sugar)", traits: ["cross_reactive", "cross_birch", "cross_grass", "cross_latex", "refined_carbs"] },
      { name: "Dried Kiwi (No Sugar Added)", traits: ["fiber", "cross_reactive", "cross_birch", "cross_grass", "cross_latex"] },
      { name: "Currants (dried)", traits: ["fiber", "fodmaps", "fructans"] },
      { name: "Dried Lychee", traits: ["fructose", "fodmaps", "polyols"] }
    ]
  },
  {
    id: "nuts",
    label: "Nuts/Seeds",
    foods: [
      { name: "Almond", lmv: "Sötmandel", traits: ["fiber", "over_10g_fat", "bile_stimulant", "protein", "fodmaps", "galactans", "cross_reactive", "cross_birch", "allergen", "allergen_treenut", "salicylate"] },
      { name: "Brazil Nut", lmv: "Paranötter", traits: ["fiber", "over_10g_fat", "bile_stimulant", "fodmaps", "galactans", "allergen", "allergen_treenut"] },
      { name: "Cashew Nut", lmv: "Cashewnötter rostade u. salt", traits: ["over_10g_fat", "bile_stimulant", "fiber", "fodmaps", "galactans", "fructans", "allergen", "allergen_treenut"] },
      /* wholeSeed marks the seeds small and tough enough to be swallowed
         intact: the fiber is what acts on the gut while most of the fat stays
         locked inside the shell. Only flaxseed, chia and psyllium qualify.
         Pumpkin seeds are too large to swallow whole, and both they and sesame
         turn brittle when roasted, so both are tagged on their full content.
         Ground versions release everything and carry the fat tags. */
      { name: "Chiaseeds (whole)", wholeSeed: true, lmv: "Chiafrö", traits: ["fiber"] },
      { name: "Chiaseeds (ground)", lmv: "Chiafrö", traits: ["fiber", "over_10g_fat", "bile_stimulant"] },
      { name: "Flaxseed (whole)", wholeSeed: true, lmv: "Linfrö hela", traits: ["fiber", "fodmaps", "fructans"] },
      { name: "Psyllium Husk (whole)", wholeSeed: true, lmv: "Psylliumfröskal", traits: ["fiber"] },
      { name: "Psyllium Husk (ground)", lmv: "Psylliumfröskal", traits: ["fiber"] },
      { name: "Flaxseed (ground)", lmv: "Linfrö hela", traits: ["fiber", "over_10g_fat", "bile_stimulant", "fodmaps", "fructans"] },
      { name: "Hazelnut", lmv: "Hasselnötter", traits: ["fiber", "over_10g_fat", "bile_stimulant", "fodmaps", "fructans", "allergen", "allergen_treenut", "cross_reactive", "cross_birch"] },
      { name: "Peanut", lmv: "Jordnötter torkade", traits: ["fiber", "over_10g_fat", "bile_stimulant", "protein", "fodmaps", "galactans", "allergen", "allergen_peanut", "cross_reactive", "cross_grass"] },
      { name: "Pumpkin Seeds", lmv: "Pumpafrö", traits: ["fiber", "over_10g_fat", "bile_stimulant", "protein"] },
      { name: "Sunflower Seeds", lmv: "Solrosfrö", traits: ["fiber", "over_10g_fat", "bile_stimulant", "protein"] },
      { name: "Walnut", lmv: "Valnötter", traits: ["fiber", "over_10g_fat", "bile_stimulant", "allergen", "allergen_treenut"] },
      { name: "Sesame Seeds", lmv: "Sesamfrö m. skal", traits: ["fiber", "over_10g_fat", "bile_stimulant", "allergen", "allergen_sesame"] },
      { name: "Macadamia", lmv: "Macadamianötter", traits: ["fiber", "over_10g_fat", "bile_stimulant", "allergen", "allergen_treenut"] },
      { name: "Pecan", lmv: "Pekannötter", traits: ["fiber", "over_10g_fat", "bile_stimulant", "allergen", "allergen_treenut"] },
      // Chestnut is the odd one out here: ~2g fat, so no fat/bile tags. It is a
      // classic latex-fruit syndrome cross-reactor alongside banana/avocado/kiwi.
      { name: "Chestnut", lmv: "Kastanjer", traits: ["fiber", "cross_reactive", "cross_latex"] },
      // From the SIGHI review (cleared there — SIGHI gave no mechanism).
      // Sources vary a lot (fiber 10-33g, fat 18-25g per 100g) but every one
      // of them clears both thresholds. Protein is only ~5g, so no protein tag.
      { name: "Tiger Nut (roasted)", traits: ["fiber", "over_10g_fat", "bile_stimulant"] }
    ]
  },
  {
    id: "grains",
    label: "Grains/pseudo grains",
    foods: [
      // Oats, rye and barley are almost never eaten as bare grain, so the
      // products are what people actually recognise and react to. Wheat
      // already had its own spread of products further down this list.
      { name: "Oats", lmv: "Havregryn fullkorn", traits: ["fiber", "fodmaps", "fructans"] },
      { name: "Oat Porridge", lmv: "Havregrynsgröt fullkorn", traits: ["fodmaps", "fructans"] },
      { name: "Oat Crispbread", traits: ["fiber", "fodmaps", "fructans"] },
      { name: "Oat Bran", lmv: "Havrekli", traits: ["fiber", "fodmaps", "fructans"] },
      { name: "Muesli (no added sugar)", lmv: "Frukostflingor müsli fullkorn m. frukt", traits: ["fiber", "fodmaps", "fructans", "allergen", "allergen_wheat"] },
      { name: "Wheat", traits: ["fodmaps", "fructans", "allergen", "allergen_wheat"] },
      { name: "Rye", traits: ["fodmaps", "fructans"] },
      { name: "Rye Bread (whole grain)", lmv: "Bröd fullkorn råg fibrer ca 7%", traits: ["fiber", "fodmaps", "fructans"] },
      { name: "Pearl Barley (cooked)", lmv: "Korngryn kokt u. salt", traits: ["fodmaps", "fructans"] },
      { name: "Barley", traits: ["fodmaps", "fructans"] },
      { name: "Quinoa", lmv: "Mjölmålla quinoa röd kokt m. salt", traits: ["fiber"] },
      { name: "Buckwheat", traits: [] },
      { name: "Rice", lmv: "Ris råris kokt m. salt", traits: [] },
      { name: "Couscous", traits: ["refined_carbs", "allergen", "allergen_wheat", "fodmaps", "fructans"] },
      { name: "Bulgur", lmv: "Bulgur kokt", traits: ["allergen", "allergen_wheat", "fodmaps", "fructans"] },
      { name: "Freekeh", traits: ["allergen", "allergen_wheat", "fodmaps", "fructans"] },
      { name: "Pita Bread", lmv: "Bröd vitt vete vatten fibrer ca 3,5% typ pitabröd", traits: ["allergen", "allergen_wheat", "fodmaps", "fructans", "refined_carbs"] },
      { name: "Naan Bread", traits: ["allergen", "allergen_wheat", "fodmaps", "fructans", "refined_carbs", "over_10g_fat"] },
      { name: "Soba Noodles", traits: ["refined_carbs", "allergen", "allergen_wheat", "fodmaps", "fructans"] },
      { name: "Rice Noodles", lmv: "Nudlar risnudlar kokta", traits: ["refined_carbs"] },
      { name: "White Bread", lmv: "Bröd vitt fibrer 3,5%", traits: ["allergen", "allergen_wheat", "fodmaps", "fructans", "refined_carbs"] },
      { name: "Pasta (no egg)", lmv: "Pasta kokt u. salt", traits: ["refined_carbs", "allergen", "allergen_wheat", "fodmaps", "fructans"] },
      { name: "Teff", lmv: "Teffmjöl", lmvNote: "flour", traits: ["fiber"] },
      { name: "Sorghum/Durra", lmv: "Durra el. andra sorghumarter mjöl", lmvNote: "flour", traits: [] },
      { name: "Crispbread (rye)", lmv: "Hårt bröd fullkorn råg fibrer ca 13%", traits: ["fiber", "fodmaps", "fructans"] },
      { name: "Rice Cakes", traits: ["refined_carbs"] },
      { name: "Polenta", lmv: "Majsgryn polenta kokt m. salt", traits: [] },
      { name: "Millet", lmv: "Hirs kokt m. salt", traits: [] },
      { name: "Seitan", traits: ["protein", "allergen", "allergen_wheat"] },
      { name: "Tapioca", traits: [] },
      { name: "Cornstarch", lmv: "Majsstärkelse", traits: ["refined_carbs"] }
    ]
  },
  {
    id: "legumes",
    label: "Legumes",
    foods: [
      { name: "Black Bean", lmv: "Svarta bönor konserv. u. lag", traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Chickpea (whole/flour)", lmv: "Kikärtor torkade kokta m. salt", traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Common Peas", lmv: "Gröna ärtor kokta m. salt frysvara", traits: ["fodmaps", "fructans", "dao_competitor", "salicylate"] },
      { name: "Lentils", lmv: "Röda linser torkade kokta m. salt", lmvNote: "red lentils", traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Tempeh", lmv: "Tempeh", traits: ["over_10g_fat", "allergen", "allergen_soy", "histamine"] },
      { name: "Tofu (firm)", lmv: "Tofu fast", traits: ["allergen", "allergen_soy", "cross_reactive", "cross_birch", "dao_competitor"] },
      { name: "Tofu (silken)", traits: ["fodmaps", "galactans", "allergen", "allergen_soy", "cross_reactive", "cross_birch", "dao_competitor"] },
      { name: "Soybeans", lmv: "Sojabönor torkade kokta u. salt", traits: ["fodmaps", "galactans", "allergen", "allergen_soy", "cross_reactive", "cross_birch", "dao_competitor"] },
      { name: "Edamame", lmv: "Sojabönor torkade kokta u. salt", traits: ["allergen", "allergen_soy", "cross_reactive", "cross_birch"] },
      { name: "Falafel", lmv: "Falafel kikärtskroketter stekta", traits: ["over_10g_fat", "fiber", "fodmaps", "galactans"] },
      { name: "Fava Beans", lmv: "Bondbönor färska kokta u. salt", traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Kidney Beans", traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Pinto Beans", lmv: "Bruna bönor torkade kokta m. salt", traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Split Peas", lmv: "Gula ärtor kokta m. salt", traits: ["fiber", "fodmaps", "galactans"] }
    ]
  },
  {
    id: "landAnimals",
    label: "Land Animals",
    foods: [
      { name: "Cows Meat", lmv: "Nöt kött rå", traits: ["bile_stimulant", "protein", "alpha_gal"] },
      { name: "Pork (lean cut)", lmv: "Gris kött kokt m. salt", traits: ["bile_stimulant", "protein", "alpha_gal"] },
      { name: "Pork (fatty cut)", traits: ["over_10g_fat", "bile_stimulant", "protein", "alpha_gal"] },
      { name: "Elk Meat", lmv: "Älg högrev rå", traits: ["bile_stimulant", "protein", "alpha_gal", "histamine"] },
      { name: "Chicken", lmv: "Kyckling kokt m. salt", traits: ["bile_stimulant", "protein"] },
      { name: "Egg White", lmv: "Äggvita rå", traits: ["allergen", "allergen_egg"] },
      { name: "Egg Yolk", lmv: "Äggula rå", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_egg"] },
      { name: "Whole Egg", lmv: "Ägg rått", traits: ["allergen", "allergen_egg"] },
      { name: "Salami", lmv: "Påläggskorv salami rökt", traits: ["over_10g_fat", "bile_stimulant", "histamine", "alpha_gal", "dao_competitor"] },
      { name: "Dry-Cured Ham (lean)", lmv: "Gris skinka lufttorkad italiensk", traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine", "alpha_gal", "dao_competitor"] },
      { name: "Dry-Cured Ham (fatty cut)", traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine", "alpha_gal", "dao_competitor"] },
      { name: "Sausages (lean)", traits: ["protein", "histamine"] },
      { name: "Sausages (regular)", lmv: "Korv frukostkorv stekt", traits: ["over_10g_fat", "bile_stimulant", "histamine", "alpha_gal"] },
      { name: "Minced Meat (~10% fat)", lmv: "Nöt färs rå fett 10%", traits: ["protein", "histamine", "alpha_gal"] },
      { name: "Minced Meat (~15% fat)", traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine", "alpha_gal"] },
      { name: "Minced Meat (~20% fat)", traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine", "alpha_gal"] },
      { name: "Lamb", lmv: "Lamm kött rå", traits: ["alpha_gal"] },
      // Named for the skin, because that is where the fat is: skinless
      // breast is ~4g/100g and would not carry either tag.
      { name: "Duck (with skin)", lmv: "Anka rå m. skinn", traits: ["over_10g_fat", "bile_stimulant", "alpha_gal"] },
      { name: "Turkey", lmv: "Kalkon kokt", traits: ["bile_stimulant", "protein"] },
      { name: "Frozen Meatballs", lmv: "Köttbullar frysvara", traits: ["over_10g_fat", "histamine", "alpha_gal"] },
      { name: "Hot Dog Sausage", lmv: "Korv varmkorv kokt", traits: ["over_10g_fat", "bile_stimulant", "histamine", "alpha_gal"] },
      { name: "Chicken Nuggets", lmv: "Kyckling nugget friterad tillagad på restaurang", traits: ["over_10g_fat", "allergen", "allergen_wheat"] }
    ]
  },
  {
    id: "seafood",
    label: "Seafood",
    foods: [
      { name: "Salmon", lmv: "Lax stekt m. salt", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_fish", "histamine", "dao_competitor"] },
      { name: "Cod", lmv: "Torsk rå", traits: ["allergen", "allergen_fish", "histamine"] },
      { name: "Oysters", lmv: "Ostron", traits: ["allergen", "allergen_shellfish", "histamine"] },
      { name: "Lobsters", lmv: "Hummer kokt", traits: ["allergen", "allergen_shellfish", "histamine"] },
      { name: "Crayfish", lmv: "Kräfta kokt", traits: ["allergen", "allergen_shellfish", "histamine"] },
      { name: "Shrimp", lmv: "Räka kokt", traits: ["allergen", "allergen_shellfish", "histamine"] },
      { name: "Tuna", lmv: "Tonfisk stekt m. salt", traits: ["bile_stimulant", "protein", "allergen", "allergen_fish", "histamine", "dao_competitor"] },
      { name: "Anchovies", lmv: "Ansjovis skarpsill konserv. ", traits: ["over_10g_fat", "allergen", "allergen_fish", "histamine", "dao_competitor"] },
      { name: "Smoked Salmon", lmv: "Lax kallrökt", traits: ["allergen", "allergen_fish", "histamine", "dao_competitor"] },
      { name: "Crab", lmv: "Krabba Blå krabba kokt", traits: ["allergen", "allergen_shellfish", "histamine"] },
      { name: "Mussels", lmv: "Mussla konserv. m. lag", traits: ["allergen", "allergen_shellfish", "histamine"] },
      { name: "Fish Balls", lmv: "Fiskbullar konserv. u. buljong", traits: ["allergen", "allergen_fish", "histamine"] },
      { name: "Fish Fingers", lmv: "Fiskpinnar stekta", traits: ["over_10g_fat", "allergen", "allergen_fish", "allergen_wheat", "histamine"] },
      { name: "Nori", traits: ["fiber"] }
    ]
  },
  {
    id: "dairy",
    label: "Dairy",
    foods: [
      { name: "Cows Milk", lmv: "Mjölk fett 3% berikad", traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Goats Milk", traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Sheeps Milk", traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Cream Cheese (<10% fat)", lmv: "Färskost cream cheese extra light fett 5%", traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Cream Cheese (>10% fat)", lmv: "Färskost fett 33%", traits: ["over_10g_fat", "bile_stimulant", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Hard Cheese (~15% fat)", lmv: "Ost hårdost fett 17%", lmvNote: "closest entry is 17 % fat", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine", "dao_competitor"] },
      { name: "Hard Cheese (~28-35% fat)", lmv: "Ost hårdost fett 31%", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine", "dao_competitor"] },
      { name: "White Cheese (~0% fat)", lmv: "Kvarg naturell fett 0,2%", traits: ["allergen", "allergen_milk", "over_3g_lactose"] },
      { name: "Yogurt", lmv: "Yoghurt naturell fett 3% berikad", traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Yoghurt 0,5%", lmv: "Yoghurt naturell lätt fett 0,5% berikad", traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Yoghurt 3%", lmv: "Yoghurt naturell fett 3% berikad", traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Greek Yogurt (10% fat)", lmv: "Yoghurt naturell fett 10%", lmvNote: "entry measures 8.3 g fat, below the 10 g threshold", traits: ["over_10g_fat", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Butter", lmv: "Smör fett 80%", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_milk"] },
      { name: "Cream", lmv: "Vispgrädde fett 40%", traits: ["over_10g_fat", "bile_stimulant", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Quark (~1%)", lmv: "Kvarg färskost fett 1%", traits: ["allergen", "allergen_milk", "over_3g_lactose"] },
      { name: "Quark (~10%)", lmv: "Kvarg färskost fett 10%", lmvNote: "exactly 10 g fat — kept at the threshold", traits: ["over_10g_fat", "allergen", "allergen_milk", "over_3g_lactose"] },
      { name: "Cottage Cheese", lmv: "Färskost cottage cheese naturell fett 4%", traits: ["allergen", "allergen_milk", "over_3g_lactose"] },
      { name: "Sour Cream (~10% fat)", lmv: "Gräddfil fett 12%", traits: ["over_10g_fat", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Sour Cream (~20% fat)", lmv: "Crème fraiche fett 34%", traits: ["over_10g_fat", "bile_stimulant", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Ricotta Cheese", lmv: "Färskost ricotta fett ca 10%", traits: ["over_10g_fat", "allergen", "allergen_milk", "over_3g_lactose"] },
      { name: "Mascarpone", lmv: "Färskost fett 33%", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_milk", "over_3g_lactose"] },
      { name: "Parmesan", lmv: "Ost hårdost parmesan fett 30% typ Parmiggiano Reggiano", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine", "dao_competitor"] },
      { name: "Halloumi", lmv: "Ost halloumi rå fett 22%", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk"] },
      { name: "Mozzarella", lmv: "Ost mozzarella fett 18%", traits: ["over_10g_fat", "allergen", "allergen_milk"] },
      { name: "Blue Cheese", lmv: "Ädelost grönmögelost fett 17%", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine", "dao_competitor"] },
      // Added from the SIGHI review — named there as histamine sources.
      // Fat/protein checked against nutrition data: Roquefort 30.6/21.5,
      // Fontina 31.1/25.6, Raclette ~29/23 per 100g. All clear both thresholds.
      { name: "Roquefort", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine", "dao_competitor"] },
      { name: "Fontina", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine", "dao_competitor"] },
      { name: "Raclette", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine", "dao_competitor"] },
      { name: "Camembert", lmv: "Vitmögelost camembert fett ca 22%", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_milk", "histamine", "dao_competitor"] },
      { name: "Cheddar", lmv: "Ost hårdost fett 31%", lmvNote: "generic hard cheese entry", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine", "dao_competitor"] },
      { name: "Aged Gouda", lmv: "Ost hårdost fett 31%", lmvNote: "generic hard cheese entry", traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine", "dao_competitor"] },
      { name: "Whey Protein", traits: ["protein", "allergen", "allergen_milk", "over_3g_lactose"] },
      // 21.3g fat/100g, so it clears the 17.5g bile threshold like the other
      // full-fat cheeses. Protein is only ~14g, so no protein tag.
      { name: "Feta Cheese", lmv: "Salladsost fett 22%", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_milk", "histamine"] },
      { name: "Labneh", traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Paneer", lmv: "Paneer", traits: ["over_10g_fat", "allergen", "allergen_milk", "over_3g_lactose"] },
      { name: "Skyr", traits: ["over_3g_lactose", "allergen", "allergen_milk"] },
      { name: "Buttermilk", lmv: "Filmjölk fett 3% berikad", traits: ["over_3g_lactose", "allergen", "allergen_milk"] },
      { name: "Kefir", lmv: "Kefir fett 3% berikad", traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      // Lactase-treated dairy: lactose <0.1g/100g and Monash-tested low FODMAP,
      // but the milk protein and (for yogurt) the fermentation are unchanged.
      // That split is the point — it separates lactose from casein/histamine.
      { name: "Lactose-free Milk", traits: ["allergen", "allergen_milk"] },
      { name: "Lactose-free Yogurt", lmv: "Yoghurt naturell lätt laktosfri fett ca 0,4% berikad", traits: ["allergen", "allergen_milk"] },
    ]
  },
  {
    id: "spices",
    label: "Spices",
    // A portion is a few grams, so the per-100g fat/protein/fiber thresholds
    // never apply here — see the serving-size rule in about.html.
    smallServing: true,
    foods: [
      { name: "Chili", traits: ["irritant", "capsaicin"] },
      { name: "Garlic", lmv: "Vitlök", traits: ["fodmaps", "fructans", "irritant", "allyl_compounds"] },
      { name: "Ginger", lmv: "Ingefära färsk", traits: [] },
      { name: "Dill", lmv: "Dill färsk", traits: [] },
      { name: "Turmeric", lmv: "Gurkmeja torkad", traits: ["bile_stimulant"] },
      { name: "Mustard", lmv: "Senap svensk", traits: ["irritant", "allyl_compounds"] },
      { name: "Black Pepper", traits: ["irritant"] },
      { name: "Za'atar", traits: ["irritant"] },
      { name: "Sumac", traits: ["irritant", "aceticAcid"] },
      { name: "Cumin", lmv: "Spiskummin frö torkad", traits: ["salicylate"] },
      { name: "Shawarma Spice Mix", traits: ["irritant"] },
      { name: "Wasabi", smallServing: true, lmv: "Wasabirot", traits: ["irritant", "allyl_compounds"] },
      { name: "Curry Powder", traits: ["irritant", "capsaicin"] },
      { name: "Sichuan Peppercorn", traits: ["irritant"] },
      { name: "Nutmeg", lmv: "Muskotnöt malen", traits: [] },
      // Herbs sit under the 10g typical-serving gate, so no macro tags apply
      // however fiber-dense they look per 100g. All rated 0 by SIGHI and
      // unrestricted by Monash.
      { name: "Basil", lmv: "Basilika färsk", traits: [] },
      { name: "Oregano", traits: [] },
      { name: "Thyme", traits: [] },
      { name: "Rosemary", traits: [] },
      { name: "Mint", traits: ["irritant"] },
      { name: "Cinnamon", lmv: "Kanel", traits: [] }
    ]
  },
  {
    id: "beverages",
    label: "Beverages",
    foods: [
      { name: "Red Wine", lmv: "Vin rött vol. % 14", traits: ["alcohol", "histamine", "irritant"] },
      { name: "White Wine", traits: ["alcohol", "histamine", "irritant"] },
      // From the SIGHI review. Styrian rosé, 11-12% ABV under Schilcherland DAC.
      { name: "Schilcherwein", traits: ["alcohol", "histamine", "irritant"] },
      { name: "Champagne", traits: ["alcohol", "histamine", "irritant", "carbonation"] },
      { name: "Beer", lmv: "Öl starköl el. exportöl vol. % 5,4", traits: ["alcohol", "histamine", "irritant", "carbonation"] },
      { name: "Cider", traits: ["alcohol", "irritant", "carbonation", "histamine"] },
      { name: "Spirits (Liquor)", lmv: "Whisky vol. % 40", traits: ["alcohol", "irritant", "histamine"] },
      { name: "Coffee", lmv: "Kaffe bryggt", traits: ["caffeine", "irritant"] },
      { name: "Espresso", lmv: "Kaffe espresso bryggt drickf.", traits: ["caffeine", "irritant"] },
      { name: "Black Tea", traits: ["caffeine", "irritant"] },
      { name: "Green Tea", traits: ["caffeine"] },
      { name: "Mate Tea", traits: ["caffeine"] },
      { name: "Energy Drinks", lmv: "Energidryck m. socker berikad", traits: ["caffeine", "irritant", "carbonation"] },
      { name: "Soy Milk", lmv: "Sojadryck", traits: ["allergen", "allergen_soy", "fodmaps", "galactans", "dao_competitor"] },
      { name: "Oat Drink", lmv: "Havredryck fett 1,5% berikad", traits: [] },
      { name: "Coconut Milk", lmv: "Kokosmjölk fett ca 6%", traits: ["fodmaps", "polyols"] },
      { name: "Matcha", traits: ["caffeine"] },
      { name: "Chai Tea", traits: ["caffeine"] },
      // Added for the salicylate work; carries no histamine per the review.
      // Caffeine-free. Cross-reacts with mugwort/ragweed pollen (Asteraceae) —
      // tagged with the general cross-reaction trait, since we track only the
      // birch, grass and latex groups as subtypes.
      { name: "Chamomile Tea", traits: ["salicylate", "cross_reactive"] },
      { name: "Kombucha", traits: ["histamine", "carbonation"] },
      { name: "Almond Milk", lmv: "Mandeldryck berikad", traits: ["allergen", "allergen_treenut"] },
      { name: "Rice Milk", traits: [] }
    ]
  },
  {
    id: "ultraProcessed",
    label: "Processed Foods",
    foods: [
      { name: "Frozen pizza", lmv: "Pizza orientalisk", traits: ["refined_carbs"] },
      { name: "French Fries (deep-fried)", lmv: "Pommes frites friterad potatis fett ca 11% frysvara", traits: ["over_10g_fat", "refined_carbs"] },
      { name: "French Fries (oven-baked)", lmv: "Pommes frites friterad potatis värmd i ugn fett ca 7% frysvara", traits: ["refined_carbs"] },
      { name: "Instant Ramen", traits: ["allergen", "allergen_wheat", "fodmaps", "fructans"] },
      { name: "Margarine", lmv: "Flytande margarin fett 70%", traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Instant Soup / Bouillon Cubes", lmv: "Köttbuljong tärning ätf.", traits: ["fodmaps", "fructans"] },
      { name: "Flavored Yogurt", lmv: "Fruktyoghurt fett 2%", traits: ["over_3g_lactose", "fodmaps", "refined_carbs", "allergen", "allergen_milk"] },
      { name: "Pretzels", lmv: "Salta pinnar", traits: ["fiber", "allergen", "allergen_wheat", "refined_carbs"] },
      { name: "Instant Mashed Potato", lmv: "Potatismos hemlagad", traits: ["refined_carbs"] },
      { name: "Dumplings", traits: ["allergen", "allergen_wheat", "over_10g_fat"] },
      { name: "Fresh Pasta (w/ egg)", lmv: "Pasta färsk m. ägg kokt u. salt", traits: ["refined_carbs", "allergen", "allergen_wheat", "allergen_egg", "fodmaps", "fructans"] }
    ]
  },
  {
    id: "condiments",
    label: "Condiments",
    foods: [
      { name: "Soy Sauce", lmv: "Sojasås", traits: ["histamine", "allergen", "allergen_soy", "allergen_wheat", "dao_competitor"] },
      { name: "Vinegar", traits: ["aceticAcid", "irritant"] },
      { name: "Balsamic Vinegar", lmv: "Vinäger ättiksyra 7%", traits: ["aceticAcid", "irritant", "histamine"] },
      { name: "Aioli", lmv: "Aioli", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_egg", "irritant", "allyl_compounds"] },
      { name: "Pesto", lmv: "Pesto hemlagad", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_treenut", "allergen_milk", "fodmaps", "fructans"] },
      { name: "Tzatziki", lmv: "Tzatziki", traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Hummus", lmv: "Hummus kikärtsröra", traits: ["over_10g_fat", "bile_stimulant", "fiber", "fodmaps", "galactans"] },
      { name: "Guacamole", lmv: "Guacamole", traits: ["over_10g_fat", "cross_reactive", "cross_latex"] },
      { name: "Mango Chutney", lmv: "Mango chutney", traits: ["refined_carbs"] },
      { name: "Cranberry Sauce", traits: ["refined_carbs", "fructose"] },
      { name: "Fish Roe Spread", lmv: "Påläggskaviar original", traits: ["over_10g_fat", "bile_stimulant", "histamine", "allergen", "allergen_fish"] },
      { name: "Yeast Extract", smallServing: true, traits: [] },
      { name: "Ajvar", lmv: "Ajvar relish", traits: ["irritant"] },
      { name: "Harissa", traits: ["irritant", "capsaicin"] },
      { name: "Tahini", lmv: "Tahini", traits: ["over_10g_fat", "bile_stimulant", "protein", "fiber", "allergen", "allergen_sesame"] },
      { name: "Baba Ganoush", traits: ["histamine"] },
      { name: "Preserved Lemon", traits: ["histamine", "aceticAcid"] },
      { name: "Sesame Oil", lmv: "Sesamolja", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_sesame"] },
      { name: "Olive Oil", lmv: "Olivolja", traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Sunflower Oil", lmv: "Solrosolja", traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Rapeseed Oil", lmv: "Rapsolja", traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Coconut Oil", lmv: "Kokosolja", traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Ghee", lmv: "Klarnat smör ghee", traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Tamarind", traits: ["aceticAcid"] },
      // Honey is high FODMAP at a normal tablespoon — excess fructose is the
      // main driver, with fructans secondary. Not a "safe" pantry staple.
      { name: "Honey", lmv: "Honung", traits: ["fodmaps", "fructose", "fructans"] },
      { name: "White Sugar", lmv: "Socker", traits: ["refined_carbs"] },
      { name: "Maple Syrup", traits: ["refined_carbs"] },
      { name: "Salt", lmv: "Salt m. jod", traits: [] }
    ]
  },
  {
    id: "sauces",
    label: "Sauces",
    foods: [
      { name: "Ketchup", lmv: "Ketchup", traits: ["aceticAcid", "irritant", "dao_competitor"] },
      { name: "Mayonnaise", lmv: "Majonnäs fett 80%", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_egg"] },
      { name: "Barbecue Sauce", traits: ["aceticAcid", "irritant", "refined_carbs"] },
      { name: "Hot Sauce", traits: ["histamine", "irritant", "capsaicin"] },
      { name: "Worcestershire Sauce", traits: ["histamine", "allergen", "allergen_fish"] },
      { name: "Horseradish Sauce", traits: ["irritant", "over_10g_fat"] },
      { name: "Tartar Sauce", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_egg"] },
      { name: "Salsa", lmv: "Tomatsalsa kall", traits: ["irritant"] },
      { name: "Ranch Dressing", lmv: "Dressing konserv. fett ca 25%", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_milk", "allergen_egg"] },
      { name: "Thousand Island Dressing", lmv: "Dressing konserv. fett ca 25%", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_egg"] },
      { name: "Teriyaki Sauce", traits: ["histamine", "allergen", "allergen_soy", "allergen_wheat", "refined_carbs"] },
      { name: "Fish Sauce", lmv: "Fisksås", traits: ["histamine", "allergen", "allergen_fish"] },
      { name: "Oyster Sauce", traits: ["histamine", "allergen", "allergen_shellfish"] },
      { name: "Hoisin Sauce", traits: ["histamine", "allergen", "allergen_soy", "allergen_wheat", "refined_carbs"] },
      { name: "Brown Gravy", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_wheat"] },
      { name: "Béarnaise Sauce", lmv: "Bearnaisesås hemlagad", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_egg", "allergen_milk"] },
      { name: "Hollandaise Sauce", lmv: "Hollandaisesås hemlagad", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_egg", "allergen_milk"] },
      { name: "Remoulade", lmv: "Remouladsås", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_egg", "irritant"] }
    ]
  },
  {
    id: "mushrooms",
    label: "Mushrooms",
    foods: [
      { name: "Shiitake Mushrooms", lmv: "Shiitakesvamp", traits: ["fodmaps", "polyols", "dao_competitor"] },
      { name: "Oyster Mushrooms", lmv: "Ostronskivling", traits: ["dao_competitor"] },
      { name: "White Button Mushrooms", lmv: "Champinjon", traits: ["fodmaps", "polyols", "dao_competitor"] },
      { name: "Portobello Mushrooms", lmv: "Champinjon", traits: ["fodmaps", "polyols", "dao_competitor"] },
      { name: "Cremini Mushrooms", lmv: "Champinjon", traits: ["fodmaps", "polyols", "dao_competitor"] },
      { name: "Enoki Mushrooms", traits: ["fodmaps", "polyols", "dao_competitor"] },
      { name: "Chanterelle Mushrooms", lmv: "Kantarell gul rå", traits: ["fodmaps", "polyols", "dao_competitor"] },
      { name: "Porcini Mushrooms", traits: ["fodmaps", "polyols", "dao_competitor"] },
      { name: "Morel Mushrooms", traits: ["fodmaps", "polyols", "dao_competitor"] },
      { name: "King Oyster Mushrooms", lmv: "Ostronskivling", traits: ["dao_competitor"] }
    ]
  },
  {
    id: "snacksSweets",
    label: "Snacks & Sweets",
    foods: [
      { name: "Potato chips", lmv: "Chips potatis naturell", traits: ["over_10g_fat", "bile_stimulant"] },
      // No generic entry exists. The database has 13 chocolate-coated bars
      // described by their filling; this is the nougat/caramel/peanut one.
      { name: "Candy bars", lmv: "Mjuk nougat m. kolasås jordnötter mjölkchokladöverdrag", lmvNote: "one representative bar, not a generic entry", traits: ["over_10g_fat", "bile_stimulant", "refined_carbs", "over_3g_lactose", "allergen", "allergen_milk"] },
      { name: "Milk chocolate", lmv: "Mjölkchoklad", traits: ["over_10g_fat", "bile_stimulant", "refined_carbs", "over_3g_lactose", "fodmaps", "caffeine", "allergen", "allergen_milk"] },
      // Livsmedelsverket lists 0g fiber, which is a gap in the source rather
      // than a real zero — 70% chocolate is around 11g. Tag kept.
      { name: "Dark Chocolate", lmv: "Mörk choklad kakao ≥ 70%", traits: ["over_10g_fat", "bile_stimulant", "refined_carbs", "fiber", "caffeine"] },
      { name: "Cheese Puffs / Snacks", lmv: "Ostbågar", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_milk"] },
      { name: "Granola Bar", lmv: "Bar müslibar m. choklad berikad", traits: ["refined_carbs", "allergen", "allergen_treenut"] },
      { name: "Protein Bar", traits: ["protein", "refined_carbs", "allergen", "allergen_milk"] },
      { name: "Microwave Popcorn", lmv: "Popcorn mikropopcorn poppade fett ca 22%", traits: ["over_10g_fat", "fiber"] },
      { name: "Sugary Breakfast Cereal", traits: ["refined_carbs", "allergen", "allergen_wheat"] },
      { name: "Sugary soft drinks", lmv: "Läsk", traits: ["refined_carbs", "carbonation", "irritant"] },
      { name: "Cola", lmv: "Läsk cola", traits: ["caffeine", "refined_carbs", "carbonation", "irritant"] },
      { name: "Ice Cream", lmv: "Glass fett ca 10%", traits: ["refined_carbs", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Halva", traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_sesame", "refined_carbs"] },
      { name: "Baklava", lmv: "Baklava ", traits: ["over_10g_fat", "bile_stimulant", "refined_carbs", "allergen", "allergen_treenut", "allergen_wheat"] }
    ]
  },
  {
    id: "picklesFerments",
    label: "Pickles & Ferments",
    foods: [
      { name: "Kimchi", traits: ["histamine", "fodmaps", "fructans", "irritant"] },
      { name: "Sauerkraut", lmv: "Surkål konserv. m. lag", traits: ["histamine", "dao_competitor"] },
      { name: "Pickled Cucumber", lmv: "Gurka inlagd", traits: ["histamine", "aceticAcid", "irritant"] },
      { name: "Pickle Relish", traits: ["histamine", "aceticAcid", "irritant"] },
      { name: "Olives", lmv: "Oliver gröna m. paprikafyllning avrunna", traits: ["over_10g_fat", "histamine"] },
      { name: "Miso Paste", lmv: "Miso sojabönspasta fermenterad", traits: ["over_10g_fat", "fiber", "histamine", "allergen", "allergen_soy", "fodmaps", "dao_competitor"] }
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
    categories: ["roots", "veggies", "fruits", "berries", "driedFruits", "mushrooms"]
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
