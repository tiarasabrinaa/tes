"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderDetailSchema = exports.orderSchema = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const customers_model_1 = require("./customers.model");
exports.orderSchema = (0, mysql_core_1.mysqlTable)('orders', {
    id: (0, mysql_core_1.varchar)('id', { length: 16 }).primaryKey(),
    customer_id: (0, mysql_core_1.varchar)('customer_id', { length: 16 }).notNull().references(() => customers_model_1.customerSchema.id),
    total_price: (0, mysql_core_1.int)('total_price').notNull(),
    order_state: (0, mysql_core_1.mysqlEnum)('order_state', ['new', 'processed', 'sent', 'done', 'cancelled']).notNull(),
    deadline_order: (0, mysql_core_1.timestamp)('deadline_order').notNull(),
    created_at: (0, mysql_core_1.timestamp)('created_at').notNull().defaultNow(),
    updated_at: (0, mysql_core_1.timestamp)('updated_at').onUpdateNow(),
});
exports.orderDetailSchema = (0, mysql_core_1.mysqlTable)('order_details', {
    id: (0, mysql_core_1.int)('id').primaryKey(),
    order_id: (0, mysql_core_1.varchar)('order_id', { length: 16 }).notNull().references(() => exports.orderSchema.id),
    product_id: (0, mysql_core_1.varchar)('product_id', { length: 16 }).notNull(),
    quantity: (0, mysql_core_1.int)('quantity').notNull(),
    sub_total: (0, mysql_core_1.int)('sub_total').notNull(),
    created_at: (0, mysql_core_1.timestamp)('created_at').notNull().defaultNow(),
    updated_at: (0, mysql_core_1.timestamp)('updated_at').onUpdateNow(),
});
//# sourceMappingURL=orders.model.js.map