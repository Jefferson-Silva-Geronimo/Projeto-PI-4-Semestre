import {
  useCallback,
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

export function useAdminOrders() {
  const [orders, setOrders] =
    useState<Order[]>([]);

  const [
    pagination,
    setPagination,
  ] = useState<Pagination>(
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

  const loadOrders = useCallback(
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
          await orderService.listForAdmin({
            page: 1,
            pageSize: 20,
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
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
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
    loadOrders,
    refreshOrders,
  };
}