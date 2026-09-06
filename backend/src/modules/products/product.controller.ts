import { Request, Response } from 'express';
import { ProductService } from './product.service';

export class ProductController {
  private productService = new ProductService();

  async create(req: Request, res: Response) {
    try {
      const product = await this.productService.create(req.body);
      return res.status(201).json(product);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao cadastrar produto.',
      });
    }
  }
  async listAll(req: Request, res: Response) {
    try {
        const products = await this.productService.listAll();
        return res.status(200).json(products);
    } catch (error) {
        return res.status(400).json({
            message: error instanceof Error ? error.message : 'Erro ao listar produtos.',
        });
    }
  }
  async listActive(req: Request, res: Response) {
    try {
        const products = await this.productService.listActive();
        return res.status(200).json(products);
    } catch (error) {
        return res.status(400).json({
            message: error instanceof Error ? error.message : 'Erro ao listar produtos.',
        });
    }
  }
}