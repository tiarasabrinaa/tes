import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2';
import { faker } from '@faker-js/faker';

import { customerSchema } from './models/customers.model';
import { productSchema } from './models/product.model';
import { orderSchema, orderDetailSchema } from './models/orders.model';
import { mysqlConfig } from './config/database';

const dbConfig = {
  host: mysqlConfig.host,
  user: mysqlConfig.user,
  password: mysqlConfig.password,
  database: mysqlConfig.database,
};

const SEED_LENGTH = 50;

async function seedDatabase() {
  const connection = await mysql.createConnection(dbConfig);
  const db = drizzle(connection);

  try {
    const customerIds = [];
    const productIds = [];
    const orderIds = [];

    // Create customers
    for (let i = 0; i < SEED_LENGTH; i++) {
      const customerId = faker.string.alphanumeric(16);
      customerIds.push(customerId);

      await db.insert(customerSchema).values({
        id: customerId,
        name: faker.person.fullName(),
        address: faker.location.streetAddress(),
        email: faker.internet.email(),
        phone: faker.string.numeric(10),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // Create products
    for (let i = 0; i < SEED_LENGTH; i++) {
      const productId = faker.string.alphanumeric(16);
      productIds.push(productId);

      await db.insert(productSchema).values({
        id: productId,
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price({ min: 10, max: 500, symbol: '' })),
        stock: faker.number.int({ min: 1, max: 100 }),
        image: faker.image.url({ width: 640, height: 480 }),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // Create orders
    for (let i = 0; i < SEED_LENGTH; i++) {
      const orderId = faker.string.alphanumeric(16);
      orderIds.push(orderId);
      const customerId = faker.helpers.arrayElement(customerIds);

      await db.insert(orderSchema).values({
        id: orderId,
        customer_id: customerId,
        total_price: faker.number.int({ min: 100, max: 1000 }),
        order_state: faker.helpers.arrayElement(['processed', 'sent', 'done', 'cancelled']),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // Create order details
    for (let i = 0; i < SEED_LENGTH; i++) {
      const orderId = faker.helpers.arrayElement(orderIds);
      const productId = faker.helpers.arrayElement(productIds);

      await db.insert(orderDetailSchema).values({
        id: faker.number.int({ min: 1, max: 1000000 }),
        order_id: orderId,
        product_id: productId,
        sub_total: faker.number.int({ min: 10, max: 100 }),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    console.log('Database seeding completed.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await connection.end();
  }
}

seedDatabase().catch(console.error);
