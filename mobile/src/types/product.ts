import type {
  PaginatedResponse,
} from './api';

export type ProductCategory =
  | 'RACAO'
  | 'PETISCOS'
  | 'HIGIENE'
  | 'BRINQUEDOS'
  | 'ACESSORIOS'
  | 'FARMACIA';

export type Species = 'CAO' | 'GATO' | 'OUTRO';

export const categoryOptions: Array<{
  value: ProductCategory;
  label: string;
}> = [
  { value: 'RACAO', label: 'Ração' },
  { value: 'PETISCOS', label: 'Petiscos' },
  { value: 'HIGIENE', label: 'Higiene' },
  { value: 'BRINQUEDOS', label: 'Brinquedos' },
  { value: 'ACESSORIOS', label: 'Acessórios' },
  { value: 'FARMACIA', label: 'Farmácia' },
];

export const speciesOptions: Array<{
  value: Species;
  label: string;
}> = [
  { value: 'CAO', label: 'Cão' },
  { value: 'GATO', label: 'Gato' },
  { value: 'OUTRO', label: 'Outro' },
];

export function getCategoryLabel(
  category: ProductCategory,
): string {
  return (
    categoryOptions.find(
      (option) => option.value === category,
    )?.label ?? category
  );
}

export function getSpeciesLabel(
  species: Species | null,
): string {
  if (!species) {
    return 'Todas as espécies';
  }

  return (
    speciesOptions.find(
      (option) => option.value === species,
    )?.label ?? species
  );
}

export interface Product {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  stock: number;
  imageUrl: string;
  category: ProductCategory;
  species: Species | null;
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
  category: ProductCategory;
  species: Species | null;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  priceInCents?: number;
  stock?: number;
  imageUrl?: string;
  category?: ProductCategory;
  species?: Species | null;
  active?: boolean;
}

export interface UpdateProductStatusDTO {
  active: boolean;
}

export interface ProductListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: ProductCategory;
  species?: Species;
  maxStock?: number;
  active?: boolean;
}

export type ProductListResponse =
  PaginatedResponse<Product>;
``