export interface CartProduct {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  stock: number;
  imageUrl: string;
  active: boolean;
}

export interface CartItem {
  id: string;
  quantity: number;
  subtotalInCents: number;
  available: boolean;
  createdAt: string;
  updatedAt: string;
  product: CartProduct;
}

export interface Cart {
  id: string | null;
  items: CartItem[];
  totalItems: number;
  totalInCents: number;
  hasUnavailableItems: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface AddCartItemDTO {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemDTO {
  quantity: number;
}

export interface ClearCartResponse {
  message: string;
}