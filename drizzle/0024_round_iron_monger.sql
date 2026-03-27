ALTER TABLE `hydration_logs` MODIFY COLUMN `waterIntakeMl` int NOT NULL;--> statement-breakpoint
ALTER TABLE `hydration_logs` MODIFY COLUMN `targetMl` int NOT NULL;--> statement-breakpoint
ALTER TABLE `sleep_logs` MODIFY COLUMN `sleepHours` decimal(3,1) NOT NULL;--> statement-breakpoint
ALTER TABLE `sleep_logs` MODIFY COLUMN `targetHours` decimal(3,1) NOT NULL;