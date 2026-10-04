import {
  useCallback,
  useRef,
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
  ProductCategory,
  Species,
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

  const [search, setSearch] =
    useState('');

  const [category, setCategory] =
    useState<ProductCategory | null>(
      null,
    );

  const [species, setSpecies] =
    useState<Species | null>(null);

  const [loading, setLoading] =
    useState(true);

  const loadedRef = useRef(false);

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
      },
    ): Promise<void> => {
      const isRefreshing =
        options?.refreshing === true ||
        loadedRef.current;

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
            search,
            category:
              category ?? undefined,
            species:
              species ?? undefined,
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
        loadedRef.current = true;
        setLoading(false);
        setRefreshing(false);
      }
    },
    [search, category, species],
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
      const timer = setTimeout(() => {
        void loadProducts();
      }, 300);

      return () => clearTimeout(timer);
    }, [loadProducts]),
  );

  return {
    products,
    pagination,
    loading,
    refreshing,
    errorMessage,
    search,
    category,
    species,
    setSearch,
    setCategory,
    setSpecies,
    loadProducts,
    refreshProducts,
  };
}