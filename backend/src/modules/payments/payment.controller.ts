import {
  Request,
  Response,
} from "express";

import {
  paymentService,
} from "./payment.service";

export class PaymentController {
  static #instance: PaymentController;

  private constructor() {}

  public static get instance(): PaymentController {
    if (!PaymentController.#instance) {
      PaymentController.#instance =
        new PaymentController();
    }

    return PaymentController.#instance;
  }

  async createCheckout(
    req: Request,
    res: Response,
  ) {
    const checkout =
      await paymentService.createCheckout(
        req.user!.userId,
      );

    return res.status(201).json(checkout);
  }
}

export const paymentController =
  PaymentController.instance;
