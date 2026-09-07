SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `complaints`;
CREATE TABLE `complaints` (
  `complaint_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `complainer_city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `complainer_subcity` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `complainer_woreda` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `complainer_house_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `complaint_subcity` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `complaint_woreda` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'assigning',
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `concerned_staff_member` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photos` json DEFAULT NULL,
  `videos` json DEFAULT NULL,
  `audios` json DEFAULT NULL,
  `estimated_resolution_timeframe` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estimated_resolution_date` date DEFAULT NULL,
  `admin_response` text COLLATE utf8mb4_unicode_ci,
  `admin_contact_phone` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`complaint_id`),
  UNIQUE KEY `complaint_id` (`complaint_id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `complaints` (`complaint_id`, `user_id`, `first_name`, `last_name`, `email`, `phone`, `complainer_city`, `complainer_subcity`, `complainer_woreda`, `complainer_house_number`, `complaint_subcity`, `complaint_woreda`, `type`, `status`, `description`, `concerned_staff_member`, `photos`, `videos`, `audios`, `estimated_resolution_timeframe`, `estimated_resolution_date`, `admin_response`, `admin_contact_phone`, `created_at`) VALUES
(18, NULL, 'Noah', 'Tesfaye', 'noahte2020@gmail.com', '988471869', 'Addis Ababa', 'Yeka', '02', '2235', 'Lideta', '01', 'Health Bureau', 'in progress', 'complaint regarding the health bureau', 'abebe', '[]', '[]', '[]', NULL, NULL, NULL, NULL, '2025-12-26 14:50:12'),
(19, NULL, 'tester', 'Kebede', 'noah@gmail.com', '+251 988471869', 'Addis Ababa', 'Lideta', '02', '2235', 'Gullele', '03', 'Justice Bureau', 'assigning', 'compplaint for justice', 'bbb', '[]', '[]', '[]', NULL, NULL, NULL, NULL, '2025-12-29 02:45:01'),
(20, NULL, 'tsigereda', 'solomon', 'redtsigereda@yahoo.com', '+251 0913289998', 'addis abeba', 'Lideta', '08', '823', 'Lideta', '8', 'Peace and Security Bureau', 'assigning', 'በጋራ ጊቢ ወሰጥ ህገ ወጥ ንግድ እየተካሄደ ሰጋት የፈጠረ ቢሆንም አመራሩ ቸግሩን ለመፍታት ፈቃደኘ አለመሆን', 'አፈወርቅ', '[]', '[]', '[]', NULL, NULL, NULL, NULL, '2026-01-02 10:29:19'),
(21, NULL, 'Noah', 'Tesfaye', 'noahte2020@gmail.com', '+251 0988471869', 'Addis Ababa', 'Yeka', '02', '2235', 'Lideta', '03', 'Justice Bureau', 'assigning', 'complaint regarding lideta', 'abebe', '[]', '[]', '[]', NULL, NULL, NULL, NULL, '2026-01-27 11:38:37'),
(22, NULL, 'Alemayehu', 'Girma', 'alema.girma@email.com', '+251911223344', 'Addis Ababa', 'Bole', '03', '245B', 'Bole', '04', 'Health Bureau', 'in progress', 'The local clinic lacks basic medical supplies', 'Dr. Tewodros Bekele', '[]', '[]', '[]', NULL, NULL, NULL, NULL, '2026-01-27 12:09:05'),
(23, NULL, 'Selamawit', 'Tesfaye', 'selam.t@email.com', '+251922334455', 'Addis Ababa', 'Kirkos', '02', '78', 'Kirkos', '01', 'Construction Permit and Inspection Bureau', 'assigning', 'Construction noise continues past permitted hours', 'Eng. Dawit Haile', '[]', '[]', '[]', NULL, NULL, NULL, NULL, '2026-01-27 12:09:05'),
(24, NULL, 'Yonas', 'Mekonnen', 'yonas.m@email.com', '+251933445566', 'Addis Ababa', 'Yeka', '05', '112C', 'Yeka', '06', 'Urban Beautification and Green Development Bureau', 'resolved', 'Public park needs maintenance and cleaning', 'Mrs. Frehiwot Assefa', NULL, '[]', '[]', NULL, NULL, NULL, NULL, '2026-01-27 12:09:05'),
(25, NULL, 'Meron', 'Getachew', 'meron.get@email.com', '+251944556677', 'Addis Ababa', 'Arada', '01', '34', 'Arada', '02', 'Land Ownership and Information Bureau', 'in progress', 'Delayed processing of property ownership documents', 'Mr. Solomon Tadesse', NULL, '[]', '[]', NULL, NULL, NULL, NULL, '2026-01-27 12:09:05'),
(26, NULL, 'Tewodros', 'Abebe', 'tewodros.a@email.com', '+251955667788', 'Addis Ababa', 'Lideta', '04', '56A', 'Lideta', '03', 'Roads and Transport Bureau', 'assigning', 'Poor road conditions causing traffic congestion', 'Eng. Fitsum Gebre', NULL, '[]', '[]', NULL, NULL, NULL, NULL, '2026-01-27 12:09:05'),
(27, NULL, 'Birtukan', 'Assefa', 'birtukan.a@email.com', '+251966778899', 'Addis Ababa', 'Gullele', '06', '89', 'Gullele', '05', 'Sanitation Management Bureau', 'in progress', 'Uncollected garbage in the neighborhood', 'Mr. Habtamu Zeleke', NULL, '[]', '[]', NULL, NULL, NULL, NULL, '2026-01-27 12:09:05'),
(28, NULL, 'Dawit', 'Hailu', 'dawit.h@email.com', '+251977889900', 'Addis Ababa', 'Nifas Silk', '03', '123B', 'Nifas Silk', '02', 'Youth and Sports Bureau', 'resolved', 'Youth center lacks sports equipment', 'Mrs. Eden Teshome', NULL, '[]', '[]', NULL, NULL, NULL, NULL, '2026-01-27 12:09:05'),
(29, NULL, 'Hana', 'Solomon', 'hana.s@email.com', '+251988990011', 'Addis Ababa', 'Kolfe', '05', '45', 'Kolfe', '04', 'Trade Bureau', 'assigning', 'Delay in business license renewal', 'Ms. Sara Mohammed', NULL, '[]', '[]', NULL, NULL, NULL, NULL, '2026-01-27 12:09:05'),
(30, NULL, 'Elias', 'Kebede', 'elias.k@email.com', '+251999001122', 'Addis Ababa', 'Bole', '02', '67C', 'Bole', '01', 'Main Executive Office', 'in progress', 'Irregular water supply in the subcity', 'Eng. Michael Yohannes', NULL, '[]', '[]', NULL, NULL, NULL, NULL, '2026-01-27 12:09:05'),
(31, NULL, 'Ruth', 'Gebremichael', 'ruth.g@email.com', '+251900112233', 'Addis Ababa', 'Yeka', '04', '234', 'Yeka', '03', 'Education Bureau', 'resolved', 'School facilities need urgent repair', 'Mr. Daniel Asfaw', NULL, '[]', '[]', NULL, NULL, NULL, NULL, '2026-01-27 12:09:05'),
(32, NULL, 'Samuel', 'Wondimu', 'samuel.w@email.com', '+251911223355', 'Addis Ababa', 'Kirkos', '01', '88A', 'Kirkos', '02', 'Food and Drug Bureau', 'in progress', 'Unsafe food sold in local market', 'Mrs. Tigist Alemu', NULL, '[]', '[]', NULL, NULL, NULL, NULL, '2026-01-27 12:09:05'),
(33, NULL, 'Mihret', 'Alemayehu', 'mihret.a@email.com', '+251922334466', 'Addis Ababa', 'Arada', '03', '156', 'Arada', '01', 'Finance Bureau', 'assigning', 'Tax assessment discrepancy issue', 'Mr. Yared Lemma', NULL, '[]', '[]', NULL, NULL, NULL, NULL, '2026-01-27 12:09:05'),
(34, NULL, 'Nahom', 'Tekle', 'nahom.t@email.com', '+251933445577', 'Addis Ababa', 'Lideta', '02', '77B', 'Lideta', '01', 'Traffic Management Bureau', 'resolved', 'Traffic lights not functioning properly', 'Officer Samuel Bekele', NULL, '[]', '[]', NULL, NULL, NULL, NULL, '2026-01-27 12:09:05'),
(35, NULL, 'Liya', 'Mulugeta', 'liya.m@email.com', '+251944556688', 'Addis Ababa', 'Gullele', '04', '33', 'Gullele', '03', 'Vehicle and Transport Bureau', 'in progress', 'Lack of public transportation in the area', 'Mrs. Rahel Tesfaye', NULL, '[]', '[]', NULL, NULL, NULL, NULL, '2026-01-27 12:09:05'),
(36, NULL, 'Kaleb', 'Yohannes', 'kaleb.y@email.com', '+251955667799', 'Addis Ababa', 'Nifas Silk', '01', '99C', 'Nifas Silk', '02', 'Labor and Skills Bureau', 'assigning', 'Unfair labor practices reported at factory', 'Mr. Berhanu Girma', NULL, '[]', '[]', NULL, NULL, NULL, NULL, '2026-01-27 12:09:05'),
(37, NULL, 'Nathan', 'Asheber', 'natiash@gmail.com', '+251 946546700', 'Addis Ababa', 'Akaki Kality', '05', '6577', 'Akaki Kality', '05', 'Main Executive Office', 'assigning', 'Complaint for testing out audio and video recording evidence', NULL, '[{"name":"Screenshot 2026-04-02 at 2.26.57â¯PM.png","path":"/uploads/photos/Screenshot_2026_04_02_at_2_26_57___PM-1775147702622-357231258.png","size":55350,"mimetype":"image/png"}]', '[]', '[]', NULL, NULL, NULL, NULL, '2026-04-02 13:06:42'),
(38, NULL, 'Noah', 'Tesfaye', 'noahte2020@gmail.com', '+251 988471869', 'Addis Ababa', 'Arada', '05', '6577', 'Akaki Kality', '05', 'Justice Bureau', 'assigning', 'audio and video', NULL, '[]', '[]', '[]', NULL, NULL, NULL, NULL, '2026-04-02 13:23:50'),
(40, NULL, 'Noah', 'Tesfaye', 'noahte2020@gmail.com', '+251 988471869', 'Addis Ababa', 'Gullele', '02', '6577', 'Yeka', '01', 'Main Executive Office', 'assigning', 'audio and video final', NULL, '[{"name":"screen.png","path":"/uploads/photos/screen-1775147451912-570735624.png","size":295747,"mimetype":"image/png"}]', '[{"name":"recorded_video_1775147462181.webm","path":"/uploads/videos/recorded_video_1775147462181-1775147531369-842420426.webm","size":806449,"mimetype":"video/webm"}]', '[{"name":"recorded_audio_1775147475199.webm","path":"/uploads/audios/recorded_audio_1775147475199-1775147508450-988904831.webm","size":63086,"mimetype":"audio/webm"}]', NULL, NULL, NULL, NULL, '2026-07-19 12:27:42'),
(43, 1, 'Noah', 'Tesfaye', 'noahte2020@gmail.com', '+251 0988471869', '', '', '', '', 'Addis Ketema', '05', 'Health Bureau', 'in progress', 'some complaint', NULL, '[]', '[]', '[]', '5 - 7 Days', '2026-09-12 21:00:00', 'The complaint will be solved in 5 to 7 days. If not, please contact the phone number attached.', '0988471869', '2026-07-19 13:15:47'),
(44, NULL, 'MySQL', 'Tester', 'mysql@lideta.gov', '0911223344', 'Addis Ababa', 'Lideta', '03', NULL, NULL, NULL, 'Sanitation Management Bureau', 'assigning', 'Testing complaint insertion and retrieval on local MySQL with Drizzle ORM.', NULL, '[]', '[]', '[]', NULL, NULL, NULL, NULL, '2026-09-07 05:30:42');

SET FOREIGN_KEY_CHECKS = 1;
