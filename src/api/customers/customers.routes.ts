import express from 'express';
import handler from '../handlers/customer.handler'; // Mengimpor handler pelanggan

const router = express.Router();

// Customers Routes

// GET /api/v1/order-dashboard/customers/:customerId
router.get('/customers/:customerId', handler.getCustomerById);

// PUT /api/v1/order-dashboard/customers/:customerId
router.put('/customers/:customerId', handler.updateCustomer);

export default router;
