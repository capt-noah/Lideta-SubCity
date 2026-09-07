SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `service_satisfaction`;
CREATE TABLE `service_satisfaction` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `gender` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `age` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `marital_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `education_level` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employment_status` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `visits` int DEFAULT NULL,
  `service_requested` json DEFAULT NULL,
  `q1` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `q2` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `q3` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `q4` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `q5` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `q6` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `q7` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `q8` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `q9` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `q10` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `q11` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `additional_comments` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `service_satisfaction` (`id`, `gender`, `age`, `marital_status`, `education_level`, `employment_status`, `district`, `visits`, `service_requested`, `q1`, `q2`, `q3`, `q4`, `q5`, `q6`, `q7`, `q8`, `q9`, `q10`, `q11`, `additional_comments`, `created_at`) VALUES
(2, 'male', 'range_25_30', 'single', 'degree', 'other', 'Addis Ababa', NULL, '["development"]', 'high', 'very_low', 'low', 'low', 'high', 'high', 'very_low', 'very_high', 'high', 'high', 'low', 'It was a great service overall', '2026-01-27 11:19:37'),
(3, 'female', 'range_31_40', 'married', 'masters', 'gov_official', 'Addis Ababa', 5, '["house_sale","development","land"]', 'very_high', 'medium', 'high', 'low', 'very_high', 'medium', 'medium', 'high', 'very_low', 'high', 'very_high', NULL, '2026-01-27 11:23:50'),
(4, 'female', 'range_25_30', 'single', 'diploma', 'other', 'Addis Ababa', NULL, '["house_related"]', 'very_low', 'low', 'medium', 'medium', 'low', 'high', 'low', 'high', 'low', 'very_high', 'very_high', NULL, '2026-01-27 12:54:23');

SET FOREIGN_KEY_CHECKS = 1;
