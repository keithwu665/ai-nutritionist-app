CREATE TABLE `activity_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`actionType` enum('UPLOAD_PHOTO','DELETE_PHOTO','GENERATE_NUTRITION_PDF','IMPORT_BODY_CSV','CREATE_BODY_METRIC','UPDATE_BODY_METRIC') NOT NULL,
	`entityType` varchar(100),
	`entityId` varchar(255),
	`status` enum('SUCCESS','FAIL') NOT NULL,
	`errorMessage` text,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE INDEX `activity_logs_userId_idx` ON `activity_logs` (`userId`);--> statement-breakpoint
CREATE INDEX `activity_logs_actionType_idx` ON `activity_logs` (`actionType`);--> statement-breakpoint
CREATE INDEX `activity_logs_createdAt_idx` ON `activity_logs` (`createdAt`);