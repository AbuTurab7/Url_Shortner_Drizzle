import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const url_shortner = mysqlTable('url_shortner_table_drizzle', {
  id: int().autoincrement().primaryKey(),
  url: varchar({ length: 255 }).notNull(),
  shortCode: varchar({ length: 255 }).notNull().unique(),
});
