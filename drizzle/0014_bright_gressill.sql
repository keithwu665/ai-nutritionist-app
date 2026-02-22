CREATE TABLE `general_food_cache` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source` enum('usda','off') NOT NULL,
	`external_id` varchar(255) NOT NULL,
	`display_name` varchar(255) NOT NULL,
	`brand` varchar(255),
	`kcal_per_100g` decimal(8,1),
	`protein_g_per_100g` decimal(6,1),
	`carbs_g_per_100g` decimal(6,1),
	`fat_g_per_100g` decimal(6,1),
	`raw_json` text,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE `exercises` ADD `source` varchar(50) DEFAULT 'manual';--> statement-breakpoint
ALTER TABLE `exercises` ADD `met_used` decimal(4,1);--> statement-breakpoint
ALTER TABLE `exercises` ADD `weight_used_kg` decimal(5,1);--> statement-breakpoint
ALTER TABLE `fitasty_products` ADD `net_weight_g` decimal(6,1);--> statement-breakpoint
ALTER TABLE `food_log_items` ADD `source` varchar(50);--> statement-breakpoint
ALTER TABLE `food_log_items` ADD `external_id` varchar(255);--> statement-breakpoint
ALTER TABLE `food_log_items` ADD `grams` decimal(6,1);--> statement-breakpoint
ALTER TABLE `food_log_items` ADD `per100g_kcal` decimal(8,1);--> statement-breakpoint
ALTER TABLE `food_log_items` ADD `per100g_protein` decimal(6,1);--> statement-breakpoint
ALTER TABLE `food_log_items` ADD `per100g_carbs` decimal(6,1);--> statement-breakpoint
ALTER TABLE `food_log_items` ADD `per100g_fat` decimal(6,1);--> statement-breakpoint
ALTER TABLE `food_log_items` ADD `is_autofilled` tinyint DEFAULT 0 NOT NULL;