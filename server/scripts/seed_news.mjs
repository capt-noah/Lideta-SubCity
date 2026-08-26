/**
 * seed_news.mjs
 * Inserts 10 realistic news articles about Lideta Sub-City into the database.
 * Uses the same DB pool the server routes use — no auth token needed.
 * Run: node server/scripts/seed_news.mjs
 */

import pool from '../con/db.js'

// ─── Real Unsplash images (free to use, relevant subjects) ──────────────────
// Each photo object matches the shape the news table expects: { path, name }
const PHOTOS = [
  { path: 'https://images.unsplash.com/photo-1594708767771-a5a7c6e02acb?w=1200&q=80', name: 'infrastructure.jpg' },
  { path: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=1200&q=80', name: 'health.jpg'          },
  { path: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&q=80', name: 'education.jpg'       },
  { path: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80', name: 'meeting.jpg'         },
  { path: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80', name: 'environment.jpg'     },
  { path: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1200&q=80', name: 'community.jpg'       },
  { path: 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=1200&q=80', name: 'road.jpg'            },
  { path: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80', name: 'school.jpg'          },
  { path: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80', name: 'clinic.jpg'          },
  { path: 'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?w=1200&q=80', name: 'urban.jpg'           },
]

// ─── 10 news articles ────────────────────────────────────────────────────────
const NEWS = [

  // 1
  {
    title:            'Lideta Sub-City Launches Major Road Infrastructure Upgrade',
    short_description:'Lideta Sub-City Administration has officially launched a comprehensive road rehabilitation project covering 12 key corridors across the sub-city.',
    description:      `Lideta Sub-City Administration has officially launched a comprehensive road rehabilitation project covering 12 key corridors across the sub-city. The project, funded through a joint initiative between the Addis Ababa City Administration and local government budget, aims to address long-standing transportation challenges and improve daily commutes for over 300,000 residents.

The rehabilitation program includes road widening, installation of modern drainage systems, pedestrian walkways, and street lighting upgrades. Construction crews have already begun work on the first phase, targeting the busiest arterial roads that connect residential neighborhoods to commercial zones.

Sub-City Administrator emphasized that this project is a milestone in the administration's five-year development plan. "We are committed to delivering world-class infrastructure that reflects the aspirations of our residents," she stated during the project launch ceremony.

The entire project is expected to be completed within 18 months, with phase one set for delivery in the next six months. Residents are encouraged to follow traffic management advisories during the construction period.`,
    category:         'Infrastructure',
    photo:            PHOTOS[0],
    amh: {
      title:             'ልደታ ክፍለ ከተማ ዋና የመንገድ መሠረተ ልማት ማሻሻያ ሥራ ጀምሯል',
      short_description: 'ልደታ ክፍለ ከተማ አስተዳደር 12 ቁልፍ ኮሪደሮችን ያካተተ ሁሉን አቀፍ የመንገድ ማሻሻያ ፕሮጀክት በይፋ ጀምሯል።',
      description:       `ልደታ ክፍለ ከተማ አስተዳደር 12 ቁልፍ ኮሪደሮችን ያካተተ ሁሉን አቀፍ የመንገድ ማሻሻያ ፕሮጀክት በይፋ ጀምሯል። ፕሮጀክቱ በአዲስ አበባ ከተማ አስተዳደርና በአካባቢ መንግሥት በጀት ጋር በጋር ፍሬ ባሰኘ ተነሳሽነት ፍሬ ባሰኘ ሲሆን ከ300,000 በላይ ለሚሆኑ ነዋሪዎች ረጅም ጊዜ ሲዘልቁ የቆዩ የትራንስፖርት ችግሮችን ለመፍታት ያለመ ነው።

ፕሮጀክቱ የሚያካትተው፡ መንገድ ማስፋፋት፣ ዘመናዊ የፍሳሽ ዝርጋታ ማስቀመጥ፣ የእግረኛ መንገዶችና የጎዳና ብርሃን ማሻሻያ ነው። ግንባታ ቡድኖች ቀደም ሲሎ የኑሮ ሕዝቡ ወደ ንግድ አካባቢ የሚያገናኙ ትስስር ዋና ዋና ጎዳናዎችን ኢላማ ያደረጉ የመጀመሪያ ደረጃ ሥራ ጀምረዋል።

ክፍለ ከተማ አስተዳዳሪዋ ይህ ፕሮጀክት ለአምስት ዓመት የልማት ዕቅዱ ሩቅ ርምጃ እንደሆነ አጽዕኖት ሰጥተዋል። "ለነዋሪዎቻችን ምኞት የሚያሟላ ዓለማቀፍ ደረጃ ያለው መሠረተ ልማት ለማቅረብ ቁርጠኛ ነን" ሲሉ በፕሮጀክቱ ምረቃ ሥነ ሥርዓት ተናግረዋል።`,
      category:          'መሠረተ ልማት',
    },
    orm: {
      title:             'Bulchiinsa Kutaa Magaalaa Lideta Hojii Fooyya\'insaa Daandii Gurguddaa Jalqabe',
      short_description: 'Bulchiinsi Kutaa Magaalaa Lideta pirojektii fooyya\'insaa daandii bal\'aa koriidaroota 12 hammate ifa baase.',
      description:       `Bulchiinsi Kutaa Magaalaa Lideta pirojektii fooyya\'insaa daandii bal\'aa koriidaroota gurguddaa 12 hammate ifa baase. Pirojektiin kun maallaqa bulchiinsa magaalaa Finfinnee fi bajata mootummaa naannoo irraa walitti qabameen kan deeggaramu yoo ta\'u, rakkoo geejjibaa waggaa dheeraa ture jiraattoota 300,000 ol qaban furuu kaayyoo godhatee jira.

Pirojektiin kun babal\'ina daandii, sirna dhangala\'aa ammayyaa, karaa miilaa fi guddina ifa daandii ni hammata. Gareen ijaarsaa duraan karaalee ijoo naannolee jireenyaa fi naannolee daldalaa walqunnamsiisan irratti xiyyeeffate hojii jalqabee jira.

Bulchaan Kutaa Magaalaa pirojektiin kun karoora guddinaa waggaa shan keessatti milkaa\'ina hangafa ta\'uu isaa caqabeera. "Hawwii jiraattoota keenya guuttuu argisiisu sirna bu\'uraa sadarkaa addunyaa kenninee itti cichaa jirra" jechuun sirna eebba pirojektii irratti dubbataniiru.`,
      category:          'Bu\'uura',
    },
  },

  // 2
  {
    title:            'Free Health Screening Campaign Reaches 15,000 Residents',
    short_description:'The Lideta Sub-City Health Office completed a three-week free health screening campaign providing services to over 15,000 residents across 8 health centers.',
    description:      `The Lideta Sub-City Health Office has successfully completed a three-week free health screening campaign, providing essential health services to over 15,000 residents across 8 community health centers throughout the sub-city.

The campaign, held in partnership with Addis Ababa Health Bureau and several NGO partners, offered screenings for diabetes, hypertension, tuberculosis, and maternal health. Mobile units were deployed to underserved neighborhoods to ensure no resident was left without access to care.

Health Office Director reported that over 2,300 residents were referred for follow-up treatment, and 450 previously undiagnosed cases of hypertension were identified. "Early detection saves lives," the director said. "This campaign is part of our commitment to preventive healthcare."

The sub-city administration has announced that similar campaigns will be held quarterly. Residents who could not attend are encouraged to visit their nearest health center for free consultations during the next campaign period.`,
    category:         'Health',
    photo:            PHOTOS[1],
    amh: {
      title:             'የነፃ ጤና ምርመራ ዘመቻ ከ15,000 በላይ ነዋሪዎችን ተደርሶ',
      short_description: 'ልደታ ክፍለ ከተማ የጤና ጽ/ቤት ሦስት ሳምንት የሚቆይ የነፃ ጤና ምርመራ ዘመቻ ጨርሷል፤ ከ15,000 በላይ ነዋሪዎችን አገልግሏል።',
      description:       `ልደታ ክፍለ ከተማ የጤና ጽ/ቤት ሦስት ሳምንት የሚቆይ የነፃ ጤና ምርመራ ዘመቻ ስኬታማ ሆኖ ጨርሷል፤ ከ15,000 በላይ ነዋሪዎችን በ8 የጤና ጣቢያዎች ተደርሷቸዋል።

ዘመቻው በአዲስ አበባ ጤና ቢሮ እና በርካታ NGO አጋሮች ጋር ትብብር ሲካሄድ የስኳር ህመም፣ ደም ግፊት፣ ሳንባ ነቀርሳ እና የእናቶች ጤና ምርመራ ሰጥቷል። ለአገልግሎት ተደራሽ ላልሆኑ ሰፈሮች ሞባይል ዩኒቶች ተሰማርተዋል።

የጤና ጽ/ቤቱ ዳሬክተር ከ2,300 በላይ ነዋሪዎች ወደ ክትትል ሕክምና ተላልፈዋል፣ ቀደም ሲሎ ያልታወቀ 450 የደም ግፊት ህሙማን ተለይተዋል ብለዋል። "ቀደም ያለ ምርመራ ሕይወት ያድናል" ሲሉ ዳሬክተሩ ተናግረዋል።

ክፍለ ከተማ አስተዳደሩ ተመሳሳይ ዘመቻዎች በሩብ ዓመት ይካሄዳሉ ብሏል።`,
      category:          'ጤና',
    },
    orm: {
      title:             'Kaadhimamni Qorannoo Fayyaa Bilisaa Jiraattota 15,000 Ol Ga\'e',
      short_description: 'Waajjirri Fayyaa Kutaa Magaalaa Lideta wiirtuu fayyaa 8 keessatti jiraattoota 15,000 ol tajaajile.',
      description:       `Waajjirri Fayyaa Kutaa Magaalaa Lideta kaadhimama qorannoo fayyaa bilisaa torban sadii ture milkaa\'inaan xumure. Wiirtuu fayyaa hawaasaa 8 kutaa magaalaa keessatti jiraattoota 15,000 ol tajaajileera.

Kaadhimamni kun Biiroo Fayyaa Finfinnee fi dhaabbilee NGO hedduudhaan gamtaadhaan gaggeeffame yoo ta\'u, qorannoo dhibee sookoraa, dhiibbaa dhiigaa, TB fi fayyaa haadholii ni hammate. Mooraa tajaajila argatuuf rakkatan qunnamuuf yuuniitii moobayilaa bobbaafameera.

Dareektarri Waajjira Fayyaa jiraattoota 2,300 ol wal\'aansa ittaansuuf ergaman, dhibee dhiibbaa dhiigaa hin beekkamne dura 450 adda bahan gabaaseera.`,
      category:          'Fayyaa',
    },
  },

  // 3
  {
    title:            'New Primary Schools Open in Three Neighborhoods',
    short_description:'Three new fully equipped primary schools have been inaugurated across Lideta Sub-City, adding 2,400 new student seats to ease classroom overcrowding.',
    description:      `Three brand-new, fully equipped primary schools have been officially inaugurated across Lideta Sub-City, adding 2,400 new student seats and significantly easing the chronic classroom overcrowding that has affected educational quality for years.

Each school features modern classrooms, a computer laboratory, a library, sanitation facilities, and a dedicated sports ground. The construction was financed through the city's education fund supplemented by community contributions and private sector partnerships.

The Addis Ababa Education Bureau commended Lideta Sub-City Administration for prioritizing education. The bureau noted that the student-to-classroom ratio in the sub-city has improved from 65:1 to 45:1 following the new openings.

Parents and community leaders attended the inauguration ceremony and praised the administration for delivering the schools on schedule. Student enrollment for the next academic year is now open, with priority given to students from the surrounding neighborhoods.`,
    category:         'Education',
    photo:            PHOTOS[2],
    amh: {
      title:             'ሦስት አዳዲስ መጀመሪያ ደረጃ ትምህርት ቤቶች ተከፈቱ',
      short_description: 'ሦስት አዲስ ሙሉ ዝግጅት ያላቸው የመጀመሪያ ደረጃ ትምህርት ቤቶች ተምሮ 2,400 አዲስ ተማሪ ስፍራዎች ጨምረዋል።',
      description:       `ሦስት አዲስ ሙሉ ዝግጅት ያላቸው የመጀመሪያ ደረጃ ትምህርት ቤቶች በልደታ ክፍለ ከተማ ተምሮ ምርቃ ሥሯ ተከናወነ። 2,400 አዲስ ተማሪ ስፍራዎችን ጨምሮ ለዓመታት የቀጠለ የክፍሎቹ ጠባቢነት ችግር ያቃልላሉ።

እያንዳንዱ ትምህርት ቤት ዘመናዊ ክፍሎች፣ የኮምፒውተር ላቦራቶሪ፣ ቤተ-መጻሕፍት፣ የሳኒቴሽን አገልግሎት እና ስፖርት ሜዳ ይዟል። ግንባታው በከተማ ትምህርት ፈንድ፣ የማህበረሰብ አስተዋፅዖ እና የግሉ ዘርፍ አጋርነት ተደጉሟል።

አዲስ አበባ ትምህርት ቢሮ ትምህርትን ቅድሚያ ለሰጠ ልደታ ክፍለ ከተማ አስተዳደርን አመስግኗል። ትምህርት ቤቶቹ ከተከፈቱ በኋላ ክፍለ ከተማው የተማሪ ወደ ክፍል ክፍሎቹ ጥምርታ ከ65፡1 ወደ 45፡1 ተሻሽሏል።`,
      category:          'ትምህርት',
    },
    orm: {
      title:             'Mana Barumsaa Sadarkaa Tokkoffaa Haaraa Sadii Baname',
      short_description: 'Mana barumsaa sadarkaa tokkoffaa haaraa guutuu qophaa\'e sadii banameera; teessoo barataa haaraa 2,400 dabaluun rakkoo kutaa cufaa ta\'u hir\'ise.',
      description:       `Mana barumsaa sadarkaa tokkoffaa haaraa guutuu qophaa\'e sadii kutaa magaalaa Lideta keessatti eebbifame. Teessoo barataa haaraa 2,400 dabaluun rakkoo xaxoo cufaa ta\'u waggaa dheeraa miidhaa barnootarratti gahe hir\'iseera.

Manni barumsaa hundi kutaa ammayyaa, laaboraatoorii kompiyuutaraa, kuusaa kitaabaa, tajaajila qulqullinaa fi dirree ispoortii ni qabaata. Ijaarsichi maallaqa barnootaa magaalaa, gumaacha hawaasaa fi hirmaannaa damee dhuunfaadhaan deeggarame.

Biiroon Barnootaa Finfinnee Bulchiinsa Kutaa Magaalaa Lideta barnootaaf dursa laate galateeffate. Kutaa magaalaa keessatti hir\'ina barattoota kutaadhaaf jiru 65:1 irraa 45:1 gahuu odeeffateera.`,
      category:          'Barnoota',
    },
  },

  // 4
  {
    title:            'Lideta Sub-City Hosts Inter-Kebele Community Dialogue Forum',
    short_description:'Over 500 community leaders, youth representatives, and residents gathered for a two-day inter-kebele dialogue forum focused on urban development priorities.',
    description:      `More than 500 community leaders, youth representatives, women's groups, and residents from across Lideta Sub-City gathered for a two-day inter-kebele community dialogue forum, focusing on urban development priorities and public service improvement.

The forum, organized by the Sub-City Administration's Community Affairs Office, featured panel discussions, working groups, and open floor sessions. Participants raised issues including waste management, traffic congestion, public park maintenance, and access to municipal services.

Among the key outcomes of the forum was an agreement to establish a permanent Community Advisory Council that will meet quarterly to provide feedback to the administration. The council will include representatives from all 10 kebeles within the sub-city.

"Governance is most effective when it is participatory," said the Sub-City Administrator. "This forum demonstrates that when we listen to our residents, we can build a more responsive administration." A formal report of the forum's recommendations will be published within 30 days.`,
    category:         'Events',
    photo:            PHOTOS[3],
    amh: {
      title:             'ልደታ ክፍለ ከተማ የቀበሌ ማህበረሰብ ምክክር መድረክ አዘጋጀ',
      short_description: 'ከ500 በላይ የማህበረሰብ መሪዎች፣ ወጣቶች ተወካዮችና ነዋሪዎች ለሁለት ቀን ምክክር መድረክ ተሳትፈዋል።',
      description:       `ከ500 በላይ የማህበረሰብ መሪዎች፣ የወጣቶች ተወካዮች፣ የሴቶች ቡድኖችና ከልደታ ክፍለ ከተማ ሁሉም አካባቢ የተውጣጡ ነዋሪዎች ለሁለት ቀን ምክክር መድረክ ተሰበሰቡ። ትኩረቱ የከተማ ልማት ቅድሚያዎችና የሕዝብ አገልግሎት ማሻሻያ ነበር።

ምክክሩ በክፍለ ከተማ አስተዳደር የማህበረሰብ ጉዳዮች ጽ/ቤት ሲዘጋጅ፣ ፓናል ውይይቶች፣ የሥራ ቡድኖችና ክፍት ወለል ስብሰባዎች ተካትተዋል። ተሳታፊዎች ቆሻሻ አወጋገድ፣ የትራፊክ ጎርፍ፣ የሕዝብ ፓርክ ጥበቃና ወደ ማዘጋጃ ቤት አገልግሎቶች ተደራሽነት ጉዳዮችን አንስተዋል።

ምክክሩ ዋና ፍሬ ናቸው ካሏቸው ጉዳዮች አንዱ በሩብ ዓመት ተሰብስቦ ለአስተዳደሩ ምላሽ የሚሰጥ ቋሚ የማህበረሰብ አማካሪ ምክር ቤት ማቋቋም ነው።`,
      category:          'ክንውኖች',
    },
    orm: {
      title:             'Kutaan Magaalaa Lideta Marii Hawaasaa Giddu-Galeessa Qabee Gaggeesse',
      short_description: 'Hoggantoota hawaasaa, bakka bu\'oota dargaggootaa fi jiraattoota 500 ol marii guyyaa lama irratti argaman.',
      description:       `Hoggantoota hawaasaa, garee dubartootaa fi jiraattoota kutaa magaalaa Lideta hundaa irraa dhufan 500 ol guyyaa lamaa mariif walitti qabaman. Xiyyeeffannaan guddinaa magaalaa fi fooyya\'ina tajaajila uummataa irratti ture.

Marii kun Waajjira Dhimma Hawaasaa Kutaa Magaalaa qopheesseen gaggeeffame, marii garee paanelii, garee hojii fi taa\'ichi barcuma banaa ni hammate. Hirmaattonni bulchiinsa fudhaataa, waliin-ga\'iinsa daandii, kunuunsa park uummataa fi tajaajila mootummaa dhaqqabuurratti gaaffii kaasan.

Bu\'aa mariichaa ijoo keessaa tokko Koree Gorsa Hawaasaa Yeroo Hunda jiraatu kan rubu\'aa waggaa barnoonni (quarter) tokkotti walitti qabamu hundeessuu waliigaluu ture.`,
      category:          'Taatee',
    },
  },

  // 5
  {
    title:            'Green Lideta: 50,000 Trees Planted in Sub-City Beautification Drive',
    short_description:'Lideta Sub-City launched its landmark "Green Lideta" initiative, mobilizing residents and volunteers to plant 50,000 trees across parks, streets, and schools.',
    description:      `Lideta Sub-City Administration launched its landmark "Green Lideta" environmental initiative, mobilizing over 3,000 residents, school students, and volunteers to plant 50,000 trees across parks, street medians, school compounds, and open green spaces throughout the sub-city in a single weekend.

The initiative is part of Addis Ababa's citywide green infrastructure program and aims to combat urban heat islands, improve air quality, and create more pleasant public spaces. Species selected include indigenous trees such as Warka (Ficus thonningii), Tidh (Juniperus procera), and various fruit-bearing trees that also benefit communities.

The Environment Office announced that follow-up maintenance teams will be assigned to each planting site for the next two years to ensure survival rates above 80%. A digital map of all planted sites will be made publicly available so residents can monitor progress.

"Every tree we plant today is a gift to future generations," said the Sub-City Environment Officer. Community members who participated received certificates of recognition from the sub-city administration.`,
    category:         'Environment',
    photo:            PHOTOS[4],
    amh: {
      title:             'አረንጓዴ ልደታ፡ 50,000 ዛፎች ተተክለው',
      short_description: 'ልደታ ክፍለ ከተማ "አረንጓዴ ልደታ" ቀጰ ሰርዟ ጀምሮ ነዋሪዎች እና በጎ ፈቃደኞች 50,000 ዛፎችን ተክለዋል።',
      description:       `ልደታ ክፍለ ከተማ አስተዳደር "አረንጓዴ ልደታ" ይሰኝ ታሪካዊ የአካባቢ ጥበቃ ቀጰ ሰርዷ ጀምሮ ከ3,000 በላይ ነዋሪዎች፣ ተማሪዎችና በጎ ፈቃደኞች ዓርብ ሳምንት ብቻ 50,000 ዛፎችን ፓርኮች፣ የጎዳና ዳርቻዎች፣ ትምህርት ቤቶችና ክፍት አረንጓዴ ቦታዎች ላይ ተክለዋል።

ቀጰ ሰርዷ የአዲስ አበባ ከተማ ሰፊ የአረንጓዴ መሠረተ ልማት ፕሮግራም አካል ሲሆን የከተማ ሙቀት ደሴቶችን ለመዋጋት፣ የአየር ጥራትን ለማሻሻልና ደስ ብሏቸው ቦታዎችን ለመፍጠር ያለመ ነው። ዋርካ፣ ቲዱ እና ፍሬ ሰጪ ዛፎች ተዘርዝረዋቸዋል።

የአካባቢ ጥበቃ ጽ/ቤቱ ለሚቀጥሉ ሁለት ዓመታት ክትትል ቡድኖች ወደ እያንዳንዱ ሥፍራ ይሰማሩ እንደሚሆን አሳወቀ።`,
      category:          'አካባቢ',
    },
    orm: {
      title:             'Lideta Magariisaa: Muka 50,000 Yaboo Dhaabame',
      short_description: 'Kutaan Magaalaa Lideta tarsiimoo "Lideta Magariisaa" eebbise; jiraattoota fi geengoo 3,000 ol hiriirsuun muka 50,000 dhaabe.',
      description:       `Bulchiinsi Kutaa Magaalaa Lideta tarsiimoo naannoo seenaa qabeessa "Lideta Magariisaa" eebbise. Jiraattoota, barattootaa fi geengoo 3,000 ol hiriirsuun xandaa tokko qofaatti mooraa park, karaa, mana barumsaa fi bakka magariisaa banaarra muka 50,000 dhaabani.

Tarsiimoon kun sagantaa sirna bu\'uura magariisaa magaalaa Finfinnee bal\'aa wajjin walqabatee olii-gadii mana-mana lafa gadi-jabina qilleensaa foyyeessuu fi bakka uummataa mi\'aawaa uumuuf kaayyeffame.

Waajjirri Naannoo gaggeessitoota tajaajila kunuunsaa ganna lama dhufurratti kutaalee dhaabbii hunda irratti ramadu beeksise.`,
      category:          'Naannoo',
    },
  },

  // 6
  {
    title:            'Lideta Sub-City Digital Services Portal Goes Live',
    short_description:'Residents can now access over 30 municipal services online through the newly launched Lideta Digital Services Portal, reducing wait times and improving transparency.',
    description:      `Lideta Sub-City Administration has officially launched its Digital Services Portal, allowing residents to access more than 30 municipal services online without the need to visit government offices in person. The portal went live following a successful six-month pilot program.

Services available through the portal include trade license renewal, birth and marriage certificate applications, property registration, utility complaint submission, and tracking of complaint resolution status. The system is accessible via both desktop and mobile devices and is available in Amharic, Oromo, and English.

The portal is part of a broader e-governance strategy that Addis Ababa City Administration has been rolling out across all sub-cities. User registration requires a valid national ID and a mobile phone number for verification.

"This is a significant step toward making government services more accessible and reducing bureaucratic friction," said the Head of the ICT Department. Over 1,200 residents have already registered in the first week since launch, with trade license renewal being the most popular service.`,
    category:         'Technology',
    photo:            PHOTOS[5],
    amh: {
      title:             'ልደታ ክፍለ ከተማ ዲጂታል አገልግሎት ፖርታል ተጀምሯል',
      short_description: 'ነዋሪዎች አሁን ሰላሳ በላይ የማዘጋጃ አገልግሎቶችን ዲጂታል ፖርታሉ ጥቅም ላይ ልዩ ሳያደርጉ ማድረግ ይችላሉ።',
      description:       `ልደታ ክፍለ ከተማ አስተዳደር ዲጂታል አገልግሎት ፖርታሉን ያስጀምሯ ሲሆን ነዋሪዎች 30 በላይ ማዘጋጃ ቤት አገልግሎቶችን ጽ/ቤቱን ሳይጎበኙ ኦንላይን ማግኘት ይችላሉ። ፖርታሉ ስምንት ሳምንቴ ስኬታማ ፓይለት ፕሮግራም ካለቀ በኋላ ሥራ ጀምሯል።

በፖርታሉ አቅርቦ ያሉ አገልግሎቶች ናቸው፡ የንግድ ፈቃድ ታደሳ፣ የልደት ሰርቲፊኬት ማስጀምሪያ፣ ቅሬታ ማቅረቢያ፣ ሁኔታ ክትትሊያ ወዘተ። ሥርዓቱ ዴስክቶፕና ሞባይሌ ተደራሽ ሆኖ በአማርኛ፣ ኦሮምኛ ና እንግሊዝኛ ያካሄዳል።

የ ICT ክፍሉ ሃላፊ "ይህ ዕርምጃ ወደ ዜጎቻችን ፍቱ ሆኖ ቢሮክሬሲ ሸክምን ለማቃለሏ ጠቃሚ ርምጃ ነው" ሲሉ ተናግረዋል።`,
      category:          'ቴክኖሎጂ',
    },
    orm: {
      title:             'Portaalli Tajaajila Dijitaalaa Kutaa Magaalaa Lideta Jalqabe',
      short_description: 'Jiraattonni tajaajila mootummaa 30 ol portaalli dijitaalaa haaraa fayyadamuudhaan mana mootummaa dhaquu malee argachuu danda\'u.',
      description:       `Bulchiinsi Kutaa Magaalaa Lideta Portaalli Tajaajila Dijitaalaa eebbiseera. Jiraattonni tajaajila mootummaa 30 ol mana mootummaa deemuun alatti onlaayiniidhan argachuu ni danda\'u.

Tajaajilli portaalii irraa argamu haaromsa hayyama daldalaa, iyyannoo ragaa dhalootaa fi fuudhaafi heeruma, iyyannoo komii, fi hordoffii haala deebii komii ni hammate. Sirni kun kompiyuutaraa fi moobayiliidhan dhaqqabamuu danda\'uu Afaan Amaaraa, Afaan Oromoo fi Afaan Ingiliiziitiin ni hojjata.

"Kun tarkaanfii ijoo tajaajila mootummaa dhaqqabamaa gochuu fi rakkinaa biirokiraasiifi hir\'isuuf ta\'e," jedhan Hogganaan Kutaa ICT.`,
      category:          'Teknooloojii',
    },
  },

  // 7
  {
    title:            'Sub-City Administration Cracks Down on Illegal Construction',
    short_description:'Lideta Sub-City has demolished 47 illegally constructed structures and issued formal warnings to 120 property owners in a sweeping enforcement campaign.',
    description:      `In a decisive enforcement action, Lideta Sub-City Administration has demolished 47 illegally constructed structures and issued formal warnings to 120 additional property owners over a six-week period, as part of an intensified campaign to enforce urban planning regulations.

The structures included encroachments on public roads and pedestrian paths, unauthorized commercial buildings in residential zones, and constructions without valid permits. The campaign was coordinated between the Sub-City Urban Planning Office, the Addis Ababa City Administration, and local police.

The Urban Planning Office noted that illegal construction has been one of the primary obstacles to implementing the sub-city's master plan. Property owners who demolish illegal structures voluntarily within the given notice period will not face additional penalties.

Residents are reminded to obtain valid construction permits before beginning any building work. The Sub-City Urban Planning Office offers free consultations on permit requirements every Monday and Wednesday from 8:30 AM to 12:30 PM.`,
    category:         'Security',
    photo:            PHOTOS[6],
    amh: {
      title:             'ክፍለ ከተማ አስተዳደሩ ህገ-ወጥ ሕንፃ ግንባታ ላይ ተጠናከረ',
      short_description: 'ልደታ ክፍለ ከተማ 47 ህገ-ወጥ ሕንፃዎችን አፍርሶ 120 ባለ ንብረቶችን ማስጠንቀቂያ ሰጠ።',
      description:       `በወሳኝ እርምጃ ልደታ ክፍለ ከተማ አስተዳደር ህገ-ወጥ ሕንፃዎችን ለማፍረስ ካካሄደው ዘጠኝ ሳምንት ዘመቻ 47 ህገ-ወጥ ሕንፃ ፈረሰ፤ 120 ባለ ንብረቶት ማስጠንቀቂያ ተሰጣቸው።

ሕንፃዎቹ ዋና ዋናዎቹ ናቸው፡ የሕዝብ መንገዶችና ምንባቦች ወረራ፣ ፈቃድ ያጡ ንግዳዊ ሕንፃዎች ና ፈቃድ ሳይወሰዱ ያሳቆሩ ሕንፃዎች። ዘመቻው ክፍለ ከተማ ከተማ ፕሊኒንግ ጽ/ቤት፣ አዲስ አበባ ከተማ አስተዳደርና አካባቢ ፖሊስ ጋር ተናብቦ ተካሄደ።`,
      category:          'ደህንነት',
    },
    orm: {
      title:             'Bulchiinsi Kutaa Magaalaa Ijaarsaa Seeraan Alaa Irratti Jabaate',
      short_description: 'Kutaan Magaalaa Lideta ijaarsa seeraan alaa 47 diigee, abbaa qabeenya 120 tti ajaja ergite.',
      description:       `Tarkaanfii murteessaa ta\'een Bulchiinsi Kutaa Magaalaa Lideta wiirtuu torban jahaa ijaarsaa seeraan alaa 47 diigee abbaa qabeenya dabalataa 120 tti beeksisa ergite.

Ijaarsaaleen kun carraa daandii uummataa fi karaa miilaa seenuun dhuunfataman, mana daldalaa hayyama malee ijaaraman fi ijaarsa hayyama hin qabne ni hammatu. Kaadhimamni kun Waajjira Karoora Magaalaa Kutaa Magaalaa, Bulchiinsa Magaalaa Finfinnee fi poolisii naannoo waliin ta\'uun gaggeeffame.`,
      category:          'Nagaa',
    },
  },

  // 8
  {
    title:            'Youth Skills Training Center Enrolls 800 Young People',
    short_description:'The Lideta Sub-City Youth and Sports Office has enrolled 800 young people in its latest round of vocational skills training programs covering IT, tailoring, and construction trades.',
    description:      `The Lideta Sub-City Youth and Sports Office has successfully enrolled 800 young people, aged 18 to 35, in its latest round of vocational skills training programs. The training, which covers information technology, tailoring and fashion design, carpentry, masonry, and electrical installation, is designed to equip young people with marketable skills and reduce youth unemployment.

The program is delivered in partnership with TVET institutions and private sector employers who have committed to offering employment opportunities to graduates. Training runs for three to six months depending on the track, with certification provided by the Ethiopian TVET Agency upon completion.

Previous rounds of the program have resulted in employment rates above 70% for graduates within six months of certification. The Youth Office noted that demand for the program has increased by 35% compared to the previous year, indicating strong community interest.

Young people interested in the next enrollment round are encouraged to register at the Sub-City Youth and Sports Office. Enrollment priority is given to young women, individuals with disabilities, and those from low-income households.`,
    category:         'Education',
    photo:            PHOTOS[7],
    amh: {
      title:             'የወጣቶች ክህሎት ማሰልጠኛ ማዕከል 800 ወጣቶችን ምዝግቧል',
      short_description: 'ልደታ ክፍለ ከተማ ወጣቶች ጽ/ቤት 800 ወጣቶችን የሙያ ክህሎት ሥልጠናዎች ምዝጋቧቸዋል።',
      description:       `ልደታ ክፍለ ከተማ ወጣቶችና ስፖርት ጽ/ቤት ከ18 እስከ 35 ዓመት የሆናቸው 800 ወጣቶችን ቅርብ ሙያ ክህሎት ሥልጠናዎች ምዝግቧቸዋል። ሥልጠናው የኢንፎርሜሽን ቴክኖሎጂ፣ ስፌት ፋሽን ዲዛይን፣ ሸክምና ምሰሶ ሥራ ሌሎች ይካትታል።

ፕሮግራሙ ከ TVET ተቋማትና ለምሩቃን ሥራ ለሚሰጡ የግሉ ዘርፍ ቀጣሪዎች ጋር ተናብቦ ይካሄዳል። ሥልጠናው በኢትዮጵያ TVET ኤጀንሲ ሰርቲፊኬት ሲሰጥ ሦስት ወደ ስድስት ወር ይቆያል።

ቀደምት ዙሮች ምሩቃን ከ70% በላይ ሥራ ያገኛሉ። ቀጣዩ ዙር ምዝገባ ቅድሚያ ለሴቶች፣ አካል ጉዳተኞችና ዝቅተኛ ገቢ ላላቸው ቤተሰቦች ሕፃናት ተሰጥቷል።`,
      category:          'ትምህርት',
    },
    orm: {
      title:             'Wiirtuu Leenjii Dandeettii Dargaggoota 800 Galmeesse',
      short_description: 'Waajjirri Dargaggoota Kutaa Magaalaa Lideta dargaggoo 800 sagantaa leenjii dandeettii ogummaa haaraadhaf galmeesse.',
      description:       `Waajjirri Dargaggoota fi Ispoortii Kutaa Magaalaa Lideta dargaggoo waggaa 18 hanga 35 ta\'an 800 sagantaa leenjii dandeettii ogummaa haaraadhaaf galmeesseera. Leenjiin IT, uffata ho\'isuu, ijaarsa fi meeshaalee wiirtuu ni hammate.

Sagantaan dhaabbilee TVET fi kennitota hojii damee dhuunfaa, dargaggoota eebbifaman hojii kennuuf waadaa galan waliin gaggeeffama. Leenjiin baatii sadii hanga jahaa tura, xumurarratti ragaa TVET Itiyoophiyaatiin kennama.

Wiirtuuwwan kana dura gaggeeffaman yuniversitii eebbifamtootaaf dhibbeentaa 70 ol hojii argatan argisiisan.`,
      category:          'Barnoota',
    },
  },

  // 9
  {
    title:            'Renovated Lideta Central Market Opens to Merchants and Public',
    short_description:'After 14 months of construction, the fully renovated Lideta Central Market has re-opened, featuring modern stalls, improved sanitation, and fire safety systems.',
    description:      `After 14 months of intensive construction, the fully renovated Lideta Central Market has officially re-opened its doors to merchants and the public. The renovation project transformed the market from a congested, deteriorating facility into a modern, organized commercial hub with capacity for over 800 permanent stalls.

Key improvements include dedicated zones for fresh produce, clothing, electronics, and food service; a centralized waste management system; modern sanitation blocks; integrated fire suppression systems; and CCTV surveillance for improved security.

Merchants who were temporarily relocated during the construction period have been assigned new permanent stalls on a priority basis. The Sub-City Trade and Industry Office noted that rental rates for stalls have been maintained at pre-renovation levels to ease the transition.

"This market is the economic heart of our sub-city," said the Sub-City Administrator at the inauguration ceremony. "Investing in it is investing in the livelihoods of thousands of families." The market is expected to generate 200 new permanent jobs through expanded service facilities.`,
    category:         'Infrastructure',
    photo:            PHOTOS[8],
    amh: {
      title:             'ታደሰው ልደታ ዋናው ገበያ ለነጋዴዎችና ሕዝብ ተከፈተ',
      short_description: '14 ወር ግንባታ ካለቀ በኋላ ሙሉ ታደሰው ልደታ ዋናው ገበያ ዘመናዊ ሱቆች ሳኒቴሽን ና የእሳት ደህንነት ሥርዓቶቹ ጋር ተከፈተ።',
      description:       `14 ወር ከፍተኛ ግንባታ ካለቀ በኋላ ሙሉ ታደሰው ልደታ ዋናው ገበያ ለነጋዴዎችና ሕዝብ ተከፈተ። ፕሮጀክቱ ጠባቡን ጥፍ ባዩን ገበያ ከ800 ቋሚ ሱቆች ቁጥር ያለ ዘመናዊ ተደራጅቶ ሰፊ ቦታ ወደሚሰጥ ቦታ ቀይሮታል።

ፍሬ ጥቁር ወርቅ ለቤት ዕቃ ሴቶች ለብሰው ኢሌክትሮኒክስ እና የምግብ አገልግሎት ልዩ ቦታዎች ናቸው። ዋናዋ ቆሻሻ አወጋገድ ሥርዓት፣ ዘመናዊ ሳኒቴሽን ሕዳጎቻ ና CCTV ክትትሉ ልዩ ልዩ ፍሬዎቹ ናቸው።

ክፍለ ከተማ አስተዳዳሪዋ "ይህ ገበያ ቤት ዕቃ ቤቱ ነው" ሲሉ ምርቃ ሥሯ ተናግረዋቸዋል።`,
      category:          'መሠረተ ልማት',
    },
    orm: {
      title:             'Gabatee Giddugaleessa Lideta Haaromsame Daldaltoota fi Uummataaf Baname',
      short_description: 'Gabatee Giddugaleessa Lideta baatii 14 ijaaramee guutummaatti haaromsamee bantii ammayyaa, manca\'a qulqullummaa fi sirnaa ibiddaa waliin banameera.',
      description:       `Gabatee Giddugaleessa Lideta erga ijaarsi cimaa baatii 14 erga xumuramee booda daldaltoota fi uummataaf itti banameera. Pirojektiin haaromsaa gabatee cufaa mancaa\'aa ture gara wiirtuu daldala ammayyaa teessoo bantii 800 ol qabu jijjiire.

Fooyya\'inaaleen ijoon: naannoo addaa oomisha qilleensa qabate, uffata, elektirooniksi fi tajaajila nyaataaf; sirna bulchiinsa qotiyyoo giddugaleessa; ganda qulqullummaa ammayyaa; sirna to\'annaa ibiddaa itti hidhame; fi to\'annoo CCTV ni hammatu.`,
      category:          'Bu\'uura',
    },
  },

  // 10
  {
    title:            'Lideta Sub-City Recognized for Excellence in Public Service Delivery',
    short_description:'Lideta Sub-City Administration received the Addis Ababa City Administration\'s Award for Excellence in Public Service Delivery for the second consecutive year.',
    description:      `Lideta Sub-City Administration has received the Addis Ababa City Administration's prestigious Award for Excellence in Public Service Delivery for the second consecutive year, recognizing outstanding performance across service delivery quality, citizen satisfaction, and administrative transparency.

The award, presented at the annual Addis Ababa Good Governance Conference, cited Lideta's achievements in reducing average service wait times by 42%, achieving a citizen satisfaction score of 87% in the annual survey, and implementing a fully functional digital complaint management system.

The Sub-City Administrator accepted the award on behalf of the administration's 1,200 staff members. "This recognition belongs to every employee who shows up every day committed to serving our residents, and to every resident who holds us accountable," she said.

The administration has committed to maintaining high service standards and announced plans to introduce three new digital services in the coming quarter, including an online property tax payment portal and a live tracking system for infrastructure maintenance requests.`,
    category:         'Events',
    photo:            PHOTOS[9],
    amh: {
      title:             'ልደታ ክፍለ ከተማ ለሕዝብ አገልግሎት ዕጽዋ የሚሰጠው ሽልማት ተቀበለ',
      short_description: 'ልደታ ክፍለ ከተማ አስተዳደር ለሁለተኛ ተከታይ ዓመት የአዲስ አበባ ምርጥ ሕዝብ አገልግሎት ሽልማት ተቀበለ።',
      description:       `ልደታ ክፍለ ከተማ አስተዳደር ለሁለተኛ ተከታይ ዓመት የአዲስ አበባ ከተማ አስተዳደር ምርጥ ሕዝብ አገልግሎት ሽልማት ተቀበለ። ሽልማቱ ሕዝብ አገልግሎት ጥራት፣ ዜጎች እርካታ እና አስተዳደር ግልፅነት ወቅታዊ አፈፃፀምን ይሸልማል።

ሽልማቱ ዓመታዊ የአዲስ አበባ መልካም አስተዳደር ጉባኤ ላይ ቀርቦ ልደታ ሀ አቅርቦ ይዕ ሲሆን ክፍለ ከተማ ሽልሙ ተሰጠ ፡ አቅርቦ የጉዳይ ጊዜ 42% ቀንሷል፣ ዜጎች ዕርካታ ደረጃ 87% ደርሷል ና ዲጂታሉ ቅሬታ ምስሪት ሙሉ ቀርቦ ሥራ ላይ ውሏ።`,
      category:          'ክንውኖች',
    },
    orm: {
      title:             'Kutaan Magaalaa Lideta Badhaasa Qulqullina Tajaajila Uummataa Fudhatame',
      short_description: 'Bulchiinsi Kutaa Magaalaa Lideta Badhaasa Qulqullina Tajaajila Uummataa Bulchiinsa Magaalaa Finfinnee waggaa lammataaf wal-duraa duubaan fudhate.',
      description:       `Bulchiinsi Kutaa Magaalaa Lideta Badhaasa Qulqullina Tajaajila Uummataa Bulchiinsa Magaalaa Finfinnee waggaa lammataaf wal-duraa duubaan fudhate. Tajaajila qulqullina, gammachuu lammii fi iftoominaa bulchiinsaatiin raawwii ol'aanaa agarsiise.

Badhaasni, Marii Bulchiinsa Gaarii Finfinnee waggaattii dhiyaate, milkaa\'ina Lideta eeruun: yeroo eeggannaa tajaajilaa giddu-galeessaa dhibbeentaa 42tiin hir\'isuu, lammiidhaan maxxanfame dhibbeentaa 87 ta\'uun, fi sirna bulchiinsa komii dijitaalaa guutummaatti hojjetu hojiirra oolchuun walqabate.`,
      category:          'Taatee',
    },
  },
]

// ─── Insert function ──────────────────────────────────────────────────────────
async function insertNews(item) {
  const photoJson = item.photo ? JSON.stringify(item.photo) : null

  const result = await pool`
    INSERT INTO news (title, description, category, short_description, photo)
    VALUES (
      ${item.title},
      ${item.description},
      ${item.category},
      ${item.short_description},
      ${photoJson}::jsonb
    )
    RETURNING id, title`

  const newsId = result[0].id

  await pool`
    INSERT INTO news_translation (news_id, amh, orm)
    VALUES (
      ${newsId},
      ${JSON.stringify(item.amh)}::jsonb,
      ${JSON.stringify(item.orm)}::jsonb
    )`

  return result[0]
}

// ─── Run ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🌱 Seeding ${NEWS.length} news articles...\n`)
  let success = 0
  for (const item of NEWS) {
    try {
      const row = await insertNews(item)
      console.log(`  ✓ [${row.id}] ${row.title}`)
      success++
    } catch (err) {
      console.error(`  ✗ Failed: ${item.title}\n    ${err.message}`)
    }
  }
  console.log(`\n✅ Done — ${success}/${NEWS.length} articles inserted.\n`)
  process.exit(0)
}

main().catch(err => { console.error(err); process.exit(1) })
