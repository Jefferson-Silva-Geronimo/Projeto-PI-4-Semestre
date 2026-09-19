import {
  Request,
  Response,
} from "express";

import {
  orderService,
} from "./order.service";

import type {
  OrderListQuery,
} from "./order.schemas";

export class OrderController {
  static #instance:
    OrderController;

  private constructor() {}

  public static get instance():
    OrderController {
    if (
      !OrderController.#instance
    ) {
      OrderController.#instance =
        new OrderController();
    }

    return OrderController.#instance;
  }

  async create(
    req: Request,
    res: Response,
  ) {
    const order =
      await orderService.create(
        req.user!.userId,
      );

    return res
      .status(201)
      .json(order);
  }

  async listForUser(
    req: Request,
    res: Response,
  ) {
    const query =
      res.locals
        .validatedQuery as OrderListQuery;

    const result =
      await orderService.listForUser(
        req.user!.userId,
        query,
      );

    return res
      .status(200)
      .json(result);
  }

  async findForUser(
    req: Request,
    res: Response,
  ) {
    const orderId =
      req.params.orderId as string;

    const order =
      await orderService.findForUser(
        req.user!.userId,
        orderId,
      );

    return res
      .status(200)
      .json(order);
  }

  async listForAdmin(
    _req: Request,
    res: Response,
  ) {
    const query =
      res.locals
        .validatedQuery as OrderListQuery;

    const result =
      await orderService.listForAdmin(
        query,
      );

    return res
      .status(200)
      .json(result);
  }

  async findForAdmin(
    req: Request,
    res: Response,
  ) {
    const orderId =
      req.params.orderId as string;

    const order =
      await orderService.findForAdmin(
        orderId,
      );

    return res
      .status(200)
      .json(order);
  }

  async updateStatus(
    req: Request,
    res: Response,
  ) {
    const orderId =
      req.params.orderId as string;

    const order =
      await orderService.updateStatus(
        orderId,
        req.body,
      );

    return res
      .status(200)
      .json(order);
  }
}

export const orderController =
  OrderController.instance;