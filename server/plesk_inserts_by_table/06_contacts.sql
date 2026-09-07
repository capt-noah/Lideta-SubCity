SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `contacts`;
CREATE TABLE `contacts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `photos` json DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `contacts` (`id`, `first_name`, `last_name`, `email`, `message`, `photos`, `status`, `created_at`) VALUES
(1, 'Noah', 'Tesfaye', 'noahte2020@gmail.com', 'help me', '[]', 'resolved', '2025-12-28 17:36:30'),
(2, 'Noah', 'Tesfaye', 'noahte2020@gmail.com', 'send help', '[]', 'resolved', '2025-12-28 17:40:55'),
(3, 'Yohannes', 'Assefa', 'email@gmail.com', 'i need help!', '[]', 'pending', '2025-12-29 02:00:27'),
(4, 'Noah', 'Tesfaye', 'noahte2020@gmail.com', 'helpppp', '[]', 'pending', '2026-01-05 07:47:23');

SET FOREIGN_KEY_CHECKS = 1;
