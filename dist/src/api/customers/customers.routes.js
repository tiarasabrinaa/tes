"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customers_handler_1 = __importDefault(require("./customers.handler"));
const router = express_1.default.Router();
// Customers Routes
// GET /api/v1/order-dashboard/customers
router.get('/customers', customers_handler_1.default.getAllCustomers);
// GET /api/v1/order-dashboard/customers/:customerId
router.get('/customers/:customerId', customers_handler_1.default.getCustomerById);
exports.default = router;
//# sourceMappingURL=customers.routes.js.map