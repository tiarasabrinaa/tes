import { Request, Response } from 'express';
import { db } from '../../db';
import { productSchema } from '../../models/product.model';
import apiResponse from '../../utils/api-response';
import HandlerFunction from '../../utils/handler-function';
import { eq } from 'drizzle-orm';

interface ProductHandler {
  getAllProducts: HandlerFunction;
  getProductById: HandlerFunction;
}

async function getAllProducts(req: Request, res: Response) {
  try {
    const products = await db.select().from(productSchema);
    res.json(apiResponse.success('Products found!', products));
  } catch (error: any) {
    res.json(apiResponse.error('An error occurred while fetching products!', error));
  }
}

async function getProductById(req: Request, res: Response) {
  try {
    const {productId} = req.params;
    const product = await db.select().from(productSchema).where(eq(productSchema.id, productId)).limit(1);
    res.json(apiResponse.success('Products found!', product));
  } catch (error: any) {
    res.json(apiResponse.error('An error occurred while fetching products!', error));
  }
}

export default {
  getAllProducts,
  getProductById,
} as ProductHandler;