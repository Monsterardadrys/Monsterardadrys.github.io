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
    title: "Fats",
    sections: [
      {
        heading: null,
        blocks: [
          { type: "p", text: "More info to come..." }
        ]
      }
    ]
  },

  protein: {
    title: "Protein",
    sections: [
      {
        heading: null,
        blocks: [
          { type: "p", text: "More info to come..." }
        ]
      }
    ]
  },

  carbs: {
    title: "Carbohydrates",
    sections: [
      {
        heading: null,
        blocks: [
          { type: "p", text: "More info to come..." }
        ]
      }
    ]
  }

};
