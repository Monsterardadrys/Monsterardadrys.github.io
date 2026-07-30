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

/* Portion bands.

   A threshold per 100g only means something once you know how much of the food
   goes on a plate: 17.5g of fat per 100g is 4g in a slice of cheese and 22g in
   a portion of mince. So every food carries `portion` — a typical serving in
   grams — and the band follows from it.

   The boundaries sit in the gaps of the actual distribution rather than on
   round numbers. Portion estimates cluster hard on household measures (2, 5,
   15, 20, 25, 30, 40, 50, 60, 80, 100, 125, 150, 175, 200g), so a boundary
   placed on one of those splits foods that are the same size. 6, 45 and 110
   are the three widest gaps: nothing sits within 9% of any of them.

   Band 1 — a portion of 6g or less — is exempt from the per-100g fat, protein
   and fiber thresholds. Cinnamon is 53g of fiber per 100g and nobody eats 100g
   of cinnamon. */
const PORTION_BANDS = [
  { band: 1, label: "Up to 6g",   max: 6,    example: "spices, salt, a knob of horseradish" },
  { band: 2, label: "6\u201345g",     max: 45,   example: "butter, oil, a slice of cheese, a handful of nuts" },
  { band: 3, label: "45\u2013110g",   max: 110,  example: "bread, an egg, a bowl of berries, a sausage" },
  { band: 4, label: "Over 110g",  max: null, example: "meat, fish, cooked grains, a glass of milk" }
];

function portionBand(grams) {
  for (let i = 0; i < PORTION_BANDS.length; i++) {
    const max = PORTION_BANDS[i].max;
    if (max == null || grams <= max) return PORTION_BANDS[i].band;
  }
  return PORTION_BANDS.length;
}

const TRAITS = {

  /* ---- FODMAPs: broad trait + 4 specific subtypes (additive) ---- */
  fodmaps: {
    order: 6,
    label: "FODMAPs",
    filter: true,
    articleId: "fodmaps",
    evidence: {
      level: "Well established",
      detail: "Multiple randomised trials in IBS, backed by breath testing and MRI work that shows the fermentation and water-drawing effects directly."
    },
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
    evidence: {
      level: "Well established",
      detail: "Breath testing and randomised low-FODMAP trials. How much is tolerated varies between people and depends on the glucose eaten alongside it."
    },
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
    evidence: {
      level: "Well established",
      detail: "Randomised low-FODMAP trials, plus a plainly measurable osmotic effect — sorbitol and mannitol are used as laxatives at higher doses."
    },
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
    evidence: {
      level: "Well established",
      detail: "The most-tested subtype. Blinded re-challenge trials point to fructans rather than gluten behind most symptoms blamed on wheat in people without celiac disease."
    },
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
    evidence: {
      level: "Well established",
      detail: "Humans lack the enzyme entirely, so the fermentation is certain. The symptom trials are smaller than for the other subtypes."
    },
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
    evidence: {
      level: "Well established",
      detail: "Fat measurably slows gastric emptying and lowers the pressure of the lower esophageal sphincter. Symptom provocation is best documented in reflux and functional dyspepsia."
    },
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
    evidence: {
      level: "Limited",
      detail: "The CCK response to fat and protein is well measured, but the step from there to symptoms is inferred rather than trialled. The 17.5 g fat / 20 g protein cut-off is ours, not a published one."
    },
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
    evidence: {
      level: "Well established",
      detail: "A large trial base that cuts both ways: fiber relieves constipation and provokes bloating, and which one happens depends on the type and the person."
    },
    analysis: [
      "These foods are high in fiber, which can cause gas and bloating at high intake, especially with dehydration or gut-microbial dysbiosis.",
      "See the Fiber article for benefits, sources, and the risks of a low-fiber diet."
    ]
  },
  protein: {
    order: 2,
    label: "Protein",
    articleId: "protein",
    evidence: {
      level: "Limited",
      detail: "Tracked as context rather than as a trigger. Protein itself rarely causes gut symptoms — what travels with it usually does."
    },
    analysis: [
      "These foods are protein-rich. Protein moderately stimulates bile release and can add to digestive workload in large amounts. Symptoms are more often linked to what accompanies the protein (lactose, allergens, histamine) than protein itself, though pancreatitis, pancreatic tumors, and true food allergy can cause direct reactions."
    ]
  },
  refined_carbs: {
    order: 6,
    label: "Refined carbs",
    filter: true,
    articleId: "refined_carbs",
    evidence: {
      level: "Limited",
      detail: "A categorical tag by food type, not a measured threshold. The evidence links ultra-processed diets to gut symptoms at the level of the whole diet, not any single food."
    },
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
    evidence: {
      level: "Well established",
      detail: "Hydrogen breath testing, genetic testing for lactase persistence and blinded dose-response trials. One of the best-characterised food intolerances there is."
    },
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
    evidence: {
      level: "Well established",
      detail: "The mucosal effect and the sphincter relaxation are both measured. How much it takes to produce symptoms is less settled than the mechanism."
    },
    analysis: [
      "These foods or drinks contain alcohol, which can directly irritate the gut lining, relax the lower esophageal sphincter (worsening reflux), and affect liver and pancreatic function with regular high intake."
    ]
  },
  caffeine: {
    group: "GI Irritants",
    order: 7,
    label: "Caffeine",
    filter: true,
    evidence: {
      level: "Well established",
      detail: "Measured effects on colonic motility and acid secretion. Whether that becomes a symptom varies widely between people."
    },
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
    evidence: {
      level: "Limited",
      detail: "An umbrella over mechanisms that range from well measured to clinical experience alone. The specific traits underneath carry their own levels."
    },
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
    evidence: {
      level: "Well established",
      detail: "TRPV1 activation is well characterised, and capsaicin provocation reproduces pain in IBS. Regular exposure desensitises, which is why tolerance differs so much."
    },
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
    evidence: {
      level: "Preliminary",
      detail: "Plausible from the fiber and the compounds involved, but barely studied directly. Easy to test on your own — remove the peel and see."
    },
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
    evidence: {
      level: "Preliminary",
      detail: "The mechanism is shown in cell and animal work. In real food these compounds travel with fructans, so what someone reacts to is hard to separate."
    },
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
    evidence: {
      level: "Limited",
      detail: "The gastric distension from CO2 is measurable and small trials show more belching and reflux. Effects further down the gut are less clear."
    },
    analysis: [
      "Carbon dioxide in carbonated drinks causes gastric distension and can worsen bloating, belching and reflux symptoms, independent of the drink's sugar or caffeine content."
    ]
  },
  aceticAcid: {
    group: "GI Irritants",
    order: 5,
    label: "Acetic acid",
    filter: true,
    evidence: {
      level: "Preliminary",
      detail: "Largely clinical experience. There are no trials of vinegar in gut symptoms, and the acid in a normal portion is small next to stomach acid."
    },
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
    evidence: {
      level: "Well established",
      detail: "IgE testing and double-blind placebo-controlled food challenge — the strongest evidence base in this tool. The tag marks known allergens; it says nothing about whether a given person is allergic."
    },
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
    evidence: {
      level: "Well established",
      detail: "Casein and whey are well-characterised allergens with standardised diagnostic testing."
    },
    analysis: [
      "Cow's milk allergy is mediated mainly by casein and whey proteins — distinct from lactose intolerance, which is a digestive enzyme issue, not an immune one."
    ]
  },
  allergen_egg: {
    group: "Allergens",
    order: 2,
    label: "Egg",
    filter: true,
    evidence: {
      level: "Well established",
      detail: "Ovalbumin and ovomucoid are well characterised, and ovomucoid testing predicts whether baked egg is tolerated."
    },
    analysis: [
      "Egg allergy is mediated mainly by proteins in the egg white (ovalbumin, ovomucoid). The yolk is less allergenic but not necessarily safe for someone with an egg allergy."
    ]
  },
  allergen_wheat: {
    group: "Allergens",
    order: 3,
    label: "Wheat",
    filter: true,
    evidence: {
      level: "Well established",
      detail: "Well-characterised allergen proteins with standardised testing, distinct from celiac disease and from gluten sensitivity."
    },
    analysis: [
      "Wheat allergy is an immune reaction to wheat proteins — distinct from celiac disease and from non-celiac gluten sensitivity, which are not classic IgE-mediated allergies."
    ]
  },
  allergen_fish: {
    group: "Allergens",
    order: 4,
    label: "Fish",
    filter: true,
    evidence: {
      level: "Well established",
      detail: "Parvalbumin is well characterised, and component testing separates fish from shellfish allergy."
    },
    analysis: [
      "Fish allergy is mediated mainly by parvalbumin, a muscle protein — a different allergen than shellfish tropomyosin, so an allergy to one doesn't necessarily mean an allergy to the other."
    ]
  },
  allergen_shellfish: {
    group: "Allergens",
    order: 5,
    label: "Shellfish",
    filter: true,
    evidence: {
      level: "Well established",
      detail: "Tropomyosin is well characterised and testable."
    },
    analysis: [
      "Shellfish allergy is mediated mainly by tropomyosin, found in crustaceans and molluscs."
    ]
  },
  allergen_peanut: {
    group: "Allergens",
    order: 6,
    label: "Peanut",
    filter: true,
    evidence: {
      level: "Well established",
      detail: "Among the most studied of all allergens, with component testing (Ara h 2) and an established immunotherapy."
    },
    analysis: [
      "Peanut allergy is one of the most common severe food allergies. Peanut is a legume, not a tree nut, and peanut allergy doesn't reliably predict tree nut allergy."
    ]
  },
  allergen_treenut: {
    group: "Allergens",
    order: 7,
    label: "Tree nut",
    filter: true,
    evidence: {
      level: "Well established",
      detail: "Well-characterised proteins, with component testing that separates the individual nuts."
    },
    analysis: [
      "Tree nut allergy (almond, cashew, walnut, hazelnut, Brazil nut, etc.) is botanically and clinically distinct from peanut allergy."
    ]
  },
  allergen_soy: {
    group: "Allergens",
    order: 8,
    label: "Soy",
    filter: true,
    evidence: {
      level: "Well established",
      detail: "Well characterised, though soy allergy is diagnosed less consistently than the other Big 9 allergens."
    },
    analysis: [
      "Soy allergy is mediated by several soy proteins and can occasionally cross-react with peanut, since both are legumes."
    ]
  },
  allergen_sesame: {
    group: "Allergens",
    order: 9,
    label: "Sesame",
    filter: true,
    evidence: {
      level: "Well established",
      detail: "A recognised major allergen with standardised testing. The labelling requirement is newer than the evidence behind it."
    },
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
    evidence: {
      level: "Well established",
      detail: "Oral allergy syndrome is well documented and the shared protein families are identified and testable. Which foods trigger it varies by person and by pollen season."
    },
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
    evidence: {
      level: "Well established",
      detail: "IgE to alpha-gal is measurable, the tick-bite route is established, and the delayed reaction has been reproduced under challenge."
    },
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
    evidence: {
      level: "Well established",
      detail: "PR-10 cross-reactivity is well documented, and component testing (Bet v 1) is routine."
    },
    analysis: [
      "Relevant for people with a birch pollen allergy, due to a shared protein family (PR-10) between birch pollen and these foods — classically apples, stone fruits, carrots, celery/celeriac, hazelnuts and soy."
    ]
  },
  cross_grass: {
    group: "Cross-reactivity",
    order: 2,
    label: "Grass pollen",
    filter: true,
    evidence: {
      level: "Limited",
      detail: "Documented, but less consistent than the birch pattern — the proteins involved are more varied and the food list less settled."
    },
    analysis: [
      "Relevant for people with a grass pollen allergy. Cross-reactive proteins are found in foods like melon, watermelon, tomato, orange, peanut and potato."
    ]
  },
  cross_latex: {
    group: "Cross-reactivity",
    order: 3,
    label: "Latex",
    filter: true,
    evidence: {
      level: "Well established",
      detail: "Latex-fruit syndrome is well documented, with the chitinase proteins identified and testable."
    },
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
      { name: "Beet Root", lmv: "Rödbeta", portion: 80, traits: ["fodmaps", "fructans", "salicylate"] },
      { name: "Carrot", lmv: "Morot", portion: 80, traits: ["cross_reactive", "cross_birch"] },
      { name: "Celeriac Root", lmv: "Rotselleri", portion: 100, traits: ["cross_reactive", "cross_birch"] },
      { name: "Jerusalem Artichoke", lmv: "Jordärtskocka", portion: 80, traits: ["fodmaps", "fructans"] },
      { name: "Parsnip", lmv: "Palsternacka", portion: 100, traits: [] },
      { name: "Potato", lmv: "Potatis rå", portion: 175, traits: ["cross_reactive", "cross_birch", "cross_grass"] },
      { name: "Swede", lmv: "Kålrot", portion: 100, traits: [] },
      { name: "Sweet Potato", lmv: "Sötpotatis rå", portion: 150, traits: ["salicylate"] },
      { name: "Radish", lmv: "Rädisa", portion: 30, traits: ["irritant"] },
      { name: "Turnip", lmv: "Majrova", portion: 100, traits: [] },
      { name: "Horseradish", lmv: "Pepparrot", portion: 5, traits: ["irritant"] },
      { name: "Black Salsify", lmv: "Svartrot", portion: 100, traits: ["fodmaps", "fructans"] },
      { name: "Kohlrabi", lmv: "Kålrabbi", portion: 100, traits: ["fodmaps", "fructans"] },
      { name: "Cassava", portion: 150, traits: [] },
      { name: "Yam", lmv: "Jams kokt u. salt", portion: 150, traits: [] },
      { name: "Taro", portion: 150, traits: ["fodmaps", "fructans", "fiber"] },
      { name: "Lotus Root", portion: 60, traits: ["fiber"] }
    ]
  },
  {
    id: "veggies",
    label: "Vegetables",
    foods: [
      { name: "Cabbage", lmv: "Vitkål", portion: 100, traits: ["fodmaps", "fructans"] },
      { name: "Kale", lmv: "Grönkål", portion: 50, traits: [] },
      { name: "Onion", lmv: "Lök gul", portion: 60, traits: ["fodmaps", "fructans", "irritant", "allyl_compounds"] },
      { name: "Tomato", lmv: "Tomat", portion: 85, traits: ["histamine", "irritant", "cross_reactive", "cross_grass", "cross_latex", "dao_competitor"] },
      { name: "Cauliflower", lmv: "Blomkål", portion: 100, traits: ["fodmaps", "fructans"] },
      { name: "Aubergine", lmv: "Aubergine", portion: 100, traits: ["histamine", "fodmaps", "fructans", "dao_competitor"] },
      { name: "Parsley", lmv: "Persilja blad", portion: 3, traits: [] },
      { name: "Leek", lmv: "Purjolök", portion: 60, traits: ["fodmaps", "fructans"] },
      { name: "Spinach", lmv: "Spenat frysvara", portion: 60, traits: ["histamine"] },
      { name: "Avocado", lmv: "Avokado", portion: 70, traits: ["over_10g_fat", "bile_stimulant", "cross_reactive", "cross_latex", "fodmaps", "polyols", "salicylate"] },
      { name: "Cucumber", lmv: "Gurka", portion: 60, traits: ["irritant", "peel_skin"] },
      { name: "Bell Pepper (sweet)", lmv: "Paprika röd", portion: 80, traits: ["irritant"] },
      { name: "Bell Pepper (hot)", lmv: "Chilipeppar färsk", portion: 10, traits: ["irritant", "capsaicin"] },
      { name: "Asparagus", lmv: "Sparris grön kokt m. salt", portion: 80, traits: ["fodmaps", "fructans"] },
      { name: "Fennel Bulb", lmv: "Fänkål", portion: 80, traits: ["fodmaps", "fructans"] },
      { name: "Broccoli", lmv: "Broccoli", portion: 100, traits: ["fodmaps", "fructans"] },
      { name: "Brussels Sprouts", lmv: "Brysselkål", portion: 100, traits: ["fodmaps", "fructans", "galactans"] },
      { name: "Green Beans", lmv: "Gröna bönor", portion: 80, traits: ["salicylate"] },
      { name: "Zucchini", lmv: "Squash", portion: 100, traits: [] },
      { name: "Pumpkin", lmv: "Pumpa", portion: 100, traits: ["dao_competitor"] },
      { name: "Swiss Chard", lmv: "Mangold", portion: 60, traits: [] },
      { name: "Romaine Lettuce", lmv: "Romansallat", portion: 40, traits: [] },
      { name: "Rocket", lmv: "Ruccolasallat", portion: 20, traits: ["irritant"] },
      { name: "Celery", lmv: "Stjälkselleri", portion: 40, traits: ["fodmaps", "polyols", "cross_reactive", "cross_birch"] },
      { name: "Bok Choy", lmv: "Sellerikål pak choi", portion: 80, traits: [] },
      { name: "Daikon Radish", lmv: "Rättika", portion: 60, traits: ["irritant"] },
      { name: "Rhubarb", lmv: "Rabarber tillagad u. socker", portion: 80, traits: [] },
      { name: "Sweetcorn", lmv: "Majskorn frysvara", portion: 80, traits: ["fodmaps", "polyols", "fructans", "salicylate"] },
      { name: "Shallot", lmv: "Lök gul", lmvNote: "yellow onion — shallot is not listed", portion: 15, traits: ["fodmaps", "fructans", "irritant", "allyl_compounds"] },
      { name: "Spring Onion", portion: 15, traits: ["fodmaps", "fructans", "irritant", "allyl_compounds"] },
      { name: "Globe Artichoke", lmv: "Kronärtskocka kokt", portion: 100, traits: ["fodmaps", "fructans"] },
      { name: "Okra", lmv: "Okra kokt u. salt", portion: 80, traits: ["fodmaps", "fructans"] }
    ]
  },
  {
    id: "fruits",
    label: "Fruits",
    foods: [
      { name: "Apples", lmv: "Äpple m. skal", portion: 150, traits: ["fodmaps", "fructose", "polyols", "irritant", "peel_skin", "cross_reactive", "cross_birch", "salicylate"] },
      { name: "Oranges", lmv: "Apelsin", portion: 130, traits: ["cross_reactive", "cross_grass", "dao_competitor"] },
      { name: "Pears", lmv: "Päron", portion: 150, traits: ["fodmaps", "fructose", "polyols", "irritant", "peel_skin", "cross_reactive", "cross_birch", "salicylate"] },
      { name: "Mangos", lmv: "Mango", portion: 150, traits: ["fodmaps", "fructose"] },
      { name: "Lemon", lmv: "Citron", portion: 15, traits: ["dao_competitor"] },
      { name: "Lime", lmv: "Lime", portion: 10, traits: ["dao_competitor"] },
      { name: "Grapefruit", lmv: "Grapefrukt", portion: 150, traits: ["dao_competitor"] },
      { name: "Grapes", lmv: "Vindruvor", portion: 100, traits: ["salicylate"] },
      { name: "Banana", lmv: "Banan", portion: 120, traits: ["cross_reactive", "cross_latex", "dao_competitor"] },
      { name: "Kiwi", lmv: "Kiwi grön", portion: 75, traits: ["cross_reactive", "cross_birch", "cross_grass", "cross_latex", "salicylate"] },
      { name: "Pineapple", lmv: "Ananas", portion: 100, traits: ["cross_reactive", "cross_latex"] },
      { name: "Papaya", lmv: "Papaya", portion: 120, traits: ["cross_reactive", "cross_latex"] },
      { name: "Watermelon", lmv: "Vattenmelon", portion: 200, traits: ["fodmaps", "fructose", "cross_reactive", "cross_grass", "salicylate"] },
      { name: "Melon", lmv: "Nätmelon", portion: 150, traits: ["cross_reactive", "cross_grass"] },
      { name: "Apricot", lmv: "Aprikos", portion: 40, traits: ["cross_reactive", "cross_birch", "fodmaps", "polyols"] },
      { name: "Plum", lmv: "Plommon", portion: 60, traits: ["cross_reactive", "cross_birch", "fodmaps", "polyols"] },
      { name: "Figs", lmv: "Fikon", portion: 50, traits: ["fodmaps", "fructose"] },
      { name: "Pomegranate", lmv: "Granatäpple", portion: 80, traits: ["salicylate"] },
      { name: "Lychee", lmv: "Litchi", portion: 50, traits: ["fructose", "fodmaps", "polyols"] },
      { name: "Star Fruit", lmv: "Carambole stjärnfrukt", portion: 60, traits: [] },
      { name: "Durian", portion: 60, traits: ["over_10g_fat", "fodmaps", "fructose"] },
      { name: "Peach", lmv: "Persika", portion: 120, traits: ["fodmaps", "polyols", "cross_reactive", "cross_birch"] },
      { name: "Nectarine", lmv: "Nektarin", portion: 120, traits: ["fodmaps", "polyols", "cross_reactive", "cross_birch", "salicylate"] },
      { name: "Passion Fruit", lmv: "Passionsfrukt", portion: 20, traits: ["fiber"] },
      // Monash: low FODMAP up to 64g, moderate fructans above that — a whole
      // persimmon is ~170g, so a normal serving is over the line.
      { name: "Persimmon", lmv: "Sharon", portion: 120, traits: ["fodmaps", "fructans", "salicylate"] },
      { name: "Canned Peaches in Syrup", lmv: "Persika konserv. m. sockerlag", portion: 120, traits: ["fodmaps", "polyols", "refined_carbs", "cross_reactive", "cross_birch"] }
    ]
  },
  {
    id: "berries",
    label: "Berries",
    foods: [
      { name: "Blueberry", lmv: "Blåbär", portion: 100, traits: [] },
      { name: "Strawberry", lmv: "Jordgubbar", portion: 100, traits: ["salicylate"] },
      { name: "Cherries", lmv: "Sötkörsbär", portion: 100, traits: ["fodmaps", "polyols", "fructose", "cross_reactive", "cross_birch"] },
      { name: "Blackberries", lmv: "Björnbär", portion: 100, traits: ["fodmaps", "polyols"] },
      { name: "Raspberries", lmv: "Hallon", portion: 100, traits: [] },
      { name: "Cloudberries", lmv: "Hjortron", portion: 80, traits: ["fiber"] },
      { name: "Lingonberry", lmv: "Lingon", portion: 50, traits: [] },
      { name: "Redcurrant", lmv: "Vinbär röda", portion: 60, traits: [] },
      { name: "Blackcurrant", lmv: "Vinbär svarta", portion: 60, traits: [] },
      { name: "Gooseberry", lmv: "Krusbär", portion: 80, traits: [] },
      { name: "Elderberry", lmv: "Fläderbär", portion: 50, traits: ["fiber"] },
      { name: "Cranberry", lmv: "Tranbär", portion: 50, traits: [] },
      { name: "Sea Buckthorn", lmv: "Havtorn", portion: 30, traits: [] },
      { name: "Aronia", lmv: "Aronia svart", portion: 50, traits: ["fodmaps", "polyols"] },
      { name: "Mulberry", lmv: "Mullbär", portion: 80, traits: [] },
      { name: "Physalis", lmv: "Physalis", portion: 40, traits: [] },
      { name: "Frozen Mixed Berries", lmv: "Hallon blåbär frysvara", lmvNote: "raspberry and blueberry", portion: 100, traits: ["fodmaps", "polyols"] }
    ]
  },
  {
    id: "driedFruits",
    label: "Dried Fruits/Berries",
    foods: [
      { name: "Dates", lmv: "Dadlar torkade", portion: 30, traits: ["fiber", "polyols", "fructans", "salicylate"] },
      { name: "Raisins", lmv: "Russin", portion: 30, traits: ["fiber", "fructans"] },
      { name: "Sultanas", lmv: "Russin", portion: 30, traits: ["fiber", "fructans"] },
      { name: "Dried Apricot", lmv: "Aprikos torkad", portion: 30, traits: ["cross_reactive", "cross_birch", "fodmaps", "polyols", "fructans"] },
      { name: "Dried Fig", lmv: "Fikon torkade", portion: 30, traits: ["fiber", "fodmaps", "polyols", "fructans"] },
      { name: "Prunes", lmv: "Katrinplommon torkade", portion: 30, traits: ["cross_reactive", "cross_birch", "fodmaps", "polyols"] },
      { name: "Dried Cranberry (Added Sugar)", lmv: "Tranbär torkade", portion: 30, traits: ["fodmaps", "fructans", "refined_carbs"] },
      { name: "Dried Cranberry (No Sugar Added)", lmv: "Tranbär torkade", portion: 30, traits: ["fodmaps", "fructans"] },
      { name: "Dried Cherry (Added Sugar)", portion: 30, traits: ["fodmaps", "polyols", "fructose", "cross_reactive", "cross_birch", "refined_carbs"] },
      { name: "Dried Cherry (No Sugar Added)", portion: 30, traits: ["fiber", "fodmaps", "polyols", "fructose", "cross_reactive", "cross_birch"] },
      { name: "Dried Mango (Added Sugar)", portion: 30, traits: ["fodmaps", "fructose", "refined_carbs"] },
      { name: "Dried Mango (No Sugar Added)", portion: 30, traits: ["fodmaps", "fructose"] },
      { name: "Dried Pineapple (Added Sugar)", portion: 30, traits: ["fiber", "fodmaps", "fructose", "refined_carbs"] },
      { name: "Dried Pineapple (No Sugar Added)", portion: 30, traits: ["fodmaps", "fructose", "fiber"] },
      { name: "Dried Papaya (Added Sugar)", portion: 30, traits: ["cross_reactive", "cross_latex", "refined_carbs"] },
      { name: "Dried Papaya (No Sugar Added)", portion: 30, traits: ["cross_reactive", "cross_latex"] },
      { name: "Dried Banana", lmv: "Banan torkad", portion: 25, traits: ["fiber", "cross_reactive", "cross_latex"] },
      { name: "Dried Apple", lmv: "Äpple torkat", portion: 20, traits: ["fiber", "fodmaps", "fructose", "polyols", "irritant", "peel_skin", "cross_reactive", "cross_birch"] },
      { name: "Dried Pear", lmv: "Päron torkade", portion: 25, traits: ["fodmaps", "fructose", "polyols", "irritant", "peel_skin", "cross_reactive", "cross_birch"] },
      { name: "Dried Blueberries (Added Sugar)", lmv: "Blåbär torkade", portion: 30, traits: ["fiber", "refined_carbs"] },
      { name: "Dried Blueberries (No Sugar Added)", lmv: "Blåbär torkade", portion: 30, traits: ["fiber"] },
      { name: "Dried Strawberries", portion: 15, traits: ["fiber"] },
      { name: "Dried Peach", lmv: "Persika torkad", portion: 30, traits: ["fiber", "fodmaps", "polyols", "cross_reactive", "cross_birch"] },
      { name: "Dried Coconut", lmv: "Kokosflingor", portion: 15, traits: ["fiber", "over_10g_fat", "bile_stimulant"] },
      { name: "Dried Goji Berry", lmv: "Gojibär torkade", portion: 15, traits: ["fiber", "fodmaps", "fructans"] },
      { name: "Dried Kiwi (Added Sugar)", portion: 30, traits: ["cross_reactive", "cross_birch", "cross_grass", "cross_latex", "refined_carbs"] },
      { name: "Dried Kiwi (No Sugar Added)", portion: 30, traits: ["fiber", "cross_reactive", "cross_birch", "cross_grass", "cross_latex"] },
      { name: "Currants (dried)", portion: 25, traits: ["fiber", "fodmaps", "fructans"] },
      { name: "Dried Lychee", portion: 20, traits: ["fructose", "fodmaps", "polyols"] }
    ]
  },
  {
    id: "nuts",
    label: "Nuts/Seeds",
    foods: [
      { name: "Almond", lmv: "Sötmandel", portion: 25, traits: ["fiber", "over_10g_fat", "bile_stimulant", "protein", "fodmaps", "galactans", "cross_reactive", "cross_birch", "allergen", "allergen_treenut", "salicylate"] },
      { name: "Brazil Nut", lmv: "Paranötter", portion: 20, traits: ["fiber", "over_10g_fat", "bile_stimulant", "fodmaps", "galactans", "allergen", "allergen_treenut"] },
      { name: "Cashew Nut", lmv: "Cashewnötter rostade u. salt", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "fiber", "fodmaps", "galactans", "fructans", "allergen", "allergen_treenut"] },
      /* wholeSeed marks the seeds small and tough enough to be swallowed
         intact: the fiber is what acts on the gut while most of the fat stays
         locked inside the shell. Only flaxseed, chia and psyllium qualify.
         Pumpkin seeds are too large to swallow whole, and both they and sesame
         turn brittle when roasted, so both are tagged on their full content.
         Ground versions release everything and carry the fat tags. */
      { name: "Chiaseeds (whole)", wholeSeed: true, lmv: "Chiafrö", portion: 15, traits: ["fiber"] },
      { name: "Chiaseeds (ground)", lmv: "Chiafrö", portion: 15, traits: ["fiber", "over_10g_fat", "bile_stimulant"] },
      { name: "Flaxseed (whole)", wholeSeed: true, lmv: "Linfrö hela", portion: 15, traits: ["fiber", "fodmaps", "fructans"] },
      { name: "Psyllium Husk (whole)", wholeSeed: true, lmv: "Psylliumfröskal", portion: 7, traits: ["fiber"] },
      { name: "Psyllium Husk (ground)", lmv: "Psylliumfröskal", portion: 7, traits: ["fiber"] },
      { name: "Flaxseed (ground)", lmv: "Linfrö hela", portion: 15, traits: ["fiber", "over_10g_fat", "bile_stimulant", "fodmaps", "fructans"] },
      { name: "Hazelnut", lmv: "Hasselnötter", portion: 25, traits: ["fiber", "over_10g_fat", "bile_stimulant", "fodmaps", "fructans", "allergen", "allergen_treenut", "cross_reactive", "cross_birch"] },
      { name: "Peanut", lmv: "Jordnötter torkade", portion: 25, traits: ["fiber", "over_10g_fat", "bile_stimulant", "protein", "fodmaps", "galactans", "allergen", "allergen_peanut", "cross_reactive", "cross_grass"] },
      { name: "Pumpkin Seeds", lmv: "Pumpafrö", portion: 15, traits: ["fiber", "over_10g_fat", "bile_stimulant", "protein"] },
      { name: "Sunflower Seeds", lmv: "Solrosfrö", portion: 15, traits: ["fiber", "over_10g_fat", "bile_stimulant", "protein"] },
      { name: "Walnut", lmv: "Valnötter", portion: 25, traits: ["fiber", "over_10g_fat", "bile_stimulant", "allergen", "allergen_treenut"] },
      { name: "Sesame Seeds", lmv: "Sesamfrö m. skal", portion: 5, traits: ["fiber", "over_10g_fat", "bile_stimulant", "allergen", "allergen_sesame"] },
      { name: "Macadamia", lmv: "Macadamianötter", portion: 20, traits: ["fiber", "over_10g_fat", "bile_stimulant", "allergen", "allergen_treenut"] },
      { name: "Pecan", lmv: "Pekannötter", portion: 20, traits: ["fiber", "over_10g_fat", "bile_stimulant", "allergen", "allergen_treenut"] },
      // Chestnut is the odd one out here: ~2g fat, so no fat/bile tags. It is a
      // classic latex-fruit syndrome cross-reactor alongside banana/avocado/kiwi.
      { name: "Chestnut", lmv: "Kastanjer", portion: 60, traits: ["fiber", "cross_reactive", "cross_latex"] },
      // From the SIGHI review (cleared there — SIGHI gave no mechanism).
      // Sources vary a lot (fiber 10-33g, fat 18-25g per 100g) but every one
      // of them clears both thresholds. Protein is only ~5g, so no protein tag.
      { name: "Tiger Nut (roasted)", portion: 25, traits: ["fiber", "over_10g_fat", "bile_stimulant"] },
      { name: "Pistachio", lmv: "Pistaschnötter u. salt", portion: 25, traits: ["fiber", "over_10g_fat", "bile_stimulant", "protein", "fodmaps", "galactans", "fructans", "allergen", "allergen_treenut"] },
      { name: "Pine Nuts", portion: 15, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "fructans", "allergen", "allergen_treenut"] },
      { name: "Hemp Seeds", lmv: "Hampafrö u. skal", portion: 15, traits: ["over_10g_fat", "bile_stimulant", "protein"] },
      { name: "Poppy Seeds", lmv: "Vallmofrö", portion: 5, traits: ["fiber", "over_10g_fat", "bile_stimulant"] },
      { name: "Sunflower Seed Butter", portion: 20, traits: ["fiber", "over_10g_fat", "bile_stimulant", "protein", "fodmaps", "fructans"] }
    ]
  },
  {
    id: "grains",
    label: "Grains/pseudo grains",
    foods: [
      // Oats, rye and barley are almost never eaten as bare grain, so the
      // products are what people actually recognise and react to. Wheat
      // already had its own spread of products further down this list.
      { name: "Oats", lmv: "Havregryn fullkorn", portion: 40, traits: ["fiber", "fodmaps", "fructans"] },
      { name: "Oat Porridge", lmv: "Havregrynsgröt fullkorn", portion: 250, traits: ["fodmaps", "fructans"] },
      { name: "Oat Bran", lmv: "Havrekli", portion: 20, traits: ["fiber", "fodmaps", "fructans"] },
      { name: "Muesli (no added sugar)", lmv: "Frukostflingor müsli fullkorn m. frukt", portion: 50, traits: ["fiber", "fodmaps", "fructans", "allergen", "allergen_wheat"] },
      { name: "Wheat", lmv: "Matvete kokt m. salt", portion: 175, traits: ["fiber", "fodmaps", "fructans", "allergen", "allergen_wheat"] },
      { name: "Rye", lmv: "Rågkross ångprep. fullkorn", lmvNote: "cracked whole grain — rye is not listed as a cooked whole grain", portion: 175, traits: ["fiber", "fodmaps", "fructans"] },
      { name: "Rye Bread (whole grain)", lmv: "Bröd fullkorn råg fibrer ca 7%", portion: 70, traits: ["fiber", "fodmaps", "fructans"] },
      { name: "Pearl Barley (cooked)", lmv: "Korngryn kokt u. salt", portion: 175, traits: ["fodmaps", "fructans"] },
      { name: "Barley", lmv: "Korngryn kokt u. salt", portion: 175, traits: ["fodmaps", "fructans"] },
      { name: "Quinoa", lmv: "Mjölmålla quinoa röd kokt m. salt", portion: 175, traits: ["fiber"] },
      { name: "Buckwheat", lmv: "Bovetemjöl", lmvNote: "flour", portion: 175, traits: [] },
      { name: "Rice", lmv: "Ris råris kokt m. salt", portion: 175, traits: [] },
      { name: "Couscous", lmv: "Couscous kokt m. salt fullkorn", lmvNote: "wholegrain — the only cooked entry", portion: 175, traits: ["refined_carbs", "allergen", "allergen_wheat", "fodmaps", "fructans"] },
      { name: "Bulgur", lmv: "Bulgur kokt", portion: 175, traits: ["allergen", "allergen_wheat", "fodmaps", "fructans"] },
      { name: "Freekeh", portion: 175, traits: ["allergen", "allergen_wheat", "fodmaps", "fructans"] },
      { name: "Pita Bread", lmv: "Bröd vitt vete vatten fibrer ca 3,5% typ pitabröd", portion: 60, traits: ["allergen", "allergen_wheat", "fodmaps", "fructans", "refined_carbs"] },
      { name: "Naan Bread", portion: 90, traits: ["allergen", "allergen_wheat", "fodmaps", "fructans", "refined_carbs", "over_10g_fat"] },
      { name: "Soba Noodles", portion: 180, traits: ["refined_carbs", "allergen", "allergen_wheat", "fodmaps", "fructans"] },
      { name: "Rice Noodles", lmv: "Nudlar risnudlar kokta", portion: 180, traits: ["refined_carbs"] },
      { name: "White Bread", lmv: "Bröd vitt fibrer 3,5%", portion: 70, traits: ["allergen", "allergen_wheat", "fodmaps", "fructans", "refined_carbs"] },
      { name: "Pasta (no egg)", lmv: "Pasta kokt u. salt", portion: 180, traits: ["refined_carbs", "allergen", "allergen_wheat", "fodmaps", "fructans"] },
      { name: "Teff", lmv: "Teffmjöl", lmvNote: "flour", portion: 40, traits: ["fiber"] },
      { name: "Sorghum/Durra", lmv: "Durra el. andra sorghumarter mjöl", lmvNote: "flour", portion: 40, traits: [] },
      { name: "Crispbread (rye)", lmv: "Hårt bröd fullkorn råg fibrer ca 13%", portion: 20, traits: ["fiber", "fodmaps", "fructans"] },
      { name: "Rice Cakes", portion: 15, traits: ["refined_carbs"] },
      { name: "Polenta", lmv: "Majsgryn polenta kokt m. salt", portion: 175, traits: [] },
      { name: "Millet", lmv: "Hirs kokt m. salt", portion: 175, traits: [] },
      { name: "Seitan", portion: 100, traits: ["protein", "allergen", "allergen_wheat"] },
      { name: "Tapioca", portion: 40, traits: [] },
      { name: "Cornstarch", lmv: "Majsstärkelse", portion: 8, traits: ["refined_carbs"] },
      { name: "Sourdough Bread (wheat)", portion: 70, traits: ["refined_carbs", "allergen", "allergen_wheat"] },
      { name: "Gluten-free Bread", lmv: "Bröd vitt glutenfritt", portion: 70, traits: ["refined_carbs"] },
      { name: "Gluten-free Crispbread", lmv: "Hårt bröd glutenfritt fibrer ca 7%", portion: 20, traits: ["fiber", "refined_carbs"] },
      { name: "Gluten-free Pasta", lmv: "Pasta kokt m. salt majs 100% glutenfri", lmvNote: "100 % maize — the wheat-starch kind is not listed", portion: 180, traits: ["refined_carbs"] },
      { name: "Gluten-free Oats", lmv: "Havregryn fullkorn", lmvNote: "the same entry as ordinary oats — the difference is contamination, not composition", portion: 40, traits: ["fiber", "fodmaps", "fructans"] },
      { name: "Spelt", lmv: "Dinkel speltvete kokt m. salt", portion: 175, traits: ["fodmaps", "fructans", "allergen", "allergen_wheat"] },
      { name: "Semolina Porridge", lmv: "Mannagrynsgröt", portion: 250, traits: ["refined_carbs", "fodmaps", "fructans", "allergen", "allergen_wheat"] },
      { name: "Corn Tortilla", portion: 50, traits: [] },
      { name: "Wheat Bran", lmv: "Vetekli", portion: 15, traits: ["fiber", "fodmaps", "fructans", "allergen", "allergen_wheat"] },
      { name: "Rice Flour", lmv: "Rismjöl vitt", portion: 40, traits: ["refined_carbs"] },
      { name: "Potato Flour", lmv: "Potatismjöl", portion: 15, traits: ["refined_carbs"] },
      { name: "Almond Flour", lmv: "Mandelmjöl", portion: 30, traits: ["fiber", "over_10g_fat", "bile_stimulant", "protein", "fodmaps", "galactans", "cross_reactive", "cross_birch", "allergen", "allergen_treenut", "salicylate"] }
    ]
  },
  {
    id: "legumes",
    label: "Legumes",
    foods: [
      { name: "Black Bean", lmv: "Svarta bönor konserv. u. lag", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Chickpea (whole/flour)", lmv: "Kikärtor torkade kokta m. salt", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Common Peas", lmv: "Gröna ärtor kokta m. salt frysvara", portion: 100, traits: ["fodmaps", "fructans", "dao_competitor", "salicylate"] },
      { name: "Lentils", lmv: "Röda linser torkade kokta m. salt", lmvNote: "red lentils", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Tempeh", lmv: "Tempeh", portion: 100, traits: ["over_10g_fat", "allergen", "allergen_soy", "histamine"] },
      { name: "Tofu (firm)", lmv: "Tofu fast", portion: 120, traits: ["allergen", "allergen_soy", "cross_reactive", "cross_birch", "dao_competitor"] },
      { name: "Tofu (silken)", portion: 120, traits: ["fodmaps", "galactans", "allergen", "allergen_soy", "cross_reactive", "cross_birch", "dao_competitor"] },
      { name: "Soybeans", lmv: "Sojabönor torkade kokta u. salt", portion: 100, traits: ["fodmaps", "galactans", "allergen", "allergen_soy", "cross_reactive", "cross_birch", "dao_competitor"] },
      { name: "Edamame", lmv: "Sojabönor torkade kokta u. salt", portion: 80, traits: ["allergen", "allergen_soy", "cross_reactive", "cross_birch"] },
      { name: "Falafel", lmv: "Falafel kikärtskroketter stekta", portion: 90, traits: ["over_10g_fat", "fiber", "fodmaps", "galactans"] },
      { name: "Fava Beans", lmv: "Bondbönor färska kokta u. salt", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Kidney Beans", lmv: "Kidneybönor röda bönor konserv. u. lag", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Pinto Beans", lmv: "Bruna bönor torkade kokta m. salt", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Split Peas", lmv: "Gula ärtor kokta m. salt", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "White Beans in Tomato Sauce", lmv: "Vita bönor m. tomatsås konserv.", portion: 150, traits: ["refined_carbs", "fodmaps", "galactans"] },
      { name: "Green Lentils", lmv: "Gröna linser torkade kokta m. salt", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Mung Beans", lmv: "Mungbönor torkade kokta u. salt", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Adzuki Beans", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Butter Beans", portion: 150, traits: ["fiber", "fodmaps", "galactans"] }
    ]
  },
  {
    id: "landAnimals",
    label: "Land Animals",
    foods: [
      { name: "Cows Meat", lmv: "Nöt kött rå", portion: 125, traits: ["bile_stimulant", "protein", "alpha_gal"] },
      { name: "Pork (lean cut)", lmv: "Gris kött kokt m. salt", portion: 125, traits: ["bile_stimulant", "protein", "alpha_gal"] },
      { name: "Pork (fatty cut)", lmv: "Gris sidfläsk rökt", lmvNote: "smoked side pork — the fattiest cut listed", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "alpha_gal"] },
      { name: "Elk Meat", lmv: "Älg högrev rå", portion: 125, traits: ["bile_stimulant", "protein", "alpha_gal", "histamine"] },
      { name: "Chicken", lmv: "Kyckling kokt m. salt", portion: 125, traits: ["bile_stimulant", "protein"] },
      { name: "Egg White", lmv: "Äggvita rå", portion: 33, traits: ["allergen", "allergen_egg"] },
      { name: "Egg Yolk", lmv: "Äggula rå", portion: 17, traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_egg"] },
      { name: "Whole Egg", lmv: "Ägg rått", portion: 55, traits: ["allergen", "allergen_egg"] },
      { name: "Salami", lmv: "Påläggskorv salami rökt", portion: 20, traits: ["over_10g_fat", "bile_stimulant", "histamine", "alpha_gal", "dao_competitor"] },
      { name: "Dry-Cured Ham (lean)", lmv: "Gris skinka lufttorkad italiensk", portion: 20, traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine", "alpha_gal", "dao_competitor"] },
      { name: "Dry-Cured Ham (fatty cut)", portion: 20, traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine", "alpha_gal", "dao_competitor"] },
      { name: "Chicken Sausage", lmv: "Korv kycklingkorv mager", portion: 100, traits: ["histamine"] },
      { name: "Sausages (regular)", lmv: "Korv frukostkorv stekt", portion: 100, traits: ["over_10g_fat", "bile_stimulant", "histamine", "alpha_gal"] },
      { name: "Minced Meat (~10% fat)", lmv: "Nöt färs rå fett 10%", lmvNote: "entry measures 11.3 g fat", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine", "alpha_gal"] },
      { name: "Minced Meat (~15% fat)", lmv: "Nöt färs rå fett 15%", portion: 125, traits: ["over_10g_fat", "histamine", "alpha_gal"] },
      { name: "Minced Meat (~20% fat)", lmv: "Blandfärs stekt m. salt", lmvNote: "fried mixed mince — no raw 20 % entry", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine", "alpha_gal"] },
      { name: "Lamb", lmv: "Lamm kött rå", portion: 125, traits: ["alpha_gal"] },
      // Named for the skin, because that is where the fat is: skinless
      // breast is ~4g/100g and would not carry either tag.
      { name: "Duck (with skin)", lmv: "Anka rå m. skinn", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "alpha_gal"] },
      { name: "Turkey", lmv: "Kalkon kokt", portion: 125, traits: ["bile_stimulant", "protein"] },
      { name: "Frozen Meatballs", lmv: "Köttbullar frysvara", portion: 100, traits: ["over_10g_fat", "histamine", "alpha_gal"] },
      { name: "Hot Dog Sausage", lmv: "Korv varmkorv kokt", portion: 80, traits: ["over_10g_fat", "bile_stimulant", "histamine", "alpha_gal"] },
      { name: "Chicken Nuggets", lmv: "Kyckling nugget friterad tillagad på restaurang", portion: 100, traits: ["over_10g_fat", "allergen", "allergen_wheat"] },
      { name: "Bacon", lmv: "Gris bacon stekt", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "histamine", "alpha_gal", "dao_competitor"] },
      { name: "Beef Liver", lmv: "Nöt lever rå", portion: 100, traits: ["protein", "alpha_gal"] },
      { name: "Liver Pate", lmv: "Leverpastej bredbar fett ca 24%", lmvNote: "the spreadable kind, 24 % fat", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "alpha_gal"] },
      { name: "Blood Pudding", lmv: "Blodpudding blodkorv fett 14%", portion: 120, traits: ["over_10g_fat", "fodmaps", "fructans", "allergen", "allergen_wheat", "alpha_gal"] },
      { name: "Reindeer", lmv: "Ren kött rå", portion: 125, traits: ["bile_stimulant", "protein", "alpha_gal"] },
      { name: "Dried Reindeer Meat", lmv: "Ren kött torkat", portion: 20, traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine", "dao_competitor", "alpha_gal"] }
    ]
  },
  {
    id: "seafood",
    label: "Seafood",
    foods: [
      { name: "Salmon", lmv: "Lax stekt m. salt", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_fish", "histamine", "dao_competitor"] },
      { name: "Cod", lmv: "Torsk rå", portion: 125, traits: ["allergen", "allergen_fish", "histamine"] },
      { name: "Oysters", lmv: "Ostron", portion: 50, traits: ["allergen", "allergen_shellfish", "histamine"] },
      { name: "Lobsters", lmv: "Hummer kokt", portion: 100, traits: ["allergen", "allergen_shellfish", "histamine"] },
      { name: "Crayfish", lmv: "Kräfta kokt", portion: 80, traits: ["allergen", "allergen_shellfish", "histamine"] },
      { name: "Shrimp", lmv: "Räka kokt", portion: 80, traits: ["allergen", "allergen_shellfish", "histamine"] },
      { name: "Tuna", lmv: "Tonfisk stekt m. salt", portion: 100, traits: ["bile_stimulant", "protein", "allergen", "allergen_fish", "histamine", "dao_competitor"] },
      { name: "Anchovies", lmv: "Ansjovis skarpsill konserv. ", portion: 10, traits: ["over_10g_fat", "allergen", "allergen_fish", "histamine", "dao_competitor"] },
      { name: "Smoked Salmon", lmv: "Lax kallrökt", portion: 30, traits: ["allergen", "allergen_fish", "histamine", "dao_competitor"] },
      { name: "Crab", lmv: "Krabba Blå krabba kokt", portion: 80, traits: ["allergen", "allergen_shellfish", "histamine"] },
      { name: "Mussels", lmv: "Mussla konserv. m. lag", portion: 80, traits: ["allergen", "allergen_shellfish", "histamine"] },
      { name: "Fish Balls", lmv: "Fiskbullar konserv. u. buljong", portion: 100, traits: ["allergen", "allergen_fish", "histamine"] },
      { name: "Fish Fingers", lmv: "Fiskpinnar stekta", portion: 100, traits: ["over_10g_fat", "allergen", "allergen_fish", "allergen_wheat", "histamine"] },
      { name: "Nori", portion: 3, traits: ["fiber"] },
      { name: "Mackerel", lmv: "Makrill rå", portion: 100, traits: ["over_10g_fat", "bile_stimulant", "histamine", "dao_competitor", "allergen", "allergen_fish"] },
      { name: "Sardines (canned)", lmv: "Sardiner i olja konserv.", portion: 60, traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine", "dao_competitor", "allergen", "allergen_fish"] },
      { name: "Pickled Herring", lmv: "Sill inlagd u. lag", portion: 40, traits: ["over_10g_fat", "refined_carbs", "histamine", "dao_competitor", "irritant", "aceticAcid", "allergen", "allergen_fish"] },
      { name: "Surimi / Crab Sticks", lmv: "Surimi fisk", portion: 60, traits: ["refined_carbs", "allergen", "allergen_fish", "allergen_wheat"] }
    ]
  },
  {
    id: "dairy",
    label: "Dairy",
    foods: [
      { name: "Cows Milk", lmv: "Mjölk fett 3% berikad", portion: 200, traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Goats Milk", portion: 200, traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Sheeps Milk", portion: 200, traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Cream Cheese (<10% fat)", lmv: "Färskost cream cheese extra light fett 5%", portion: 20, traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Cream Cheese (>10% fat)", lmv: "Färskost fett 33%", portion: 20, traits: ["over_10g_fat", "bile_stimulant", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Hard Cheese (~15% fat)", lmv: "Ost hårdost fett 17%", lmvNote: "closest entry is 17 % fat", portion: 20, traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine", "dao_competitor"] },
      { name: "Hard Cheese (~28-35% fat)", lmv: "Ost hårdost fett 31%", portion: 20, traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine", "dao_competitor"] },
      { name: "White Cheese (~0% fat)", lmv: "Kvarg naturell fett 0,2%", portion: 30, traits: ["allergen", "allergen_milk", "over_3g_lactose"] },
      { name: "Yogurt", lmv: "Yoghurt naturell fett 3% berikad", portion: 200, traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Yoghurt 0,5%", lmv: "Yoghurt naturell lätt fett 0,5% berikad", portion: 200, traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Yoghurt 3%", lmv: "Yoghurt naturell fett 3% berikad", portion: 200, traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Greek Yogurt (10% fat)", lmv: "Yoghurt naturell fett 10%", lmvNote: "entry measures 8.3 g fat, below the 10 g threshold", portion: 150, traits: ["over_10g_fat", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Butter", lmv: "Smör fett 80%", portion: 7, traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_milk"] },
      { name: "Cream", lmv: "Vispgrädde fett 40%", portion: 30, traits: ["over_10g_fat", "bile_stimulant", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Quark (~1%)", lmv: "Kvarg färskost fett 1%", portion: 150, traits: ["allergen", "allergen_milk", "over_3g_lactose"] },
      { name: "Quark (~10%)", lmv: "Kvarg färskost fett 10%", portion: 150, traits: ["over_10g_fat", "allergen", "allergen_milk", "over_3g_lactose"] },
      { name: "Cottage Cheese", lmv: "Färskost cottage cheese naturell fett 4%", portion: 100, traits: ["allergen", "allergen_milk", "over_3g_lactose"] },
      { name: "Sour Cream (~10% fat)", lmv: "Gräddfil fett 12%", portion: 30, traits: ["over_10g_fat", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Sour Cream (~20% fat)", lmv: "Crème fraiche fett 34%", portion: 30, traits: ["over_10g_fat", "bile_stimulant", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Ricotta Cheese", lmv: "Färskost ricotta fett ca 10%", portion: 50, traits: ["over_10g_fat", "allergen", "allergen_milk", "over_3g_lactose"] },
      { name: "Mascarpone", lmv: "Färskost fett 33%", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_milk", "over_3g_lactose"] },
      { name: "Parmesan", lmv: "Ost hårdost parmesan fett 30% typ Parmiggiano Reggiano", portion: 10, traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine", "dao_competitor"] },
      { name: "Halloumi", lmv: "Ost halloumi rå fett 22%", portion: 60, traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk"] },
      { name: "Mozzarella", lmv: "Ost mozzarella fett 18%", portion: 40, traits: ["over_10g_fat", "allergen", "allergen_milk"] },
      { name: "Blue Cheese", lmv: "Ädelost grönmögelost fett 17%", portion: 20, traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine", "dao_competitor"] },
      // Added from the SIGHI review — named there as histamine sources.
      // Fat/protein checked against nutrition data: Roquefort 30.6/21.5,
      // Fontina 31.1/25.6, Raclette ~29/23 per 100g. All clear both thresholds.
      { name: "Roquefort", portion: 20, traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine", "dao_competitor"] },
      { name: "Fontina", portion: 20, traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine", "dao_competitor"] },
      { name: "Raclette", portion: 40, traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine", "dao_competitor"] },
      { name: "Camembert", lmv: "Vitmögelost camembert fett ca 22%", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_milk", "histamine", "dao_competitor"] },
      { name: "Cheddar", lmv: "Ost hårdost fett 31%", lmvNote: "generic hard cheese entry", portion: 20, traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine", "dao_competitor"] },
      { name: "Aged Gouda", lmv: "Ost hårdost fett 31%", lmvNote: "generic hard cheese entry", portion: 20, traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk", "histamine", "dao_competitor"] },
      { name: "Whey Protein", portion: 30, traits: ["protein", "allergen", "allergen_milk", "over_3g_lactose"] },
      // 21.3g fat/100g, so it clears the 17.5g bile threshold like the other
      // full-fat cheeses. Protein is only ~14g, so no protein tag.
      { name: "Feta Cheese", lmv: "Salladsost fett 22%", portion: 30, traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_milk", "histamine"] },
      { name: "Labneh", portion: 40, traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Paneer", lmv: "Paneer", portion: 60, traits: ["over_10g_fat", "allergen", "allergen_milk", "over_3g_lactose"] },
      { name: "Skyr", portion: 150, traits: ["over_3g_lactose", "allergen", "allergen_milk"] },
      { name: "Buttermilk", lmv: "Filmjölk fett 3% berikad", portion: 200, traits: ["over_3g_lactose", "allergen", "allergen_milk"] },
      { name: "Kefir", lmv: "Kefir fett 3% berikad", portion: 200, traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      // Lactase-treated dairy: lactose <0.1g/100g and Monash-tested low FODMAP,
      // but the milk protein and (for yogurt) the fermentation are unchanged.
      // That split is the point — it separates lactose from casein/histamine.
      { name: "Lactose-free Milk", lmv: "Mjölk fett 3% berikad", lmvNote: "ordinary milk — the lactose-free version is not listed", portion: 200, traits: ["allergen", "allergen_milk"] },
      { name: "Lactose-free Yogurt", lmv: "Yoghurt naturell lätt laktosfri fett ca 0,4% berikad", portion: 200, traits: ["allergen", "allergen_milk"] },
      { name: "Filmjolk", lmv: "Filmjölk fett 3% berikad", portion: 200, traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Creme Fraiche", lmv: "Crème fraiche fett 34%", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Brie", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "histamine", "dao_competitor", "allergen", "allergen_milk"] },
      { name: "Emmental", lmv: "Ost hårdost fett 31%", lmvNote: "generic hard cheese entry", portion: 20, traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine", "dao_competitor", "allergen", "allergen_milk"] },
      { name: "Lactose-free Cheese", lmv: "Ost hårdost fett 31%", lmvNote: "ordinary hard cheese — the lactose-free version is not listed", portion: 20, traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen", "allergen_milk"] },
      { name: "Lactose-free Cream", lmv: "Vispgrädde fett 40%", lmvNote: "ordinary cream — the lactose-free version is not listed", portion: 30, traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_milk"] }
    ]
  },
  {
    id: "spices",
    label: "Spices",
    foods: [
      { name: "Chili", lmv: "Chilipeppar färsk", portion: 5, traits: ["irritant", "capsaicin"] },
      { name: "Garlic", lmv: "Vitlök", portion: 5, traits: ["fodmaps", "fructans", "irritant", "allyl_compounds"] },
      { name: "Ginger", lmv: "Ingefära färsk", portion: 5, traits: [] },
      { name: "Dill", lmv: "Dill färsk", portion: 2, traits: [] },
      { name: "Turmeric", lmv: "Gurkmeja torkad", portion: 2, traits: ["bile_stimulant"] },
      { name: "Mustard", lmv: "Senap svensk", portion: 5, traits: ["irritant", "allyl_compounds"] },
      { name: "Black Pepper", portion: 2, traits: ["irritant"] },
      { name: "Za'atar", portion: 2, traits: ["irritant"] },
      { name: "Sumac", portion: 2, traits: ["irritant", "aceticAcid"] },
      { name: "Cumin", lmv: "Spiskummin frö torkad", portion: 2, traits: ["salicylate"] },
      { name: "Shawarma Spice Mix", portion: 2, traits: ["irritant"] },
      { name: "Wasabi", lmv: "Wasabirot", portion: 3, traits: ["irritant", "allyl_compounds"] },
      { name: "Curry Powder", portion: 2, traits: ["irritant", "capsaicin"] },
      { name: "Sichuan Peppercorn", portion: 2, traits: ["irritant"] },
      { name: "Nutmeg", lmv: "Muskotnöt malen", portion: 2, traits: [] },
      // Herbs sit under the 10g typical-serving gate, so no macro tags apply
      // however fiber-dense they look per 100g. All rated 0 by SIGHI and
      // unrestricted by Monash.
      { name: "Basil", lmv: "Basilika färsk", portion: 2, traits: [] },
      { name: "Oregano", portion: 2, traits: [] },
      { name: "Thyme", portion: 2, traits: [] },
      { name: "Rosemary", portion: 2, traits: [] },
      { name: "Mint", portion: 2, traits: ["irritant"] },
      { name: "Cinnamon", lmv: "Kanel", portion: 2, traits: [] },
      { name: "Paprika Powder", portion: 2, traits: [] },
      { name: "Cardamom", lmv: "Kardemumma torkad", portion: 2, traits: [] },
      { name: "Allspice", portion: 2, traits: [] }
    ]
  },
  {
    id: "beverages",
    label: "Beverages",
    foods: [
      { name: "Red Wine", lmv: "Vin rött vol. % 14", portion: 150, traits: ["alcohol", "histamine", "irritant"] },
      { name: "White Wine", lmv: "Vin vitt vol. % 12", portion: 150, traits: ["alcohol", "histamine", "irritant"] },
      // From the SIGHI review. Styrian rosé, 11-12% ABV under Schilcherland DAC.
      { name: "Schilcherwein", portion: 150, traits: ["alcohol", "histamine", "irritant"] },
      { name: "Champagne", portion: 150, traits: ["alcohol", "histamine", "irritant", "carbonation"] },
      { name: "Beer", lmv: "Öl starköl el. exportöl vol. % 5,4", portion: 330, traits: ["alcohol", "histamine", "irritant", "carbonation"] },
      { name: "Cider", lmv: "Cider vol. % 1", lmvNote: "the 1 % grocery cider — stronger ones are not listed", portion: 330, traits: ["alcohol", "irritant", "carbonation", "histamine"] },
      { name: "Spirits (Liquor)", lmv: "Whisky vol. % 40", portion: 40, traits: ["alcohol", "irritant", "histamine"] },
      { name: "Coffee", lmv: "Kaffe bryggt", portion: 200, traits: ["caffeine", "irritant"] },
      { name: "Espresso", lmv: "Kaffe espresso bryggt drickf.", portion: 30, traits: ["caffeine", "irritant"] },
      { name: "Black Tea", portion: 200, traits: ["caffeine", "irritant"] },
      { name: "Green Tea", portion: 200, traits: ["caffeine"] },
      { name: "Mate Tea", portion: 200, traits: ["caffeine"] },
      { name: "Energy Drinks", lmv: "Energidryck m. socker berikad", portion: 250, traits: ["caffeine", "irritant", "carbonation"] },
      { name: "Soy Milk", lmv: "Sojadryck", portion: 200, traits: ["allergen", "allergen_soy", "fodmaps", "galactans", "dao_competitor"] },
      { name: "Oat Drink", lmv: "Havredryck fett 1,5% berikad", portion: 200, traits: [] },
      { name: "Coconut Milk", lmv: "Kokosmjölk fett ca 6%", portion: 100, traits: ["fodmaps", "polyols"] },
      { name: "Matcha", portion: 2, traits: ["caffeine"] },
      { name: "Chai Tea", portion: 200, traits: ["caffeine"] },
      // Added for the salicylate work; carries no histamine per the review.
      // Caffeine-free. Cross-reacts with mugwort/ragweed pollen (Asteraceae) —
      // tagged with the general cross-reaction trait, since we track only the
      // birch, grass and latex groups as subtypes.
      { name: "Chamomile Tea", portion: 200, traits: ["salicylate", "cross_reactive"] },
      { name: "Kombucha", portion: 250, traits: ["histamine", "carbonation"] },
      { name: "Almond Milk", lmv: "Mandeldryck berikad", portion: 200, traits: ["allergen", "allergen_treenut"] },
      { name: "Rice Milk", portion: 200, traits: [] },
      { name: "Orange Juice", lmv: "Apelsinjuice drickf.", portion: 200, traits: ["cross_reactive", "cross_grass", "dao_competitor"] },
      { name: "Apple Juice", lmv: "Äppeljuice drickf.", portion: 200, traits: ["fodmaps", "fructose", "polyols", "cross_reactive", "cross_birch"] },
      { name: "Rosehip Soup", lmv: "Nyponsoppapulver berikad", lmvNote: "powder — the made-up soup is not listed", portion: 200, traits: ["refined_carbs"] },
      { name: "Peppermint Tea", portion: 200, traits: ["irritant"] },
      { name: "Alcohol-free Beer", lmv: "Öl alkoholfri", portion: 330, traits: ["irritant", "carbonation"] },
      { name: "Squash / Cordial", lmv: "Saft drickf.", portion: 200, traits: ["refined_carbs"] },
      { name: "Hot Chocolate", lmv: "Varm choklad m. mjölk fett 3%", portion: 200, traits: ["refined_carbs", "over_3g_lactose", "fodmaps", "caffeine", "allergen", "allergen_milk"] }
    ]
  },
  {
    id: "ultraProcessed",
    label: "Processed Foods",
    foods: [
      { name: "Frozen pizza", lmv: "Pizza orientalisk", portion: 300, traits: ["refined_carbs"] },
      { name: "French Fries (deep-fried)", lmv: "Pommes frites friterad potatis fett ca 11% frysvara", portion: 150, traits: ["over_10g_fat", "refined_carbs"] },
      { name: "French Fries (oven-baked)", lmv: "Pommes frites friterad potatis värmd i ugn fett ca 7% frysvara", portion: 150, traits: ["refined_carbs"] },
      { name: "Instant Ramen", portion: 300, traits: ["allergen", "allergen_wheat", "fodmaps", "fructans"] },
      { name: "Margarine", lmv: "Flytande margarin fett 70%", portion: 7, traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Instant Soup / Bouillon Cubes", lmv: "Köttbuljong tärning ätf.", portion: 4, traits: ["fodmaps", "fructans"] },
      { name: "Flavored Yogurt", lmv: "Fruktyoghurt fett 2%", portion: 200, traits: ["over_3g_lactose", "fodmaps", "refined_carbs", "allergen", "allergen_milk"] },
      { name: "Pretzels", lmv: "Salta pinnar", portion: 30, traits: ["fiber", "allergen", "allergen_wheat", "refined_carbs"] },
      { name: "Instant Mashed Potato", lmv: "Potatismos hemlagad", portion: 175, traits: ["refined_carbs"] },
      { name: "Dumplings", portion: 100, traits: ["allergen", "allergen_wheat", "over_10g_fat"] },
      { name: "Fresh Pasta (w/ egg)", lmv: "Pasta färsk m. ägg kokt u. salt", portion: 180, traits: ["refined_carbs", "allergen", "allergen_wheat", "allergen_egg", "fodmaps", "fructans"] }
    ]
  },
  {
    id: "plantBased",
    label: "Plant-Based Substitutes",
    foods: [
      { name: "Soy Yogurt", lmv: "Soygurt naturell eko. berikad", portion: 200, traits: ["allergen", "allergen_soy"] },
      { name: "Coconut Yogurt", portion: 150, traits: ["fodmaps", "polyols"] },
      { name: "Oat Yogurt", lmv: "Havregurt naturell fett 2,2% berikad", portion: 200, traits: ["fodmaps", "fructans"] },
      { name: "Oat Fraiche", lmv: "Fraiche m. havre veg. fett 15% berikad", portion: 25, traits: ["over_10g_fat", "fodmaps", "fructans"] },
      { name: "Vegan Cheese (Coconut Oil)", lmv: "Kokosbaserad bit fett ca 20% som alternativ till ost", portion: 20, traits: ["over_10g_fat", "bile_stimulant", "refined_carbs"] },
      { name: "Vegan Cheese (Cashew)", portion: 20, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "galactans", "fructans", "allergen", "allergen_treenut"] },
      { name: "Plant-based Mince", lmv: "Sojaprotein färs stekt", portion: 125, traits: ["fiber", "over_10g_fat", "bile_stimulant", "protein", "fodmaps", "galactans", "allergen", "allergen_soy"] },
      { name: "Quorn", lmv: "Mykoprotein bullar frysvara", lmvNote: "mycoprotein balls — plain pieces are not listed", portion: 100, traits: ["allergen", "allergen_egg"] },
      { name: "Veggie Burger (vegetable-based)", lmv: "Grönsaksburgare stekt veg.", portion: 100, traits: ["over_10g_fat", "fodmaps", "galactans", "refined_carbs"] },
      { name: "Pea Protein Powder", portion: 30, traits: ["protein"] },
      { name: "Aquafaba", portion: 30, traits: ["fodmaps", "galactans"] },
    ]
  },
  {
    id: "condiments",
    label: "Condiments",
    foods: [
      { name: "Soy Sauce", lmv: "Sojasås", portion: 5, traits: ["histamine", "allergen", "allergen_soy", "allergen_wheat", "dao_competitor"] },
      { name: "Vinegar", portion: 5, traits: ["aceticAcid", "irritant"] },
      { name: "Balsamic Vinegar", lmv: "Vinäger ättiksyra 7%", portion: 8, traits: ["aceticAcid", "irritant", "histamine"] },
      { name: "Aioli", lmv: "Aioli", portion: 20, traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_egg", "irritant", "allyl_compounds"] },
      { name: "Pesto", lmv: "Pesto hemlagad", portion: 20, traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_treenut", "allergen_milk", "fodmaps", "fructans"] },
      { name: "Tzatziki", lmv: "Tzatziki", portion: 40, traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Hummus", lmv: "Hummus kikärtsröra", portion: 50, traits: ["over_10g_fat", "bile_stimulant", "fiber", "fodmaps", "galactans"] },
      { name: "Guacamole", lmv: "Guacamole", portion: 50, traits: ["over_10g_fat", "cross_reactive", "cross_latex"] },
      { name: "Mango Chutney", lmv: "Mango chutney", portion: 20, traits: ["refined_carbs"] },
      { name: "Cranberry Sauce", portion: 25, traits: ["refined_carbs", "fructose"] },
      { name: "Fish Roe Spread", lmv: "Påläggskaviar original", portion: 20, traits: ["over_10g_fat", "bile_stimulant", "histamine", "allergen", "allergen_fish"] },
      { name: "Yeast Extract", portion: 3, traits: [] },
      { name: "Ajvar", lmv: "Ajvar relish", portion: 30, traits: ["irritant"] },
      { name: "Harissa", portion: 8, traits: ["irritant", "capsaicin"] },
      { name: "Tahini", lmv: "Tahini", portion: 15, traits: ["over_10g_fat", "bile_stimulant", "protein", "fiber", "allergen", "allergen_sesame"] },
      { name: "Baba Ganoush", portion: 50, traits: ["histamine"] },
      { name: "Preserved Lemon", portion: 8, traits: ["histamine", "aceticAcid"] },
      { name: "Sesame Oil", lmv: "Sesamolja", portion: 5, traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_sesame"] },
      { name: "Olive Oil", lmv: "Olivolja", portion: 10, traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Sunflower Oil", lmv: "Solrosolja", portion: 10, traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Rapeseed Oil", lmv: "Rapsolja", portion: 10, traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Coconut Oil", lmv: "Kokosolja", portion: 10, traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Ghee", lmv: "Klarnat smör ghee", portion: 10, traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Tamarind", portion: 10, traits: ["aceticAcid"] },
      // Honey is high FODMAP at a normal tablespoon — excess fructose is the
      // main driver, with fructans secondary. Not a "safe" pantry staple.
      { name: "Honey", lmv: "Honung", portion: 15, traits: ["fodmaps", "fructose", "fructans"] },
      { name: "White Sugar", lmv: "Socker", portion: 8, traits: ["refined_carbs"] },
      { name: "Maple Syrup", portion: 20, traits: ["refined_carbs"] },
      { name: "Salt", lmv: "Salt m. jod", portion: 1, traits: [] },
      { name: "Garlic-infused Oil", portion: 10, traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Peanut Butter", lmv: "Jordnötssmör", portion: 20, traits: ["fiber", "over_10g_fat", "bile_stimulant", "protein", "fodmaps", "galactans", "allergen", "allergen_peanut", "cross_reactive", "cross_grass"] },
      { name: "Agave Syrup", portion: 15, traits: ["fodmaps", "fructose", "refined_carbs"] },
      { name: "Erythritol Sweetener", portion: 5, traits: ["fodmaps", "polyols"] },
      { name: "Nutritional Yeast", lmv: "Näringsjäst", portion: 5, traits: [] }
    ]
  },
  {
    id: "sauces",
    label: "Sauces",
    foods: [
      { name: "Ketchup", lmv: "Ketchup", portion: 20, traits: ["aceticAcid", "irritant", "dao_competitor"] },
      { name: "Mayonnaise", lmv: "Majonnäs fett 80%", portion: 15, traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_egg"] },
      { name: "Barbecue Sauce", portion: 20, traits: ["aceticAcid", "irritant", "refined_carbs"] },
      { name: "Hot Sauce", portion: 3, traits: ["histamine", "irritant", "capsaicin"] },
      { name: "Worcestershire Sauce", portion: 5, traits: ["histamine", "allergen", "allergen_fish"] },
      { name: "Horseradish Sauce", portion: 15, traits: ["irritant", "over_10g_fat"] },
      { name: "Tartar Sauce", portion: 20, traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_egg"] },
      { name: "Salsa", lmv: "Tomatsalsa kall", portion: 30, traits: ["irritant"] },
      { name: "Ranch Dressing", lmv: "Dressing konserv. fett ca 25%", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_milk", "allergen_egg"] },
      { name: "Thousand Island Dressing", lmv: "Dressing konserv. fett ca 25%", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_egg"] },
      { name: "Teriyaki Sauce", portion: 15, traits: ["histamine", "allergen", "allergen_soy", "allergen_wheat", "refined_carbs"] },
      { name: "Fish Sauce", lmv: "Fisksås", portion: 5, traits: ["histamine", "allergen", "allergen_fish"] },
      { name: "Oyster Sauce", portion: 10, traits: ["histamine", "allergen", "allergen_shellfish"] },
      { name: "Hoisin Sauce", portion: 15, traits: ["histamine", "allergen", "allergen_soy", "allergen_wheat", "refined_carbs"] },
      { name: "Brown Gravy", portion: 60, traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_wheat"] },
      { name: "Béarnaise Sauce", lmv: "Bearnaisesås hemlagad", portion: 40, traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_egg", "allergen_milk"] },
      { name: "Hollandaise Sauce", lmv: "Hollandaisesås hemlagad", portion: 40, traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_egg", "allergen_milk"] },
      { name: "Remoulade", lmv: "Remouladsås", portion: 20, traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_egg", "irritant"] },
      { name: "Tomato Pasta Sauce", lmv: "Pastasås m. tomat örtkryddor", portion: 100, traits: ["fodmaps", "fructans", "refined_carbs"] },
      { name: "Bechamel Sauce", lmv: "Béchamelsås", portion: 60, traits: ["over_3g_lactose", "fodmaps", "allergen", "allergen_milk", "allergen_wheat"] },
      { name: "Satay / Peanut Sauce", lmv: "Jordnötssås", portion: 30, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "fructans", "refined_carbs", "allergen", "allergen_peanut"] },
      { name: "Vegan Mayonnaise", portion: 15, traits: ["over_10g_fat", "bile_stimulant"] }
    ]
  },
  {
    id: "mushrooms",
    label: "Mushrooms",
    foods: [
      { name: "Shiitake Mushrooms", lmv: "Shiitakesvamp", portion: 60, traits: ["fodmaps", "polyols", "dao_competitor"] },
      { name: "Oyster Mushrooms", lmv: "Ostronskivling", portion: 60, traits: ["dao_competitor"] },
      { name: "White Button Mushrooms", lmv: "Champinjon", portion: 75, traits: ["fodmaps", "polyols", "dao_competitor"] },
      { name: "Portobello Mushrooms", lmv: "Champinjon", portion: 75, traits: ["fodmaps", "polyols", "dao_competitor"] },
      { name: "Cremini Mushrooms", lmv: "Champinjon", portion: 75, traits: ["fodmaps", "polyols", "dao_competitor"] },
      { name: "Enoki Mushrooms", portion: 50, traits: ["fodmaps", "polyols", "dao_competitor"] },
      { name: "Chanterelle Mushrooms", lmv: "Kantarell gul rå", portion: 60, traits: ["fodmaps", "polyols", "dao_competitor"] },
      { name: "Porcini Mushrooms", portion: 30, traits: ["fodmaps", "polyols", "dao_competitor"] },
      { name: "Morel Mushrooms", portion: 20, traits: ["fodmaps", "polyols", "dao_competitor"] },
      { name: "King Oyster Mushrooms", lmv: "Ostronskivling", portion: 60, traits: ["dao_competitor"] },
      { name: "Truffle", portion: 2, traits: ["fodmaps", "polyols", "dao_competitor"] },
      { name: "Maitake Mushrooms", portion: 60, traits: ["fodmaps", "polyols", "dao_competitor"] },
      { name: "Lion's Mane Mushrooms", portion: 60, traits: ["fodmaps", "polyols", "dao_competitor"] },
      { name: "Trumpet Chanterelle", portion: 50, traits: ["fodmaps", "polyols", "dao_competitor"] }
    ]
  },
  {
    id: "snacksSweets",
    label: "Snacks & Sweets",
    foods: [
      { name: "Potato chips", lmv: "Chips potatis naturell", portion: 30, traits: ["over_10g_fat", "bile_stimulant"] },
      // No generic entry exists. The database has 13 chocolate-coated bars
      // described by their filling; this is the nougat/caramel/peanut one.
      { name: "Candy bars", lmv: "Mjuk nougat m. kolasås jordnötter mjölkchokladöverdrag", lmvNote: "one representative bar, not a generic entry", portion: 50, traits: ["over_10g_fat", "bile_stimulant", "refined_carbs", "over_3g_lactose", "allergen", "allergen_milk"] },
      { name: "Milk chocolate", lmv: "Mjölkchoklad", portion: 30, traits: ["over_10g_fat", "bile_stimulant", "refined_carbs", "over_3g_lactose", "fodmaps", "caffeine", "allergen", "allergen_milk"] },
      // Livsmedelsverket lists 0g fiber, which is a gap in the source rather
      // than a real zero — 70% chocolate is around 11g. Tag kept.
      { name: "Dark Chocolate", lmv: "Mörk choklad kakao ≥ 70%", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "refined_carbs", "fiber", "caffeine"] },
      { name: "Cheese Puffs / Snacks", lmv: "Ostbågar", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_milk"] },
      { name: "Granola Bar", lmv: "Bar müslibar m. choklad berikad", portion: 35, traits: ["refined_carbs", "allergen", "allergen_treenut"] },
      { name: "Protein Bar", portion: 55, traits: ["protein", "refined_carbs", "allergen", "allergen_milk"] },
      { name: "Microwave Popcorn", lmv: "Popcorn mikropopcorn poppade fett ca 22%", portion: 25, traits: ["over_10g_fat", "fiber"] },
      { name: "Sugary Breakfast Cereal", lmv: "Frukostflingor majs m. socker", portion: 40, traits: ["refined_carbs", "allergen", "allergen_wheat"] },
      { name: "Sugary soft drinks", lmv: "Läsk", portion: 330, traits: ["refined_carbs", "carbonation", "irritant"] },
      { name: "Cola", lmv: "Läsk cola", portion: 330, traits: ["caffeine", "refined_carbs", "carbonation", "irritant"] },
      { name: "Ice Cream", lmv: "Glass fett ca 10%", portion: 100, traits: ["refined_carbs", "over_3g_lactose", "fodmaps", "allergen", "allergen_milk"] },
      { name: "Halva", portion: 30, traits: ["over_10g_fat", "bile_stimulant", "allergen", "allergen_sesame", "refined_carbs"] },
      { name: "Baklava", lmv: "Baklava ", portion: 40, traits: ["over_10g_fat", "bile_stimulant", "refined_carbs", "allergen", "allergen_treenut", "allergen_wheat"] },
      { name: "Sugar-free Chewing Gum", lmv: "Tuggummi sockerfritt", portion: 3, traits: ["fodmaps", "polyols"] },
      { name: "Cinnamon Bun", lmv: "Sött vetebröd kanelbulle gräddad kylvara frysvara el. butiksbakad", portion: 80, traits: ["over_10g_fat", "refined_carbs", "fodmaps", "fructans", "allergen", "allergen_milk", "allergen_wheat"] },
      { name: "Marzipan", lmv: "Mandelmassa", portion: 30, traits: ["fiber", "over_10g_fat", "bile_stimulant", "refined_carbs", "fodmaps", "galactans", "allergen", "allergen_treenut"] },
      { name: "Liquorice", lmv: "Lakritsgodis", portion: 30, traits: ["refined_carbs"] },
      { name: "Salty Liquorice", portion: 25, traits: ["refined_carbs"] }
    ]
  },
  {
    id: "picklesFerments",
    label: "Pickles & Ferments",
    foods: [
      { name: "Kimchi", portion: 50, traits: ["histamine", "fodmaps", "fructans", "irritant"] },
      { name: "Sauerkraut", lmv: "Surkål konserv. m. lag", portion: 60, traits: ["histamine", "dao_competitor"] },
      { name: "Pickled Cucumber", lmv: "Gurka inlagd", portion: 25, traits: ["histamine", "aceticAcid", "irritant"] },
      { name: "Pickle Relish", portion: 20, traits: ["histamine", "aceticAcid", "irritant"] },
      { name: "Olives", lmv: "Oliver gröna m. paprikafyllning avrunna", portion: 25, traits: ["over_10g_fat", "histamine"] },
      { name: "Miso Paste", lmv: "Miso sojabönspasta fermenterad", portion: 15, traits: ["over_10g_fat", "fiber", "histamine", "allergen", "allergen_soy", "fodmaps", "dao_competitor"] },
      { name: "Pickled Beetroot", lmv: "Rödbeta inlagd u. lag", portion: 40, traits: ["fodmaps", "fructans", "irritant", "aceticAcid", "refined_carbs", "salicylate"] },
      { name: "Pickled Onion", lmv: "Syltlök inlagd", portion: 20, traits: ["fodmaps", "fructans", "irritant", "aceticAcid", "allyl_compounds"] },
      { name: "Pickled Jalapeno", portion: 15, traits: ["irritant", "capsaicin", "aceticAcid"] },
      { name: "Pickled Ginger", portion: 12, traits: ["irritant", "aceticAcid", "refined_carbs"] },
      { name: "Salt-brined Pickles", lmv: "Saltgurka u. lag", portion: 30, traits: ["histamine", "dao_competitor"] },
      { name: "Capers", portion: 5, traits: ["histamine", "irritant", "aceticAcid"] },
      { name: "Natto", portion: 40, traits: ["histamine", "dao_competitor", "fodmaps", "galactans", "allergen", "allergen_soy"] },
      { name: "Kvass", portion: 250, traits: ["histamine", "carbonation", "irritant", "refined_carbs"] }
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
    categories: ["ultraProcessed", "plantBased", "snacksSweets", "beverages"]
  }
];
