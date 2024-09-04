"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../db");
const product_model_1 = require("../../models/product.model");
const api_response_1 = __importDefault(require("../../utils/api-response"));
const drizzle_orm_1 = require("drizzle-orm");
async function getAllProducts(req, res) {
    try {
        const products = await db_1.db.select().from(product_model_1.productSchema);
        res.json(api_response_1.default.success('Products found!', products));
    }
    catch (error) {
        res.json(api_response_1.default.error('An error occurred while fetching products!', error));
    }
}
async function getProductById(req, res) {
    try {
        const { productId } = req.params;
        const product = await db_1.db.select().from(product_model_1.productSchema).where((0, drizzle_orm_1.eq)(product_model_1.productSchema.id, productId)).limit(1);
        res.json(api_response_1.default.success('Products found!', product));
    }
    catch (error) {
        res.json(api_response_1.default.error('An error occurred while fetching products!', error));
    }
}
exports.default = {
    getAllProducts,
    getProductById,
};
//# sourceMappingURL=product.handler.js.map