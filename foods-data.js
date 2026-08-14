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
     Allergens are deliberately NOT tiered: there is no broad allergen trait,
     only the EU's 14 declarable ones plus onion and mushroom. An umbrella took
     a top slot in the ranking without adding anything the specific tags did
     not already say.
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
   WHICH FORM OF THE FOOD IS THIS?
   ---------------------------------------------------------------------
   Most faults found in this data have had the same shape underneath: the
   figures describe one state of a food and the portion describes another.
   Dried basil is not fresh basil at a tenth the weight. Cooked rice is not
   rice. So a food can say which state it is in, and the water figure then
   settles it rather than being read by eye:

     form: "fresh"    as picked, and wet — herbs, produce
     form: "dried"    the dried version of something that also comes fresh
     form: "dry"      a dry pantry staple, eaten cooked or as an ingredient
     form: "cooked"   made up with water and heat, as eaten

   Optional: an apple has one state and needs no field. Where it is given,
   check-data.js holds the water to it — "fresh" under 60g per 100g is a
   contradiction, "cooked" under 45g likewise.

   Add `bothWays: true` where a shopper actually has a choice on the shelf,
   and the name must then say which one the row is: Basil (fresh), Turmeric
   (dried). Nutmeg and curry powder are dried and nothing else, so they carry
   the form without the suffix — the point is helping someone pick up the
   right jar, not decorating every name.

   ---------------------------------------------------------------------
   FOODS SOLD DRY AND EATEN MADE UP
   ---------------------------------------------------------------------
   Soup powder, custard powder, a drink mix, dried infant cereal. The food
   table lists the powder; this database gives the food the portion of the
   bowl. Taking one against the other is wrong by the whole dilution — rosehip
   soup powder against a 200g bowl came out at 142g of sugar a serving, which
   is also what earned it a fiber tag it should never have had.

   Where the recipe is fixed and short — dry mix plus a stated amount of water
   — say so, and the nutrition builder does the arithmetic:

     madeUp: { parts: 1, water: 8 }    // 1 part powder to 8 of water

   Only for a mix made up with water. A porridge or a hot chocolate that the
   food table already lists cooked needs nothing: check the source entry
   first. `check-data.js` fails a food with a portion of 100g or more and
   under 30g of water per 100g, which is what this field is for.

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

   Portions come from the food group, not from the food: every fruit is 100g,
   every berry 50g, every cut of meat, fish and poultry 125g, potato and cooked
   grains 175g, roots 80g, nuts 25g, cheese 20g, a slice of bread 40g.
   Seventeen sizes cover all of them. Departures from a group are deliberate —
   half an avocado, one egg, a wine glass rather than a tumbler.

   The boundaries then sit in the gaps of that distribution. Sizes cluster on
   household measures (5, 20, 25, 30, 50, 80, 100, 125, 175, 200g), so a
   boundary on one of those would split foods that are the same size. Each cut
   is at the widest point of its gap: no food is within 11% of any of them.

   Six bands rather than four, because the thresholds are scored at the median
   portion of the band and those medians should climb evenly. They now run
   5, 15, 25, 50, 100, 175g — each step under a doubling of the last.

   Band 1 — a portion of 7g or less — is exempt from the fat, protein and fiber
   thresholds. Not by assertion: at a 5g portion, reaching the 7.5g fat dose
   would take 150g of fat per 100g of food. No food can. */
const PORTION_BANDS = [
  { band: 1, label: "Up to 7g",  max: 7,    portion: 5,   example: "spices, salt, soy sauce, a knob of horseradish" },
  { band: 2, label: "7\u201317g",    max: 17,   portion: 15,  example: "oil, butter, a spoonful of seeds" },
  { band: 3, label: "17\u201335g",   max: 35,   portion: 25,  example: "a slice of cheese, a handful of nuts, dried fruit" },
  { band: 4, label: "35\u201369g",   max: 69,   portion: 50,  example: "a slice of bread, a bowl of berries, an egg, a pita" },
  { band: 5, label: "69\u2013112g",  max: 112,  portion: 100, example: "fruit, vegetables, mushrooms, a sausage" },
  { band: 6, label: "Over 112g", max: null, portion: 175, example: "meat, fish, cooked grains, a glass of milk" }
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
    dose: true,   // scales with how much is eaten — see meal.js
    order: 1,
    label: "Fat",
    articleId: "fat",
    evidence: {
      level: "Well established",
      detail: "Fat measurably slows gastric emptying and lowers the pressure of the lower esophageal sphincter. Symptom provocation is best documented in reflux and functional dyspepsia."
    },
    analysis: [
      "A normal portion of these foods carries at least 6g of fat, which can worsen symptoms in GERD, IBS, gallbladder disease, and pancreatic insufficiency (EPI).",
      "See the Fat article for warning signs of malabsorption and who is most affected."
    ]
  },
  bile_stimulant: {
    dose: true,   // scales with how much is eaten — see meal.js
    order: 8,
    label: "Bile stimulant",
    filter: true,
    articleId: "bile_stimulant",
    evidence: {
      level: "Limited",
      detail: "The CCK response to fat and protein is well measured, but the step from there to symptoms is inferred rather than trialled. The 9.5 g dose, and the fifth of its weight that protein counts for, are ours rather than published figures."
    },
    analysis: [
      "These foods strongly stimulate bile release via CCK, mainly through fat and protein content. Most relevant for gallstones or a history of gallbladder attacks.",
      "See the Bile Stimulants article for clinical detail."
    ]
  },
  fiber: {
    dose: true,   // scales with how much is eaten — see meal.js
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
    dose: true,   // scales with how much is eaten — see meal.js
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
    dose: true,   // scales with how much is eaten — see meal.js
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
    dose: true,   // scales with how much is eaten — see meal.js
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
    dose: true,   // scales with how much is eaten — see meal.js
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

  /* ---- Allergens: the EU's declarable ones, minus lupin, plus two that are
     not declarable but turn up in practice — onion/garlic and mushroom.
     Lupin is left out because it barely reaches a Swedish plate, and this
     database is Swedish first. Sulphites are declarable under the same rule
     but are not a protein, so they live with the other digestive factors.

     There is no broad "allergen" trait. With every allergen present in its own
     right, an umbrella only took a top slot in the ranking without saying
     anything the specific tags did not. ---- */
  allergen_milk: {
    group: "Allergens",
    order: 1,
    label: "Milk",
    filter: true,
    articleId: "allergen",
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
    articleId: "allergen",
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
    label: "Gluten cereals",
    filter: true,
    articleId: "allergen",
    evidence: {
      level: "Well established",
      detail: "Well-characterised allergen proteins with standardised testing, distinct from celiac disease and from gluten sensitivity."
    },
    analysis: [
      "The EU declares wheat, rye, barley, oats, spelt and kamut as one group. Wheat allergy is an immune reaction to wheat proteins — distinct from celiac disease and from non-celiac gluten sensitivity, which are not classic IgE-mediated allergies."
    ]
  },
  allergen_fish: {
    group: "Allergens",
    order: 4,
    label: "Fish",
    filter: true,
    articleId: "allergen",
    evidence: {
      level: "Well established",
      detail: "Parvalbumin is well characterised, and component testing separates fish from shellfish allergy."
    },
    analysis: [
      "Fish allergy is mediated mainly by parvalbumin, a muscle protein — a different allergen than shellfish tropomyosin, so an allergy to one doesn't necessarily mean an allergy to the other."
    ]
  },
  allergen_crustacean: {
    group: "Allergens",
    order: 5,
    label: "Crustaceans",
    filter: true,
    articleId: "allergen",
    evidence: {
      level: "Well established",
      detail: "Tropomyosin is well characterised and testable."
    },
    analysis: [
      "Shrimp, crab, lobster and crayfish. The allergen is tropomyosin, which is why a reaction to one crustacean usually means a reaction to the others.",
      "Molluscs carry a related but distinct tropomyosin and are declared separately in the EU — many people react to one group and not the other."
    ]
  },
  allergen_mollusc: {
    group: "Allergens",
    order: 6,
    label: "Molluscs",
    filter: true,
    articleId: "allergen",
    evidence: {
      level: "Well established",
      detail: "A declarable allergen in its own right, with tropomyosin again the main protein."
    },
    analysis: [
      "Mussels, oysters, squid and snails. The tropomyosin here differs enough from the crustacean version that the two are declared separately and often tolerated separately."
    ]
  },
  allergen_peanut: {
    group: "Allergens",
    order: 7,
    label: "Peanut",
    filter: true,
    articleId: "allergen",
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
    order: 8,
    label: "Tree nut",
    filter: true,
    articleId: "allergen",
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
    order: 9,
    label: "Soy",
    filter: true,
    articleId: "allergen",
    evidence: {
      level: "Well established",
      detail: "Well characterised, though soy allergy is diagnosed less consistently than the others."
    },
    analysis: [
      "Soy allergy is mediated by several soy proteins and can occasionally cross-react with peanut, since both are legumes."
    ]
  },
  allergen_sesame: {
    group: "Allergens",
    order: 10,
    label: "Sesame",
    filter: true,
    articleId: "allergen",
    evidence: {
      level: "Well established",
      detail: "A recognised major allergen with standardised testing. The labelling requirement is newer than the evidence behind it."
    },
    analysis: [
      "Sesame can cause severe reactions and hides easily — in tahini, in bread toppings, and in oils that are not always declared on a menu."
    ]
  },
  allergen_celery: {
    group: "Allergens",
    order: 11,
    label: "Celery",
    filter: true,
    articleId: "allergen",
    evidence: {
      level: "Well established",
      detail: "Declarable in the EU and rarely so elsewhere. Component testing exists (Api g 1), and the birch link is well documented."
    },
    analysis: [
      "Celery and celeriac are declarable allergens in the EU but not in the US, which is why they are missed more often than their prevalence warrants.",
      "Much of it runs through birch pollen: Api g 1 belongs to the same PR-10 family as the birch allergen, so celery reactions often appear in people who already react to apple and hazelnut. Unlike most PR-10 reactions, celery can also react when cooked."
    ]
  },
  allergen_mustard: {
    group: "Allergens",
    order: 12,
    label: "Mustard",
    filter: true,
    articleId: "allergen",
    evidence: {
      level: "Well established",
      detail: "Declarable in the EU, with characterised seed proteins. Prevalence is low but reactions can be severe."
    },
    analysis: [
      "Mustard is a declarable allergen in the EU. Reactions are uncommon but can be severe, and mustard turns up unannounced in dressings, remoulade, sausage and spice blends."
    ]
  },
  /* Declarable under the same EU rule as the allergens, but a preservative
     rather than a protein, so it is filed with the other digestive factors
     and keeps the allergens article for its write-up. */
  allergen_sulphite: {
    order: 20,
    label: "Sulphites",
    filter: true,
    articleId: "allergen",
    evidence: {
      level: "Limited",
      detail: "Declarable above 10 mg/kg, and the asthma link is documented. Outside asthma the picture is thinner, and the mechanism is not IgE."
    },
    analysis: [
      "Sulphites are declarable above 10 mg/kg. They are preservatives rather than proteins, so the reaction is not a true allergy — the best documented one is bronchoconstriction in people with asthma.",
      "Wine, dried fruit that has kept its colour, and some pickled products are the usual sources."
    ]
  },
  allergen_onion: {
    group: "Allergens",
    order: 13,
    label: "Onion & garlic",
    filter: true,
    articleId: "allergen",
    evidence: {
      level: "Limited",
      detail: "Case reports and skin-prick data, no population studies. The overlap with fructan intolerance makes it hard to separate the two."
    },
    analysis: [
      "Allium allergy — onion, garlic, leek, shallot — is not declarable anywhere, so nothing on a label warns about it.",
      "It is easily confused with the fructan intolerance these foods also cause, and the two need different answers: fructans are dose-dependent and cooking does not help, while an allergy is not. If onion and garlic keep appearing, check whether the reaction is immediate and oral, or delayed and abdominal."
    ]
  },
  allergen_mushroom: {
    group: "Allergens",
    order: 14,
    label: "Mushroom",
    filter: true,
    articleId: "allergen",
    evidence: {
      level: "Limited",
      detail: "Documented in case series and occupational studies, mostly as inhalant sensitisation to spores. Food reactions are reported but rarely confirmed by challenge."
    },
    analysis: [
      "Mushroom allergy is not declarable, and most of what is documented concerns spore inhalation rather than eating them.",
      "Mycoprotein products such as Quorn belong here too: they are made from a fungus, and reactions have been reported in people with no other food allergy."
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
  cross_mugwort: {
    group: "Cross-reactivity",
    order: 4,
    label: "Mugwort pollen",
    filter: true,
    evidence: {
      level: "Well established",
      detail: "The celery-mugwort-spice syndrome is well documented in Europe, with component testing (Art v 1, Art v 3). The umbellifer and spice end is solid; the fruits reported alongside it are thinner."
    },
    analysis: [
      "Relevant for people with a mugwort pollen allergy — common in Sweden and often missed, because mugwort flowers late and gets blamed on the tail of the grass season.",
      "The classic pattern is celery, carrot and the umbellifer spices, together with the composites that share mugwort's own plant family: chamomile, sunflower seed, lettuce and artichoke. Spices are the part that catches people out, since a teaspoon in a dressing is enough and nothing on the menu names it.",
      "Unlike most birch reactions, celery here can still react when cooked."
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
    noun: "irritant",
    broad: "irritant",
    group: "GI Irritants"
  },
  {
    title: "FODMAPs",
    noun: "FODMAP",
    broad: "fodmaps",
    group: "FODMAPs"
  },
  {
    title: "Other Digestive Factors",
    items: ["fiber", "histamine", "dao_competitor", "salicylate", "bile_stimulant", "refined_carbs", "allergen_sulphite"]
  },
  {
    title: "Allergens",
    noun: "allergen",
    group: "Allergens",
    wide: true
  },
  {
    title: "Cross-Reactivity & Delayed Allergy",
    noun: "cross-reaction",
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
      { name: "Carrot", lmv: "Morot", portion: 80, traits: ["cross_reactive", "cross_birch", "cross_mugwort"] },
      { name: "Celeriac Root", lmv: "Rotselleri", portion: 80, traits: ["cross_reactive", "cross_birch", "allergen_celery", "cross_mugwort"] },
      { name: "Jerusalem Artichoke", lmv: "Jordärtskocka", portion: 80, traits: ["fodmaps", "fructans", "cross_reactive", "cross_mugwort"] },
      { name: "Parsnip", lmv: "Palsternacka", portion: 80, traits: ["cross_reactive", "cross_mugwort"] },
      { name: "Potato", lmv: "Potatis rå", portion: 175, traits: ["cross_reactive", "cross_birch", "cross_grass"] },
      { name: "Swede", lmv: "Kålrot", portion: 80, traits: [] },
      { name: "Sweet Potato", lmv: "Sötpotatis rå", portion: 175, traits: ["fiber", "salicylate"] },
      { name: "Radish", lmv: "Rädisa", portion: 30, traits: ["irritant"] },
      { name: "Turnip", lmv: "Majrova", portion: 80, traits: [] },
      { name: "Horseradish", lmv: "Pepparrot", portion: 5, traits: ["irritant"] },
      { name: "Black Salsify", lmv: "Svartrot", portion: 80, traits: ["fodmaps", "fructans"] },
      { name: "Kohlrabi", lmv: "Kålrabbi", portion: 80, traits: ["fodmaps", "fructans"] },
      { name: "Cassava", portion: 175, traits: [] },
      { name: "Yam", lmv: "Jams kokt u. salt", portion: 175, traits: [] },
      { name: "Taro", portion: 175, traits: ["fodmaps", "fructans", "fiber"] },
      { name: "Lotus Root", portion: 80, traits: [] }
    ]
  },
  {
    id: "veggies",
    label: "Vegetables",
    foods: [
      { name: "Cabbage", lmv: "Vitkål", portion: 100, traits: ["fodmaps", "fructans"] },
      { name: "Kale", lmv: "Grönkål", portion: 100, traits: [] },
      { name: "Onion", lmv: "Lök gul", portion: 60, traits: ["fodmaps", "fructans", "irritant", "allyl_compounds", "allergen_onion"] },
      { name: "Tomato", form: "fresh", lmv: "Tomat", portion: 100, traits: ["histamine", "irritant", "cross_reactive", "cross_grass", "cross_latex", "dao_competitor"] },
      // Named dried but carries no `form`: the only entry is the oil-packed
      // jar, which is rehydrated and half water, so "dried" would be false.
      { name: "Sun-dried Tomato", lmv: "Tomat torkad m. olja", lmvNote: "the oil-packed jar, which is what is usually sold — rehydrated and drained of its oil, so it is neither dry nor fresh; dry-packed carries less water and much less fat", portion: 15, traits: ["histamine", "irritant", "cross_reactive", "cross_grass", "cross_latex", "dao_competitor"] },
      { name: "Cauliflower", lmv: "Blomkål", portion: 100, traits: ["fodmaps", "fructans"] },
      { name: "Aubergine", lmv: "Aubergine", portion: 100, traits: ["histamine", "fodmaps", "fructans", "dao_competitor"] },
      { name: "Parsley", form: "fresh", lmv: "Persilja blad", portion: 5, traits: ["cross_reactive", "cross_mugwort"] },
      { name: "Leek", lmv: "Purjolök", portion: 60, traits: ["fodmaps", "fructans", "allergen_onion"] },
      { name: "Spinach", lmv: "Spenat frysvara", portion: 100, traits: ["histamine"] },
      { name: "Avocado", lmv: "Avokado", portion: 50, traits: ["over_10g_fat", "bile_stimulant", "cross_reactive", "cross_latex", "fodmaps", "polyols", "salicylate"] },
      { name: "Cucumber", lmv: "Gurka", portion: 100, traits: ["irritant", "peel_skin"] },
      { name: "Bell Pepper (sweet)", lmv: "Paprika röd", portion: 100, traits: ["irritant"] },
      { name: "Bell Pepper (hot)", lmv: "Chilipeppar färsk", portion: 5, traits: ["irritant", "capsaicin"] },
      // Monash measures excess fructose here, not fructans — checked in the app.
      { name: "Asparagus", lmv: "Sparris grön kokt m. salt", portion: 100, traits: ["fodmaps", "fructose"] },
      { name: "Fennel Bulb", lmv: "Fänkål", portion: 100, traits: ["fodmaps", "fructans", "cross_reactive", "cross_mugwort"] },
      { name: "Broccoli", lmv: "Broccoli", portion: 100, traits: ["fodmaps", "fructans"] },
      { name: "Brussels Sprouts", lmv: "Brysselkål", portion: 100, traits: ["fodmaps", "fructans", "galactans"] },
      { name: "Green Beans", lmv: "Gröna bönor", portion: 100, traits: ["salicylate"] },
      { name: "Zucchini", lmv: "Squash", portion: 100, traits: [] },
      { name: "Pumpkin", lmv: "Pumpa", portion: 100, traits: ["dao_competitor"] },
      { name: "Swiss Chard", lmv: "Mangold", portion: 100, traits: [] },
      { name: "Romaine Lettuce", lmv: "Romansallat", portion: 100, traits: ["cross_reactive", "cross_mugwort"] },
      { name: "Rocket", lmv: "Ruccolasallat", portion: 20, traits: ["irritant"] },
      { name: "Celery", lmv: "Stjälkselleri", portion: 100, traits: ["fodmaps", "polyols", "cross_reactive", "cross_birch", "allergen_celery", "cross_mugwort"] },
      { name: "Bok Choy", lmv: "Sellerikål pak choi", portion: 100, traits: [] },
      { name: "Daikon Radish", lmv: "Rättika", portion: 80, traits: ["irritant"] },
      { name: "Rhubarb", lmv: "Rabarber tillagad u. socker", portion: 100, traits: [] },
      { name: "Sweetcorn", lmv: "Majskorn frysvara", portion: 100, traits: ["fodmaps", "polyols", "fructans", "salicylate"] },
      { name: "Shallot", lmv: "Lök gul", lmvNote: "yellow onion — shallot is not listed", portion: 5, traits: ["fodmaps", "fructans", "irritant", "allyl_compounds", "allergen_onion"] },
      { name: "Spring Onion", portion: 5, traits: ["fodmaps", "fructans", "irritant", "allyl_compounds", "allergen_onion"] },
      { name: "Globe Artichoke", lmv: "Kronärtskocka kokt", portion: 100, traits: ["fodmaps", "fructans", "cross_reactive", "cross_mugwort"] },
      { name: "Okra", lmv: "Okra kokt u. salt", portion: 100, traits: ["fodmaps", "fructans"] }
    ]
  },
  {
    id: "fruits",
    label: "Fruits",
    foods: [
      { name: "Apples", lmv: "Äpple m. skal", portion: 100, traits: ["fodmaps", "fructose", "polyols", "irritant", "peel_skin", "cross_reactive", "cross_birch", "salicylate"] },
      { name: "Oranges", lmv: "Apelsin", portion: 100, traits: ["cross_reactive", "cross_grass", "dao_competitor"] },
      { name: "Pears", lmv: "Päron", portion: 100, traits: ["fodmaps", "fructose", "polyols", "irritant", "peel_skin", "cross_reactive", "cross_birch", "salicylate"] },
      { name: "Mangos", lmv: "Mango", portion: 100, traits: ["fodmaps", "fructose", "cross_reactive", "cross_mugwort"] },
      { name: "Lemon", lmv: "Citron", portion: 5, traits: ["dao_competitor"] },
      { name: "Lime", lmv: "Lime", portion: 5, traits: ["dao_competitor"] },
      { name: "Grapefruit", lmv: "Grapefrukt", portion: 100, traits: ["dao_competitor"] },
      { name: "Grapes", lmv: "Vindruvor", portion: 100, traits: ["salicylate"] },
      { name: "Banana", lmv: "Banan", portion: 100, traits: ["cross_reactive", "cross_latex", "dao_competitor"] },
      { name: "Kiwi", lmv: "Kiwi grön", portion: 100, traits: ["salicylate", "cross_reactive", "cross_birch", "cross_grass", "cross_latex"] },
      { name: "Pineapple", lmv: "Ananas", portion: 100, traits: ["cross_reactive", "cross_latex"] },
      { name: "Papaya", lmv: "Papaya", portion: 100, traits: ["cross_reactive", "cross_latex"] },
      { name: "Watermelon", lmv: "Vattenmelon", portion: 100, traits: ["fodmaps", "fructose", "cross_reactive", "cross_grass", "salicylate"] },
      { name: "Melon", lmv: "Nätmelon", portion: 100, traits: ["cross_reactive", "cross_grass"] },
      { name: "Apricot", lmv: "Aprikos", portion: 100, traits: ["cross_reactive", "cross_birch", "fodmaps", "polyols"] },
      { name: "Plum", lmv: "Plommon", portion: 100, traits: ["cross_reactive", "cross_birch", "fodmaps", "polyols"] },
      { name: "Figs", lmv: "Fikon", portion: 100, traits: ["fodmaps", "fructose"] },
      { name: "Pomegranate", lmv: "Granatäpple", portion: 100, traits: ["salicylate"] },
      { name: "Lychee", lmv: "Litchi", portion: 100, traits: ["fructose", "fodmaps", "polyols", "cross_reactive", "cross_mugwort"] },
      { name: "Star Fruit", lmv: "Carambole stjärnfrukt", portion: 100, traits: [] },
      { name: "Durian", portion: 100, traits: ["fodmaps", "fructose"] },
      { name: "Peach", lmv: "Persika", portion: 100, traits: ["fodmaps", "polyols", "cross_reactive", "cross_birch"] },
      { name: "Nectarine", lmv: "Nektarin", portion: 100, traits: ["fodmaps", "polyols", "cross_reactive", "cross_birch", "salicylate"] },
      { name: "Passion Fruit", lmv: "Passionsfrukt", portion: 5, traits: [] },
      // Monash: low FODMAP up to 64g, moderate fructans above that — a whole
      // persimmon is ~170g, so a normal serving is over the line.
      { name: "Persimmon", lmv: "Sharon", portion: 100, traits: ["fodmaps", "fructans", "salicylate"] },
      /* Fruit canned in syrup. Frida analyses very little fruit dried but a
         good deal of it in syrup, which is also what a Swedish shop stocks —
         so this row exists where the dried one could not be sourced. Each is
         its fresh fruit's traits plus refined_carbs for the syrup, which is
         how Canned Peaches was already built. Pear loses peel_skin: canned
         pears are peeled. */
      { name: "Canned Peaches in Syrup", lmv: "Persika konserv. m. sockerlag", portion: 100, traits: ["fodmaps", "polyols", "refined_carbs", "cross_reactive", "cross_birch"] },
      // No `irritant`: the fresh pear carries the umbrella for its peel and
      // nothing else, and a canned pear is peeled. Dropping peel_skin without
      // it left the umbrella standing on a mechanism that had been removed —
      // and made this the one canned fruit tagged an irritant.
      { name: "Canned Pears in Syrup", lmv: "Päron konserv. m. sockerlag", portion: 100, traits: ["fodmaps", "fructose", "polyols", "refined_carbs", "cross_reactive", "cross_birch", "salicylate"] },
      { name: "Canned Pineapple in Syrup", lmv: "Ananas konserv. m. sockerlag", portion: 100, traits: ["refined_carbs", "cross_reactive", "cross_latex"] },
      { name: "Canned Apricots in Syrup", lmv: "Aprikos konserv. m. sockerlag", portion: 100, traits: ["fodmaps", "polyols", "refined_carbs", "cross_reactive", "cross_birch"] },
      { name: "Canned Cherries in Syrup", lmv: "Körsbär surkörsbär konserv. m. sockerlag", lmvNote: "sour cherries — the only canned cherry listed, where fresh Cherries above is the sweet kind", portion: 100, traits: ["fodmaps", "polyols", "fructose", "refined_carbs", "cross_reactive", "cross_birch"] },
      { name: "Canned Strawberries in Syrup", portion: 100, traits: ["refined_carbs", "salicylate"] }
    ]
  },
  {
    id: "berries",
    label: "Berries",
    foods: [
      { name: "Blueberry", lmv: "Blåbär", portion: 50, traits: [] },
      { name: "Strawberry", lmv: "Jordgubbar", portion: 50, traits: ["salicylate"] },
      { name: "Cherries", lmv: "Sötkörsbär", portion: 50, traits: ["fodmaps", "polyols", "fructose", "cross_reactive", "cross_birch"] },
      { name: "Blackberries", lmv: "Björnbär", portion: 50, traits: ["fodmaps", "polyols"] },
      { name: "Raspberries", lmv: "Hallon", portion: 50, traits: [] },
      { name: "Cloudberries", lmv: "Hjortron", portion: 50, traits: [] },
      { name: "Lingonberry", lmv: "Lingon", portion: 50, traits: [] },
      { name: "Redcurrant", lmv: "Vinbär röda", portion: 50, traits: [] },
      { name: "Blackcurrant", lmv: "Vinbär svarta", portion: 50, traits: [] },
      { name: "Gooseberry", lmv: "Krusbär", portion: 50, traits: [] },
      { name: "Elderberry", lmv: "Fläderbär", portion: 50, traits: [] },
      { name: "Cranberry", lmv: "Tranbär", portion: 50, traits: [] },
      { name: "Sea Buckthorn", lmv: "Havtorn", portion: 50, traits: [] },
      { name: "Aronia", lmv: "Aronia svart", portion: 50, traits: ["fodmaps", "polyols"] },
      { name: "Mulberry", lmv: "Mullbär", portion: 50, traits: [] },
      { name: "Physalis", lmv: "Physalis", portion: 50, traits: [] },
      { name: "Frozen Mixed Berries", lmv: "Hallon blåbär frysvara", lmvNote: "raspberry and blueberry", portion: 50, traits: ["fodmaps", "polyols"] }
    ]
  },
  {
    id: "driedFruits",
    label: "Dried Fruits/Berries",
    foods: [
      { name: "Dates", lmv: "Dadlar torkade", portion: 30, traits: ["fodmaps", "polyols", "fructans", "salicylate"] },
      { name: "Raisins", lmv: "Russin", portion: 30, traits: ["fodmaps", "fructans"] },
      { name: "Sultanas", lmv: "Russin", portion: 30, traits: ["fodmaps", "fructans"] },
      { name: "Dried Apricot", lmv: "Aprikos torkad", portion: 30, traits: ["cross_reactive", "cross_birch", "fodmaps", "polyols", "fructans", "allergen_sulphite"] },
      { name: "Dried Fig", lmv: "Fikon torkade", portion: 30, traits: ["fodmaps", "polyols", "fructans"] },
      { name: "Prunes", lmv: "Katrinplommon torkade", portion: 30, traits: ["cross_reactive", "cross_birch", "fodmaps", "polyols"] },
      { name: "Dried Cranberry (Added Sugar)", lmv: "Tranbär torkade", portion: 30, traits: ["fodmaps", "fructans", "refined_carbs"] },
      { name: "Dried Cranberry (No Sugar Added)", lmv: "Tranbär torkade", portion: 30, traits: ["fodmaps", "fructans"] },
      { name: "Dried Mango (Added Sugar)", lmv: "Mango torkad", lmvNote: "the database lists one dried mango and does not say whether sugar was added, so the sweetened kind is likely understated here", portion: 30, traits: ["fodmaps", "fructose", "refined_carbs", "allergen_sulphite", "cross_reactive", "cross_mugwort"] },
      { name: "Dried Mango (No Sugar Added)", lmv: "Mango torkad", portion: 30, traits: ["fodmaps", "fructose", "allergen_sulphite", "cross_reactive", "cross_mugwort"] },
      { name: "Dried Pineapple (Added Sugar)", portion: 30, traits: ["fiber", "fodmaps", "fructose", "refined_carbs", "allergen_sulphite"] },
      { name: "Dried Pineapple (No Sugar Added)", portion: 30, traits: ["fodmaps", "fructose", "fiber", "allergen_sulphite"] },
      { name: "Dried Papaya (Added Sugar)", lmv: "Papaya torkad", lmvNote: "the database lists one dried papaya and does not say whether sugar was added, so the sweetened kind is likely understated here", portion: 30, traits: ["cross_reactive", "cross_latex", "refined_carbs", "allergen_sulphite"] },
      { name: "Dried Papaya (No Sugar Added)", lmv: "Papaya torkad", portion: 30, traits: ["cross_reactive", "cross_latex", "allergen_sulphite"] },
      { name: "Dried Banana", lmv: "Banan torkad", portion: 30, traits: ["cross_reactive", "cross_latex"] },
      { name: "Dried Apple", lmv: "Äpple torkat", portion: 30, traits: ["fodmaps", "fructose", "polyols", "irritant", "peel_skin", "cross_reactive", "cross_birch", "allergen_sulphite"] },
      { name: "Dried Pear", lmv: "Päron torkade", portion: 30, traits: ["fodmaps", "fructose", "polyols", "irritant", "peel_skin", "cross_reactive", "cross_birch", "allergen_sulphite"] },
      { name: "Dried Blueberries (Added Sugar)", lmv: "Blåbär torkade", portion: 30, traits: ["refined_carbs"] },
      { name: "Dried Blueberries (No Sugar Added)", lmv: "Blåbär torkade", portion: 30, traits: [] },
      { name: "Dried Peach", lmv: "Persika torkad", portion: 30, traits: ["fodmaps", "polyols", "cross_reactive", "cross_birch", "allergen_sulphite"] },
      { name: "Dried Coconut", lmv: "Kokosflingor", portion: 15, traits: ["over_10g_fat", "bile_stimulant", "allergen_sulphite"] },
      { name: "Dried Goji Berry", lmv: "Gojibär torkade", portion: 30, traits: ["fodmaps", "fructans"] },
      { name: "Dried Kiwi (Added Sugar)", portion: 30, traits: ["cross_reactive", "cross_birch", "cross_grass", "cross_latex", "refined_carbs"] },
      { name: "Dried Kiwi (No Sugar Added)", portion: 30, traits: ["fiber", "cross_reactive", "cross_birch", "cross_grass", "cross_latex"] },
    ]
  },
  {
    id: "nuts",
    label: "Nuts/Seeds",
    foods: [
      { name: "Almond", lmv: "Sötmandel", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "galactans", "salicylate", "allergen_treenut", "cross_reactive", "cross_birch"] },
      { name: "Brazil Nut", lmv: "Paranötter", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "galactans", "allergen_treenut"] },
      { name: "Cashew Nut", lmv: "Cashewnötter rostade u. salt", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "fructans", "galactans", "allergen_treenut"] },
      /* wholeSeed marks the seeds small and tough enough to be swallowed
         intact: the fiber is what acts on the gut while most of the fat stays
         locked inside the shell. Only flaxseed, chia and psyllium qualify.
         Pumpkin seeds are too large to swallow whole, and both they and sesame
         turn brittle when roasted, so both are tagged on their full content.
         Ground versions release everything and carry the fat tags. */
      { name: "Chiaseeds (whole)", wholeSeed: true, lmv: "Chiafrö", portion: 20, traits: ["fiber"] },
      { name: "Chiaseeds (ground)", lmv: "Chiafrö", portion: 20, traits: ["fiber", "over_10g_fat"] },
      { name: "Flaxseed (whole)", wholeSeed: true, lmv: "Linfrö hela", portion: 25, traits: ["fiber", "fodmaps", "fructans"] },
      { name: "Psyllium Husk (whole)", wholeSeed: true, lmv: "Psylliumfröskal", portion: 10, traits: ["fiber"] },
      { name: "Psyllium Husk (ground)", lmv: "Psylliumfröskal", portion: 10, traits: ["fiber"] },
      { name: "Flaxseed (ground)", lmv: "Linfrö hela", portion: 25, traits: ["fiber", "over_10g_fat", "bile_stimulant", "fodmaps", "fructans"] },
      { name: "Hazelnut", lmv: "Hasselnötter", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "fructans", "allergen_treenut", "cross_reactive", "cross_birch"] },
      { name: "Peanut", lmv: "Jordnötter torkade", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "galactans", "allergen_peanut", "cross_reactive", "cross_grass"] },
      { name: "Pumpkin Seeds", lmv: "Pumpafrö", portion: 15, traits: ["over_10g_fat"] },
      { name: "Sunflower Seeds", lmv: "Solrosfrö", portion: 15, traits: ["over_10g_fat", "cross_reactive", "cross_mugwort"] },
      { name: "Walnut", lmv: "Valnötter", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen_treenut"] },
      { name: "Sesame Seeds", lmv: "Sesamfrö m. skal", portion: 5, traits: ["allergen_sesame"] },
      { name: "Macadamia", lmv: "Macadamianötter", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen_treenut"] },
      { name: "Pecan", lmv: "Pekannötter", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen_treenut"] },
      // Chestnut is the odd one out here: ~2g fat, so no fat/bile tags. It is a
      // classic latex-fruit syndrome cross-reactor alongside banana/avocado/kiwi.
      { name: "Chestnut", lmv: "Kastanjer", portion: 60, traits: ["cross_reactive", "cross_latex"] },
      // From the SIGHI review (cleared there — SIGHI gave no mechanism).
      // Sources vary a lot (fiber 10-33g, fat 18-25g per 100g) but every one
      // of them clears both thresholds. Protein is only ~5g, so no protein tag.
      { name: "Pistachio", lmv: "Pistaschnötter u. salt", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "fructans", "galactans", "allergen_treenut"] },
      { name: "Pine Nuts", portion: 15, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "fructans", "allergen_treenut"] },
      { name: "Hemp Seeds", lmv: "Hampafrö u. skal", portion: 15, traits: ["over_10g_fat"] },
      { name: "Poppy Seeds", lmv: "Vallmofrö", portion: 5, traits: [] },
      { name: "Sunflower Seed Butter", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "fructans", "cross_reactive", "cross_mugwort"] }
    ]
  },
  {
    id: "grains",
    label: "Grains/pseudo grains",
    foods: [
      // Oats, rye and barley are almost never eaten as bare grain, so the
      // products are what people actually recognise and react to. Wheat
      // already had its own spread of products further down this list.
      { name: "Oats", form: "dry", lmv: "Havregryn fullkorn", portion: 40, traits: ["fodmaps", "fructans", "allergen_wheat"] },
      { name: "Oat Porridge", form: "cooked", lmv: "Havregrynsgröt fullkorn", portion: 175, traits: ["fodmaps", "fructans", "allergen_wheat"] },
      { name: "Oat Bran", form: "dry", lmv: "Havrekli", portion: 20, traits: ["fodmaps", "fructans", "allergen_wheat"] },
      { name: "Muesli (no added sugar)", form: "dry", lmv: "Frukostflingor müsli fullkorn m. frukt", portion: 50, traits: ["fodmaps", "fructans", "allergen_wheat"] },
      { name: "Wheat", form: "cooked", lmv: "Matvete kokt m. salt", portion: 175, traits: ["fiber", "fodmaps", "fructans", "allergen_wheat"] },
      // Livsmedelsverket has no cooked rye, so the figures are the dry cracked
      // grain and the portion has to be dry too — 60g makes about 175g cooked.
      // At 175g the dry figures were three times what a plate holds, which is
      // also what put protein on it: 5.4g in a real portion, dose 15.
      { name: "Rye", form: "dry", lmv: "Rågkross ångprep. fullkorn", lmvNote: "cracked whole grain, dry weight — rye is not listed cooked", portion: 60, traits: ["fiber", "fodmaps", "fructans", "allergen_wheat"] },
      { name: "Rye Bread (whole grain)", lmv: "Bröd fullkorn råg fibrer ca 7%", portion: 40, traits: ["fodmaps", "fructans", "allergen_wheat"] },
      { name: "Pearl Barley (cooked)", form: "cooked", lmv: "Korngryn kokt u. salt", portion: 175, traits: ["fodmaps", "fructans", "allergen_wheat"] },
      { name: "Barley", form: "cooked", lmv: "Korngryn kokt u. salt", portion: 175, traits: ["fodmaps", "fructans", "allergen_wheat"] },
      { name: "Quinoa", form: "cooked", lmv: "Mjölmålla quinoa röd kokt m. salt", portion: 175, traits: ["fiber"] },
      { name: "Buckwheat", form: "dry", lmv: "Bovetemjöl", lmvNote: "flour", portion: 40, traits: [] },
      { name: "Rice", form: "cooked", lmv: "Ris råris kokt m. salt", portion: 175, traits: [] },
      { name: "Couscous", form: "cooked", lmv: "Couscous kokt m. salt fullkorn", lmvNote: "wholegrain — the only cooked entry", portion: 175, traits: ["fiber", "refined_carbs", "fodmaps", "fructans", "allergen_wheat"] },
      { name: "Bulgur", form: "cooked", lmv: "Bulgur kokt", portion: 175, traits: ["fiber", "fodmaps", "fructans", "allergen_wheat"] },
      { name: "Freekeh", portion: 175, traits: ["allergen_wheat", "fodmaps", "fructans"] },
      { name: "Pita Bread", lmv: "Bröd vitt vete vatten fibrer ca 3,5% typ pitabröd", portion: 60, traits: ["allergen_wheat", "fodmaps", "fructans", "refined_carbs"] },
      { name: "Naan Bread", portion: 60, traits: ["allergen_wheat", "fodmaps", "fructans", "refined_carbs"] },
      { name: "Soba Noodles", portion: 175, traits: ["refined_carbs", "allergen_wheat", "fodmaps", "fructans"] },
      { name: "Rice Noodles", form: "cooked", lmv: "Nudlar risnudlar kokta", portion: 175, traits: ["refined_carbs"] },
      { name: "White Bread", lmv: "Bröd vitt fibrer 3,5%", portion: 40, traits: ["allergen_wheat", "fodmaps", "fructans", "refined_carbs"] },
      { name: "Pasta (no egg)", form: "cooked", lmv: "Pasta kokt u. salt", portion: 175, traits: ["refined_carbs", "allergen_wheat", "fodmaps", "fructans"] },
      { name: "Teff", form: "dry", lmv: "Teffmjöl", lmvNote: "flour", portion: 40, traits: [] },
      { name: "Sorghum/Durra", form: "dry", lmv: "Durra el. andra sorghumarter mjöl", lmvNote: "flour", portion: 40, traits: [] },
      { name: "Crispbread (rye)", lmv: "Hårt bröd fullkorn råg fibrer ca 13%", portion: 20, traits: ["fodmaps", "fructans", "allergen_wheat"] },
      { name: "Rice Cakes", portion: 20, traits: ["refined_carbs"] },
      { name: "Polenta", form: "cooked", lmv: "Majsgryn polenta kokt m. salt", portion: 175, traits: [] },
      { name: "Millet", form: "cooked", lmv: "Hirs kokt m. salt", portion: 175, traits: [] },
      { name: "Seitan", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen_wheat"] },
      { name: "Tapioca", portion: 20, traits: [] },
      { name: "Cornstarch", form: "dry", lmv: "Majsstärkelse", portion: 5, traits: ["refined_carbs"] },
      { name: "Sourdough Bread (wheat)", portion: 40, traits: ["refined_carbs", "allergen_wheat"] },
      { name: "Gluten-free Bread", lmv: "Bröd vitt glutenfritt", portion: 40, traits: ["refined_carbs"] },
      { name: "Gluten-free Crispbread", lmv: "Hårt bröd glutenfritt fibrer ca 7%", portion: 20, traits: ["refined_carbs"] },
      { name: "Gluten-free Pasta", form: "cooked", lmv: "Pasta kokt m. salt majs 100% glutenfri", lmvNote: "100 % maize — the wheat-starch kind is not listed", portion: 175, traits: ["refined_carbs"] },
      { name: "Gluten-free Oats", form: "dry", lmv: "Havregryn fullkorn", lmvNote: "the same entry as ordinary oats — the difference is contamination, not composition", portion: 40, traits: ["fodmaps", "fructans", "allergen_wheat"] },
      { name: "Spelt", form: "cooked", lmv: "Dinkel speltvete kokt m. salt", portion: 175, traits: ["fiber", "fodmaps", "fructans", "allergen_wheat"] },
      { name: "Semolina Porridge", form: "cooked", lmv: "Mannagrynsgröt", portion: 175, traits: ["refined_carbs", "fodmaps", "fructans", "allergen_wheat"] },
      { name: "Corn Tortilla", portion: 60, traits: [] },
      { name: "Wheat Bran", form: "dry", lmv: "Vetekli", portion: 20, traits: ["fiber", "fodmaps", "fructans", "allergen_wheat"] },
      { name: "Rice Flour", form: "dry", lmv: "Rismjöl vitt", portion: 40, traits: ["refined_carbs"] },
      { name: "Potato Flour", form: "dry", lmv: "Potatismjöl", portion: 20, traits: ["refined_carbs"] },
      { name: "Almond Flour", form: "dry", lmv: "Mandelmjöl", portion: 30, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "galactans", "salicylate", "allergen_treenut", "cross_reactive", "cross_birch"] }
    ]
  },
  {
    id: "legumes",
    label: "Legumes",
    foods: [
      { name: "Black Bean", form: "cooked", lmv: "Svarta bönor konserv. u. lag", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Chickpea (whole/flour)", form: "cooked", lmv: "Kikärtor torkade kokta m. salt", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Common Peas", form: "cooked", lmv: "Gröna ärtor kokta m. salt frysvara", portion: 150, traits: ["fiber", "fodmaps", "fructans", "dao_competitor", "salicylate"] },
      { name: "Lentils", form: "cooked", lmv: "Röda linser torkade kokta m. salt", lmvNote: "red lentils", portion: 150, traits: ["fiber", "protein", "fodmaps", "galactans"] },
      { name: "Tempeh", lmv: "Tempeh", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine", "allergen_soy"] },
      { name: "Tofu (firm)", lmv: "Tofu fast", portion: 125, traits: ["allergen_soy", "cross_reactive", "cross_birch", "dao_competitor"] },
      { name: "Tofu (silken)", portion: 125, traits: ["fodmaps", "galactans", "allergen_soy", "cross_reactive", "cross_birch", "dao_competitor"] },
      { name: "Soybeans", form: "cooked", lmv: "Sojabönor torkade kokta u. salt", portion: 150, traits: ["fiber", "over_10g_fat", "bile_stimulant", "protein", "fodmaps", "galactans", "dao_competitor", "allergen_soy", "cross_reactive", "cross_birch"] },
      { name: "Edamame", form: "cooked", lmv: "Sojabönor torkade kokta u. salt", portion: 80, traits: ["allergen_soy", "cross_reactive", "cross_birch"] },
      { name: "Falafel", lmv: "Falafel kikärtskroketter stekta", portion: 125, traits: ["fiber", "over_10g_fat", "bile_stimulant", "fodmaps", "galactans"] },
      { name: "Fava Beans", form: "cooked", lmv: "Bondbönor färska kokta u. salt", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Kidney Beans", form: "cooked", lmv: "Kidneybönor röda bönor konserv. u. lag", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Pinto Beans", form: "cooked", lmv: "Bruna bönor torkade kokta m. salt", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Split Peas", form: "cooked", lmv: "Gula ärtor kokta m. salt", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "White Beans in Tomato Sauce", lmv: "Vita bönor m. tomatsås konserv.", portion: 150, traits: ["fiber", "refined_carbs", "fodmaps", "galactans"] },
      { name: "Green Lentils", form: "cooked", lmv: "Gröna linser torkade kokta m. salt", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Mung Beans", form: "cooked", lmv: "Mungbönor torkade kokta u. salt", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Adzuki Beans", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Butter Beans", portion: 150, traits: ["fodmaps", "galactans"] },

      /* Sprouted legumes. Every other legume above carries galactans; these
         carry none, which is the whole reason they are worth listing. The
         seed spends its own stored oligosaccharides germinating, so a sprout
         is a legume with the load largely gone — Monash rates mung bean and
         alfalfa sprouts low at an ordinary serving. Kept in Legumes rather
         than Vegetables so the contrast with the row above is visible.

         Eaten raw and mostly water, so the portion is a handful in a salad or
         a stir-fry rather than a cooked legume's 150g. */
      { name: "Mung Bean Sprouts", lmv: "Mungbönsgroddar", form: "fresh", portion: 75, traits: [] },
      { name: "Adzuki Bean Sprouts", form: "fresh", portion: 75, traits: [] },
      { name: "Lentil Sprouts", lmv: "Linsgroddar", form: "fresh", portion: 75, traits: [] },
      { name: "Alfalfa Sprouts", lmv: "Alfalfagroddar", form: "fresh", portion: 30, traits: [] }
    ]
  },
  {
    id: "landAnimals",
    label: "Land Animals",
    foods: [
      { name: "Cows Meat", lmv: "Nöt kött rå", portion: 125, traits: ["bile_stimulant", "protein", "alpha_gal"] },
      { name: "Pork (lean cut)", lmv: "Gris kött kokt m. salt", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "alpha_gal"] },
      { name: "Pork (fatty cut)", lmv: "Gris sidfläsk rökt", lmvNote: "smoked side pork — the fattiest cut listed", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "alpha_gal"] },
      { name: "Elk Meat", lmv: "Älg högrev rå", portion: 125, traits: ["protein", "histamine", "alpha_gal"] },
      { name: "Chicken", lmv: "Kyckling kokt m. salt", portion: 125, traits: ["bile_stimulant", "protein"] },
      { name: "Egg White", lmv: "Äggvita rå", portion: 30, traits: ["allergen_egg"] },
      { name: "Egg Yolk", lmv: "Äggula rå", portion: 20, traits: ["allergen_egg"] },
      { name: "Whole Egg", lmv: "Ägg rått", portion: 50, traits: ["allergen_egg"] },
      { name: "Salami", lmv: "Påläggskorv salami rökt", portion: 20, traits: ["over_10g_fat", "histamine", "dao_competitor", "alpha_gal"] },
      { name: "Dry-Cured Ham (~12%)", lmv: "Gris skinka lufttorkad italiensk", portion: 20, traits: ["histamine", "dao_competitor", "alpha_gal"] },
      { name: "Chicken Sausage", lmv: "Korv kycklingkorv mager", portion: 100, traits: ["over_10g_fat", "bile_stimulant", "histamine"] },
      { name: "Sausages (regular)", lmv: "Korv frukostkorv stekt", portion: 100, traits: ["over_10g_fat", "bile_stimulant", "histamine", "alpha_gal"] },
      { name: "Minced Meat (~10% fat)", lmv: "Nöt färs rå fett 10%", lmvNote: "entry measures 11.3 g fat", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine", "alpha_gal"] },
      { name: "Minced Meat (~15% fat)", lmv: "Nöt färs rå fett 15%", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine", "alpha_gal"] },
      { name: "Minced Meat (~20% fat)", lmv: "Blandfärs stekt m. salt", lmvNote: "fried mixed mince — no raw 20 % entry", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine", "alpha_gal"] },
      { name: "Lamb", lmv: "Lamm kött rå", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "alpha_gal"] },
      // Named for the skin, because that is where the fat is: skinless
      // breast is ~4g/100g and would not carry either tag.
      { name: "Duck (with skin)", lmv: "Anka rå m. skinn", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "alpha_gal"] },
      { name: "Turkey", lmv: "Kalkon kokt", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein"] },
      { name: "Frozen Meatballs", lmv: "Köttbullar frysvara", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine", "alpha_gal"] },
      { name: "Hot Dog Sausage", lmv: "Korv varmkorv kokt", portion: 100, traits: ["over_10g_fat", "bile_stimulant", "histamine", "alpha_gal"] },
      { name: "Chicken Nuggets", lmv: "Kyckling nugget friterad tillagad på restaurang", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen_wheat"] },
      { name: "Bacon", lmv: "Gris bacon stekt", portion: 20, traits: ["over_10g_fat", "histamine", "dao_competitor", "alpha_gal"] },
      { name: "Beef Liver", lmv: "Nöt lever rå", portion: 125, traits: ["protein", "alpha_gal"] },
      { name: "Liver Pate", lmv: "Leverpastej bredbar fett ca 24%", lmvNote: "the spreadable kind, 24 % fat", portion: 20, traits: ["alpha_gal"] },
      { name: "Blood Pudding", lmv: "Blodpudding blodkorv fett 14%", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "fructans", "allergen_wheat", "alpha_gal"] },
      { name: "Reindeer", lmv: "Ren kött rå", portion: 125, traits: ["protein", "alpha_gal"] },
      { name: "Dried Reindeer Meat", lmv: "Ren kött torkat", portion: 20, traits: ["histamine", "dao_competitor", "alpha_gal"] }
    ]
  },
  {
    id: "seafood",
    label: "Seafood",
    foods: [
      { name: "Salmon", lmv: "Lax stekt m. salt", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen_fish", "histamine", "dao_competitor"] },
      { name: "Cod", lmv: "Torsk rå", portion: 125, traits: ["protein", "histamine", "allergen_fish"] },
      { name: "Oysters", lmv: "Ostron", portion: 80, traits: ["allergen_mollusc", "histamine"] },
      { name: "Lobsters", lmv: "Hummer kokt", portion: 80, traits: ["protein", "histamine", "allergen_crustacean"] },
      { name: "Crayfish", lmv: "Kräfta kokt", portion: 80, traits: ["allergen_crustacean", "histamine"] },
      { name: "Shrimp", lmv: "Räka kokt", portion: 80, traits: ["allergen_crustacean", "histamine"] },
      { name: "Tuna", lmv: "Tonfisk stekt m. salt", portion: 125, traits: ["protein", "histamine", "dao_competitor", "allergen_fish"] },
      { name: "Anchovies", lmv: "Ansjovis skarpsill konserv. ", portion: 5, traits: ["histamine", "dao_competitor", "allergen_fish"] },
      { name: "Smoked Salmon", lmv: "Lax kallrökt", portion: 20, traits: ["allergen_fish", "histamine", "dao_competitor"] },
      { name: "Crab", lmv: "Krabba Blå krabba kokt", portion: 80, traits: ["allergen_crustacean", "histamine"] },
      { name: "Mussels", lmv: "Mussla konserv. m. lag", portion: 80, traits: ["allergen_mollusc", "histamine"] },
      { name: "Fish Balls", lmv: "Fiskbullar konserv. u. buljong", portion: 125, traits: ["allergen_fish", "histamine"] },
      { name: "Fish Fingers", lmv: "Fiskpinnar stekta", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "histamine", "allergen_wheat", "allergen_fish"] },
      { name: "Mackerel", lmv: "Makrill rå", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine", "dao_competitor", "allergen_fish"] },
      { name: "Sardines (canned)", lmv: "Sardiner i olja konserv.", portion: 20, traits: ["histamine", "dao_competitor", "allergen_fish"] },
      { name: "Pickled Herring", lmv: "Sill inlagd u. lag", portion: 20, traits: ["refined_carbs", "histamine", "dao_competitor", "irritant", "aceticAcid", "allergen_fish"] },
      { name: "Surimi / Crab Sticks", lmv: "Surimi fisk", portion: 20, traits: ["refined_carbs", "allergen_fish", "allergen_wheat"] }
    ]
  },
  {
    id: "dairy",
    label: "Dairy",
    foods: [
      { name: "Cows Milk (3% fat)", lmv: "Mjölk fett 3% berikad", portion: 200, traits: ["over_3g_lactose", "fodmaps", "allergen_milk"] },
      /* Goat's milk at 4.1% fat clears both fat lines in a 200g glass where
         cow's at 3% does not — 8.3g of fat, and 9.7 of bile load against 9.5.
         Sheep's milk is fattier still and has no figures yet. */
      { name: "Goats Milk", portion: 200, traits: ["over_10g_fat", "bile_stimulant", "over_3g_lactose", "fodmaps", "allergen_milk"] },
      { name: "Sheeps Milk", portion: 200, traits: ["over_3g_lactose", "over_10g_fat", "bile_stimulant", "fodmaps", "allergen_milk"] },
      { name: "Cream Cheese (<10% fat)", lmv: "Färskost cream cheese extra light fett 5%", portion: 20, traits: ["allergen_milk"] },
      { name: "Cream Cheese (>10% fat)", lmv: "Färskost fett 33%", portion: 20, traits: ["over_10g_fat", "allergen_milk"] },
      { name: "Hard Cheese (~15% fat)", lmv: "Ost hårdost fett 17%", lmvNote: "closest entry is 17 % fat", portion: 20, traits: ["histamine", "dao_competitor", "allergen_milk"] },
      { name: "Hard Cheese (~28-35% fat)", lmv: "Ost hårdost fett 31%", portion: 20, traits: ["over_10g_fat", "histamine", "dao_competitor", "allergen_milk"] },
      { name: "Yogurt (0.5% fat)", lmv: "Yoghurt naturell lätt fett 0,5% berikad", portion: 200, traits: ["over_3g_lactose", "fodmaps", "allergen_milk"] },
      { name: "Yogurt (3% fat)", lmv: "Yoghurt naturell fett 3% berikad", portion: 200, traits: ["over_3g_lactose", "fodmaps", "allergen_milk"] },
      { name: "Greek Yogurt (10% fat)", lmv: "Yoghurt naturell fett 10%", lmvNote: "entry measures 8.3 g fat, below the 10 g threshold", portion: 200, traits: ["over_10g_fat", "bile_stimulant", "over_3g_lactose", "fodmaps", "allergen_milk"] },
      { name: "Butter", lmv: "Smör fett 80%", portion: 10, traits: ["over_10g_fat", "allergen_milk"] },
      { name: "Cream (40% fat)", lmv: "Vispgrädde fett 40%", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen_milk"] },
      /* 4.82g of lactose in a 200g tub against a 5g dose — the closest call
         the borrowed column produced, and it goes the same way every other
         food's arithmetic goes. Quark (~10%) is 6.00g and keeps both tags. */
      { name: "Quark (~1%)", lmv: "Kvarg färskost fett 1%", portion: 200, traits: ["protein", "allergen_milk"] },
      { name: "Quark (~10%)", lmv: "Kvarg färskost fett 10%", portion: 200, traits: ["fodmaps", "over_10g_fat", "bile_stimulant", "protein", "over_3g_lactose", "allergen_milk"] },
      { name: "Cottage Cheese (4% fat)", lmv: "Färskost cottage cheese naturell fett 4%", portion: 100, traits: ["allergen_milk"] },
      { name: "Sour Cream (12% fat)", lmv: "Gräddfil fett 12%", portion: 25, traits: ["allergen_milk"] },
      { name: "Ricotta Cheese", lmv: "Färskost ricotta fett ca 10%", portion: 60, traits: ["over_10g_fat", "allergen_milk"] },
      { name: "Mascarpone", lmv: "Färskost fett 33%", portion: 20, traits: ["over_10g_fat", "allergen_milk"] },
      { name: "Parmesan", lmv: "Ost hårdost parmesan fett 30% typ Parmiggiano Reggiano", portion: 20, traits: ["over_10g_fat", "histamine", "dao_competitor", "allergen_milk"] },
      { name: "Halloumi", lmv: "Ost halloumi rå fett 22%", portion: 60, traits: ["over_10g_fat", "bile_stimulant", "allergen_milk"] },
      { name: "Mozzarella", lmv: "Ost mozzarella fett 18%", portion: 30, traits: ["allergen_milk"] },
      { name: "Blue Cheese", lmv: "Ädelost grönmögelost fett 17%", portion: 20, traits: ["histamine", "dao_competitor", "allergen_milk"] },
      // Added from the SIGHI review — named there as histamine sources.
      /* These three used to carry over_10g_fat, bile_stimulant and protein on
         a comment reading "Roquefort 30.6/21.5, Fontina 31.1/25.6, Raclette
         ~29/23 per 100g — all clear both thresholds". Per 100g is the error:
         a dose is what arrives in one portion, and a portion here is 20g. The
         protein tag needs 75g per 100g to fire at that size, which no cheese
         reaches. Roquefort's Danish figures settled it — 29.5% fat is 5.9g in
         a portion against a dose of 6.1 — and the same arithmetic applies to
         all three. They now carry what Blue Cheese and Camembert carry, which
         were matched to Livsmedelsverket and so were checked properly. */
      { name: "Roquefort", portion: 20, traits: ["allergen_milk", "histamine", "dao_competitor"] },
      { name: "Fontina", portion: 20, traits: ["over_10g_fat", "allergen_milk", "histamine", "dao_competitor"] },
      { name: "Raclette", portion: 20, traits: ["allergen_milk", "histamine", "dao_competitor"] },
      { name: "Camembert", lmv: "Vitmögelost camembert fett ca 22%", portion: 20, traits: ["histamine", "dao_competitor", "allergen_milk"] },
      { name: "Cheddar", lmv: "Ost hårdost fett 31%", lmvNote: "generic hard cheese entry", portion: 20, traits: ["over_10g_fat", "histamine", "dao_competitor", "allergen_milk"] },
      { name: "Aged Gouda", lmv: "Ost hårdost fett 31%", lmvNote: "generic hard cheese entry", portion: 20, traits: ["over_10g_fat", "histamine", "dao_competitor", "allergen_milk"] },
      { name: "Whey Protein", portion: 25, traits: ["fodmaps", "protein", "allergen_milk", "over_3g_lactose"] },
      // 21.3g fat/100g, so it clears the 17.5g bile threshold like the other
      // full-fat cheeses. Protein is only ~14g, so no protein tag.
      { name: "Feta Cheese", lmv: "Salladsost fett 22%", portion: 30, traits: ["over_10g_fat", "histamine", "allergen_milk"] },
      { name: "Paneer", lmv: "Paneer", portion: 60, traits: ["fodmaps", "over_10g_fat", "bile_stimulant", "over_3g_lactose", "allergen_milk"] },
      { name: "Skyr", portion: 200, traits: ["protein", "fodmaps", "over_3g_lactose", "allergen_milk"] },
      { name: "Buttermilk", lmv: "Filmjölk fett 3% berikad", portion: 200, traits: ["fodmaps", "over_3g_lactose", "allergen_milk"] },
      { name: "Kefir", lmv: "Kefir fett 3% berikad", portion: 200, traits: ["over_3g_lactose", "fodmaps", "allergen_milk"] },
      // Lactase-treated dairy: lactose <0.1g/100g and Monash-tested low FODMAP,
      // but the milk protein and (for yogurt) the fermentation are unchanged.
      // That split is the point — it separates lactose from casein/histamine.
      { name: "Lactose-free Milk", lmv: "Mjölk fett 3% berikad", lmvNote: "ordinary milk — the lactose-free version is not listed", portion: 200, traits: ["allergen_milk"] },
      { name: "Lactose-free Yogurt", lmv: "Yoghurt naturell lätt laktosfri fett ca 0,4% berikad", portion: 200, traits: ["allergen_milk"] },
      { name: "Filmjolk", lmv: "Filmjölk fett 3% berikad", portion: 200, traits: ["over_3g_lactose", "fodmaps", "allergen_milk"] },
      { name: "Creme Fraiche (34% fat)", lmv: "Crème fraiche fett 34%", portion: 25, traits: ["over_10g_fat", "allergen_milk"] },
      { name: "Brie", lmv: "Vitmögelost brie fett ca 38%", lmvNote: "the 38% fat grade — brie is sold from about 30% to 60%", portion: 20, traits: ["over_10g_fat", "histamine", "dao_competitor", "allergen_milk"] },
      { name: "Emmental", lmv: "Ost hårdost fett 31%", lmvNote: "generic hard cheese entry", portion: 20, traits: ["over_10g_fat", "histamine", "dao_competitor", "allergen_milk"] },
      { name: "Lactose-free Cheese", lmv: "Ost hårdost fett 31%", lmvNote: "ordinary hard cheese — the lactose-free version is not listed", portion: 20, traits: ["over_10g_fat", "allergen_milk"] },
      { name: "Lactose-free Cream (40% fat)", lmv: "Vispgrädde fett 40%", lmvNote: "ordinary cream — the lactose-free version is not listed", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen_milk"] }
    ]
  },
  {
    id: "spices",
    label: "Spices",
    foods: [
      { name: "Chili (fresh)", bothWays: true, form: "fresh", lmv: "Chilipeppar färsk", portion: 5, traits: ["irritant", "capsaicin"] },
      { name: "Garlic", form: "fresh", lmv: "Vitlök", portion: 5, traits: ["fodmaps", "fructans", "irritant", "allyl_compounds", "allergen_onion"] },
      { name: "Garlic Powder", form: "dried", portion: 2, traits: ["fodmaps", "fructans", "irritant", "allyl_compounds", "allergen_onion"] },
      { name: "Ginger (fresh)", bothWays: true, form: "fresh", lmv: "Ingefära färsk", portion: 5, traits: ["cross_reactive", "cross_mugwort"] },
      { name: "Ginger (dried)", bothWays: true, form: "dried", portion: 2, traits: ["cross_reactive", "cross_mugwort"] },
      { name: "Dill (fresh)", bothWays: true, form: "fresh", lmv: "Dill färsk", portion: 2, traits: ["cross_reactive", "cross_mugwort"] },
      { name: "Dill (dried)", bothWays: true, form: "dried", portion: 1, traits: ["cross_reactive", "cross_mugwort"] },
      { name: "Turmeric (dried)", bothWays: true, form: "dried", lmv: "Gurkmeja torkad", portion: 2, traits: ["bile_stimulant"] },
      { name: "Mustard", lmv: "Senap svensk", portion: 5, traits: ["irritant", "allyl_compounds", "allergen_mustard", "cross_reactive", "cross_mugwort"] },
      { name: "Black Pepper", form: "dried", portion: 2, traits: ["irritant", "cross_reactive", "cross_mugwort"] },
      { name: "Sumac", form: "dried", portion: 2, traits: ["irritant", "aceticAcid"] },
      { name: "Cumin (dried)", form: "dried", lmv: "Spiskummin frö torkad", portion: 2, traits: ["salicylate", "cross_reactive", "cross_mugwort"] },
      { name: "Wasabi", lmv: "Wasabirot", portion: 5, traits: ["irritant", "allyl_compounds"] },
      { name: "Curry Powder", form: "dried", portion: 2, traits: ["irritant", "capsaicin"] },
      { name: "Sichuan Peppercorn", form: "dried", portion: 2, traits: ["irritant"] },
      { name: "Nutmeg", form: "dried", lmv: "Muskotnöt malen", portion: 2, traits: [] },
      // Herbs sit under the 10g typical-serving gate, so no macro tags apply
      // however fiber-dense they look per 100g. All rated 0 by SIGHI and
      // unrestricted by Monash.
      { name: "Basil (fresh)", bothWays: true, form: "fresh", lmv: "Basilika färsk", portion: 2, traits: [] },
      { name: "Basil (dried)", bothWays: true, form: "dried", portion: 1, traits: [] },
      { name: "Oregano (dried)", bothWays: true, form: "dried", portion: 2, traits: [] },
      { name: "Thyme (dried)", bothWays: true, form: "dried", portion: 2, traits: [] },
      { name: "Thyme (fresh)", bothWays: true, form: "fresh", portion: 2, traits: [] },
      { name: "Rosemary (dried)", bothWays: true, form: "dried", portion: 2, traits: [] },
      { name: "Rosemary (fresh)", bothWays: true, form: "fresh", portion: 2, traits: [] },
      { name: "Mint (fresh)", bothWays: true, form: "fresh", portion: 2, traits: ["irritant"] },
      { name: "Mint (dried)", bothWays: true, form: "dried", portion: 1, traits: ["irritant"] },
      { name: "Cinnamon", form: "dried", lmv: "Kanel", portion: 2, traits: [] },
      { name: "Paprika Powder", form: "dried", portion: 2, traits: ["cross_reactive", "cross_mugwort"] },
      { name: "Cardamom (dried)", form: "dried", lmv: "Kardemumma torkad", portion: 2, traits: [] },
      { name: "Allspice", form: "dried", portion: 2, traits: [] }
    ]
  },
  {
    id: "beverages",
    label: "Beverages",
    foods: [
      { name: "Red Wine", lmv: "Vin rött vol. % 14", portion: 150, traits: ["alcohol", "histamine", "irritant", "allergen_sulphite"] },
      { name: "White Wine", lmv: "Vin vitt vol. % 12", portion: 150, traits: ["alcohol", "histamine", "irritant", "allergen_sulphite"] },
      // From the SIGHI review. Styrian rosé, 11-12% ABV under Schilcherland DAC.
      { name: "Schilcherwein", portion: 150, traits: ["alcohol", "histamine", "irritant", "allergen_sulphite"] },
      { name: "Champagne", portion: 150, traits: ["alcohol", "histamine", "irritant", "carbonation", "allergen_sulphite"] },
      { name: "Beer", lmv: "Öl starköl el. exportöl vol. % 5,4", portion: 330, traits: ["alcohol", "histamine", "irritant", "carbonation", "allergen_wheat"] },
      { name: "Cider", lmv: "Cider vol. % 1", lmvNote: "the 1 % grocery cider — stronger ones are not listed", portion: 330, traits: ["alcohol", "irritant", "carbonation", "histamine", "allergen_sulphite"] },
      { name: "Spirits (Liquor)", lmv: "Whisky vol. % 40", portion: 40, traits: ["alcohol", "irritant", "histamine"] },
      { name: "Coffee", lmv: "Kaffe bryggt", portion: 200, traits: ["caffeine", "irritant"] },
      { name: "Espresso", lmv: "Kaffe espresso bryggt drickf.", portion: 30, traits: ["caffeine", "irritant"] },
      { name: "Black Tea", portion: 200, traits: ["caffeine", "irritant"] },
      { name: "Green Tea", portion: 200, traits: ["irritant", "caffeine"] },
      { name: "Mate Tea", portion: 200, traits: ["irritant", "caffeine"] },
      { name: "Energy Drinks", lmv: "Energidryck m. socker berikad", portion: 200, traits: ["caffeine", "irritant", "carbonation"] },
      { name: "Soy Milk", lmv: "Sojadryck", portion: 200, traits: ["allergen_soy", "fodmaps", "galactans", "dao_competitor"] },
      { name: "Oat Drink", lmv: "Havredryck fett 1,5% berikad", portion: 200, traits: ["allergen_wheat"] },
      { name: "Coconut Milk", lmv: "Kokosmjölk fett ca 6%", portion: 200, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "polyols"] },
      /* Matcha is the one tea where the leaf is drunk rather than steeped and
         thrown away, so its figures are a dried tea leaf's, scaled by the
         bowl: about 2g of powder in 200ml. Every other tea here is matched to
         a ready-to-drink brew and needs no recipe. */
      { name: "Matcha", form: "cooked", lmvNote: "dried tea leaf, whisked into water at about 2g in a 200ml bowl", madeUp: { parts: 1, water: 100 }, portion: 200, traits: ["irritant", "caffeine"] },
      { name: "Chai Tea", portion: 200, traits: ["irritant", "caffeine"] },
      // Added for the salicylate work; carries no histamine per the review.
      // Caffeine-free. Cross-reacts with mugwort/ragweed pollen (Asteraceae) —
      // tagged with the general cross-reaction trait, since we track only the
      // birch, grass and latex groups as subtypes.
      { name: "Chamomile Tea", portion: 200, traits: ["salicylate", "cross_reactive", "cross_mugwort"] },
      { name: "Kombucha", portion: 200, traits: ["irritant", "histamine", "carbonation"] },
      { name: "Almond Milk", lmv: "Mandeldryck berikad", portion: 200, traits: ["allergen_treenut"] },
      { name: "Orange Juice", lmv: "Apelsinjuice drickf.", portion: 200, traits: ["cross_reactive", "cross_grass", "dao_competitor"] },
      { name: "Apple Juice", lmv: "Äppeljuice drickf.", portion: 200, traits: ["fodmaps", "fructose", "polyols", "cross_reactive", "cross_birch"] },
      // The figures are the powder made up 1:8 as directed — see nutrition-manual.js.
      // Taken as powder against a 200g bowl it looked like 142g of sugar and
      // enough fiber to tag, which is where the fiber tag came from. A made-up
      // bowl holds 1.2g.
      // Sold as powder, eaten as a bowl. `madeUp` is the packet's own recipe and
      // the builder does the dilution — see tools/nutrition-core.js. Taken as
      // powder against a 200g bowl this looked like 142g of sugar a serving,
      // which is also where its fiber tag came from; a made-up bowl holds 1.1g.
      { name: "Rosehip Soup", form: "cooked", lmv: "Nyponsoppapulver berikad", lmvNote: "powder, made up 1 part to 8 of water as directed", madeUp: { parts: 1, water: 8 }, portion: 200, traits: ["refined_carbs"] },
      { name: "Peppermint Tea", portion: 200, traits: ["irritant"] },
      { name: "Alcohol-free Beer", lmv: "Öl alkoholfri", portion: 330, traits: ["irritant", "carbonation", "allergen_wheat"] },
      { name: "Squash / Cordial", lmv: "Saft drickf.", portion: 200, traits: ["refined_carbs"] },
      { name: "Hot Chocolate", lmv: "Varm choklad m. mjölk fett 3%", portion: 200, traits: ["irritant", "over_10g_fat", "refined_carbs", "over_3g_lactose", "fodmaps", "caffeine", "allergen_milk"] }
    ]
  },
  {
    id: "ultraProcessed",
    label: "Processed Foods",
    foods: [
      { name: "Frozen pizza", lmv: "Pizza orientalisk", portion: 175, traits: ["over_10g_fat", "bile_stimulant", "protein", "refined_carbs"] },
      { name: "French Fries (deep-fried)", lmv: "Pommes frites friterad potatis fett ca 11% frysvara", portion: 150, traits: ["over_10g_fat", "bile_stimulant", "refined_carbs"] },
      { name: "French Fries (oven-baked)", lmv: "Pommes frites friterad potatis värmd i ugn fett ca 7% frysvara", portion: 150, traits: ["over_10g_fat", "bile_stimulant", "refined_carbs"] },
      { name: "Margarine", lmv: "Flytande margarin fett 70%", portion: 10, traits: ["over_10g_fat"] },
      // "ätf." is the made-up broth, not the cube, so the portion is a mug of
      // it. At 5g it was a teaspoon of stock and counted as nothing.
      { name: "Instant Soup / Bouillon Cubes", form: "cooked", lmv: "Köttbuljong tärning ätf.", lmvNote: "ready-to-eat broth, not the dry cube", portion: 200, traits: ["fodmaps", "fructans", "allergen_celery"] },
      { name: "Flavored Yogurt", lmv: "Fruktyoghurt fett 2%", portion: 200, traits: ["over_3g_lactose", "fodmaps", "refined_carbs", "allergen_milk"] },
      { name: "Pretzels", lmv: "Salta pinnar", portion: 20, traits: ["refined_carbs", "allergen_wheat"] },
      { name: "Instant Mashed Potato", lmv: "Potatismos hemlagad", portion: 175, traits: ["refined_carbs"] },
      { name: "Dumplings", portion: 100, traits: ["allergen_wheat", "over_10g_fat", "bile_stimulant"] },
      { name: "Fresh Pasta (w/ egg)", lmv: "Pasta färsk m. ägg kokt u. salt", portion: 175, traits: ["refined_carbs", "allergen_wheat", "allergen_egg", "fodmaps", "fructans"] }
    ]
  },
  {
    id: "plantBased",
    label: "Plant-Based Substitutes",
    foods: [
      { name: "Soy Yogurt", lmv: "Soygurt naturell eko. berikad", portion: 200, traits: ["allergen_soy"] },
      { name: "Oat Yogurt", lmv: "Havregurt naturell fett 2,2% berikad", portion: 200, traits: ["fodmaps", "fructans", "allergen_wheat"] },
      { name: "Oat Fraiche", lmv: "Fraiche m. havre veg. fett 15% berikad", portion: 25, traits: ["fodmaps", "fructans", "allergen_wheat"] },
      { name: "Vegan Cheese (Coconut Oil)", lmv: "Kokosbaserad bit fett ca 20% som alternativ till ost", portion: 20, traits: ["refined_carbs"] },
      { name: "Vegan Cheese (Cashew)", portion: 20, traits: ["over_10g_fat", "fodmaps", "galactans", "fructans", "allergen_treenut"] },
      { name: "Plant-based Mince", lmv: "Sojaprotein färs stekt", portion: 125, traits: ["fiber", "over_10g_fat", "bile_stimulant", "protein", "fodmaps", "galactans", "allergen_soy"] },
      { name: "Quorn", lmv: "Mykoprotein bullar frysvara", lmvNote: "mycoprotein balls — plain pieces are not listed", portion: 125, traits: ["protein", "allergen_egg", "allergen_mushroom"] },
      { name: "Veggie Burger (vegetable-based)", lmv: "Grönsaksburgare stekt veg.", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "refined_carbs", "fodmaps", "galactans"] },
      { name: "Aquafaba", portion: 25, traits: ["fodmaps", "galactans"] },
    ]
  },
  {
    id: "condiments",
    label: "Condiments",
    foods: [
      { name: "Soy Sauce", lmv: "Sojasås", portion: 5, traits: ["histamine", "allergen_soy", "allergen_wheat", "dao_competitor"] },
      { name: "Vinegar", portion: 5, traits: ["aceticAcid", "irritant"] },
      { name: "Balsamic Vinegar", lmv: "Vinäger ättiksyra 7%", portion: 5, traits: ["aceticAcid", "irritant", "histamine", "allergen_sulphite"] },
      { name: "Aioli", lmv: "Aioli", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen_egg", "irritant", "allyl_compounds"] },
      { name: "Pesto", lmv: "Pesto hemlagad", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen_treenut", "allergen_milk", "fodmaps", "fructans"] },
      { name: "Tzatziki", lmv: "Tzatziki", portion: 50, traits: ["allergen_milk"] },
      { name: "Hummus", lmv: "Hummus kikärtsröra", portion: 50, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "galactans", "allergen_sesame"] },
      { name: "Guacamole", lmv: "Guacamole", portion: 50, traits: ["over_10g_fat", "cross_reactive", "cross_latex"] },
      { name: "Mango Chutney", lmv: "Mango chutney", portion: 25, traits: ["refined_carbs"] },
      { name: "Cranberry Sauce", portion: 25, traits: ["fodmaps", "refined_carbs", "fructose"] },
      { name: "Fish Roe Spread", lmv: "Påläggskaviar original", portion: 20, traits: ["over_10g_fat", "histamine", "allergen_fish"] },
      /* The dark savoury spread — Marmite, Vegemite. Nutritional yeast is a
         different product and has its own entry below. The name alone was
         ambiguous enough to be read either way. Yeast extract is one of the
         higher-histamine foods on any elimination list. */
      { name: "Yeast Extract (Marmite type)", portion: 5, traits: ["histamine"] },
      { name: "Ajvar", lmv: "Ajvar relish", portion: 25, traits: ["irritant"] },
      { name: "Harissa", portion: 5, traits: ["irritant", "capsaicin"] },
      { name: "Tahini", lmv: "Tahini", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen_sesame"] },
      { name: "Baba Ganoush", portion: 50, traits: ["histamine"] },
      { name: "Preserved Lemon", portion: 5, traits: ["irritant", "histamine", "aceticAcid"] },
      { name: "Sesame Oil", lmv: "Sesamolja", portion: 10, traits: ["over_10g_fat", "bile_stimulant", "allergen_sesame"] },
      { name: "Olive Oil", lmv: "Olivolja", portion: 10, traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Sunflower Oil", lmv: "Solrosolja", portion: 10, traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Rapeseed Oil", lmv: "Rapsolja", portion: 10, traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Coconut Oil", lmv: "Kokosolja", portion: 10, traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Ghee", lmv: "Klarnat smör ghee", portion: 10, traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Tamarind", portion: 5, traits: ["irritant", "aceticAcid"] },
      // Honey is high FODMAP at a normal tablespoon — excess fructose is the
      // main driver, with fructans secondary. Not a "safe" pantry staple.
      { name: "Honey", lmv: "Honung", portion: 25, traits: ["fodmaps", "fructose", "fructans"] },
      { name: "White Sugar", lmv: "Socker", portion: 5, traits: ["refined_carbs"] },
      /* USDA gives 67.4g of carbohydrate, 32.2g of water and no sugars figure —
         the derivation code on that one value was not one we accept. But maple
         syrup is sucrose, glucose and fructose in water and very little else;
         the residue is oligosaccharides and organic acids. `sugarsOfCarbs`
         works the figure out from the carbohydrate rather than having it typed
         in, so it follows the source if the source changes, and the line in
         nutrition-data.js says the sugars figure is derived. */
      { name: "Maple Syrup", portion: 25, sugarsOfCarbs: 0.9, traits: ["refined_carbs"] },
      { name: "Salt", lmv: "Salt m. jod", portion: 5, traits: [] },
      { name: "Garlic-infused Oil", portion: 10, traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Peanut Butter", lmv: "Jordnötssmör", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "galactans", "allergen_peanut", "cross_reactive", "cross_grass"] },
      { name: "Agave Syrup", portion: 25, traits: ["fodmaps", "fructose", "refined_carbs"] },
      { name: "Nutritional Yeast", lmv: "Näringsjäst", portion: 5, traits: [] }
    ]
  },
  {
    id: "sauces",
    label: "Sauces",
    foods: [
      { name: "Ketchup", lmv: "Ketchup", portion: 25, traits: ["aceticAcid", "irritant", "dao_competitor"] },
      { name: "Mayonnaise", lmv: "Majonnäs fett 80%", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen_egg"] },
      { name: "Barbecue Sauce", portion: 25, traits: ["aceticAcid", "irritant", "refined_carbs"] },
      { name: "Hot Sauce", portion: 5, traits: ["histamine", "irritant", "capsaicin"] },
      { name: "Horseradish Sauce", portion: 25, traits: ["irritant", "over_10g_fat", "bile_stimulant"] },
      { name: "Tartar Sauce", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen_egg"] },
      { name: "Salsa", lmv: "Tomatsalsa kall", portion: 25, traits: ["irritant"] },
      { name: "Ranch Dressing", lmv: "Dressing konserv. fett ca 25%", portion: 25, traits: ["over_10g_fat", "allergen_milk", "allergen_egg"] },
      { name: "Thousand Island Dressing", lmv: "Dressing konserv. fett ca 25%", portion: 25, traits: ["over_10g_fat", "allergen_egg"] },
      { name: "Teriyaki Sauce", portion: 25, traits: ["histamine", "allergen_soy", "allergen_wheat", "refined_carbs"] },
      { name: "Fish Sauce", lmv: "Fisksås", portion: 5, traits: ["histamine", "allergen_fish"] },
      { name: "Béarnaise Sauce", lmv: "Bearnaisesås hemlagad", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen_egg", "allergen_milk"] },
      { name: "Hollandaise Sauce", lmv: "Hollandaisesås hemlagad", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen_egg", "allergen_milk"] },
      { name: "Remoulade", lmv: "Remouladsås", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen_egg", "irritant", "allergen_mustard"] },
      { name: "Tomato Pasta Sauce", lmv: "Pastasås m. tomat örtkryddor", portion: 60, traits: ["fodmaps", "fructans", "refined_carbs"] },
      { name: "Bechamel Sauce", lmv: "Béchamelsås", portion: 60, traits: ["allergen_milk", "allergen_wheat"] },
      { name: "Satay / Peanut Sauce", lmv: "Jordnötssås", portion: 25, traits: ["refined_carbs", "fodmaps", "fructans", "allergen_peanut"] },
      { name: "Vegan Mayonnaise", portion: 25, traits: ["over_10g_fat", "bile_stimulant"] }
    ]
  },
  {
    id: "mushrooms",
    label: "Mushrooms",
    foods: [
      { name: "Shiitake Mushrooms", form: "fresh", lmv: "Shiitakesvamp", portion: 80, traits: ["fodmaps", "polyols", "dao_competitor", "allergen_mushroom"] },
      { name: "Oyster Mushrooms", form: "fresh", lmv: "Ostronskivling", portion: 80, traits: ["dao_competitor", "allergen_mushroom"] },
      { name: "White Button Mushrooms", form: "fresh", lmv: "Champinjon", portion: 80, traits: ["fodmaps", "polyols", "dao_competitor", "allergen_mushroom"] },
      { name: "Portobello Mushrooms", form: "fresh", lmv: "Champinjon", portion: 80, traits: ["fodmaps", "polyols", "dao_competitor", "allergen_mushroom"] },
      { name: "Cremini Mushrooms", form: "fresh", lmv: "Champinjon", portion: 80, traits: ["fodmaps", "polyols", "dao_competitor", "allergen_mushroom"] },
      { name: "Chanterelle Mushrooms", form: "fresh", lmv: "Kantarell gul rå", portion: 80, traits: ["fodmaps", "polyols", "dao_competitor", "allergen_mushroom"] },
      { name: "Porcini Mushrooms", form: "fresh", portion: 80, traits: ["fodmaps", "polyols", "dao_competitor", "allergen_mushroom"] },
      { name: "Morel Mushrooms", form: "fresh", portion: 80, traits: ["fodmaps", "polyols", "dao_competitor", "allergen_mushroom"] },
      { name: "King Oyster Mushrooms", form: "fresh", lmv: "Ostronskivling", portion: 80, traits: ["dao_competitor", "allergen_mushroom"] },
      { name: "Truffle", portion: 5, traits: ["fodmaps", "polyols", "dao_competitor", "allergen_mushroom"] },
      { name: "Maitake Mushrooms", form: "fresh", portion: 80, traits: ["fodmaps", "polyols", "dao_competitor", "allergen_mushroom"] },
    ]
  },
  {
    id: "snacksSweets",
    label: "Snacks & Sweets",
    foods: [
      { name: "Potato chips", lmv: "Chips potatis naturell", portion: 30, traits: ["over_10g_fat"] },
      // No generic entry exists. The database has 13 chocolate-coated bars
      // described by their filling; this is the nougat/caramel/peanut one.
      { name: "Candy bars", lmv: "Mjuk nougat m. kolasås jordnötter mjölkchokladöverdrag", lmvNote: "one representative bar, not a generic entry", portion: 50, traits: ["fodmaps", "over_10g_fat", "bile_stimulant", "refined_carbs", "over_3g_lactose", "allergen_milk"] },
      /* 7.4g of lactose per 100g is 2.22g in a 30g piece, under our 5g dose —
         the tag had been resting on 56.2g of total sugars, nearly all of it
         sucrose. It stays anyway, because Monash measured this food and gives
         a low-FODMAP serving of 20g, below the 30g portion here. Their
         threshold for lactose is lower than ours, and a direct measurement of
         the food beats our arithmetic on a borrowed column. */
      { name: "Milk chocolate", lmv: "Mjölkchoklad", portion: 30, traits: ["irritant", "over_10g_fat", "bile_stimulant", "refined_carbs", "over_3g_lactose", "fodmaps", "caffeine", "allergen_milk"] },
      // Livsmedelsverket lists 0g fiber, which is a gap rather than a real zero:
      // 70% chocolate runs around 11g/100g. That correction used to carry the
      // fiber tag past a per-100g threshold, but 25g of chocolate is under 3g
      // of fiber either way, so the tag goes.
      { name: "Dark Chocolate", lmv: "Mörk choklad kakao ≥ 70%", portion: 25, traits: ["irritant", "over_10g_fat", "bile_stimulant", "refined_carbs", "caffeine"] },
      { name: "Cheese Puffs / Snacks", lmv: "Ostbågar", portion: 25, traits: ["over_10g_fat", "allergen_milk"] },
      { name: "Granola Bar", lmv: "Bar müslibar m. choklad berikad", portion: 30, traits: ["refined_carbs", "allergen_treenut", "allergen_wheat"] },
      { name: "Protein Bar", portion: 50, traits: ["protein", "refined_carbs", "allergen_milk"] },
      { name: "Microwave Popcorn", lmv: "Popcorn mikropopcorn poppade fett ca 22%", portion: 25, traits: [] },
      { name: "Sugary Breakfast Cereal", lmv: "Frukostflingor majs m. socker", portion: 40, traits: ["refined_carbs", "allergen_wheat"] },
      { name: "Sugary soft drinks", lmv: "Läsk", portion: 330, traits: ["refined_carbs", "carbonation", "irritant"] },
      { name: "Cola", lmv: "Läsk cola", portion: 330, traits: ["caffeine", "refined_carbs", "carbonation", "irritant"] },
      /* 3.35g of lactose in a 100g serving against our 5g dose, where the tag
         had been resting on 16.5g of total sugars. It stays: Monash gives this
         food no low-FODMAP serving at all. Same reasoning as milk chocolate. */
      { name: "Ice Cream", lmv: "Glass fett ca 10%", portion: 100, traits: ["over_10g_fat", "bile_stimulant", "refined_carbs", "over_3g_lactose", "fodmaps", "allergen_milk"] },
      { name: "Halva", portion: 30, traits: ["over_10g_fat", "bile_stimulant", "allergen_sesame", "refined_carbs"] },
      { name: "Baklava", lmv: "Baklava ", portion: 40, traits: ["over_10g_fat", "refined_carbs", "allergen_wheat", "allergen_treenut"] },
      { name: "Sugar-free Chewing Gum", lmv: "Tuggummi sockerfritt", portion: 5, traits: ["fodmaps", "polyols"] },
      { name: "Cinnamon Bun", lmv: "Sött vetebröd kanelbulle gräddad kylvara frysvara el. butiksbakad", lmvNote: "the 18.5 g of sugar is nearly all sucrose — the milk in the dough leaves well under a gram of lactose", portion: 60, traits: ["over_10g_fat", "refined_carbs", "fodmaps", "fructans", "allergen_milk", "allergen_wheat"] },
      { name: "Marzipan", lmv: "Mandelmassa", portion: 30, traits: ["over_10g_fat", "refined_carbs", "fodmaps", "galactans", "allergen_treenut"] },
      { name: "Liquorice", lmv: "Lakritsgodis", portion: 30, traits: ["refined_carbs"] },
      { name: "Salty Liquorice", portion: 25, traits: ["refined_carbs"] }
    ]
  },
  {
    id: "picklesFerments",
    label: "Pickles & Ferments",
    foods: [
      { name: "Kimchi", portion: 50, traits: ["histamine", "fodmaps", "fructans", "irritant"] },
      { name: "Sauerkraut", lmv: "Surkål konserv. m. lag", portion: 50, traits: ["histamine", "dao_competitor"] },
      { name: "Pickled Cucumber", lmv: "Gurka inlagd", portion: 25, traits: ["histamine", "aceticAcid", "irritant"] },
      { name: "Olives", lmv: "Oliver gröna m. paprikafyllning avrunna", portion: 25, traits: ["histamine"] },
      { name: "Miso Paste", lmv: "Miso sojabönspasta fermenterad", portion: 5, traits: ["histamine", "dao_competitor", "allergen_soy"] },
      { name: "Pickled Beetroot", lmv: "Rödbeta inlagd u. lag", portion: 40, traits: ["fodmaps", "fructans", "irritant", "aceticAcid", "refined_carbs", "salicylate"] },
      { name: "Pickled Onion", lmv: "Syltlök inlagd", portion: 20, traits: ["fodmaps", "fructans", "irritant", "aceticAcid", "allyl_compounds", "allergen_onion"] },
      { name: "Pickled Jalapeno", portion: 15, traits: ["irritant", "capsaicin", "aceticAcid"] },
      { name: "Pickled Ginger", portion: 5, traits: ["irritant", "aceticAcid", "refined_carbs", "cross_reactive", "cross_mugwort"] },
      { name: "Salt-brined Pickles", lmv: "Saltgurka u. lag", portion: 30, traits: ["histamine", "dao_competitor"] },
      { name: "Capers", portion: 5, traits: ["histamine", "irritant", "aceticAcid"] },
      { name: "Natto", portion: 40, traits: ["histamine", "dao_competitor", "fodmaps", "galactans", "allergen_soy"] },
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
