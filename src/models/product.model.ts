import { int, mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const productSchema = mysqlTable('products', {
  id: varchar('id', { length: 16 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  price: int('price').notNull(),
  stock: int('stock').notNull(),
  image: text('image').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').onUpdateNow(),
});