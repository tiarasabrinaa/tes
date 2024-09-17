"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchema = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
exports.productSchema = (0, mysql_core_1.mysqlTable)('products', {
    id: (0, mysql_core_1.varchar)('id', { length: 16 }).primaryKey(),
    name: (0, mysql_core_1.varchar)('name', { length: 255 }).notNull(),
    variation: (0, mysql_core_1.text)('variation').notNull(),
    price: (0, mysql_core_1.int)('price').notNull(),
    stock: (0, mysql_core_1.int)('stock').notNull(),
    image: (0, mysql_core_1.text)('image').notNull(),
    created_at: (0, mysql_core_1.timestamp)('created_at').notNull().defaultNow(),
    updated_at: (0, mysql_core_1.timestamp)('updated_at').onUpdateNow(),
});
//# sourceMappingURL=product.model.js.map