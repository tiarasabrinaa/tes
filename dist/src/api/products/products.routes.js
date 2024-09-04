"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_handler_1 = __importDefault(require("./product.handler"));
const router = express_1.default.Router();
// Products Routes
// GET /api/v1/order-dashboard/products
router.get('/products', product_handler_1.default.getAllProducts);
// GET /api/v1/order-dashboard/products/:productId
router.get('/products/:productId', product_handler_1.default.getProductById);
// // POST /api/v1/order-dashboard/products
// router.post('/products', handler.createProduct);
// // PUT /api/v1/order-dashboard/products/:productId
// router.put('/products/:productId', handler.updateProduct);
// // DELETE /api/v1/order-dashboard/products/:productId
// router.delete('/products/:productId', handler.deleteProduct);
exports.default = router;
//# sourceMappingURL=products.routes.js.map