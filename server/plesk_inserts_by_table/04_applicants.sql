SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `applicants`;
CREATE TABLE `applicants` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `vacancy_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cv_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'submitted',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `applicants` (`id`, `vacancy_id`, `user_id`, `first_name`, `last_name`, `email`, `phone`, `cv_path`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, 'Noah', 'Tesfaye', 'noah@gmail.com', '0909090909', NULL, 'submitted', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(2, 5, NULL, 'Abebe', 'Kebede', 'abebe.kebede@example.com', '0911122334', NULL, 'accepted', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(3, 12, NULL, 'Mekdes', 'Tesfaye', 'mekdes.tesfaye@example.com', '0922233445', NULL, 'reviewing', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(4, 3, NULL, 'Yohannes', 'Girma', 'yohannes.girma@example.com', '0933344556', NULL, 'rejected', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(5, 18, NULL, 'Selamawit', 'Assefa', 'selamawit.assefa@example.com', '0944455667', NULL, 'submitted', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(6, 7, NULL, 'Tewodros', 'Haile', 'tewodros.haile@example.com', '0955566778', NULL, 'accepted', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(7, 14, NULL, 'Mulu', 'Mengistu', 'mulu.mengistu@example.com', '0966677889', NULL, 'reviewing', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(8, 2, NULL, 'Dawit', 'Worku', 'dawit.worku@example.com', '0977788990', NULL, 'accepted', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(10, 9, NULL, 'Solomon', 'Berhanu', 'solomon.berhanu@example.com', '0999900112', NULL, 'accepted', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(11, 16, NULL, 'Aster', 'Mohammed', 'aster.mohammed@example.com', '0900011223', NULL, 'reviewing', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(12, 4, NULL, 'Bereket', 'Alemu', 'bereket.alemu@example.com', '0911234567', NULL, 'rejected', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(13, 11, NULL, 'Rahel', 'Negash', 'rahel.negash@example.com', '0922345678', NULL, 'rejected', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(14, 8, NULL, 'Elias', 'Tadesse', 'elias.tadesse@example.com', '0933456789', NULL, 'submitted', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(15, 20, NULL, 'Genet', 'Gebre', 'genet.gebre@example.com', '0944567890', NULL, 'accepted', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(16, 1, NULL, 'Samuel', 'Tekle', 'samuel.tekle@example.com', '0955678901', NULL, 'rejected', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(17, 17, NULL, 'Marta', 'Ayele', 'marta.ayele@example.com', '0966789012', NULL, 'submitted', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(18, 6, NULL, 'Kebede', 'Teshome', 'kebede.teshome@example.com', '0977890123', NULL, 'reviewing', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(19, 13, NULL, 'Zenebe', 'Hagos', 'zenebe.hagos@example.com', '0988901234', NULL, 'reviewing', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(20, 10, NULL, 'Bethelhem', 'Molla', 'bethelhem.molla@example.com', '0999012345', NULL, 'rejected', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(21, 15, NULL, 'Fikadu', 'Abraham', 'fikadu.abraham@example.com', '0900123456', NULL, 'submitted', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(22, 12, NULL, 'Tigist', 'Belay', 'tigist.belay@example.com', '0911345678', NULL, 'accepted', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(23, 5, NULL, 'Yared', 'Desta', 'yared.desta@example.com', '0922456789', NULL, 'reviewing', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(24, 3, NULL, 'Hirut', 'Kassa', 'hirut.kassa@example.com', '0933567890', NULL, 'rejected', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(26, 8, NULL, 'Saron', 'Gebremichael', 'saron.gebremichael@example.com', '0955789012', NULL, 'accepted', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(27, 14, NULL, 'Asnake', 'Mekonnen', 'asnake.mekonnen@example.com', '0966890123', NULL, 'reviewing', '2025-12-17 19:49:00', '2025-12-17 19:49:00');
INSERT INTO `applicants` (`id`, `vacancy_id`, `user_id`, `first_name`, `last_name`, `email`, `phone`, `cv_path`, `status`, `created_at`, `updated_at`) VALUES
(28, 2, NULL, 'Kidist', 'Admasu', 'kidist.admasu@example.com', '0977901234', NULL, 'rejected', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(29, 16, NULL, 'Endalkachew', 'Bekele', 'endalkachew.bekele@example.com', '0988012345', NULL, 'submitted', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(30, 9, NULL, 'Mihret', 'Habte', 'mihret.habte@example.com', '0999123456', NULL, 'accepted', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(31, 7, NULL, 'Zewdie', 'Kiros', 'zewdie.kiros@example.com', '0900234567', NULL, 'reviewing', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(32, 18, NULL, 'Rediet', 'Fantahun', 'rediet.fantahun@example.com', '0911456789', NULL, 'rejected', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(33, 4, NULL, 'Nebiyu', 'Gebreyesus', 'nebiyu.gebreyesus@example.com', '0922567890', NULL, 'submitted', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(34, 11, NULL, 'Hewan', 'Tsegaye', 'hewan.tsegaye@example.com', '0933678901', NULL, 'accepted', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(35, 20, NULL, 'Mikias', 'Yilma', 'mikias.yilma@example.com', '0944789012', NULL, 'reviewing', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(36, 1, NULL, 'Birtukan', 'Asfaw', 'birtukan.asfaw@example.com', '0955890123', NULL, 'rejected', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(37, 13, NULL, 'Desta', 'Melaku', 'desta.melaku@example.com', '0966901234', NULL, 'submitted', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(38, 6, NULL, 'Kidan', 'Gidey', 'kidan.gidey@example.com', '0977012345', NULL, 'accepted', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(39, 15, NULL, 'Mekonnen', 'Asrat', 'mekonnen.asrat@example.com', '0988123456', NULL, 'reviewing', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(40, 10, NULL, 'Feven', 'Mulatu', 'feven.mulatu@example.com', '0999234567', NULL, 'rejected', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(41, 17, NULL, 'Eyob', 'Tesfaye', 'eyob.tesfaye@example.com', '0900345678', NULL, 'submitted', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(42, 12, NULL, 'Ruth', 'Bekele', 'ruth.bekele@example.com', '0911567890', NULL, 'accepted', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(43, 5, NULL, 'Sisay', 'Gebru', 'sisay.gebru@example.com', '0922678901', NULL, 'reviewing', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(44, 3, NULL, 'Tsehay', 'Alemayehu', 'tsehay.alemayehu@example.com', '0933789012', NULL, 'rejected', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(46, 8, NULL, 'Yordanos', 'Hadgu', 'yordanos.hadgu@example.com', '0955901234', NULL, 'accepted', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(47, 14, NULL, 'Bezawit', 'Kumela', 'bezawit.kumela@example.com', '0966012345', NULL, 'reviewing', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(48, 2, NULL, 'Daniel', 'Hailu', 'daniel.hailu@example.com', '0977123456', NULL, 'rejected', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(49, 16, NULL, 'Sara', 'Workneh', 'sara.workneh@example.com', '0988234567', NULL, 'submitted', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(50, 9, NULL, 'Abel', 'Mekuria', 'abel.mekuria@example.com', '0999345678', NULL, 'accepted', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(51, 7, NULL, 'Mimi', 'Tadesse', 'mimi.tadesse@example.com', '0900456789', NULL, 'reviewing', '2025-12-17 19:49:00', '2025-12-17 19:49:00'),
(52, 1, NULL, 'tester', '', 'tester@gmail.com', '0909090909', '/uploads/cvs/52.pdf', 'submitted', '2025-12-18 07:53:27', '2025-12-18 07:53:27'),
(53, 1, NULL, 'tester', '', 'tester@gmail.com', '0909090909', '/uploads/cvs/53.pdf', 'submitted', '2025-12-18 07:53:29', '2025-12-18 07:53:29');
INSERT INTO `applicants` (`id`, `vacancy_id`, `user_id`, `first_name`, `last_name`, `email`, `phone`, `cv_path`, `status`, `created_at`, `updated_at`) VALUES
(54, 20, NULL, 'i wanna', 'work', 'iwannawork@gmail.com', '0923546578', '/uploads/cvs/54.pdf', 'submitted', '2025-12-18 14:20:15', '2025-12-18 14:56:05'),
(55, 14, NULL, 'bbb', 'bbb', 'bb@bb', '0987667899', '/uploads/cvs/55.pdf', 'reviewing', '2025-12-18 14:57:52', '2025-12-18 14:58:37'),
(56, 10, NULL, 'applicant', 'sanitation', 'applicant@gmail.com', '098778989', '/uploads/cvs/56.pdf', 'submitted', '2025-12-18 16:16:41', '2025-12-18 16:17:28'),
(57, 14, NULL, 'public', 'applicant', 'public@gmail.com', '093433434', '/uploads/cvs/57.pdf', 'submitted', '2025-12-18 16:21:04', '2025-12-18 16:21:04'),
(59, 2, NULL, 'Nathan', 'Ashebir', 'natiash@gmail.com', '0932085367', '/uploads/cvs/59.pdf', 'submitted', '2026-04-02 13:44:03', '2026-04-02 13:44:03');

SET FOREIGN_KEY_CHECKS = 1;
