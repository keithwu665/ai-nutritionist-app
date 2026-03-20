ALTER TABLE `fitasty_products` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `fitasty_products` DROP COLUMN `net_weight_g`;--> statement-breakpoint
ALTER TABLE `fitasty_products` DROP COLUMN `deletedAt`;