SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `events_translation`;
CREATE TABLE `events_translation` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `event_id` int DEFAULT NULL,
  `amh` json DEFAULT NULL,
  `orm` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `events_translation` (`id`, `event_id`, `amh`, `orm`, `created_at`) VALUES
(1, 2, '{"title":"ዓለም አቀፍ ማጠቃለያ 2025","location":"ሳር ቤት አካባቢ፣ ልደታ ክፍለ ከተማ","description":"የአካባቢ መሪዎችን እና ዓለም አቀፍ አጋሮችን አንድ ላይ የሚያመጣ የተሻጋሪ ተቋም ማጠቃለያ።"}', '{"title":"Walitti Qabduu Addunyaa 2025","location":"Naannoo Sar Bet, Lideta Sub-City","description":"Walitti qabduu garee adda addaa kan hoggantoota naannoo fi hirmaataa addunyaa walitti qabu."}', '2025-12-20 11:39:44'),
(2, 3, '{"title":"ዓለም አቀፍ ዲዛይን ፈተና","location":"ሳር ቤት አካባቢ፣ ልደታ ክፍለ ከተማ","description":"የከተማ እቅድ እና የማህበረሰብ ቦታዎችን የሚያሳይ የተጠናቀቀ ዲዛይን ፈተና።"}', '{"title":"Tarii Dizaynii Addunyaa","location":"Naannoo Sar Bet, Lideta Sub-City","description":"Tarii dizaynii guutamtuu kan qophii magaalaa fi bakka hawaasaa agarsiisu."}', '2025-12-20 11:39:44'),
(3, 4, '{"title":"ልዩ ሃሳብ እና ቴክኖሎጂ ቀን","location":"ሳር ቤት አካባቢ፣ ልደታ ክፍለ ከተማ","description":"የአካባቢ የሥራ ጀማሪ ኩባንያዎችን እና የከተማ አገልግሎቶችን የሚያሳይ ቴክኖሎጂ ማሳያ።"}', '{"title":"Guyyaa Qindeeffamaafi Teknooloojii","location":"Naannoo Sar Bet, Lideta Sub-City","description":"Agarsiisa teknooloojii kan daldalaa jalqabaa naannoo fi tajaajila magaalaa qopheessu."}', '2025-12-20 11:39:44'),
(4, 5, '{"title":"ስፖርት እና በዓል ቀን","location":"ሳር ቤት አካባቢ፣ ልደታ ክፍለ ከተማ","description":"በመጀመሪያ የሚያካትት የሚሆን የማህበረሰብ ስፖርት ቀን ውድድር፣ ፊት ቦሎ እና የቤተሰብ እንቅስቃሴዎች።"}', '{"title":"Guyyaa Ispoortiifi Ayyaanaa","location":"Naannoo Sar Bet, Lideta Sub-City","description":"Guyyaa ispoortii hawaasaa kan jalqabaa fiigaa, kubbaa miillaa, fi gochaalee maatii qabatu."}', '2025-12-20 11:39:44'),
(5, 6, '{"title":"የማህበረሰብ ንጽህና ቀን","location":"ሳር ቤት አካባቢ፣ ልደታ ክፍለ ከተማ","description":"ዓመቱን በማህበረሰብ አስተዳደር ጥረት ከፓርኮች እና ከመኖሪያ አካባቢዎች ጋር ለማደስ ይጀምሩ።"}', '{"title":"Guyyaa Qulqullina Hawaasaa","location":"Naannoo Sar Bet, Lideta Sub-City","description":"Waggaa akka qulqullina hawaasaatiin paarkota fi naannoo jireenyaa deebisuuf jalqabi."}', '2025-12-20 11:39:44'),
(6, 7, '{"title":"የወጣቶች ኮድ ማውጣት አውደ ማሰልጠኛ","location":"ዲጂታል አገልግሎት ማዕከል፣ ልደታ ክፍለ ከተማ","description":"ለአካባቢው ወጣቶች መሰረታዊ ኮድ ማውጣት እና የሮቦት ክህሎቶችን ለመማር በእጅ የሚሰጥ አውደ ማሰልጠኛ።"}', '{"title":"Waaksii Koodii Daa''immaa","location":"Giddugaleessa Tajaajilaa Dijitaalaa, Lideta Sub-City","description":"Waaksii harka qabu daa''immaa naannoo akka koodii jalqabaa fi qophii roobootiksii baratuuf."}', '2025-12-20 11:39:44'),
(8, 9, '{"title":"የባህል ቅርስ ቀን","status":"የሚመጡ","location":"የባህል ማዕከል፣ ልደታ ክፍለ ከተማ","description":"በአካባቢው ጥበብ፣ ሙዚቃ እና ባህላዊ እጅ ሥራ በአማካይነት በዓል እና በማሳያዎች ማስተዋወቅ።"}', '{"title":"Guyyaa Duudhaa Aadaa","status":"Dhufan","location":"Giddugaleessa Aadaa, Lideta Sub-City","description":"Baga aadaa naannoo, muuziqaa, fi hojii harka aadaa kan agarsiisaafi taphatuudhaan."}', '2025-12-20 11:39:44'),
(9, 10, '{"title":"የነፍሳት ቅነሳ ዘመቻ","status":"የሚመጡ","location":"የገበያ አደባባይ፣ ልደታ ክፍለ ከተማ","description":"ለነዋሪዎች ስለ ማደራጀት እና ዘላቂ የነፍሳት አስተዳደር የሚያስተምር የትምህርት ክንውን።"}', '{"title":"Kampaanii Hir''isa Saaphanaa","status":"Dhufan","location":"Bakka Gabaasaa, Lideta Sub-City","description":"Taatee barnootaa kan jiraattoota irra deddeebi''ii fi bulchiinsa saaphanaa dhaabbataa barsiisu."}', '2025-12-20 11:39:44'),
(10, 11, '{"title":"የህዝብ ደህንነት አውደ ማሰልጠኛ","status":"የሚመጡ","location":"የማህበረሰብ አደባባይ፣ ልደታ ክፍለ ከተማ","description":"በእሳት ደህንነት፣ የመጀመሪያ እርዳታ እና የድንገተኛ ሁኔታ ዝግጅት ላይ በይነተገናኝ ክፍሎች።"}', '{"title":"Waaksii Nagaa Ummataa","status":"Dhufan","location":"Hollaa Hawaasaa, Lideta Sub-City","description":"Kuusoota walitti dhufeenyaa eegumsa abiddaa, gargaarsa jalqabaa, fi qophii yeroo barbaachisaa irratti."}', '2025-12-20 11:39:44'),
(11, 12, '{"title":"የአካባቢ ገበሬዎች ገበያ","status":"የሚመጡ","location":"የከተማ አደባባይ፣ ልደታ ክፍለ ከተማ","description":"ነዋሪዎች በአዲስ ምርቶች እና በእጅ ሥራ ዕቃዎች ለመግዛት የአንድ ቀን ገበያ።"}', '{"title":"Gabaasa Qotee Bulaa Naannoo","status":"Dhufan","location":"Bakka Magaalaa, Lideta Sub-City","description":"Gabaasa guyyaa tokkoof kan jiraattoota akka oomisha haaraa fi meeshaa harka qabatanii bitatanii gahuuf."}', '2025-12-20 11:39:44'),
(12, 13, '{"title":"የበረዶ ወቅት ስፖርት በዓል","status":"የሚመጡ","location":"የስፖርት መስኮች፣ ልደታ ክፍለ ከተማ","description":"ለቤተሰቦች እና ለወጣቶች አስደሳች የበረዶ ወቅት ጨዋታዎች እና ውድድሮች።"}', '{"title":"Ayyaana Ispoortii Ganna","status":"Dhufan","location":"Bakka Ispoortii, Lideta Sub-City","description":"Taphaalee ganna fi walii galtee maatiifi daa''immaa kan gammachiisu."}', '2025-12-20 11:39:44'),
(13, 14, '{"title":"ጥበብ በፓርክ","status":"የሚመጡ","location":"ማዕከላዊ ፓርክ፣ ልደታ ክፍለ ከተማ","description":"በአካባቢው አርቲስቶች እና ተማሪዎች ስራዎችን የሚያሳይ ውጭ የጥበብ ማሳያ።"}', '{"title":"Fannoo Paarkii Keessatti","status":"Dhufan","location":"Paarkii Giddu Galeessaa, Lideta Sub-City","description":"Agarsiisa fannoo alaa kan qaama aartistootaa fi barattoota naannoo agarsiisu."}', '2025-12-20 11:39:44'),
(14, 15, '{"title":"የከተማ እድገት ላይ የማህበረሰብ መድረክ","status":"የሚመጡ","location":"የከተማ ምክር ቤት አደባባይ፣ ልደታ ክፍለ ከተማ","description":"ስለ አካባቢያዊ መሠረተ ልማት ፕሮጀክቶች እና የወደፊት የከተማ እቅድ ተቋሞች ውይይት።"}', '{"title":"Murtii Hawaasaa Hundeeffama Magaalaa Irratti","status":"Dhufan","location":"Hollaa Murtii Magaalaa, Lideta Sub-City","description":"Mari''i piroojektota bu''uuraa naannoo fi kaayyoo qophii magaalaa fuula duraa irratti."}', '2025-12-20 11:39:44');

SET FOREIGN_KEY_CHECKS = 1;
