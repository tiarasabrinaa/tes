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
        const { filterState } = req.query;
        let orders = [];
        if (filterState) {
            const allowedStates = ['new', 'processed', 'sent', 'done', 'cancelled'];
            if (!allowedStates.includes(filterState)) {
                res.status(500).json(api_response_1.default.error('Invalid request: Invalid state value'));
                return;
            }
            orders = await db_1.db.select().from(orders_model_1.orderSchema).where((0, drizzle_orm_1.eq)(orders_model_1.orderSchema.order_state, filterState));
        }
        else {
            orders = await db_1.db.select().from(orders_model_1.orderSchema);
        }
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
            orderDetails: orderDetails,
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
        const { id } = req.params;
        const { newState } = req.body;
        if (!id || !newState) {
            res.status(400).json(api_response_1.default.error('Invalid Request: Missing id or newState'));
            return;
        }
        const allowedStates = ['new', 'processed', 'sent', 'done', 'cancelled'];
        if (!allowedStates.includes(newState)) {
            res.status(400).json(api_response_1.default.error('Invalid request: Invalid state value'));
            return;
        }
        // Check if the order exists
        const order = await db_1.db.select().from(orders_model_1.orderSchema).where((0, drizzle_orm_1.eq)(orders_model_1.orderSchema.id, id)).limit(1);
        if (order.length === 0) {
            res.status(404).json(api_response_1.default.error('Order not found'));
            return;
        }
        const currentOrder = order[0];
        const currentState = currentOrder.order_state;
        // Implement business logic for updating state
        if (newState === 'cancelled') {
            // Directly set to cancelled if new state is cancelled
            await db_1.db.update(orders_model_1.orderSchema).set({ order_state: 'cancelled' }).where((0, drizzle_orm_1.eq)(orders_model_1.orderSchema.id, id));
        }
        else if (currentState === 'new' && newState === 'processed') {
            // Allow update if current state is 'new' and new state is 'processed'
            await db_1.db.update(orders_model_1.orderSchema).set({ order_state: newState }).where((0, drizzle_orm_1.eq)(orders_model_1.orderSchema.id, id));
        }
        else if (currentState === 'processed' && (newState === 'sent' || newState === 'done')) {
            // Allow update if current state is 'processed' and new state is 'sent' or 'done'
            await db_1.db.update(orders_model_1.orderSchema).set({ order_state: newState }).where((0, drizzle_orm_1.eq)(orders_model_1.orderSchema.id, id));
        }
        else if (currentState === 'sent' && newState === 'done') {
            // Allow update if current state is 'sent' and new state is 'done'
            await db_1.db.update(orders_model_1.orderSchema).set({ order_state: newState }).where((0, drizzle_orm_1.eq)(orders_model_1.orderSchema.id, id));
        }
        else {
            res.status(400).json(api_response_1.default.error('Invalid state transition'));
            return;
        }
        const updatedOrder = await db_1.db.select().from(orders_model_1.orderSchema).where((0, drizzle_orm_1.eq)(orders_model_1.orderSchema.id, id)).limit(1);
        res.json(api_response_1.default.success('Order updated successfully', updatedOrder[0]));
    }
    catch (error) {
        console.error('Error updating order state:', error);
        res.status(500).json(api_response_1.default.error('Internal Server Error'));
    }
}
async function countOrders(req, res) {
    try {
        const results = await db_1.db
            .select({
            order_state: (0, drizzle_orm_1.sql) `order_state`,
            total_order: (0, drizzle_orm_1.sql) `COUNT(*)`,
        })
            .from(orders_model_1.orderSchema)
            .groupBy((0, drizzle_orm_1.sql) `order_state`);
        res.json(api_response_1.default.success('Count retrieved successfully', { count: results }));
    }
    catch (error) {
        console.error('Error counting orders by state:', error);
        res.status(500).json(api_response_1.default.error('Internal Server Error'));
    }
}
exports.default = {
    getAllOrders,
    getOrderById,
    updateOrderState,
    countOrders,
};
//# sourceMappingURL=orders.handler.js.map