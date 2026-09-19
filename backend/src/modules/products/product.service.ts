import { Prisma, Product } from "@prisma/client";

import { prisma } from "../../database/prisma";
import { AppError } from "../../shared/errors/AppError";

import {
  CreateProductInput,
  ProductListQuery,
  UpdateProductInput,
} from "./product.schemas";

interface ProductResponse extends Product {
  available: boolean;
}

interface ProductPagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

interface ProductListResponse {
  data: ProductResponse[];
  pagination: ProductPagination;
}

export class ProductService {
  static #instance: ProductService;

  private constructor() {}

  public static get instance(): ProductService {
    if (!ProductService.#instance) {
      ProductService.#instance =
        new ProductService();
    }

    return ProductService.#instance;
  }

  private formatProduct(
    product: Product,
  ): ProductResponse {
    return {
      ...product,

      available:
        product.active &&
        product.stock > 0,
    };
  }

  private createSearchFilter(
    search?: string,
  ): Prisma.ProductWhereInput {
    if (!search) {
      return {};
    }

    return {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    };
  }

  async create(
    data: CreateProductInput,
  ): Promise<ProductResponse> {
    const product = await prisma.product.create({
      data: {
        name: data.name.trim(),
        description:
          data.description.trim(),
        priceInCents:
          data.priceInCents,
        stock: data.stock,
        imageUrl: data.imageUrl.trim(),
      },
    });

    return this.formatProduct(product);
  }

  async listActive(
    query: ProductListQuery,
  ): Promise<ProductListResponse> {
    const {
      page,
      pageSize,
      search,
    } = query;

    const where: Prisma.ProductWhereInput = {
      active: true,
      ...this.createSearchFilter(search),
    };

    const skip = (page - 1) * pageSize;

    const [products, totalItems] =
      await prisma.$transaction([
        prisma.product.findMany({
          where,

          orderBy: {
            createdAt: "desc",
          },

          skip,
          take: pageSize,
        }),

        prisma.product.count({
          where,
        }),
      ]);

    const totalPages = Math.ceil(
      totalItems / pageSize,
    );

    return {
      data: products.map((product) =>
        this.formatProduct(product),
      ),

      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
      },
    };
  }

  async listAll(
    query: ProductListQuery,
  ): Promise<ProductListResponse> {
    const {
      page,
      pageSize,
      search,
    } = query;

    const where: Prisma.ProductWhereInput =
      this.createSearchFilter(search);

    const skip = (page - 1) * pageSize;

    const [products, totalItems] =
      await prisma.$transaction([
        prisma.product.findMany({
          where,

          orderBy: {
            createdAt: "desc",
          },

          skip,
          take: pageSize,
        }),

        prisma.product.count({
          where,
        }),
      ]);

    const totalPages = Math.ceil(
      totalItems / pageSize,
    );

    return {
      data: products.map((product) =>
        this.formatProduct(product),
      ),

      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
      },
    };
  }

  async findActiveById(
    productId: string,
  ): Promise<ProductResponse> {
    const product =
      await prisma.product.findFirst({
        where: {
          id: productId,
          active: true,
        },
      });

    if (!product) {
      throw new AppError(
        "Produto não encontrado.",
        404,
        "PRODUCT_NOT_FOUND",
      );
    }

    return this.formatProduct(product);
  }

  async findByIdForAdmin(
    productId: string,
  ): Promise<ProductResponse> {
    const product =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

    if (!product) {
      throw new AppError(
        "Produto não encontrado.",
        404,
        "PRODUCT_NOT_FOUND",
      );
    }

    return this.formatProduct(product);
  }

  async update(
    productId: string,
    data: UpdateProductInput,
  ): Promise<ProductResponse> {
    await this.findByIdForAdmin(productId);

    const updateData:
      Prisma.ProductUpdateInput = {};

    if (data.name !== undefined) {
      updateData.name =
        data.name.trim();
    }

    if (data.description !== undefined) {
      updateData.description =
        data.description.trim();
    }

    if (data.priceInCents !== undefined) {
      updateData.priceInCents =
        data.priceInCents;
    }

    if (data.stock !== undefined) {
      updateData.stock = data.stock;
    }

    if (data.imageUrl !== undefined) {
      updateData.imageUrl =
        data.imageUrl.trim();
    }

    if (data.active !== undefined) {
      updateData.active =
        data.active;
    }

    const product =
      await prisma.product.update({
        where: {
          id: productId,
        },

        data: updateData,
      });

    return this.formatProduct(product);
  }

  async updateStatus(
    productId: string,
    active: boolean,
  ): Promise<ProductResponse> {
    await this.findByIdForAdmin(productId);

    const product =
      await prisma.product.update({
        where: {
          id: productId,
        },

        data: {
          active,
        },
      });

    return this.formatProduct(product);
  }

  async deactivate(
    productId: string,
  ) {
    const product =
      await this.updateStatus(
        productId,
        false,
      );

    return {
      message:
        "Produto inativado com sucesso.",
      product,
    };
  }
}

export const productService =
  ProductService.instance;