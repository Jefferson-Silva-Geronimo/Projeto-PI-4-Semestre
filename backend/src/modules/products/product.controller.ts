import { Request, Response } from "express";

import { productService } from "./product.service";

export class ProductController {
  static #instance: ProductController;

  private constructor() {}

  public static get instance(): ProductController {
    if (!ProductController.#instance) {
      ProductController.#instance =
        new ProductController();
    }

    return ProductController.#instance;
  }

  async create(
    req: Request,
    res: Response,
  ) {
    const product =
      await productService.create(
        req.body,
      );

    return res
      .status(201)
      .json(product);
  }

  async listActive(
    req: Request,
    res: Response,
  ) {
    const result =
      await productService.listActive(
        req.query as any,
      );

    return res
      .status(200)
      .json(result);
  }

  async listAll(
    req: Request,
    res: Response,
  ) {
    const result =
      await productService.listAll(
        req.query as any,
      );

    return res
      .status(200)
      .json(result);
  }

  async findActiveById(
    req: Request,
    res: Response,
  ) {
    const productId =
      req.params.productId as string;

    const product =
      await productService.findActiveById(
        productId,
      );

    return res
      .status(200)
      .json(product);
  }

  async findByIdForAdmin(
    req: Request,
    res: Response,
  ) {
    const productId =
      req.params.productId as string;

    const product =
      await productService.findByIdForAdmin(
        productId,
      );

    return res
      .status(200)
      .json(product);
  }

  async update(
    req: Request,
    res: Response,
  ) {
    const productId =
      req.params.productId as string;

    const product =
      await productService.update(
        productId,
        req.body,
      );

    return res
      .status(200)
      .json(product);
  }

  async updateStatus(
    req: Request,
    res: Response,
  ) {
    const productId =
      req.params.productId as string;

    const product =
      await productService.updateStatus(
        productId,
        req.body.active,
      );

    return res
      .status(200)
      .json(product);
  }

  async deactivate(
    req: Request,
    res: Response,
  ) {
    const productId =
      req.params.productId as string;

    const result =
      await productService.deactivate(
        productId,
      );

    return res
      .status(200)
      .json(result);
  }
}

export const productController =
  ProductController.instance;