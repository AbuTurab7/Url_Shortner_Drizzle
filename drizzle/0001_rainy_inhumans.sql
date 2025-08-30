CREATE TABLE `url_shortner_table_drizzle` (
	`id` int AUTO_INCREMENT NOT NULL,
	`url` varchar(255) NOT NULL,
	`shortCode` varchar(255) NOT NULL,
	CONSTRAINT `url_shortner_table_drizzle_id` PRIMARY KEY(`id`),
	CONSTRAINT `url_shortner_table_drizzle_shortCode_unique` UNIQUE(`shortCode`)
);
-- --> statement-breakpoint
-- DROP TABLE `url_shortner_table`;