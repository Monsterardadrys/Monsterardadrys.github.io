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
          { type: "p", text: "Symptoms usually come from something protein-rich foods carry alongside the protein: dairy protein is often paired with lactose, some proteins overlap with Big 9 allergens, and fermented or aged proteins (cured meat, aged cheese) can be high in histamine." }
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
            "**Capsaicin:** activates pain/heat receptors in the gut lining, found in hot peppers",
            "**Peel/skin:** concentrated fiber and irritant compounds in the outer layer of some fruits/vegetables",
            "**Allyl/sulfur compounds:** pungent compounds in raw garlic, onion, mustard",
            "**Carbonation:** gas causes distension, worsens bloating and reflux",
            "**Acetic acid:** vinegar's acidity can irritate the gut lining directly",
            "**Alcohol:** relaxes the esophageal sphincter, irritates gut lining",
            "**Caffeine:** stimulates gut motility and acid secretion"
          ]}
        ]
      },
      {
        heading: null,
        blocks: [
          { type: "note", text: "This reflects a mix of clinical experience, general physiology, and GI research — with varying levels of confidence per specific trait. Not every food tagged here has an equally strong or proven effect; treat this as a starting point for individual investigation." }
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
        heading: "Three ways foods raise histamine load",
        blocks: [
          { type: "list", items: [
            "**High histamine content:** aged, fermented, or spoiled foods (aged cheese, cured meat, sauerkraut, wine)",
            "**Histamine liberators:** foods that trigger mast cells to release stored histamine (citrus, strawberries, chocolate, some nuts)",
            "**DAO/MAO blockers:** foods or drinks that inhibit these breakdown enzymes (alcohol, energy drinks)"
          ]}
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

  bile_stimulant: {
    title: "Bile Stimulants",
    sections: [
      {
        heading: "What triggers bile release?",
        blocks: [
          { type: "p", text: "Fat is the dominant dietary trigger of cholecystokinin (CCK), a hormone that signals the gallbladder to contract and release bile. Protein is a weaker, secondary trigger. Fried and smoked foods are common contributors too, both because they're typically high in fat and because the frying/smoking process itself can add further irritant compounds." }
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
          { type: "note", text: "Foods are tagged here based on fat/protein content thresholds rather than a formal clinical classification — treat this as a starting point rather than a diagnostic label." }
        ]
      }
    ]
  },

  allergen: {
    title: "Allergens",
    sections: [
      {
        heading: "The \"Big 9\"",
        blocks: [
          { type: "p", text: "Milk, egg, wheat, fish, shellfish, peanut, tree nut, soy, and sesame cause the large majority of true, IgE-mediated food allergies — distinct from dose-dependent intolerances tracked elsewhere on this site." }
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
            "Peanut is a legume; peanut allergy doesn't reliably predict tree nut allergy.",
            "Sesame is a more recently recognized Big 9 allergen and can cause severe reactions."
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
            "**Grass:** melon, watermelon, tomato, orange, peanut, potato",
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
  }

};
