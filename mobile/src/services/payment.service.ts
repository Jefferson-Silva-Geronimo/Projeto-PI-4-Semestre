import { api } from './api';

export interface CheckoutPreference {
  paymentId: string;
  orderId: string;
  initPoint: string;
}

export const paymentService = {
  async createCheckout(): Promise<CheckoutPreference> {
    const response =
      await api.post<CheckoutPreference>(
        '/payments/checkout',
        {},
      );

    return response.data;
  },
};
