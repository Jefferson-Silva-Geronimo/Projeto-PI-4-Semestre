import { Prisma } from "@prisma/client";

import { prisma } from "../../database/prisma";
import { AppError } from "../../shared/errors/AppError";

import {
  AddCartItemInput,
  UpdateCartItemInput,
} from "./cart.schemas";

type CartWithItems = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
  };
}>;

interface FormattedCartItem {
  id: string;
  quantity: number;
  subtotalInCents: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;

  product: {
    id: string;
    name: string;
    description: string;
    priceInCents: number;
    stock: number;
    imageUrl: string;
    active: boolean;
  };
}

interface FormattedCart {
  id: string | null;
  items: FormattedCartItem[];
  totalItems: number;
  totalInCents: number;
  hasUnavailableItems: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export class CartService {
  static #instance: CartService;

  private constructor() {}

  public static get instance(): CartService {
    if (!CartService.#instance) {
      CartService.#instance =
        new CartService();
    }

    return CartService.#instance;
  }

  private async findCartWithItems(
    userId: string,
  ): Promise<CartWithItems | null> {
    return prisma.cart.findUnique({
      where: {
        userId,
      },

      include: {
        items: {
          include: {
            product: true,
          },

          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  }

  private formatCart(
    cart: CartWithItems | null,
  ): FormattedCart {
    if (!cart) {
      return {
        id: null,
        items: [],
        totalItems: 0,
        totalInCents: 0,
        hasUnavailableItems: false,
        createdAt: null,
        updatedAt: null,
      };
    }

    const items: FormattedCartItem[] =
      cart.items.map((item) => {
        const available =
          item.product.active &&
          item.product.stock >=
            item.quantity;

        return {
          id: item.id,
          quantity: item.quantity,

          subtotalInCents:
            item.quantity *
            item.product.priceInCents,

          available,

          createdAt: item.createdAt,
          updatedAt: item.updatedAt,

          product: {
            id: item.product.id,
            name: item.product.name,
            description:
              item.product.description,

            priceInCents:
              item.product.priceInCents,

            stock: item.product.stock,

            imageUrl:
              item.product.imageUrl,

            active:
              item.product.active,
          },
        };
      });

    const totalItems = items.reduce(
      (total, item) =>
        total + item.quantity,
      0,
    );

    const totalInCents = items.reduce(
      (total, item) =>
        total +
        item.subtotalInCents,
      0,
    );

    const hasUnavailableItems =
      items.some(
        (item) => !item.available,
      );

    return {
      id: cart.id,
      items,
      totalItems,
      totalInCents,
      hasUnavailableItems,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }

  async get(
    userId: string,
  ): Promise<FormattedCart> {
    const cart =
      await this.findCartWithItems(
        userId,
      );

    return this.formatCart(cart);
  }

  async addItem(
    userId: string,
    data: AddCartItemInput,
  ): Promise<FormattedCart> {
    const product =
      await prisma.product.findUnique({
        where: {
          id: data.productId,
        },
      });

    if (!product) {
      throw new AppError(
        "Produto não encontrado.",
        404,
        "PRODUCT_NOT_FOUND",
      );
    }

    if (!product.active) {
      throw new AppError(
        "O produto está indisponível.",
        409,
        "PRODUCT_UNAVAILABLE",
      );
    }

    if (product.stock <= 0) {
      throw new AppError(
        "O produto está sem estoque.",
        409,
        "PRODUCT_OUT_OF_STOCK",
      );
    }

    const cart =
      await prisma.cart.upsert({
        where: {
          userId,
        },

        create: {
          userId,
        },

        update: {},
      });

    const existingItem =
      await prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: product.id,
          },
        },
      });

    const newQuantity =
      (existingItem?.quantity ?? 0) +
      data.quantity;

    if (newQuantity > 99) {
      throw new AppError(
        "A quantidade máxima por produto é 99.",
        422,
        "MAXIMUM_ITEM_QUANTITY",
      );
    }

    if (newQuantity > product.stock) {
      throw new AppError(
        `Estoque insuficiente. Existem ${product.stock} unidade(s) disponíveis.`,
        409,
        "INSUFFICIENT_STOCK",
        {
          productId: product.id,
          requestedQuantity:
            newQuantity,
          availableStock:
            product.stock,
        },
      );
    }

    await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: product.id,
        },
      },

      create: {
        cartId: cart.id,
        productId: product.id,
        quantity: newQuantity,
      },

      update: {
        quantity: newQuantity,
      },
    });

    return this.get(userId);
  }

  async updateItem(
    userId: string,
    itemId: string,
    data: UpdateCartItemInput,
  ): Promise<FormattedCart> {
    const item =
      await prisma.cartItem.findFirst({
        where: {
          id: itemId,

          cart: {
            userId,
          },
        },

        include: {
          product: true,
        },
      });

    if (!item) {
      throw new AppError(
        "Item do carrinho não encontrado.",
        404,
        "CART_ITEM_NOT_FOUND",
      );
    }

    if (!item.product.active) {
      throw new AppError(
        "O produto está indisponível.",
        409,
        "PRODUCT_UNAVAILABLE",
      );
    }

    if (
      data.quantity >
      item.product.stock
    ) {
      throw new AppError(
        `Estoque insuficiente. Existem ${item.product.stock} unidade(s) disponíveis.`,
        409,
        "INSUFFICIENT_STOCK",
        {
          productId:
            item.product.id,

          requestedQuantity:
            data.quantity,

          availableStock:
            item.product.stock,
        },
      );
    }

    await prisma.cartItem.update({
      where: {
        id: item.id,
      },

      data: {
        quantity: data.quantity,
      },
    });

    return this.get(userId);
  }

  async removeItem(
    userId: string,
    itemId: string,
  ): Promise<FormattedCart> {
    const item =
      await prisma.cartItem.findFirst({
        where: {
          id: itemId,

          cart: {
            userId,
          },
        },
      });

    if (!item) {
      throw new AppError(
        "Item do carrinho não encontrado.",
        404,
        "CART_ITEM_NOT_FOUND",
      );
    }

    await prisma.cartItem.delete({
      where: {
        id: item.id,
      },
    });

    return this.get(userId);
  }

  async clear(
    userId: string,
  ): Promise<{
    message: string;
  }> {
    const cart =
      await prisma.cart.findUnique({
        where: {
          userId,
        },
      });

    if (!cart) {
      return {
        message:
          "O carrinho já está vazio.",
      };
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return {
      message:
        "Carrinho limpo com sucesso.",
    };
  }
}

export const cartService =
  CartService.instance;