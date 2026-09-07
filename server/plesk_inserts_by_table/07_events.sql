SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `events_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'upcoming',
  `photos` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`events_id`),
  UNIQUE KEY `events_id` (`events_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `events` (`events_id`, `title`, `description`, `location`, `start_date`, `end_date`, `status`, `photos`, `created_at`) VALUES
(1, 'Neighborhood Tree Planting', 'Volunteers gather to plant trees in public parks to promote greenery.', 'Central Park, Lideta Sub-City', '2025-12-14 21:00:00', '2025-12-15 21:00:00', 'upcoming', '[]', '2025-12-18 07:59:00'),
(2, 'Global Summit 2025', 'A cross-sector summit bringing together local leaders and global partners.', 'Sar Bet Area, Lideta Sub-City', '2025-12-30 21:00:00', '2026-01-30 21:00:00', 'upcoming', NULL, '2025-12-18 07:59:00'),
(3, 'World Design Challenge', 'A completed design challenge highlighting urban planning and community spaces.', 'Sar Bet Area, Lideta Sub-City', '2025-12-02 21:00:00', '2025-12-11 21:00:00', 'upcoming', NULL, '2025-12-18 07:59:00'),
(4, 'Innovation and Technology Day', 'A technology showcase featuring local startups and municipal services.', 'Sar Bet Area, Lideta Sub-City', '2025-12-10 21:00:00', '2025-12-11 21:00:00', 'upcoming', NULL, '2025-12-18 07:59:00'),
(5, 'Sports and Festival Day', 'A community sports day originally planned to include races, football, and family activities.', 'Sar Bet Area, Lideta Sub-City', '2026-01-04 21:00:00', '2026-02-04 21:00:00', 'upcoming', NULL, '2025-12-18 07:59:00'),
(6, 'Community Clean-up Day', 'Start the year with a community-led effort to refresh parks and residential blocks.', 'Sar Bet Area, Lideta Sub-City', '2026-01-19 21:00:00', '2026-02-19 21:00:00', 'upcoming', NULL, '2025-12-18 07:59:00'),
(7, 'Youth Coding Workshop', 'A hands-on workshop for local youth to learn basic coding and robotics skills.', 'Digital Service Center, Lideta Sub-City', '2025-12-17 21:00:00', '2025-12-18 21:00:00', 'upcoming', NULL, '2025-12-18 07:59:00'),
(9, 'Cultural Heritage Day', 'Celebrating local arts, music, and traditional crafts with performances and exhibits.', 'Cultural Center, Lideta Sub-City', '2025-12-22 21:00:00', '2025-12-22 21:00:00', 'upcoming', '[]', '2025-12-18 07:59:00'),
(10, 'Waste Reduction Campaign', 'Educational event to teach residents about recycling and sustainable waste management.', 'Market Square, Lideta Sub-City', '2025-12-25 21:00:00', '2025-12-26 21:00:00', 'upcoming', '[]', '2025-12-18 07:59:00'),
(11, 'Public Safety Workshop', 'Interactive sessions on fire safety, first aid, and emergency preparedness.', 'Community Hall, Lideta Sub-City', '2025-12-27 21:00:00', '2025-12-27 21:00:00', 'upcoming', '[]', '2025-12-18 07:59:00'),
(12, 'Local Farmers Market', 'A one-day market for residents to purchase fresh produce and handmade goods.', 'Town Square, Lideta Sub-City', '2026-01-01 21:00:00', '2026-01-01 21:00:00', 'upcoming', '[]', '2025-12-18 07:59:00'),
(13, 'Winter Sports Festival', 'Fun winter-themed games and competitions for families and youth.', 'Sports Grounds, Lideta Sub-City', '2026-01-07 21:00:00', '2026-01-08 21:00:00', 'upcoming', '[]', '2025-12-18 07:59:00'),
(14, 'Art in the Park', 'Outdoor art exhibition showcasing works by local artists and students.', 'Central Park, Lideta Sub-City', '2026-01-11 21:00:00', '2026-01-12 21:00:00', 'upcoming', '[]', '2025-12-18 07:59:00'),
(15, 'Community Forum on Urban Development', 'Discussion on local infrastructure projects and future city planning initiatives.', 'City Council Hall, Lideta Sub-City', '2026-01-14 21:00:00', '2026-01-14 21:00:00', 'upcoming', '[]', '2025-12-18 07:59:00');

SET FOREIGN_KEY_CHECKS = 1;
