import type {
  PaginatedResponse,
} from './api';

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'CANCELLED';

export interface OrderUser {
  id: string;
  name: string;
  email: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  imageUrl: string;
  unitPriceInCents: number;
  quantity: number;
  subtotalInCents: number;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalInCents: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  user: OrderUser;
}

export interface OrderListParams {
  page?: number;
  pageSize?: number;
  status?: OrderStatus;
}

export const orderStatusLabels: Record<
  OrderStatus,
  string
> = {
  PENDING_PAYMENT: 'Aguardando pagamento',
  CONFIRMED: 'Confirmado',
  PROCESSING: 'Em processamento',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
};

export const orderStatusOptions = (
  Object.keys(orderStatusLabels) as OrderStatus[]
).map((value) => ({
  value,
  label: orderStatusLabels[value],
}));

export type OrderListResponse =
  PaginatedResponse<Order>;
