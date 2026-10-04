import {
  useCallback,
  useRef,
  useState,
} from 'react';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  orderService,
} from '../services/order.service';

import type {
  Pagination,
} from '../types/api';

import type {
  Order,
  OrderStatus,
} from '../types/order';

import {
  getApiErrorMessage,
} from '../utils/error';

const initialPagination: Pagination = {
  page: 1,
  pageSize: 20,
  totalItems: 0,
  totalPages: 0,
};

export function useOrders() {
  const [orders, setOrders] =
    useState<Order[]>([]);

  const [
    pagination,
    setPagination,
  ] = useState<Pagination>(
    initialPagination,
  );

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<OrderStatus | null>(
    null,
  );

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

  const loadOrders = useCallback(
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
          await orderService.list({
            page: 1,
            pageSize: 20,
            status:
              statusFilter ?? undefined,
          });

        setOrders(result.data);
        setPagination(
          result.pagination,
        );
      } catch (error: unknown) {
        setErrorMessage(
          getApiErrorMessage(
            error,
            'Não foi possível carregar os pedidos.',
          ),
        );
      } finally {
        loadedRef.current = true;
        setLoading(false);
        setRefreshing(false);
      }
    },
    [statusFilter],
  );

  const refreshOrders =
    useCallback(
      async (): Promise<void> => {
        await loadOrders({
          refreshing: true,
        });
      },
      [loadOrders],
    );

  useFocusEffect(
    useCallback(() => {
      void loadOrders();
    }, [loadOrders]),
  );

  return {
    orders,
    pagination,
    loading,
    refreshing,
    errorMessage,
    statusFilter,
    setStatusFilter,
    loadOrders,
    refreshOrders,
  };
}