"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orders_handler_1 = __importDefault(require("./orders.handler"));
const router = express_1.default.Router();
// Default route to check if the API is working
router.get('/', (req, res) => {
    res.send('Order Management Routes');
});
// Orders Routes
// GET /api/v1/order-dashboard/orders
router.get('/orders/', orders_handler_1.default.getAllOrders);
// GET /api/v1/order-dashboard/orders/:orderId
router.get('/orders/:id', orders_handler_1.default.getOrderById);
// PUT /api/v1/order-dashboard/orders/:orderId
router.put('/orders/:id', orders_handler_1.default.updateOrderState);
// PUT /api/v1/order-dashboard/orders/:state
router.get('/orders-count/', orders_handler_1.default.countOrders);
// // DELETE /api/v1/order-dashboard/orders/:orderId
// router.delete('/orders/:orderId', handler.deleteOrder);
exports.default = router;
//# sourceMappingURL=orders.routes.js.map