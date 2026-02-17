CREATE TABLE `fitasty_products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(100) NOT NULL,
	`servingSize` varchar(100),
	`calories` decimal(8,1) NOT NULL,
	`proteinG` decimal(6,1),
	`carbsG` decimal(6,1),
	`fatG` decimal(6,1),
	`description` text,
	`imageUrl` varchar(500),
	`isActive` tinyint NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deletedAt` timestamp,
	CONSTRAINT `fitasty_products_id` PRIMARY KEY(`id`)
);
