import crypto from "crypto";

import {
  Preference,
  Payment,
} from "mercadopago";
import {
  Prisma,
} from "@prisma/client";

import {
  prisma,
} from "../../database/prisma";
import {
  env,
} from "../../config/env";
import {
  AppError,
} from "../../shared/errors/AppError";

import {
  mercadoPagoClient,
} from "./mercado-pago.client";

const orderWithDetailsInclude = {
  items: true,

  user: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
} satisfies Prisma.OrderInclude;

type OrderWithDetails =
  Prisma.OrderGetPayload<{
    include: typeof orderWithDetailsInclude;
  }>;

interface PendingCheckout {
  payment: {
    id: string;
    externalReference: string;
  };

  order: OrderWithDetails;
}

type ProviderPaymentStatus =
  | "approved"
  | "pending"
  | "in_process"
  | "in_mediation"
  | "authorized"
  | "rejected"
  | "cancelled"
  | "refunded"
  | "charged_back";

export class PaymentService {
  static #instance: PaymentService;

  private readonly preferenceClient =
    new Preference(mercadoPagoClient);

  private readonly paymentClient =
    new Payment(mercadoPagoClient);

  private constructor() {}

  public static get instance(): PaymentService {
    if (!PaymentService.#instance) {
      PaymentService.#instance =
        new PaymentService();
    }

    return PaymentService.#instance;
  }

  private async reserveCheckout(
    userId: string,
  ): Promise<PendingCheckout> {
    return prisma.$transaction(
      async (transaction) => {
        const cart =
          await transaction.cart.findUnique({
            where: {
              userId,
            },

            include: {
              items: {
                include: {
                  product: true,
                },

                orderBy: {
                  productId: "asc",
                },
              },
            },
          });

        if (
          !cart ||
          cart.items.length === 0
        ) {
          throw new AppError(
            "O carrinho está vazio.",
            409,
            "CART_EMPTY",
          );
        }

        let totalInCents = 0;

        for (const item of cart.items) {
          if (!item.product.active) {
            throw new AppError(
              `O produto "${item.product.name}" está indisponível.`,
              409,
              "PRODUCT_UNAVAILABLE",
              {
                productId: item.product.id,
              },
            );
          }

          const stockReservation =
            await transaction.product.updateMany({
              where: {
                id: item.productId,
                active: true,

                stock: {
                  gte: item.quantity,
                },
              },

              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            });

          if (stockReservation.count !== 1) {
            throw new AppError(
              `O estoque do produto "${item.product.name}" foi alterado. Atualize o carrinho e tente novamente.`,
              409,
              "INSUFFICIENT_STOCK",
              {
                productId: item.product.id,
              },
            );
          }

          totalInCents +=
            item.quantity *
            item.product.priceInCents;
        }

        const order =
          await transaction.order.create({
            data: {
              userId,
              status: "PENDING_PAYMENT",
              totalInCents,

              items: {
                create: cart.items.map(
                  (item) => ({
                    productId: item.product.id,
                    productName: item.product.name,
                    imageUrl: item.product.imageUrl,
                    unitPriceInCents:
                      item.product.priceInCents,
                    quantity: item.quantity,
                    subtotalInCents:
                      item.quantity *
                      item.product.priceInCents,
                  }),
                ),
              },
            },

            include: orderWithDetailsInclude,
          });

        const payment =
          await transaction.payment.create({
            data: {
              orderId: order.id,
              provider: "MERCADO_PAGO",
              amountInCents: totalInCents,
              externalReference:
                `payment_${crypto.randomUUID()}`,
            },

            select: {
              id: true,
              externalReference: true,
            },
          });

        await transaction.cartItem.deleteMany({
          where: {
            cartId: cart.id,
          },
        });

        return {
          payment,
          order,
        };
      },
      {
        isolationLevel:
          Prisma.TransactionIsolationLevel
            .Serializable,
        maxWait: 5000,
        timeout: 10000,
      },
    );
  }

  private async cancelReservedCheckout(
    paymentId: string,
  ): Promise<void> {
    await prisma.$transaction(
      async (transaction) => {
        const payment =
          await transaction.payment.findUnique({
            where: {
              id: paymentId,
            },

            include: {
              order: {
                include: {
                  items: true,
                },
              },
            },
          });

        if (
          !payment ||
          payment.status !== "PENDING"
        ) {
          return;
        }

        for (const item of payment.order.items) {
          await transaction.product.update({
            where: {
              id: item.productId,
            },

            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }

        await transaction.payment.update({
          where: {
            id: payment.id,
          },

          data: {
            status: "CANCELLED",
            providerStatus:
              "preference_creation_failed",
          },
        });

        await transaction.order.update({
          where: {
            id: payment.orderId,
          },

          data: {
            status: "CANCELLED",
          },
        });
      },
      {
        isolationLevel:
          Prisma.TransactionIsolationLevel
            .Serializable,
        maxWait: 5000,
        timeout: 10000,
      },
    );
  }

  async createCheckout(userId: string) {
    const maximumAttempts = 3;
    let checkout: PendingCheckout | null = null;

    for (
      let attempt = 1;
      attempt <= maximumAttempts;
      attempt += 1
    ) {
      try {
        checkout = await this.reserveCheckout(userId);
        break;
      } catch (error) {
        const isWriteConflict =
          error instanceof
            Prisma.PrismaClientKnownRequestError &&
          error.code === "P2034";

        if (
          !isWriteConflict ||
          attempt === maximumAttempts
        ) {
          throw error;
        }
      }
    }

    if (!checkout) {
      throw new AppError(
        "Não foi possível iniciar o pagamento.",
        500,
        "PAYMENT_CHECKOUT_FAILED",
      );
    }

    try {
      const preference =
        await this.preferenceClient.create({
          body: {
            external_reference:
              checkout.payment.externalReference,

            notification_url:
              env.MERCADOPAGO_WEBHOOK_URL,

            back_urls: {
              success:
                env.MERCADOPAGO_RETURN_URL,
              pending:
                env.MERCADOPAGO_RETURN_URL,
              failure:
                env.MERCADOPAGO_RETURN_URL,
            },

            auto_return: "approved",

            payer: {
              name: checkout.order.user.name,
              email: checkout.order.user.email,
            },
            items: checkout.order.items.map(
              (item) => ({
                id: item.productId,
                title: item.productName,
                picture_url: item.imageUrl,
                quantity: item.quantity,
                currency_id: "BRL",
                unit_price:
                  item.unitPriceInCents / 100,
              }),
            ),
          },
        });

      if (!preference.id || !preference.init_point) {
        throw new Error(
          "Resposta incompleta do Mercado Pago.",
        );
      }

      await prisma.payment.update({
        where: {
          id: checkout.payment.id,
        },

        data: {
          preferenceId: preference.id,
          providerStatus: "preference_created",
        },
      });

      return {
        paymentId: checkout.payment.id,
        orderId: checkout.order.id,
        initPoint: preference.init_point,
      };
    } catch (error) {
      await this.cancelReservedCheckout(
        checkout.payment.id,
      );

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        "Não foi possível iniciar o pagamento no Mercado Pago.",
        502,
        "MERCADO_PAGO_PREFERENCE_CREATION_FAILED",
      );
    }
  }

  async synchronizeWebhookPayment(
    providerPaymentId: string,
  ): Promise<void> {
    const providerPayment =
      await this.paymentClient.get({
        id: providerPaymentId,
      });

    if (
      !providerPayment.external_reference ||
      typeof providerPayment.transaction_amount !== "number" ||
      !providerPayment.status
    ) {
      return;
    }

    const paymentStatus =
      providerPayment.status as ProviderPaymentStatus;

    const statusMapping = {
      approved: {
        paymentStatus: "APPROVED",
        orderStatus: "CONFIRMED",
        releasesStock: false,
      },
      pending: {
        paymentStatus: "PENDING",
        orderStatus: "PENDING_PAYMENT",
        releasesStock: false,
      },
      in_process: {
        paymentStatus: "PENDING",
        orderStatus: "PENDING_PAYMENT",
        releasesStock: false,
      },
      in_mediation: {
        paymentStatus: "PENDING",
        orderStatus: "PENDING_PAYMENT",
        releasesStock: false,
      },
      authorized: {
        paymentStatus: "PENDING",
        orderStatus: "PENDING_PAYMENT",
        releasesStock: false,
      },
      rejected: {
        paymentStatus: "REJECTED",
        orderStatus: "CANCELLED",
        releasesStock: true,
      },
      cancelled: {
        paymentStatus: "CANCELLED",
        orderStatus: "CANCELLED",
        releasesStock: true,
      },
      refunded: {
        paymentStatus: "REFUNDED",
        orderStatus: "CANCELLED",
        releasesStock: false,
      },
      charged_back: {
        paymentStatus: "REJECTED",
        orderStatus: "CANCELLED",
        releasesStock: false,
      },
    } as const;

    const mapping =
      statusMapping[paymentStatus];

    if (!mapping) {
      return;
    }

    const amountInCents = Math.round(
      providerPayment.transaction_amount * 100,
    );

    await prisma.$transaction(
      async (transaction) => {
        const payment =
          await transaction.payment.findUnique({
            where: {
              externalReference:
                providerPayment.external_reference!,
            },

            include: {
              order: {
                include: {
                  items: true,
                },
              },
            },
          });

        if (
          !payment ||
          payment.amountInCents !== amountInCents
        ) {
          return;
        }

        const isOutdatedPendingNotification =
          mapping.paymentStatus === "PENDING" &&
          payment.status !== "PENDING";

        if (isOutdatedPendingNotification) {
          return;
        }

        await transaction.payment.update({
          where: {
            id: payment.id,
          },

          data: {
            providerPaymentId,
            providerStatus: providerPayment.status,
            status: mapping.paymentStatus,
          },
        });

        if (
          mapping.releasesStock &&
          payment.status === "PENDING" &&
          payment.order.status === "PENDING_PAYMENT"
        ) {
          for (const item of payment.order.items) {
            await transaction.product.update({
              where: {
                id: item.productId,
              },

              data: {
                stock: {
                  increment: item.quantity,
                },
              },
            });
          }
        }

        if (
          payment.order.status === "PENDING_PAYMENT" ||
          mapping.orderStatus === "CANCELLED"
        ) {
          await transaction.order.update({
            where: {
              id: payment.orderId,
            },

            data: {
              status: mapping.orderStatus,
            },
          });
        }
      },
      {
        isolationLevel:
          Prisma.TransactionIsolationLevel
            .Serializable,
        maxWait: 5000,
        timeout: 10000,
      },
    );
  }
}

export const paymentService =
  PaymentService.instance;
