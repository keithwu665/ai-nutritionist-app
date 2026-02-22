ALTER TABLE `food_log_items` ADD `photo_url` varchar(500);--> statement-breakpoint
ALTER TABLE `food_log_items` ADD `ai_suggested_kcal` decimal(8,1);--> statement-breakpoint
ALTER TABLE `food_log_items` ADD `ai_suggested_protein_g` decimal(6,1);--> statement-breakpoint
ALTER TABLE `food_log_items` ADD `ai_suggested_carbs_g` decimal(6,1);--> statement-breakpoint
ALTER TABLE `food_log_items` ADD `ai_suggested_fat_g` decimal(6,1);--> statement-breakpoint
ALTER TABLE `food_log_items` ADD `ai_confidence_json` text;--> statement-breakpoint
ALTER TABLE `food_log_items` ADD `ai_prefill_json` text;--> statement-breakpoint
ALTER TABLE `food_log_items` ADD `is_ai_autofilled` tinyint DEFAULT 0 NOT NULL;