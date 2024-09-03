import express from 'express';
import handler from './customers.handler';

const router = express.Router();

// Customers Routes

// GET /api/v1/order-dashboard/customers
router.get('/customers', handler.getAllCustomers);

// GET /api/v1/order-dashboard/customers/:customerId
router.get('/customers/:customerId', handler.getCustomerById);

export default router;
