SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `otp_tokens`;
CREATE TABLE `otp_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `purpose` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` timestamp NOT NULL,
  `used` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `otp_tokens` (`id`, `email`, `token`, `purpose`, `entity_type`, `expires_at`, `used`, `created_at`) VALUES
(1, 'noahte2020@gmail.com', '410309', 'verify_email', 'user', '2026-07-05 12:24:57', 1, '2026-07-05 12:14:57'),
(2, 'noahte2020@gmail.com', '866879', 'verify_email', 'user', '2026-07-05 12:28:28', 1, '2026-07-05 12:18:28'),
(3, 'noahte2020@gmail.com', '877478', 'verify_email', 'user', '2026-07-05 12:28:32', 0, '2026-07-05 12:18:32'),
(4, 'noah@gmail.com', '747689', '2fa_login', 'admin', '2026-07-05 12:34:31', 0, '2026-07-05 12:24:31'),
(5, 'abekebe@gmail.com', '425403', '2fa_login', 'admin', '2026-07-05 12:39:12', 0, '2026-07-05 12:29:13'),
(6, 'noahte2020@gmail.com', '708171', 'reset_password', 'user', '2026-07-06 17:58:40', 0, '2026-07-06 17:48:40');

SET FOREIGN_KEY_CHECKS = 1;
