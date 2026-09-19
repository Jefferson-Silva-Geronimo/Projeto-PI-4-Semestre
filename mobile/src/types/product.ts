import type {
  PaginatedResponse,
} from './api';

export interface Product {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  stock: number;
  imageUrl: string;
  active: boolean;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  priceInCents: number;
  stock: number;
  imageUrl: string;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  priceInCents?: number;
  stock?: number;
  imageUrl?: string;
  active?: boolean;
}

export interface UpdateProductStatusDTO {
  active: boolean;
}

export interface ProductListParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export type ProductListResponse =
  PaginatedResponse<Product>;
``