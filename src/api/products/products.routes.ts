import express from 'express';
import handler from './product.handler';

const router = express.Router();

// Products Routes

// GET /api/v1/order-dashboard/products
router.get('/products', handler.getAllProducts);

// GET /api/v1/order-dashboard/products/:productId
router.get('/products/:productId', handler.getProductById);

// // POST /api/v1/order-dashboard/products
// router.post('/products', handler.createProduct);

// // PUT /api/v1/order-dashboard/products/:productId
// router.put('/products/:productId', handler.updateProduct);

// // DELETE /api/v1/order-dashboard/products/:productId
// router.delete('/products/:productId', handler.deleteProduct);

export default router;
