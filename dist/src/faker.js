"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = require("drizzle-orm/mysql2");
const mysql2_2 = __importDefault(require("mysql2"));
const faker_1 = require("@faker-js/faker");
const customers_model_1 = require("./models/customers.model");
const product_model_1 = require("./models/product.model");
const orders_model_1 = require("./models/orders.model");
const mysqlConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Tsr190719*',
    database: 'padiumkm',
};
async function seedDatabase() {
    const connection = await mysql2_2.default.createConnection(mysqlConfig);
    const db = (0, mysql2_1.drizzle)(connection);
    try {
        const customerIds = [];
        const productIds = [];
        const orderIds = [];
        // Create customers
        for (let i = 0; i < 10; i++) {
            const customerId = faker_1.faker.string.alphanumeric(16);
            customerIds.push(customerId);
            await db.insert(customers_model_1.customerSchema).values({
                id: customerId,
                name: faker_1.faker.person.fullName(),
                address: faker_1.faker.location.streetAddress(),
                email: faker_1.faker.internet.email(),
                phone: faker_1.faker.string.numeric(10),
                created_at: new Date(),
                updated_at: new Date(),
            });
        }
        // Create products
        for (let i = 0; i < 10; i++) {
            const productId = faker_1.faker.string.alphanumeric(16);
            productIds.push(productId);
            await db.insert(product_model_1.productSchema).values({
                id: productId,
                name: faker_1.faker.commerce.productName(),
                price: parseFloat(faker_1.faker.commerce.price({ min: 10, max: 500, symbol: '' })),
                stock: faker_1.faker.number.int({ min: 1, max: 100 }),
                image: faker_1.faker.image.url({ width: 640, height: 480 }),
                created_at: new Date(),
                updated_at: new Date(),
            });
        }
        // Create orders
        for (let i = 0; i < 10; i++) {
            const orderId = faker_1.faker.string.alphanumeric(16);
            orderIds.push(orderId);
            const customerId = faker_1.faker.helpers.arrayElement(customerIds);
            await db.insert(orders_model_1.orderSchema).values({
                id: orderId,
                customer_id: customerId,
                total_price: faker_1.faker.number.int({ min: 100, max: 1000 }),
                order_state: faker_1.faker.helpers.arrayElement(['new', 'processed', 'sent', 'done', 'cancelled']),
                created_at: new Date(),
                updated_at: new Date(),
            });
        }
        // Create order details
        for (let i = 0; i < 10; i++) {
            const orderId = faker_1.faker.helpers.arrayElement(orderIds);
            const productId = faker_1.faker.helpers.arrayElement(productIds);
            await db.insert(orders_model_1.orderDetailSchema).values({
                id: faker_1.faker.number.int({ min: 1, max: 1000000 }),
                order_id: orderId,
                product_id: productId,
                sub_total: faker_1.faker.number.int({ min: 10, max: 100 }),
                created_at: new Date(),
                updated_at: new Date(),
            });
        }
        console.log('Database seeding completed.');
    }
    catch (error) {
        console.error('Error seeding database:', error);
    }
    finally {
        await connection.end();
    }
}
seedDatabase().catch(console.error);
//# sourceMappingURL=faker.js.map