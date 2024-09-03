import { Handler, Request, Response } from 'express';

import { db } from '../../db';
import { orderDetailSchema, orderSchema } from '../../models/orders.model';

import apiResponse from '../../utils/api-response';
import HandlerFunction from '../../utils/handler-function';
import { eq } from 'drizzle-orm';

import { customerSchema } from '../../models/customers.model';

interface OrderHandler {
  getAllOrders: HandlerFunction;
  getOrdersByState: HandlerFunction;
  getOrderById: HandlerFunction;
  updateOrderState: HandlerFunction;
}

async function getAllOrders(req: Request, res: Response): Promise<void>{
    try{
        const orders = await db.select().from(orderSchema);
        if (orders.length == 0){
            res.json(apiResponse.success('There are no orders', null));
            return;
        }
        res.json(apiResponse.success('', orders))
    } catch (error: any){
        res.status(500).json(apiResponse.error('Invalid request'));
    }
};

async function getOrdersByState(req: Request, res: Response): Promise<void> {
    try {
        const { state } = req.params;

        const allowedStates = ['state1', 'state2'] as const;

        if (!state || !allowedStates.includes(state as typeof allowedStates[number])) {
            res.status(500).json(apiResponse.error('Invalid request: Invalid state value'));
            return;
        }

        const orders = await db.select().from(orderSchema).where(eq(orderSchema.order_state, state as typeof allowedStates[number]));

        if (orders.length === 0) {
            res.json(apiResponse.success('There are no orders', null));
            return;
        }

        res.json(apiResponse.success('', orders));
    } catch (error: any) {
        res.status(500).json(apiResponse.error('Invalid request'));
    }
};

async function getOrderById(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json(apiResponse.error('Invalid Request: ID is required'));
            return;
        }

        // Memeriksa apakah order ada
        const order = await db.select().from(orderSchema).where(eq(orderSchema.id, id)).limit(1);
        if (order.length === 0) {
            res.status(404).json(apiResponse.error('Order not found'));
            return;
        }

        // Mengambil data pelanggan terkait
        const customer = await db.select().from(customerSchema).where(eq(customerSchema.id, order[0].customer_id)).limit(1);
        if (customer.length === 0) {
            res.status(404).json(apiResponse.error('Customer not found'));
            return;
        }

        // Mengambil detail order terkait
        const orderDetails = await db.select().from(orderDetailSchema).where(eq(orderDetailSchema.order_id, id));

        // Menyiapkan respon data yang lengkap
        const responseData = {
            order: order[0],
            customer: customer[0],
            orderDetails: orderDetails
        };

        res.json(apiResponse.success('Order retrieved successfully', responseData));
    } catch (error: any) {
        console.error(error); // Untuk logging kesalahan
        res.status(500).json(apiResponse.error('An error occurred while processing the request'));
    }
};


async function updateOrderState(req: Request, res: Response): Promise<void> {
    try{
        const {id, newState} = req.body;
        if(!id || !newState){
            res.status(500).json(apiResponse.error('Invalid Request'));
            return;
        }

        //check if the order exist
        const order = await db.select().from(orderSchema).where(eq(orderSchema.id, id)).limit(1);
        if (order.length == 0){
            res.status(404).json(apiResponse.error('Part not found'));
            return;
        }
        order[0].order_state = newState;
        res.json(apiResponse.success('',order));
    } catch (error: any){
        res.status(500).json(apiResponse.error('Invalid request'));
    }
};

export default {
  getAllOrders,
  getOrdersByState,
  getOrderById,
  updateOrderState,
} as OrderHandler;