import { api } from './api';

import type {
  Order,
  OrderListParams,
  OrderListResponse,
  OrderStatus,
} from '../types/order';

export const orderService = {
  async create(): Promise<Order> {
    const response =
      await api.post<Order>(
        '/orders',
        {},
      );

    return response.data;
  },

  async list(
    params: OrderListParams = {},
  ): Promise<OrderListResponse> {
    const response =
      await api.get<OrderListResponse>(
        '/orders',
        {
          params: {
            page: params.page ?? 1,
            pageSize:
              params.pageSize ?? 20,
          },
        },
      );

    return response.data;
  },

  async findById(
    orderId: string,
  ): Promise<Order> {
    const response =
      await api.get<Order>(
        `/orders/${orderId}`,
      );

    return response.data;
  },

  async listForAdmin(
    params: OrderListParams = {},
  ): Promise<OrderListResponse> {
    const response =
      await api.get<OrderListResponse>(
        '/orders/admin',
        {
          params: {
            page: params.page ?? 1,
            pageSize:
              params.pageSize ?? 20,
          },
        },
      );

    return response.data;
  },

  async findByIdForAdmin(
    orderId: string,
  ): Promise<Order> {
    const response =
      await api.get<Order>(
        `/orders/admin/${orderId}`,
      );

    return response.data;
  },

  async updateStatus(
    orderId: string,
    status: OrderStatus,
  ): Promise<Order> {
    const response =
      await api.patch<Order>(
        `/orders/admin/${orderId}/status`,
        {
          status,
        },
      );

    return response.data;
  },
};