SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `admin_settings`;
CREATE TABLE `admin_settings` (
  `admin_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `theme` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'light',
  `font_size` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'medium',
  `language` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'english',
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `admin_settings` (`admin_id`, `theme`, `font_size`, `language`) VALUES
('55e605bdc0', 'light', 'medium', 'english'),
('f64ae6fdbb', 'light', 'medium', 'english');

SET FOREIGN_KEY_CHECKS = 1;
