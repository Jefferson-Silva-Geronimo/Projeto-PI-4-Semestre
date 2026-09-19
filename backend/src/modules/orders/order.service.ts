import {
  OrderStatus,
  Prisma,
} from "@prisma/client";

import { prisma } from "../../database/prisma";
import { AppError } from "../../shared/errors/AppError";

import {
  OrderListQuery,
  UpdateOrderStatusInput,
} from "./order.schemas";

const orderInclude = {
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
    include: typeof orderInclude;
  }>;

interface PaginatedOrders {
  data: OrderWithDetails[];

  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export class OrderService {
  static #instance: OrderService;

  private constructor() {}

  public static get instance(): OrderService {
    if (!OrderService.#instance) {
      OrderService.#instance =
        new OrderService();
    }

    return OrderService.#instance;
  }

  private async executeCheckout(
    userId: string,
  ): Promise<OrderWithDetails> {
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
                productId:
                  item.product.id,
              },
            );
          }

          if (
            item.quantity >
            item.product.stock
          ) {
            throw new AppError(
              `Estoque insuficiente para o produto "${item.product.name}".`,
              409,
              "INSUFFICIENT_STOCK",
              {
                productId:
                  item.product.id,

                requestedQuantity:
                  item.quantity,

                availableStock:
                  item.product.stock,
              },
            );
          }

          const stockUpdate =
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
                  decrement:
                    item.quantity,
                },
              },
            });

          if (stockUpdate.count !== 1) {
            throw new AppError(
              `O estoque do produto "${item.product.name}" foi alterado. Atualize o carrinho e tente novamente.`,
              409,
              "INSUFFICIENT_STOCK",
              {
                productId:
                  item.product.id,
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
              status: "CONFIRMED",
              totalInCents,

              items: {
                create: cart.items.map(
                  (item) => ({
                    productId:
                      item.product.id,

                    productName:
                      item.product.name,

                    imageUrl:
                      item.product.imageUrl,

                    unitPriceInCents:
                      item.product
                        .priceInCents,

                    quantity:
                      item.quantity,

                    subtotalInCents:
                      item.quantity *
                      item.product
                        .priceInCents,
                  }),
                ),
              },
            },

            include: orderInclude,
          });

        await transaction.cartItem.deleteMany({
          where: {
            cartId: cart.id,
          },
        });

        return order;
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

  async create(
    userId: string,
  ): Promise<OrderWithDetails> {
    const maximumAttempts = 3;

    for (
      let attempt = 1;
      attempt <= maximumAttempts;
      attempt += 1
    ) {
      try {
        return await this.executeCheckout(
          userId,
        );
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

    throw new AppError(
      "Não foi possível concluir o pedido.",
      500,
      "ORDER_CREATION_FAILED",
    );
  }

  async listForUser(
    userId: string,
    query: OrderListQuery,
  ): Promise<PaginatedOrders> {
    const {
      page,
      pageSize,
    } = query;

    const skip =
      (page - 1) * pageSize;

    const where:
      Prisma.OrderWhereInput = {
        userId,
      };

    const [orders, totalItems] =
      await prisma.$transaction([
        prisma.order.findMany({
          where,
          include: orderInclude,

          orderBy: {
            createdAt: "desc",
          },

          skip,
          take: pageSize,
        }),

        prisma.order.count({
          where,
        }),
      ]);

    return {
      data: orders,

      pagination: {
        page,
        pageSize,
        totalItems,

        totalPages: Math.ceil(
          totalItems / pageSize,
        ),
      },
    };
  }

  async listForAdmin(
    query: OrderListQuery,
  ): Promise<PaginatedOrders> {
    const {
      page,
      pageSize,
    } = query;

    const skip =
      (page - 1) * pageSize;

    const [orders, totalItems] =
      await prisma.$transaction([
        prisma.order.findMany({
          include: orderInclude,

          orderBy: {
            createdAt: "desc",
          },

          skip,
          take: pageSize,
        }),

        prisma.order.count(),
      ]);

    return {
      data: orders,

      pagination: {
        page,
        pageSize,
        totalItems,

        totalPages: Math.ceil(
          totalItems / pageSize,
        ),
      },
    };
  }

  async findForUser(
    userId: string,
    orderId: string,
  ): Promise<OrderWithDetails> {
    const order =
      await prisma.order.findFirst({
        where: {
          id: orderId,
          userId,
        },

        include: orderInclude,
      });

    if (!order) {
      throw new AppError(
        "Pedido não encontrado.",
        404,
        "ORDER_NOT_FOUND",
      );
    }

    return order;
  }

  async findForAdmin(
    orderId: string,
  ): Promise<OrderWithDetails> {
    const order =
      await prisma.order.findUnique({
        where: {
          id: orderId,
        },

        include: orderInclude,
      });

    if (!order) {
      throw new AppError(
        "Pedido não encontrado.",
        404,
        "ORDER_NOT_FOUND",
      );
    }

    return order;
  }

  private getAllowedStatuses(
    currentStatus: OrderStatus,
  ): OrderStatus[] {
    const transitions:
      Record<
        OrderStatus,
        OrderStatus[]
      > = {
        CONFIRMED: [
          "PROCESSING",
          "CANCELLED",
        ],

        PROCESSING: [
          "COMPLETED",
          "CANCELLED",
        ],

        COMPLETED: [],

        CANCELLED: [],
      };

    return transitions[currentStatus];
  }

  async updateStatus(
    orderId: string,
    data: UpdateOrderStatusInput,
  ): Promise<OrderWithDetails> {
    return prisma.$transaction(
      async (transaction) => {
        const order =
          await transaction.order.findUnique({
            where: {
              id: orderId,
            },

            include: {
              items: true,
            },
          });

        if (!order) {
          throw new AppError(
            "Pedido não encontrado.",
            404,
            "ORDER_NOT_FOUND",
          );
        }

        const newStatus =
          data.status as OrderStatus;

        if (
          newStatus === order.status
        ) {
          return transaction.order.findUniqueOrThrow({
            where: {
              id: order.id,
            },

            include: orderInclude,
          });
        }

        const allowedStatuses =
          this.getAllowedStatuses(
            order.status,
          );

        if (
          !allowedStatuses.includes(
            newStatus,
          )
        ) {
          throw new AppError(
            `Não é permitido alterar o pedido de ${order.status} para ${newStatus}.`,
            409,
            "INVALID_ORDER_STATUS_TRANSITION",
            {
              currentStatus:
                order.status,

              requestedStatus:
                newStatus,

              allowedStatuses,
            },
          );
        }

        if (
          newStatus === "CANCELLED"
        ) {
          for (const item of order.items) {
            await transaction.product.updateMany({
              where: {
                id: item.productId,
              },

              data: {
                stock: {
                  increment:
                    item.quantity,
                },
              },
            });
          }
        }

        return transaction.order.update({
          where: {
            id: order.id,
          },

          data: {
            status: newStatus,
          },

          include: orderInclude,
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
}

export const orderService =
  OrderService.instance;