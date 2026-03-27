CREATE TABLE `hydration_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` varchar(10) NOT NULL,
	`waterIntakeMl` int NOT NULL DEFAULT 0,
	`targetMl` int NOT NULL DEFAULT 2000,
	`createdAt` timestamp NOT NULL DEFAULT 'CURRENT_TIMESTAMP',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `sleep_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` varchar(10) NOT NULL,
	`sleepHours` decimal(3,1) NOT NULL DEFAULT 0,
	`targetHours` decimal(3,1) NOT NULL DEFAULT 8,
	`createdAt` timestamp NOT NULL DEFAULT 'CURRENT_TIMESTAMP',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX `hydration_logs_userId_date` ON `hydration_logs` (`userId`,`date`);--> statement-breakpoint
CREATE INDEX `sleep_logs_userId_date` ON `sleep_logs` (`userId`,`date`);