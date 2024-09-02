"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const products_routes_1 = __importDefault(require("./products/products.routes"));
const api_response_1 = __importDefault(require("../utils/api-response"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.send(api_response_1.default.success('The API is live!', null));
});
// router.use('/orders', orderRoutes);
router.use('/order-dashboard', products_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map