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
       sv: "Bär",
       foods: [
         { name: "Blueberry", sv: "Blåbär", traits: ["fiber"] },
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

     { name: "Jackfruit", sv: "Jackfrukt", traits: ["fiber"] }

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
    ],
    sv: {
      label: "FODMAP",
      evidence: {
        level: "Väl belagt",
        detail: "Flera randomiserade studier vid IBS, med stöd av utandningstest och MR-undersökningar som visar jäsningen och vätskeindraget direkt."
      },
      analysis: [
        "De här livsmedlen är rika på FODMAP — jäsbara kolhydrater som kan ge gaser, uppblåsthet och obehag. Oftast milt, men mer uttalat och långsammare att gå över vid IBS.",
        "Se artikeln om FODMAP för de enskilda undertyperna och lågFODMAP-metoden."
      ]
    }
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
    ],
    sv: {
      label: "Fruktos",
      evidence: {
        level: "Väl belagt",
        detail: "Utandningstest och randomiserade lågFODMAP-studier. Hur mycket som tolereras varierar mellan personer och beror på hur mycket glukos som äts samtidigt."
      },
      analysis: [
        "De här livsmedlen innehåller mycket fri fruktos i förhållande till glukos, vilket kan överstiga tunntarmens upptagsförmåga och dra in extra vatten i tarmen.",
        "Det här är en av flera FODMAP-undertyper som följs vid sidan av den bredare FODMAP-taggen."
      ]
    }
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
    ],
    sv: {
      label: "Polyoler",
      evidence: {
        level: "Väl belagt",
        detail: "Randomiserade lågFODMAP-studier, plus en tydligt mätbar osmotisk effekt — sorbitol och mannitol används som laxermedel i högre doser."
      },
      analysis: [
        "De här livsmedlen innehåller naturligt sockeralkoholer som sorbitol och mannitol, som tas upp dåligt och har en osmotisk, vattendragande effekt i tarmen.",
        "Stenfrukt och svamp är vanliga källor. Det här är en av flera FODMAP-undertyper som följs vid sidan av den bredare FODMAP-taggen."
      ]
    }
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
    ],
    sv: {
      label: "Fruktaner",
      evidence: {
        level: "Väl belagt",
        detail: "Den mest undersökta undertypen. Blindade omprovokationsstudier pekar på fruktaner snarare än gluten bakom de flesta besvär som skylls på vete hos personer utan celiaki."
      },
      analysis: [
        "Fruktaner är kedjor av fruktosmolekyler som människan saknar enzym för att bryta ner, så de passerar hela till tjocktarmen där tarmbakterier jäser dem.",
        "Vete, lök och vitlök är klassiska källor. Det här är en av flera FODMAP-undertyper som följs vid sidan av den bredare FODMAP-taggen."
      ]
    }
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
    ],
    sv: {
      label: "GOS",
      evidence: {
        level: "Väl belagt",
        detail: "Människan saknar enzymet helt, så jäsningen är säker. Symtomstudierna är mindre än för de övriga undertyperna."
      },
      analysis: [
        "Galaktooligosackarider är korta galaktoskedjor som tunntarmen inte kan bryta ner, så de når tjocktarmen i stort sett hela och jäses av tarmbakterier.",
        "Baljväxter och vissa nötter är de främsta källorna. Det här är en av flera FODMAP-undertyper som följs vid sidan av den bredare FODMAP-taggen."
      ]
    }
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
    ],
    sv: {
      label: "Fett",
      evidence: {
        level: "Väl belagt",
        detail: "Fett bromsar mätbart magsäckstömningen och sänker trycket i den nedre matstrupsmuskeln. Symtomprovokation är bäst dokumenterad vid reflux och funktionell dyspepsi."
      },
      analysis: [
        "En normal portion av de här livsmedlen innehåller minst 6 g fett, vilket kan förvärra besvär vid GERD, IBS, gallbesvär och bukspottkörtelsvikt (EPI).",
        "Se artikeln om Fett för varningstecken på malabsorption och vilka som drabbas mest."
      ]
    }
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
    ],
    sv: {
      label: "Gallstimulerande",
      evidence: {
        level: "Begränsat",
        detail: "CCK-svaret på fett och protein är väl mätt, men steget därifrån till symtom är slutlett snarare än prövat. Dosen 9,5 g, och att protein räknas till en femtedel av sin vikt, är våra siffror och inte publicerade."
      },
      analysis: [
        "De här livsmedlen stimulerar gallutsöndring kraftigt via CCK, främst genom sitt fett- och proteininnehåll. Mest relevant vid gallsten eller tidigare gallstensanfall.",
        "Se artikeln om Gallstimulerande för kliniska detaljer."
      ]
    }
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
    ],
    sv: {
      label: "Fiber",
      evidence: {
        level: "Väl belagt",
        detail: "Ett stort studieunderlag som pekar åt båda hållen: fiber lindrar förstoppning och framkallar uppblåsthet, och vilket det blir beror på typen och på personen."
      },
      analysis: [
        "De här livsmedlen är fiberrika, vilket kan ge gaser och uppblåsthet vid högt intag, särskilt vid vätskebrist eller rubbad tarmflora.",
        "Se artikeln om Fiber för nyttan, källorna och riskerna med en fiberfattig kost."
      ]
    }
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
    ],
    sv: {
      label: "Protein",
      evidence: {
        level: "Begränsat",
        detail: "Följs som sammanhang snarare än som utlösare. Protein i sig ger sällan tarmbesvär — det som följer med gör det oftare."
      },
      analysis: [
        "De här livsmedlen är proteinrika. Protein stimulerar gallutsöndring måttligt och kan öka matsmältningens arbete i stora mängder. Besvär hänger oftare ihop med det som följer med proteinet (laktos, allergener, histamin) än med proteinet självt — men pankreatit, tumörer i bukspottkörteln och äkta födoämnesallergi kan ge direkta reaktioner."
      ]
    }
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
    ],
    sv: {
      label: "Raffinerade kolhydrater",
      evidence: {
        level: "Begränsat",
        detail: "En kategorisk märkning efter livsmedelstyp, inte ett mätt gränsvärde. Beläggen kopplar ultraprocessad kost till tarmbesvär på hela kostens nivå, inte något enskilt livsmedel."
      },
      analysis: [
        "De här livsmedlen är raffinerade eller ultraprocessade kolhydratkällor — vitt bröd, socker, raffinerade spannmål och liknande — snarare än fullkorn, baljväxter eller grönsaker.",
        "Det här är en kategorisk märkning efter livsmedelstyp och bearbetning, inte efter kolhydratinnehåll."
      ]
    }
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
    ],
    sv: {
      label: "Laktos",
      evidence: {
        level: "Väl belagt",
        detail: "Utandningstest med väte, gentest för laktaspersistens och blindade dos-responsstudier. En av de bäst kartlagda födoämnesintoleranserna som finns."
      },
      analysis: [
        "De här livsmedlen är laktosrika. Laktos är ett mjölksocker som kan ge gaser, uppblåsthet och diarré hos laktosintoleranta, och obehag hos vem som helst vid högt intag.",
        "Se artikeln om Laktos för typerna, överlappet med IBS och varför nydebuterad intolerans hos vuxna bör utredas."
      ]
    }
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
    ],
    sv: {
      label: "Histamin",
      evidence: {
        level: "Väl belagt",
        detail: "Uppmätta histaminhalter i livsmedel, och en väl kartlagd enzymmekanism (DAO) för varför det påverkar vissa och inte andra."
      },
      analysis: [
        "De här livsmedlen innehåller antingen histamin eller bildar det under fermentering, mognad eller när färskheten avtar. Mekanismen är väl belagd: histamin bryts ner av DAO i tarmen, och där enzymaktiviteten är nedsatt når mer av det blodet.",
        "Halterna varierar enormt mellan produkter och mellan satser — lagrad ost ligger allt från omätbart till nästan 400 mg/kg. Färskhet och lagringstid spelar ofta större roll än vilket livsmedel det är.",
        "Fermentering i sig räcker inte som förklaring. Yoghurt och färskost är inte taggade, eftersom en kort syrning med definierad startkultur aldrig frigör det fria histidin som bakterierna behöver som substrat."
      ]
    }
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
    ],
    sv: {
      label: "DAO-hämmare",
      evidence: {
        level: "Preliminärt",
        detail: "Enbart enzymanalyser i provrör och djurmodeller. Inga humanstudier, och ingen tröskel för effekt är fastställd."
      },
      analysis: [
        "De här livsmedlen innehåller putrescin eller kadaverin — diaminer som konkurrerar med histamin om samma enzym, DAO. De tillför inget eget histamin, men kan i teorin bromsa nedbrytningen av det histamin måltiden ändå innehåller.",
        "Det här är verktygets svagast belagda tagg. Den vilar på enzymanalyser i provrör och på djurmodeller; humanstudier saknas. Ingen tröskel för effekt är fastställd, och effekten verkar bero på förhållandet mellan aminerna snarare än på mängden i något enskilt livsmedel.",
        "Sannolikt bara relevant för särskilt känsliga personer, och bara tillsammans med histaminrik mat — därför visas den bara när urvalet också innehåller histamin. Ett livsmedel med mycket putrescin men utan histamin har inget att konkurrera med."
      ]
    }
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
    ],
    sv: {
      label: "Salicylater",
      evidence: {
        level: "Begränsat",
        detail: "En blindad koststudie, negativ som helhet, med tydligt svar hos en enda deltagare. Halterna i livsmedel kommer från ett lands mätningar och motsäger ett annat lands."
      },
      analysis: [
        "De här livsmedlen innehåller minst 1 mg salicylsyra per normal portion. Salicylsyra är samma verksamma princip som i acetylsalicylsyra, och känslighet visar sig som nässelutslag, klåda, huvudvärk och tarmbesvär.",
        "Den enda blindade koststudien (Tuck 2021, n=10 vid IBS) var negativ som helhet. Tydlig symtomprovokation uppträdde hos en enda deltagare — den med känd acetylsalicylsyrautlöst urtikaria — och en tendens hos ytterligare en. Uppskattad förekomst ligger runt 2,5 %.",
        "Fråga om reaktioner på acetylsalicylsyra eller NSAID. Det är den fenotyp där signalen faktiskt finns, och en bättre ingång än kostmönstret i sig.",
        "Tillagningen spelar större roll än vilket livsmedel som väljs: skalning sänker halten tre till fyra gånger och kokning sänker den, medan inläggning, marinering och koncentrering höjer den. Siffrorna kommer från australiska mätningar — en europeisk studie hittade inga salicylater alls i polska äppel- och päronsorter, och nordiska data saknas."
      ]
    }
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
    ],
    sv: {
      label: "Alkohol",
      evidence: {
        level: "Väl belagt",
        detail: "Både slemhinnepåverkan och avslappningen av matstrupsmuskeln är uppmätta. Hur mycket som krävs för att ge besvär är mindre klarlagt än mekanismen."
      },
      analysis: [
        "De här livsmedlen eller dryckerna innehåller alkohol, som direkt kan irritera tarmslemhinnan, slappna av den nedre matstrupsmuskeln (och förvärra reflux) samt påverka lever- och bukspottkörtelfunktion vid regelbundet högt intag."
      ]
    }
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
    ],
    sv: {
      label: "Koffein",
      evidence: {
        level: "Väl belagt",
        detail: "Uppmätta effekter på tjocktarmens motorik och på syrasekretionen. Om det blir ett symtom varierar stort mellan personer."
      },
      analysis: [
        "De här livsmedlen eller dryckerna innehåller koffein, som stimulerar tarmmotoriken och syrasekretionen och kan förvärra besvär vid IBS, GERD eller allmän tarmkänslighet."
      ]
    }
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
    ],
    sv: {
      label: "Irriterande",
      evidence: {
        level: "Begränsat",
        detail: "Ett paraply över mekanismer som spänner från väl uppmätta till enbart klinisk erfarenhet. De specifika taggarna under bär sina egna nivåer."
      },
      analysis: [
        "De här livsmedlen kan förvärra besvär vid GERD, IBS, gallbesvär och allmän tarmkänslighet genom skiftande mekanismer — vissa väl belagda, andra grundade på klinisk erfarenhet.",
        "Se artikeln om Tarmirriterande ämnen för de mekanismer som följs var för sig."
      ]
    }
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
    ],
    sv: {
      label: "Capsaicin",
      evidence: {
        level: "Väl belagt",
        detail: "TRPV1-aktiveringen är väl kartlagd, och capsaicinprovokation återskapar smärta vid IBS. Regelbunden exponering desensibiliserar, vilket är varför toleransen skiljer sig så mycket."
      },
      analysis: [
        "Capsaicin, ämnet som ger chilifrukter deras hetta, aktiverar direkt smärt- och värmereceptorer (TRPV1) i tarmslemhinnan och kan även stimulera CCK-frisättning.",
        "Söt paprika (icke-stark) innehåller lite eller inget capsaicin och omfattas inte av den här taggen."
      ]
    }
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
    ],
    sv: {
      label: "Skal",
      evidence: {
        level: "Preliminärt",
        detail: "Rimligt utifrån fiberinnehållet och ämnena det gäller, men knappt undersökt direkt. Lätt att pröva på egen hand — ta bort skalet och se."
      },
      analysis: [
        "Skalet på de här livsmedlen är svårare att smälta än fruktköttet — det koncentrerar olöslig fiber och i vissa fall specifika irriterande ämnen (som cucurbitaciner i gurkskal) som det inre fruktköttet har mycket mindre av.",
        "Att skala är ett enkelt sätt att pröva om det är skalet som är utlösaren snarare än livsmedlet som helhet."
      ]
    }
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
    ],
    sv: {
      label: "Allyl- och svavelföreningar",
      evidence: {
        level: "Preliminärt",
        detail: "Mekanismen är visad i cell- och djurförsök. I riktig mat följer de här ämnena med fruktanerna, så vad någon reagerar på är svårt att skilja ut."
      },
      analysis: [
        "Rå vitlök, rå lök, senap och liknande innehåller skarpa svavelbaserade ämnen (allicin, isotiocyanater) som direkt irriterar tarmslemhinnan via en annan väg än capsaicin.",
        "Tillagning kan minska, men tar inte alltid bort, den här effekten."
      ]
    }
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
    ],
    sv: {
      label: "Kolsyra",
      evidence: {
        level: "Begränsat",
        detail: "Magsäcksutvidgningen av koldioxid är mätbar och små studier visar mer rapningar och reflux. Effekterna längre ner i tarmen är mindre klarlagda."
      },
      analysis: [
        "Koldioxiden i kolsyrade drycker vidgar magsäcken och kan förvärra uppblåsthet, rapningar och refluxbesvär, oberoende av dryckens socker- eller koffeininnehåll."
      ]
    }
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
    ],
    sv: {
      label: "Ättiksyra",
      evidence: {
        level: "Preliminärt",
        detail: "I stort sett klinisk erfarenhet. Det finns inga studier av ättika vid tarmbesvär, och syran i en normal portion är liten bredvid magsyran."
      },
      analysis: [
        "Ättiksyra (den verksamma beståndsdelen i ättika) är sur nog att direkt irritera tarmslemhinnan och matstrupen hos vissa, särskilt outspädd eller i stora mängder."
      ]
    }
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
    ],
    sv: {
      label: "Mjölk",
      evidence: {
        level: "Väl belagt",
        detail: "Kasein och vassle är väl kartlagda allergener med standardiserad diagnostik."
      },
      analysis: [
        "Komjölksallergi förmedlas främst av kasein- och vassleproteiner — skilt från laktosintolerans, som är ett enzymproblem i matsmältningen och inte immunologiskt."
      ]
    }
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
    ],
    sv: {
      label: "Ägg",
      evidence: {
        level: "Väl belagt",
        detail: "Ovalbumin och ovomukoid är väl kartlagda, och ovomukoidtest förutsäger om bakat ägg tolereras."
      },
      analysis: [
        "Äggallergi förmedlas främst av proteiner i äggvitan (ovalbumin, ovomukoid). Gulan är mindre allergen men inte nödvändigtvis säker för någon med äggallergi."
      ]
    }
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
    ],
    sv: {
      label: "Glutenspannmål",
      evidence: {
        level: "Väl belagt",
        detail: "Väl kartlagda allergenproteiner med standardiserad diagnostik, skilt från celiaki och från glutenkänslighet."
      },
      analysis: [
        "EU deklarerar vete, råg, korn, havre, dinkel och kamut som en grupp. Veteallergi är en immunreaktion mot veteproteiner — skilt från celiaki och från icke-celiakisk glutenkänslighet, som inte är klassiska IgE-medierade allergier."
      ]
    }
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
    ],
    sv: {
      label: "Fisk",
      evidence: {
        level: "Väl belagt",
        detail: "Parvalbumin är väl kartlagt, och komponenttest skiljer fiskallergi från skaldjursallergi."
      },
      analysis: [
        "Fiskallergi förmedlas främst av parvalbumin, ett muskelprotein — ett annat allergen än skaldjurens tropomyosin, så allergi mot det ena innebär inte nödvändigtvis allergi mot det andra."
      ]
    }
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
    ],
    sv: {
      label: "Kräftdjur",
      evidence: {
        level: "Väl belagt",
        detail: "Tropomyosin är väl kartlagt och testbart."
      },
      analysis: [
        "Räka, krabba, hummer och kräfta. Allergenet är tropomyosin, vilket är varför en reaktion på ett kräftdjur oftast betyder reaktion på de andra.",
        "Blötdjur bär ett besläktat men skilt tropomyosin och deklareras separat i EU — många reagerar på den ena gruppen men inte den andra."
      ]
    }
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
    ],
    sv: {
      label: "Blötdjur",
      evidence: {
        level: "Väl belagt",
        detail: "Ett deklarationspliktigt allergen i egen rätt, med tropomyosin återigen som huvudprotein."
      },
      analysis: [
        "Musslor, ostron, bläckfisk och sniglar. Tropomyosinet här skiljer sig tillräckligt från kräftdjurens för att de två ska deklareras separat och ofta tolereras separat."
      ]
    }
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
    ],
    sv: {
      label: "Jordnöt",
      evidence: {
        level: "Väl belagt",
        detail: "Bland de mest studerade av alla allergener, med komponenttest (Ara h 2) och etablerad immunterapi."
      },
      analysis: [
        "Jordnötsallergi är en av de vanligaste svåra födoämnesallergierna. Jordnöt är en baljväxt, inte en trädnöt, och jordnötsallergi förutsäger inte tillförlitligt allergi mot trädnötter."
      ]
    }
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
    ],
    sv: {
      label: "Trädnöt",
      evidence: {
        level: "Väl belagt",
        detail: "Väl kartlagda proteiner, med komponenttest som skiljer de enskilda nötterna åt."
      },
      analysis: [
        "Trädnötsallergi (mandel, cashew, valnöt, hasselnöt, paranöt med flera) är botaniskt och kliniskt skild från jordnötsallergi."
      ]
    }
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
    ],
    sv: {
      label: "Soja",
      evidence: {
        level: "Väl belagt",
        detail: "Väl kartlagt, även om sojaallergi diagnostiseras mindre enhetligt än de övriga."
      },
      analysis: [
        "Sojaallergi förmedlas av flera sojaproteiner och kan ibland korsreagera med jordnöt, eftersom båda är baljväxter."
      ]
    }
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
    ],
    sv: {
      label: "Sesam",
      evidence: {
        level: "Väl belagt",
        detail: "Ett erkänt huvudallergen med standardiserad diagnostik. Märkningskravet är nyare än beläggen bakom det."
      },
      analysis: [
        "Sesam kan ge svåra reaktioner och göms lätt — i tahini, i brödtoppingar och i oljor som inte alltid deklareras på en meny."
      ]
    }
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
    ],
    sv: {
      label: "Selleri",
      evidence: {
        level: "Väl belagt",
        detail: "Deklarationspliktigt i EU och sällan någon annanstans. Komponenttest finns (Api g 1), och björkkopplingen är väl dokumenterad."
      },
      analysis: [
        "Selleri och rotselleri är deklarationspliktiga allergener i EU men inte i USA, vilket är varför de missas oftare än förekomsten motiverar.",
        "Mycket av det går via björkpollen: Api g 1 tillhör samma PR-10-familj som björkallergenet, så sellerireaktioner dyker ofta upp hos personer som redan reagerar på äpple och hasselnöt. Till skillnad från de flesta PR-10-reaktioner kan selleri reagera även tillagad."
      ]
    }
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
    ],
    sv: {
      label: "Senap",
      evidence: {
        level: "Väl belagt",
        detail: "Deklarationspliktigt i EU, med kartlagda fröproteiner. Förekomsten är låg men reaktionerna kan bli svåra."
      },
      analysis: [
        "Senap är ett deklarationspliktigt allergen i EU. Reaktioner är ovanliga men kan bli svåra, och senap dyker upp oanmält i dressingar, remoulad, korv och kryddblandningar."
      ]
    }
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
    ],
    sv: {
      label: "Sulfiter",
      evidence: {
        level: "Begränsat",
        detail: "Deklarationspliktigt över 10 mg/kg, och astmakopplingen är dokumenterad. Utanför astma är bilden tunnare, och mekanismen är inte IgE."
      },
      analysis: [
        "Sulfiter är deklarationspliktiga över 10 mg/kg. De är konserveringsmedel och inte proteiner, så reaktionen är ingen äkta allergi — den bäst dokumenterade är luftrörssammandragning hos personer med astma.",
        "Vin, torkad frukt som behållit färgen och vissa inlagda produkter är de vanliga källorna."
      ]
    }
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
    ],
    sv: {
      label: "Lök och vitlök",
      evidence: {
        level: "Begränsat",
        detail: "Fallrapporter och pricktestdata, inga populationsstudier. Överlappet med fruktanintolerans gör de två svåra att skilja åt."
      },
      analysis: [
        "Allium-allergi — lök, vitlök, purjolök, schalottenlök — är inte deklarationspliktig någonstans, så ingenting på en förpackning varnar för den.",
        "Den förväxlas lätt med den fruktanintolerans som samma livsmedel också ger, och de två behöver olika svar: fruktaner är dosberoende och tillagning hjälper inte, medan en allergi inte är det. Om lök och vitlök återkommer, kolla om reaktionen är omedelbar och i munnen, eller fördröjd och i magen."
      ]
    }
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
    ],
    sv: {
      label: "Svamp",
      evidence: {
        level: "Begränsat",
        detail: "Dokumenterat i fallserier och yrkesstudier, mest som inhalationssensibilisering mot sporer. Reaktioner på att äta svamp rapporteras men bekräftas sällan med provokation."
      },
      analysis: [
        "Svampallergi är inte deklarationspliktig, och det mesta som är dokumenterat gäller inandning av sporer snarare än att äta svampen.",
        "Mykoproteinprodukter som Quorn hör hit också: de görs av en svamp, och reaktioner har rapporterats hos personer utan annan födoämnesallergi."
      ]
    }
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
    ],
    sv: {
      label: "Korsreaktion",
      evidence: {
        level: "Väl belagt",
        detail: "Oralt allergisyndrom är väl dokumenterat och de gemensamma proteinfamiljerna är identifierade och testbara. Vilka livsmedel som utlöser varierar med person och pollensäsong."
      },
      analysis: [
        "De här livsmedlen kan utlösa oralt allergisyndrom (OAS) hos personer med vissa pollenallergier, på grund av strukturellt liknande proteiner. Reaktionerna är oftast milda och försvinner ofta vid tillagning.",
        "Se artikeln om Korsreaktivitet för de tre pollengrupperna."
      ]
    }
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
    ],
    sv: {
      label: "Alfa-gal-syndrom",
      evidence: {
        level: "Väl belagt",
        detail: "IgE mot alfa-gal är mätbart, fästingvägen är etablerad, och den fördröjda reaktionen har återskapats vid provokation."
      },
      analysis: [
        "De här livsmedlen är kött från däggdjur, som kan utlösa en fördröjd allergisk reaktion (alfa-gal-syndrom) hos personer som sensibiliserats av ett tidigare fästingbett. Reaktionerna kommer ofta 3–8 timmar efter måltiden, vilket gör kopplingen till maten lätt att missa.",
        "Se artikeln om Alfa-gal-syndrom för fästingmekanismen och diagnostiken."
      ]
    }
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
    ],
    sv: {
      label: "Björkpollen",
      evidence: {
        level: "Väl belagt",
        detail: "PR-10-korsreaktivitet är väl dokumenterad, och komponenttest (Bet v 1) är rutin."
      },
      analysis: [
        "Relevant för personer med björkpollenallergi, på grund av en gemensam proteinfamilj (PR-10) mellan björkpollen och de här livsmedlen — klassiskt äpple, stenfrukt, morot, selleri och rotselleri, hasselnöt och soja."
      ]
    }
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
    ],
    sv: {
      label: "Gräspollen",
      evidence: {
        level: "Begränsat",
        detail: "Dokumenterat, men mindre konsekvent än björkmönstret — proteinerna som är inblandade är mer skiftande och livsmedelslistan mindre fastlagd."
      },
      analysis: [
        "Relevant för personer med gräspollenallergi. Korsreagerande proteiner finns i livsmedel som melon, vattenmelon, tomat, apelsin, jordnöt och potatis."
      ]
    }
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
    ],
    sv: {
      label: "Gråbopollen",
      evidence: {
        level: "Väl belagt",
        detail: "Selleri-gråbo-kryddsyndromet är väl dokumenterat i Europa, med komponenttest (Art v 1, Art v 3). Flockblomstriga växter och kryddor är den solida delen; frukterna som rapporteras vid sidan är tunnare belagda."
      },
      analysis: [
        "Relevant för personer med gråbopollenallergi — vanligt i Sverige och ofta missat, eftersom gråbo blommar sent och får skulden lagd på slutet av gräsäsongen.",
        "Det klassiska mönstret är selleri, morot och de flockblomstriga kryddorna, tillsammans med korgblommiga växter som delar gråbons egen familj: kamomill, solrosfrö, sallat och kronärtskocka. Kryddorna är det som lurar folk, eftersom en tesked i en dressing räcker och ingenting på menyn nämner det.",
        "Till skillnad från de flesta björkreaktioner kan selleri här reagera även tillagad."
      ]
    }
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
    ],
    sv: {
      label: "Latex",
      evidence: {
        level: "Väl belagt",
        detail: "Latex-frukt-syndromet är väl dokumenterat, med kitinasproteinerna identifierade och testbara."
      },
      analysis: [
        "Relevant för personer med latexallergi (till exempel vårdpersonal). Korsreagerande proteiner (främst kitinaser) finns i livsmedel som banan, avokado, kiwi och papaya."
      ]
    }
  }
};

/* See "FILTER LIST LAYOUT" in the comment block above for the shape of
   each entry. */
const FILTER_SECTIONS = [
  {
    title: "GI Irritants",
    sv: "GI-irriterande",
    noun: "irritant",
    broad: "irritant",
    group: "GI Irritants"
  },
  {
    title: "FODMAPs",
    sv: "FODMAP",
    noun: "FODMAP",
    broad: "fodmaps",
    group: "FODMAPs"
  },
  {
    title: "Other Digestive Factors",
    sv: "Övriga matsmältningsfaktorer",
    items: ["fiber", "histamine", "dao_competitor", "salicylate", "bile_stimulant", "refined_carbs", "allergen_sulphite"]
  },
  {
    title: "Allergens",
    sv: "Allergener",
    noun: "allergen",
    group: "Allergens",
    wide: true
  },
  {
    title: "Cross-Reactivity & Delayed Allergy",
    sv: "Korsreaktivitet & fördröjd allergi",
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
    sv: "Rotfrukter",
    foods: [
      { name: "Beet Root", sv: "Rödbeta", lmv: "Rödbeta", portion: 80, traits: ["fodmaps", "fructans", "salicylate"] },
      { name: "Carrot", sv: "Morot", lmv: "Morot", portion: 80, traits: ["cross_reactive", "cross_birch", "cross_mugwort"] },
      { name: "Celeriac Root", sv: "Rotselleri", lmv: "Rotselleri", portion: 80, traits: ["cross_reactive", "cross_birch", "allergen_celery", "cross_mugwort"] },
      { name: "Jerusalem Artichoke", sv: "Jordärtskocka", lmv: "Jordärtskocka", portion: 80, traits: ["fodmaps", "fructans", "cross_reactive", "cross_mugwort"] },
      { name: "Parsnip", sv: "Palsternacka", lmv: "Palsternacka", portion: 80, traits: ["cross_reactive", "cross_mugwort"] },
      { name: "Potato", sv: "Potatis", lmv: "Potatis rå", portion: 175, traits: ["cross_reactive", "cross_birch", "cross_grass"] },
      { name: "Swede", sv: "Kålrot", lmv: "Kålrot", portion: 80, traits: [] },
      { name: "Sweet Potato", sv: "Sötpotatis", lmv: "Sötpotatis rå", portion: 175, traits: ["fiber", "salicylate"] },
      { name: "Radish", sv: "Rädisa", lmv: "Rädisa", portion: 30, traits: ["irritant"] },
      { name: "Turnip", sv: "Rova", lmv: "Majrova", portion: 80, traits: [] },
      { name: "Horseradish", sv: "Pepparrot", lmv: "Pepparrot", portion: 5, traits: ["irritant"] },
      { name: "Black Salsify", sv: "Svartrot", lmv: "Svartrot", portion: 80, traits: ["fodmaps", "fructans"] },
      { name: "Kohlrabi", sv: "Kålrabbi", lmv: "Kålrabbi", portion: 80, traits: ["fodmaps", "fructans"] },
      { name: "Cassava", sv: "Kassava", portion: 175, traits: [] },
      { name: "Yam", sv: "Jams", lmv: "Jams kokt u. salt", portion: 175, traits: [] },
      { name: "Taro", sv: "Taro", portion: 175, traits: ["fodmaps", "fructans", "fiber"] },
      { name: "Lotus Root", sv: "Lotusrot", portion: 80, traits: [] }
    ]
  },
  {
    id: "veggies",
    label: "Vegetables",
    sv: "Grönsaker",
    foods: [
      { name: "Cabbage", sv: "Vitkål", lmv: "Vitkål", portion: 100, traits: ["fodmaps", "fructans"] },
      { name: "Kale", sv: "Grönkål", lmv: "Grönkål", portion: 100, traits: [] },
      { name: "Onion", sv: "Gul lök", lmv: "Lök gul", portion: 60, traits: ["fodmaps", "fructans", "irritant", "allyl_compounds", "allergen_onion"] },
      { name: "Tomato", sv: "Tomat", form: "fresh", lmv: "Tomat", portion: 100, traits: ["histamine", "irritant", "cross_reactive", "cross_grass", "cross_latex", "dao_competitor"] },
      // Named dried but carries no `form`: the only entry is the oil-packed
      // jar, which is rehydrated and half water, so "dried" would be false.
      { name: "Sun-dried Tomato", sv: "Soltorkad tomat", lmv: "Tomat torkad m. olja", lmvNote: "the oil-packed jar, which is what is usually sold — rehydrated and drained of its oil, so it is neither dry nor fresh; dry-packed carries less water and much less fat", portion: 15, traits: ["histamine", "irritant", "cross_reactive", "cross_grass", "cross_latex", "dao_competitor"] },
      { name: "Cauliflower", sv: "Blomkål", lmv: "Blomkål", portion: 100, traits: ["fodmaps", "fructans"] },
      { name: "Aubergine", sv: "Aubergine", lmv: "Aubergine", portion: 100, traits: ["histamine", "fodmaps", "fructans", "dao_competitor"] },
      { name: "Parsley", sv: "Persilja", form: "fresh", lmv: "Persilja blad", portion: 5, traits: ["cross_reactive", "cross_mugwort"] },
      { name: "Leek", sv: "Purjolök", lmv: "Purjolök", portion: 60, traits: ["fodmaps", "fructans", "allergen_onion"] },
      { name: "Spinach", sv: "Spenat", lmv: "Spenat frysvara", portion: 100, traits: ["histamine"] },
      { name: "Avocado", sv: "Avokado", lmv: "Avokado", portion: 50, traits: ["over_10g_fat", "bile_stimulant", "cross_reactive", "cross_latex", "fodmaps", "polyols", "salicylate"] },
      { name: "Cucumber", sv: "Gurka", lmv: "Gurka", portion: 100, traits: ["irritant", "peel_skin"] },
      { name: "Bell Pepper (sweet)", sv: "Paprika (söt)", lmv: "Paprika röd", portion: 100, traits: ["irritant"] },
      { name: "Bell Pepper (hot)", sv: "Chilipeppar", lmv: "Chilipeppar färsk", portion: 5, traits: ["irritant", "capsaicin"] },
      // Monash measures excess fructose here, not fructans — checked in the app.
      { name: "Asparagus", sv: "Sparris", lmv: "Sparris grön kokt m. salt", portion: 100, traits: ["fodmaps", "fructose"] },
      { name: "Fennel Bulb", sv: "Fänkål", lmv: "Fänkål", portion: 100, traits: ["fodmaps", "fructans", "cross_reactive", "cross_mugwort"] },
      { name: "Broccoli", sv: "Broccoli", lmv: "Broccoli", portion: 100, traits: ["fodmaps", "fructans"] },
      { name: "Brussels Sprouts", sv: "Brysselkål", lmv: "Brysselkål", portion: 100, traits: ["fodmaps", "fructans", "galactans"] },
      { name: "Green Beans", sv: "Haricots verts", lmv: "Gröna bönor", portion: 100, traits: ["salicylate"] },
      { name: "Zucchini", sv: "Squash", lmv: "Squash", portion: 100, traits: [] },
      { name: "Pumpkin", sv: "Pumpa", lmv: "Pumpa", portion: 100, traits: ["dao_competitor"] },
      { name: "Swiss Chard", sv: "Mangold", lmv: "Mangold", portion: 100, traits: [] },
      { name: "Romaine Lettuce", sv: "Romansallat", lmv: "Romansallat", portion: 100, traits: ["cross_reactive", "cross_mugwort"] },
      { name: "Rocket", sv: "Ruccola", lmv: "Ruccolasallat", portion: 20, traits: ["irritant"] },
      { name: "Celery", sv: "Stjälkselleri", lmv: "Stjälkselleri", portion: 100, traits: ["fodmaps", "polyols", "cross_reactive", "cross_birch", "allergen_celery", "cross_mugwort"] },
      { name: "Bok Choy", sv: "Pak choi", lmv: "Sellerikål pak choi", portion: 100, traits: [] },
      { name: "Daikon Radish", sv: "Rättika", lmv: "Rättika", portion: 80, traits: ["irritant"] },
      { name: "Rhubarb", sv: "Rabarber", lmv: "Rabarber tillagad u. socker", portion: 100, traits: [] },
      { name: "Sweetcorn", sv: "Majs", lmv: "Majskorn frysvara", portion: 100, traits: ["fodmaps", "polyols", "fructans", "salicylate"] },
      { name: "Shallot", sv: "Schalottenlök", lmv: "Lök gul", lmvNote: "yellow onion — shallot is not listed", portion: 5, traits: ["fodmaps", "fructans", "irritant", "allyl_compounds", "allergen_onion"] },
      { name: "Spring Onion", sv: "Salladslök", portion: 5, traits: ["fodmaps", "fructans", "irritant", "allyl_compounds", "allergen_onion"] },
      { name: "Globe Artichoke", sv: "Kronärtskocka", lmv: "Kronärtskocka kokt", portion: 100, traits: ["fodmaps", "fructans", "cross_reactive", "cross_mugwort"] },
      { name: "Okra", sv: "Okra", lmv: "Okra kokt u. salt", portion: 100, traits: ["fodmaps", "fructans"] }
    ]
  },
  {
    id: "fruits",
    label: "Fruits",
    sv: "Frukt",
    foods: [
      { name: "Apples", sv: "Äpple", lmv: "Äpple m. skal", portion: 100, traits: ["fodmaps", "fructose", "polyols", "irritant", "peel_skin", "cross_reactive", "cross_birch", "salicylate"] },
      { name: "Oranges", sv: "Apelsin", lmv: "Apelsin", portion: 100, traits: ["cross_reactive", "cross_grass", "dao_competitor"] },
      { name: "Pears", sv: "Päron", lmv: "Päron", portion: 100, traits: ["fodmaps", "fructose", "polyols", "irritant", "peel_skin", "cross_reactive", "cross_birch", "salicylate"] },
      { name: "Mangos", sv: "Mango", lmv: "Mango", portion: 100, traits: ["fodmaps", "fructose", "cross_reactive", "cross_mugwort"] },
      { name: "Lemon", sv: "Citron", lmv: "Citron", portion: 5, traits: ["dao_competitor"] },
      { name: "Lime", sv: "Lime", lmv: "Lime", portion: 5, traits: ["dao_competitor"] },
      { name: "Grapefruit", sv: "Grapefrukt", lmv: "Grapefrukt", portion: 100, traits: ["dao_competitor"] },
      { name: "Grapes", sv: "Vindruvor", lmv: "Vindruvor", portion: 100, traits: ["salicylate"] },
      { name: "Banana", sv: "Banan", lmv: "Banan", portion: 100, traits: ["cross_reactive", "cross_latex", "dao_competitor"] },
      { name: "Kiwi", sv: "Kiwi", lmv: "Kiwi grön", portion: 100, traits: ["salicylate", "cross_reactive", "cross_birch", "cross_grass", "cross_latex"] },
      { name: "Pineapple", sv: "Ananas", lmv: "Ananas", portion: 100, traits: ["cross_reactive", "cross_latex"] },
      { name: "Papaya", sv: "Papaya", lmv: "Papaya", portion: 100, traits: ["cross_reactive", "cross_latex"] },
      { name: "Watermelon", sv: "Vattenmelon", lmv: "Vattenmelon", portion: 100, traits: ["fodmaps", "fructose", "cross_reactive", "cross_grass", "salicylate"] },
      { name: "Melon", sv: "Melon", lmv: "Nätmelon", portion: 100, traits: ["cross_reactive", "cross_grass"] },
      { name: "Apricot", sv: "Aprikos", lmv: "Aprikos", portion: 100, traits: ["cross_reactive", "cross_birch", "fodmaps", "polyols"] },
      { name: "Plum", sv: "Plommon", lmv: "Plommon", portion: 100, traits: ["cross_reactive", "cross_birch", "fodmaps", "polyols"] },
      { name: "Figs", sv: "Fikon", lmv: "Fikon", portion: 100, traits: ["fodmaps", "fructose"] },
      { name: "Pomegranate", sv: "Granatäpple", lmv: "Granatäpple", portion: 100, traits: ["salicylate"] },
      { name: "Lychee", sv: "Litchi", lmv: "Litchi", portion: 100, traits: ["fructose", "fodmaps", "polyols", "cross_reactive", "cross_mugwort"] },
      { name: "Star Fruit", sv: "Stjärnfrukt", lmv: "Carambole stjärnfrukt", portion: 100, traits: [] },
      { name: "Durian", sv: "Durian", portion: 100, traits: ["fodmaps", "fructose"] },
      { name: "Peach", sv: "Persika", lmv: "Persika", portion: 100, traits: ["fodmaps", "polyols", "cross_reactive", "cross_birch"] },
      { name: "Nectarine", sv: "Nektarin", lmv: "Nektarin", portion: 100, traits: ["fodmaps", "polyols", "cross_reactive", "cross_birch", "salicylate"] },
      { name: "Passion Fruit", sv: "Passionsfrukt", lmv: "Passionsfrukt", portion: 5, traits: [] },
      // Monash: low FODMAP up to 64g, moderate fructans above that — a whole
      // persimmon is ~170g, so a normal serving is over the line.
      { name: "Persimmon", sv: "Persimon", lmv: "Sharon", portion: 100, traits: ["fodmaps", "fructans", "salicylate"] },
      /* Fruit canned in syrup. Frida analyses very little fruit dried but a
         good deal of it in syrup, which is also what a Swedish shop stocks —
         so this row exists where the dried one could not be sourced. Each is
         its fresh fruit's traits plus refined_carbs for the syrup, which is
         how Canned Peaches was already built. Pear loses peel_skin: canned
         pears are peeled. */
      { name: "Canned Peaches in Syrup", sv: "Persika i sockerlag", lmv: "Persika konserv. m. sockerlag", portion: 100, traits: ["fodmaps", "polyols", "refined_carbs", "cross_reactive", "cross_birch"] },
      // No `irritant`: the fresh pear carries the umbrella for its peel and
      // nothing else, and a canned pear is peeled. Dropping peel_skin without
      // it left the umbrella standing on a mechanism that had been removed —
      // and made this the one canned fruit tagged an irritant.
      { name: "Canned Pears in Syrup", sv: "Päron i sockerlag", lmv: "Päron konserv. m. sockerlag", portion: 100, traits: ["fodmaps", "fructose", "polyols", "refined_carbs", "cross_reactive", "cross_birch", "salicylate"] },
      { name: "Canned Pineapple in Syrup", sv: "Ananas i sockerlag", lmv: "Ananas konserv. m. sockerlag", portion: 100, traits: ["refined_carbs", "cross_reactive", "cross_latex"] },
      { name: "Canned Apricots in Syrup", sv: "Aprikos i sockerlag", lmv: "Aprikos konserv. m. sockerlag", portion: 100, traits: ["fodmaps", "polyols", "refined_carbs", "cross_reactive", "cross_birch"] },
      { name: "Canned Cherries in Syrup", sv: "Körsbär i sockerlag", lmv: "Körsbär surkörsbär konserv. m. sockerlag", lmvNote: "sour cherries — the only canned cherry listed, where fresh Cherries above is the sweet kind", portion: 100, traits: ["fodmaps", "polyols", "fructose", "refined_carbs", "cross_reactive", "cross_birch"] },
      { name: "Canned Strawberries in Syrup", sv: "Jordgubbar i sockerlag", portion: 100, traits: ["refined_carbs", "salicylate"] }
    ]
  },
  {
    id: "berries",
    label: "Berries",
    sv: "Bär",
    foods: [
      { name: "Blueberry", sv: "Blåbär", lmv: "Blåbär", portion: 50, traits: [] },
      { name: "Strawberry", sv: "Jordgubbe", lmv: "Jordgubbar", portion: 50, traits: ["salicylate"] },
      { name: "Cherries", sv: "Körsbär", lmv: "Sötkörsbär", portion: 50, traits: ["fodmaps", "polyols", "fructose", "cross_reactive", "cross_birch"] },
      { name: "Blackberries", sv: "Björnbär", lmv: "Björnbär", portion: 50, traits: ["fodmaps", "polyols"] },
      { name: "Raspberries", sv: "Hallon", lmv: "Hallon", portion: 50, traits: [] },
      { name: "Cloudberries", sv: "Hjortron", lmv: "Hjortron", portion: 50, traits: [] },
      { name: "Lingonberry", sv: "Lingon", lmv: "Lingon", portion: 50, traits: [] },
      { name: "Redcurrant", sv: "Röda vinbär", lmv: "Vinbär röda", portion: 50, traits: [] },
      { name: "Blackcurrant", sv: "Svarta vinbär", lmv: "Vinbär svarta", portion: 50, traits: [] },
      { name: "Gooseberry", sv: "Krusbär", lmv: "Krusbär", portion: 50, traits: [] },
      { name: "Elderberry", sv: "Fläderbär", lmv: "Fläderbär", portion: 50, traits: [] },
      { name: "Cranberry", sv: "Tranbär", lmv: "Tranbär", portion: 50, traits: [] },
      { name: "Sea Buckthorn", sv: "Havtorn", lmv: "Havtorn", portion: 50, traits: [] },
      { name: "Aronia", sv: "Aronia", lmv: "Aronia svart", portion: 50, traits: ["fodmaps", "polyols"] },
      { name: "Mulberry", sv: "Mullbär", lmv: "Mullbär", portion: 50, traits: [] },
      { name: "Physalis", sv: "Physalis", lmv: "Physalis", portion: 50, traits: [] },
      { name: "Frozen Mixed Berries", sv: "Frysta blandade bär", lmv: "Hallon blåbär frysvara", lmvNote: "raspberry and blueberry", portion: 50, traits: ["fodmaps", "polyols"] }
    ]
  },
  {
    id: "driedFruits",
    label: "Dried Fruits/Berries",
    sv: "Torkad frukt och bär",
    foods: [
      { name: "Dates", sv: "Dadlar", lmv: "Dadlar torkade", portion: 30, traits: ["fodmaps", "polyols", "fructans", "salicylate"] },
      { name: "Raisins", sv: "Russin", lmv: "Russin", portion: 30, traits: ["fodmaps", "fructans"] },
      { name: "Sultanas", sv: "Sultanrussin", lmv: "Russin", portion: 30, traits: ["fodmaps", "fructans"] },
      { name: "Dried Apricot", sv: "Torkad aprikos", lmv: "Aprikos torkad", portion: 30, traits: ["cross_reactive", "cross_birch", "fodmaps", "polyols", "fructans", "allergen_sulphite"] },
      { name: "Dried Fig", sv: "Torkat fikon", lmv: "Fikon torkade", portion: 30, traits: ["fodmaps", "polyols", "fructans"] },
      { name: "Prunes", sv: "Katrinplommon", lmv: "Katrinplommon torkade", portion: 30, traits: ["cross_reactive", "cross_birch", "fodmaps", "polyols"] },
      { name: "Dried Cranberry (Added Sugar)", sv: "Torkade tranbär (sötade)", lmv: "Tranbär torkade", portion: 30, traits: ["fodmaps", "fructans", "refined_carbs"] },
      { name: "Dried Cranberry (No Sugar Added)", sv: "Torkade tranbär (osötade)", lmv: "Tranbär torkade", portion: 30, traits: ["fodmaps", "fructans"] },
      { name: "Dried Mango (Added Sugar)", sv: "Torkad mango (sötad)", lmv: "Mango torkad", lmvNote: "the database lists one dried mango and does not say whether sugar was added, so the sweetened kind is likely understated here", portion: 30, traits: ["fodmaps", "fructose", "refined_carbs", "allergen_sulphite", "cross_reactive", "cross_mugwort"] },
      { name: "Dried Mango (No Sugar Added)", sv: "Torkad mango (osötad)", lmv: "Mango torkad", portion: 30, traits: ["fodmaps", "fructose", "allergen_sulphite", "cross_reactive", "cross_mugwort"] },
      { name: "Dried Pineapple (Added Sugar)", sv: "Torkad ananas (sötad)", portion: 30, traits: ["fiber", "fodmaps", "fructose", "refined_carbs", "allergen_sulphite"] },
      { name: "Dried Pineapple (No Sugar Added)", sv: "Torkad ananas (osötad)", portion: 30, traits: ["fodmaps", "fructose", "fiber", "allergen_sulphite"] },
      { name: "Dried Papaya (Added Sugar)", sv: "Torkad papaya (sötad)", lmv: "Papaya torkad", lmvNote: "the database lists one dried papaya and does not say whether sugar was added, so the sweetened kind is likely understated here", portion: 30, traits: ["cross_reactive", "cross_latex", "refined_carbs", "allergen_sulphite"] },
      { name: "Dried Papaya (No Sugar Added)", sv: "Torkad papaya (osötad)", lmv: "Papaya torkad", portion: 30, traits: ["cross_reactive", "cross_latex", "allergen_sulphite"] },
      { name: "Dried Banana", sv: "Torkad banan", lmv: "Banan torkad", portion: 30, traits: ["cross_reactive", "cross_latex"] },
      { name: "Dried Apple", sv: "Torkat äpple", lmv: "Äpple torkat", portion: 30, traits: ["fodmaps", "fructose", "polyols", "irritant", "peel_skin", "cross_reactive", "cross_birch", "allergen_sulphite"] },
      { name: "Dried Pear", sv: "Torkat päron", lmv: "Päron torkade", portion: 30, traits: ["fodmaps", "fructose", "polyols", "irritant", "peel_skin", "cross_reactive", "cross_birch", "allergen_sulphite"] },
      { name: "Dried Blueberries (Added Sugar)", sv: "Torkade blåbär (sötade)", lmv: "Blåbär torkade", portion: 30, traits: ["refined_carbs"] },
      { name: "Dried Blueberries (No Sugar Added)", sv: "Torkade blåbär (osötade)", lmv: "Blåbär torkade", portion: 30, traits: [] },
      { name: "Dried Peach", sv: "Torkad persika", lmv: "Persika torkad", portion: 30, traits: ["fodmaps", "polyols", "cross_reactive", "cross_birch", "allergen_sulphite"] },
      { name: "Dried Coconut", sv: "Torkad kokos", lmv: "Kokosflingor", portion: 15, traits: ["over_10g_fat", "bile_stimulant", "allergen_sulphite"] },
      { name: "Dried Goji Berry", sv: "Torkade gojibär", lmv: "Gojibär torkade", portion: 30, traits: ["fodmaps", "fructans"] },
      { name: "Dried Kiwi (Added Sugar)", sv: "Torkad kiwi (sötad)", portion: 30, traits: ["cross_reactive", "cross_birch", "cross_grass", "cross_latex", "refined_carbs"] },
      { name: "Dried Kiwi (No Sugar Added)", sv: "Torkad kiwi (osötad)", portion: 30, traits: ["fiber", "cross_reactive", "cross_birch", "cross_grass", "cross_latex"] },
      { name: "Dried Tropical Fruit Mix", sv: "Torkad tropisk fruktmix", portion: 30, traits: ["refined_carbs", "fodmaps", "fructose", "polyols", "allergen_sulphite"] }
    ]
  },
  {
    id: "nuts",
    label: "Nuts/Seeds",
    sv: "Nötter och frön",
    foods: [
      { name: "Almond", sv: "Mandel", lmv: "Sötmandel", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "galactans", "salicylate", "allergen_treenut", "cross_reactive", "cross_birch"] },
      { name: "Brazil Nut", sv: "Paranöt", lmv: "Paranötter", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "galactans", "allergen_treenut"] },
      { name: "Cashew Nut", sv: "Cashewnöt", lmv: "Cashewnötter rostade u. salt", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "fructans", "galactans", "allergen_treenut"] },
      /* wholeSeed marks the seeds small and tough enough to be swallowed
         intact: the fiber is what acts on the gut while most of the fat stays
         locked inside the shell. Only flaxseed, chia and psyllium qualify.
         Pumpkin seeds are too large to swallow whole, and both they and sesame
         turn brittle when roasted, so both are tagged on their full content.
         Ground versions release everything and carry the fat tags. */
      { name: "Chiaseeds (whole)", sv: "Chiafrön (hela)", wholeSeed: true, lmv: "Chiafrö", portion: 20, traits: ["fiber"] },
      { name: "Chiaseeds (ground)", sv: "Chiafrön (malda)", lmv: "Chiafrö", portion: 20, traits: ["fiber", "over_10g_fat"] },
      { name: "Flaxseed (whole)", sv: "Linfrön (hela)", wholeSeed: true, lmv: "Linfrö hela", portion: 25, traits: ["fiber", "fodmaps", "fructans"] },
      { name: "Psyllium Husk (whole)", sv: "Psylliumfrön (hela)", wholeSeed: true, lmv: "Psylliumfröskal", portion: 10, traits: ["fiber"] },
      { name: "Psyllium Husk (ground)", sv: "Psylliumfrön (malda)", lmv: "Psylliumfröskal", portion: 10, traits: ["fiber"] },
      { name: "Flaxseed (ground)", sv: "Linfrön (malda)", lmv: "Linfrö hela", portion: 25, traits: ["fiber", "over_10g_fat", "bile_stimulant", "fodmaps", "fructans"] },
      { name: "Hazelnut", sv: "Hasselnöt", lmv: "Hasselnötter", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "fructans", "allergen_treenut", "cross_reactive", "cross_birch"] },
      { name: "Peanut", sv: "Jordnöt", lmv: "Jordnötter torkade", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "galactans", "allergen_peanut", "cross_reactive", "cross_grass"] },
      { name: "Pumpkin Seeds", sv: "Pumpafrön", lmv: "Pumpafrö", portion: 15, traits: ["over_10g_fat"] },
      { name: "Sunflower Seeds", sv: "Solrosfrön", lmv: "Solrosfrö", portion: 15, traits: ["over_10g_fat", "cross_reactive", "cross_mugwort"] },
      { name: "Walnut", sv: "Valnöt", lmv: "Valnötter", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen_treenut"] },
      { name: "Sesame Seeds", sv: "Sesamfrön", lmv: "Sesamfrö m. skal", portion: 5, traits: ["allergen_sesame"] },
      { name: "Macadamia", sv: "Macadamianöt", lmv: "Macadamianötter", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen_treenut"] },
      { name: "Pecan", sv: "Pekannöt", lmv: "Pekannötter", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen_treenut"] },
      // Chestnut is the odd one out here: ~2g fat, so no fat/bile tags. It is a
      // classic latex-fruit syndrome cross-reactor alongside banana/avocado/kiwi.
      { name: "Chestnut", sv: "Kastanj", lmv: "Kastanjer", portion: 60, traits: ["cross_reactive", "cross_latex"] },
      // From the SIGHI review (cleared there — SIGHI gave no mechanism).
      // Sources vary a lot (fiber 10-33g, fat 18-25g per 100g) but every one
      // of them clears both thresholds. Protein is only ~5g, so no protein tag.
      { name: "Pistachio", sv: "Pistagenöt", lmv: "Pistaschnötter u. salt", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "fructans", "galactans", "allergen_treenut"] },
      { name: "Pine Nuts", sv: "Pinjenötter", portion: 15, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "fructans", "allergen_treenut"] },
      { name: "Hemp Seeds", sv: "Hampafrön", lmv: "Hampafrö u. skal", portion: 15, traits: ["over_10g_fat"] },
      { name: "Poppy Seeds", sv: "Vallmofrön", lmv: "Vallmofrö", portion: 5, traits: [] },
      { name: "Sunflower Seed Butter", sv: "Solrosfröpasta", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "fructans", "cross_reactive", "cross_mugwort"] }
    ]
  },
  {
    id: "grains",
    label: "Grains/pseudo grains",
    sv: "Spannmål och pseudospannmål",
    foods: [
      // Oats, rye and barley are almost never eaten as bare grain, so the
      // products are what people actually recognise and react to. Wheat
      // already had its own spread of products further down this list.
      { name: "Oats", sv: "Havre", form: "dry", lmv: "Havregryn fullkorn", portion: 40, traits: ["fodmaps", "fructans", "allergen_wheat"] },
      { name: "Oat Porridge", sv: "Havregrynsgröt", form: "cooked", lmv: "Havregrynsgröt fullkorn", portion: 175, traits: ["fodmaps", "fructans", "allergen_wheat"] },
      { name: "Oat Bran", sv: "Havrekli", form: "dry", lmv: "Havrekli", portion: 20, traits: ["fodmaps", "fructans", "allergen_wheat"] },
      { name: "Muesli (no added sugar)", sv: "Müsli (utan tillsatt socker)", form: "dry", lmv: "Frukostflingor müsli fullkorn m. frukt", portion: 50, traits: ["fodmaps", "fructans", "allergen_wheat"] },
      { name: "Wheat", sv: "Vete", form: "cooked", lmv: "Matvete kokt m. salt", portion: 175, traits: ["fiber", "fodmaps", "fructans", "allergen_wheat"] },
      // Livsmedelsverket has no cooked rye, so the figures are the dry cracked
      // grain and the portion has to be dry too — 60g makes about 175g cooked.
      // At 175g the dry figures were three times what a plate holds, which is
      // also what put protein on it: 5.4g in a real portion, dose 15.
      { name: "Rye", sv: "Råg", form: "dry", lmv: "Rågkross ångprep. fullkorn", lmvNote: "cracked whole grain, dry weight — rye is not listed cooked", portion: 60, traits: ["fiber", "fodmaps", "fructans", "allergen_wheat"] },
      { name: "Rye Bread (whole grain)", sv: "Rågbröd (fullkorn)", lmv: "Bröd fullkorn råg fibrer ca 7%", portion: 40, traits: ["fodmaps", "fructans", "allergen_wheat"] },
      { name: "Pearl Barley (cooked)", sv: "Korngryn (kokta)", form: "cooked", lmv: "Korngryn kokt u. salt", portion: 175, traits: ["fodmaps", "fructans", "allergen_wheat"] },
      { name: "Barley", sv: "Korn", form: "cooked", lmv: "Korngryn kokt u. salt", portion: 175, traits: ["fodmaps", "fructans", "allergen_wheat"] },
      { name: "Quinoa", sv: "Quinoa", form: "cooked", lmv: "Mjölmålla quinoa röd kokt m. salt", portion: 175, traits: ["fiber"] },
      { name: "Buckwheat", sv: "Bovete", form: "dry", lmv: "Bovetemjöl", lmvNote: "flour", portion: 40, traits: [] },
      { name: "Rice", sv: "Ris", form: "cooked", lmv: "Ris råris kokt m. salt", portion: 175, traits: [] },
      { name: "Couscous", sv: "Couscous", form: "cooked", lmv: "Couscous kokt m. salt fullkorn", lmvNote: "wholegrain — the only cooked entry", portion: 175, traits: ["fiber", "refined_carbs", "fodmaps", "fructans", "allergen_wheat"] },
      { name: "Bulgur", sv: "Bulgur", form: "cooked", lmv: "Bulgur kokt", portion: 175, traits: ["fiber", "fodmaps", "fructans", "allergen_wheat"] },
      { name: "Freekeh", sv: "Freekeh", portion: 175, traits: ["allergen_wheat", "fodmaps", "fructans"] },
      { name: "Pita Bread", sv: "Pitabröd", lmv: "Bröd vitt vete vatten fibrer ca 3,5% typ pitabröd", portion: 60, traits: ["allergen_wheat", "fodmaps", "fructans", "refined_carbs"] },
      { name: "Naan Bread", sv: "Naanbröd", portion: 60, traits: ["allergen_wheat", "fodmaps", "fructans", "refined_carbs"] },
      { name: "Soba Noodles", sv: "Sobanudlar", portion: 175, traits: ["refined_carbs", "allergen_wheat", "fodmaps", "fructans"] },
      { name: "Rice Noodles", sv: "Risnudlar", form: "cooked", lmv: "Nudlar risnudlar kokta", portion: 175, traits: ["refined_carbs"] },
      { name: "White Bread", sv: "Vitt bröd", lmv: "Bröd vitt fibrer 3,5%", portion: 40, traits: ["allergen_wheat", "fodmaps", "fructans", "refined_carbs"] },
      { name: "Pasta (no egg)", sv: "Pasta (utan ägg)", form: "cooked", lmv: "Pasta kokt u. salt", portion: 175, traits: ["refined_carbs", "allergen_wheat", "fodmaps", "fructans"] },
      { name: "Teff", sv: "Teff", form: "dry", lmv: "Teffmjöl", lmvNote: "flour", portion: 40, traits: [] },
      { name: "Sorghum/Durra", sv: "Sorghum/durra", form: "dry", lmv: "Durra el. andra sorghumarter mjöl", lmvNote: "flour", portion: 40, traits: [] },
      { name: "Crispbread (rye)", sv: "Knäckebröd (råg)", lmv: "Hårt bröd fullkorn råg fibrer ca 13%", portion: 20, traits: ["fodmaps", "fructans", "allergen_wheat"] },
      { name: "Rice Cakes", sv: "Riskakor", portion: 20, traits: ["refined_carbs"] },
      { name: "Polenta", sv: "Polenta", form: "cooked", lmv: "Majsgryn polenta kokt m. salt", portion: 175, traits: [] },
      { name: "Millet", sv: "Hirs", form: "cooked", lmv: "Hirs kokt m. salt", portion: 175, traits: [] },
      { name: "Seitan", sv: "Seitan", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen_wheat"] },
      { name: "Tapioca", sv: "Tapioka", portion: 20, traits: [] },
      { name: "Cornstarch", sv: "Majsstärkelse", form: "dry", lmv: "Majsstärkelse", portion: 5, traits: ["refined_carbs"] },
      { name: "Sourdough Bread (wheat)", sv: "Surdegsbröd (vete)", portion: 40, traits: ["refined_carbs", "allergen_wheat"] },
      { name: "Gluten-free Bread", sv: "Glutenfritt bröd", lmv: "Bröd vitt glutenfritt", portion: 40, traits: ["refined_carbs"] },
      { name: "Gluten-free Crispbread", sv: "Glutenfritt knäckebröd", lmv: "Hårt bröd glutenfritt fibrer ca 7%", portion: 20, traits: ["refined_carbs"] },
      { name: "Gluten-free Pasta", sv: "Glutenfri pasta", form: "cooked", lmv: "Pasta kokt m. salt majs 100% glutenfri", lmvNote: "100 % maize — the wheat-starch kind is not listed", portion: 175, traits: ["refined_carbs"] },
      { name: "Gluten-free Oats", sv: "Glutenfri havre", form: "dry", lmv: "Havregryn fullkorn", lmvNote: "the same entry as ordinary oats — the difference is contamination, not composition", portion: 40, traits: ["fodmaps", "fructans", "allergen_wheat"] },
      { name: "Spelt", sv: "Dinkel", form: "cooked", lmv: "Dinkel speltvete kokt m. salt", portion: 175, traits: ["fiber", "fodmaps", "fructans", "allergen_wheat"] },
      { name: "Semolina Porridge", sv: "Mannagrynsgröt", form: "cooked", lmv: "Mannagrynsgröt", portion: 175, traits: ["refined_carbs", "fodmaps", "fructans", "allergen_wheat"] },
      { name: "Corn Tortilla", sv: "Majstortilla", portion: 60, traits: [] },
      { name: "Wheat Bran", sv: "Vetekli", form: "dry", lmv: "Vetekli", portion: 20, traits: ["fiber", "fodmaps", "fructans", "allergen_wheat"] },
      { name: "Rice Flour", sv: "Rismjöl", form: "dry", lmv: "Rismjöl vitt", portion: 40, traits: ["refined_carbs"] },
      { name: "Potato Flour", sv: "Potatismjöl", form: "dry", lmv: "Potatismjöl", portion: 20, traits: ["refined_carbs"] },
      { name: "Almond Flour", sv: "Mandelmjöl", form: "dry", lmv: "Mandelmjöl", portion: 30, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "galactans", "salicylate", "allergen_treenut", "cross_reactive", "cross_birch"] }
    ]
  },
  {
    id: "legumes",
    label: "Legumes",
    sv: "Baljväxter",
    foods: [
      { name: "Black Bean", sv: "Svarta bönor", form: "cooked", lmv: "Svarta bönor konserv. u. lag", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Chickpea (whole/flour)", sv: "Kikärtor (hela/mjöl)", form: "cooked", lmv: "Kikärtor torkade kokta m. salt", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Common Peas", sv: "Ärtor", form: "cooked", lmv: "Gröna ärtor kokta m. salt frysvara", portion: 150, traits: ["fiber", "fodmaps", "fructans", "dao_competitor", "salicylate"] },
      { name: "Lentils", sv: "Linser", form: "cooked", lmv: "Röda linser torkade kokta m. salt", lmvNote: "red lentils", portion: 150, traits: ["fiber", "protein", "fodmaps", "galactans"] },
      { name: "Tempeh", sv: "Tempeh", lmv: "Tempeh", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine", "allergen_soy"] },
      { name: "Tofu (firm)", sv: "Tofu (fast)", lmv: "Tofu fast", portion: 125, traits: ["allergen_soy", "cross_reactive", "cross_birch", "dao_competitor"] },
      { name: "Tofu (silken)", sv: "Tofu (silke)", portion: 125, traits: ["fodmaps", "galactans", "allergen_soy", "cross_reactive", "cross_birch", "dao_competitor"] },
      { name: "Soybeans", sv: "Sojabönor", form: "cooked", lmv: "Sojabönor torkade kokta u. salt", portion: 150, traits: ["fiber", "over_10g_fat", "bile_stimulant", "protein", "fodmaps", "galactans", "dao_competitor", "allergen_soy", "cross_reactive", "cross_birch"] },
      { name: "Edamame", sv: "Edamame", form: "cooked", lmv: "Sojabönor torkade kokta u. salt", portion: 80, traits: ["allergen_soy", "cross_reactive", "cross_birch"] },
      { name: "Falafel", sv: "Falafel", lmv: "Falafel kikärtskroketter stekta", portion: 125, traits: ["fiber", "over_10g_fat", "bile_stimulant", "fodmaps", "galactans"] },
      { name: "Fava Beans", sv: "Bondbönor", form: "cooked", lmv: "Bondbönor färska kokta u. salt", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Kidney Beans", sv: "Kidneybönor", form: "cooked", lmv: "Kidneybönor röda bönor konserv. u. lag", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Pinto Beans", sv: "Pintobönor", form: "cooked", lmv: "Bruna bönor torkade kokta m. salt", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Split Peas", sv: "Spritärtor", form: "cooked", lmv: "Gula ärtor kokta m. salt", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "White Beans in Tomato Sauce", sv: "Vita bönor i tomatsås", lmv: "Vita bönor m. tomatsås konserv.", portion: 150, traits: ["fiber", "refined_carbs", "fodmaps", "galactans"] },
      { name: "Green Lentils", sv: "Gröna linser", form: "cooked", lmv: "Gröna linser torkade kokta m. salt", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Mung Beans", sv: "Mungbönor", form: "cooked", lmv: "Mungbönor torkade kokta u. salt", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Adzuki Beans", sv: "Adzukibönor", portion: 150, traits: ["fiber", "fodmaps", "galactans"] },
      { name: "Butter Beans", sv: "Smörbönor", portion: 150, traits: ["fodmaps", "galactans"] },

      /* Sprouted legumes. Every other legume above carries galactans; these
         carry none, which is the whole reason they are worth listing. The
         seed spends its own stored oligosaccharides germinating, so a sprout
         is a legume with the load largely gone — Monash rates mung bean and
         alfalfa sprouts low at an ordinary serving. Kept in Legumes rather
         than Vegetables so the contrast with the row above is visible.

         Eaten raw and mostly water, so the portion is a handful in a salad or
         a stir-fry rather than a cooked legume's 150g. */
      { name: "Mung Bean Sprouts", sv: "Mungbönsgroddar", lmv: "Mungbönsgroddar", form: "fresh", portion: 75, traits: [] },
      { name: "Adzuki Bean Sprouts", sv: "Adzukigroddar", form: "fresh", portion: 75, traits: [] },
      { name: "Lentil Sprouts", sv: "Linsgroddar", lmv: "Linsgroddar", form: "fresh", portion: 75, traits: [] },
      { name: "Alfalfa Sprouts", sv: "Alfalfagroddar", lmv: "Alfalfagroddar", form: "fresh", portion: 30, traits: [] },
      { name: "White Beans (cooked)", sv: "Vita bönor (kokta)", portion: 150, traits: ["fiber", "fodmaps", "galactans"] }
    ]
  },
  {
    id: "landAnimals",
    label: "Land Animals",
    sv: "Kött och ägg",
    foods: [
      { name: "Cows Meat", sv: "Nötkött", lmv: "Nöt kött rå", portion: 125, traits: ["bile_stimulant", "protein", "alpha_gal"] },
      { name: "Pork (lean cut)", sv: "Fläskkött (magert)", lmv: "Gris kött kokt m. salt", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "alpha_gal"] },
      { name: "Pork (fatty cut)", sv: "Fläskkött (fett)", lmv: "Gris sidfläsk rökt", lmvNote: "smoked side pork — the fattiest cut listed", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "alpha_gal"] },
      { name: "Elk Meat", sv: "Älgkött", lmv: "Älg högrev rå", portion: 125, traits: ["protein", "histamine", "alpha_gal"] },
      { name: "Chicken", sv: "Kyckling", lmv: "Kyckling kokt m. salt", portion: 125, traits: ["bile_stimulant", "protein"] },
      { name: "Egg White", sv: "Äggvita", lmv: "Äggvita rå", portion: 30, traits: ["allergen_egg"] },
      { name: "Egg Yolk", sv: "Äggula", lmv: "Äggula rå", portion: 20, traits: ["allergen_egg"] },
      { name: "Whole Egg", sv: "Helt ägg", lmv: "Ägg rått", portion: 50, traits: ["allergen_egg"] },
      { name: "Salami", sv: "Salami", lmv: "Påläggskorv salami rökt", portion: 20, traits: ["over_10g_fat", "histamine", "dao_competitor", "alpha_gal"] },
      { name: "Dry-Cured Ham (~12%)", sv: "Lufttorkad skinka (~12 %)", lmv: "Gris skinka lufttorkad italiensk", portion: 20, traits: ["histamine", "dao_competitor", "alpha_gal"] },
      { name: "Chicken Sausage", sv: "Kycklingkorv", lmv: "Korv kycklingkorv mager", portion: 100, traits: ["over_10g_fat", "bile_stimulant", "histamine"] },
      { name: "Sausages (regular)", sv: "Korv (vanlig)", lmv: "Korv frukostkorv stekt", portion: 100, traits: ["over_10g_fat", "bile_stimulant", "histamine", "alpha_gal"] },
      { name: "Minced Meat (~10% fat)", sv: "Köttfärs (~10 % fett)", lmv: "Nöt färs rå fett 10%", lmvNote: "entry measures 11.3 g fat", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine", "alpha_gal"] },
      { name: "Minced Meat (~15% fat)", sv: "Köttfärs (~15 % fett)", lmv: "Nöt färs rå fett 15%", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine", "alpha_gal"] },
      { name: "Minced Meat (~20% fat)", sv: "Köttfärs (~20 % fett)", lmv: "Blandfärs stekt m. salt", lmvNote: "fried mixed mince — no raw 20 % entry", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine", "alpha_gal"] },
      { name: "Lamb", sv: "Lamm", lmv: "Lamm kött rå", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "alpha_gal"] },
      // Named for the skin, because that is where the fat is: skinless
      // breast is ~4g/100g and would not carry either tag.
      { name: "Duck (with skin)", sv: "Anka (med skinn)", lmv: "Anka rå m. skinn", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "alpha_gal"] },
      { name: "Turkey", sv: "Kalkon", lmv: "Kalkon kokt", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein"] },
      { name: "Frozen Meatballs", sv: "Frysta köttbullar", lmv: "Köttbullar frysvara", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine", "alpha_gal"] },
      { name: "Hot Dog Sausage", sv: "Varmkorv", lmv: "Korv varmkorv kokt", portion: 100, traits: ["over_10g_fat", "bile_stimulant", "histamine", "alpha_gal"] },
      { name: "Chicken Nuggets", sv: "Kycklingnuggets", lmv: "Kyckling nugget friterad tillagad på restaurang", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen_wheat"] },
      { name: "Bacon", sv: "Bacon", lmv: "Gris bacon stekt", portion: 20, traits: ["over_10g_fat", "histamine", "dao_competitor", "alpha_gal"] },
      { name: "Beef Liver", sv: "Nötlever", lmv: "Nöt lever rå", portion: 125, traits: ["protein", "alpha_gal"] },
      { name: "Liver Pate", sv: "Leverpastej", lmv: "Leverpastej bredbar fett ca 24%", lmvNote: "the spreadable kind, 24 % fat", portion: 20, traits: ["alpha_gal"] },
      { name: "Blood Pudding", sv: "Blodpudding", lmv: "Blodpudding blodkorv fett 14%", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "fructans", "allergen_wheat", "alpha_gal"] },
      { name: "Reindeer", sv: "Renkött", lmv: "Ren kött rå", portion: 125, traits: ["protein", "alpha_gal"] },
      { name: "Dried Reindeer Meat", sv: "Torkat renkött", lmv: "Ren kött torkat", portion: 20, traits: ["histamine", "dao_competitor", "alpha_gal"] },
      /* Offal and game from the French round — the part of the shelf
         Livsmedelsverket barely covers. Alpha-gal on the mammals only: a duck
         or a turkey liver carries no galactose-alpha-1,3-galactose. */
      { name: "Foie Gras", sv: "Foie gras", portion: 20, traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Liver Sausage", sv: "Leverkorv", portion: 20, traits: ["over_10g_fat", "alpha_gal"] },
      { name: "Chicken Liver", sv: "Kycklinglever", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein"] },
      { name: "Turkey Liver", sv: "Kalkonlever", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein"] },
      { name: "Turkey Heart", sv: "Kalkonhjärta", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein"] },
      { name: "Beef Kidney", sv: "Nötnjure", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "alpha_gal"] },
      { name: "Lamb Kidney", sv: "Lammnjure", portion: 125, traits: ["bile_stimulant", "protein", "alpha_gal"] },
      { name: "Veal Kidney", sv: "Kalvnjure", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "alpha_gal"] },
      /* Not pölsa. This record is organ meat and nothing else: 27.4g protein,
         2.2g carbohydrate, no fibre — more protein than our raw beef liver,
         because it is cooked and the water has gone.

         Pölsa is offal boiled with korngryn and broth, and the barley is
         between a sixth and a quarter of it. A dish carrying that much grain
         cannot hold 2.2g of carbohydrate per 100g, which settles it without
         needing a figure for pölsa at all. What matters is not the arithmetic
         but what the grain brings: matched here, a dish made with barley would
         carry no allergen_wheat and read as safe to someone avoiding gluten.

         Three foods, not one. This is the raw material. Pölsa is offal plus
         grain. Blood pudding is neither — it is blood, flour and syrup, and
         has its own row already. Pölsa has no row yet and should get one from
         a Swedish round, where it will arrive with its own figures. */
      { name: "Offal (mixed, cooked)", sv: "Inälvsmat (blandad, kokt)", portion: 125, traits: ["bile_stimulant", "protein", "alpha_gal"] },
      { name: "Goat Meat", sv: "Getkött", portion: 125, traits: ["bile_stimulant", "protein", "alpha_gal"] },
      { name: "Ostrich", sv: "Struts", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein"] },
      { name: "Quail", sv: "Vaktel", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein"] },
      { name: "Rabbit", sv: "Kanin", portion: 125, traits: ["bile_stimulant", "protein", "alpha_gal"] }
    ]
  },
  {
    id: "seafood",
    label: "Seafood",
    sv: "Fisk och skaldjur",
    foods: [
      { name: "Salmon", sv: "Lax", lmv: "Lax stekt m. salt", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "allergen_fish", "histamine", "dao_competitor"] },
      { name: "Cod", sv: "Torsk", lmv: "Torsk rå", portion: 125, traits: ["protein", "histamine", "allergen_fish"] },
      { name: "Oysters", sv: "Ostron", lmv: "Ostron", portion: 80, traits: ["allergen_mollusc", "histamine"] },
      { name: "Lobsters", sv: "Hummer", lmv: "Hummer kokt", portion: 80, traits: ["protein", "histamine", "allergen_crustacean"] },
      { name: "Crayfish", sv: "Kräfta", lmv: "Kräfta kokt", portion: 80, traits: ["allergen_crustacean", "histamine"] },
      { name: "Shrimp", sv: "Räka", lmv: "Räka kokt", portion: 80, traits: ["allergen_crustacean", "histamine"] },
      { name: "Tuna", sv: "Tonfisk", lmv: "Tonfisk stekt m. salt", portion: 125, traits: ["protein", "histamine", "dao_competitor", "allergen_fish"] },
      { name: "Anchovies", sv: "Ansjovis", lmv: "Ansjovis skarpsill konserv. ", portion: 5, traits: ["histamine", "dao_competitor", "allergen_fish"] },
      { name: "Smoked Salmon", sv: "Rökt lax", lmv: "Lax kallrökt", portion: 20, traits: ["allergen_fish", "histamine", "dao_competitor"] },
      { name: "Crab", sv: "Krabba", lmv: "Krabba Blå krabba kokt", portion: 80, traits: ["allergen_crustacean", "histamine"] },
      { name: "Mussels", sv: "Musslor", lmv: "Mussla konserv. m. lag", portion: 80, traits: ["allergen_mollusc", "histamine"] },
      { name: "Fish Balls", sv: "Fiskbullar", lmv: "Fiskbullar konserv. u. buljong", portion: 125, traits: ["allergen_fish", "histamine"] },
      { name: "Fish Fingers", sv: "Fiskpinnar", lmv: "Fiskpinnar stekta", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "histamine", "allergen_wheat", "allergen_fish"] },
      { name: "Mackerel", sv: "Makrill", lmv: "Makrill rå", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "protein", "histamine", "dao_competitor", "allergen_fish"] },
      { name: "Sardines (canned)", sv: "Sardiner (konserv)", lmv: "Sardiner i olja konserv.", portion: 20, traits: ["histamine", "dao_competitor", "allergen_fish"] },
      { name: "Pickled Herring", sv: "Inlagd sill", lmv: "Sill inlagd u. lag", portion: 20, traits: ["refined_carbs", "histamine", "dao_competitor", "irritant", "aceticAcid", "allergen_fish"] },
      { name: "Surimi / Crab Sticks", sv: "Surimi / krabbstickor", lmv: "Surimi fisk", portion: 20, traits: ["refined_carbs", "allergen_fish", "allergen_wheat"] },
      { name: "Squid", sv: "Bläckfisk", portion: 80, traits: ["protein", "allergen_mollusc"] },
      { name: "Cod Liver (canned)", sv: "Torsklever (konserv)", portion: 20, traits: ["over_10g_fat", "histamine", "dao_competitor", "allergen_fish"] }
    ]
  },
  {
    id: "dairy",
    label: "Dairy",
    sv: "Mejeri",
    foods: [
      { name: "Cows Milk (3% fat)", sv: "Komjölk (3 % fett)", lmv: "Mjölk fett 3% berikad", portion: 200, traits: ["over_3g_lactose", "fodmaps", "allergen_milk"] },
      /* Goat's milk at 4.1% fat clears both fat lines in a 200g glass where
         cow's at 3% does not — 8.3g of fat, and 9.7 of bile load against 9.5.
         Sheep's milk is fattier still and has no figures yet. */
      { name: "Goats Milk", sv: "Getmjölk", portion: 200, traits: ["over_10g_fat", "bile_stimulant", "over_3g_lactose", "fodmaps", "allergen_milk"] },
      { name: "Sheeps Milk", sv: "Fårmjölk", portion: 200, traits: ["over_3g_lactose", "over_10g_fat", "bile_stimulant", "fodmaps", "allergen_milk"] },
      { name: "Cream Cheese (<10% fat)", sv: "Färskost (<10 % fett)", lmv: "Färskost cream cheese extra light fett 5%", portion: 20, traits: ["allergen_milk"] },
      { name: "Cream Cheese (>10% fat)", sv: "Färskost (>10 % fett)", lmv: "Färskost fett 33%", portion: 20, traits: ["over_10g_fat", "allergen_milk"] },
      { name: "Hard Cheese (~15% fat)", sv: "Hårdost (~15 % fett)", lmv: "Ost hårdost fett 17%", lmvNote: "closest entry is 17 % fat", portion: 20, traits: ["histamine", "dao_competitor", "allergen_milk"] },
      { name: "Hard Cheese (~28-35% fat)", sv: "Hårdost (~28–35 % fett)", lmv: "Ost hårdost fett 31%", portion: 20, traits: ["over_10g_fat", "histamine", "dao_competitor", "allergen_milk"] },
      { name: "Yogurt (0.5% fat)", sv: "Yoghurt (0,5 % fett)", lmv: "Yoghurt naturell lätt fett 0,5% berikad", portion: 200, traits: ["over_3g_lactose", "fodmaps", "allergen_milk"] },
      { name: "Yogurt (3% fat)", sv: "Yoghurt (3 % fett)", lmv: "Yoghurt naturell fett 3% berikad", portion: 200, traits: ["over_3g_lactose", "fodmaps", "allergen_milk"] },
      { name: "Greek Yogurt (10% fat)", sv: "Grekisk yoghurt (10 % fett)", lmv: "Yoghurt naturell fett 10%", lmvNote: "entry measures 8.3 g fat, below the 10 g threshold", portion: 200, traits: ["over_10g_fat", "bile_stimulant", "over_3g_lactose", "fodmaps", "allergen_milk"] },
      { name: "Butter", sv: "Smör", lmv: "Smör fett 80%", portion: 10, traits: ["over_10g_fat", "allergen_milk"] },
      { name: "Cream (40% fat)", sv: "Grädde (40 % fett)", lmv: "Vispgrädde fett 40%", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen_milk"] },
      /* 4.82g of lactose in a 200g tub against a 5g dose — the closest call
         the borrowed column produced, and it goes the same way every other
         food's arithmetic goes. Quark (~10%) is 6.00g and keeps both tags. */
      { name: "Quark (~1%)", sv: "Kvarg (~1 %)", lmv: "Kvarg färskost fett 1%", portion: 200, traits: ["protein", "allergen_milk"] },
      { name: "Quark (~10%)", sv: "Kvarg (~10 %)", lmv: "Kvarg färskost fett 10%", portion: 200, traits: ["fodmaps", "over_10g_fat", "bile_stimulant", "protein", "over_3g_lactose", "allergen_milk"] },
      { name: "Cottage Cheese (4% fat)", sv: "Cottage cheese (4 % fett)", lmv: "Färskost cottage cheese naturell fett 4%", portion: 100, traits: ["allergen_milk"] },
      { name: "Sour Cream (12% fat)", sv: "Gräddfil (12 % fett)", lmv: "Gräddfil fett 12%", portion: 25, traits: ["allergen_milk"] },
      { name: "Ricotta Cheese", sv: "Ricotta", lmv: "Färskost ricotta fett ca 10%", portion: 60, traits: ["over_10g_fat", "allergen_milk"] },
      { name: "Mascarpone", sv: "Mascarpone", lmv: "Färskost fett 33%", portion: 20, traits: ["over_10g_fat", "allergen_milk"] },
      { name: "Parmesan", sv: "Parmesan", lmv: "Ost hårdost parmesan fett 30% typ Parmiggiano Reggiano", portion: 20, traits: ["over_10g_fat", "histamine", "dao_competitor", "allergen_milk"] },
      { name: "Halloumi", sv: "Halloumi", lmv: "Ost halloumi rå fett 22%", portion: 60, traits: ["over_10g_fat", "bile_stimulant", "allergen_milk"] },
      { name: "Mozzarella", sv: "Mozzarella", lmv: "Ost mozzarella fett 18%", portion: 30, traits: ["allergen_milk"] },
      { name: "Blue Cheese", sv: "Ädelost", lmv: "Ädelost grönmögelost fett 17%", portion: 20, traits: ["histamine", "dao_competitor", "allergen_milk"] },
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
      { name: "Roquefort", sv: "Roquefort", portion: 20, traits: ["allergen_milk", "histamine", "dao_competitor"] },
      { name: "Fontina", sv: "Fontina", portion: 20, traits: ["over_10g_fat", "allergen_milk", "histamine", "dao_competitor"] },
      { name: "Raclette", sv: "Raclette", portion: 20, traits: ["allergen_milk", "histamine", "dao_competitor"] },
      { name: "Camembert", sv: "Camembert", lmv: "Vitmögelost camembert fett ca 22%", portion: 20, traits: ["histamine", "dao_competitor", "allergen_milk"] },
      { name: "Cheddar", sv: "Cheddar", lmv: "Ost hårdost fett 31%", lmvNote: "generic hard cheese entry", portion: 20, traits: ["over_10g_fat", "histamine", "dao_competitor", "allergen_milk"] },
      { name: "Aged Gouda", sv: "Lagrad gouda", lmv: "Ost hårdost fett 31%", lmvNote: "generic hard cheese entry", portion: 20, traits: ["over_10g_fat", "histamine", "dao_competitor", "allergen_milk"] },
      { name: "Whey Protein", sv: "Vassleprotein", portion: 25, traits: ["fodmaps", "protein", "allergen_milk", "over_3g_lactose"] },
      // 21.3g fat/100g, so it clears the 17.5g bile threshold like the other
      // full-fat cheeses. Protein is only ~14g, so no protein tag.
      { name: "Feta Cheese", sv: "Fetaost", lmv: "Salladsost fett 22%", portion: 30, traits: ["over_10g_fat", "histamine", "allergen_milk"] },
      { name: "Paneer", sv: "Paneer", lmv: "Paneer", portion: 60, traits: ["fodmaps", "over_10g_fat", "bile_stimulant", "over_3g_lactose", "allergen_milk"] },
      { name: "Skyr", sv: "Skyr", portion: 200, traits: ["protein", "fodmaps", "over_3g_lactose", "allergen_milk"] },
      { name: "Buttermilk", sv: "Kärnmjölk", lmv: "Filmjölk fett 3% berikad", portion: 200, traits: ["fodmaps", "over_3g_lactose", "allergen_milk"] },
      { name: "Kefir", sv: "Kefir", lmv: "Kefir fett 3% berikad", portion: 200, traits: ["over_3g_lactose", "fodmaps", "allergen_milk"] },
      // Lactase-treated dairy: lactose <0.1g/100g and Monash-tested low FODMAP,
      // but the milk protein and (for yogurt) the fermentation are unchanged.
      // That split is the point — it separates lactose from casein/histamine.
      { name: "Lactose-free Milk", sv: "Laktosfri mjölk", lmv: "Mjölk fett 3% berikad", lmvNote: "ordinary milk — the lactose-free version is not listed", portion: 200, traits: ["allergen_milk"] },
      { name: "Lactose-free Yogurt", sv: "Laktosfri yoghurt", lmv: "Yoghurt naturell lätt laktosfri fett ca 0,4% berikad", portion: 200, traits: ["allergen_milk"] },
      { name: "Filmjolk", sv: "Filmjölk", lmv: "Filmjölk fett 3% berikad", portion: 200, traits: ["over_3g_lactose", "fodmaps", "allergen_milk"] },
      { name: "Creme Fraiche (34% fat)", sv: "Crème fraiche (34 % fett)", lmv: "Crème fraiche fett 34%", portion: 25, traits: ["over_10g_fat", "allergen_milk"] },
      { name: "Brie", sv: "Brie", lmv: "Vitmögelost brie fett ca 38%", lmvNote: "the 38% fat grade — brie is sold from about 30% to 60%", portion: 20, traits: ["over_10g_fat", "histamine", "dao_competitor", "allergen_milk"] },
      { name: "Emmental", sv: "Emmentaler", lmv: "Ost hårdost fett 31%", lmvNote: "generic hard cheese entry", portion: 20, traits: ["over_10g_fat", "histamine", "dao_competitor", "allergen_milk"] },
      { name: "Lactose-free Cheese", sv: "Laktosfri ost", lmv: "Ost hårdost fett 31%", lmvNote: "ordinary hard cheese — the lactose-free version is not listed", portion: 20, traits: ["over_10g_fat", "allergen_milk"] },
      { name: "Lactose-free Cream (40% fat)", sv: "Laktosfri grädde (40 % fett)", lmv: "Vispgrädde fett 40%", lmvNote: "ordinary cream — the lactose-free version is not listed", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen_milk"] },
      /* Named cheeses from the French round. Same shape as Roquefort and
         Fontina: a shopper reads the name off the packet, so the name is the
         food. All aged, so histamine and DAO, and the fat tag follows the
         figures rather than the reputation. */
      { name: "Beaufort", sv: "Beaufort", portion: 20, traits: ["over_10g_fat", "histamine", "dao_competitor", "allergen_milk"] },
      { name: "Maasdam", sv: "Maasdam", portion: 20, traits: ["histamine", "dao_competitor", "allergen_milk"] },
      { name: "Fourme d'Ambert", sv: "Fourme d'Ambert", portion: 20, traits: ["histamine", "dao_competitor", "allergen_milk"] },
      { name: "Gorgonzola", sv: "Gorgonzola", portion: 20, traits: ["histamine", "dao_competitor", "allergen_milk"] },
      { name: "Gruyere", sv: "Gruyère", portion: 20, traits: ["over_10g_fat", "histamine", "dao_competitor", "allergen_milk"] },
      { name: "Pecorino", sv: "Pecorino", portion: 20, traits: ["over_10g_fat", "histamine", "dao_competitor", "allergen_milk"] },
      { name: "Provolone", sv: "Provolone", portion: 20, traits: ["histamine", "dao_competitor", "allergen_milk"] },
      { name: "Pelardon (goat cheese)", sv: "Pélardon (getost)", portion: 20, traits: ["histamine", "dao_competitor", "allergen_milk"] },
      { name: "Reblochon", sv: "Reblochon", portion: 20, traits: ["histamine", "dao_competitor", "allergen_milk"] },
      { name: "Salers", sv: "Salers", portion: 20, traits: ["over_10g_fat", "histamine", "dao_competitor", "allergen_milk"] },
      { name: "Tomme", sv: "Tomme", portion: 20, traits: ["histamine", "dao_competitor", "allergen_milk"] }
    ]
  },
  {
    id: "spices",
    label: "Spices",
    sv: "Kryddor",
    foods: [
      { name: "Chili (fresh)", sv: "Chili (färsk)", bothWays: true, form: "fresh", lmv: "Chilipeppar färsk", portion: 5, traits: ["irritant", "capsaicin"] },
      { name: "Garlic", sv: "Vitlök", form: "fresh", lmv: "Vitlök", portion: 5, traits: ["fodmaps", "fructans", "irritant", "allyl_compounds", "allergen_onion"] },
      { name: "Garlic Powder", sv: "Vitlökspulver", form: "dried", portion: 2, traits: ["fodmaps", "fructans", "irritant", "allyl_compounds", "allergen_onion"] },
      { name: "Ginger (fresh)", sv: "Ingefära (färsk)", bothWays: true, form: "fresh", lmv: "Ingefära färsk", portion: 5, traits: ["cross_reactive", "cross_mugwort"] },
      { name: "Ginger (dried)", sv: "Ingefära (torkad)", bothWays: true, form: "dried", portion: 2, traits: ["cross_reactive", "cross_mugwort"] },
      { name: "Dill (fresh)", sv: "Dill (färsk)", bothWays: true, form: "fresh", lmv: "Dill färsk", portion: 2, traits: ["cross_reactive", "cross_mugwort"] },
      { name: "Dill (dried)", sv: "Dill (torkad)", bothWays: true, form: "dried", portion: 1, traits: ["cross_reactive", "cross_mugwort"] },
      { name: "Turmeric (dried)", sv: "Gurkmeja (torkad)", bothWays: true, form: "dried", lmv: "Gurkmeja torkad", portion: 2, traits: ["bile_stimulant"] },
      { name: "Mustard", sv: "Senap", lmv: "Senap svensk", portion: 5, traits: ["irritant", "allyl_compounds", "allergen_mustard", "cross_reactive", "cross_mugwort"] },
      { name: "Black Pepper", sv: "Svartpeppar", form: "dried", portion: 2, traits: ["irritant", "cross_reactive", "cross_mugwort"] },
      { name: "Sumac", sv: "Sumak", form: "dried", portion: 2, traits: ["irritant", "aceticAcid"] },
      { name: "Cumin (dried)", sv: "Spiskummin (torkad)", form: "dried", lmv: "Spiskummin frö torkad", portion: 2, traits: ["salicylate", "cross_reactive", "cross_mugwort"] },
      { name: "Wasabi", sv: "Wasabi", lmv: "Wasabirot", portion: 5, traits: ["irritant", "allyl_compounds"] },
      { name: "Curry Powder", sv: "Currypulver", form: "dried", portion: 2, traits: ["irritant", "capsaicin"] },
      { name: "Sichuan Peppercorn", sv: "Sichuanpeppar", form: "dried", portion: 2, traits: ["irritant"] },
      { name: "Nutmeg", sv: "Muskotnöt", form: "dried", lmv: "Muskotnöt malen", portion: 2, traits: [] },
      // Herbs sit under the 10g typical-serving gate, so no macro tags apply
      // however fiber-dense they look per 100g. All rated 0 by SIGHI and
      // unrestricted by Monash.
      { name: "Basil (fresh)", sv: "Basilika (färsk)", bothWays: true, form: "fresh", lmv: "Basilika färsk", portion: 2, traits: [] },
      { name: "Basil (dried)", sv: "Basilika (torkad)", bothWays: true, form: "dried", portion: 1, traits: [] },
      { name: "Oregano (dried)", sv: "Oregano (torkad)", bothWays: true, form: "dried", portion: 2, traits: [] },
      { name: "Thyme (dried)", sv: "Timjan (torkad)", bothWays: true, form: "dried", portion: 2, traits: [] },
      { name: "Thyme (fresh)", sv: "Timjan (färsk)", bothWays: true, form: "fresh", portion: 2, traits: [] },
      { name: "Rosemary (dried)", sv: "Rosmarin (torkad)", bothWays: true, form: "dried", portion: 2, traits: [] },
      { name: "Rosemary (fresh)", sv: "Rosmarin (färsk)", bothWays: true, form: "fresh", portion: 2, traits: [] },
      { name: "Mint (fresh)", sv: "Mynta (färsk)", bothWays: true, form: "fresh", portion: 2, traits: ["irritant"] },
      { name: "Mint (dried)", sv: "Mynta (torkad)", bothWays: true, form: "dried", portion: 1, traits: ["irritant"] },
      { name: "Cinnamon", sv: "Kanel", form: "dried", lmv: "Kanel", portion: 2, traits: [] },
      { name: "Paprika Powder", sv: "Paprikapulver", form: "dried", portion: 2, traits: ["cross_reactive", "cross_mugwort"] },
      { name: "Cardamom (dried)", sv: "Kardemumma (torkad)", form: "dried", lmv: "Kardemumma torkad", portion: 2, traits: [] },
      { name: "Allspice", sv: "Kryddpeppar", form: "dried", portion: 2, traits: [] },
      { name: "Onion Powder", sv: "Lökpulver", portion: 2, traits: ["fodmaps", "fructans", "irritant", "allyl_compounds", "allergen_onion"] }
    ]
  },
  {
    id: "beverages",
    label: "Beverages",
    sv: "Drycker",
    foods: [
      { name: "Red Wine", sv: "Rödvin", lmv: "Vin rött vol. % 14", portion: 150, traits: ["alcohol", "histamine", "irritant", "allergen_sulphite"] },
      { name: "White Wine", sv: "Vitt vin", lmv: "Vin vitt vol. % 12", portion: 150, traits: ["alcohol", "histamine", "irritant", "allergen_sulphite"] },
      // From the SIGHI review. Styrian rosé, 11-12% ABV under Schilcherland DAC.
      { name: "Schilcherwein", sv: "Schilcherwein", portion: 150, traits: ["alcohol", "histamine", "irritant", "allergen_sulphite"] },
      { name: "Champagne", sv: "Champagne", portion: 150, traits: ["alcohol", "histamine", "irritant", "carbonation", "allergen_sulphite"] },
      { name: "Beer", sv: "Öl", lmv: "Öl starköl el. exportöl vol. % 5,4", portion: 330, traits: ["alcohol", "histamine", "irritant", "carbonation", "allergen_wheat"] },
      { name: "Cider", sv: "Cider", lmv: "Cider vol. % 1", lmvNote: "the 1 % grocery cider — stronger ones are not listed", portion: 330, traits: ["alcohol", "irritant", "carbonation", "histamine", "allergen_sulphite"] },
      { name: "Spirits (Liquor)", sv: "Sprit", lmv: "Whisky vol. % 40", portion: 40, traits: ["alcohol", "irritant", "histamine"] },
      { name: "Coffee", sv: "Kaffe", lmv: "Kaffe bryggt", portion: 200, traits: ["caffeine", "irritant"] },
      { name: "Espresso", sv: "Espresso", lmv: "Kaffe espresso bryggt drickf.", portion: 30, traits: ["caffeine", "irritant"] },
      { name: "Black Tea", sv: "Svart te", portion: 200, traits: ["caffeine", "irritant"] },
      { name: "Green Tea", sv: "Grönt te", portion: 200, traits: ["irritant", "caffeine"] },
      { name: "Mate Tea", sv: "Mate-te", portion: 200, traits: ["irritant", "caffeine"] },
      { name: "Energy Drinks", sv: "Energidryck", lmv: "Energidryck m. socker berikad", portion: 200, traits: ["caffeine", "irritant", "carbonation"] },
      { name: "Soy Milk", sv: "Sojadryck", lmv: "Sojadryck", portion: 200, traits: ["allergen_soy", "fodmaps", "galactans", "dao_competitor"] },
      { name: "Oat Drink", sv: "Havredryck", lmv: "Havredryck fett 1,5% berikad", portion: 200, traits: ["allergen_wheat"] },
      { name: "Coconut Milk", sv: "Kokosmjölk", lmv: "Kokosmjölk fett ca 6%", portion: 200, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "polyols"] },
      /* Matcha is the one tea where the leaf is drunk rather than steeped and
         thrown away, so its figures are a dried tea leaf's, scaled by the
         bowl: about 2g of powder in 200ml. Every other tea here is matched to
         a ready-to-drink brew and needs no recipe. */
      { name: "Matcha", sv: "Matcha", form: "cooked", lmvNote: "dried tea leaf, whisked into water at about 2g in a 200ml bowl", madeUp: { parts: 1, water: 100 }, portion: 200, traits: ["irritant", "caffeine"] },
      { name: "Chai Tea", sv: "Chai-te", portion: 200, traits: ["irritant", "caffeine"] },
      // Added for the salicylate work; carries no histamine per the review.
      // Caffeine-free. Cross-reacts with mugwort/ragweed pollen (Asteraceae) —
      // tagged with the general cross-reaction trait, since we track only the
      // birch, grass and latex groups as subtypes.
      { name: "Chamomile Tea", sv: "Kamomillte", portion: 200, traits: ["salicylate", "cross_reactive", "cross_mugwort"] },
      { name: "Kombucha", sv: "Kombucha", portion: 200, traits: ["irritant", "histamine", "carbonation"] },
      { name: "Almond Milk", sv: "Mandeldryck", lmv: "Mandeldryck berikad", portion: 200, traits: ["allergen_treenut"] },
      { name: "Orange Juice", sv: "Apelsinjuice", lmv: "Apelsinjuice drickf.", portion: 200, traits: ["cross_reactive", "cross_grass", "dao_competitor"] },
      { name: "Apple Juice", sv: "Äppeljuice", lmv: "Äppeljuice drickf.", portion: 200, traits: ["fodmaps", "fructose", "polyols", "cross_reactive", "cross_birch"] },
      // The figures are the powder made up 1:8 as directed — see nutrition-manual.js.
      // Taken as powder against a 200g bowl it looked like 142g of sugar and
      // enough fiber to tag, which is where the fiber tag came from. A made-up
      // bowl holds 1.2g.
      // Sold as powder, eaten as a bowl. `madeUp` is the packet's own recipe and
      // the builder does the dilution — see tools/nutrition-core.js. Taken as
      // powder against a 200g bowl this looked like 142g of sugar a serving,
      // which is also where its fiber tag came from; a made-up bowl holds 1.1g.
      { name: "Rosehip Soup", sv: "Nyponsoppa", form: "cooked", lmv: "Nyponsoppapulver berikad", lmvNote: "powder, made up 1 part to 8 of water as directed", madeUp: { parts: 1, water: 8 }, portion: 200, traits: ["refined_carbs"] },
      { name: "Peppermint Tea", sv: "Pepparmyntste", portion: 200, traits: ["irritant"] },
      { name: "Alcohol-free Beer", sv: "Alkoholfri öl", lmv: "Öl alkoholfri", portion: 330, traits: ["irritant", "carbonation", "allergen_wheat"] },
      { name: "Squash / Cordial", sv: "Saft", lmv: "Saft drickf.", portion: 200, traits: ["refined_carbs"] },
      { name: "Hot Chocolate", sv: "Varm choklad", lmv: "Varm choklad m. mjölk fett 3%", portion: 200, traits: ["irritant", "over_10g_fat", "refined_carbs", "over_3g_lactose", "fodmaps", "caffeine", "allergen_milk"] },
      /* Drinks from the French round. Gin, rum, vodka, whisky and brandy were
         left out — they are water and ethanol, and Spirits (Liquor) already
         answers for them. Liqueur is here because its 17g of sugar makes it a
         different food. */
      { name: "Low-alcohol Beer", sv: "Lättöl", portion: 330, traits: ["alcohol", "irritant", "carbonation", "histamine", "allergen_wheat"] },
      { name: "Shandy", sv: "Shandy", portion: 330, traits: ["alcohol", "irritant", "carbonation", "refined_carbs", "allergen_wheat"] },
      { name: "Rose Wine", sv: "Rosévin", portion: 150, traits: ["alcohol", "histamine", "irritant", "allergen_sulphite"] },
      { name: "Sweet Wine", sv: "Sött vin", portion: 150, traits: ["alcohol", "histamine", "irritant", "refined_carbs", "allergen_sulphite"] },
      { name: "Sangria", sv: "Sangria", portion: 150, traits: ["alcohol", "histamine", "irritant", "refined_carbs", "allergen_sulphite"] },
      { name: "Sake", sv: "Sake", portion: 150, traits: ["alcohol", "histamine", "irritant"] },
      { name: "Liqueur", sv: "Likör", portion: 40, traits: ["alcohol", "irritant", "histamine", "refined_carbs"] }
    ]
  },
  {
    id: "ultraProcessed",
    label: "Processed Foods",
    sv: "Processad mat",
    foods: [
      { name: "Frozen pizza", sv: "Fryst pizza", lmv: "Pizza orientalisk", portion: 175, traits: ["over_10g_fat", "bile_stimulant", "protein", "refined_carbs"] },
      { name: "French Fries (deep-fried)", sv: "Pommes frites (frityrkokta)", lmv: "Pommes frites friterad potatis fett ca 11% frysvara", portion: 150, traits: ["over_10g_fat", "bile_stimulant", "refined_carbs"] },
      { name: "French Fries (oven-baked)", sv: "Pommes frites (ugnsbakade)", lmv: "Pommes frites friterad potatis värmd i ugn fett ca 7% frysvara", portion: 150, traits: ["over_10g_fat", "bile_stimulant", "refined_carbs"] },
      { name: "Margarine", sv: "Margarin", lmv: "Flytande margarin fett 70%", portion: 10, traits: ["over_10g_fat"] },
      // "ätf." is the made-up broth, not the cube, so the portion is a mug of
      // it. At 5g it was a teaspoon of stock and counted as nothing.
      { name: "Instant Soup / Bouillon Cubes", sv: "Snabbsoppa / buljongtärningar", form: "cooked", lmv: "Köttbuljong tärning ätf.", lmvNote: "ready-to-eat broth, not the dry cube", portion: 200, traits: ["fodmaps", "fructans", "allergen_celery"] },
      { name: "Flavored Yogurt", sv: "Smaksatt yoghurt", lmv: "Fruktyoghurt fett 2%", portion: 200, traits: ["over_3g_lactose", "fodmaps", "refined_carbs", "allergen_milk"] },
      { name: "Pretzels", sv: "Saltkringlor", lmv: "Salta pinnar", portion: 20, traits: ["refined_carbs", "allergen_wheat"] },
      { name: "Instant Mashed Potato", sv: "Potatismospulver", lmv: "Potatismos hemlagad", portion: 175, traits: ["refined_carbs"] },
      { name: "Dumplings", sv: "Dumplings", portion: 100, traits: ["allergen_wheat", "over_10g_fat", "bile_stimulant"] },
      { name: "Fresh Pasta (w/ egg)", sv: "Färsk pasta (med ägg)", lmv: "Pasta färsk m. ägg kokt u. salt", portion: 175, traits: ["refined_carbs", "allergen_wheat", "allergen_egg", "fodmaps", "fructans"] }
    ]
  },
  {
    id: "plantBased",
    label: "Plant-Based Substitutes",
    sv: "Växtbaserade alternativ",
    foods: [
      { name: "Soy Yogurt", sv: "Sojayoghurt", lmv: "Soygurt naturell eko. berikad", portion: 200, traits: ["allergen_soy"] },
      { name: "Oat Yogurt", sv: "Havreyoghurt", lmv: "Havregurt naturell fett 2,2% berikad", portion: 200, traits: ["fodmaps", "fructans", "allergen_wheat"] },
      { name: "Oat Fraiche", sv: "Havrefraiche", lmv: "Fraiche m. havre veg. fett 15% berikad", portion: 25, traits: ["fodmaps", "fructans", "allergen_wheat"] },
      { name: "Vegan Cheese (Coconut Oil)", sv: "Vegansk ost (kokosolja)", lmv: "Kokosbaserad bit fett ca 20% som alternativ till ost", portion: 20, traits: ["refined_carbs"] },
      { name: "Vegan Cheese (Cashew)", sv: "Vegansk ost (cashew)", portion: 20, traits: ["over_10g_fat", "fodmaps", "galactans", "fructans", "allergen_treenut"] },
      { name: "Plant-based Mince", sv: "Växtbaserad färs", lmv: "Sojaprotein färs stekt", portion: 125, traits: ["fiber", "over_10g_fat", "bile_stimulant", "protein", "fodmaps", "galactans", "allergen_soy"] },
      { name: "Quorn", sv: "Quorn", lmv: "Mykoprotein bullar frysvara", lmvNote: "mycoprotein balls — plain pieces are not listed", portion: 125, traits: ["protein", "allergen_egg", "allergen_mushroom"] },
      { name: "Veggie Burger (vegetable-based)", sv: "Vegoburgare (grönsaksbaserad)", lmv: "Grönsaksburgare stekt veg.", portion: 125, traits: ["over_10g_fat", "bile_stimulant", "refined_carbs", "fodmaps", "galactans"] },
      { name: "Aquafaba", sv: "Aquafaba", portion: 25, traits: ["fodmaps", "galactans"] },
    ]
  },
  {
    id: "condiments",
    label: "Condiments",
    sv: "Tillbehör",
    foods: [
      { name: "Soy Sauce", sv: "Soja", lmv: "Sojasås", portion: 5, traits: ["histamine", "allergen_soy", "allergen_wheat", "dao_competitor"] },
      { name: "Vinegar", sv: "Ättika", portion: 5, traits: ["aceticAcid", "irritant"] },
      { name: "Balsamic Vinegar", sv: "Balsamvinäger", lmv: "Vinäger ättiksyra 7%", portion: 5, traits: ["aceticAcid", "irritant", "histamine", "allergen_sulphite"] },
      { name: "Aioli", sv: "Aioli", lmv: "Aioli", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen_egg", "irritant", "allyl_compounds"] },
      { name: "Pesto", sv: "Pesto", lmv: "Pesto hemlagad", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen_treenut", "allergen_milk", "fodmaps", "fructans"] },
      { name: "Tzatziki", sv: "Tzatziki", lmv: "Tzatziki", portion: 50, traits: ["allergen_milk"] },
      { name: "Hummus", sv: "Hummus", lmv: "Hummus kikärtsröra", portion: 50, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "galactans", "allergen_sesame"] },
      { name: "Guacamole", sv: "Guacamole", lmv: "Guacamole", portion: 50, traits: ["over_10g_fat", "cross_reactive", "cross_latex"] },
      { name: "Mango Chutney", sv: "Mangochutney", lmv: "Mango chutney", portion: 25, traits: ["refined_carbs"] },
      { name: "Cranberry Sauce", sv: "Tranbärssås", portion: 25, traits: ["fodmaps", "refined_carbs", "fructose"] },
      { name: "Fish Roe Spread", sv: "Kaviar (romröra)", lmv: "Påläggskaviar original", portion: 20, traits: ["over_10g_fat", "histamine", "allergen_fish"] },
      /* The dark savoury spread — Marmite, Vegemite. Nutritional yeast is a
         different product and has its own entry below. The name alone was
         ambiguous enough to be read either way. Yeast extract is one of the
         higher-histamine foods on any elimination list. */
      { name: "Yeast Extract (Marmite type)", sv: "Jästextrakt (Marmite-typ)", portion: 5, traits: ["histamine"] },
      { name: "Ajvar", sv: "Ajvar", lmv: "Ajvar relish", portion: 25, traits: ["irritant"] },
      { name: "Harissa", sv: "Harissa", portion: 5, traits: ["irritant", "capsaicin"] },
      { name: "Tahini", sv: "Tahini", lmv: "Tahini", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen_sesame"] },
      { name: "Baba Ganoush", sv: "Baba ganoush", portion: 50, traits: ["histamine"] },
      { name: "Preserved Lemon", sv: "Saltkonserverad citron", portion: 5, traits: ["irritant", "histamine", "aceticAcid"] },
      { name: "Sesame Oil", sv: "Sesamolja", lmv: "Sesamolja", portion: 10, traits: ["over_10g_fat", "bile_stimulant", "allergen_sesame"] },
      { name: "Olive Oil", sv: "Olivolja", lmv: "Olivolja", portion: 10, traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Sunflower Oil", sv: "Solrosolja", lmv: "Solrosolja", portion: 10, traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Rapeseed Oil", sv: "Rapsolja", lmv: "Rapsolja", portion: 10, traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Coconut Oil", sv: "Kokosolja", lmv: "Kokosolja", portion: 10, traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Ghee", sv: "Ghee", lmv: "Klarnat smör ghee", portion: 10, traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Tamarind", sv: "Tamarind", portion: 5, traits: ["irritant", "aceticAcid"] },
      // Honey is high FODMAP at a normal tablespoon — excess fructose is the
      // main driver, with fructans secondary. Not a "safe" pantry staple.
      { name: "Honey", sv: "Honung", lmv: "Honung", portion: 25, traits: ["fodmaps", "fructose", "fructans"] },
      { name: "White Sugar", sv: "Vitt socker", lmv: "Socker", portion: 5, traits: ["refined_carbs"] },
      /* USDA gives 67.4g of carbohydrate, 32.2g of water and no sugars figure —
         the derivation code on that one value was not one we accept. But maple
         syrup is sucrose, glucose and fructose in water and very little else;
         the residue is oligosaccharides and organic acids. `sugarsOfCarbs`
         works the figure out from the carbohydrate rather than having it typed
         in, so it follows the source if the source changes, and the line in
         nutrition-data.js says the sugars figure is derived. */
      { name: "Maple Syrup", sv: "Lönnsirap", portion: 25, sugarsOfCarbs: 0.9, traits: ["refined_carbs"] },
      { name: "Salt", sv: "Salt", lmv: "Salt m. jod", portion: 5, traits: [] },
      { name: "Garlic-infused Oil", sv: "Vitlöksolja", portion: 10, traits: ["over_10g_fat", "bile_stimulant"] },
      { name: "Peanut Butter", sv: "Jordnötssmör", lmv: "Jordnötssmör", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "fodmaps", "galactans", "allergen_peanut", "cross_reactive", "cross_grass"] },
      { name: "Agave Syrup", sv: "Agavesirap", portion: 25, traits: ["fodmaps", "fructose", "refined_carbs"] },
      { name: "Nutritional Yeast", sv: "Näringsjäst", lmv: "Näringsjäst", portion: 5, traits: [] },
      /* Jam, one per fruit. The sugar is the same 55-60g in all of them, so
         what separates them is the pollen cross-reactivity the fruit brings —
         which is why they are eleven rows and not one. */
      { name: "Cod Liver Oil", sv: "Torskleverolja", portion: 10, traits: ["over_10g_fat", "bile_stimulant", "allergen_fish"] },
      { name: "Chocolate Spread (hazelnut)", sv: "Chokladpålägg (hasselnöt)", portion: 20, traits: ["over_10g_fat", "refined_carbs", "allergen_milk", "allergen_treenut"] },
      { name: "Dulce de Leche", sv: "Dulce de leche", portion: 20, traits: ["refined_carbs", "allergen_milk"] },
      { name: "Apricot Jam", sv: "Aprikossylt", portion: 20, traits: ["refined_carbs", "cross_reactive", "cross_birch"] },
      { name: "Blueberry Jam", sv: "Blåbärssylt", portion: 20, traits: ["refined_carbs"] },
      { name: "Cherry Jam", sv: "Körsbärssylt", portion: 20, traits: ["refined_carbs", "polyols", "fodmaps", "cross_reactive", "cross_birch"] },
      { name: "Fig Jam", sv: "Fikonsylt", portion: 20, traits: ["refined_carbs", "fodmaps", "fructose"] },
      { name: "Plum Jam", sv: "Plommonsylt", portion: 20, traits: ["refined_carbs", "polyols", "fodmaps", "cross_reactive", "cross_birch"] },
      { name: "Raspberry Jam", sv: "Hallonsylt", portion: 20, traits: ["refined_carbs"] },
      { name: "Strawberry Jam", sv: "Jordgubbssylt", portion: 20, traits: ["refined_carbs", "cross_reactive", "cross_birch"] },
      { name: "Strawberry Jam (reduced sugar)", sv: "Jordgubbssylt (sockerreducerad)", portion: 20, traits: ["refined_carbs", "cross_reactive", "cross_birch"] },
      { name: "Blackberry Jelly", sv: "Björnbärsgelé", portion: 20, traits: ["refined_carbs"] },
      { name: "Redcurrant Jelly", sv: "Rödvinbärsgelé", portion: 20, traits: ["refined_carbs"] },
      { name: "Orange Marmalade", sv: "Apelsinmarmelad", portion: 20, traits: ["refined_carbs", "cross_reactive", "cross_grass"] }
    ]
  },
  {
    id: "sauces",
    label: "Sauces",
    sv: "Såser",
    foods: [
      { name: "Ketchup", sv: "Ketchup", lmv: "Ketchup", portion: 25, traits: ["aceticAcid", "irritant", "dao_competitor"] },
      { name: "Mayonnaise", sv: "Majonnäs", lmv: "Majonnäs fett 80%", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen_egg"] },
      { name: "Barbecue Sauce", sv: "Barbecuesås", portion: 25, traits: ["aceticAcid", "irritant", "refined_carbs"] },
      { name: "Hot Sauce", sv: "Hetsås", portion: 5, traits: ["histamine", "irritant", "capsaicin"] },
      { name: "Horseradish Sauce", sv: "Pepparrotssås", portion: 25, traits: ["irritant", "over_10g_fat", "bile_stimulant"] },
      { name: "Tartar Sauce", sv: "Tartarsås", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen_egg"] },
      { name: "Salsa", sv: "Salsa", lmv: "Tomatsalsa kall", portion: 25, traits: ["irritant"] },
      { name: "Ranch Dressing", sv: "Ranchdressing", lmv: "Dressing konserv. fett ca 25%", portion: 25, traits: ["over_10g_fat", "allergen_milk", "allergen_egg"] },
      { name: "Thousand Island Dressing", sv: "Rhode Island-dressing", lmv: "Dressing konserv. fett ca 25%", portion: 25, traits: ["over_10g_fat", "allergen_egg"] },
      { name: "Teriyaki Sauce", sv: "Teriyakisås", portion: 25, traits: ["histamine", "allergen_soy", "allergen_wheat", "refined_carbs"] },
      { name: "Fish Sauce", sv: "Fisksås", lmv: "Fisksås", portion: 5, traits: ["histamine", "allergen_fish"] },
      { name: "Béarnaise Sauce", sv: "Bearnaisesås", lmv: "Bearnaisesås hemlagad", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen_egg", "allergen_milk"] },
      { name: "Hollandaise Sauce", sv: "Hollandaisesås", lmv: "Hollandaisesås hemlagad", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen_egg", "allergen_milk"] },
      { name: "Remoulade", sv: "Remoulad", lmv: "Remouladsås", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "allergen_egg", "irritant", "allergen_mustard"] },
      { name: "Tomato Pasta Sauce", sv: "Tomatsås till pasta", lmv: "Pastasås m. tomat örtkryddor", portion: 60, traits: ["fodmaps", "fructans", "refined_carbs"] },
      { name: "Bechamel Sauce", sv: "Bechamelsås", lmv: "Béchamelsås", portion: 60, traits: ["allergen_milk", "allergen_wheat"] },
      { name: "Satay / Peanut Sauce", sv: "Satay- / jordnötssås", lmv: "Jordnötssås", portion: 25, traits: ["refined_carbs", "fodmaps", "fructans", "allergen_peanut"] },
      { name: "Vegan Mayonnaise", sv: "Vegansk majonnäs", portion: 25, traits: ["over_10g_fat", "bile_stimulant"] }
    ]
  },
  {
    id: "mushrooms",
    label: "Mushrooms",
    sv: "Svamp",
    foods: [
      { name: "Shiitake Mushrooms", sv: "Shiitakesvamp", form: "fresh", lmv: "Shiitakesvamp", portion: 80, traits: ["fodmaps", "polyols", "dao_competitor", "allergen_mushroom"] },
      { name: "Oyster Mushrooms", sv: "Ostronskivling", form: "fresh", lmv: "Ostronskivling", portion: 80, traits: ["dao_competitor", "allergen_mushroom"] },
      { name: "White Button Mushrooms", sv: "Champinjon", form: "fresh", lmv: "Champinjon", portion: 80, traits: ["fodmaps", "polyols", "dao_competitor", "allergen_mushroom"] },
      { name: "Portobello Mushrooms", sv: "Portabello", form: "fresh", lmv: "Champinjon", portion: 80, traits: ["fodmaps", "polyols", "dao_competitor", "allergen_mushroom"] },
      { name: "Cremini Mushrooms", sv: "Kastanjechampinjon", form: "fresh", lmv: "Champinjon", portion: 80, traits: ["fodmaps", "polyols", "dao_competitor", "allergen_mushroom"] },
      { name: "Chanterelle Mushrooms", sv: "Kantarell", form: "fresh", lmv: "Kantarell gul rå", portion: 80, traits: ["fodmaps", "polyols", "dao_competitor", "allergen_mushroom"] },
      { name: "Porcini Mushrooms", sv: "Karljohansvamp", form: "fresh", portion: 80, traits: ["fodmaps", "polyols", "dao_competitor", "allergen_mushroom"] },
      { name: "Morel Mushrooms", sv: "Murkla", form: "fresh", portion: 80, traits: ["fodmaps", "polyols", "dao_competitor", "allergen_mushroom"] },
      { name: "King Oyster Mushrooms", sv: "Kungsostronskivling", form: "fresh", lmv: "Ostronskivling", portion: 80, traits: ["dao_competitor", "allergen_mushroom"] },
      { name: "Truffle", sv: "Tryffel", portion: 5, traits: ["fodmaps", "polyols", "dao_competitor", "allergen_mushroom"] },
      { name: "Maitake Mushrooms", sv: "Maitake", form: "fresh", portion: 80, traits: ["fodmaps", "polyols", "dao_competitor", "allergen_mushroom"] },
    ]
  },
  {
    id: "snacksSweets",
    label: "Snacks & Sweets",
    sv: "Snacks och sötsaker",
    foods: [
      { name: "Potato chips", sv: "Potatischips", lmv: "Chips potatis naturell", portion: 30, traits: ["over_10g_fat"] },
      // No generic entry exists. The database has 13 chocolate-coated bars
      // described by their filling; this is the nougat/caramel/peanut one.
      { name: "Candy bars", sv: "Chokladbitar", lmv: "Mjuk nougat m. kolasås jordnötter mjölkchokladöverdrag", lmvNote: "one representative bar, not a generic entry", portion: 50, traits: ["fodmaps", "over_10g_fat", "bile_stimulant", "refined_carbs", "over_3g_lactose", "allergen_milk"] },
      /* 7.4g of lactose per 100g is 2.22g in a 30g piece, under our 5g dose —
         the tag had been resting on 56.2g of total sugars, nearly all of it
         sucrose. It stays anyway, because Monash measured this food and gives
         a low-FODMAP serving of 20g, below the 30g portion here. Their
         threshold for lactose is lower than ours, and a direct measurement of
         the food beats our arithmetic on a borrowed column. */
      { name: "Milk chocolate", sv: "Mjölkchoklad", lmv: "Mjölkchoklad", portion: 30, traits: ["irritant", "over_10g_fat", "bile_stimulant", "refined_carbs", "over_3g_lactose", "fodmaps", "caffeine", "allergen_milk"] },
      // Livsmedelsverket lists 0g fiber, which is a gap rather than a real zero:
      // 70% chocolate runs around 11g/100g. That correction used to carry the
      // fiber tag past a per-100g threshold, but 25g of chocolate is under 3g
      // of fiber either way, so the tag goes.
      { name: "Dark Chocolate", sv: "Mörk choklad", lmv: "Mörk choklad kakao ≥ 70%", portion: 25, traits: ["irritant", "over_10g_fat", "bile_stimulant", "refined_carbs", "caffeine"] },
      { name: "Cheese Puffs / Snacks", sv: "Ostbågar", lmv: "Ostbågar", portion: 25, traits: ["over_10g_fat", "allergen_milk"] },
      { name: "Granola Bar", sv: "Müslibar", lmv: "Bar müslibar m. choklad berikad", portion: 30, traits: ["refined_carbs", "allergen_treenut", "allergen_wheat"] },
      { name: "Protein Bar", sv: "Proteinbar", portion: 50, traits: ["protein", "refined_carbs", "allergen_milk"] },
      { name: "Microwave Popcorn", sv: "Mikropopcorn", lmv: "Popcorn mikropopcorn poppade fett ca 22%", portion: 25, traits: [] },
      { name: "Sugary Breakfast Cereal", sv: "Sötad frukostflingor", lmv: "Frukostflingor majs m. socker", portion: 40, traits: ["refined_carbs", "allergen_wheat"] },
      { name: "Sugary soft drinks", sv: "Sockrad läsk", lmv: "Läsk", portion: 330, traits: ["refined_carbs", "carbonation", "irritant"] },
      { name: "Cola", sv: "Cola", lmv: "Läsk cola", portion: 330, traits: ["caffeine", "refined_carbs", "carbonation", "irritant"] },
      /* 3.35g of lactose in a 100g serving against our 5g dose, where the tag
         had been resting on 16.5g of total sugars. It stays: Monash gives this
         food no low-FODMAP serving at all. Same reasoning as milk chocolate. */
      { name: "Ice Cream", sv: "Glass", lmv: "Glass fett ca 10%", portion: 100, traits: ["over_10g_fat", "bile_stimulant", "refined_carbs", "over_3g_lactose", "fodmaps", "allergen_milk"] },
      { name: "Halva", sv: "Halva", portion: 30, traits: ["over_10g_fat", "bile_stimulant", "allergen_sesame", "refined_carbs"] },
      { name: "Baklava", sv: "Baklava", lmv: "Baklava ", portion: 40, traits: ["over_10g_fat", "refined_carbs", "allergen_wheat", "allergen_treenut"] },
      { name: "Sugar-free Chewing Gum", sv: "Sockerfritt tuggummi", lmv: "Tuggummi sockerfritt", portion: 5, traits: ["fodmaps", "polyols"] },
      { name: "Cinnamon Bun", sv: "Kanelbulle", lmv: "Sött vetebröd kanelbulle gräddad kylvara frysvara el. butiksbakad", lmvNote: "the 18.5 g of sugar is nearly all sucrose — the milk in the dough leaves well under a gram of lactose", portion: 60, traits: ["over_10g_fat", "refined_carbs", "fodmaps", "fructans", "allergen_milk", "allergen_wheat"] },
      { name: "Marzipan", sv: "Marsipan", lmv: "Mandelmassa", portion: 30, traits: ["over_10g_fat", "refined_carbs", "fodmaps", "galactans", "allergen_treenut"] },
      { name: "Liquorice", sv: "Lakrits", lmv: "Lakritsgodis", portion: 30, traits: ["refined_carbs"] },
      { name: "Salty Liquorice", sv: "Saltlakrits", portion: 25, traits: ["refined_carbs"] },
      /* Confectionery and biscuits from the French round. Every dose tag here
         was checked against the figures rather than judged by eye, which took
         nine of them off again. */
      { name: "Candied Chestnut", sv: "Kanderad kastanj", portion: 30, traits: ["refined_carbs", "cross_reactive", "cross_latex"] },
      { name: "Candied Fruit", sv: "Kanderad frukt", portion: 30, traits: ["refined_carbs"] },
      { name: "Candied Orange Peel", sv: "Kanderat apelsinskal", portion: 30, traits: ["refined_carbs", "irritant", "peel_skin", "cross_reactive", "cross_grass"] },
      { name: "Chewy Caramel", sv: "Kola", portion: 30, traits: ["refined_carbs", "allergen_milk"] },
      { name: "Hard Candy", sv: "Hårt godis", portion: 30, traits: ["refined_carbs"] },
      { name: "Caramel Hard Candy", sv: "Karamell", portion: 30, traits: ["refined_carbs"] },
      { name: "Marshmallow", sv: "Marshmallow", portion: 30, traits: ["refined_carbs"] },
      { name: "Meringue", sv: "Maräng", portion: 30, traits: ["refined_carbs", "allergen_egg"] },
      { name: "Sugared Almond", sv: "Dragerad mandel", portion: 30, traits: ["refined_carbs", "fodmaps", "galactans", "allergen_treenut", "cross_reactive", "cross_birch"] },
      { name: "Nougat Chocolate Bar", sv: "Chokladbar med nougat", portion: 50, traits: ["over_10g_fat", "bile_stimulant", "refined_carbs", "caffeine", "irritant", "allergen_milk"] },
      { name: "Coconut Chocolate Bar", sv: "Chokladbar med kokos", portion: 50, traits: ["over_10g_fat", "bile_stimulant", "refined_carbs", "caffeine", "irritant", "allergen_milk"] },
      { name: "Chocolate Bar with Dried Fruit", sv: "Chokladbar med torkad frukt", portion: 50, traits: ["over_10g_fat", "bile_stimulant", "refined_carbs", "caffeine", "irritant", "allergen_milk"] },
      { name: "Dark Chocolate with Nuts", sv: "Mörk choklad med nötter", portion: 25, traits: ["over_10g_fat", "bile_stimulant", "refined_carbs", "caffeine", "irritant", "fodmaps", "galactans", "allergen_treenut"] },
      { name: "Dark Chocolate with Praline", sv: "Mörk choklad med praliné", portion: 25, traits: ["over_10g_fat", "refined_carbs", "caffeine", "irritant", "allergen_treenut", "allergen_milk"] },
      { name: "Mint Chocolate", sv: "Mintchoklad", portion: 25, traits: ["refined_carbs", "caffeine", "irritant"] },
      { name: "Milk Chocolate with Praline", sv: "Mjölkchoklad med praliné", portion: 30, traits: ["over_10g_fat", "bile_stimulant", "refined_carbs", "caffeine", "irritant", "allergen_treenut", "allergen_milk"] },
      { name: "White Chocolate with Nuts", sv: "Vit choklad med nötter", portion: 30, traits: ["over_10g_fat", "bile_stimulant", "refined_carbs", "fodmaps", "galactans", "allergen_treenut", "allergen_milk"] },
      { name: "Sponge Fingers", sv: "Savoiardikex", portion: 30, traits: ["refined_carbs", "allergen_wheat", "allergen_egg"] },
      { name: "Almond Thins", sv: "Mandelflarn", portion: 30, traits: ["refined_carbs", "fodmaps", "galactans", "allergen_wheat", "allergen_treenut"] },
      { name: "Biscuit (reduced fat)", sv: "Kex (fettreducerat)", portion: 30, traits: ["refined_carbs", "allergen_wheat"] },
      { name: "Chocolate Chip Biscuit", sv: "Chokladkaka (kex)", portion: 30, traits: ["over_10g_fat", "refined_carbs", "irritant", "caffeine", "allergen_wheat", "allergen_milk"] },
      { name: "Wafer Biscuit", sv: "Rån", portion: 30, traits: ["refined_carbs", "allergen_wheat"] },
      { name: "Filled Wafer Biscuit", sv: "Fyllt rån", portion: 30, traits: ["over_10g_fat", "refined_carbs", "allergen_wheat", "allergen_milk"] },
      { name: "Ice Cream Cone", sv: "Glasstrut", portion: 100, traits: ["over_10g_fat", "bile_stimulant", "refined_carbs", "irritant", "alcohol", "allergen_milk", "allergen_wheat"] },
      { name: "Panna Cotta", sv: "Panna cotta", portion: 100, traits: ["over_10g_fat", "bile_stimulant", "refined_carbs", "irritant", "alcohol", "allergen_milk"] }
    ]
  },
  {
    id: "picklesFerments",
    label: "Pickles & Ferments",
    sv: "Inlagt och fermenterat",
    foods: [
      { name: "Kimchi", sv: "Kimchi", portion: 50, traits: ["histamine", "fodmaps", "fructans", "irritant"] },
      { name: "Sauerkraut", sv: "Surkål", lmv: "Surkål konserv. m. lag", portion: 50, traits: ["histamine", "dao_competitor"] },
      { name: "Pickled Cucumber", sv: "Inlagd gurka", lmv: "Gurka inlagd", portion: 25, traits: ["histamine", "aceticAcid", "irritant"] },
      { name: "Olives", sv: "Oliver", lmv: "Oliver gröna m. paprikafyllning avrunna", portion: 25, traits: ["histamine"] },
      { name: "Miso Paste", sv: "Misopasta", lmv: "Miso sojabönspasta fermenterad", portion: 5, traits: ["histamine", "dao_competitor", "allergen_soy"] },
      { name: "Pickled Beetroot", sv: "Inlagd rödbeta", lmv: "Rödbeta inlagd u. lag", portion: 40, traits: ["fodmaps", "fructans", "irritant", "aceticAcid", "refined_carbs", "salicylate"] },
      { name: "Pickled Onion", sv: "Inlagd lök", lmv: "Syltlök inlagd", portion: 20, traits: ["fodmaps", "fructans", "irritant", "aceticAcid", "allyl_compounds", "allergen_onion"] },
      { name: "Pickled Jalapeno", sv: "Inlagd jalapeño", portion: 15, traits: ["irritant", "capsaicin", "aceticAcid"] },
      { name: "Pickled Ginger", sv: "Inlagd ingefära", portion: 5, traits: ["irritant", "aceticAcid", "refined_carbs", "cross_reactive", "cross_mugwort"] },
      { name: "Salt-brined Pickles", sv: "Saltlakegurka", lmv: "Saltgurka u. lag", portion: 30, traits: ["histamine", "dao_competitor"] },
      { name: "Capers", sv: "Kapris", portion: 5, traits: ["histamine", "irritant", "aceticAcid"] },
      { name: "Natto", sv: "Natto", portion: 40, traits: ["histamine", "dao_competitor", "fodmaps", "galactans", "allergen_soy"] },
    ]
  }
];

/* Groups the category buttons under "Choose foods" into labeled clusters.
   List category `id`s (from CATEGORIES above), not labels. Any category id
   not listed here still renders, grouped under a trailing "Other" section —
   see FOOD_CATEGORY logic in script.js. */
const CATEGORY_GROUPS = [
  {
    title: "Produce", sv: "Frukt & grönt",
    categories: ["roots", "veggies", "fruits", "berries", "driedFruits", "mushrooms"]
  },
  {
    title: "Grains, Legumes & Nuts", sv: "Spannmål, baljväxter & nötter",
    categories: ["grains", "legumes", "nuts"]
  },
  {
    title: "Animal-Based", sv: "Animaliskt",
    categories: ["landAnimals", "seafood", "dairy"]
  },
  {
    title: "Flavor & Extras", sv: "Smaksättare & tillbehör",
    categories: ["spices", "condiments", "sauces", "picklesFerments"]
  },
  {
    title: "Processed & Beverages", sv: "Processat & drycker",
    categories: ["ultraProcessed", "plantBased", "snacksSweets", "beverages"]
  }
];
