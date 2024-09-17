import { mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const customerSchema = mysqlTable('customers', {
    id: varchar('id', {length: 16 }).primaryKey(),
    name: varchar('name', {length: 255 }).notNull(),
    address: text('address').notNull(),
    photos: text('photos').notNull(),
    email: varchar('email', {length: 255 }).notNull(),
    phone: varchar('phone', {length: 20 }).notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').onUpdateNow(),
});