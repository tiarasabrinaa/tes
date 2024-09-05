import express from 'express';
import handler from './orders.handler';

const router = express.Router();

// Default route to check if the API is working
router.get('/', (req, res) => {
  res.send('Order Management Routes');
});

// // Orders Routes

// GET /api/v1/order-dashboard/orders
router.get('/orders', handler.getAllOrders);

// GET /api/v1/order-dashboard/orders
router.get('/orders/:state', handler.getOrdersByState);

// GET /api/v1/order-dashboard/orders/:orderId
router.get('/orders/:orderId', handler.getOrderById);

// PUT /api/v1/order-dashboard/orders/:orderId
router.put('/orders/:orderId', handler.updateOrderState);

// PUT /api/v1/order-dashboard/orders/:state
router.put('/orders/', handler.countOrdersByState);

// // DELETE /api/v1/order-dashboard/orders/:orderId
// router.delete('/orders/:orderId', handler.deleteOrder);

export default router;
