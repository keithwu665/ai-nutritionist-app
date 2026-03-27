CREATE TABLE `general_food_reference` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`aliases` text,
	`category` varchar(100) NOT NULL,
	`defaultServingGram` int NOT NULL DEFAULT 100,
	`caloriesPer100g` decimal(8,1) NOT NULL,
	`proteinPer100g` decimal(6,1) NOT NULL,
	`carbsPer100g` decimal(6,1) NOT NULL,
	`fatsPer100g` decimal(6,1) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT 'CURRENT_TIMESTAMP',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `recent_food_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`foodType` enum('general','fitasty') NOT NULL,
	`foodId` int NOT NULL,
	`foodName` varchar(255) NOT NULL,
	`lastUsedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
ALTER TABLE `fitasty_products` ADD `aliases` text;--> statement-breakpoint
CREATE INDEX `general_food_reference_name` ON `general_food_reference` (`name`);--> statement-breakpoint
CREATE INDEX `general_food_reference_category` ON `general_food_reference` (`category`);--> statement-breakpoint
CREATE INDEX `recent_food_items_userId_lastUsed` ON `recent_food_items` (`userId`,`lastUsedAt`);