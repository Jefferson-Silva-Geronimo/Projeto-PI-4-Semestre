import { api } from './api';

import type {
  CreateProductDTO,
  Product,
  ProductListParams,
  ProductListResponse,
  UpdateProductDTO,
  UpdateProductStatusDTO,
} from '../types/product';

export const productService = {
  async listActive(
    params: ProductListParams = {},
  ): Promise<ProductListResponse> {
    const response =
      await api.get<ProductListResponse>(
        '/products',
        {
          params: {
            page: params.page ?? 1,
            pageSize:
              params.pageSize ?? 20,

            search:
              params.search?.trim() ||
              undefined,
          },
        },
      );

    return response.data;
  },

  async listAll(
    params: ProductListParams = {},
  ): Promise<ProductListResponse> {
    const response =
      await api.get<ProductListResponse>(
        '/products/admin',
        {
          params: {
            page: params.page ?? 1,
            pageSize:
              params.pageSize ?? 20,

            search:
              params.search?.trim() ||
              undefined,
          },
        },
      );

    return response.data;
  },

  async findActiveById(
    productId: string,
  ): Promise<Product> {
    const response =
      await api.get<Product>(
        `/products/${productId}`,
      );

    return response.data;
  },

  async findByIdForAdmin(
    productId: string,
  ): Promise<Product> {
    const response =
      await api.get<Product>(
        `/products/admin/${productId}`,
      );

    return response.data;
  },

  async create(
    data: CreateProductDTO,
  ): Promise<Product> {
    const response =
      await api.post<Product>(
        '/products',
        data,
      );

    return response.data;
  },

  async update(
    productId: string,
    data: UpdateProductDTO,
  ): Promise<Product> {
    const response =
      await api.patch<Product>(
        `/products/${productId}`,
        data,
      );

    return response.data;
  },

  async updateStatus(
    productId: string,
    data: UpdateProductStatusDTO,
  ): Promise<Product> {
    const response =
      await api.patch<Product>(
        `/products/${productId}/status`,
        data,
      );

    return response.data;
  },

  async deactivate(
    productId: string,
  ): Promise<{
    message: string;
    product: Product;
  }> {
    const response = await api.delete<{
      message: string;
      product: Product;
    }>(
      `/products/${productId}`,
    );

    return response.data;
  },
};