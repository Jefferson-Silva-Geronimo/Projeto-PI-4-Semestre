import { api } from './api';

import type {
  AddCartItemDTO,
  Cart,
  ClearCartResponse,
  UpdateCartItemDTO,
} from '../types/cart';

export const cartService = {
  async get(): Promise<Cart> {
    const response =
      await api.get<Cart>('/cart');

    return response.data;
  },

  async addItem(
    data: AddCartItemDTO,
  ): Promise<Cart> {
    const response =
      await api.post<Cart>(
        '/cart/items',
        data,
      );

    return response.data;
  },

  async updateItem(
    itemId: string,
    data: UpdateCartItemDTO,
  ): Promise<Cart> {
    const response =
      await api.patch<Cart>(
        `/cart/items/${itemId}`,
        data,
      );

    return response.data;
  },

  async removeItem(
    itemId: string,
  ): Promise<Cart> {
    const response =
      await api.delete<Cart>(
        `/cart/items/${itemId}`,
      );

    return response.data;
  },

  async clear(): Promise<ClearCartResponse> {
    const response =
      await api.delete<ClearCartResponse>(
        '/cart',
      );

    return response.data;
  },
};
