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
  OrderStatus,
} from '../types/order';

import {
  getApiErrorMessage,
} from '../utils/error';

interface UseAdminOrderDetailsProps {
  orderId: string;
}

export function useAdminOrderDetails({
  orderId,
}: UseAdminOrderDetailsProps) {
  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [updating, setUpdating] =
    useState(false);

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
          await orderService
            .findByIdForAdmin(
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

  const updateStatus =
    useCallback(
      async (
        status: OrderStatus,
      ): Promise<boolean> => {
        try {
          setUpdating(true);
          setErrorMessage('');

          const result =
            await orderService.updateStatus(
              orderId,
              status,
            );

          setOrder(result);

          return true;
        } catch (error: unknown) {
          setErrorMessage(
            getApiErrorMessage(
              error,
              'Não foi possível atualizar o pedido.',
            ),
          );

          return false;
        } finally {
          setUpdating(false);
        }
      },
      [orderId],
    );

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  return {
    order,
    loading,
    refreshing,
    updating,
    errorMessage,
    loadOrder,
    refreshOrder,
    updateStatus,
  };
}