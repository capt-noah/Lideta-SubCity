/**
 * patch_translations.mjs
 * Adds missing Amharic + Oromo translations to articles that have none.
 * Matches articles by their English title and upserts into news_translation.
 * Run: node server/scripts/patch_translations.mjs
 */

import pool from '../con/db.js'

// Translations keyed by the exact English title stored in the DB
const TRANSLATIONS = {
  'Lideta Sub-City Launches Major Road Infrastructure Upgrade': {
    amh: {
      title:             'ልደታ ክፍለ ከተማ ዋና የመንገድ መሠረተ ልማት ማሻሻያ ሥራ ጀምሯል',
      short_description: 'ልደታ ክፍለ ከተማ አስተዳደር 12 ቁልፍ ኮሪደሮችን ያካተተ ሁሉን አቀፍ የመንገድ ማሻሻያ ፕሮጀክት በይፋ ጀምሯል።',
      description:       'ልደታ ክፍለ ከተማ አስተዳደር 12 ቁልፍ ኮሪደሮችን ያካተተ ሁሉን አቀፍ የመንገድ ማሻሻያ ፕሮጀክት በይፋ ጀምሯል። ፕሮጀክቱ ከ300,000 በላይ ለሚሆኑ ነዋሪዎች ረጅም ጊዜ ሲዘልቁ የቆዩ የትራንስፖርት ችግሮችን ለመፍታት ያለመ ነው። ፕሮጀክቱ የሚያካትተው፡ መንገድ ማስፋፋት፣ ዘመናዊ የፍሳሽ ዝርጋታ ማስቀመጥ፣ የእግረኛ መንገዶችና የጎዳና ብርሃን ማሻሻያ ነው። ፕሮጀክቱ በ18 ወር ውስጥ ሙሉ ለሙሉ እንዲጠናቀቅ ሲጠበቅ ደረጃ አንድ በሚቀጥሉ ስድስት ወሮች ለቀረቦ ይሆናል።',
      category:          'መሠረተ ልማት',
    },
    orm: {
      title:             'Bulchiinsa Kutaa Magaalaa Lideta Hojii Fooyya\'insaa Daandii Gurguddaa Jalqabe',
      short_description: 'Bulchiinsi Kutaa Magaalaa Lideta pirojektii fooyya\'insaa daandii bal\'aa koriidaroota 12 hammate ifa baase.',
      description:       'Bulchiinsi Kutaa Magaalaa Lideta pirojektii fooyya\'insaa daandii bal\'aa koriidaroota gurguddaa 12 hammate ifa baase. Pirojektiin kun jiraattoota 300,000 ol qaban rakkoo geejjibaa waggaa dheeraa ture furuu kaayyoo godhatee jira. Pirojektiin kun babal\'ina daandii, sirna dhangala\'aa ammayyaa, karaa miilaa fi guddina ifa daandii ni hammata. Pirojektiin guutummaatti baatii 18 keessatti xumuramuu eegama; marsaa jalqabaa baatii jaha dhufurratti kennama.',
      category:          'Bu\'uura',
    },
  },

  'Free Health Screening Campaign Reaches 15,000 Residents': {
    amh: {
      title:             'የነፃ ጤና ምርመራ ዘመቻ ከ15,000 በላይ ነዋሪዎችን ደርሷል',
      short_description: 'ልደታ ክፍለ ከተማ የጤና ጽ/ቤት ሦስት ሳምንት የሚቆይ የነፃ ጤና ምርመራ ዘመቻ ጨርሷል፤ ከ15,000 በላይ ነዋሪዎችን አገልግሏል።',
      description:       'ልደታ ክፍለ ከተማ የጤና ጽ/ቤት ሦስት ሳምንት ነፃ ጤና ምርመራ ዘመቻ ስኬታማ ሆኖ ጨርሷል። ዘመቻው በ8 የጤና ጣቢያዎች ከ15,000 በላይ ነዋሪዎችን አገልግሏል። የስኳር ህመም፣ ደም ግፊት፣ ሳንባ ነቀርሳ እና የእናቶች ጤና ምርመራ ሰጥቷል። ከ2,300 በላይ ነዋሪዎች ወደ ክትትል ሕክምና ተላልፈዋል፣ 450 የደም ግፊት ህሙማን ተለይተዋল። ተመሳሳይ ዘመቻዎች በሩብ ዓመት ይካሄዳሉ።',
      category:          'ጤና',
    },
    orm: {
      title:             'Kaadhimamni Qorannoo Fayyaa Bilisaa Jiraattota 15,000 Ol Ga\'e',
      short_description: 'Waajjirri Fayyaa Kutaa Magaalaa Lideta wiirtuu fayyaa 8 keessatti jiraattoota 15,000 ol tajaajile.',
      description:       'Waajjirri Fayyaa Kutaa Magaalaa Lideta kaadhimama qorannoo fayyaa bilisaa torban sadii ture milkaa\'inaan xumure. Wiirtuu fayyaa hawaasaa 8 keessatti jiraattoota 15,000 ol tajaajileera. Qorannoo dhibee sookoraa, dhiibbaa dhiigaa, TB fi fayyaa haadholii ni hammate. Jiraattoota 2,300 ol wal\'aansa ittaansuuf ergaman; dhibee dhiibbaa dhiigaa hin beekkamne dura 450 adda bahan. Kaadhimamni fakkaataa rubu\'aa waggaatti gaggeeffama.',
      category:          'Fayyaa',
    },
  },

  'New Primary Schools Open in Three Neighborhoods': {
    amh: {
      title:             'ሦስት አዳዲስ የመጀመሪያ ደረጃ ትምህርት ቤቶች ተከፈቱ',
      short_description: 'ሦስት አዲስ ሙሉ ዝግጅት ያላቸው የመጀመሪያ ደረጃ ትምህርት ቤቶች ተምሮ 2,400 አዲስ ተማሪ ስፍራዎች ጨምረዋል።',
      description:       'ሦስት አዲስ ሙሉ ዝግጅት ያላቸው የመጀመሪያ ደረጃ ትምህርት ቤቶች በልደታ ክፍለ ከተማ ምርቃ ሥሯ ተከናወነ። 2,400 አዲስ ተማሪ ስፍራዎችን ጨምሮ ለዓመታት የቀጠለ የክፍሎቹ ጠባቢነት ችግር ያቃልላሉ። እያንዳንዱ ትምህርት ቤት ዘመናዊ ክፍሎች፣ ኮምፒውተር ላቦ፣ ቤተ-መጻሕፍትና ስፖርት ሜዳ ይዟል። ከትምህርት ቤቶቹ ምርቃ በኋላ ክፍለ ከተማው የተማሪ ወደ ክፍሎቹ ጥምርታ ከ65፡1 ወደ 45፡1 ተሻሽሏል።',
      category:          'ትምህርት',
    },
    orm: {
      title:             'Mana Barumsaa Sadarkaa Tokkoffaa Haaraa Sadii Baname',
      short_description: 'Mana barumsaa sadarkaa tokkoffaa haaraa guutuu qophaa\'e sadii banameera; teessoo barataa haaraa 2,400 dabaluun rakkoo kutaa cufaa ta\'u hir\'ise.',
      description:       'Mana barumsaa sadarkaa tokkoffaa haaraa guutuu qophaa\'e sadii kutaa magaalaa Lideta keessatti eebbifame. Teessoo barataa haaraa 2,400 dabaluun rakkoo xaxoo cufaa ta\'u waggaa dheeraa miidhaa barnootarratti gahe hir\'iseera. Manni barumsaa hundi kutaa ammayyaa, laaboraatoorii kompiyuutaraa, kuusaa kitaabaa fi dirree ispoortii qabaata. Kutaa magaalaa keessatti hir\'ina barattoota kutaadhaaf jiru 65:1 irraa 45:1 gahuu odeeffateera.',
      category:          'Barnoota',
    },
  },

  'Lideta Sub-City Hosts Inter-Kebele Community Dialogue Forum': {
    amh: {
      title:             'ልደታ ክፍለ ከተማ የቀበሌ ማህበረሰብ ምክክር መድረክ አዘጋጀ',
      short_description: 'ከ500 በላይ የማህበረሰብ መሪዎች፣ ወጣቶች ተወካዮችና ነዋሪዎች ለሁለት ቀን ምክክር መድረክ ተሳትፈዋል።',
      description:       'ከ500 በላይ የማህበረሰብ መሪዎች፣ ወጣቶች ተወካዮች ና ነዋሪዎች ለሁለት ቀን ምክክር መድረክ ተሰበሰቡ። ምክክሩ ፓናል ውይይቶች፣ ሥራ ቡድኖች ና ክፍት ወለል ስብሰባዎች ያካትታል። ዋና ፍሬ ናቸው ካሏቸው ጉዳዮች አንዱ በሩብ ዓመት ተሰብስቦ ለአስተዳደሩ ምላሽ የሚሰጥ ቋሚ የማህበረሰብ አማካሪ ምክር ቤት ማቋቋም ነው። ሁሉም 10 ቀበሌዎች ተወካዮቻቸው ምክር ቤቱ ውስጥ ይኖሩዋቸዋል።',
      category:          'ክንውኖች',
    },
    orm: {
      title:             'Kutaan Magaalaa Lideta Marii Hawaasaa Giddu-Galeessa Gaggeesse',
      short_description: 'Hoggantoota hawaasaa, bakka bu\'oota dargaggoota fi jiraattoota 500 ol marii guyyaa lama irratti argaman.',
      description:       'Hoggantoota hawaasaa fi jiraattoota kutaa magaalaa Lideta hundaa irraa dhufan 500 ol guyyaa lamaa mariif walitti qabaman. Marii kun marii garee paanelii, garee hojii fi taa\'ichi barcuma banaa ni hammate. Bu\'aa mariichaa ijoo keessaa tokko Koree Gorsa Hawaasaa Yeroo Hunda jiraatu hundeessuu waliigaluu ture. Kebeelee 10 hunda bakka bu\'oota qabaatu.',
      category:          'Taatee',
    },
  },

  'Green Lideta: 50,000 Trees Planted in Sub-City Beautification Drive': {
    amh: {
      title:             'አረንጓዴ ልደታ፡ 50,000 ዛፎች ተተክለዋል',
      short_description: 'ልደታ ክፍለ ከተማ "አረንጓዴ ልደታ" ቀጰ ሰርዷ ጀምሮ ነዋሪዎች እና በጎ ፈቃደኞች 50,000 ዛፎችን ተክለዋል።',
      description:       'ልደታ ክፍለ ከተማ አስተዳደር "አረንጓዴ ልደታ" ቀጰ ሰርዷ ጀምሮ ከ3,000 በላይ ነዋሪዎች፣ ተማሪዎችና በጎ ፈቃደኞች ዓርብ ሳምንት ብቻ 50,000 ዛፎችን ፓርኮች፣ የጎዳና ዳርቻዎች ና ክፍት አረንጓዴ ቦታዎች ላይ ተክለዋል። ዋርካ፣ ቲዱ ና ፍሬ ሰጪ ዛፎች ዋና ዋና ዝርያዎቹ ናቸው። ለሚቀጥሉ ሁለት ዓመታት ክትትሎ ቡድኖች ወደ እያንዳንዱ ሥፍራ ይሰማሩ።',
      category:          'አካባቢ',
    },
    orm: {
      title:             'Lideta Magariisaa: Muka 50,000 Dhaabame',
      short_description: 'Kutaan Magaalaa Lideta tarsiimoo "Lideta Magariisaa" eebbise; jiraattoota fi geengoo 3,000 ol hiriirsuun muka 50,000 dhaabe.',
      description:       'Bulchiinsi Kutaa Magaalaa Lideta tarsiimoo naannoo seenaa qabeessa "Lideta Magariisaa" eebbise. Jiraattoota, barattootaa fi geengoo 3,000 ol hiriirsuun xandaa tokko qofaatti mooraa park, karaa fi bakka magariisaa banaarra muka 50,000 dhaabani. Warkaa, Tidhii fi muka firii kennuu kanneen filataman. Gaggeessitoota tajaajila kunuunsaa ganna lama dhufurratti kutaalee dhaabbii hunda irratti ramadama.',
      category:          'Naannoo',
    },
  },

  'Lideta Sub-City Digital Services Portal Goes Live': {
    amh: {
      title:             'ልደታ ክፍለ ከተማ ዲጂታሉ አገልግሎት ፖርታሉ ሥራ ጀምሯል',
      short_description: 'ነዋሪዎች አሁን ሰላሳ በላይ የማዘጋጃ አገልግሎቶችን ዲጂታሉ ፖርታሉ ጥቅም ላይ ሳያደርጉ ማድረግ ይችላሉ።',
      description:       'ልደታ ክፍለ ከተማ አስተዳደር ዲጂታሉ አገልግሎት ፖርታሉን ያስጀምሯ ሲሆን ነዋሪዎች 30 በላይ ማዘጋጃ አገልግሎቶችን ጽ/ቤቱን ሳይጎበኙ ኦንላይን ማግኘት ይችላሉ። ሥርዓቱ ዴስክቶፕና ሞባይሌ ተደራሽ ሆኖ በአማርኛ፣ ኦሮምኛ ና እንግሊዝኛ ያካሄዳል። አቅርቦ ያሉ አገልግሎቶች ናቸው፡ የንግድ ፈቃድ ታደሳ፣ የልደት ሰርቲፊኬት ና ቅሬታ ክትትሉ። ከ1,200 በላይ ነዋሪዎች ከጀምሮ በኋላ ባሉ ሳምንታት ምዝጋቧቸዋል።',
      category:          'ቴክኖሎጂ',
    },
    orm: {
      title:             'Portaalli Tajaajila Dijitaalaa Kutaa Magaalaa Lideta Hojii Jalqabe',
      short_description: 'Jiraattonni tajaajila mootummaa 30 ol portaalli dijitaalaa haaraa fayyadamuudhaan mana mootummaa dhaquu malee argachuu danda\'u.',
      description:       'Bulchiinsi Kutaa Magaalaa Lideta Portaalli Tajaajila Dijitaalaa eebbiseera. Jiraattonni tajaajila mootummaa 30 ol mana mootummaa deemuun alatti onlaayiniidhan argachuu ni danda\'u. Sirni kun kompiyuutaraa fi moobayiliidhan dhaqqabamuu danda\'uu Afaan Amaaraa, Afaan Oromoo fi Afaan Ingiliiziitiin ni hojjata. Tajaajilli haaromsa hayyama daldalaa, ragaa dhalootaa fi iyyannoo komii ni hammata. Jiraattoota 1,200 ol torbana jalqabaa keessatti galmeeffaman.',
      category:          'Teknooloojii',
    },
  },

  'Sub-City Administration Cracks Down on Illegal Construction': {
    amh: {
      title:             'ክፍለ ከተማ አስተዳደሩ ህገ-ወጥ ሕንፃ ግንባታ ላይ ጠንከረ',
      short_description: 'ልደታ ክፍለ ከተማ 47 ህገ-ወጥ ሕንፃዎችን አፍርሶ 120 ባለ ንብረቶችን ማስጠንቀቂያ ሰጠ።',
      description:       'ልደታ ክፍለ ከተማ አስተዳደር ህገ-ወጥ ሕንፃዎችን ለማፍረስ ዘጠኝ ሳምንት ዘመቻ ካካሄደ 47 ህገ-ወጥ ሕንፃ ፈርሶ 120 ባለ ንብረቶት ማስጠንቀቂያ ተሰጣቸው። ሕንፃዎቹ ዋና ዋናዎቹ ናቸው፡ ፈቃድ ሳይወሰዱ ያሳቆሩ ሕንፃዎችና የሕዝብ ቦታ ወረራዎች። ሕጋዊ ፈቃድ ከማውጣት ሳይጀምሩ ሕንፃ ለሚሰሩ ሁሉ ነፃ ምክር ይሰጣል።',
      category:          'ደህንነት',
    },
    orm: {
      title:             'Bulchiinsi Kutaa Magaalaa Ijaarsaa Seeraan Alaa Irratti Jabaate',
      short_description: 'Kutaan Magaalaa Lideta ijaarsa seeraan alaa 47 diigee, abbaa qabeenya 120 tti ajaja ergite.',
      description:       'Tarkaanfii murteessaa ta\'een Bulchiinsi Kutaa Magaalaa Lideta wiirtuu torban jahaa ijaarsaa seeraan alaa 47 diigee abbaa qabeenya dabalataa 120 tti beeksisa ergite. Ijaarsaaleen kun carraa daandii uummataa seenuun dhuunfataman, mana hayyama malee ijaaraman ni hammatu. Abbaa qabeenyaa tarree kenname keessatti ijaarsa seeraan alaa of-danda\'an diigan adabbii dabalataa hin argatan.',
      category:          'Nagaa',
    },
  },

  'Youth Skills Training Center Enrolls 800 Young People': {
    amh: {
      title:             'የወጣቶች ክህሎት ማሰልጠኛ ማዕከል 800 ወጣቶችን ምዝጋቧል',
      short_description: 'ልደታ ክፍለ ከተማ ወጣቶች ጽ/ቤት 800 ወጣቶችን የሙያ ክህሎት ሥልጠናዎች ምዝጋቧቸዋል።',
      description:       'ልደታ ክፍለ ከተማ ወጣቶችና ስፖርት ጽ/ቤት ከ18 እስከ 35 ዓመት 800 ወጣቶችን ቅርብ ሙያ ክህሎት ሥልጠናዎች ምዝጋቧቸዋል። ሥልጠናው ኢንፎርሜሽን ቴክኖሎጂ፣ ስፌት ፋሽን ዲዛይን ና ሸክምና ምሰሶ ሥራ ያካትታል። ፕሮግራሙ ምሩቃን ለ70% ሥራ ያቀርቧቸዋል። ቀጣዩ ዙር ምዝገባ ቅድሚያ ለሴቶች፣ አካል ጉዳተኞችና ዝቅተኛ ቤተሰቦቻቸው ሕፃናት ተሰጥቷቸዋል።',
      category:          'ትምህርት',
    },
    orm: {
      title:             'Wiirtuu Leenjii Dandeettii Dargaggoota 800 Galmeesse',
      short_description: 'Waajjirri Dargaggoota Kutaa Magaalaa Lideta dargaggoo 800 sagantaa leenjii dandeettii ogummaa haaraadhaf galmeesse.',
      description:       'Waajjirri Dargaggoota fi Ispoortii Kutaa Magaalaa Lideta dargaggoo waggaa 18 hanga 35 ta\'an 800 sagantaa leenjii dandeettii ogummaa haaraadhaaf galmeesseera. Leenjiin IT, uffata ho\'isuu fi ijaarsa ni hammata. Sagantaan kana dura dhibbeentaa 70 ol hojii argatan. Galmeessa wiirtuu itti aanuuf dursa dubartootaa, qaamni miidhameefi maatii galii gadi-aanaa qabaniif kenname.',
      category:          'Barnoota',
    },
  },

  'Renovated Lideta Central Market Opens to Merchants and Public': {
    amh: {
      title:             'ታደሰው ልደታ ዋናው ገበያ ለነጋዴዎችና ሕዝብ ተከፈተ',
      short_description: '14 ወር ግንባታ ካለቀ በኋላ ሙሉ ታደሰው ልደታ ዋናው ገበያ ዘመናዊ ሱቆቹ ሳኒቴሽን ና የእሳት ደህንነት ሥርዓቶቹ ጋር ተከፈተ።',
      description:       '14 ወር ከፍተኛ ግንባታ ካለቀ በኋላ ሙሉ ታደሰው ልደታ ዋናው ገበያ ለነጋዴዎችና ሕዝብ ተከፈተ። ፕሮጀክቱ ጠባቡ ጥፍ ባዩ ገበያ ከ800 ቋሚ ሱቆቹ ቁጥር ያለ ዘመናዊ ቦታ ወደ ቀይሮታል። ፍሬ ጥቁር ወርቅ፣ ለብሰው ኢሌክትሮኒክስ ና ምግብ አገልግሎት ልዩ ቦታዎቹ ናቸው። ዋናዋ ቆሻሻ አወጋገድ ሥርዓት፣ ሳኒቴሽን ሕዳጎቻ ና CCTV ክትትሉ ፍሬዎቹ ናቸው።',
      category:          'መሠረተ ልማት',
    },
    orm: {
      title:             'Gabatee Giddugaleessa Lideta Haaromsame Daldaltoota fi Uummataaf Baname',
      short_description: 'Gabatee Giddugaleessa Lideta baatii 14 ijaaramee guutummaatti haaromsamee bantii ammayyaa waliin banameera.',
      description:       'Gabatee Giddugaleessa Lideta erga ijaarsi cimaa baatii 14 erga xumuramee booda daldaltoota fi uummataaf itti banameera. Pirojektiin haaromsaa gabatee cufaa mancaa\'aa ture gara wiirtuu daldala ammayyaa teessoo bantii 800 ol qabu jijjiire. Naannoo addaa oomisha qilleensa qabate, uffata, elektirooniksi fi tajaajila nyaataaf; sirna bulchiinsa qotiyyoo fi to\'annoo CCTV ni hammatu.',
      category:          'Bu\'uura',
    },
  },

  'Lideta Sub-City Recognized for Excellence in Public Service Delivery': {
    amh: {
      title:             'ልደታ ክፍለ ከተማ ለሕዝብ አገልግሎት ዕጽዋ ሽልማት ተቀበለ',
      short_description: 'ልደታ ክፍለ ከተማ አስተዳደር ለሁለተኛ ተከታይ ዓመት የአዲስ አበባ ምርጥ ሕዝብ አገልግሎት ሽልማት ተቀበለ።',
      description:       'ልደታ ክፍለ ከተማ አስተዳደር ለሁለተኛ ተከታይ ዓመት የአዲስ አበባ ከተማ አስተዳደር ምርጥ ሕዝብ አገልግሎት ሽልማት ተቀበለ። ሽልማቱ ሕዝብ አገልግሎት ጥራት፣ ዜጎች እርካታ ና አስተዳደር ግልፅነት ወቅታዊ አፈፃፀምን ይሸልማል። ሽልሙ ዓመታዊ ጉባኤ ላይ ቀርቦ ልደታ የጉዳይ ጊዜ 42% ቀንሷል፣ ዜጎች ዕርካታ 87% ደርሷል ና ዲጂታሉ ቅሬታ ምስሪት ሙሉ ቀርቦ ሥራ ላይ ሆኗ።',
      category:          'ክንውኖች',
    },
    orm: {
      title:             'Kutaan Magaalaa Lideta Badhaasa Qulqullina Tajaajila Uummataa Fudhate',
      short_description: 'Bulchiinsi Kutaa Magaalaa Lideta Badhaasa Qulqullina Tajaajila Uummataa waggaa lammataaf wal-duraa duubaan fudhate.',
      description:       'Bulchiinsi Kutaa Magaalaa Lideta Badhaasa Qulqullina Tajaajila Uummataa Bulchiinsa Magaalaa Finfinnee waggaa lammataaf wal-duraa duubaan fudhate. Tajaajila qulqullina, gammachuu lammii fi iftoominaa bulchiinsaatiin raawwii ol\'aanaa agarsiise. Badhaasni milkaa\'ina Lideta eeruun: yeroo eeggannaa tajaajilaa giddu-galeessaa dhibbeentaa 42tiin hir\'isuu, lammiidhaan maxxanfame dhibbeentaa 87 ta\'uun, fi sirna bulchiinsa komii dijitaalaa guutummaatti hojjetu hojiirra oolchuun.',
      category:          'Taatee',
    },
  },
}

// ─── Patch function ──────────────────────────────────────────────────────────
async function patchTranslations() {
  // Fetch all articles that are missing translations
  const rows = await pool`
    SELECT n.id, n.title
    FROM news n
    LEFT JOIN news_translation nt ON n.id = nt.news_id
    WHERE nt.news_id IS NULL
       OR (nt.amh->>'title' IS NULL OR nt.amh->>'title' = '')
    ORDER BY n.id`

  console.log(`\n🔧 Patching translations for ${rows.length} articles...\n`)

  let success = 0
  for (const row of rows) {
    const trans = TRANSLATIONS[row.title]
    if (!trans) {
      console.log(`  ⚠  No translation found for: "${row.title.slice(0, 60)}" — skipping`)
      continue
    }

    try {
      // Check if a translation row already exists (may exist but be empty)
      const existing = await pool`SELECT 1 FROM news_translation WHERE news_id = ${row.id}`
      if (existing.length > 0) {
        await pool`
          UPDATE news_translation
          SET amh = ${JSON.stringify(trans.amh)}::jsonb,
              orm = ${JSON.stringify(trans.orm)}::jsonb
          WHERE news_id = ${row.id}`
      } else {
        await pool`
          INSERT INTO news_translation (news_id, amh, orm)
          VALUES (${row.id}, ${JSON.stringify(trans.amh)}::jsonb, ${JSON.stringify(trans.orm)}::jsonb)`
      }
      console.log(`  ✓ [${row.id}] ${row.title.slice(0, 60)}`)
      success++
    } catch (err) {
      console.error(`  ✗ [${row.id}] ${err.message}`)
    }
  }

  console.log(`\n✅ Done — ${success} articles patched.\n`)
  process.exit(0)
}

patchTranslations().catch(err => { console.error(err); process.exit(1) })
