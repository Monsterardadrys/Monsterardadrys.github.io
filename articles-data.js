/* =========================================================================
   articles-data.js — deep-dive articles for the Food Intolerance Guide
   =========================================================================

   Add a new article without touching articles.html, styles.css, or any
   other page: just add a key to ARTICLES below.

   ---------------------------------------------------------------------
   ADD A NEW ARTICLE
   ---------------------------------------------------------------------
     myTopic: {
       title: "Display title",
       sections: [
         {
           heading: "A section heading" or null,
           blocks: [
             { type: "p", text: "A paragraph. Use **double asterisks** for bold." },
             { type: "subheading", text: "A smaller heading inside this section" },
             { type: "list", items: ["Item one", "**Bold lead-in:** rest of item"] },
             { type: "note", text: "Small italic note, e.g. a disclaimer." }
           ]
         }
       ]
     }

   Link it to a trait so the "Show Analysis" popup can point straight to it:
   in foods-data.js, set `articleId: "myTopic"` on that trait.

   It will automatically show up in the article index on articles.html in
   whatever order it's defined here. That order is deliberately kept in
   step with the filter list (FILTER_SECTIONS in foods-data.js): the
   macronutrient overview first, then GI Irritants, FODMAPs (broad +
   subtypes), Other Digestive Factors, Allergens, then Cross-Reactivity
   & Delayed Allergy — matching how a reader encounters the same topics
   on the checklist.
   ========================================================================= */

const ARTICLES = {

  macros: {
    title: "Overview of Macronutrients",
    sections: [
      {
        heading: null,
        blocks: [
          { type: "p", text: "Macronutrients — carbohydrates, protein, fat, and fiber — are the nutrients the body needs in large amounts for energy and tissue maintenance. Alcohol is sometimes grouped alongside them, since it provides calories but no nutrients." }
        ]
      },
      {
        heading: "The main groups",
        blocks: [
          { type: "list", items: [
            "**Carbohydrates:** the body's main energy source; includes sugars, starches, and fiber",
            "**Protein:** builds and repairs tissue; a moderate stimulant of bile release",
            "**Fat:** the most energy-dense macronutrient; needs bile to digest",
            "**Fiber:** the indigestible part of plant foods; feeds the gut microbiome",
            "**Alcohol:** not a nutrient, but a common dietary component worth tracking separately"
          ]}
        ]
      },
      {
        heading: "Why they matter for GI symptoms",
        blocks: [
          { type: "p", text: "Each macronutrient can trigger digestive symptoms through a different mechanism, and in different people. This overview only summarizes what they are — each has its own dedicated article on this site covering how and why it can cause GI symptoms." }
        ]
      },
      {
        heading: null,
        blocks: [
          { type: "note", text: "See the individual carbohydrate, protein, fat, and fiber articles for symptom-specific detail." }
        ]
      }
    ]
  },

  fat: {
    title: "Fat",
    sections: [
      {
        heading: "Why fat can trigger symptoms",
        blocks: [
          { type: "p", text: "Fat doesn't mix with water, so it needs bile as an emulsifier to break it into digestible droplets. Without enough bile, fat passes through poorly digested." },
          { type: "p", text: "Fat is the slowest macronutrient to digest. A high-fat meal stays in the stomach and small intestine longer, and it strongly stimulates the gallbladder and pancreas to release bile and digestive enzymes." },
          { type: "p", text: "For most people this is no problem. For people with GERD, IBS, gallbladder disease, or pancreatic insufficiency (EPI), it can trigger reflux, cramping, or diarrhea." }
        ]
      },
      {
        heading: "Who is more sensitive?",
        blocks: [
          { type: "list", items: [
            "**GERD, IBS, IBD:** fat most often worsens symptoms already caused by these conditions rather than causing them directly.",
            "**Gallstones / biliary colic:** fat triggers gallbladder contraction, which can cause pain in a diseased gallbladder — a case of fat causing symptoms directly.",
            "**EPI / pancreatitis:** without enough pancreatic enzymes, fat isn't broken down properly, causing oily stools and urgent diarrhea — also a direct cause."
          ]}
        ]
      },
      {
        heading: "Warning signs of fat malabsorption",
        blocks: [
          { type: "p", text: "Acute diarrhea within 1-2 hours of a fatty meal, pale or yellow stool, and oily residue in the toilet can indicate a malabsorption disorder and deserve medical follow-up rather than self-managed avoidance." }
        ]
      },
      {
        heading: null,
        blocks: [
          { type: "note", text: "Loss of appetite from unrelated medical conditions (e.g. heart failure) can shift food preference toward carbs and away from fat- and protein-rich foods — worth distinguishing from a true food intolerance." },
          { type: "note", text: "Dumping syndrome — rapid gastric emptying causing cramping, diarrhea, and sometimes low blood sugar — is common after GI surgery (bariatric, oncologic, or IBD-related resections), typically triggered by fat-rich or carb-rich meals." }
        ]
      }
    ]
  },

  protein: {
    title: "Protein",
    sections: [
      {
        heading: "Why protein can trigger symptoms",
        blocks: [
          { type: "p", text: "Protein itself is well tolerated by most people, but it's a moderate stimulant of bile release (weaker than fat) and a large protein load can slow digestion." },
          { type: "p", text: "Symptoms usually come from something protein-rich foods carry alongside the protein: dairy protein is often paired with lactose, some proteins overlap with declarable allergens, and fermented or aged proteins (cured meat, aged cheese) can be high in histamine." }
        ]
      },
      {
        heading: "Who is more sensitive?",
        blocks: [
          { type: "list", items: [
            "**Gallbladder disease:** protein adds to the bile-release load alongside fat.",
            "**Pancreatitis / pancreatic tumors:** among the most specific causes of true protein malabsorption.",
            "**True food allergy:** milk, egg, fish, shellfish, peanut, tree nut, soy, and sesame proteins can trigger immune reactions unrelated to digestion.",
            "**Histamine intolerance:** aged, cured, or fermented protein sources tend to be high in histamine."
          ]}
        ]
      },
      {
        heading: "A note on quantity",
        blocks: [
          { type: "p", text: "Very high single-meal protein intakes (common in high-protein diets) can occasionally cause bloating or discomfort simply from the digestive workload, independent of any allergy or intolerance." }
        ]
      },
      {
        heading: null,
        blocks: [
          { type: "note", text: "Some amino acid metabolism disorders are congenital and almost never first appear in adulthood." },
          { type: "note", text: "Loss of appetite from unrelated medical conditions (e.g. heart failure) can shift food preference toward carbs and away from fat- and protein-rich foods — worth distinguishing from a true food intolerance." }
        ]
      }
    ]
  },

  carbs: {
    title: "Carbohydrates",
    sections: [
      {
        heading: "Why carbohydrates can trigger symptoms",
        blocks: [
          { type: "p", text: "Most digestive symptoms blamed on \"carbs\" actually come from specific subtypes: FODMAPs (see the FODMAPs article), lactose, or excess fructose, rather than starch or sugar in general." },
          { type: "p", text: "Refined carbohydrates can also raise blood sugar quickly, which is a separate concern from GI symptoms but often gets grouped in with them." }
        ]
      },
      {
        heading: "Who is more sensitive?",
        blocks: [
          { type: "list", items: [
            "**IBS / SIBO:** fermentable carbohydrate subtypes (FODMAPs) are the main driver of bloating and gas.",
            "**Lactose intolerance:** lactose specifically, not carbohydrates broadly.",
            "**Diabetes / insulin resistance:** carbohydrate load affects blood sugar regardless of GI tolerance."
          ]}
        ]
      },
      {
        heading: "Practical takeaway",
        blocks: [
          { type: "p", text: "If carbohydrate-containing foods are a suspected trigger, checking which specific subtype (FODMAPs, lactose, fructose) they share is usually more useful than avoiding carbohydrates as a whole." }
        ]
      },
      {
        heading: null,
        blocks: [
          { type: "note", text: "Dumping syndrome — rapid gastric emptying causing cramping, diarrhea, and sometimes low blood sugar — is common after GI surgery (bariatric, oncologic, or IBD-related resections), typically triggered by carb-rich or fat-rich meals." }
        ]
      }
    ]
  },

  fiber: {
    title: "Fiber",
    sections: [
      {
        heading: "What is fiber?",
        blocks: [
          { type: "p", text: "Fiber is the part of plant foods the body can't fully digest. It passes through the digestive system largely intact, which is exactly what makes it so useful — and, for some people, occasionally uncomfortable." }
        ]
      },
      {
        heading: "Health benefits",
        blocks: [
          { type: "p", text: "Fiber supports gut health and the gut microbiome, heart health, blood sugar regulation, weight control, and helps move waste (and the toxins bound to it) through the digestive tract." }
        ]
      },
      {
        heading: "Food sources",
        blocks: [
          { type: "p", text: "Fiber is present in plant foods: vegetables, fruits, whole grains, legumes, nuts, and seeds. Processed foods usually contain less fiber than their whole-food counterparts, though some are fortified with added fiber. Foods particularly high in fiber include flax seeds, chia seeds, wheat and oat bran, whole grain pasta, bread and rice, and beans and peas." }
        ]
      },
      {
        heading: "What problems can fiber cause?",
        blocks: [
          { type: "p", text: "Overconsumption from supplements carries real risks for anyone: in rare cases, ileus (a bowel blockage), constipation (especially combined with low water intake), gas, and bloating. Overconsumption from whole foods is gentler, but can still reduce appetite and lead to unintended weight loss if taken to an extreme." }
        ]
      },
      {
        heading: "Who is more sensitive?",
        blocks: [
          { type: "p", text: "Fiber can cause more pronounced symptoms in people with certain sensitivities — IBS, reflux, slowed gastric emptying, short bowel syndrome, or small intestinal bacterial overgrowth (SIBO), among others." }
        ]
      },
      {
        heading: null,
        blocks: [
          { type: "note", text: "Don't stick to a low-fiber, low-variety diet for more than a couple of weeks unless it's clearly necessary." }
        ]
      }
    ]
  },

  fodmaps: {
    title: "FODMAPs",
    sections: [
      {
        heading: "What are FODMAPs?",
        blocks: [
          { type: "p", text: "FODMAP stands for Fermentable Oligosaccharides, Disaccharides, Monosaccharides, and Polyols. These are short-chain carbohydrates that aren't fully absorbed in the small intestine. Instead, they travel on to the colon, where gut bacteria ferment them." },
          { type: "list", items: [
            "**Oligosaccharides**: fructans and galacto-oligosaccharides, found in wheat, onion, garlic, and many legumes",
            "**Disaccharides**: mainly lactose, found in dairy",
            "**Monosaccharides**: excess fructose, found in some fruits and honey",
            "**Polyols**: sugar alcohols like sorbitol and mannitol, found in some fruits and sugar-free sweeteners"
          ]}
        ]
      },
      {
        heading: "Why they cause symptoms",
        blocks: [
          { type: "p", text: "Because they aren't well absorbed, FODMAPs draw extra water into the bowel and are fermented by gut bacteria, producing gas. For most people this fermentation effect is mild and tends to improve over time as the gut microbiome adapts, even without reducing intake." }
        ]
      },
      {
        heading: "Who is more sensitive?",
        blocks: [
          { type: "p", text: "For sensitive individuals — such as people with Irritable Bowel Syndrome (IBS) — moderate symptoms can occur even at a relatively low intake, and the microbiome adapts more slowly. At a high daily intake, symptoms can become severe, causing acute diarrhea and pain." }
        ]
      },
      {
        heading: "Common high-FODMAP foods",
        blocks: [
          { type: "p", text: "On this site's food checklist, foods flagged with the FODMAPs trait include onions, garlic, wheat, rye, barley, many legumes (chickpeas, lentils, black beans), apples, and several nuts (almonds, cashews, hazelnuts, peanuts)." }
        ]
      },
      {
        heading: "The low-FODMAP approach",
        blocks: [
          { type: "p", text: "A structured elimination-and-reintroduction approach (most known from Monash University's research) is commonly used to identify individual triggers. It's meant to be short-term and systematic rather than an indefinite restriction." }
        ]
      },
      {
        heading: null,
        blocks: [
          { type: "note", text: "Best done with guidance from a dietitian or other healthcare professional, rather than as a self-directed long-term diet." }
        ]
      }
    ]
  },

  fructose: {
    title: "Fructose",
    sections: [
      {
        heading: "What is excess fructose?",
        blocks: [
          { type: "p", text: "This article covers excess fructose specifically — more free fructose than glucose in a meal, which overwhelms small-intestine absorption capacity and draws water into the bowel." }
        ]
      },
      {
        heading: "Food sources",
        blocks: [
          { type: "p", text: "Found in honey, apples, mangoes, and high-fructose corn syrup, among other fructose-rich fruits and sweeteners." }
        ]
      },
      {
        heading: "Improving tolerance",
        blocks: [
          { type: "p", text: "Pairing high-fructose foods with a source of glucose (e.g. fruit with a starchy side) can improve absorption, since glucose helps transport fructose across the gut wall." }
        ]
      },
      {
        heading: "Hereditary fructose intolerance (HFI)",
        blocks: [
          { type: "p", text: "HFI is a rare genetic condition (roughly 1 in 20,000-30,000) causing an inability to break down fructose at all. It's present from birth, but because affected people often develop a strong natural aversion to sweet foods, it can go undiagnosed until adulthood. It's a distinct condition from the excess-fructose sensitivity covered here." }
        ]
      },
      {
        heading: null,
        blocks: [
          { type: "note", text: "Excess fructose is a FODMAP subtype. It's mainly a problem for people with IBS, though it can also cause discomfort in other GI disorders, or in anyone if consumption is high enough." }
        ]
      }
    ]
  },

  polyols: {
    title: "Polyols",
    sections: [
      {
        heading: "What are polyols?",
        blocks: [
          { type: "p", text: "Polyols — sugar alcohols such as sorbitol and mannitol — are poorly absorbed. They pull water into the bowel osmotically and are fermented by colon bacteria, producing gas." }
        ]
      },
      {
        heading: "Food sources",
        blocks: [
          { type: "p", text: "Common in apples, pears, stone fruits (apricots, plums, peaches), mushrooms, and sugar-free sweeteners used in chewing gum and \"diet\" products." }
        ]
      },
      {
        heading: "A well-documented, dose-dependent effect",
        blocks: [
          { type: "p", text: "This osmotic effect is well known enough that many sugar-free products carry a laxative-effect warning label — worth checking if bloating or diarrhea follows sugar-free snacks or gum." }
        ]
      },
      {
        heading: null,
        blocks: [
          { type: "note", text: "Polyols are a FODMAP subtype. Mainly a problem for people with IBS, though it can also cause discomfort in other GI disorders, or in anyone if consumption is high enough." }
        ]
      }
    ]
  },

  fructans: {
    title: "Fructans",
    sections: [
      {
        heading: "What are fructans?",
        blocks: [
          { type: "p", text: "Chains of fructose molecules that humans can't digest; fermented by colon bacteria in the same way as other FODMAPs." }
        ]
      },
      {
        heading: "Food sources",
        blocks: [
          { type: "p", text: "Found in wheat, onion, and garlic — among the most common FODMAP triggers, since these are staple ingredients in many cuisines." }
        ]
      },
      {
        heading: "A practical substitution",
        blocks: [
          { type: "p", text: "Fructans aren't oil-soluble, which is why garlic-infused oil is a common low-FODMAP substitute for cooking with garlic — it carries the flavor without the fructans." }
        ]
      },
      {
        heading: null,
        blocks: [
          { type: "note", text: "Fructans are a FODMAP subtype. Mainly a problem for people with IBS, though it can also cause discomfort in other GI disorders, or in anyone if consumption is high enough." }
        ]
      }
    ]
  },

  galactans: {
    title: "Galacto-oligosaccharides",
    sections: [
      {
        heading: "What are galacto-oligosaccharides?",
        blocks: [
          { type: "p", text: "Galacto-oligosaccharides (GOS) are short chains of galactose that the small intestine can't break down; they're fermented in the colon like other FODMAPs." }
        ]
      },
      {
        heading: "Food sources",
        blocks: [
          { type: "p", text: "Main sources are legumes and some nuts. Symptoms follow the typical FODMAP pattern — gas and bloating, dose-dependent." }
        ]
      },
      {
        heading: "Reducing GOS content",
        blocks: [
          { type: "p", text: "Soaking or sprouting legumes before cooking reduces their GOS content and is a common practical tip for better tolerance." }
        ]
      },
      {
        heading: null,
        blocks: [
          { type: "note", text: "GOS is a FODMAP subtype. Mainly a problem for people with IBS, though it can also cause discomfort in other GI disorders, or in anyone if consumption is high enough." }
        ]
      }
    ]
  },

  lactose: {
    title: "Lactose",
    sections: [
      {
        heading: "What is lactose intolerance?",
        blocks: [
          { type: "p", text: "Lactose is a sugar found in milk, broken down by the enzyme lactase. When lactase activity is too low, undigested lactose draws water into the bowel and ferments in the colon, causing gas, bloating, cramping, and diarrhea." }
        ]
      },
      {
        heading: "Types",
        blocks: [
          { type: "list", items: [
            "**Primary:** the most common form — lactase production naturally declines after childhood in most of the world's population",
            "**Secondary (temporary):** caused by damage to the gut lining from another condition, and resolves once that condition is treated"
          ]}
        ]
      },
      {
        heading: null,
        blocks: [
          { type: "note", text: "Untreated coeliac disease often causes temporary secondary lactose intolerance, since gut lining damage reduces lactase production. This is a key reason proper diagnosis matters — in children who previously tolerated lactose well, and arguably even more so in adults who have been lactose tolerant their whole life, since new-onset intolerance in adulthood is a stronger signal that something else needs investigating." }
        ]
      },
      {
        heading: "Lactose and FODMAPs/IBS",
        blocks: [
          { type: "p", text: "Lactose is one of the FODMAP subtypes (the \"D\" for disaccharides), so it's tested during a structured low-FODMAP elimination diet alongside fructans, GOS, and polyols. People with IBS often have some degree of lactose sensitivity even with normal lactase levels, since IBS increases general sensitivity to fermentable sugars — not just lactose specifically." },
          { type: "note", text: "As a FODMAP subtype, lactose is mainly a problem for people with IBS, though it can also cause discomfort in other GI disorders, or in anyone if consumption is high enough." }
        ]
      },
      {
        heading: "Managing it",
        blocks: [
          { type: "p", text: "Tolerance is dose- and dairy-type dependent — many people can tolerate small amounts or fermented/aged dairy (yogurt, hard cheese) even if unable to tolerate a glass of milk." }
        ]
      }
    ]
  },

  irritant: {
    title: "GI Irritants",
    sections: [
      {
        heading: "What counts as a GI irritant?",
        blocks: [
          { type: "p", text: "A broad group of foods that can worsen gut symptoms through different mechanisms — some well-established (fat, alcohol, caffeine, capsaicin), others based mainly on clinical observation." }
        ]
      },
      {
        heading: "Specific mechanisms",
        blocks: [
          { type: "list", items: [
            "**Capsaicin:** activates pain/heat receptors in the gut lining, found in hot peppers (well established)",
            "**Alcohol:** relaxes the esophageal sphincter, irritates gut lining (well established)",
            "**Caffeine:** stimulates gut motility and acid secretion (well established)",
            "**Carbonation:** gas causes distension, worsens bloating and reflux (limited)",
            "**Peel/skin:** concentrated fiber and irritant compounds in the outer layer of some fruits/vegetables (preliminary)",
            "**Allyl/sulfur compounds:** pungent compounds in raw garlic, onion, mustard (preliminary)",
            "**Acetic acid:** vinegar's acidity can irritate the gut lining directly (preliminary)"
          ]}
        ]
      },
      {
        heading: null,
        blocks: [
          { type: "note", text: "The levels above are the same ones shown with each trait in the results. The first three rest on measured effects in people; the last three rest on cell and animal work or on clinical experience alone. Not every food tagged here has an equally strong effect — treat this as a starting point for individual investigation." }
        ]
      }
    ]
  },

  histamine: {
    title: "Histamine",
    sections: [
      {
        heading: "What is histamine intolerance?",
        blocks: [
          { type: "p", text: "Histamine is a normal signaling molecule found in many foods and made by the body, mainly by mast cells, then broken down by two enzymes: DAO (in the gut) and MAO (mostly elsewhere in the body). When breakdown is too slow or intake too high, histamine builds up and causes symptoms that mimic an allergic reaction, even without a true immune allergy." }
        ]
      },
      {
        heading: "How foods come to carry histamine",
        blocks: [
          { type: "p", text: "Bacteria make histamine by decarboxylating free histidine. For that to happen in quantity, three things have to line up at once, and it is worth separating them — \"fermented\" is a rule of thumb that hides three different processes." },
          { type: "list", items: [
            "**Substrate.** Free histidine is released by proteolysis. Cheese ripening *is* proteolysis, running for weeks to years. Yogurt undergoes almost none — the casein is largely intact after four to eight hours of acidification.",
            "**Flora.** Yogurt uses defined starter cultures that are screened for amine-forming ability. In cheese, a secondary flora establishes itself during ripening, and several of the most prolific histamine formers belong to it.",
            "**Time.** Yogurt is chilled immediately and eaten within weeks. Cheese ripens at temperatures that allow microbial activity to continue throughout storage."
          ]},
          { type: "p", text: "That is why the spread in cheese is enormous — from undetectable to close to 400 mg/kg — while measured histamine in yogurt is undetectable. It also explains why fresh cheese and hard cheese end up at opposite ends despite identical raw material and the same lactic acid bacteria." },
          { type: "p", text: "Beyond fermentation, histamine accumulates as freshness declines. That is the mechanism behind fish, shellfish, minced meat and offal, where storage and handling matter more than the food itself." }
        ]
      },
      {
        heading: "The mechanism that was never demonstrated",
        blocks: [
          { type: "p", text: "Many lists split foods into histamine-rich and *histamine-liberating*. The second group takes in strawberries, pineapple, kiwi, papaya and citrus — foods where histamine often cannot be measured at all." },
          { type: "p", text: "A review of ten published low-histamine diets found that 68% of the excluded foods had no detectable histamine. For a large share of them, the release hypothesis is the only explanation on offer — and it does not rest on human studies. The only systematic review of the area concluded that the support consists of a handful of inconclusive test-tube and animal experiments." },
          { type: "note", text: "Foods whose only justification was the release mechanism are no longer tagged in this tool. That does not mean someone reacting to strawberries is imagining it — it means the explanation probably lies elsewhere, such as birch pollen cross-reactivity or salicylates, both of which this tool covers under other traits." }
        ]
      },
      {
        heading: "Symptoms and who's affected",
        blocks: [
          { type: "p", text: "Flushing, headache, hives, nasal congestion, and gut discomfort (bloating, diarrhea). More common in adults; dose-dependent, so small amounts of a trigger may be fine while larger amounts aren't. Mast cell activation syndrome (MCAS) is a related, more complex condition sometimes considered alongside histamine intolerance." }
        ]
      },
      {
        heading: "Diagnosis",
        blocks: [
          { type: "p", text: "There's no single definitive test. Serum DAO activity and tryptase (a mast cell marker) blood tests can support a diagnosis in some cases, but a supervised elimination-and-reintroduction diet remains the main diagnostic tool." }
        ]
      },
      {
        heading: "Reducing histamine in your diet",
        blocks: [
          { type: "list", items: [
            "Avoid cooked food that's been sitting in the fridge or at room temperature for a while — histamine rises as food ages, even before it looks or smells spoiled.",
            "Freeze leftovers soon after cooking to slow that buildup.",
            "Avoid most fish and shellfish unless certain it was frozen shortly after catch — histamine in fish rises quickly once out of the water.",
            "For specific food guidance beyond these general rules, the SIGHI food list is a detailed reference."
          ]}
        ]
      },
      {
        heading: null,
        blocks: [
          { type: "note", text: "Work with a dietitian or physician experienced in histamine intolerance before starting an elimination diet — it's easy to over-restrict and end up with unnecessary nutrient gaps." }
        ]
      }
    ]
  },

  dao_competitor: {
    title: "DAO Competitors",
    sections: [
      {
        heading: "What this trait means",
        blocks: [
          { type: "p", text: "Putrescine and cadaverine are diamines broken down by the same enzyme as histamine: DAO. When they are present in a meal they occupy the enzyme, and histamine may pass through less degraded than it otherwise would." },
          { type: "p", text: "These foods therefore add no histamine of their own. They are tagged as a possible modifier of how much histamine gets through — which is why the tool only reports the trait when the selection also contains histamine. A food high in putrescine but carrying no histamine has nothing to compete with." }
        ]
      },
      {
        heading: "Competitor, not inhibitor",
        blocks: [
          { type: "p", text: "These are two different mechanisms, and lists that merge them cause confusion. A competing substrate occupies the enzyme by being processed alongside histamine. True DAO inhibition means binding to the active site, and the substances that do that are drugs — chloroquine, clavulanic acid, verapamil, cimetidine — not foods." },
          { type: "p", text: "Alcohol is a third thing again: it competes downstream at a different enzyme, ALDH, and is tracked separately under its own trait." }
        ]
      },
      {
        heading: "What the evidence actually shows",
        blocks: [
          { type: "p", text: "One study tested this directly, mixing histamine with each amine at ratios from 1:0.25 up to 1:20. Putrescine and cadaverine both delayed histamine breakdown significantly at every ratio tested — including when the competitor was only a quarter of the histamine present. At 1:20 the reduction was 70% and 80% respectively." },
          { type: "p", text: "Tyramine, spermidine and spermine only interfered at the most extreme 1:20 ratio, and they act on different enzymes. That fits the underlying division of labour: DAO handles diamines, MAO handles monoamines, PAO handles polyamines. Only the diamines are tagged here." }
        ]
      },
      {
        heading: "Why this is the weakest trait in the tool",
        blocks: [
          { type: "list", items: [
            "**No human studies.** Everything is enzyme assays in test tubes or animal tissue.",
            "**No threshold for an effect exists.** Thresholds are established for histamine and for tyramine, but not for putrescine or cadaverine. The 10 mg/kg cutoff used here separates trace levels from meaningful ones — it does not mark a level at which anything is known to happen.",
            "**The effect is a ratio, not a level.** Competition happens across the whole meal in the gut, not inside one food."
          ]},
          { type: "note", text: "Reasonable reading: likely relevant only for particularly sensitive people, and only when the food is eaten alongside histamine-rich food." }
        ]
      },
      {
        heading: "Mushrooms are the clearest case",
        blocks: [
          { type: "p", text: "Mushrooms carry this trait and never the histamine one. Histamine is consistently undetectable in them, while putrescine can exceed 150 mg/kg fresh weight — highest in the bolete family (porcini and its relatives)." },
          { type: "p", text: "This matters practically: poison information centres have logged stomach complaints after meals of demonstrably edible mushroom species, with no explanation. Putrescine is the only amine present in amounts that could plausibly account for it." },
          { type: "note", text: "Cooking lowers the level substantially — stewing reduces all the amines measured. Raw or lightly cooked mushroom is the worst case. This is the one place in the whole dataset where preparation method is a documented modifier of the tag itself." }
        ]
      },
      {
        heading: null,
        blocks: [
          { type: "note", text: "Concentration and processing drive these levels more than the vegetable does. Ketchup and tomato purée measure well above fresh tomato, and fresh vegetables generally sit far below the threshold." }
        ]
      }
    ]
  },

  salicylate: {
    title: "Salicylates",
    sections: [
      {
        heading: "What salicylates are",
        blocks: [
          { type: "p", text: "Salicylic acid is the same active principle as in aspirin. Plants make it as a defence compound, so it turns up across fruit, vegetables, herbs and spices. Sensitivity to it produces hives, itching, headache and gut symptoms." },
          { type: "p", text: "Foods are tagged here when a normal portion carries at least 1 mg. Portion size rather than concentration is what matters: cumin measures 605 mg/kg, but a portion is 2 g — which puts it below a serving of green peas." }
        ]
      },
      {
        heading: "Who this is actually for",
        blocks: [
          { type: "p", text: "The single blinded dietary trial in this area (n=10, in IBS) was negative overall. Clear symptom provocation appeared in one participant — the one with known aspirin-induced urticaria — with a dose-response within that individual and the blinding intact, plus a trend in one other." },
          { type: "note", text: "The phenotype is the marker, not the food pattern. Ask about reactions to aspirin or NSAIDs — that is where the signal sits. Estimated prevalence is around 2.5%." }
        ]
      },
      {
        heading: "Preparation changes the level more than food choice does",
        blocks: [
          { type: "list", items: [
            "**Peeling lowers it sharply** — three to fourfold for pears and apples. This is the single most replicated finding in the area.",
            "**Boiling lowers it** — salicylic acid is volatile and sublimates on heating.",
            "**Pickling and marinating raise it.**",
            "**Concentrating raises it** — tomato purée measures above fresh tomato."
          ]},
          { type: "p", text: "Apples and pears are tagged here on their unpeeled values, since that is how they are usually eaten. Peeling them is a real option before avoiding them." },
          { type: "note", text: "Oils and sugar measure at essentially zero in every source." }
        ]
      },
      {
        heading: "How reliable the numbers are",
        blocks: [
          { type: "p", text: "Two modern studies, both careful, both covering 112 foods, disagree about which foods are high. The Australian study puts apples at 9.7 mg/kg; the European study found no salicylates at all in three Polish apple varieties. Watermelon is low in one and the highest of all fruits in the other." },
          { type: "p", text: "This tool uses the Australian data for one reason: it has been tested clinically. The blinded trial above built its diets on those values and achieved a real measured contrast. The European study is an analytical survey without clinical validation." },
          { type: "note", text: "What has been validated is the ranking, not absolute values for northern European produce. That the Polish varieties measured zero is relevant — Polish growing conditions are closer to Swedish ones than Australian conditions are. No Nordic measurements exist at all." }
        ]
      }
    ]
  },

  bile_stimulant: {
    title: "Bile Stimulants",
    sections: [
      {
        heading: "What triggers bile release?",
        blocks: [
          { type: "p", text: "Fat is the dominant dietary trigger of cholecystokinin (CCK), a hormone that signals the gallbladder to contract and release bile. Protein releases it too, but far more weakly — roughly a fifth as much per gram, which is how this tool weighs it. In practice that means a protein-rich meal needs less fat to provoke the same response: 125g of beef reaches the threshold on 12.5g of fat, where a food carrying no protein would need 13g. Fried and smoked foods are common contributors too, both because they're typically high in fat and because the frying or smoking itself can add further irritant compounds." }
        ]
      },
      {
        heading: "Clinical relevance",
        blocks: [
          { type: "list", items: [
            "Egg yolk is used clinically as a standard fatty-meal challenge to test gallbladder emptying via ultrasound",
            "Curcumin (turmeric) causes dose-dependent gallbladder contraction separately from fat content",
            "Most relevant for people with gallstones, biliary colic, or a history of gallbladder attacks — a strong contraction can trigger pain"
          ]}
        ]
      },
      {
        heading: "After gallbladder removal",
        blocks: [
          { type: "p", text: "After cholecystectomy, bile drips continuously into the gut instead of being released in a controlled burst with meals. Fat-rich meals can then cause bile acid diarrhea, a different mechanism from the pain caused by an intact but diseased gallbladder." }
        ]
      },
      {
        heading: null,
        blocks: [
          { type: "note", text: "Foods are tagged here on fat and protein content — over 17.5g fat or over 20g protein per 100g. That cut-off is this tool's own, borrowed from EU food-labeling categories rather than from any clinical guideline, and the step from a measured CCK response to an actual symptom is inferred rather than trialled. Treat it as a starting point rather than a diagnostic label." }
        ]
      }
    ]
  },

  refined_carbs: {
    title: "Refined Carbohydrates",
    sections: [
      {
        heading: "What counts as a refined carb?",
        blocks: [
          { type: "p", text: "This trait is assigned by food type and processing, not carbohydrate content — white bread, sugar, refined grains, and other ultra-processed carb sources. Whole grains, legumes, and vegetables are never tagged with it, no matter how carb-heavy they are." }
        ]
      },
      {
        heading: "Why processing, not content",
        blocks: [
          { type: "p", text: "A gram-per-100g cutoff can't tell refined and unrefined foods apart — a lentil and a slice of white bread can have similar carbohydrate counts, but behave very differently in the body. Tagging by food type instead keeps the trait meaningful." }
        ]
      },
      {
        heading: null,
        blocks: [
          { type: "note", text: "This is a categorical judgment call, not a lab measurement — see the About page for the reasoning behind it. The evidence linking refined and ultra-processed foods to gut symptoms sits at the level of the whole diet rather than any single food, which is why this trait is more useful as a pattern across a selection than as a verdict on one item." }
        ]
      }
    ]
  },

  allergen: {
    title: "Allergens",
    sections: [
      {
        heading: "The 14 declarable allergens",
        blocks: [
          { type: "p", text: "EU law requires 14 allergens to be declared on a label, however small the amount: cereals containing gluten (wheat, rye, barley, oats, spelt, kamut), milk, egg, fish, crustaceans, molluscs, peanut, tree nut, soy, sesame, celery, mustard, lupin, and sulphites above 10 mg/kg. These cause the large majority of true, IgE-mediated food allergies — distinct from the dose-dependent intolerances tracked elsewhere on this site." },
          { type: "p", text: "Thirteen of them are tracked here. Lupin is the one left out: it is declarable across the EU, but it barely reaches a Swedish plate, and the food list is Swedish first." },
          { type: "p", text: "Two more are tracked here that no label has to mention: onion and garlic, and mushroom. Neither is declarable anywhere, so nobody with one of these allergies gets any warning — and both come up often enough in practice to be worth ruling in or out." },
          { type: "p", text: "Sulphites are the odd one out. They are preservatives rather than proteins, so the reaction is not a true allergy; the best documented effect is bronchoconstriction in people with asthma. Wine, light-coloured dried fruit and some pickled products are the usual sources." }
        ]
      },
      {
        heading: "Key distinctions",
        blocks: [
          { type: "list", items: [
            "Milk allergy (casein/whey) is not the same as lactose intolerance (an enzyme issue, not immune).",
            "Egg allergy is mainly driven by egg-white proteins; the yolk is less allergenic but not necessarily safe.",
            "Wheat allergy, celiac disease, and non-celiac gluten sensitivity are three distinct conditions.",
            "Fish (parvalbumin) and shellfish (tropomyosin) are different allergens — one doesn't predict the other.",
            "Crustaceans and molluscs are declared separately: the tropomyosins differ enough that one group is often tolerated when the other isn't.",
            "Peanut is a legume; peanut allergy doesn't reliably predict tree nut allergy.",
            "Sesame can cause severe reactions and hides easily — in tahini, in hummus, in bread toppings.",
            "Celery reactions often run through birch pollen, and unlike most birch cross-reactions, celery can still react when cooked.",
            "Onion and garlic allergy is easily confused with the fructan intolerance the same foods cause — the first is immediate and oral, the second delayed and abdominal."
          ]}
        ]
      },
      {
        heading: "Sensitization and reaction severity",
        blocks: [
          { type: "p", text: "The first exposure to an allergen often causes no reaction — it primes the immune system to produce antibodies. Later exposures can trigger much stronger reactions as antibody levels rise, which is why an allergy can appear \"suddenly\" even to a food eaten safely before." }
        ]
      },
      {
        heading: "Tolerance",
        blocks: [
          { type: "p", text: "Tolerance means the immune system learns to accept a food antigen without reacting — it's the default state for most food proteins in most people. Many childhood allergies (milk, egg, wheat, soy) are outgrown as tolerance develops with age and continued exposure; others (peanut, tree nut, shellfish, fish) are more likely to persist for life." },
          { type: "p", text: "Oral immunotherapy is an emerging approach that tries to build tolerance deliberately under medical supervision — not something to attempt unsupervised." }
        ]
      },
      {
        heading: "Mushroom, mould and yeast",
        blocks: [
          { type: "p", text: "Mushroom is one of the two allergens tracked here that no label has to declare. It is worth setting out what is actually known, because \"mould allergy\" is one of the most frequently self-diagnosed food problems and one of the most frequently misattributed." },
          { type: "p", text: "Allergy to airborne mould spores — Alternaria, Cladosporium, Aspergillus, Penicillium — is real and well documented, affecting a few per cent of the population. Alternaria sensitisation is among the strongest single risk factors known for severe asthma. But that is an airway allergy to inhaled spores. It says very little about food." },
          { type: "p", text: "Reactions to eating mould are far thinner. There are case reports of people sensitised to airborne moulds reacting to blue cheese, to mycoprotein or to yeast, and shared fungal proteins are the plausible explanation. What there is not is a dependable pattern: unlike birch pollen and apple, where the cross-reaction can be anticipated, an inhalant mould allergy does not predict a food reaction." },
          { type: "p", text: "Blue cheese is the usual suspect and the weakest case. Roquefort and camembert do contain living Penicillium, but the ripening that makes them what they are also breaks the fungal proteins apart, and controlled challenges have largely come back negative. Aged cheese is among the highest-histamine foods there is, and histamine explains most of these reactions better than mould does." },
          { type: "p", text: "Mycoprotein is the real exception. Quorn is made from a living fungus, its protein reaches the plate intact, and reactions — including severe ones — have been confirmed by challenge in people with no other food allergy. That is why mycoprotein carries the mushroom tag here alongside actual mushrooms." },
          { type: "p", text: "Mould toxins are a separate subject that gets folded into this one. Aflatoxin and the other mycotoxins are a question of dose and long-term exposure, handled by food safety limits. They are not an immune reaction, and avoiding them has nothing to do with allergy." },
          { type: "note", text: "In practice, a reported reaction to \"mould\" in food turns out most often to be one of three other things: an airway allergy the person has connected to meals, a histamine reaction to aged or fermented food, or a yeast sensitivity — which rests on no better evidence than mould does. Working out which one it is changes what helps." }
        ]
      },
      {
        heading: null,
        blocks: [
          { type: "note", text: "Long-term unnecessary avoidance of a food can reduce tolerance over time, making a reaction more likely if the food is reintroduced later — this applies to true allergies, but similar patterns are seen with IBS and lactose intolerance too, even though the underlying mechanisms differ. Reintroduction is best guided by a professional rather than done alone after a long avoidance period." },
          { type: "note", text: "If a true allergy is suspected, refer for formal allergy testing rather than relying on this tool." }
        ]
      }
    ]
  },

  cross_reactive: {
    title: "Pollen-Food Cross-Reactivity",
    sections: [
      {
        heading: "What is OAS?",
        blocks: [
          { type: "p", text: "Oral allergy syndrome (OAS) occurs when foods contain proteins structurally similar to pollen allergens, causing mild tingling or itching in the mouth in people already allergic to that pollen. Most of these proteins are heat-labile, so symptoms often resolve once the food is cooked — but some (like certain lipid transfer proteins) are heat-stable and can still trigger reactions, occasionally more severe ones, even when cooked." }
        ]
      },
      {
        heading: "The three pollen groups",
        blocks: [
          { type: "list", items: [
            "**Birch (PR-10 protein family):** apples, stone fruits, carrots, celery/celeriac, hazelnuts, soy",
            "**Grass:** melon, watermelon, tomato, orange, peanut, potato — the least settled of the three: the proteins involved are more varied and the food list less consistent than for birch",
            "**Latex (chitinases):** banana, avocado, kiwi, papaya"
          ]}
        ]
      },
      {
        heading: "Diagnosis",
        blocks: [
          { type: "p", text: "OAS is typically diagnosed based on the pattern of symptoms (reaction limited to the mouth/throat, tied to specific fresh foods) plus a known pollen allergy, sometimes confirmed with skin prick testing against fresh food extracts rather than standard commercial extracts, which can miss these heat-labile proteins." }
        ]
      },
      {
        heading: null,
        blocks: [
          { type: "note", text: "Reactions are usually mild and confined to the mouth and throat, but heat-stable proteins can occasionally cause more systemic symptoms — anyone with severe or spreading reactions should be assessed by an allergist rather than relying on food avoidance alone." }
        ]
      }
    ]
  },

  alpha_gal: {
    title: "Alpha-Gal Syndrome",
    sections: [
      {
        heading: "What is alpha-gal syndrome?",
        blocks: [
          { type: "p", text: "Alpha-gal syndrome (AGS) is a delayed allergic reaction to galactose-alpha-1,3-galactose, a sugar molecule found in the meat of mammals. Unlike most food allergies, it's not triggered by a protein, and the sensitization doesn't come from food at all — it starts with a tick bite." }
        ]
      },
      {
        heading: "The tick-bite mechanism",
        blocks: [
          { type: "p", text: "Certain tick species carry alpha-gal in their saliva. A bite can sensitize the immune system to this molecule, and afterward, eating mammalian meat can trigger an allergic reaction. The Lone Star tick is the most documented cause, but other species — including some found in Scandinavia and Europe — have also been implicated." }
        ]
      },
      {
        heading: "Why it's easy to miss",
        blocks: [
          { type: "p", text: "Reactions typically appear 3 to 8 hours after eating, not within minutes like most food allergies. This delay makes the food connection easy to overlook — someone might eat dinner, then wake up in the middle of the night with hives, GI symptoms, or anaphylaxis, with no obvious trigger in sight." }
        ]
      },
      {
        heading: "Which foods are affected",
        blocks: [
          { type: "p", text: "Beef, pork, lamb, and other mammalian meat and meat products (sausages, cured meats, minced meat) can trigger reactions. Poultry and fish are not affected, since alpha-gal is specific to mammals. Dairy is a gray area — some people with AGS react to dairy fat, but many don't; this isn't tagged in the tool, but worth asking about individually." }
        ]
      },
      {
        heading: "Diagnosis",
        blocks: [
          { type: "p", text: "A specific alpha-gal IgE blood test can confirm the diagnosis. Given the delayed and inconsistent symptom pattern, AGS is worth considering in unexplained nighttime allergic reactions or GI symptoms, especially in people with a known tick bite history." }
        ]
      }
    ]
  },

  // Method article rather than a topic one — it explains how every other
  // article's data was selected, so it sits last.
  uncertainty: {
    title: "How Certain Is Any of This?",
    sections: [
      {
        heading: null,
        blocks: [
          { type: "p", text: "Every trait in this tool rests on published measurements of what foods contain. Compare two such sources and you quickly find they rarely agree — sometimes about orders of magnitude, sometimes about which foods count as high at all." },
          { type: "p", text: "That is not sloppiness. It follows from measuring biological material that varies with variety, growing conditions, season, storage and preparation, using methods that do not quite measure the same thing." },
          { type: "p", text: "This article describes where the uncertainty sits, how it has been handled here, and what it means for reading the results." }
        ]
      },
      {
        heading: "Four sources of disagreement",
        blocks: [
          { type: "list", items: [
            "**The analytical method.** Older studies used HPLC with UV detection, which is sensitive to interference from related phenolic compounds and tends to overestimate. Newer work uses mass spectrometry with an internal standard. The difference is not marginal: blueberries have been reported at 27.6 mg salicylic acid per kilo in one study and 0.57 in another.",
            "**Biological variation.** Two apples of different varieties can differ threefold. Organically grown vegetables have measured higher in salicylic acid than conventionally grown ones. Cumin from two suppliers differed by 649 mg per kilo within a single study.",
            "**What is being measured.** Salicylic acid occurs free and bound to sugars or esters. Measure only the free fraction and you get values an order of magnitude lower — cherry tomato contains 7 mg per kilo total but only 0.3 mg free. The same applies to histamine, where freshness and degree of proteolysis decide how much free histidine is available for bacteria to convert.",
            "**Preparation.** Peeling, boiling, fermenting and concentrating all change the content, sometimes in opposite directions for different substances."
          ]}
        ]
      },
      {
        heading: "Case 1: fermentation is not a mechanism",
        blocks: [
          { type: "p", text: "Almost every histamine list groups foods by whether they are fermented. It is a useful rule of thumb that conceals three separate processes — substrate, flora and time — which happen to coincide in cheese but not in yogurt." },
          { type: "p", text: "Cheese ripening is proteolysis as its main process, running for weeks to years, with a secondary flora that includes several of the most prolific histamine formers. Yogurt undergoes almost no proteolysis, uses defined starters screened for amine-forming ability, and is chilled immediately." },
          { type: "note", text: "So this tool does not tag fermentation as such, but proteolytic ripening and long fermentation with undefined flora. Yogurt, kefir, sour cream and buttermilk carry no histamine tag. See the Histamine article for the detail." }
        ]
      },
      {
        heading: "Case 2: the mechanism that was never demonstrated",
        blocks: [
          { type: "p", text: "A review of ten published low-histamine diets found that 68% of the excluded foods had no detectable histamine. For many of them the release hypothesis is the only explanation offered, and it does not rest on human studies." },
          { type: "note", text: "Foods whose only justification was that mechanism have been removed — strawberry, pineapple, kiwi, papaya and avocado among them. Avocado is the starkest: measurements show neither histamine nor putrescine, directly contradicting the list that flagged it." },
          { type: "p", text: "This does not mean patients who react to strawberries are imagining it. It means the explanation probably lies somewhere else — birch pollen cross-reactivity, salicylates, or something this tool covers under a different trait. Strawberry is a good example: it lost its histamine tag and gained a salicylate one." }
        ]
      },
      {
        heading: "Case 3: two modern studies, opposite answers",
        blocks: [
          { type: "p", text: "Salicylates show the problem at its sharpest. Two studies from the same year, both with 112 foods, both methodologically careful, disagree about which foods are high — not about scale, but about direction." },
          { type: "list", items: [
            "**Apple:** 9.7 mg/kg in the Australian study; no salicylates detected in the European one",
            "**Pear:** 12.9 mg/kg versus none detected",
            "**Watermelon:** low in one, the highest of all fruits in the other",
            "**Rice and buckwheat:** undetectable in one, high in the other"
          ]},
          { type: "p", text: "This tool uses the Australian data for a single reason: it has been tested clinically. A blinded dietary intervention built on those values produced a real contrast and a clear symptom response in the right patient. The European study is an analytical survey without clinical validation." },
          { type: "note", text: "What has been validated is the ranking, not absolute values for Nordic produce. That Polish apples and pears measured zero is relevant — Polish varieties and growing conditions are closer to Swedish ones than Australian conditions are. No Nordic data exists." }
        ]
      },
      {
        heading: "Preparation replicates better than levels do",
        blocks: [
          { type: "p", text: "One pattern stands out: sources that disagree about numbers often agree about what preparation does." },
          { type: "list", items: [
            "**Peeling lowers salicylate** three to fourfold — shown in both studies, for different foods",
            "**Boiling lowers it** — salicylic acid is volatile and sublimates on heating",
            "**Pickling and marinating raise it**",
            "**Concentrating raises it** — tomato purée measures above fresh tomato",
            "**Stewing substantially lowers putrescine in mushrooms**, which may explain complaints reported after meals of demonstrably edible species",
            "**Cooking and peeling reduce birch pollen cross-reactivity**, since the proteins involved are heat-labile"
          ]},
          { type: "p", text: "For several traits, then, *how* a food was prepared predicts more than *which* food it is. That is often also the more useful clinical angle, since it opens the door to adjustment rather than exclusion." }
        ]
      },
      {
        heading: "What this means for reading the results",
        blocks: [
          { type: "p", text: "The tool shows what the chosen foods have in common. It is a hypothesis generator, not an answer." },
          { type: "list", items: [
            "**A pattern is a starting point.** It is confirmed or rejected through structured elimination and reintroduction with a symptom diary, not by the list.",
            "**Traits are not equally well grounded.** Every trait carries one of three evidence levels, shown with the result. *Well established* means human trials or a directly measured mechanism — allergens, lactose, FODMAPs. *Limited* means real but thin, mixed, or one step removed from the symptom — bile stimulation, refined carbohydrates. *Preliminary* means test-tube work, animal models or clinical experience only — acetic acid, DAO competition. The level describes the trait, not how strongly any one person reacts to it.",
            "**Absence of a tag is not a clean bill of health.** That strawberry carries no histamine tag means the histamine explanation is weak — not that the patient tolerates strawberries.",
            "**Several traits can point at the same food.** Apple, carrot and hazelnut appear both as salicylate sources and as birch cross-reactive. The same food recurring under two traits is not two independent findings.",
            "**Portion size changes the ranking.** Cumin is high in salicylate per kilo but low per portion. Traits built on portion data say so."
          ]}
        ]
      },
      {
        heading: "The principles behind the selection",
        blocks: [
          { type: "list", items: [
            "Measured data takes precedence over lists built on experience",
            "Mechanism takes precedence over association",
            "Foods without measured data are not tagged, however plausible they seem",
            "Where sources contradict each other, the clinically tested one is used and the disagreement is stated",
            "The evidence level is given for each trait"
          ]},
          { type: "p", text: "The result is shorter lists than most published ones. That is deliberate. A short list that points in the right direction is more useful than a long one that points everywhere." }
        ]
      }
    ]
  }

};
