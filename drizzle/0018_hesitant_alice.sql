ALTER TABLE `fitasty_products` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `fitasty_products` ADD `net_weight_g` decimal(6,1);--> statement-breakpoint
ALTER TABLE `fitasty_products` ADD `deletedAt` timestamp;--> statement-breakpoint
ALTER TABLE `user_profiles` DROP COLUMN `aiToneStyle`;