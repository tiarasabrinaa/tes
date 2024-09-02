import express from 'express';

import productRoutes from './products/products.routes';

import apiResponse from '../utils/api-response';

const router = express.Router();

router.get('/', (req, res) => {
  res.send(apiResponse.success('The API is live!', null));
});

// router.use('/orders', orderRoutes);
router.use('/order-dashboard', productRoutes);

export default router;
