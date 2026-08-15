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
    sections: [
      {
        heading: "What is excess fructose?",
        sv: "Vad är överskott av fruktos?",
        blocks: [
          {
            type: "p",
            text: "This article covers excess fructose specifically — more free fructose than " +
              "glucose in a meal, which overwhelms small-intestine absorption capacity " +
              "and draws water into the bowel.",
            sv: "Den här artikeln handlar specifikt om överskott av fruktos — mer fri " +
              "fruktos än glukos i en måltid, vilket överbelastar tunntarmens " +
              "upptagsförmåga och drar vatten in i tarmen."
          }
        ]
      },
      {
        heading: "Food sources",
        sv: "Livsmedelskällor",
        blocks: [
          {
            type: "p",
            text: "Found in honey, apples, mangoes, and high-fructose corn syrup, among other " +
              "fructose-rich fruits and sweeteners.",
            sv: "Finns i honung, äpplen, mango och high-fructose corn syrup, bland andra " +
              "fruktosrika frukter och sötningsmedel."
          }
        ]
      },
      {
        heading: "Improving tolerance",
        sv: "Att förbättra toleransen",
        blocks: [
          {
            type: "p",
            text: "Pairing high-fructose foods with a source of glucose (e.g. fruit with a " +
              "starchy side) can improve absorption, since glucose helps transport " +
              "fructose across the gut wall.",
            sv: "Att kombinera fruktosrika livsmedel med en glukoskälla (t.ex. frukt med " +
              "något stärkelserikt till) kan förbättra upptaget, eftersom glukos hjälper " +
              "till att transportera fruktos över tarmväggen."
          }
        ]
      },
      {
        heading: "Hereditary fructose intolerance (HFI)",
        sv: "Ärftlig fruktosintolerans (HFI)",
        blocks: [
          {
            type: "p",
            text: "HFI is a rare genetic condition (roughly 1 in 20,000-30,000) causing an " +
              "inability to break down fructose at all. It's present from birth, but " +
              "because affected people often develop a strong natural aversion to sweet " +
              "foods, it can go undiagnosed until adulthood. It's a distinct condition " +
              "from the excess-fructose sensitivity covered here.",
            sv: "HFI är ett sällsynt genetiskt tillstånd (ungefär 1 på 20 000–30 000) som " +
              "gör att fruktos inte kan brytas ned alls. Det finns från födseln, men " +
              "eftersom drabbade ofta utvecklar en stark naturlig motvilja mot söt mat " +
              "kan det förbli odiagnostiserat till vuxen ålder. Det är ett annat " +
              "tillstånd än den fruktosöverskottskänslighet som beskrivs här."
          }
        ]
      },
      {
        heading: null,
        blocks: [
          {
            type: "note",
            text: "Excess fructose is a FODMAP subtype. It's mainly a problem for people with " +
              "IBS, though it can also cause discomfort in other GI disorders, or in " +
              "anyone if consumption is high enough.",
            sv: "Överskott av fruktos är en FODMAP-undertyp. Det är främst ett problem för " +
              "personer med IBS, men kan också ge obehag vid andra magtarmsjukdomar, " +
              "eller hos vem som helst om konsumtionen är tillräckligt hög."
          }
        ]
      }
    ]
  },

  polyols: {
    title: "Polyols",
    sv: "Polyoler",
    sections: [
      {
        heading: "What are polyols?",
        sv: "Vad är polyoler?",
        blocks: [
          {
            type: "p",
            text: "Polyols — sugar alcohols such as sorbitol and mannitol — are poorly " +
              "absorbed. They pull water into the bowel osmotically and are fermented by " +
              "colon bacteria, producing gas.",
            sv: "Polyoler — sockeralkoholer som sorbitol och mannitol — tas upp dåligt. De " +
              "drar in vatten i tarmen osmotiskt och fermenteras av tjocktarmsbakterier, " +
              "vilket bildar gas."
          }
        ]
      },
      {
        heading: "Food sources",
        sv: "Livsmedelskällor",
        blocks: [
          {
            type: "p",
            text: "Common in apples, pears, stone fruits (apricots, plums, peaches), " +
              "mushrooms, and sugar-free sweeteners used in chewing gum and \"diet\" " +
              "products.",
            sv: "Vanliga i äpplen, päron, stenfrukter (aprikoser, plommon, persikor), svamp " +
              "och sockerfria sötningsmedel som används i tuggummi och \"light\"-produkter."
          }
        ]
      },
      {
        heading: "A well-documented, dose-dependent effect",
        sv: "En väldokumenterad, dosberoende effekt",
        blocks: [
          {
            type: "p",
            text: "This osmotic effect is well known enough that many sugar-free products " +
              "carry a laxative-effect warning label — worth checking if bloating or " +
              "diarrhea follows sugar-free snacks or gum.",
            sv: "Den osmotiska effekten är så pass välkänd att många sockerfria produkter " +
              "bär en varningstext om laxerande verkan — värt att kolla om uppblåsthet " +
              "eller diarré följer på sockerfritt tilltugg eller tuggummi."
          }
        ]
      },
      {
        heading: null,
        blocks: [
          {
            type: "note",
            text: "Polyols are a FODMAP subtype. Mainly a problem for people with IBS, though " +
              "it can also cause discomfort in other GI disorders, or in anyone if " +
              "consumption is high enough.",
            sv: "Polyoler är en FODMAP-undertyp. Främst ett problem för personer med IBS, " +
              "men kan också ge obehag vid andra magtarmsjukdomar, eller hos vem som " +
              "helst om konsumtionen är tillräckligt hög."
          }
        ]
      }
    ]
  },

  fructans: {
    title: "Fructans",
    sv: "Fruktaner",
    sections: [
      {
        heading: "What are fructans?",
        sv: "Vad är fruktaner?",
        blocks: [
          {
            type: "p",
            text: "Chains of fructose molecules that humans can't digest; fermented by colon " +
              "bacteria in the same way as other FODMAPs.",
            sv: "Kedjor av fruktosmolekyler som människan inte kan smälta; fermenteras av " +
              "tjocktarmsbakterier på samma sätt som andra FODMAP."
          }
        ]
      },
      {
        heading: "Food sources",
        sv: "Livsmedelskällor",
        blocks: [
          {
            type: "p",
            text: "Found in wheat, onion, and garlic — among the most common FODMAP triggers, " +
              "since these are staple ingredients in many cuisines.",
            sv: "Finns i vete, lök och vitlök — bland de vanligaste FODMAP-utlösarna, " +
              "eftersom de är basingredienser i många kök."
          }
        ]
      },
      {
        heading: "A practical substitution",
        sv: "En praktisk ersättning",
        blocks: [
          {
            type: "p",
            text: "Fructans aren't oil-soluble, which is why garlic-infused oil is a common " +
              "low-FODMAP substitute for cooking with garlic — it carries the flavor " +
              "without the fructans.",
            sv: "Fruktaner är inte oljelösliga, vilket är varför vitlöksinfunderad olja är " +
              "en vanlig låg-FODMAP-ersättning för att laga mat med vitlök — den bär " +
              "smaken utan fruktanerna."
          }
        ]
      },
      {
        heading: null,
        blocks: [
          {
            type: "note",
            text: "Fructans are a FODMAP subtype. Mainly a problem for people with IBS, " +
              "though it can also cause discomfort in other GI disorders, or in anyone if " +
              "consumption is high enough.",
            sv: "Fruktaner är en FODMAP-undertyp. Främst ett problem för personer med IBS, " +
              "men kan också ge obehag vid andra magtarmsjukdomar, eller hos vem som " +
              "helst om konsumtionen är tillräckligt hög."
          }
        ]
      }
    ]
  },

  galactans: {
    title: "Galacto-oligosaccharides",
    sv: "Galakto-oligosackarider",
    sections: [
      {
        heading: "What are galacto-oligosaccharides?",
        sv: "Vad är galakto-oligosackarider?",
        blocks: [
          {
            type: "p",
            text: "Galacto-oligosaccharides (GOS) are short chains of galactose that the " +
              "small intestine can't break down; they're fermented in the colon like " +
              "other FODMAPs.",
            sv: "Galakto-oligosackarider (GOS) är korta kedjor av galaktos som tunntarmen " +
              "inte kan bryta ned; de fermenteras i tjocktarmen som andra FODMAP."
          }
        ]
      },
      {
        heading: "Food sources",
        sv: "Livsmedelskällor",
        blocks: [
          {
            type: "p",
            text: "Main sources are legumes and some nuts. Symptoms follow the typical FODMAP " +
              "pattern — gas and bloating, dose-dependent.",
            sv: "Huvudkällorna är baljväxter och vissa nötter. Symtomen följer det typiska " +
              "FODMAP-mönstret — gaser och uppblåsthet, dosberoende."
          }
        ]
      },
      {
        heading: "Reducing GOS content",
        sv: "Att minska GOS-halten",
        blocks: [
          {
            type: "p",
            text: "Soaking or sprouting legumes before cooking reduces their GOS content and " +
              "is a common practical tip for better tolerance.",
            sv: "Att blötlägga eller grodda baljväxter före tillagning minskar deras " +
              "GOS-halt och är ett vanligt praktiskt tips för bättre tolerans."
          }
        ]
      },
      {
        heading: null,
        blocks: [
          {
            type: "note",
            text: "GOS is a FODMAP subtype. Mainly a problem for people with IBS, though it " +
              "can also cause discomfort in other GI disorders, or in anyone if " +
              "consumption is high enough.",
            sv: "GOS är en FODMAP-undertyp. Främst ett problem för personer med IBS, men " +
              "kan också ge obehag vid andra magtarmsjukdomar, eller hos vem som helst om " +
              "konsumtionen är tillräckligt hög."
          }
        ]
      }
    ]
  },

  lactose: {
    title: "Lactose",
    sv: "Laktos",
    sections: [
      {
        heading: "What is lactose intolerance?",
        sv: "Vad är laktosintolerans?",
        blocks: [
          {
            type: "p",
            text: "Lactose is a sugar found in milk, broken down by the enzyme lactase. When " +
              "lactase activity is too low, undigested lactose draws water into the bowel " +
              "and ferments in the colon, causing gas, bloating, cramping, and diarrhea.",
            sv: "Laktos är ett socker som finns i mjölk och bryts ned av enzymet laktas. " +
              "När laktasaktiviteten är för låg drar osmält laktos in vatten i tarmen och " +
              "fermenteras i tjocktarmen, vilket ger gaser, uppblåsthet, kramper och " +
              "diarré."
          }
        ]
      },
      {
        heading: "Types",
        sv: "Typer",
        blocks: [
          {
            type: "list",
            items: [
              "**Primary:** the most common form — lactase production naturally " +
                "declines after childhood in most of the world's population",
              "**Secondary (temporary):** caused by damage to the gut lining from " +
                "another condition, and resolves once that condition is treated",
            ],
            sv: [
              "**Primär:** den vanligaste formen — laktasproduktionen avtar naturligt " +
                "efter barndomen hos större delen av världens befolkning",
              "**Sekundär (tillfällig):** orsakad av skada på tarmslemhinnan från ett " +
                "annat tillstånd, och går över när det tillståndet behandlats",
            ]
          }
        ]
      },
      {
        heading: null,
        blocks: [
          {
            type: "note",
            text: "Untreated coeliac disease often causes temporary secondary lactose " +
              "intolerance, since gut lining damage reduces lactase production. This is a " +
              "key reason proper diagnosis matters — in children who previously tolerated " +
              "lactose well, and arguably even more so in adults who have been lactose " +
              "tolerant their whole life, since new-onset intolerance in adulthood is a " +
              "stronger signal that something else needs investigating.",
            sv: "Obehandlad celiaki ger ofta tillfällig sekundär laktosintolerans, eftersom " +
              "skadan på tarmslemhinnan minskar laktasproduktionen. Det är ett viktigt " +
              "skäl till att korrekt diagnos spelar roll — hos barn som tidigare tålde " +
              "laktos väl, och rimligen ännu mer hos vuxna som varit laktostoleranta hela " +
              "livet, eftersom nydebuterad intolerans i vuxen ålder är en starkare signal " +
              "om att något annat behöver utredas."
          }
        ]
      },
      {
        heading: "Lactose and FODMAPs/IBS",
        sv: "Laktos och FODMAP/IBS",
        blocks: [
          {
            type: "p",
            text: "Lactose is one of the FODMAP subtypes (the \"D\" for disaccharides), so it's " +
              "tested during a structured low-FODMAP elimination diet alongside fructans, " +
              "GOS, and polyols. People with IBS often have some degree of lactose " +
              "sensitivity even with normal lactase levels, since IBS increases general " +
              "sensitivity to fermentable sugars — not just lactose specifically.",
            sv: "Laktos är en av FODMAP-undertyperna (\"D\" för disackarider), så den prövas " +
              "under en strukturerad låg-FODMAP-eliminationsdiet vid sidan av fruktaner, " +
              "GOS och polyoler. Personer med IBS har ofta någon grad av laktoskänslighet " +
              "även med normala laktasnivåer, eftersom IBS ökar den generella " +
              "känsligheten för fermenterbara sockerarter — inte bara laktos specifikt."
          },
          {
            type: "note",
            text: "As a FODMAP subtype, lactose is mainly a problem for people with IBS, " +
              "though it can also cause discomfort in other GI disorders, or in anyone if " +
              "consumption is high enough.",
            sv: "Som FODMAP-undertyp är laktos främst ett problem för personer med IBS, men " +
              "kan också ge obehag vid andra magtarmsjukdomar, eller hos vem som helst om " +
              "konsumtionen är tillräckligt hög."
          }
        ]
      },
      {
        heading: "Managing it",
        sv: "Att hantera den",
        blocks: [
          {
            type: "p",
            text: "Tolerance is dose- and dairy-type dependent — many people can tolerate " +
              "small amounts or fermented/aged dairy (yogurt, hard cheese) even if unable " +
              "to tolerate a glass of milk.",
            sv: "Toleransen beror på dos och mejerityp — många tål små mängder eller " +
              "fermenterade/lagrade mejeriprodukter (yoghurt, hårdost) även om de inte " +
              "tål ett glas mjölk."
          }
        ]
      }
    ]
  },

  irritant: {
    title: "GI Irritants",
    sv: "GI-irriterande",
    sections: [
      {
        heading: "What counts as a GI irritant?",
        sv: "Vad räknas som GI-irriterande?",
        blocks: [
          {
            type: "p",
            text: "A broad group of foods that can worsen gut symptoms through different " +
              "mechanisms — some well-established (fat, alcohol, caffeine, capsaicin), " +
              "others based mainly on clinical observation.",
            sv: "En bred grupp livsmedel som kan förvärra magsymtom genom olika mekanismer " +
              "— vissa väl belagda (fett, alkohol, koffein, capsaicin), andra " +
              "huvudsakligen grundade på klinisk observation."
          }
        ]
      },
      {
        heading: "Specific mechanisms",
        sv: "Specifika mekanismer",
        blocks: [
          {
            type: "list",
            items: [
              "**Capsaicin:** activates pain/heat receptors in the gut lining, found in " +
                "hot peppers (well established)",
              "**Alcohol:** relaxes the esophageal sphincter, irritates gut lining " +
                "(well established)",
              "**Caffeine:** stimulates gut motility and acid secretion (well established)",
              "**Carbonation:** gas causes distension, worsens bloating and reflux " +
                "(limited)",
              "**Peel/skin:** concentrated fiber and irritant compounds in the outer " +
                "layer of some fruits/vegetables (preliminary)",
              "**Allyl/sulfur compounds:** pungent compounds in raw garlic, onion, " +
                "mustard (preliminary)",
              "**Acetic acid:** vinegar's acidity can irritate the gut lining directly " +
                "(preliminary)",
            ],
            sv: [
              "**Capsaicin:** aktiverar smärt- och värmereceptorer i tarmslemhinnan, " +
                "finns i stark peppar (väl belagt)",
              "**Alkohol:** slappnar av matstrupens nedre sfinkter, irriterar " +
                "tarmslemhinnan (väl belagt)",
              "**Koffein:** stimulerar tarmmotorik och syrasekretion (väl belagt)",
              "**Kolsyra:** gasen ger utspänning, förvärrar uppblåsthet och reflux " +
                "(begränsat)",
              "**Skal:** koncentrerad fiber och irriterande ämnen i ytterlagret på viss " +
                "frukt och vissa grönsaker (preliminärt)",
              "**Allyl- och svavelföreningar:** skarpa ämnen i rå vitlök, lök och senap " +
                "(preliminärt)",
              "**Ättiksyra:** vinägerns surhet kan irritera tarmslemhinnan direkt " +
                "(preliminärt)",
            ]
          }
        ]
      },
      {
        heading: null,
        blocks: [
          {
            type: "note",
            text: "The levels above are the same ones shown with each trait in the results. " +
              "The first three rest on measured effects in people; the last three rest on " +
              "cell and animal work or on clinical experience alone. Not every food " +
              "tagged here has an equally strong effect — treat this as a starting point " +
              "for individual investigation.",
            sv: "Nivåerna ovan är desamma som visas med varje egenskap i resultatet. De tre " +
              "första vilar på uppmätta effekter hos människa; de tre sista vilar på " +
              "cell- och djurstudier eller på klinisk erfarenhet ensam. Alla livsmedel " +
              "märkta här har inte lika stark effekt — betrakta det här som en " +
              "utgångspunkt för individuell utredning."
          }
        ]
      }
    ]
  },

  histamine: {
    title: "Histamine",
    sv: "Histamin",
    sections: [
      {
        heading: "What is histamine intolerance?",
        sv: "Vad är histaminintolerans?",
        blocks: [
          {
            type: "p",
            text: "Histamine is a normal signaling molecule found in many foods and made by " +
              "the body, mainly by mast cells, then broken down by two enzymes: DAO (in " +
              "the gut) and MAO (mostly elsewhere in the body). When breakdown is too " +
              "slow or intake too high, histamine builds up and causes symptoms that " +
              "mimic an allergic reaction, even without a true immune allergy.",
            sv: "Histamin är en normal signalmolekyl som finns i många livsmedel och som " +
              "kroppen själv bildar, främst via mastceller, och som sedan bryts ned av " +
              "två enzymer: DAO (i tarmen) och MAO (mest på andra håll i kroppen). När " +
              "nedbrytningen är för långsam eller intaget för högt byggs histamin upp och " +
              "ger symtom som liknar en allergisk reaktion, även utan verklig " +
              "immunologisk allergi."
          }
        ]
      },
      {
        heading: "How foods come to carry histamine",
        sv: "Hur livsmedel kommer att bära histamin",
        blocks: [
          {
            type: "p",
            text: "Bacteria make histamine by decarboxylating free histidine. For that to " +
              "happen in quantity, three things have to line up at once, and it is worth " +
              "separating them — \"fermented\" is a rule of thumb that hides three " +
              "different processes.",
            sv: "Bakterier bildar histamin genom att dekarboxylera fritt histidin. För att " +
              "det ska ske i mängd måste tre saker sammanfalla, och det är värt att hålla " +
              "isär dem — \"fermenterad\" är en tumregel som döljer tre olika processer."
          },
          {
            type: "list",
            items: [
              "**Substrate.** Free histidine is released by proteolysis. Cheese " +
                "ripening *is* proteolysis, running for weeks to years. Yogurt undergoes " +
                "almost none — the casein is largely intact after four to eight hours of " +
                "acidification.",
              "**Flora.** Yogurt uses defined starter cultures that are screened for " +
                "amine-forming ability. In cheese, a secondary flora establishes itself " +
                "during ripening, and several of the most prolific histamine formers " +
                "belong to it.",
              "**Time.** Yogurt is chilled immediately and eaten within weeks. Cheese " +
                "ripens at temperatures that allow microbial activity to continue " +
                "throughout storage.",
            ],
            sv: [
              "**Substrat.** Fritt histidin frigörs genom proteolys. Ostmognad *är* " +
                "proteolys, som pågår i veckor till år. Yoghurt genomgår nästan ingen — " +
                "kaseinet är i stort sett intakt efter fyra till åtta timmars syrning.",
              "**Flora.** Yoghurt använder definierade startkulturer som screenas för " +
                "aminbildande förmåga. I ost etablerar sig en sekundär flora under " +
                "mognaden, och flera av de mest produktiva histaminbildarna hör till den.",
              "**Tid.** Yoghurt kyls omedelbart och äts inom veckor. Ost mognar vid " +
                "temperaturer som låter mikrobiell aktivitet fortsätta genom hela " +
                "lagringen.",
            ]
          },
          {
            type: "p",
            text: "That is why the spread in cheese is enormous — from undetectable to close " +
              "to 400 mg/kg — while measured histamine in yogurt is undetectable. It also " +
              "explains why fresh cheese and hard cheese end up at opposite ends despite " +
              "identical raw material and the same lactic acid bacteria.",
            sv: "Det är därför spridningen i ost är enorm — från omätbart till nära 400 " +
              "mg/kg — medan uppmätt histamin i yoghurt är omätbart. Det förklarar också " +
              "varför färskost och hårdost hamnar i var sin ände trots identisk råvara " +
              "och samma mjölksyrabakterier."
          },
          {
            type: "p",
            text: "Beyond fermentation, histamine accumulates as freshness declines. That is " +
              "the mechanism behind fish, shellfish, minced meat and offal, where storage " +
              "and handling matter more than the food itself.",
            sv: "Utöver fermentering ackumuleras histamin när färskheten avtar. Det är " +
              "mekanismen bakom fisk, skaldjur, köttfärs och inälvsmat, där lagring och " +
              "hantering betyder mer än livsmedlet självt."
          }
        ]
      },
      {
        heading: "The mechanism that was never demonstrated",
        sv: "Mekanismen som aldrig påvisades",
        blocks: [
          {
            type: "p",
            text: "Many lists split foods into histamine-rich and *histamine-liberating*. The " +
              "second group takes in strawberries, pineapple, kiwi, papaya and citrus — " +
              "foods where histamine often cannot be measured at all.",
            sv: "Nästan varje histaminlista delar upp livsmedel i histaminrika och " +
              "*histaminfrisättande*. Den andra gruppen rymmer jordgubbar, ananas, kiwi, " +
              "papaya och citrus — livsmedel där histamin ofta inte kan mätas alls."
          },
          {
            type: "p",
            text: "A review of ten published low-histamine diets found that 68% of the " +
              "excluded foods had no detectable histamine. For a large share of them, the " +
              "release hypothesis is the only explanation on offer — and it does not rest " +
              "on human studies. The only systematic review of the area concluded that " +
              "the support consists of a handful of inconclusive test-tube and animal " +
              "experiments.",
            sv: "En genomgång av tio publicerade histaminfattiga dieter fann att 68 % av de " +
              "uteslutna livsmedlen inte hade mätbart histamin. För en stor del av dem är " +
              "frisättningshypotesen den enda förklaring som erbjuds — och den vilar inte " +
              "på humanstudier. Den enda systematiska översikten på området drog " +
              "slutsatsen att stödet består av en handfull inkonklusiva provrörs- och " +
              "djurförsök."
          },
          {
            type: "note",
            text: "Foods whose only justification was the release mechanism are no longer " +
              "tagged in this tool. That does not mean someone reacting to strawberries " +
              "is imagining it — it means the explanation probably lies elsewhere, such " +
              "as birch pollen cross-reactivity or salicylates, both of which this tool " +
              "covers under other traits.",
            sv: "Livsmedel vars enda motivering var frisättningsmekanismen märks inte " +
              "längre i det här verktyget. Det betyder inte att någon som reagerar på " +
              "jordgubbar inbillar sig — det betyder att förklaringen sannolikt ligger " +
              "någon annanstans, som björkpollenkorsreaktivitet eller salicylater, som " +
              "verktyget båda täcker under andra egenskaper."
          }
        ]
      },
      {
        heading: "Symptoms and who's affected",
        sv: "Symtom och vilka som drabbas",
        blocks: [
          {
            type: "p",
            text: "Flushing, headache, hives, nasal congestion, and gut discomfort (bloating, " +
              "diarrhea). More common in adults; dose-dependent, so small amounts of a " +
              "trigger may be fine while larger amounts aren't. Mast cell activation " +
              "syndrome (MCAS) is a related, more complex condition sometimes considered " +
              "alongside histamine intolerance.",
            sv: "Flush, huvudvärk, nässelutslag, nästäppa och magbesvär (uppblåsthet, " +
              "diarré). Vanligare hos vuxna; dosberoende, så små mängder av en utlösare " +
              "kan gå bra medan större mängder inte gör det. Mastcellsaktiveringssyndrom " +
              "(MCAS) är ett besläktat, mer komplext tillstånd som ibland övervägs vid " +
              "sidan av histaminintolerans."
          }
        ]
      },
      {
        heading: "Diagnosis",
        sv: "Diagnostik",
        blocks: [
          {
            type: "p",
            text: "There's no single definitive test. Serum DAO activity and tryptase (a mast " +
              "cell marker) blood tests can support a diagnosis in some cases, but a " +
              "supervised elimination-and-reintroduction diet remains the main diagnostic " +
              "tool.",
            sv: "Det finns inget enskilt avgörande test. Blodprov på DAO-aktivitet i serum " +
              "och tryptas (en mastcellsmarkör) kan stödja en diagnos i vissa fall, men " +
              "en övervakad elimination-och-återintroduktion är fortfarande det främsta " +
              "diagnostiska verktyget."
          }
        ]
      },
      {
        heading: "Reducing histamine in your diet",
        sv: "Att minska histamin i kosten",
        blocks: [
          {
            type: "list",
            items: [
              "Avoid cooked food that's been sitting in the fridge or at room " +
                "temperature for a while — histamine rises as food ages, even before it " +
                "looks or smells spoiled.",
              "Freeze leftovers soon after cooking to slow that buildup.",
              "Avoid most fish and shellfish unless certain it was frozen shortly after " +
                "catch — histamine in fish rises quickly once out of the water.",
              "For specific food guidance beyond these general rules, the SIGHI food " +
                "list is a detailed reference.",
            ],
            sv: [
              "Undvik tillagad mat som stått i kylen eller i rumstemperatur en tid — " +
                "histamin stiger när maten åldras, redan innan den ser eller luktar skämd " +
                "ut.",
              "Frys in rester snart efter tillagning för att bromsa den uppbyggnaden.",
              "Undvik de flesta fiskar och skaldjur om du inte är säker på att de " +
                "frystes kort efter fångst — histamin i fisk stiger snabbt när den kommit " +
                "upp ur vattnet.",
              "För specifik livsmedelsvägledning utöver dessa allmänna regler är " +
                "SIGHI:s livsmedelslista en detaljerad referens.",
            ]
          }
        ]
      },
      {
        heading: null,
        blocks: [
          {
            type: "note",
            text: "Work with a dietitian or physician experienced in histamine intolerance " +
              "before starting an elimination diet — it's easy to over-restrict and end " +
              "up with unnecessary nutrient gaps.",
            sv: "Arbeta med en dietist eller läkare som har erfarenhet av " +
              "histaminintolerans innan du börjar en eliminationsdiet — det är lätt att " +
              "begränsa för mycket och sluta med onödiga näringsbrister."
          }
        ]
      }
    ]
  },

  dao_competitor: {
    title: "DAO Competitors",
    sv: "DAO-hämmare",
    sections: [
      {
        heading: "What this trait means",
        sv: "Vad egenskapen betyder",
        blocks: [
          {
            type: "p",
            text: "Putrescine and cadaverine are diamines broken down by the same enzyme as " +
              "histamine: DAO. When they are present in a meal they occupy the enzyme, " +
              "and histamine may pass through less degraded than it otherwise would.",
            sv: "Putrescin och kadaverin är diaminer som bryts ned av samma enzym som " +
              "histamin: DAO. När de finns i en måltid upptar de enzymet, och histamin " +
              "kan passera mindre nedbrutet än det annars skulle ha gjort."
          },
          {
            type: "p",
            text: "These foods therefore add no histamine of their own. They are tagged as a " +
              "possible modifier of how much histamine gets through — which is why the " +
              "tool only reports the trait when the selection also contains histamine. A " +
              "food high in putrescine but carrying no histamine has nothing to compete " +
              "with.",
            sv: "De här livsmedlen tillför alltså inget eget histamin. De märks som en " +
              "möjlig modifierare av hur mycket histamin som slipper igenom — vilket är " +
              "varför verktyget bara rapporterar egenskapen när urvalet också innehåller " +
              "histamin. Ett livsmedel högt i putrescin men utan histamin har inget att " +
              "konkurrera med."
          }
        ]
      },
      {
        heading: "Competitor, not inhibitor",
        sv: "Konkurrent, inte hämmare",
        blocks: [
          {
            type: "p",
            text: "These are two different mechanisms, and lists that merge them cause " +
              "confusion. A competing substrate occupies the enzyme by being processed " +
              "alongside histamine. True DAO inhibition means binding to the active site, " +
              "and the substances that do that are drugs — chloroquine, clavulanic acid, " +
              "verapamil, cimetidine — not foods.",
            sv: "Det är två olika mekanismer, och listor som slår ihop dem skapar " +
              "förvirring. Ett konkurrerande substrat upptar enzymet genom att bearbetas " +
              "vid sidan av histamin. Verklig DAO-hämning betyder bindning till den " +
              "aktiva ytan, och de ämnen som gör det är läkemedel — klorokin, " +
              "klavulansyra, verapamil, cimetidin — inte livsmedel."
          },
          {
            type: "p",
            text: "Alcohol is a third thing again: it competes downstream at a different " +
              "enzyme, ALDH, and is tracked separately under its own trait.",
            sv: "Alkohol är återigen en tredje sak: den konkurrerar längre ned vid ett " +
              "annat enzym, ALDH, och följs separat under sin egen egenskap."
          }
        ]
      },
      {
        heading: "What the evidence actually shows",
        sv: "Vad evidensen faktiskt visar",
        blocks: [
          {
            type: "p",
            text: "One study tested this directly, mixing histamine with each amine at ratios " +
              "from 1:0.25 up to 1:20. Putrescine and cadaverine both delayed histamine " +
              "breakdown significantly at every ratio tested — including when the " +
              "competitor was only a quarter of the histamine present. At 1:20 the " +
              "reduction was 70% and 80% respectively.",
            sv: "En studie testade detta direkt genom att blanda histamin med varje amin i " +
              "förhållanden från 1:0,25 upp till 1:20. Putrescin och kadaverin fördröjde " +
              "båda histaminnedbrytningen signifikant vid varje testat förhållande — även " +
              "när konkurrenten bara utgjorde en fjärdedel av det närvarande histaminet. " +
              "Vid 1:20 var minskningen 70 % respektive 80 %."
          },
          {
            type: "p",
            text: "Tyramine, spermidine and spermine only interfered at the most extreme 1:20 " +
              "ratio, and they act on different enzymes. That fits the underlying " +
              "division of labour: DAO handles diamines, MAO handles monoamines, PAO " +
              "handles polyamines. Only the diamines are tagged here.",
            sv: "Tyramin, spermidin och spermin störde bara vid det mest extrema " +
              "förhållandet 1:20, och de verkar på andra enzymer. Det stämmer med den " +
              "underliggande arbetsfördelningen: DAO hanterar diaminer, MAO hanterar " +
              "monoaminer, PAO hanterar polyaminer. Bara diaminerna märks här."
          }
        ]
      },
      {
        heading: "Why this is the weakest trait in the tool",
        sv: "Varför det här är verktygets svagaste egenskap",
        blocks: [
          {
            type: "list",
            items: [
              "**No human studies.** Everything is enzyme assays in test tubes or " +
                "animal tissue.",
              "**No threshold for an effect exists.** Thresholds are established for " +
                "histamine and for tyramine, but not for putrescine or cadaverine. The 10 " +
                "mg/kg cutoff used here separates trace levels from meaningful ones — it " +
                "does not mark a level at which anything is known to happen.",
              "**The effect is a ratio, not a level.** Competition happens across the " +
                "whole meal in the gut, not inside one food.",
            ],
            sv: [
              "**Inga humanstudier.** Allt är enzymanalyser i provrör eller på djurvävnad.",
              "**Ingen tröskel för effekt finns.** Trösklar är etablerade för histamin " +
                "och för tyramin, men inte för putrescin eller kadaverin. Gränsen på 10 " +
                "mg/kg som används här skiljer spårnivåer från meningsfulla — den " +
                "markerar inte en nivå där något är känt att hända.",
              "**Effekten är ett förhållande, inte en nivå.** Konkurrensen sker över " +
                "hela måltiden i tarmen, inte inuti ett livsmedel.",
            ]
          },
          {
            type: "note",
            text: "Reasonable reading: likely relevant only for particularly sensitive " +
              "people, and only when the food is eaten alongside histamine-rich food.",
            sv: "Rimlig läsning: sannolikt relevant bara för särskilt känsliga personer, " +
              "och bara när livsmedlet äts tillsammans med histaminrik mat."
          }
        ]
      },
      {
        heading: "Mushrooms are the clearest case",
        sv: "Svamp är det tydligaste fallet",
        blocks: [
          {
            type: "p",
            text: "Mushrooms carry this trait and never the histamine one. Histamine is " +
              "consistently undetectable in them, while putrescine can exceed 150 mg/kg " +
              "fresh weight — highest in the bolete family (porcini and its relatives).",
            sv: "Svamp bär den här egenskapen och aldrig histaminegenskapen. Histamin är " +
              "genomgående omätbart i svamp, medan putrescin kan överstiga 150 mg/kg " +
              "färskvikt — högst i sopp-familjen (karljohan och dess släktingar)."
          },
          {
            type: "p",
            text: "This matters practically: poison information centres have logged stomach " +
              "complaints after meals of demonstrably edible mushroom species, with no " +
              "explanation. Putrescine is the only amine present in amounts that could " +
              "plausibly account for it.",
            sv: "Det spelar roll i praktiken: giftinformationscentraler har registrerat " +
              "magbesvär efter måltider av bevisligen ätliga svamparter, utan förklaring. " +
              "Putrescin är den enda amin som förekommer i mängder som rimligen skulle " +
              "kunna förklara det."
          },
          {
            type: "note",
            text: "Cooking lowers the level substantially — stewing reduces all the amines " +
              "measured. Raw or lightly cooked mushroom is the worst case. This is the " +
              "one place in the whole dataset where preparation method is a documented " +
              "modifier of the tag itself.",
            sv: "Tillagning sänker nivån betydligt — stuvning minskar alla uppmätta aminer. " +
              "Rå eller lätt tillagad svamp är värsta fallet. Det här är den enda platsen " +
              "i hela datamängden där tillagningsmetoden är en dokumenterad modifierare " +
              "av själva taggen."
          }
        ]
      },
      {
        heading: null,
        blocks: [
          {
            type: "note",
            text: "Concentration and processing drive these levels more than the vegetable " +
              "does. Ketchup and tomato purée measure well above fresh tomato, and fresh " +
              "vegetables generally sit far below the threshold.",
            sv: "Koncentrering och processning driver dessa nivåer mer än grönsaken gör. " +
              "Ketchup och tomatpuré mäter en bra bit över färsk tomat, och färska " +
              "grönsaker ligger generellt långt under tröskeln."
          }
        ]
      }
    ]
  },

  salicylate: {
    title: "Salicylates",
    sv: "Salicylater",
    sections: [
      {
        heading: "What salicylates are",
        sv: "Vad salicylater är",
        blocks: [
          {
            type: "p",
            text: "Salicylic acid is the same active principle as in aspirin. Plants make it " +
              "as a defence compound, so it turns up across fruit, vegetables, herbs and " +
              "spices. Sensitivity to it produces hives, itching, headache and gut " +
              "symptoms.",
            sv: "Salicylsyra är samma aktiva princip som i acetylsalicylsyra. Växter bildar " +
              "den som försvarsämne, så den dyker upp tvärs över frukt, grönsaker, örter " +
              "och kryddor. Känslighet för den ger nässelutslag, klåda, huvudvärk och " +
              "magsymtom."
          },
          {
            type: "p",
            text: "Foods are tagged here when a normal portion carries at least 1 mg. Portion " +
              "size rather than concentration is what matters: cumin measures 605 mg/kg, " +
              "but a portion is 2 g — which puts it below a serving of green peas.",
            sv: "Livsmedel märks här när en normal portion bär minst 1 mg. Portionsstorlek " +
              "snarare än koncentration är det som spelar roll: spiskummin mäter 605 " +
              "mg/kg, men en portion är 2 g — vilket lägger den under en portion gröna " +
              "ärtor."
          }
        ]
      },
      {
        heading: "Who this is actually for",
        sv: "Vilka det här faktiskt gäller",
        blocks: [
          {
            type: "p",
            text: "The single blinded dietary trial in this area (n=10, in IBS) was negative " +
              "overall. Clear symptom provocation appeared in one participant — the one " +
              "with known aspirin-induced urticaria — with a dose-response within that " +
              "individual and the blinding intact, plus a trend in one other.",
            sv: "Den enda blindade kostprövningen på området (n=10, vid IBS) var negativ " +
              "som helhet. Tydlig symtomprovokation uppträdde hos en deltagare — den med " +
              "känd acetylsalicylsyrautlöst urtikaria — med dos-responssamband inom den " +
              "individen och bibehållen blindning, plus en tendens hos ytterligare en."
          },
          {
            type: "note",
            text: "The phenotype is the marker, not the food pattern. Ask about reactions to " +
              "aspirin or NSAIDs — that is where the signal sits. Estimated prevalence is " +
              "around 2.5%.",
            sv: "Fenotypen är markören, inte kostmönstret. Fråga om reaktioner på " +
              "acetylsalicylsyra eller NSAID — det är där signalen sitter. Uppskattad " +
              "prevalens är omkring 2,5 %."
          }
        ]
      },
      {
        heading: "Preparation changes the level more than food choice does",
        sv: "Beredning ändrar nivån mer än livsmedelsvalet gör",
        blocks: [
          {
            type: "list",
            items: [
              "**Peeling lowers it sharply** — three to fourfold for pears and apples. " +
                "This is the single most replicated finding in the area.",
              "**Boiling lowers it** — salicylic acid is volatile and sublimates on " +
                "heating.",
              "**Pickling and marinating raise it.**",
              "**Concentrating raises it** — tomato purée measures above fresh tomato.",
            ],
            sv: [
              "**Skalning sänker den kraftigt** — tre till fyra gånger för päron och " +
                "äpplen. Det är det enskilt mest replikerade fyndet på området.",
              "**Kokning sänker den** — salicylsyra är flyktig och sublimerar vid " +
                "upphettning.",
              "**Inläggning och marinering höjer den.**",
              "**Koncentrering höjer den** — tomatpuré mäter över färsk tomat.",
            ]
          },
          {
            type: "p",
            text: "Apples and pears are tagged here on their unpeeled values, since that is " +
              "how they are usually eaten. Peeling them is a real option before avoiding " +
              "them.",
            sv: "Äpplen och päron märks här på sina oskalade värden, eftersom det är så de " +
              "vanligen äts. Att skala dem är ett verkligt alternativ före att undvika " +
              "dem."
          },
          {
            type: "note",
            text: "Oils and sugar measure at essentially zero in every source.",
            sv: "Oljor och socker mäter i praktiken noll i varje källa."
          }
        ]
      },
      {
        heading: "How reliable the numbers are",
        sv: "Hur tillförlitliga siffrorna är",
        blocks: [
          {
            type: "p",
            text: "Two modern studies, both careful, both covering 112 foods, disagree about " +
              "which foods are high. The Australian study puts apples at 9.7 mg/kg; the " +
              "European study found no salicylates at all in three Polish apple " +
              "varieties. Watermelon is low in one and the highest of all fruits in the " +
              "other.",
            sv: "Två moderna studier, båda omsorgsfulla, båda med 112 livsmedel, är oense " +
              "om vilka livsmedel som är höga. Den australiska studien anger äpplen till " +
              "9,7 mg/kg; den europeiska fann inga salicylater alls i tre polska " +
              "äppelsorter. Vattenmelon är låg i den ena och högst av all frukt i den " +
              "andra."
          },
          {
            type: "p",
            text: "This tool uses the Australian data for one reason: it has been tested " +
              "clinically. The blinded trial above built its diets on those values and " +
              "achieved a real measured contrast. The European study is an analytical " +
              "survey without clinical validation.",
            sv: "Det här verktyget använder de australiska data av ett skäl: de har prövats " +
              "kliniskt. Den blindade prövningen ovan byggde sina dieter på de värdena " +
              "och uppnådde en verklig uppmätt kontrast. Den europeiska studien är en " +
              "analytisk kartläggning utan klinisk validering."
          },
          {
            type: "note",
            text: "What has been validated is the ranking, not absolute values for northern " +
              "European produce. That the Polish varieties measured zero is relevant — " +
              "Polish growing conditions are closer to Swedish ones than Australian " +
              "conditions are. No Nordic measurements exist at all.",
            sv: "Det som validerats är rangordningen, inte absoluta värden för " +
              "nordeuropeiska råvaror. Att de polska sorterna mätte noll är relevant — " +
              "polska odlingsförhållanden ligger närmare svenska än australiska gör. Inga " +
              "nordiska mätningar finns alls."
          }
        ]
      }
    ]
  },

  bile_stimulant: {
    title: "Bile Stimulants",
    sv: "Gallstimulerande",
    sections: [
      {
        heading: "What triggers bile release?",
        sv: "Vad utlöser gallutsöndring?",
        blocks: [
          {
            type: "p",
            text: "Fat is the dominant dietary trigger of cholecystokinin (CCK), a hormone " +
              "that signals the gallbladder to contract and release bile. Protein " +
              "releases it too, but far more weakly — roughly a fifth as much per gram, " +
              "which is how this tool weighs it. In practice that means a protein-rich " +
              "meal needs less fat to provoke the same response: 125g of beef reaches the " +
              "threshold on 12.5g of fat, where a food carrying no protein would need " +
              "13g. Fried and smoked foods are common contributors too, both because " +
              "they're typically high in fat and because the frying or smoking itself can " +
              "add further irritant compounds.",
            sv: "Fett är den dominerande kostutlösaren av kolecystokinin (CCK), ett hormon " +
              "som signalerar till gallblåsan att dra ihop sig och släppa ut galla. " +
              "Protein frisätter det också, men långt svagare — ungefär en femtedel så " +
              "mycket per gram, vilket är hur verktyget väger det. I praktiken betyder " +
              "det att en proteinrik måltid behöver mindre fett för att framkalla samma " +
              "svar: 125 g nötkött når tröskeln på 12,5 g fett, där ett livsmedel utan " +
              "protein skulle behöva 13 g. Stekt och rökt mat är vanliga bidragsgivare " +
              "också, både för att de typiskt är fettrika och för att stekningen eller " +
              "rökningen i sig kan tillföra ytterligare irriterande ämnen."
          }
        ]
      },
      {
        heading: "Clinical relevance",
        sv: "Klinisk relevans",
        blocks: [
          {
            type: "list",
            items: [
              "Egg yolk is used clinically as a standard fatty-meal challenge to test " +
                "gallbladder emptying via ultrasound",
              "Curcumin (turmeric) causes dose-dependent gallbladder contraction " +
                "separately from fat content",
              "Most relevant for people with gallstones, biliary colic, or a history of " +
                "gallbladder attacks — a strong contraction can trigger pain",
            ],
            sv: [
              "Äggula används kliniskt som en standardiserad fettmåltid för att testa " +
                "gallblåsetömning med ultraljud",
              "Curcumin (gurkmeja) ger dosberoende gallblåsesammandragning oberoende av " +
                "fetthalt",
              "Mest relevant för personer med gallsten, gallstensanfall eller tidigare " +
                "gallattacker — en kraftig sammandragning kan utlösa smärta",
            ]
          }
        ]
      },
      {
        heading: "After gallbladder removal",
        sv: "Efter borttagen gallblåsa",
        blocks: [
          {
            type: "p",
            text: "After cholecystectomy, bile drips continuously into the gut instead of " +
              "being released in a controlled burst with meals. Fat-rich meals can then " +
              "cause bile acid diarrhea, a different mechanism from the pain caused by an " +
              "intact but diseased gallbladder.",
            sv: "Efter kolecystektomi droppar galla kontinuerligt ut i tarmen i stället för " +
              "att frisättas i en kontrollerad puls vid måltid. Fettrika måltider kan då " +
              "ge gallsaltsdiarré, en annan mekanism än den smärta en intakt men sjuk " +
              "gallblåsa ger."
          }
        ]
      },
      {
        heading: null,
        blocks: [
          {
            type: "note",
            text: "Foods are tagged here on fat and protein content — over 17.5g fat or over " +
              "20g protein per 100g. That cut-off is this tool's own, borrowed from EU " +
              "food-labeling categories rather than from any clinical guideline, and the " +
              "step from a measured CCK response to an actual symptom is inferred rather " +
              "than trialled. Treat it as a starting point rather than a diagnostic " +
              "label.",
            sv: "Livsmedel märks här på fett- och proteinhalt — över 17,5 g fett eller över " +
              "20 g protein per 100 g. Den gränsen är verktygets egen, lånad från EU:s " +
              "livsmedelsmärkningskategorier snarare än från någon klinisk riktlinje, och " +
              "steget från ett uppmätt CCK-svar till ett faktiskt symtom är slutlett " +
              "snarare än prövat. Betrakta det som en utgångspunkt snarare än en " +
              "diagnostisk etikett."
          }
        ]
      }
    ]
  },

  refined_carbs: {
    title: "Refined Carbohydrates",
    sv: "Raffinerade kolhydrater",
    sections: [
      {
        heading: "What counts as a refined carb?",
        sv: "Vad räknas som en raffinerad kolhydrat?",
        blocks: [
          {
            type: "p",
            text: "This trait is assigned by food type and processing, not carbohydrate " +
              "content — white bread, sugar, refined grains, and other ultra-processed " +
              "carb sources. Whole grains, legumes, and vegetables are never tagged with " +
              "it, no matter how carb-heavy they are.",
            sv: "Egenskapen tilldelas efter livsmedelstyp och processning, inte efter " +
              "kolhydrathalt — vitt bröd, socker, siktade spannmål och andra " +
              "ultraprocessade kolhydratkällor. Fullkorn, baljväxter och grönsaker märks " +
              "aldrig med den, hur kolhydratrika de än är."
          }
        ]
      },
      {
        heading: "Why processing, not content",
        sv: "Varför processning, inte innehåll",
        blocks: [
          {
            type: "p",
            text: "A gram-per-100g cutoff can't tell refined and unrefined foods apart — a " +
              "lentil and a slice of white bread can have similar carbohydrate counts, " +
              "but behave very differently in the body. Tagging by food type instead " +
              "keeps the trait meaningful.",
            sv: "En gräns i gram per 100 g kan inte skilja raffinerade och oraffinerade " +
              "livsmedel åt — en lins och en skiva vitt bröd kan ha liknande " +
              "kolhydratinnehåll men beter sig mycket olika i kroppen. Att märka efter " +
              "livsmedelstyp i stället håller egenskapen meningsfull."
          }
        ]
      },
      {
        heading: null,
        blocks: [
          {
            type: "note",
            text: "This is a categorical judgment call, not a lab measurement — see the About " +
              "page for the reasoning behind it. The evidence linking refined and " +
              "ultra-processed foods to gut symptoms sits at the level of the whole diet " +
              "rather than any single food, which is why this trait is more useful as a " +
              "pattern across a selection than as a verdict on one item.",
            sv: "Det här är en kategorisk bedömning, inte en labbmätning — se Om-sidan för " +
              "resonemanget bakom. Evidensen som kopplar raffinerad och ultraprocessad " +
              "mat till magsymtom ligger på hela kostens nivå snarare än på något enskilt " +
              "livsmedel, vilket är varför den här egenskapen är mer användbar som ett " +
              "mönster över ett urval än som en dom över en enskild post."
          }
        ]
      }
    ]
  },

  allergen: {
    title: "Allergens",
    sv: "Allergener",
    sections: [
      {
        heading: "The 14 declarable allergens",
        sv: "De 14 deklarationspliktiga allergenerna",
        blocks: [
          {
            type: "p",
            text: "EU law requires 14 allergens to be declared on a label, however small the " +
              "amount: cereals containing gluten (wheat, rye, barley, oats, spelt, " +
              "kamut), milk, egg, fish, crustaceans, molluscs, peanut, tree nut, soy, " +
              "sesame, celery, mustard, lupin, and sulphites above 10 mg/kg. These cause " +
              "the large majority of true, IgE-mediated food allergies — distinct from " +
              "the dose-dependent intolerances tracked elsewhere on this site.",
            sv: "EU-lagstiftningen kräver att 14 allergener deklareras på förpackningen, " +
              "hur liten mängden än är: spannmål som innehåller gluten (vete, råg, korn, " +
              "havre, spelt, kamut), mjölk, ägg, fisk, kräftdjur, blötdjur, jordnöt, nöt, " +
              "soja, sesam, selleri, senap, lupin, och sulfiter över 10 mg/kg. De orsakar " +
              "den stora majoriteten av verkliga, IgE-medierade matallergier — till " +
              "skillnad från de dosberoende intoleranser som följs på andra ställen på " +
              "den här sidan."
          },
          {
            type: "p",
            text: "Thirteen of them are tracked here. Lupin is the one left out: it is " +
              "declarable across the EU, but it barely reaches a Swedish plate, and the " +
              "food list is Swedish first.",
            sv: "Tretton av dem följs här. Lupin är den som utelämnats: den är " +
              "deklarationspliktig i hela EU, men den når knappt en svensk tallrik, och " +
              "livsmedelslistan är svensk först."
          },
          {
            type: "p",
            text: "Two more are tracked here that no label has to mention: onion and garlic, " +
              "and mushroom. Neither is declarable anywhere, so nobody with one of these " +
              "allergies gets any warning — and both come up often enough in practice to " +
              "be worth ruling in or out.",
            sv: "Två till följs här som ingen märkning måste nämna: lök och vitlök, samt " +
              "svamp. Ingen av dem är deklarationspliktig någonstans, så ingen med någon " +
              "av dessa allergier får någon varning — och båda dyker upp tillräckligt " +
              "ofta i praktiken för att vara värda att bekräfta eller utesluta."
          },
          {
            type: "p",
            text: "Sulphites are the odd one out, and are tracked under Other Digestive " +
              "Factors rather than as an allergen. They are a preservative rather than a " +
              "protein, so the reaction is not immune-mediated at all; the best " +
              "documented effect is bronchoconstriction in people with asthma. Wine, " +
              "light-coloured dried fruit and some pickled products are the usual " +
              "sources.",
            sv: "Sulfiter är udda i sammanhanget och följs under Övriga " +
              "matsmältningsfaktorer snarare än som ett allergen. De är ett " +
              "konserveringsmedel snarare än ett protein, så reaktionen är inte " +
              "immunmedierad alls; den bäst dokumenterade effekten är bronkkonstriktion " +
              "hos personer med astma. Vin, ljus torkad frukt och vissa inlagda produkter " +
              "är de vanliga källorna."
          }
        ]
      },
      {
        heading: "Key distinctions",
        sv: "Viktiga skillnader",
        blocks: [
          {
            type: "list",
            items: [
              "Milk allergy (casein/whey) is not the same as lactose intolerance (an " +
                "enzyme issue, not immune).",
              "Egg allergy is mainly driven by egg-white proteins; the yolk is less " +
                "allergenic but not necessarily safe.",
              "Wheat allergy, celiac disease, and non-celiac gluten sensitivity are " +
                "three distinct conditions.",
              "Fish (parvalbumin) and shellfish (tropomyosin) are different allergens — " +
                "one doesn't predict the other.",
              "Crustaceans and molluscs are declared separately: the tropomyosins " +
                "differ enough that one group is often tolerated when the other isn't.",
              "Peanut is a legume; peanut allergy doesn't reliably predict tree nut " +
                "allergy.",
              "Sesame can cause severe reactions and hides easily — in tahini, in " +
                "hummus, in bread toppings.",
              "Celery reactions often run through birch pollen, and unlike most birch " +
                "cross-reactions, celery can still react when cooked.",
              "Onion and garlic allergy is easily confused with the fructan intolerance " +
                "the same foods cause — the first is immediate and oral, the second " +
                "delayed and abdominal.",
            ],
            sv: [
              "Mjölkallergi (kasein/vassle) är inte samma sak som laktosintolerans (ett " +
                "enzymproblem, inte immunologiskt).",
              "Äggallergi drivs främst av äggviteproteiner; gulan är mindre allergen " +
                "men inte nödvändigtvis säker.",
              "Veteallergi, celiaki och icke-celiakisk glutenkänslighet är tre skilda " +
                "tillstånd.",
              "Fisk (parvalbumin) och skaldjur (tropomyosin) är olika allergener — det " +
                "ena förutsäger inte det andra.",
              "Kräftdjur och blötdjur deklareras separat: tropomyosinerna skiljer sig " +
                "tillräckligt för att den ena gruppen ofta tolereras när den andra inte " +
                "gör det.",
              "Jordnöt är en baljväxt; jordnötsallergi förutsäger inte tillförlitligt " +
                "nötallergi.",
              "Sesam kan ge svåra reaktioner och göms lätt — i tahini, i hummus, i " +
                "brödtoppingar.",
              "Sellerireaktioner går ofta via björkpollen, och till skillnad från de " +
                "flesta björkkorsreaktioner kan selleri reagera även tillagad.",
              "Lök- och vitlöksallergi förväxlas lätt med den fruktanintolerans samma " +
                "livsmedel ger — den första är omedelbar och oral, den andra fördröjd och " +
                "i buken.",
            ]
          }
        ]
      },
      {
        heading: "Sensitization and reaction severity",
        sv: "Sensibilisering och reaktionens svårighetsgrad",
        blocks: [
          {
            type: "p",
            text: "The first exposure to an allergen often causes no reaction — it primes the " +
              "immune system to produce antibodies. Later exposures can trigger much " +
              "stronger reactions as antibody levels rise, which is why an allergy can " +
              "appear \"suddenly\" even to a food eaten safely before.",
            sv: "Den första exponeringen för ett allergen ger ofta ingen reaktion — den " +
              "primar immunförsvaret att bilda antikroppar. Senare exponeringar kan " +
              "utlösa mycket starkare reaktioner när antikroppsnivåerna stiger, vilket är " +
              "varför en allergi kan uppträda \"plötsligt\" även mot ett livsmedel som " +
              "tidigare ätits utan problem."
          }
        ]
      },
      {
        heading: "Tolerance",
        sv: "Tolerans",
        blocks: [
          {
            type: "p",
            text: "Tolerance means the immune system learns to accept a food antigen without " +
              "reacting — it's the default state for most food proteins in most people. " +
              "Many childhood allergies (milk, egg, wheat, soy) are outgrown as tolerance " +
              "develops with age and continued exposure; others (peanut, tree nut, " +
              "shellfish, fish) are more likely to persist for life.",
            sv: "Tolerans betyder att immunförsvaret lär sig acceptera ett " +
              "livsmedelsantigen utan att reagera — det är normaltillståndet för de " +
              "flesta livsmedelsproteiner hos de flesta. Många barnallergier (mjölk, ägg, " +
              "vete, soja) växer bort när toleransen utvecklas med ålder och fortsatt " +
              "exponering; andra (jordnöt, nöt, skaldjur, fisk) är mer benägna att bestå " +
              "livet ut."
          },
          {
            type: "p",
            text: "Oral immunotherapy is an emerging approach that tries to build tolerance " +
              "deliberately under medical supervision — not something to attempt " +
              "unsupervised.",
            sv: "Oral immunterapi är en framväxande metod som försöker bygga tolerans " +
              "avsiktligt under medicinsk övervakning — inget att försöka sig på på egen " +
              "hand."
          }
        ]
      },
      {
        heading: "Mushroom, mould and yeast",
        sv: "Svamp, mögel och jäst",
        blocks: [
          {
            type: "p",
            text: "Mushroom is one of the two allergens tracked here that no label has to " +
              "declare. It is worth setting out what is actually known, because \"mould " +
              "allergy\" is one of the most frequently self-diagnosed food problems and " +
              "one of the most frequently misattributed.",
            sv: "Svamp är ett av de två allergen som följs här som ingen märkning måste " +
              "deklarera. Det är värt att redogöra för vad som faktiskt är känt, eftersom " +
              "\"mögelallergi\" är ett av de oftast självdiagnostiserade matproblemen och " +
              "ett av de oftast feltillskrivna."
          },
          {
            type: "p",
            text: "Allergy to airborne mould spores — Alternaria, Cladosporium, Aspergillus, " +
              "Penicillium — is real and well documented, affecting a few per cent of the " +
              "population. Alternaria sensitisation is among the strongest single risk " +
              "factors known for severe asthma. But that is an airway allergy to inhaled " +
              "spores. It says very little about food.",
            sv: "Allergi mot luftburna mögelsporer — Alternaria, Cladosporium, Aspergillus, " +
              "Penicillium — är verklig och väldokumenterad och drabbar några procent av " +
              "befolkningen. Alternaria-sensibilisering är bland de starkaste enskilda " +
              "kända riskfaktorerna för svår astma. Men det är en luftvägsallergi mot " +
              "inandade sporer. Den säger mycket lite om mat."
          },
          {
            type: "p",
            text: "Reactions to eating mould are far thinner. There are case reports of " +
              "people sensitised to airborne moulds reacting to blue cheese, to " +
              "mycoprotein or to yeast, and shared fungal proteins are the plausible " +
              "explanation. What there is not is a dependable pattern: unlike birch " +
              "pollen and apple, where the cross-reaction can be anticipated, an inhalant " +
              "mould allergy does not predict a food reaction.",
            sv: "Reaktioner på att äta mögel är långt tunnare belagda. Det finns " +
              "fallrapporter om personer sensibiliserade mot luftburna mögelsvampar som " +
              "reagerat på ädelost, på mykoprotein eller på jäst, och gemensamma " +
              "svampproteiner är den rimliga förklaringen. Vad som inte finns är ett " +
              "pålitligt mönster: till skillnad från björkpollen och äpple, där " +
              "korsreaktionen går att förutse, förutsäger en inhalationsmögelallergi inte " +
              "en matreaktion."
          },
          {
            type: "p",
            text: "Blue cheese is the usual suspect and the weakest case. Roquefort and " +
              "camembert do contain living Penicillium, but the ripening that makes them " +
              "what they are also breaks the fungal proteins apart, and controlled " +
              "challenges have largely come back negative. Aged cheese is among the " +
              "highest-histamine foods there is, and histamine explains most of these " +
              "reactions better than mould does.",
            sv: "Ädelost är den vanliga misstänkta och det svagaste fallet. Roquefort och " +
              "camembert innehåller visserligen levande Penicillium, men den mognad som " +
              "gör dem till vad de är bryter också isär svampproteinerna, och " +
              "kontrollerade provokationer har till stor del utfallit negativt. Lagrad " +
              "ost är bland de mest histaminrika livsmedel som finns, och histamin " +
              "förklarar de flesta av dessa reaktioner bättre än mögel gör."
          },
          {
            type: "p",
            text: "Mycoprotein is the real exception. Quorn is made from a living fungus, its " +
              "protein reaches the plate intact, and reactions — including severe ones — " +
              "have been confirmed by challenge in people with no other food allergy. " +
              "That is why mycoprotein carries the mushroom tag here alongside actual " +
              "mushrooms.",
            sv: "Mykoprotein är det verkliga undantaget. Quorn tillverkas av en levande " +
              "svamp, dess protein når tallriken intakt, och reaktioner — inklusive svåra " +
              "— har bekräftats genom provokation hos personer utan annan matallergi. Det " +
              "är därför mykoprotein bär svamptaggen här vid sidan av faktisk svamp."
          },
          {
            type: "p",
            text: "Mould toxins are a separate subject that gets folded into this one. " +
              "Aflatoxin and the other mycotoxins are a question of dose and long-term " +
              "exposure, handled by food safety limits. They are not an immune reaction, " +
              "and avoiding them has nothing to do with allergy.",
            sv: "Mögeltoxiner är ett separat ämne som vävs in i det här. Aflatoxin och de " +
              "övriga mykotoxinerna är en fråga om dos och långtidsexponering, hanterad " +
              "av livsmedelssäkerhetsgränser. De är ingen immunreaktion, och att undvika " +
              "dem har inget med allergi att göra."
          },
          {
            type: "note",
            text: "In practice, a reported reaction to \"mould\" in food turns out most often " +
              "to be one of three other things: an airway allergy the person has " +
              "connected to meals, a histamine reaction to aged or fermented food, or a " +
              "yeast sensitivity — which rests on no better evidence than mould does. " +
              "Working out which one it is changes what helps.",
            sv: "I praktiken visar sig en rapporterad reaktion på \"mögel\" i mat oftast vara " +
              "någon av tre andra saker: en luftvägsallergi som personen kopplat till " +
              "måltider, en histaminreaktion på lagrad eller fermenterad mat, eller en " +
              "jästkänslighet — som vilar på inte bättre evidens än mögel gör. Att lista " +
              "ut vilken av dem det är ändrar vad som hjälper."
          }
        ]
      },
      {
        heading: null,
        blocks: [
          {
            type: "note",
            text: "Long-term unnecessary avoidance of a food can reduce tolerance over time, " +
              "making a reaction more likely if the food is reintroduced later — this " +
              "applies to true allergies, but similar patterns are seen with IBS and " +
              "lactose intolerance too, even though the underlying mechanisms differ. " +
              "Reintroduction is best guided by a professional rather than done alone " +
              "after a long avoidance period.",
            sv: "Långvarigt onödigt undvikande av ett livsmedel kan minska toleransen över " +
              "tid och göra en reaktion mer sannolik om livsmedlet återinförs senare — " +
              "det gäller verkliga allergier, men liknande mönster ses även vid IBS och " +
              "laktosintolerans, trots att de underliggande mekanismerna skiljer sig. " +
              "Återintroduktion görs bäst under vägledning av en professionell snarare än " +
              "på egen hand efter en lång undvikandeperiod."
          },
          {
            type: "note",
            text: "If a true allergy is suspected, refer for formal allergy testing rather " +
              "than relying on this tool.",
            sv: "Om en verklig allergi misstänks, remittera för formell allergiutredning i " +
              "stället för att förlita dig på det här verktyget."
          }
        ]
      }
    ]
  },

  cross_reactive: {
    title: "Pollen-Food Cross-Reactivity",
    sv: "Pollen-matkorsreaktivitet",
    sections: [
      {
        heading: "What is OAS?",
        sv: "Vad är OAS?",
        blocks: [
          {
            type: "p",
            text: "Oral allergy syndrome (OAS) occurs when foods contain proteins " +
              "structurally similar to pollen allergens, causing mild tingling or itching " +
              "in the mouth in people already allergic to that pollen. Most of these " +
              "proteins are heat-labile, so symptoms often resolve once the food is " +
              "cooked — but some (like certain lipid transfer proteins) are heat-stable " +
              "and can still trigger reactions, occasionally more severe ones, even when " +
              "cooked.",
            sv: "Oralt allergisyndrom (OAS) uppstår när livsmedel innehåller proteiner som " +
              "strukturellt liknar pollenallergener, vilket ger lätt stickning eller " +
              "klåda i munnen hos personer som redan är allergiska mot det pollenet. De " +
              "flesta av dessa proteiner är värmelabila, så symtomen försvinner ofta när " +
              "maten tillagats — men vissa (som vissa lipidtransportproteiner) är " +
              "värmestabila och kan fortfarande utlösa reaktioner, ibland svårare, även " +
              "tillagade."
          }
        ]
      },
      {
        heading: "The four pollen groups",
        sv: "De fyra pollengrupperna",
        blocks: [
          {
            type: "list",
            items: [
              "**Birch (PR-10 protein family):** apples, stone fruits, carrots, " +
                "celery/celeriac, hazelnuts, soy",
              "**Mugwort (Art v 1, Art v 3):** celery, carrot, parsley, fennel and the " +
                "umbellifer spices — cumin, dill, pepper, paprika, mustard, ginger — plus " +
                "the plants in mugwort's own family: chamomile, sunflower seed, lettuce, " +
                "artichoke",
              "**Grass:** melon, watermelon, tomato, orange, peanut, potato — the least " +
                "settled of the four: the proteins involved are more varied and the food " +
                "list less consistent than for birch",
              "**Latex (chitinases):** banana, avocado, kiwi, papaya",
            ],
            sv: [
              "**Björk (PR-10-proteinfamiljen):** äpplen, stenfrukter, morötter, " +
                "selleri/rotselleri, hasselnötter, soja",
              "**Gråbo (Art v 1, Art v 3):** selleri, morot, persilja, fänkål och " +
                "flockblomstriga kryddor — spiskummin, dill, peppar, paprika, senap, " +
                "ingefära — plus växterna i gråbons egen familj: kamomill, solrosfrö, " +
                "sallad, kronärtskocka",
              "**Gräs:** melon, vattenmelon, tomat, apelsin, jordnöt, potatis — den " +
                "minst fastlagda av de fyra: de inblandade proteinerna är mer varierade " +
                "och livsmedelslistan mindre konsekvent än för björk",
              "**Latex (kitinaser):** banan, avokado, kiwi, papaya",
            ]
          },
          {
            type: "p",
            text: "Mugwort is the one most often missed in Scandinavia. It flowers late, so " +
              "reactions get blamed on the tail of the grass season, and the foods it " +
              "involves are spices — a teaspoon in a dressing is enough, and nothing on a " +
              "menu names it. The pattern is known as celery-mugwort-spice syndrome, and " +
              "unlike most birch reactions, celery can still react when cooked.",
            sv: "Gråbo är den som oftast missas i Skandinavien. Den blommar sent, så " +
              "reaktioner skylls på slutet av gräsäsongen, och de livsmedel den rör är " +
              "kryddor — en tesked i en dressing räcker, och ingen meny nämner det. " +
              "Mönstret kallas selleri-gråbo-krydda-syndrom, och till skillnad från de " +
              "flesta björkreaktioner kan selleri reagera även tillagad."
          }
        ]
      },
      {
        heading: "Diagnosis",
        sv: "Diagnostik",
        blocks: [
          {
            type: "p",
            text: "OAS is typically diagnosed based on the pattern of symptoms (reaction " +
              "limited to the mouth/throat, tied to specific fresh foods) plus a known " +
              "pollen allergy, sometimes confirmed with skin prick testing against fresh " +
              "food extracts rather than standard commercial extracts, which can miss " +
              "these heat-labile proteins.",
            sv: "OAS diagnostiseras typiskt utifrån symtommönstret (reaktion begränsad till " +
              "mun och svalg, kopplad till specifika färska livsmedel) plus en känd " +
              "pollenallergi, ibland bekräftad med pricktest mot färska livsmedelsextrakt " +
              "snarare än standardiserade kommersiella extrakt, som kan missa dessa " +
              "värmelabila proteiner."
          }
        ]
      },
      {
        heading: null,
        blocks: [
          {
            type: "note",
            text: "Reactions are usually mild and confined to the mouth and throat, but " +
              "heat-stable proteins can occasionally cause more systemic symptoms — " +
              "anyone with severe or spreading reactions should be assessed by an " +
              "allergist rather than relying on food avoidance alone.",
            sv: "Reaktionerna är vanligtvis milda och begränsade till mun och svalg, men " +
              "värmestabila proteiner kan ibland ge mer systemiska symtom — den som har " +
              "svåra eller spridande reaktioner bör bedömas av en allergolog snarare än " +
              "att förlita sig på undvikande av livsmedel ensamt."
          }
        ]
      }
    ]
  },

  alpha_gal: {
    title: "Alpha-Gal Syndrome",
    sv: "Alfa-gal-syndrom",
    sections: [
      {
        heading: "What is alpha-gal syndrome?",
        sv: "Vad är alfa-gal-syndrom?",
        blocks: [
          {
            type: "p",
            text: "Alpha-gal syndrome (AGS) is a delayed allergic reaction to " +
              "galactose-alpha-1,3-galactose, a sugar molecule found in the meat of " +
              "mammals. Unlike most food allergies, it's not triggered by a protein, and " +
              "the sensitization doesn't come from food at all — it starts with a tick " +
              "bite.",
            sv: "Alfa-gal-syndrom (AGS) är en fördröjd allergisk reaktion mot " +
              "galaktos-alfa-1,3-galaktos, en sockermolekyl som finns i kött från " +
              "däggdjur. Till skillnad från de flesta matallergier utlöses den inte av " +
              "ett protein, och sensibiliseringen kommer inte från mat alls — den börjar " +
              "med ett fästingbett."
          }
        ]
      },
      {
        heading: "The tick-bite mechanism",
        sv: "Fästingbettsmekanismen",
        blocks: [
          {
            type: "p",
            text: "Certain tick species carry alpha-gal in their saliva. A bite can sensitize " +
              "the immune system to this molecule, and afterward, eating mammalian meat " +
              "can trigger an allergic reaction. The Lone Star tick is the most " +
              "documented cause, but other species — including some found in Scandinavia " +
              "and Europe — have also been implicated.",
            sv: "Vissa fästingarter bär alfa-gal i sin saliv. Ett bett kan sensibilisera " +
              "immunförsvaret mot molekylen, och därefter kan det utlösa en allergisk " +
              "reaktion att äta däggdjurskött. Lone star-fästingen är den bäst " +
              "dokumenterade orsaken, men andra arter — inklusive några som finns i " +
              "Skandinavien och Europa — har också pekats ut."
          }
        ]
      },
      {
        heading: "Why it's easy to miss",
        sv: "Varför den är lätt att missa",
        blocks: [
          {
            type: "p",
            text: "Reactions typically appear 3 to 8 hours after eating, not within minutes " +
              "like most food allergies. This delay makes the food connection easy to " +
              "overlook — someone might eat dinner, then wake up in the middle of the " +
              "night with hives, GI symptoms, or anaphylaxis, with no obvious trigger in " +
              "sight.",
            sv: "Reaktioner uppträder typiskt 3 till 8 timmar efter måltiden, inte inom " +
              "minuter som de flesta matallergier. Fördröjningen gör kopplingen till " +
              "maten lätt att förbise — någon kan äta middag och sedan vakna mitt i " +
              "natten med nässelutslag, magsymtom eller anafylaxi, utan någon uppenbar " +
              "utlösare i sikte."
          }
        ]
      },
      {
        heading: "Which foods are affected",
        sv: "Vilka livsmedel som berörs",
        blocks: [
          {
            type: "p",
            text: "Beef, pork, lamb, and other mammalian meat and meat products (sausages, " +
              "cured meats, minced meat) can trigger reactions. Poultry and fish are not " +
              "affected, since alpha-gal is specific to mammals. Dairy is a gray area — " +
              "some people with AGS react to dairy fat, but many don't; this isn't tagged " +
              "in the tool, but worth asking about individually.",
            sv: "Nötkött, fläsk, lamm och annat däggdjurskött och köttprodukter (korv, " +
              "charkuterier, köttfärs) kan utlösa reaktioner. Fågel och fisk berörs inte, " +
              "eftersom alfa-gal är specifikt för däggdjur. Mejeriprodukter är en gråzon " +
              "— vissa med AGS reagerar på mjölkfett, men många gör det inte; det märks " +
              "inte i verktyget, men är värt att fråga om individuellt."
          }
        ]
      },
      {
        heading: "Diagnosis",
        sv: "Diagnostik",
        blocks: [
          {
            type: "p",
            text: "A specific alpha-gal IgE blood test can confirm the diagnosis. Given the " +
              "delayed and inconsistent symptom pattern, AGS is worth considering in " +
              "unexplained nighttime allergic reactions or GI symptoms, especially in " +
              "people with a known tick bite history.",
            sv: "Ett specifikt blodprov på alfa-gal-IgE kan bekräfta diagnosen. Med tanke " +
              "på det fördröjda och inkonsekventa symtommönstret är AGS värt att överväga " +
              "vid oförklarade nattliga allergiska reaktioner eller magsymtom, särskilt " +
              "hos personer med känd fästingbettshistorik."
          }
        ]
      }
    ]
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
