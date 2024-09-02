import { Request, Response } from 'express';
import { db } from '../../db';
import { productSchema } from '../../models/product.model';
import apiResponse from '../../utils/api-response';
import HandlerFunction from '../../utils/handler-function';

interface ProductHandler {
  getProducts: HandlerFunction;
}

async function getProducts(req: Request, res: Response) {
  try {
    const products = await db.select().from(productSchema);
    res.json(apiResponse.success('Products found!', products));
  } catch (error: any) {
    res.json(apiResponse.error('An error occurred while fetching products!', error));
  }
}

export default {
  getProducts,
} as ProductHandler;