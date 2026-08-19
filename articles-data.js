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

/* GENERATED for the free build — 7 articles whole, 14 by title only.
   Edit articles-data.js in the private repository and rebuild. */

const ARTICLES = {

  macros: {
    title: "Overview of Macronutrients",
    sv: "Översikt över makronäringsämnen",
    sections: [
      {
        heading: null,
        blocks: [
          {
            type: "p",
            text: "Macronutrients — carbohydrates, protein, fat, and fiber — are the " +
              "nutrients the body needs in large amounts for energy and tissue " +
              "maintenance. Alcohol is sometimes grouped alongside them, since it " +
              "provides calories but no nutrients.",
            sv: "Makronäringsämnen — kolhydrater, protein, fett och fiber — är de " +
              "näringsämnen kroppen behöver i stora mängder för energi och " +
              "vävnadsunderhåll. Alkohol grupperas ibland tillsammans med dem, eftersom " +
              "den ger kalorier men inga näringsämnen."
          }
        ]
      },
      {
        heading: "The main groups",
        sv: "Huvudgrupperna",
        blocks: [
          {
            type: "list",
            items: [
              "**Carbohydrates:** the body's main energy source; includes sugars, " +
                "starches, and fiber",
              "**Protein:** builds and repairs tissue; a moderate stimulant of bile release",
              "**Fat:** the most energy-dense macronutrient; needs bile to digest",
              "**Fiber:** the indigestible part of plant foods; feeds the gut microbiome",
              "**Alcohol:** not a nutrient, but a common dietary component worth " +
                "tracking separately",
            ],
            sv: [
              "**Kolhydrater:** kroppens huvudsakliga energikälla; omfattar " +
                "sockerarter, stärkelse och fiber",
              "**Protein:** bygger och reparerar vävnad; en måttlig stimulerare av " +
                "gallutsöndring",
              "**Fett:** det mest energitäta makronäringsämnet; behöver galla för att " +
                "smältas",
              "**Fiber:** den osmältbara delen av växtbaserade livsmedel; föder tarmfloran",
              "**Alkohol:** inget näringsämne, men en vanlig kostbeståndsdel värd att " +
                "följa separat",
            ]
          }
        ]
      },
      {
        heading: "Why they matter for GI symptoms",
        sv: "Varför de spelar roll för magsymtom",
        blocks: [
          {
            type: "p",
            text: "Each macronutrient can trigger digestive symptoms through a different " +
              "mechanism, and in different people. This overview only summarizes what " +
              "they are — each has its own dedicated article on this site covering how " +
              "and why it can cause GI symptoms.",
            sv: "Varje makronäringsämne kan utlösa matsmältningssymtom genom olika " +
              "mekanismer, och hos olika personer. Den här översikten sammanfattar bara " +
              "vad de är — vart och ett har en egen artikel på sidan som täcker hur och " +
              "varför det kan ge magsymtom."
          }
        ]
      },
      {
        heading: null,
        blocks: [
          {
            type: "note",
            text: "See the individual carbohydrate, protein, fat, and fiber articles for " +
              "symptom-specific detail.",
            sv: "Se de enskilda artiklarna om kolhydrater, protein, fett och fiber för " +
              "symtomspecifika detaljer."
          }
        ]
      }
    ]
  },

  fat: {
    title: "Fat",
    sv: "Fett",
    sections: [
      {
        heading: "Why fat can trigger symptoms",
        sv: "Varför fett kan utlösa symtom",
        blocks: [
          {
            type: "p",
            text: "Fat doesn't mix with water, so it needs bile as an emulsifier to break it " +
              "into digestible droplets. Without enough bile, fat passes through poorly " +
              "digested.",
            sv: "Fett blandar sig inte med vatten, så det behöver galla som " +
              "emulgeringsmedel för att brytas ned till smältbara droppar. Utan " +
              "tillräckligt med galla passerar fettet dåligt smält."
          },
          {
            type: "p",
            text: "Fat is the slowest macronutrient to digest. A high-fat meal stays in the " +
              "stomach and small intestine longer, and it strongly stimulates the " +
              "gallbladder and pancreas to release bile and digestive enzymes.",
            sv: "Fett är det makronäringsämne som smälts långsammast. En fettrik måltid " +
              "stannar längre i magsäck och tunntarm, och den stimulerar gallblåsa och " +
              "bukspottkörtel kraftigt att frisätta galla och matsmältningsenzymer."
          },
          {
            type: "p",
            text: "For most people this is no problem. For people with GERD, IBS, gallbladder " +
              "disease, or pancreatic insufficiency (EPI), it can trigger reflux, " +
              "cramping, or diarrhea.",
            sv: "För de flesta är det inget problem. För personer med GERD, IBS, " +
              "gallsjukdom eller exokrin pankreasinsufficiens (EPI) kan det utlösa " +
              "reflux, kramper eller diarré."
          }
        ]
      },
      {
        heading: "Who is more sensitive?",
        sv: "Vilka är känsligare?",
        blocks: [
          {
            type: "list",
            items: [
              "**GERD, IBS, IBD:** fat most often worsens symptoms already caused by " +
                "these conditions rather than causing them directly.",
              "**Gallstones / biliary colic:** fat triggers gallbladder contraction, " +
                "which can cause pain in a diseased gallbladder — a case of fat causing " +
                "symptoms directly.",
              "**EPI / pancreatitis:** without enough pancreatic enzymes, fat isn't " +
                "broken down properly, causing oily stools and urgent diarrhea — also a " +
                "direct cause.",
            ],
            sv: [
              "**GERD, IBS, IBD:** fett förvärrar oftast symtom som redan orsakas av " +
                "dessa tillstånd snarare än att orsaka dem direkt.",
              "**Gallsten / gallstensanfall:** fett utlöser gallblåsesammandragning, " +
                "vilket kan ge smärta i en sjuk gallblåsa — ett fall där fett orsakar " +
                "symtom direkt.",
              "**EPI / pankreatit:** utan tillräckligt med bukspottkörtelenzymer bryts " +
                "fettet inte ned ordentligt, vilket ger fettglänsande avföring och akut " +
                "diarré — också en direkt orsak.",
            ]
          }
        ]
      },
      {
        heading: "Warning signs of fat malabsorption",
        sv: "Varningstecken på fettmalabsorption",
        blocks: [
          {
            type: "p",
            text: "Acute diarrhea within 1-2 hours of a fatty meal, pale or yellow stool, and " +
              "oily residue in the toilet can indicate a malabsorption disorder and " +
              "deserve medical follow-up rather than self-managed avoidance.",
            sv: "Akut diarré inom 1–2 timmar efter en fet måltid, blek eller gul avföring, " +
              "och oljerester i toaletten kan tyda på en malabsorptionsstörning och " +
              "förtjänar medicinsk uppföljning snarare än självstyrt undvikande."
          }
        ]
      },
      {
        heading: null,
        blocks: [
          {
            type: "note",
            text: "Loss of appetite from unrelated medical conditions (e.g. heart failure) " +
              "can shift food preference toward carbs and away from fat- and protein-rich " +
              "foods — worth distinguishing from a true food intolerance.",
            sv: "Aptitlöshet av orelaterade medicinska tillstånd (t.ex. hjärtsvikt) kan " +
              "förskjuta matpreferensen mot kolhydrater och bort från fett- och " +
              "proteinrika livsmedel — värt att skilja från en verklig matintolerans."
          },
          {
            type: "note",
            text: "Dumping syndrome — rapid gastric emptying causing cramping, diarrhea, and " +
              "sometimes low blood sugar — is common after GI surgery (bariatric, " +
              "oncologic, or IBD-related resections), typically triggered by fat-rich or " +
              "carb-rich meals.",
            sv: "Dumpingsyndrom — snabb magsäckstömning som ger kramper, diarré och ibland " +
              "lågt blodsocker — är vanligt efter magtarmkirurgi (obesitas-, cancer- " +
              "eller IBD-relaterade resektioner), och utlöses typiskt av fettrika eller " +
              "kolhydratrika måltider."
          }
        ]
      }
    ]
  },

  protein: {
    title: "Protein",
    sv: "Protein",
    sections: [
      {
        heading: "Why protein can trigger symptoms",
        sv: "Varför protein kan utlösa symtom",
        blocks: [
          {
            type: "p",
            text: "Protein itself is well tolerated by most people, but it's a moderate " +
              "stimulant of bile release (weaker than fat) and a large protein load can " +
              "slow digestion.",
            sv: "Protein i sig tolereras väl av de flesta, men det är en måttlig " +
              "stimulerare av gallutsöndring (svagare än fett) och en stor proteinmängd " +
              "kan bromsa matsmältningen."
          },
          {
            type: "p",
            text: "Symptoms usually come from something protein-rich foods carry alongside " +
              "the protein: dairy protein is often paired with lactose, some proteins " +
              "overlap with declarable allergens, and fermented or aged proteins (cured " +
              "meat, aged cheese) can be high in histamine.",
            sv: "Symtom kommer oftast från något proteinrika livsmedel bär vid sidan av " +
              "proteinet: mjölkprotein följs ofta av laktos, vissa proteiner sammanfaller " +
              "med deklarationspliktiga allergener, och fermenterade eller lagrade " +
              "proteiner (charkuterier, lagrad ost) kan vara histaminrika."
          }
        ]
      },
      {
        heading: "Who is more sensitive?",
        sv: "Vilka är känsligare?",
        blocks: [
          {
            type: "list",
            items: [
              "**Gallbladder disease:** protein adds to the bile-release load alongside " +
                "fat.",
              "**Pancreatitis / pancreatic tumors:** among the most specific causes of " +
                "true protein malabsorption.",
              "**True food allergy:** milk, egg, fish, shellfish, peanut, tree nut, " +
                "soy, and sesame proteins can trigger immune reactions unrelated to " +
                "digestion.",
              "**Histamine intolerance:** aged, cured, or fermented protein sources " +
                "tend to be high in histamine.",
            ],
            sv: [
              "**Gallsjukdom:** protein lägger till gallutsöndringsbelastningen vid " +
                "sidan av fett.",
              "**Pankreatit / bukspottkörteltumörer:** bland de mest specifika " +
                "orsakerna till verklig proteinmalabsorption.",
              "**Verklig matallergi:** protein från mjölk, ägg, fisk, skaldjur, " +
                "jordnöt, nöt, soja och sesam kan utlösa immunreaktioner som inte har med " +
                "matsmältningen att göra.",
              "**Histaminintolerans:** lagrade, rimmade eller fermenterade " +
                "proteinkällor tenderar att vara histaminrika.",
            ]
          }
        ]
      },
      {
        heading: "A note on quantity",
        sv: "En anmärkning om mängd",
        blocks: [
          {
            type: "p",
            text: "Very high single-meal protein intakes (common in high-protein diets) can " +
              "occasionally cause bloating or discomfort simply from the digestive " +
              "workload, independent of any allergy or intolerance.",
            sv: "Mycket höga proteinintag i en enskild måltid (vanligt i proteinrika " +
              "dieter) kan ibland ge uppblåsthet eller obehag enbart av " +
              "matsmältningsarbetet, oberoende av allergi eller intolerans."
          }
        ]
      },
      {
        heading: null,
        blocks: [
          {
            type: "note",
            text: "Some amino acid metabolism disorders are congenital and almost never first " +
              "appear in adulthood.",
            sv: "Vissa störningar i aminosyraomsättningen är medfödda och visar sig nästan " +
              "aldrig först i vuxen ålder."
          },
          {
            type: "note",
            text: "Loss of appetite from unrelated medical conditions (e.g. heart failure) " +
              "can shift food preference toward carbs and away from fat- and protein-rich " +
              "foods — worth distinguishing from a true food intolerance.",
            sv: "Aptitlöshet av orelaterade medicinska tillstånd (t.ex. hjärtsvikt) kan " +
              "förskjuta matpreferensen mot kolhydrater och bort från fett- och " +
              "proteinrika livsmedel — värt att skilja från en verklig matintolerans."
          }
        ]
      }
    ]
  },

  carbs: {
    title: "Carbohydrates",
    sv: "Kolhydrater",
    sections: [
      {
        heading: "Why carbohydrates can trigger symptoms",
        sv: "Varför kolhydrater kan utlösa symtom",
        blocks: [
          {
            type: "p",
            text: "Most digestive symptoms blamed on \"carbs\" actually come from specific " +
              "subtypes: FODMAPs (see the FODMAPs article), lactose, or excess fructose, " +
              "rather than starch or sugar in general.",
            sv: "De flesta matsmältningssymtom som skylls på \"kolhydrater\" kommer i själva " +
              "verket från specifika undertyper: FODMAP (se FODMAP-artikeln), laktos, " +
              "eller överskott av fruktos, snarare än från stärkelse eller socker i " +
              "allmänhet."
          },
          {
            type: "p",
            text: "Refined carbohydrates can also raise blood sugar quickly, which is a " +
              "separate concern from GI symptoms but often gets grouped in with them.",
            sv: "Raffinerade kolhydrater kan också höja blodsockret snabbt, vilket är en " +
              "annan fråga än magsymtom men ofta klumpas ihop med dem."
          }
        ]
      },
      {
        heading: "Who is more sensitive?",
        sv: "Vilka är känsligare?",
        blocks: [
          {
            type: "list",
            items: [
              "**IBS / SIBO:** fermentable carbohydrate subtypes (FODMAPs) are the main " +
                "driver of bloating and gas.",
              "**Lactose intolerance:** lactose specifically, not carbohydrates broadly.",
              "**Diabetes / insulin resistance:** carbohydrate load affects blood sugar " +
                "regardless of GI tolerance.",
            ],
            sv: [
              "**IBS / SIBO:** fermenterbara kolhydratundertyper (FODMAP) är den " +
                "främsta drivkraften bakom uppblåsthet och gaser.",
              "**Laktosintolerans:** specifikt laktos, inte kolhydrater i stort.",
              "**Diabetes / insulinresistens:** kolhydratmängden påverkar blodsockret " +
                "oavsett magtolerans.",
            ]
          }
        ]
      },
      {
        heading: "Practical takeaway",
        sv: "Praktisk slutsats",
        blocks: [
          {
            type: "p",
            text: "If carbohydrate-containing foods are a suspected trigger, checking which " +
              "specific subtype (FODMAPs, lactose, fructose) they share is usually more " +
              "useful than avoiding carbohydrates as a whole.",
            sv: "Om kolhydratinnehållande livsmedel misstänks som utlösare är det oftast " +
              "mer användbart att kontrollera vilken specifik undertyp (FODMAP, laktos, " +
              "fruktos) de delar än att undvika kolhydrater som helhet."
          }
        ]
      },
      {
        heading: null,
        blocks: [
          {
            type: "note",
            text: "Dumping syndrome — rapid gastric emptying causing cramping, diarrhea, and " +
              "sometimes low blood sugar — is common after GI surgery (bariatric, " +
              "oncologic, or IBD-related resections), typically triggered by carb-rich or " +
              "fat-rich meals.",
            sv: "Dumpingsyndrom — snabb magsäckstömning som ger kramper, diarré och ibland " +
              "lågt blodsocker — är vanligt efter magtarmkirurgi (obesitas-, cancer- " +
              "eller IBD-relaterade resektioner), och utlöses typiskt av kolhydratrika " +
              "eller fettrika måltider."
          }
        ]
      }
    ]
  },

  fiber: {
    title: "Fiber",
    sv: "Fiber",
    sections: [
      {
        heading: "What is fiber?",
        sv: "Vad är fiber?",
        blocks: [
          {
            type: "p",
            text: "Fiber is the part of plant foods the body can't fully digest. It passes " +
              "through the digestive system largely intact, which is exactly what makes " +
              "it so useful — and, for some people, occasionally uncomfortable.",
            sv: "Fiber är den del av växtbaserade livsmedel som kroppen inte kan smälta " +
              "fullt ut. Den passerar matsmältningskanalen till stor del intakt, vilket " +
              "är precis det som gör den så användbar — och, för vissa, ibland obehaglig."
          }
        ]
      },
      {
        heading: "Health benefits",
        sv: "Hälsofördelar",
        blocks: [
          {
            type: "p",
            text: "Fiber supports gut health and the gut microbiome, heart health, blood " +
              "sugar regulation, weight control, and helps move waste (and the toxins " +
              "bound to it) through the digestive tract.",
            sv: "Fiber stöder tarmhälsa och tarmflora, hjärthälsa, blodsockerreglering och " +
              "viktkontroll, och hjälper till att föra avfall (och de toxiner som binds " +
              "till det) genom matsmältningskanalen."
          }
        ]
      },
      {
        heading: "Food sources",
        sv: "Livsmedelskällor",
        blocks: [
          {
            type: "p",
            text: "Fiber is present in plant foods: vegetables, fruits, whole grains, " +
              "legumes, nuts, and seeds. Processed foods usually contain less fiber than " +
              "their whole-food counterparts, though some are fortified with added fiber. " +
              "Foods particularly high in fiber include flax seeds, chia seeds, wheat and " +
              "oat bran, whole grain pasta, bread and rice, and beans and peas.",
            sv: "Fiber finns i växtbaserade livsmedel: grönsaker, frukt, fullkorn, " +
              "baljväxter, nötter och frön. Processade livsmedel innehåller vanligtvis " +
              "mindre fiber än sina motsvarigheter av hela råvaror, även om vissa är " +
              "berikade med tillsatt fiber. Livsmedel som är särskilt fiberrika är " +
              "linfrön, chiafrön, vete- och havrekli, fullkornspasta, -bröd och -ris, " +
              "samt bönor och ärtor."
          }
        ]
      },
      {
        heading: "What problems can fiber cause?",
        sv: "Vilka problem kan fiber orsaka?",
        blocks: [
          {
            type: "p",
            text: "Overconsumption from supplements carries real risks for anyone: in rare " +
              "cases, ileus (a bowel blockage), constipation (especially combined with " +
              "low water intake), gas, and bloating. Overconsumption from whole foods is " +
              "gentler, but can still reduce appetite and lead to unintended weight loss " +
              "if taken to an extreme.",
            sv: "Överkonsumtion från kosttillskott innebär verkliga risker för vem som " +
              "helst: i sällsynta fall ileus (tarmvred), förstoppning (särskilt i " +
              "kombination med lågt vattenintag), gaser och uppblåsthet. Överkonsumtion " +
              "från hela livsmedel är mildare, men kan ändå minska aptiten och leda till " +
              "oavsiktlig viktnedgång om det drivs till sin spets."
          }
        ]
      },
      {
        heading: "Who is more sensitive?",
        sv: "Vilka är känsligare?",
        blocks: [
          {
            type: "p",
            text: "Fiber can cause more pronounced symptoms in people with certain " +
              "sensitivities — IBS, reflux, slowed gastric emptying, short bowel " +
              "syndrome, or small intestinal bacterial overgrowth (SIBO), among others.",
            sv: "Fiber kan ge mer uttalade symtom hos personer med vissa känsligheter — " +
              "IBS, reflux, långsam magsäckstömning, korta tarmens syndrom, eller " +
              "bakteriell överväxt i tunntarmen (SIBO), bland andra."
          }
        ]
      },
      {
        heading: null,
        blocks: [
          {
            type: "note",
            text: "Don't stick to a low-fiber, low-variety diet for more than a couple of " +
              "weeks unless it's clearly necessary.",
            sv: "Håll dig inte till en fiberfattig kost med låg variation i mer än ett par " +
              "veckor om det inte är tydligt nödvändigt."
          }
        ]
      }
    ]
  },

  fodmaps: {
    title: "FODMAPs",
    sv: "FODMAP",
    sections: [
      {
        heading: "What are FODMAPs?",
        sv: "Vad är FODMAP?",
        blocks: [
          {
            type: "p",
            text: "FODMAP stands for Fermentable Oligosaccharides, Disaccharides, " +
              "Monosaccharides, and Polyols. These are short-chain carbohydrates that " +
              "aren't fully absorbed in the small intestine. Instead, they travel on to " +
              "the colon, where gut bacteria ferment them.",
            sv: "FODMAP står för fermenterbara oligosackarider, disackarider, " +
              "monosackarider och polyoler. Det är kortkedjiga kolhydrater som inte tas " +
              "upp fullt ut i tunntarmen. I stället fortsätter de till tjocktarmen, där " +
              "tarmbakterier fermenterar dem."
          },
          {
            type: "list",
            items: [
              "**Oligosaccharides**: fructans and galacto-oligosaccharides, found in " +
                "wheat, onion, garlic, and many legumes",
              "**Disaccharides**: mainly lactose, found in dairy",
              "**Monosaccharides**: excess fructose, found in some fruits and honey",
              "**Polyols**: sugar alcohols like sorbitol and mannitol, found in some " +
                "fruits and sugar-free sweeteners",
            ],
            sv: [
              "**Oligosackarider**: fruktaner och galakto-oligosackarider, som finns i " +
                "vete, lök, vitlök och många baljväxter",
              "**Disackarider**: främst laktos, som finns i mejeriprodukter",
              "**Monosackarider**: överskott av fruktos, som finns i viss frukt och i " +
                "honung",
              "**Polyoler**: sockeralkoholer som sorbitol och mannitol, som finns i " +
                "viss frukt och i sockerfria sötningsmedel",
            ]
          }
        ]
      },
      {
        heading: "Why they cause symptoms",
        sv: "Varför de ger symtom",
        blocks: [
          {
            type: "p",
            text: "Because they aren't well absorbed, FODMAPs draw extra water into the bowel " +
              "and are fermented by gut bacteria, producing gas. For most people this " +
              "fermentation effect is mild and tends to improve over time as the gut " +
              "microbiome adapts, even without reducing intake.",
            sv: "Eftersom de inte tas upp väl drar FODMAP in extra vatten i tarmen och " +
              "fermenteras av tarmbakterier, vilket bildar gas. För de flesta är den " +
              "fermentationseffekten mild och tenderar att förbättras över tid när " +
              "tarmfloran anpassar sig, även utan minskat intag."
          }
        ]
      },
      {
        heading: "Who is more sensitive?",
        sv: "Vilka är känsligare?",
        blocks: [
          {
            type: "p",
            text: "For sensitive individuals — such as people with Irritable Bowel Syndrome " +
              "(IBS) — moderate symptoms can occur even at a relatively low intake, and " +
              "the microbiome adapts more slowly. At a high daily intake, symptoms can " +
              "become severe, causing acute diarrhea and pain.",
            sv: "För känsliga personer — som personer med irritabel tarm (IBS) — kan " +
              "måttliga symtom uppstå redan vid ett relativt lågt intag, och tarmfloran " +
              "anpassar sig långsammare. Vid ett högt dagligt intag kan symtomen bli " +
              "svåra, med akut diarré och smärta."
          }
        ]
      },
      {
        heading: "Common high-FODMAP foods",
        sv: "Vanliga FODMAP-rika livsmedel",
        blocks: [
          {
            type: "p",
            text: "On this site's food checklist, foods flagged with the FODMAPs trait " +
              "include onions, garlic, wheat, rye, barley, many legumes (chickpeas, " +
              "lentils, black beans), apples, and several nuts (almonds, cashews, " +
              "hazelnuts, peanuts).",
            sv: "På den här sidans livsmedelslista omfattar livsmedel märkta med " +
              "FODMAP-egenskapen lök, vitlök, vete, råg, korn, många baljväxter " +
              "(kikärtor, linser, svarta bönor), äpplen och flera nötter (mandel, cashew, " +
              "hasselnöt, jordnöt)."
          }
        ]
      },
      {
        heading: "The low-FODMAP approach",
        sv: "Låg-FODMAP-metoden",
        blocks: [
          {
            type: "p",
            text: "A structured elimination-and-reintroduction approach (most known from " +
              "Monash University's research) is commonly used to identify individual " +
              "triggers. It's meant to be short-term and systematic rather than an " +
              "indefinite restriction.",
            sv: "En strukturerad elimination-och-återintroduktion (mest känd från Monash " +
              "Universitys forskning) används ofta för att identifiera individuella " +
              "utlösare. Den är avsedd att vara kortvarig och systematisk snarare än en " +
              "obestämd restriktion."
          }
        ]
      },
      {
        heading: null,
        blocks: [
          {
            type: "note",
            text: "Best done with guidance from a dietitian or other healthcare professional, " +
              "rather than as a self-directed long-term diet.",
            sv: "Görs bäst med vägledning av en dietist eller annan vårdpersonal, snarare " +
              "än som en självstyrd långtidsdiet."
          }
        ]
      }
    ]
  },

  fructose: {
    title: "Fructose",
    sv: "Fruktos",
    locked: true
  },

  polyols: {
    title: "Polyols",
    sv: "Polyoler",
    locked: true
  },

  fructans: {
    title: "Fructans",
    sv: "Fruktaner",
    locked: true
  },

  galactans: {
    title: "Galacto-oligosaccharides",
    sv: "Galakto-oligosackarider",
    locked: true
  },

  lactose: {
    title: "Lactose",
    sv: "Laktos",
    locked: true
  },

  irritant: {
    title: "GI Irritants",
    sv: "GI-irriterande",
    locked: true
  },

  histamine: {
    title: "Histamine",
    sv: "Histamin",
    locked: true
  },

  dao_competitor: {
    title: "DAO Competitors",
    sv: "DAO-hämmare",
    locked: true
  },

  salicylate: {
    title: "Salicylates",
    sv: "Salicylater",
    locked: true
  },

  bile_stimulant: {
    title: "Bile Stimulants",
    sv: "Gallstimulerande",
    locked: true
  },

  refined_carbs: {
    title: "Refined Carbohydrates",
    sv: "Raffinerade kolhydrater",
    locked: true
  },

  allergen: {
    title: "Allergens",
    sv: "Allergener",
    locked: true
  },

  cross_reactive: {
    title: "Pollen-Food Cross-Reactivity",
    sv: "Pollen-matkorsreaktivitet",
    locked: true
  },

  alpha_gal: {
    title: "Alpha-Gal Syndrome",
    sv: "Alfa-gal-syndrom",
    locked: true
  },

  uncertainty: {
    title: "How Certain Is Any of This?",
    sv: "Hur säkert är egentligen något av det här?",
    sections: [
      {
        heading: null,
        blocks: [
          {
            type: "p",
            text: "Every trait in this tool rests on published measurements of what foods " +
              "contain. Compare two such sources and you quickly find they rarely agree — " +
              "sometimes about orders of magnitude, sometimes about which foods count as " +
              "high at all.",
            sv: "Varje egenskap i det här verktyget vilar på publicerade mätningar av vad " +
              "livsmedel innehåller. Jämför två sådana källor och du upptäcker snabbt att " +
              "de sällan är överens — ibland om storleksordningar, ibland om vilka " +
              "livsmedel som över huvud taget räknas som höga."
          },
          {
            type: "p",
            text: "That is not sloppiness. It follows from measuring biological material that " +
              "varies with variety, growing conditions, season, storage and preparation, " +
              "using methods that do not quite measure the same thing.",
            sv: "Det är inte slarv. Det följer av att mäta biologiskt material som varierar " +
              "med sort, odlingsförhållanden, säsong, lagring och beredning, med metoder " +
              "som inte riktigt mäter samma sak."
          },
          {
            type: "p",
            text: "This article describes where the uncertainty sits, how it has been handled " +
              "here, and what it means for reading the results.",
            sv: "Den här artikeln beskriver var osäkerheten sitter, hur den hanterats här, " +
              "och vad den betyder för hur resultatet ska läsas."
          }
        ]
      },
      {
        heading: "Four sources of disagreement",
        sv: "Fyra källor till oenighet",
        blocks: [
          {
            type: "list",
            items: [
              "**The analytical method.** Older studies used HPLC with UV detection, " +
                "which is sensitive to interference from related phenolic compounds and " +
                "tends to overestimate. Newer work uses mass spectrometry with an " +
                "internal standard. The difference is not marginal: blueberries have been " +
                "reported at 27.6 mg salicylic acid per kilo in one study and 0.57 in " +
                "another.",
              "**Biological variation.** Two apples of different varieties can differ " +
                "threefold. Organically grown vegetables have measured higher in " +
                "salicylic acid than conventionally grown ones. Cumin from two suppliers " +
                "differed by 649 mg per kilo within a single study.",
              "**What is being measured.** Salicylic acid occurs free and bound to " +
                "sugars or esters. Measure only the free fraction and you get values an " +
                "order of magnitude lower — cherry tomato contains 7 mg per kilo total " +
                "but only 0.3 mg free. The same applies to histamine, where freshness and " +
                "degree of proteolysis decide how much free histidine is available for " +
                "bacteria to convert.",
              "**Preparation.** Peeling, boiling, fermenting and concentrating all " +
                "change the content, sometimes in opposite directions for different " +
                "substances.",
            ],
            sv: [
              "**Analysmetoden.** Äldre studier använde HPLC med UV-detektion, som är " +
                "känslig för störning från besläktade fenolföreningar och tenderar att " +
                "överskatta. Nyare arbeten använder masspektrometri med intern standard. " +
                "Skillnaden är inte marginell: blåbär har rapporterats till 27,6 mg " +
                "salicylsyra per kilo i en studie och 0,57 i en annan.",
              "**Biologisk variation.** Två äpplen av olika sorter kan skilja sig " +
                "trefaldigt. Ekologiskt odlade grönsaker har mätt högre i salicylsyra än " +
                "konventionellt odlade. Spiskummin från två leverantörer skilde sig med " +
                "649 mg per kilo inom en och samma studie.",
              "**Vad som mäts.** Salicylsyra förekommer fritt och bundet till " +
                "sockerarter eller estrar. Mät bara den fria fraktionen och du får värden " +
                "en storleksordning lägre — körsbärstomat innehåller 7 mg per kilo totalt " +
                "men bara 0,3 mg fritt. Detsamma gäller histamin, där färskhet och grad " +
                "av proteolys avgör hur mycket fritt histidin som finns tillgängligt för " +
                "bakterier att omvandla.",
              "**Beredning.** Skalning, kokning, fermentering och koncentrering ändrar " +
                "alla innehållet, ibland i motsatta riktningar för olika ämnen.",
            ]
          }
        ]
      },
      {
        heading: "Case 1: fermentation is not a mechanism",
        sv: "Fall 1: fermentering är ingen mekanism",
        blocks: [
          {
            type: "p",
            text: "Almost every histamine list groups foods by whether they are fermented. It " +
              "is a useful rule of thumb that conceals three separate processes — " +
              "substrate, flora and time — which happen to coincide in cheese but not in " +
              "yogurt.",
            sv: "Nästan varje histaminlista grupperar livsmedel efter om de är " +
              "fermenterade. Det är en användbar tumregel som döljer tre skilda processer " +
              "— substrat, flora och tid — som råkar sammanfalla i ost men inte i " +
              "yoghurt."
          },
          {
            type: "p",
            text: "Cheese ripening is proteolysis as its main process, running for weeks to " +
              "years, with a secondary flora that includes several of the most prolific " +
              "histamine formers. Yogurt undergoes almost no proteolysis, uses defined " +
              "starters screened for amine-forming ability, and is chilled immediately.",
            sv: "Ostmognad har proteolys som sin huvudprocess, pågående i veckor till år, " +
              "med en sekundär flora som rymmer flera av de mest produktiva " +
              "histaminbildarna. Yoghurt genomgår nästan ingen proteolys, använder " +
              "definierade startkulturer screenade för aminbildande förmåga, och kyls " +
              "omedelbart."
          },
          {
            type: "note",
            text: "So this tool does not tag fermentation as such, but proteolytic ripening " +
              "and long fermentation with undefined flora. Yogurt, kefir, sour cream and " +
              "buttermilk carry no histamine tag. See the Histamine article for the " +
              "detail.",
            sv: "Så det här verktyget märker inte fermentering som sådan, utan proteolytisk " +
              "mognad och lång fermentering med odefinierad flora. Yoghurt, kefir, " +
              "gräddfil och kärnmjölk bär ingen histamintagg. Se Histamin-artikeln för " +
              "detaljerna."
          }
        ]
      },
      {
        heading: "Case 2: the mechanism that was never demonstrated",
        sv: "Fall 2: mekanismen som aldrig påvisades",
        blocks: [
          {
            type: "p",
            text: "A review of ten published low-histamine diets found that 68% of the " +
              "excluded foods had no detectable histamine. For many of them the release " +
              "hypothesis is the only explanation offered, and it does not rest on human " +
              "studies.",
            sv: "En genomgång av tio publicerade histaminfattiga dieter fann att 68 % av de " +
              "uteslutna livsmedlen inte hade mätbart histamin. För många av dem är " +
              "frisättningshypotesen den enda förklaring som erbjuds, och den vilar inte " +
              "på humanstudier."
          },
          {
            type: "note",
            text: "Foods whose only justification was that mechanism have been removed — " +
              "strawberry, pineapple, kiwi, papaya and avocado among them. Avocado is the " +
              "starkest: measurements show neither histamine nor putrescine, directly " +
              "contradicting the list that flagged it.",
            sv: "Livsmedel vars enda motivering var den mekanismen har tagits bort — " +
              "jordgubbe, ananas, kiwi, papaya och avokado bland dem. Avokado är det " +
              "tydligaste: mätningar visar varken histamin eller putrescin, vilket direkt " +
              "motsäger listan som flaggade den."
          },
          {
            type: "p",
            text: "This does not mean patients who react to strawberries are imagining it. It " +
              "means the explanation probably lies somewhere else — birch pollen " +
              "cross-reactivity, salicylates, or something this tool covers under a " +
              "different trait. Strawberry is a good example: it lost its histamine tag " +
              "and gained a salicylate one.",
            sv: "Det betyder inte att patienter som reagerar på jordgubbar inbillar sig. " +
              "Det betyder att förklaringen sannolikt ligger någon annanstans — " +
              "björkpollenkorsreaktivitet, salicylater, eller något verktyget täcker " +
              "under en annan egenskap. Jordgubbe är ett bra exempel: den förlorade sin " +
              "histamintagg och fick en salicylattagg."
          }
        ]
      },
      {
        heading: "Case 3: two modern studies, opposite answers",
        sv: "Fall 3: två moderna studier, motsatta svar",
        blocks: [
          {
            type: "p",
            text: "Salicylates show the problem at its sharpest. Two studies from the same " +
              "year, both with 112 foods, both methodologically careful, disagree about " +
              "which foods are high — not about scale, but about direction.",
            sv: "Salicylater visar problemet som skarpast. Två studier från samma år, båda " +
              "med 112 livsmedel, båda metodologiskt omsorgsfulla, är oense om vilka " +
              "livsmedel som är höga — inte om storleksordning, utan om riktning."
          },
          {
            type: "list",
            items: [
              "**Apple:** 9.7 mg/kg in the Australian study; no salicylates detected in " +
                "the European one",
              "**Pear:** 12.9 mg/kg versus none detected",
              "**Watermelon:** low in one, the highest of all fruits in the other",
              "**Rice and buckwheat:** undetectable in one, high in the other",
            ],
            sv: [
              "**Äpple:** 9,7 mg/kg i den australiska studien; inga salicylater " +
                "påvisade i den europeiska",
              "**Päron:** 12,9 mg/kg mot inget påvisat",
              "**Vattenmelon:** låg i den ena, högst av all frukt i den andra",
              "**Ris och bovete:** omätbart i den ena, högt i den andra",
            ]
          },
          {
            type: "p",
            text: "This tool uses the Australian data for a single reason: it has been tested " +
              "clinically. A blinded dietary intervention built on those values produced " +
              "a real contrast and a clear symptom response in the right patient. The " +
              "European study is an analytical survey without clinical validation.",
            sv: "Det här verktyget använder de australiska data av ett enda skäl: de har " +
              "prövats kliniskt. En blindad kostintervention byggd på de värdena gav en " +
              "verklig kontrast och ett tydligt symtomsvar hos rätt patient. Den " +
              "europeiska studien är en analytisk kartläggning utan klinisk validering."
          },
          {
            type: "note",
            text: "What has been validated is the ranking, not absolute values for Nordic " +
              "produce. That Polish apples and pears measured zero is relevant — Polish " +
              "varieties and growing conditions are closer to Swedish ones than " +
              "Australian conditions are. No Nordic data exists.",
            sv: "Det som validerats är rangordningen, inte absoluta värden för nordiska " +
              "råvaror. Att polska äpplen och päron mätte noll är relevant — polska " +
              "sorter och odlingsförhållanden ligger närmare svenska än australiska gör. " +
              "Nordiska data saknas helt."
          }
        ]
      },
      {
        heading: "Preparation replicates better than levels do",
        sv: "Beredning replikeras bättre än nivåer gör",
        blocks: [
          {
            type: "p",
            text: "One pattern stands out: sources that disagree about numbers often agree " +
              "about what preparation does.",
            sv: "Ett mönster sticker ut: källor som är oense om siffror är ofta överens om " +
              "vad beredningen gör."
          },
          {
            type: "list",
            items: [
              "**Peeling lowers salicylate** three to fourfold — shown in both studies, " +
                "for different foods",
              "**Boiling lowers it** — salicylic acid is volatile and sublimates on heating",
              "**Pickling and marinating raise it**",
              "**Concentrating raises it** — tomato purée measures above fresh tomato",
              "**Stewing substantially lowers putrescine in mushrooms**, which may " +
                "explain complaints reported after meals of demonstrably edible species",
              "**Cooking and peeling reduce birch pollen cross-reactivity**, since the " +
                "proteins involved are heat-labile",
            ],
            sv: [
              "**Skalning sänker salicylat** tre till fyra gånger — visat i båda " +
                "studierna, för olika livsmedel",
              "**Kokning sänker den** — salicylsyra är flyktig och sublimerar vid " +
                "upphettning",
              "**Inläggning och marinering höjer den**",
              "**Koncentrering höjer den** — tomatpuré mäter över färsk tomat",
              "**Stuvning sänker putrescin i svamp betydligt**, vilket kan förklara " +
                "besvär rapporterade efter måltider av bevisligen ätliga arter",
              "**Tillagning och skalning minskar björkpollenkorsreaktivitet**, eftersom " +
                "de inblandade proteinerna är värmelabila",
            ]
          },
          {
            type: "p",
            text: "For several traits, then, *how* a food was prepared predicts more than " +
              "*which* food it is. That is often also the more useful clinical angle, " +
              "since it opens the door to adjustment rather than exclusion.",
            sv: "För flera egenskaper förutsäger alltså *hur* ett livsmedel beretts mer än " +
              "*vilket* livsmedel det är. Det är ofta också den mer användbara kliniska " +
              "vinkeln, eftersom den öppnar för justering snarare än uteslutning."
          }
        ]
      },
      {
        heading: "What this means for reading the results",
        sv: "Vad det här betyder för hur resultatet ska läsas",
        blocks: [
          {
            type: "p",
            text: "The tool shows what the chosen foods have in common. It is a hypothesis " +
              "generator, not an answer.",
            sv: "Verktyget visar vad de valda livsmedlen har gemensamt. Det är en " +
              "hypotesgenerator, inte ett svar."
          },
          {
            type: "list",
            items: [
              "**A pattern is a starting point.** It is confirmed or rejected through " +
                "structured elimination and reintroduction with a symptom diary, not by " +
                "the list.",
              "**Traits are not equally well grounded.** Every trait carries one of " +
                "three evidence levels, shown with the result. *Well established* means " +
                "human trials or a directly measured mechanism — allergens, lactose, " +
                "FODMAPs. *Limited* means real but thin, mixed, or one step removed from " +
                "the symptom — bile stimulation, refined carbohydrates. *Preliminary* " +
                "means test-tube work, animal models or clinical experience only — acetic " +
                "acid, DAO competition. The level describes the trait, not how strongly " +
                "any one person reacts to it.",
              "**Absence of a tag is not a clean bill of health.** That strawberry " +
                "carries no histamine tag means the histamine explanation is weak — not " +
                "that the patient tolerates strawberries.",
              "**Several traits can point at the same food.** Apple, carrot and " +
                "hazelnut appear both as salicylate sources and as birch cross-reactive. " +
                "The same food recurring under two traits is not two independent " +
                "findings.",
              "**Portion size changes the ranking.** Cumin is high in salicylate per " +
                "kilo but low per portion. Traits built on portion data say so.",
            ],
            sv: [
              "**Ett mönster är en utgångspunkt.** Det bekräftas eller förkastas genom " +
                "strukturerad elimination och återintroduktion med symtomdagbok, inte av " +
                "listan.",
              "**Egenskaper är inte lika väl underbyggda.** Varje egenskap bär en av " +
                "tre evidensnivåer, visad med resultatet. *Väl belagt* betyder " +
                "humanstudier eller en direkt uppmätt mekanism — allergener, laktos, " +
                "FODMAP. *Begränsat* betyder verklig men tunn, blandad, eller ett steg " +
                "från symtomet — gallstimulering, raffinerade kolhydrater. *Preliminärt* " +
                "betyder enbart provrörsstudier, djurmodeller eller klinisk erfarenhet — " +
                "ättiksyra, DAO-hämning. Nivån beskriver egenskapen, inte hur starkt " +
                "någon enskild person reagerar på den.",
              "**Frånvaro av en tagg är ingen friskförklaring.** Att jordgubbe inte bär " +
                "någon histamintagg betyder att histaminförklaringen är svag — inte att " +
                "patienten tål jordgubbar.",
              "**Flera egenskaper kan peka på samma livsmedel.** Äpple, morot och " +
                "hasselnöt förekommer både som salicylatkällor och som björkkorsreaktiva. " +
                "Att samma livsmedel återkommer under två egenskaper är inte två " +
                "oberoende fynd.",
              "**Portionsstorlek ändrar rangordningen.** Spiskummin är hög i salicylat " +
                "per kilo men låg per portion. Egenskaper byggda på portionsdata säger " +
                "det.",
            ]
          }
        ]
      },
      {
        heading: "The principles behind the selection",
        sv: "Principerna bakom urvalet",
        blocks: [
          {
            type: "list",
            items: [
              "Measured data takes precedence over lists built on experience",
              "Mechanism takes precedence over association",
              "Foods without measured data are not tagged, however plausible they seem",
              "Where sources contradict each other, the clinically tested one is used " +
                "and the disagreement is stated",
              "The evidence level is given for each trait",
            ],
            sv: [
              "Uppmätta data går före listor byggda på erfarenhet",
              "Mekanism går före association",
              "Livsmedel utan uppmätta data märks inte, hur rimliga de än verkar",
              "Där källor motsäger varandra används den kliniskt prövade och oenigheten " +
                "sägs ut",
              "Evidensnivån anges för varje egenskap",
            ]
          },
          {
            type: "p",
            text: "The result is shorter lists than most published ones. That is deliberate. " +
              "A short list that points in the right direction is more useful than a long " +
              "one that points everywhere.",
            sv: "Resultatet är kortare listor än de flesta publicerade. Det är avsiktligt. " +
              "En kort lista som pekar i rätt riktning är mer användbar än en lång som " +
              "pekar överallt."
          }
        ]
      }
    ]
  }
};
