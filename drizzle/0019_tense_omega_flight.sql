CREATE TABLE `mood_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` varchar(10) NOT NULL,
	`mood` enum('happy','neutral','sad','angry','tired') NOT NULL,
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT 'CURRENT_TIMESTAMP',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE `users` DROP INDEX `users_openId_unique`;--> statement-breakpoint
ALTER TABLE `users` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `activity_logs` MODIFY COLUMN `createdAt` timestamp DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `body_metrics` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `body_photos` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `body_report_photos` MODIFY COLUMN `createdAt` timestamp DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `body_report_templates` MODIFY COLUMN `isGlobal` tinyint;--> statement-breakpoint
ALTER TABLE `body_report_templates` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `daily_tips` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `exercises` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `fitasty_products` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `food_log_items` MODIFY COLUMN `is_autofilled` tinyint;--> statement-breakpoint
ALTER TABLE `food_log_items` MODIFY COLUMN `is_ai_autofilled` tinyint;--> statement-breakpoint
ALTER TABLE `food_log_items` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `food_logs` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `general_food_cache` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `user_profiles` MODIFY COLUMN `heightCm` decimal(5,1) NOT NULL;--> statement-breakpoint
ALTER TABLE `user_profiles` MODIFY COLUMN `weightKg` decimal(5,1) NOT NULL;--> statement-breakpoint
ALTER TABLE `user_profiles` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `openId` varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `email` varchar(320);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `name` text;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `loginMethod` varchar(64);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `lastSignedIn` timestamp NOT NULL DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT 'CURRENT_TIMESTAMP';--> statement-breakpoint
ALTER TABLE `fitasty_products` ADD `is_active` tinyint DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `fitasty_products` ADD `product_name_zh` varchar(255) DEFAULT 'Unknown' NOT NULL;--> statement-breakpoint
ALTER TABLE `fitasty_products` ADD `product_name_en` varchar(255);--> statement-breakpoint
ALTER TABLE `fitasty_products` ADD `brand_name` varchar(255);--> statement-breakpoint
ALTER TABLE `fitasty_products` ADD `serving_unit` varchar(50);--> statement-breakpoint
ALTER TABLE `fitasty_products` ADD `fiber_g` int;--> statement-breakpoint
ALTER TABLE `fitasty_products` ADD `sugar_g` int;--> statement-breakpoint
ALTER TABLE `fitasty_products` ADD `sodium_mg` int;--> statement-breakpoint
ALTER TABLE `fitasty_products` ADD `barcode` varchar(100);--> statement-breakpoint
ALTER TABLE `fitasty_products` ADD `product_image_url` varchar(500);--> statement-breakpoint
ALTER TABLE `fitasty_products` ADD `is_featured` tinyint DEFAULT 0;--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `goalKg` decimal(5,1);--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `goalDays` int;--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `displayName` varchar(100);--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `calorieMode` enum('safe','aggressive') DEFAULT 'safe' NOT NULL;--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `aiToneStyle` enum('gentle','coach','hk_style') DEFAULT 'gentle' NOT NULL;--> statement-breakpoint
CREATE INDEX `mood_records_userId_date_unique` ON `mood_records` (`userId`,`date`);--> statement-breakpoint
CREATE INDEX `unique_source_id` ON `general_food_cache` (`source`,`external_id`);--> statement-breakpoint
CREATE INDEX `user_profiles_userId_unique` ON `user_profiles` (`userId`);--> statement-breakpoint
CREATE INDEX `users_openId_unique` ON `users` (`openId`);--> statement-breakpoint
ALTER TABLE `fitasty_products` DROP COLUMN `isActive`;