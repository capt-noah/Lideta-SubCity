CREATE TABLE `activity_logs` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`admin_id` varchar(64) NOT NULL,
	`action` varchar(100) NOT NULL,
	`entity_type` varchar(100) NOT NULL,
	`entity_title` varchar(255),
	`username` varchar(100),
	`details` json,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `activity_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `admin_settings` (
	`admin_id` varchar(64) NOT NULL,
	`theme` varchar(20) DEFAULT 'light',
	`font_size` varchar(20) DEFAULT 'medium',
	`language` varchar(20) DEFAULT 'english',
	CONSTRAINT `admin_settings_admin_id` PRIMARY KEY(`admin_id`)
);
--> statement-breakpoint
CREATE TABLE `admins` (
	`admin_id` varchar(64) NOT NULL,
	`first_name` varchar(100) NOT NULL,
	`last_name` varchar(100) NOT NULL,
	`username` varchar(100) NOT NULL,
	`email` varchar(150) NOT NULL,
	`phone_number` varchar(150) NOT NULL,
	`residency` varchar(100) NOT NULL,
	`password_hash` text NOT NULL,
	`role` varchar(50) DEFAULT 'admin',
	`gender` varchar(20),
	`photo` text,
	`email_verified` boolean DEFAULT false,
	`two_fa_enabled` boolean DEFAULT false,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `admins_admin_id` PRIMARY KEY(`admin_id`),
	CONSTRAINT `admins_username_unique` UNIQUE(`username`),
	CONSTRAINT `admins_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `applicants` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`vacancy_id` int NOT NULL,
	`user_id` int,
	`first_name` varchar(100) NOT NULL,
	`last_name` varchar(100) NOT NULL,
	`email` varchar(150),
	`phone` varchar(50),
	`cv_path` varchar(255),
	`status` varchar(50) DEFAULT 'submitted',
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `applicants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `complaints` (
	`complaint_id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`first_name` varchar(100) NOT NULL,
	`last_name` varchar(100) NOT NULL,
	`email` varchar(150),
	`phone` varchar(50),
	`complainer_city` varchar(100),
	`complainer_subcity` varchar(100),
	`complainer_woreda` varchar(100),
	`complainer_house_number` varchar(100),
	`complaint_subcity` varchar(100),
	`complaint_woreda` varchar(100),
	`type` varchar(100),
	`status` varchar(50) DEFAULT 'assigning',
	`description` text NOT NULL,
	`concerned_staff_member` varchar(255),
	`photos` json,
	`videos` json,
	`audios` json,
	`estimated_resolution_timeframe` varchar(100),
	`estimated_resolution_date` date,
	`admin_response` text,
	`admin_contact_phone` varchar(100),
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `complaints_complaint_id` PRIMARY KEY(`complaint_id`)
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`first_name` varchar(100) NOT NULL,
	`last_name` varchar(100) NOT NULL,
	`email` varchar(150) NOT NULL,
	`message` text NOT NULL,
	`photos` json,
	`status` varchar(50) DEFAULT 'pending',
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`events_id` serial AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`location` varchar(255),
	`start_date` date,
	`end_date` date,
	`status` varchar(50) DEFAULT 'upcoming',
	`photos` json,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `events_events_id` PRIMARY KEY(`events_id`)
);
--> statement-breakpoint
CREATE TABLE `events_translation` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`event_id` int,
	`amh` json,
	`orm` json,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `events_translation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `news` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`short_description` varchar(500),
	`description` text NOT NULL,
	`category` varchar(100) NOT NULL,
	`photo` json,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `news_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `news_translation` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`news_id` int,
	`amh` json,
	`orm` json,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `news_translation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `otp_tokens` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`email` varchar(150) NOT NULL,
	`token` varchar(100) NOT NULL,
	`purpose` varchar(50) NOT NULL,
	`entity_type` varchar(50) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`used` boolean DEFAULT false,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `otp_tokens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `service_satisfaction` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`gender` varchar(20),
	`age` varchar(20),
	`marital_status` varchar(50),
	`education_level` varchar(100),
	`employment_status` varchar(100),
	`district` varchar(100),
	`visits` int,
	`service_requested` json,
	`q1` varchar(50),
	`q2` varchar(50),
	`q3` varchar(50),
	`q4` varchar(50),
	`q5` varchar(50),
	`q6` varchar(50),
	`q7` varchar(50),
	`q8` varchar(50),
	`q9` varchar(50),
	`q10` varchar(50),
	`q11` varchar(50),
	`additional_comments` text,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `service_satisfaction_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`first_name` varchar(100) NOT NULL,
	`last_name` varchar(100) NOT NULL,
	`email` varchar(150) NOT NULL,
	`phone` varchar(50),
	`password_hash` text NOT NULL,
	`email_verified` boolean DEFAULT false,
	`two_fa_enabled` boolean DEFAULT false,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `vacancies` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`short_description` varchar(500),
	`description` text NOT NULL,
	`location` varchar(255) NOT NULL,
	`salary` varchar(100) NOT NULL,
	`type` varchar(50) NOT NULL,
	`category` varchar(50) NOT NULL,
	`skills` json,
	`responsibilities` json,
	`qualifications` json,
	`start_date` date,
	`end_date` date,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vacancies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vacancy_translation` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`vacancy_id` int,
	`amh` json,
	`orm` json,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `vacancy_translation_id` PRIMARY KEY(`id`)
);
