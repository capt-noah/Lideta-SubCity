SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `admin_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `residency` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'admin',
  `gender` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo` text COLLATE utf8mb4_unicode_ci,
  `email_verified` tinyint(1) DEFAULT '0',
  `two_fa_enabled` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `admins_username_unique` (`username`),
  UNIQUE KEY `admins_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `admins` (`admin_id`, `first_name`, `last_name`, `username`, `email`, `phone_number`, `residency`, `password_hash`, `role`, `gender`, `photo`, `email_verified`, `two_fa_enabled`, `created_at`) VALUES
('55e605bdc0', 'Abebe', 'Kebede', 'abe_kebe', 'abekebe@gmail.com', '0912345678', 'Addis, Ababa', '$2b$10$4s9M0Oi.kgRBzmRdzcdKB.Wn78X1uEpkzC0oqAO4CajD3jexdPRNO', 'news_admin', 'Male', NULL, 1, 1, '2025-12-18 07:24:33'),
('69506aa288', 'Test', 'Admin', 'tester_admin', 'test@gmail.com', '0967546789', 'Addis Ababa', '$2b$10$Vlyk4BtbLrj8aMtKVnTjQ.IQRWd5hyyu8ZLkvMXolD4XLt023S7d6', 'admin', 'Male', NULL, 1, 1, '2025-12-18 14:03:40'),
('f64ae6fdbb', 'Noah', 'Tesfaye', 'noah', 'noah@gmail.com', '0946738145', 'Addis Ababa', '$2b$10$ez72J5MRopA1Ci7L142SAOziRFqsEk.Z9t7XuZZCaN/ki8PjCaRH6', 'superadmin', 'Male', NULL, 1, 1, '2025-12-18 07:26:11');

SET FOREIGN_KEY_CHECKS = 1;
