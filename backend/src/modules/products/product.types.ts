export interface CreateProductDTO {
  name: string;
  description: string;
  priceInCents: number;
  stock: number;
  imageUrl: string;
}