import express from 'express';
import handler from '../handlers/order.handler'; // Mengimpor handler pesanan

const router = express.Router();

// Default route to check if the API is working
router.get('/', (req, res) => {
  res.send('Order Management Routes');
});

// Orders Routes

// GET /api/v1/order-dashboard/orders
router.get('/orders', handler.getAllOrders);

// GET /api/v1/order-dashboard/orders/:orderId
router.get('/orders/:orderId', handler.getOrderById);

// POST /api/v1/order-dashboard/orders
router.post('/orders', handler.createOrder);

// PUT /api/v1/order-dashboard/orders/:orderId
router.put('/orders/:orderId', handler.updateOrder);

// DELETE /api/v1/order-dashboard/orders/:orderId
router.delete('/orders/:orderId', handler.deleteOrder);

export default router;
