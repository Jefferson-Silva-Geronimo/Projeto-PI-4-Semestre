import {
  useCallback,
  useState,
} from 'react';

import axios from 'axios';

import { useFocusEffect } from '@react-navigation/native';

import { productService } from '../services/product.service';

import type { Product } from '../types/product';

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>(
    []
  );

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] =
    useState('');

  const loadProducts = useCallback(
    async (): Promise<void> => {
      try {
        setLoading(true);
        setErrorMessage('');

        const result =
          await productService.listAll();

        setProducts(result);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setErrorMessage(
            error.response?.data?.message ??
              'Não foi possível carregar os produtos.'
          );
        } else if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage(
            'Ocorreu um erro ao carregar os produtos.'
          );
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useFocusEffect(
    useCallback(() => {
      void loadProducts();
    }, [loadProducts])
  );

  return {
    products,
    loading,
    errorMessage,
    loadProducts,
  };
}