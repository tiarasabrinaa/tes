import { Handler, Request, Response } from 'express';

import { db } from '../../db';
import { orderDetailSchema, orderSchema } from '../../models/orders.model';
import { productSchema } from '../../models/product.model';

import apiResponse from '../../utils/api-response';
import HandlerFunction from '../../utils/handler-function';
import { eq } from 'drizzle-orm';
import { error } from 'console';
interface OrderHandler {
  getAllOrders: HandlerFunction;
  getOrdersByState: HandlerFunction;
  getOrderById: HandlerFunction;
  updateOrderState: HandlerFunction;
  getOrderDetails: HandlerFunction;
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

async function getOrdersByState(req: Request, res: Response): Promise<void>{
    try{
        const {state} = req.body;
        if(!state){
            res.status(500).json(apiResponse.error('Invalid request'));
            return;
        }

        //check if the order exist
        const orders = await db.select().from(orderSchema).where(eq(orderSchema.order_state, state));
        if (orders.length == 0){
            res.json(apiResponse.success('There are no orders', null));
            return;
        }
        res.json(apiResponse.success('',orders));
    } catch (error: any){
        res.status(500).json(apiResponse.error('Invalid request'));
    }
};

async function getOrderById(req: Request, res: Response): Promise<void>{
    try{
        const {id} = req.body;
        if(!id){
            res.status(500).json(apiResponse.error('Invalid Request'));
            return;
        }

        //check if the order exist
        const order = await db.select().from(orderSchema).where(eq(orderSchema.id, id)).limit(1);
        if (order.length == 0){
            res.status(404).json(apiResponse.error('Part not found'));
            return;
        }
        res.json(apiResponse.success('',order));
    } catch (error: any){
        res.status(500).json(apiResponse.error('Invalid request'));
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

async function getOrderDetails(req: Request, res: Response): Promise<void> {
    try {
        const { orderId } = req.params;

        const orderDetails = await db.select().from(orderDetailSchema)
            .leftJoin(productSchema,eq(orderDetailSchema.producst_id, productSchema.id))
            .where(eq(orderDetailSchema.order_id, orderId));

        if (orderDetails.length === 0) {
            res.json(apiResponse.success('No details found for this order', null));
            return;
        }
        res.json(apiResponse.success('Order details fetched successfully', orderDetails));
    } catch (error: any) {
        res.status(500).json(apiResponse.error('Invalid request'));
    }
}

export default {
  getAllOrders,
  getOrdersByState,
  getOrderById,
  updateOrderState,
  getOrderDetails,
} as OrderHandler;