CREATE TABLE `personas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`age` int NOT NULL,
	`profession` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`frustrations` text,
	`motivations` text,
	`techFamiliarity` int NOT NULL,
	`mobileUsagePercentage` int NOT NULL,
	`systemPrompt` text NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `personas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skillAssignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`skillId` int NOT NULL,
	`agentName` varchar(100) NOT NULL,
	`assignedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `skillAssignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`content` text NOT NULL,
	`version` int NOT NULL DEFAULT 1,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skills_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `testResults` (
	`id` int AUTO_INCREMENT NOT NULL,
	`testId` int NOT NULL,
	`personaName` varchar(100) NOT NULL,
	`report` text NOT NULL,
	`successfulCompletion` int NOT NULL,
	`painPoints` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `testResults_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`featureName` varchar(255) NOT NULL,
	`userTask` text NOT NULL,
	`context` text,
	`status` enum('pending','running','completed','failed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `uxAnalyses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`testId` int NOT NULL,
	`executiveSummary` text NOT NULL,
	`detailedAnalysis` text NOT NULL,
	`usabilityDiagnosis` text NOT NULL,
	`competitiveBenchmark` text,
	`recommendations` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `uxAnalyses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `personas` ADD CONSTRAINT `personas_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `skillAssignments` ADD CONSTRAINT `skillAssignments_skillId_skills_id_fk` FOREIGN KEY (`skillId`) REFERENCES `skills`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `skills` ADD CONSTRAINT `skills_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `testResults` ADD CONSTRAINT `testResults_testId_tests_id_fk` FOREIGN KEY (`testId`) REFERENCES `tests`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tests` ADD CONSTRAINT `tests_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `uxAnalyses` ADD CONSTRAINT `uxAnalyses_testId_tests_id_fk` FOREIGN KEY (`testId`) REFERENCES `tests`(`id`) ON DELETE no action ON UPDATE no action;