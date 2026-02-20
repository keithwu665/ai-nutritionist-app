CREATE TABLE `body_report_photos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`provider` enum('inbody','boditrax') NOT NULL,
	`photoUrl` varchar(500) NOT NULL,
	`storageKey` varchar(500) NOT NULL,
	`parsedData` text,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
DROP INDEX `activity_logs_userId_idx` ON `activity_logs`;--> statement-breakpoint
DROP INDEX `activity_logs_actionType_idx` ON `activity_logs`;--> statement-breakpoint
DROP INDEX `activity_logs_createdAt_idx` ON `activity_logs`;--> statement-breakpoint
DROP INDEX `user_profiles_userId_unique` ON `user_profiles`;--> statement-breakpoint
DROP INDEX `users_openId_unique` ON `users`;--> statement-breakpoint
ALTER TABLE `activity_logs` MODIFY COLUMN `actionType` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `activity_logs` MODIFY COLUMN `entityType` varchar(50);--> statement-breakpoint
ALTER TABLE `activity_logs` MODIFY COLUMN `entityId` varchar(50);--> statement-breakpoint
ALTER TABLE `activity_logs` MODIFY COLUMN `status` enum('success','failed','pending') NOT NULL DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `activity_logs` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `body_metrics` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `body_photos` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `body_report_templates` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `daily_tips` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `exercises` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `fitasty_products` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `food_log_items` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `food_logs` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `user_profiles` MODIFY COLUMN `heightCm` varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE `user_profiles` MODIFY COLUMN `weightKg` varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE `user_profiles` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `openId` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `name` varchar(255);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `email` varchar(255);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `lastSignedIn` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `body_metrics` ADD `source` varchar(50);--> statement-breakpoint
ALTER TABLE `body_metrics` ADD `report_photo_url` varchar(500);--> statement-breakpoint
ALTER TABLE `body_metrics` ADD `measured_at` timestamp;--> statement-breakpoint
ALTER TABLE `body_metrics` ADD `fat_mass_kg` decimal(5,1);--> statement-breakpoint
ALTER TABLE `body_metrics` ADD `ffm_kg` decimal(5,1);--> statement-breakpoint
ALTER TABLE `body_photos` ADD `source` varchar(50);--> statement-breakpoint
ALTER TABLE `body_report_templates` ADD `isGlobal` tinyint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_openId_unique` UNIQUE(`openId`);--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `loginMethod`;