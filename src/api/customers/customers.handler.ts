import { Request, Response } from 'express';
import { db } from '../../db';
import apiResponse from '../../utils/api-response';
import HandlerFunction from '../../utils/handler-function';
import { eq } from 'drizzle-orm';
import { customerSchema } from '../../models/customers.model';

interface ProductHandler {
    getAllCustomers: HandlerFunction;
    getCustomerById: HandlerFunction;
}

async function getAllCustomers(req: Request, res: Response) {
  try {
    const products = await db.select().from(customerSchema);
    res.json(apiResponse.success('Customers found!', products));
  } catch (error: any) {
    res.json(apiResponse.error('An error occurred while fetching products!', error));
  }
}

async function getCustomerById(req: Request, res: Response) {
  try {
    const {customerId} = req.params;
    const product = await db.select().from(customerSchema).where(eq(customerSchema.id, customerId)).limit(1);
    res.json(apiResponse.success('Customer found!', product));
  } catch (error: any) {
    res.json(apiResponse.error('An error occurred while fetching products!', error));
  }
}

export default {
    getAllCustomers,
    getCustomerById,
} as ProductHandler;