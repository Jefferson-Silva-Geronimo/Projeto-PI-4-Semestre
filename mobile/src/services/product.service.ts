import { api } from './auth.service';
import { authStorage } from '../storage/authStorage';
import type { CreateProductDTO, Product } from '../types/product';

async function getAuthorizationHeader() {
  const token = await authStorage.getToken();
  if (!token) {
    throw new Error('Usuário não autenticado.');
  }
  return {
    Authorization: `Bearer ${token}`,
  };
}
export const productService = {
  async listActive(): Promise<Product[]> {
    const headers = await getAuthorizationHeader();
    const response = await api.get<Product[]>('/products',{ headers });
    return response.data;
  },
  async listAll(): Promise<Product[]> {
    const headers = await getAuthorizationHeader();
    const response = await api.get<Product[]>('/products/admin', { headers });
    return response.data;
  },
  async create( data: CreateProductDTO ): Promise<Product> {
    const headers = await getAuthorizationHeader();
    const response = await api.post<Product>('/products', data, { headers });
    return response.data;
  },
};