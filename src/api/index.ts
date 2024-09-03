import express from 'express';

import productRoutes from './products/products.routes';
import orderRoutes from './orders/orders.routes';
import customerRoutes from './customers/customers.routes';

import apiResponse from '../utils/api-response';

const router = express.Router();

router.get('/', (req, res) => {
  res.send(apiResponse.success('The API is live!', null));
});

// router.use('/orders', orderRoutes);
router.use('/order-dashboard', productRoutes);
router.use('/order-dashboard', orderRoutes);
router.use('/order-dashboard', customerRoutes);

export default router;
