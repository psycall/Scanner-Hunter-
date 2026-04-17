CREATE TABLE `paymentLinks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`creatorId` int NOT NULL,
	`slug` varchar(128) NOT NULL,
	`amount` decimal(20,6) NOT NULL,
	`description` text,
	`expiresAt` timestamp,
	`status` enum('active','expired','completed') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `paymentLinks_id` PRIMARY KEY(`id`),
	CONSTRAINT `paymentLinks_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `receipts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`transactionId` int NOT NULL,
	`fileKey` varchar(512) NOT NULL,
	`fileUrl` text NOT NULL,
	`fileName` varchar(256) NOT NULL,
	`mimeType` varchar(64) NOT NULL,
	`fileSize` int NOT NULL,
	`uploadedBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `receipts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`paymentLinkId` int NOT NULL,
	`payerId` int,
	`payerAddress` varchar(66),
	`amount` decimal(20,6) NOT NULL,
	`status` enum('pending','confirmed','failed','expired') NOT NULL DEFAULT 'pending',
	`txHash` varchar(66),
	`blockNumber` int,
	`confirmationCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`confirmedAt` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wallets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`address` varchar(66) NOT NULL,
	`isDefault` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wallets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `paymentLinks` ADD CONSTRAINT `paymentLinks_creatorId_users_id_fk` FOREIGN KEY (`creatorId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `receipts` ADD CONSTRAINT `receipts_transactionId_transactions_id_fk` FOREIGN KEY (`transactionId`) REFERENCES `transactions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `receipts` ADD CONSTRAINT `receipts_uploadedBy_users_id_fk` FOREIGN KEY (`uploadedBy`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_paymentLinkId_paymentLinks_id_fk` FOREIGN KEY (`paymentLinkId`) REFERENCES `paymentLinks`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_payerId_users_id_fk` FOREIGN KEY (`payerId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wallets` ADD CONSTRAINT `wallets_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_creatorId` ON `paymentLinks` (`creatorId`);--> statement-breakpoint
CREATE INDEX `idx_slug` ON `paymentLinks` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_transactionId` ON `receipts` (`transactionId`);--> statement-breakpoint
CREATE INDEX `idx_uploadedBy` ON `receipts` (`uploadedBy`);--> statement-breakpoint
CREATE INDEX `idx_paymentLinkId` ON `transactions` (`paymentLinkId`);--> statement-breakpoint
CREATE INDEX `idx_payerId` ON `transactions` (`payerId`);--> statement-breakpoint
CREATE INDEX `idx_txHash` ON `transactions` (`txHash`);--> statement-breakpoint
CREATE INDEX `idx_userId` ON `wallets` (`userId`);