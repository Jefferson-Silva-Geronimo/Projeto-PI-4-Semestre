import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  orderService,
} from '../services/order.service';

import type {
  Order,
} from '../types/order';

import {
  getApiErrorMessage,
} from '../utils/error';

interface UseOrderDetailsProps {
  orderId: string;
}

export function useOrderDetails({
  orderId,
}: UseOrderDetailsProps) {
  const [order, setOrder] =
    useState<Order | null>(null);

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

  const loadOrder = useCallback(
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
          await orderService.findById(
            orderId,
          );

        setOrder(result);
      } catch (error: unknown) {
        setOrder(null);

        setErrorMessage(
          getApiErrorMessage(
            error,
            'Não foi possível carregar o pedido.',
          ),
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [orderId],
  );

  const refreshOrder =
    useCallback(
      async (): Promise<void> => {
        await loadOrder({
          refreshing: true,
        });
      },
      [loadOrder],
    );

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  return {
    order,
    loading,
    refreshing,
    errorMessage,
    loadOrder,
    refreshOrder,
  };
}