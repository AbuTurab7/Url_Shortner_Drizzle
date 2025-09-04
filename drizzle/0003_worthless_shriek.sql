ALTER TABLE `url_shortner_table_drz` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `url_shortner_table_drz` ADD `updated_at` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `url_shortner_table_drz` ADD `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `url_shortner_table_drz` ADD CONSTRAINT `url_shortner_table_drz_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;