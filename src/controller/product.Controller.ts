import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import BaseController from './base.controller'; // Assuming you have a BaseController
import { productSchema } from 'helper/validate';

const prisma = new PrismaClient();

export default class ProductController extends BaseController {
  constructor() {
    super();
  }

  async publishProduct(req: Request, res: Response) {
    const productId = req.params.productId;

    // Find the product by ID
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    // Check if the product exists
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update the is_published field to true
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        isPublished: true,
      },
    });

    const payload = {
      message: 'Product published successfully',
      statusCode: 200,
      data: updatedProduct,
    };

    this.success(res, '--publish/success', payload.message, payload.statusCode, payload.data);
  }

  async addProduct(req: Request, res: Response) {
    // ! This is just a workaround for this task, it does nothing actually as
    //! i still have to validate each payload and upload
    // ! each file sent from clients.

    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return this.error(res, 'Validation Error', error.details[0].message, 400, null);
    }

    const product = await prisma.product.create({
      data: {
        ...value,
      },
    });

    this.success(res, 'Product Added', 'Product has been added successfully', 201, product);
  }
}