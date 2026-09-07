SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_hash` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified` tinyint(1) DEFAULT '0',
  `two_fa_enabled` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `phone`, `password_hash`, `email_verified`, `two_fa_enabled`, `created_at`) VALUES
(1, 'Noah', 'Tesfaye', 'noahte2020@gmail.com', '0988471869', '$2b$10$cjmBBFf7FWB3nyLhdndIj.F1jx50eC18ztRxakG88b5qnZHLUURYG', 0, 1, '2026-07-05 12:14:57'),
(2, 'Noah', 'Tesfaye', 'noahte2019@gmail.com', '0988471869', '$2b$10$T6NXJiAuWVLahX8LrmHE5eYYGZjjsdhSYyeoYzwxL/d/6GO8w75Im', 0, 1, '2026-07-19 03:25:09');

SET FOREIGN_KEY_CHECKS = 1;
