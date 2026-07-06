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
   whatever order it's defined here.
   ========================================================================= */

const ARTICLES = {

  macros: {
    title: "Overview of Macronutrients",
    sections: [
      {
        heading: null,
        blocks: [
          { type: "p", text: "Macronutrients are the essential nutrients that our bodies require in relatively large amounts to provide energy, support growth, and maintain proper physiological function. These include carbohydrates, proteins, fats (lipids), and fiber (which is technically a type of carbohydrate but deserves special attention). Alcohol is sometimes included in discussions of macronutrients as it provides calories but offers no nutritional value." },
          { type: "p", text: "The human body requires a balance of these macronutrients to function optimally. Each plays distinct but interconnected roles in maintaining health and providing energy. Understanding macronutrients is fundamental to making informed dietary choices and maintaining overall health." }
        ]
      },
      {
        heading: "Carbohydrates: The Primary Energy Source",
        blocks: [
          { type: "p", text: "Carbohydrates are the body's main source of energy, providing 4 calories per gram. They come in two primary forms: sugars and starches. Sugars are simple carbohydrates (monosaccharides and disaccharides) that are quickly digested and absorbed, providing immediate energy. Starches are complex carbohydrates (polysaccharides) that take longer to digest, offering sustained energy release." },
          { type: "subheading", text: "Functions of carbohydrates:" },
          { type: "list", items: [
            "Provide energy for the brain, kidneys, and central nervous system",
            "Help spare protein and fat for other critical functions",
            "Regulate blood sugar levels when consumed in appropriate portions",
            "Are essential for athletic performance and physical activity"
          ]},
          { type: "p", text: "Good carbohydrate sources include whole grains, fruits, vegetables, legumes, and dairy products. The American Heart Association recommends limiting added sugars to less than 25% of daily calories, emphasizing the importance of distinguishing between nutrient-dense carbohydrates and those that offer empty calories." }
        ]
      },
      {
        heading: "Fiber: The Digestive System's Unsung Hero",
        blocks: [
          { type: "p", text: "Fiber is a type of carbohydrate that the body cannot digest. There are two types: soluble and insoluble fiber, each offering unique benefits." },
          { type: "subheading", text: "Soluble Fiber" },
          { type: "p", text: "Dissolves in water. Forms a gel-like substance in the stomach. Helps lower cholesterol levels. Regulates blood sugar. Sources: oats, barley, beans, lentils, nuts, seeds, and fruits." },
          { type: "subheading", text: "Insoluble Fiber" },
          { type: "p", text: "Does not dissolve in water. Adds bulk to stool. Promotes regular digestion. Prevents constipation and reduces colon cancer risk. Sources: whole grains, wheat bran, vegetables (especially dark leafy greens), and potatoes with skin." },
          { type: "p", text: "A balanced diet should include about 25-30 grams of fiber daily. Fiber is crucial for digestive health, weight management (promotes satiety), and overall metabolic health. Whole foods that contain fiber are generally more beneficial than isolated fiber supplements." },
          { type: "note", text: "Pro-tip: gradually increase your fiber intake to avoid digestive discomfort, and drink plenty of water to help fiber do its job effectively." }
        ]
      },
      {
        heading: "Protein: Building and Repairing Tissue",
        blocks: [
          { type: "p", text: "Proteins are complex molecules made of amino acids, which are the body's building blocks. Nine essential amino acids must come from the diet, while the body can synthesize the other non-essential amino acids." },
          { type: "subheading", text: "Functions of protein:" },
          { type: "list", items: [
            "Builds and repairs tissues",
            "Creates enzymes, hormones, and other body chemicals",
            "Supports immune system function",
            "Provides 4 calories per gram (along with carbohydrates)",
            "Helps maintain muscle mass"
          ]},
          { type: "p", text: "Proteins are composed of chains of amino acids. The unique sequence of amino acids determines each protein's specific function. Complete proteins contain all nine essential amino acids and are found in animal products like meat, fish, eggs, and dairy. Incomplete proteins are found in plant foods and must be combined to provide all essential amino acids." },
          { type: "p", text: "Good protein sources include lean meats, poultry, fish, eggs, dairy products, legumes, tofu, tempeh, and seitan. The recommended daily intake is about 0.8 grams per kilogram of body weight for most adults, though athletes and those recovering from illness may require more." }
        ]
      },
      {
        heading: "Fats: Essential for Health and Function",
        blocks: [
          { type: "p", text: "Fats (or lipids) are essential macronutrients that provide energy, support cell growth, protect organs, and help absorb vitamins. There are different types of fats with varying health implications." },
          { type: "subheading", text: "Types of Fats" },
          { type: "list", items: [
            "**Saturated fats**: solid at room temperature, found in animal products and some tropical oils. Should be limited in the diet.",
            "**Trans fats**: artificial fats created through hydrogenation. Linked to heart disease and should be avoided.",
            "**Monounsaturated fats**: liquid at room temperature, found in olive oil, avocados, and nuts.",
            "**Polyunsaturated fats**: include omega-3 and omega-6 sources like fish, flaxseeds, and walnuts."
          ]},
          { type: "subheading", text: "Functions of fats:" },
          { type: "list", items: [
            "Provide energy (9 calories per gram)",
            "Support cell growth",
            "Protect organs",
            "Produce hormones",
            "Help with calcium absorption",
            "Support immune system function"
          ]},
          { type: "p", text: "The Dietary Guidelines for Americans recommend limiting saturated and trans fats while focusing on unsaturated fats for heart health. Healthy fats should make up about 20-35% of daily caloric intake." },
          { type: "p", text: "**Healthy fat sources:** fatty fish (salmon, mackerel), walnuts, chia seeds, flaxseeds, avocados, and olive oil are excellent sources of heart-healthy fats." }
        ]
      },
      {
        heading: "Alcohol: Energy Without Nutrition",
        blocks: [
          { type: "p", text: "Alcohol is unique among macronutrients because it provides calories (7 calories per gram) but offers no essential nutrients. Most alcoholic beverages contain carbohydrates (in the form of sugar, starch, or fiber) that contribute to the calorie count." },
          { type: "subheading", text: "Alcohol's impact:" },
          { type: "list", items: [
            "Affects brain function and judgment",
            "Interferes with nutrient absorption",
            "Contributes empty calories to the diet",
            "Can disrupt sleep patterns",
            "May impact liver function with chronic use"
          ]},
          { type: "p", text: "The Dietary Guidelines for Americans recommend that if alcohol is consumed, it should be in moderation — up to one drink per day for women and two for men. However, this recommendation may vary based on health conditions, pregnancy, or certain medications." },
          { type: "p", text: "For those who choose to drink, it's important to be aware of the calorie content and how alcohol can affect nutrient intake and overall health." }
        ]
      },
      {
        heading: null,
        blocks: [
          { type: "note", text: "This information is for educational purposes and is not a substitute for professional medical advice." }
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
        heading: "What are the health benefits of fiber?",
        blocks: [
          { type: "p", text: "Fiber supports gut health and the gut microbiome, heart health, blood sugar regulation, weight control, and helps move waste (and the toxins bound to it) through the digestive tract." },
          { type: "note", text: "Never stick to a low-fiber diet — or a low-variety, low-fiber diet — for more than a couple of weeks unless you're sure it's necessary." }
        ]
      },
      {
        heading: "What foods contain fiber?",
        blocks: [
          { type: "p", text: "Fiber is present in plant foods: vegetables, fruits, whole grains, legumes, nuts, and seeds. Processed foods usually contain less fiber than their whole-food counterparts, though some are fortified with added fiber." },
          { type: "p", text: "Examples of foods high in fiber include flax seeds, chia seeds, wheat and oat bran, whole grain pasta, bread and rice, and beans and peas — several of these also appear in the food checklist on the main page." }
        ]
      },
      {
        heading: "What problems can fiber cause?",
        blocks: [
          { type: "p", text: "Overconsumption from supplements carries real risks for anyone: in rare cases, ileus (a blockage of the bowel), constipation (especially combined with low water intake), gas, and bloating." },
          { type: "p", text: "Overconsumption from whole foods is gentler, but can still reduce appetite and lead to unintended weight loss if taken to an extreme." },
          { type: "p", text: "Fiber can cause more pronounced symptoms in people with certain sensitivities — IBS, reflux, slowed gastric emptying, short bowel syndrome, or small intestinal bacterial overgrowth (SIBO), among others." }
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
        heading: "Why can FODMAPs cause symptoms?",
        blocks: [
          { type: "p", text: "Because they aren't well absorbed, FODMAPs draw extra water into the bowel and get fermented by gut bacteria, producing gas. The number one commonality of FODMAP-containing foods is that this fermentation and water-drawing effect can cause mild or moderate gastrointestinal discomfort for anyone going from a low intake to a high intake." }
        ]
      },
      {
        heading: "How most people experience it",
        blocks: [
          { type: "p", text: "For most people, symptoms from a high FODMAP intake are mild and tend to improve over time even if the intake stays high — the gut microbiome is the main driver of these symptoms, and it adapts to a new diet." }
        ]
      },
      {
        heading: "Who is more sensitive?",
        blocks: [
          { type: "p", text: "For sensitive individuals — like people with Irritable Bowel Syndrome (IBS) — moderate symptoms can occur at a relatively low intake, and the gut microbiome takes longer to adapt. At a high daily intake, symptoms can become severe, causing acute diarrhea and severe abdominal pain." }
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
          { type: "p", text: "A structured low-FODMAP elimination-and-reintroduction approach (most known from Monash University's research) is commonly used to identify individual triggers. It's meant to be short-term and systematic rather than an indefinite restriction, and is best done with guidance from a dietitian or other healthcare professional rather than as a self-directed long-term diet." }
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
    title: "Pollen-Food Cross-Reactivity (OAS)",
    sections: [
      {
        heading: "What is OAS?",
        blocks: [
          { type: "p", text: "Oral allergy syndrome occurs when foods contain proteins structurally similar to pollen allergens, causing mild tingling or itching in the mouth in people already allergic to that pollen. Most of these proteins are heat-labile, so symptoms often resolve once the food is cooked — but some (like certain lipid transfer proteins) are heat-stable and can still trigger reactions, occasionally more severe ones, even when cooked." }
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

  fructose: {
    title: "Fructose (Excess)",
    sections: [
      {
        heading: null,
        blocks: [
          { type: "p", text: "Excess free fructose relative to glucose overwhelms small-intestine absorption, drawing water into the bowel. Found in honey, apples, mangoes, and high-fructose corn syrup." }
        ]
      },
      {
        heading: null,
        blocks: [
          { type: "note", text: "This is a FODMAP subtype. It's mainly a problem for people with IBS, though it can also cause discomfort in other GI disorders, or in anyone if consumption is high enough." },
          { type: "note", text: "This is distinct from hereditary fructose intolerance (HFI), a rare genetic condition (roughly 1 in 20,000-30,000) causing an inability to break down fructose at all. It's present from birth, but because affected people often develop a strong natural aversion to sweet foods, it can go undiagnosed until adulthood." },
          { type: "note", text: "Pairing high-fructose foods with a source of glucose (e.g. fruit with a starchy side) can improve absorption, since glucose helps transport fructose across the gut wall." }
        ]
      }
    ]
  },

  polyols: {
    title: "Polyols (Sugar Alcohols)",
    sections: [
      {
        heading: null,
        blocks: [
          { type: "p", text: "Sorbitol and mannitol are poorly absorbed, pulling water into the bowel osmotically and getting fermented by colon bacteria, producing gas. Common in stone fruits, mushrooms, and sugar-free sweeteners (chewing gum, \"diet\" products)." },
          { type: "p", text: "This osmotic effect is dose-dependent and well known enough that many sugar-free products carry a laxative-effect warning label — worth checking if bloating or diarrhea follows sugar-free snacks or gum." }
        ]
      },
      {
        heading: null,
        blocks: [
          { type: "note", text: "This is a FODMAP subtype. It's mainly a problem for people with IBS, though it can also cause discomfort in other GI disorders, or in anyone if consumption is high enough." }
        ]
      }
    ]
  },

  fructans: {
    title: "Fructans",
    sections: [
      {
        heading: null,
        blocks: [
          { type: "p", text: "Chains of fructose molecules humans can't digest; fermented by colon bacteria. Found in wheat, onion, and garlic — among the most common FODMAP triggers." },
          { type: "p", text: "Fructans aren't oil-soluble, which is why garlic-infused oil is a common low-FODMAP substitute for cooking with garlic — it carries the flavor without the fructans." }
        ]
      },
      {
        heading: null,
        blocks: [
          { type: "note", text: "This is a FODMAP subtype. It's mainly a problem for people with IBS, though it can also cause discomfort in other GI disorders, or in anyone if consumption is high enough." }
        ]
      }
    ]
  },

  galactans: {
    title: "Galacto-oligosaccharides (GOS)",
    sections: [
      {
        heading: null,
        blocks: [
          { type: "p", text: "Short galactose chains the small intestine can't break down, fermented in the colon. Main sources: legumes and some nuts." },
          { type: "p", text: "Symptoms are typical FODMAP fermentation symptoms — gas and bloating, dose-dependent. Soaking or sprouting legumes before cooking reduces their GOS content and is a common practical tip for better tolerance." }
        ]
      },
      {
        heading: null,
        blocks: [
          { type: "note", text: "This is a FODMAP subtype. It's mainly a problem for people with IBS, though it can also cause discomfort in other GI disorders, or in anyone if consumption is high enough." }
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
  }

};
