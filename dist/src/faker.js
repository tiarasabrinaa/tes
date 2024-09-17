"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = require("drizzle-orm/mysql2");
const mysql2_2 = __importDefault(require("mysql2"));
const faker_1 = require("@faker-js/faker");
const drizzle_orm_1 = require("drizzle-orm");
const customers_model_1 = require("./models/customers.model");
const product_model_1 = require("./models/product.model");
const orders_model_1 = require("./models/orders.model");
const database_1 = require("./config/database");
const dbConfig = {
    host: database_1.mysqlConfig.host,
    user: database_1.mysqlConfig.user,
    password: database_1.mysqlConfig.password,
    database: database_1.mysqlConfig.database,
};
const SEED_LENGTH = 50;
const created_at = new Date();
const deadline_order = new Date(created_at);
deadline_order.setDate(deadline_order.getDate() + 5);
const randomHSLColor = `hsl(${faker_1.faker.number.int({ min: 0, max: 360 })}, ${faker_1.faker.number.int({ min: 0, max: 100 })}%, ${faker_1.faker.number.int({ min: 0, max: 100 })}%)`;
async function seedDatabase() {
    const connection = await mysql2_2.default.createConnection(dbConfig);
    const db = (0, mysql2_1.drizzle)(connection);
    try {
        const customerIds = [];
        const productIds = [];
        const orderIds = [];
        // Create customers
        for (let i = 0; i < SEED_LENGTH; i++) {
            const customerId = faker_1.faker.string.alphanumeric(16);
            customerIds.push(customerId);
            await db.insert(customers_model_1.customerSchema).values({
                id: customerId,
                name: faker_1.faker.person.fullName(),
                address: faker_1.faker.location.streetAddress(),
                photos: faker_1.faker.image.avatar(),
                email: faker_1.faker.internet.email(),
                phone: faker_1.faker.string.numeric(10),
                created_at: new Date(),
                updated_at: new Date(),
            });
        }
        // Create products
        for (let i = 0; i < SEED_LENGTH; i++) {
            const productId = faker_1.faker.string.alphanumeric(16);
            productIds.push(productId);
            await db.insert(product_model_1.productSchema).values({
                id: productId,
                name: faker_1.faker.commerce.productName(),
                variation: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
                price: parseFloat(faker_1.faker.commerce.price({ min: 10, max: 500, symbol: '' })),
                stock: faker_1.faker.number.int({ min: 1, max: 100 }),
                image: faker_1.faker.image.url({ width: 640, height: 480 }),
                created_at: new Date(),
                updated_at: new Date(),
            });
        }
        // Create orders
        for (let i = 0; i < SEED_LENGTH; i++) {
            const orderId = faker_1.faker.string.alphanumeric(16);
            orderIds.push(orderId);
            const customerId = faker_1.faker.helpers.arrayElement(customerIds);
            await db.insert(orders_model_1.orderSchema).values({
                id: orderId,
                customer_id: customerId,
                total_price: faker_1.faker.number.int({ min: 100, max: 1000 }),
                order_state: faker_1.faker.helpers.arrayElement(['new', 'processed', 'sent', 'done', 'cancelled']),
                deadline_order: deadline_order,
                created_at: new Date(),
                updated_at: new Date(),
            });
        }
        for (let i = 0; i < SEED_LENGTH; i++) {
            const orderId = faker_1.faker.helpers.arrayElement(orderIds);
            const productId = faker_1.faker.helpers.arrayElement(productIds);
            // Fetch the product's price from the productSchema based on the productId
            const product = await db
                .select()
                .from(product_model_1.productSchema)
                .where((0, drizzle_orm_1.eq)(product_model_1.productSchema.id, productId)) // Correctly compare the column with the productId value
                .limit(1);
            if (product && product[0]) {
                const price = product[0].price; // Get the price of the product
                const quantity = faker_1.faker.number.int({ min: 1, max: 10 }); // Ensure quantity is at least 1
                await db.insert(orders_model_1.orderDetailSchema).values({
                    id: faker_1.faker.number.int({ min: 1, max: 1000000 }),
                    order_id: orderId,
                    product_id: productId,
                    quantity: quantity,
                    sub_total: price * quantity, // Calculate sub_total as price * quantity
                    created_at: new Date(),
                    updated_at: new Date(),
                });
            }
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