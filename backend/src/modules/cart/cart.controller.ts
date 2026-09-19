import { Request, Response } from "express";

import { cartService } from "./cart.service";

export class CartController {
  static #instance: CartController;

  private constructor() {}

  public static get instance(): CartController {
    if (!CartController.#instance) {
      CartController.#instance =
        new CartController();
    }

    return CartController.#instance;
  }

  async get(
    req: Request,
    res: Response,
  ) {
    const cart = await cartService.get(
      req.user!.userId,
    );

    return res.status(200).json(cart);
  }

  async addItem(
    req: Request,
    res: Response,
  ) {
    const cart = await cartService.addItem(
      req.user!.userId,
      req.body,
    );

    return res.status(201).json(cart);
  }

  async updateItem(
    req: Request,
    res: Response,
  ) {
    const itemId =
      req.params.itemId as string;

    const cart =
      await cartService.updateItem(
        req.user!.userId,
        itemId,
        req.body,
      );

    return res.status(200).json(cart);
  }

  async removeItem(
    req: Request,
    res: Response,
  ) {
    const itemId =
      req.params.itemId as string;

    const cart =
      await cartService.removeItem(
        req.user!.userId,
        itemId,
      );

    return res.status(200).json(cart);
  }

  async clear(
    req: Request,
    res: Response,
  ) {
    const result =
      await cartService.clear(
        req.user!.userId,
      );

    return res.status(200).json(result);
  }
}

export const cartController =
  CartController.instance;