import { relations } from 'drizzle-orm';
import { int, mysqlTable, varchar , timestamp } from 'drizzle-orm/mysql-core';

export const url_shortner = mysqlTable('url_shortner_table_drz', {
  id: int().autoincrement().primaryKey(),
  url: varchar({ length: 255 }).notNull(),
  shortCode: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  userId: int("user_id").notNull().references(() => users.id),
});


export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const UserRelation = relations(users , ({many}) => ({
  shortLink: many(url_shortner),
}));

export const urlRelation = relations(url_shortner , ({one}) => ({
  user: one(users , {
    fields: [url_shortner.userId],  //foreign key
    references: [users.id],
  })  
}))
