import {
  useCallback,
  useState,
} from 'react';

import {
  useFocusEffect,
} from '@react-navigation/native';

import { productService } from '../services/product.service';

import type {
  Pagination,
} from '../types/api';

import type {
  Product,
} from '../types/product';

import {
  getApiErrorMessage,
} from '../utils/error';

const initialPagination: Pagination = {
  page: 1,
  pageSize: 20,
  totalItems: 0,
  totalPages: 0,
};

export function useClientProducts() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [pagination, setPagination] =
    useState<Pagination>(
      initialPagination,
    );

  const [loading, setLoading] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const loadProducts = useCallback(
    async (
      options?: {
        refreshing?: boolean;
        search?: string;
      },
    ): Promise<void> => {
      const isRefreshing =
        options?.refreshing === true;

      try {
        if (isRefreshing) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setErrorMessage('');

        const result =
          await productService.listActive({
            page: 1,
            pageSize: 20,
            search: options?.search,
          });

        setProducts(result.data);
        setPagination(
          result.pagination,
        );
      } catch (error: unknown) {
        setErrorMessage(
          getApiErrorMessage(
            error,
            'Não foi possível carregar os produtos.',
          ),
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  const refreshProducts =
    useCallback(
      async (): Promise<void> => {
        await loadProducts({
          refreshing: true,
        });
      },
      [loadProducts],
    );

  useFocusEffect(
    useCallback(() => {
      void loadProducts();
    }, [loadProducts]),
  );

  return {
    products,
    pagination,
    loading,
    refreshing,
    errorMessage,
    loadProducts,
    refreshProducts,
  };
}