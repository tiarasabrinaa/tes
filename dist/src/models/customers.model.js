"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerSchema = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
exports.customerSchema = (0, mysql_core_1.mysqlTable)('customers', {
    id: (0, mysql_core_1.varchar)('id', { length: 16 }).primaryKey(),
    name: (0, mysql_core_1.varchar)('name', { length: 255 }).notNull(),
    address: (0, mysql_core_1.text)('address').notNull(),
    photos: (0, mysql_core_1.text)('photos').notNull(),
    email: (0, mysql_core_1.varchar)('email', { length: 255 }).notNull(),
    phone: (0, mysql_core_1.varchar)('phone', { length: 20 }).notNull(),
    created_at: (0, mysql_core_1.timestamp)('created_at').notNull().defaultNow(),
    updated_at: (0, mysql_core_1.timestamp)('updated_at').onUpdateNow(),
});
//# sourceMappingURL=customers.model.js.map