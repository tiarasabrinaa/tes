import { NextFunction, Request, Response } from 'express';
import { db } from '../../db';
import { productSchema } from '../../models/product.model';
import apiResponse from '../../utils/api-response';
import HandlerFunction from '../../utils/handler-function';

interface ProductHandler {
  getProducts: HandlerFunction;
}

async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const products = await db.select().from(productSchema);
    res.json(apiResponse.success('Products found!', products));
  } catch (error) {
    next(error);
  }
}

export default {
  getProducts,
} as ProductHandler;