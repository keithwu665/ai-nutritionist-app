ALTER TABLE `user_profiles` ADD `targetWaterIntakeMl` int DEFAULT 2000 NOT NULL;--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `targetSleepHours` decimal(3,1) DEFAULT 8 NOT NULL;