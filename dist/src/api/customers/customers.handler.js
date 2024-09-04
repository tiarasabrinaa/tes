"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../db");
const api_response_1 = __importDefault(require("../../utils/api-response"));
const drizzle_orm_1 = require("drizzle-orm");
const customers_model_1 = require("../../models/customers.model");
async function getAllCustomers(req, res) {
    try {
        const products = await db_1.db.select().from(customers_model_1.customerSchema);
        res.json(api_response_1.default.success('Customers found!', products));
    }
    catch (error) {
        res.json(api_response_1.default.error('An error occurred while fetching products!', error));
    }
}
async function getCustomerById(req, res) {
    try {
        const { customerId } = req.params;
        const product = await db_1.db.select().from(customers_model_1.customerSchema).where((0, drizzle_orm_1.eq)(customers_model_1.customerSchema.id, customerId)).limit(1);
        res.json(api_response_1.default.success('Customer found!', product));
    }
    catch (error) {
        res.json(api_response_1.default.error('An error occurred while fetching products!', error));
    }
}
exports.default = {
    getAllCustomers,
    getCustomerById,
};
//# sourceMappingURL=customers.handler.js.map