"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../db");
const orders_model_1 = require("../../models/orders.model");
const api_response_1 = __importDefault(require("../../utils/api-response"));
const drizzle_orm_1 = require("drizzle-orm");
const customers_model_1 = require("../../models/customers.model");
async function getAllOrders(req, res) {
    try {
        const orders = await db_1.db.select().from(orders_model_1.orderSchema);
        if (orders.length == 0) {
            res.json(api_response_1.default.success('There are no orders', null));
            return;
        }
        res.json(api_response_1.default.success('', orders));
    }
    catch (error) {
        res.status(500).json(api_response_1.default.error('Invalid request'));
    }
}
async function getOrdersByState(req, res) {
    try {
        const { state } = req.params;
        const allowedStates = ['processed', 'sent', 'done', 'cancelled'];
        if (!state || !allowedStates.includes(state)) {
            res.status(500).json(api_response_1.default.error('Invalid request: Invalid state value'));
            return;
        }
        const orders = await db_1.db.select().from(orders_model_1.orderSchema).where((0, drizzle_orm_1.eq)(orders_model_1.orderSchema.order_state, state));
        if (orders.length === 0) {
            res.json(api_response_1.default.success('There are no orders', null));
            return;
        }
        res.json(api_response_1.default.success('', orders));
    }
    catch (error) {
        res.status(500).json(api_response_1.default.error('Invalid request'));
    }
}
async function getOrderById(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json(api_response_1.default.error('Invalid Request: ID is required'));
            return;
        }
        // Memeriksa apakah order ada
        const order = await db_1.db.select().from(orders_model_1.orderSchema).where((0, drizzle_orm_1.eq)(orders_model_1.orderSchema.id, id)).limit(1);
        if (order.length === 0) {
            res.status(404).json(api_response_1.default.error('Order not found'));
            return;
        }
        // Mengambil data pelanggan terkait
        const customer = await db_1.db.select().from(customers_model_1.customerSchema).where((0, drizzle_orm_1.eq)(customers_model_1.customerSchema.id, order[0].customer_id)).limit(1);
        if (customer.length === 0) {
            res.status(404).json(api_response_1.default.error('Customer not found'));
            return;
        }
        // Mengambil detail order terkait
        const orderDetails = await db_1.db.select().from(orders_model_1.orderDetailSchema).where((0, drizzle_orm_1.eq)(orders_model_1.orderDetailSchema.order_id, id));
        // Menyiapkan respon data yang lengkap
        const responseData = {
            order: order[0],
            customer: customer[0],
            orderDetails: orderDetails
        };
        res.json(api_response_1.default.success('Order retrieved successfully', responseData));
    }
    catch (error) {
        console.error(error); // Untuk logging kesalahan
        res.status(500).json(api_response_1.default.error('An error occurred while processing the request'));
    }
}
async function updateOrderState(req, res) {
    try {
        const { id, newState } = req.body;
        if (!id || !newState) {
            res.status(500).json(api_response_1.default.error('Invalid Request'));
            return;
        }
        // TODO: Implement the logic to update the order state
        // Allowed new state: state1, state2, cancel
        // if new state cancel, langsung cancel
        // if currentstate belum diproses, new state harus proses
        // else if currentstate anu, new state harus anu
        // else 400 bad request
        //check if the order exist
        const order = await db_1.db.select().from(orders_model_1.orderSchema).where((0, drizzle_orm_1.eq)(orders_model_1.orderSchema.id, id)).limit(1);
        if (order.length == 0) {
            res.status(404).json(api_response_1.default.error('Part not found'));
            return;
        }
        order[0].order_state = newState;
        res.json(api_response_1.default.success('', order));
    }
    catch (error) {
        res.status(500).json(api_response_1.default.error('Invalid request'));
    }
}
exports.default = {
    getAllOrders,
    getOrdersByState,
    getOrderById,
    updateOrderState,
};
//# sourceMappingURL=orders.handler.js.map