import { int, mysqlEnum, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { customerSchema } from './customers.model';

export const orderSchema = mysqlTable('customers', {
    id: varchar('id', {length: 16 }).primaryKey(),
    customer_id: varchar('name', {length: 16 }).notNull().references(() => customerSchema.id),
    total_price: int('total_price').notNull(),
    order_state: mysqlEnum('order_state', ['processed', 'sent', 'done', 'cancelled']).notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').onUpdateNow(),
});

  export const orderDetailSchema = mysqlTable('customers', {
    id: int('id').primaryKey(),
    order_id: varchar('order_id', { length: 16 }).notNull().references(() => orderSchema.id),
    product_id: varchar('product_id', { length: 16}).notNull(),
    sub_total: int('sub_total').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').onUpdateNow(),
});