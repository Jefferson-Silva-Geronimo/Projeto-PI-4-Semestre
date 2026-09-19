import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  productService,
} from '../services/product.service';

import type {
  Product,
} from '../types/product';

import {
  getApiErrorMessage,
} from '../utils/error';

interface UseProductDetailsProps {
  productId: string;
}

export function useProductDetails({
  productId,
}: UseProductDetailsProps) {
  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const loadProduct = useCallback(
    async (
      options?: {
        refreshing?: boolean;
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
          await productService.findActiveById(
            productId,
          );

        setProduct(result);
      } catch (error: unknown) {
        setProduct(null);

        setErrorMessage(
          getApiErrorMessage(
            error,
            'Não foi possível carregar o produto.',
          ),
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [productId],
  );

  const refreshProduct =
    useCallback(
      async (): Promise<void> => {
        await loadProduct({
          refreshing: true,
        });
      },
      [loadProduct],
    );

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

  return {
    product,
    loading,
    refreshing,
    errorMessage,
    loadProduct,
    refreshProduct,
  };
}