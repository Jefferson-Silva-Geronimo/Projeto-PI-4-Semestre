import {
  Request,
  Response,
} from "express";
import {
  InvalidWebhookSignatureError,
  WebhookSignatureValidator,
} from "mercadopago";

import {
  env,
} from "../../config/env";
import {
  AppError,
} from "../../shared/errors/AppError";

import {
  paymentService,
} from "./payment.service";

function getQueryStringValue(
  value: unknown,
): string | string[] | undefined {
  if (typeof value === "string") {
    return value;
  }

  if (
    Array.isArray(value) &&
    value.every((item) => typeof item === "string")
  ) {
    return value;
  }

  return undefined;
}

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

  async receiveWebhook(
    req: Request,
    res: Response,
  ) {
    const dataId = getQueryStringValue(
      req.query["data.id"],
    );

    try {
      WebhookSignatureValidator.validate({
        xSignature: req.headers["x-signature"],
        xRequestId: req.headers["x-request-id"],
        dataId,
        secret: env.MERCADOPAGO_WEBHOOK_SECRET,
      });
    } catch (error) {
      if (error instanceof InvalidWebhookSignatureError) {
        throw new AppError(
          "Assinatura do webhook inválida.",
          401,
          "INVALID_MERCADOPAGO_WEBHOOK_SIGNATURE",
        );
      }

      throw error;
    }

    const providerPaymentId =
      Array.isArray(dataId)
        ? dataId[0]
        : dataId;

    if (!providerPaymentId) {
      throw new AppError(
        "Identificador do pagamento não foi informado.",
        400,
        "MERCADOPAGO_WEBHOOK_PAYMENT_ID_REQUIRED",
      );
    }

    await paymentService.synchronizeWebhookPayment(
      providerPaymentId,
    );

    return res.sendStatus(200);
  }
}

export const paymentController =
  PaymentController.instance;
