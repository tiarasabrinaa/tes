import { Request, Response } from 'express';

import { db } from '../../db';
import { orderDetailSchema, orderSchema } from '../../models/orders.model';

import apiResponse from '../../utils/api-response';
import HandlerFunction from '../../utils/handler-function';
import { eq, sql } from 'drizzle-orm';

import { customerSchema } from '../../models/customers.model';

interface OrderHandler {
  getAllOrders: HandlerFunction;
  getOrderById: HandlerFunction;
  updateOrderState: HandlerFunction;
  countOrders: HandlerFunction;
}

async function getAllOrders(req: Request, res: Response): Promise<void> {
  try {
    const { filterState } = req.query;

    let orders = [];

    if (filterState) {
      const allowedStates = ['new', 'processed', 'sent', 'done', 'cancelled'] as const;

      if (!allowedStates.includes(filterState as typeof allowedStates[number])) {
        res.status(500).json(apiResponse.error('Invalid request: Invalid state value'));
        return;
      }

      orders = await db.select().from(orderSchema).where(eq(orderSchema.order_state, filterState as typeof allowedStates[number]));
    } else {
      orders = await db.select().from(orderSchema);
    }

    if (orders.length === 0) {
      res.json(apiResponse.success('There are no orders', null));
      return;
    }

    res.json(apiResponse.success('', orders));
  } catch (error: any) {
    res.status(500).json(apiResponse.error('Invalid request'));
  }
}

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
      orderDetails: orderDetails,
    };

    res.json(apiResponse.success('Order retrieved successfully', responseData));
  } catch (error: any) {
    console.error(error); // Untuk logging kesalahan
    res.status(500).json(apiResponse.error('An error occurred while processing the request'));
  }
}


async function updateOrderState(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { newState } = req.body;

    if (!id || !newState) {
      res.status(400).json(apiResponse.error('Invalid Request: Missing id or newState'));
      return;
    }

    const allowedStates = ['new', 'processed', 'sent', 'done', 'cancelled'] as const;

    if (!allowedStates.includes(newState as typeof allowedStates[number])) {
      res.status(400).json(apiResponse.error('Invalid request: Invalid state value'));
      return;
    }

    // Check if the order exists
    const order = await db.select().from(orderSchema).where(eq(orderSchema.id, id)).limit(1);
    if (order.length === 0) {
      res.status(404).json(apiResponse.error('Order not found'));
      return;
    }

    const currentOrder = order[0];
    const currentState = currentOrder.order_state;

    // Implement business logic for updating state
    if (newState === 'cancelled') {
      // Directly set to cancelled if new state is cancelled
      await db.update(orderSchema).set({ order_state: 'cancelled' }).where(eq(orderSchema.id, id));
    } else if (currentState === 'new' && newState === 'processed') {
      // Allow update if current state is 'new' and new state is 'processed'
      await db.update(orderSchema).set({ order_state: newState }).where(eq(orderSchema.id, id));
    } else if (currentState === 'processed' && (newState === 'sent' || newState === 'done')) {
      // Allow update if current state is 'processed' and new state is 'sent' or 'done'
      await db.update(orderSchema).set({ order_state: newState }).where(eq(orderSchema.id, id));
    } else if (currentState === 'sent' && newState === 'done') {
      // Allow update if current state is 'sent' and new state is 'done'
      await db.update(orderSchema).set({ order_state: newState }).where(eq(orderSchema.id, id));
    } else {
      res.status(400).json(apiResponse.error('Invalid state transition'));
      return;
    }

    const updatedOrder = await db.select().from(orderSchema).where(eq(orderSchema.id, id)).limit(1);
    res.json(apiResponse.success('Order updated successfully', updatedOrder[0]));
  } catch (error: any) {
    console.error('Error updating order state:', error);
    res.status(500).json(apiResponse.error('Internal Server Error'));
  }
}

async function countOrders(req: Request, res: Response): Promise<void> {
  try {
    const results = await db
      .select({
        order_state: sql`order_state`,
        total_order: sql`COUNT(*)`,
      })
      .from(orderSchema)
      .groupBy(sql`order_state`);

    res.json(apiResponse.success('Count retrieved successfully', { count: results }));
  } catch (error: any) {
    console.error('Error counting orders by state:', error);
    res.status(500).json(apiResponse.error('Internal Server Error'));
  }
}

export default {
  getAllOrders,
  getOrderById,
  updateOrderState,
  countOrders,
} as OrderHandler;