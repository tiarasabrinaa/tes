import express from 'express';
import handler from './orders.handler';

const router = express.Router();

// Default route to check if the API is working
router.get('/', (req, res) => {
  res.send('Order Management Routes');
});

// Orders Routes

// GET /api/v1/order-dashboard/orders
router.get('/orders/', handler.getAllOrders);

// GET /api/v1/order-dashboard/orders/:orderId
router.get('/orders/:id', handler.getOrderById);

// PUT /api/v1/order-dashboard/orders/:orderId
router.put('/orders/:id', handler.updateOrderState);

// PUT /api/v1/order-dashboard/orders/:state
router.get('/orders-count/', handler.countOrders);

// // DELETE /api/v1/order-dashboard/orders/:orderId
// router.delete('/orders/:orderId', handler.deleteOrder);

export default router;
