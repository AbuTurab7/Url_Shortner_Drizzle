CREATE TABLE `url_shortner_table_drz` (
	`id` int AUTO_INCREMENT NOT NULL,
	`url` varchar(255) NOT NULL,
	`shortCode` varchar(255) NOT NULL,
	CONSTRAINT `url_shortner_table_drz_id` PRIMARY KEY(`id`),
	CONSTRAINT `url_shortner_table_drz_shortCode_unique` UNIQUE(`shortCode`)
);
--> statement-breakpoint
-- DROP TABLE `url_shortner_table_drizzle`;