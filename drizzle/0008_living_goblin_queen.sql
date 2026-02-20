ALTER TABLE `body_photos` ADD `isAiGenerated` tinyint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `body_photos` ADD `aiGoalDeltaKg` int;--> statement-breakpoint
ALTER TABLE `body_photos` ADD `sourcePhotoId` int;--> statement-breakpoint
ALTER TABLE `body_photos` ADD `aiPrompt` text;