import {
  useCallback,
  useState,
} from 'react';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  cartService,
} from '../services/cart.service';

import {
  orderService,
} from '../services/order.service';

import type {
  Cart,
} from '../types/cart';

import type {
  Order,
} from '../types/order';

import {
  getApiErrorMessage,
} from '../utils/error';

const emptyCart: Cart = {
  id: null,
  items: [],
  totalItems: 0,
  totalInCents: 0,
  hasUnavailableItems: false,
  createdAt: null,
  updatedAt: null,
};

export function useCheckout() {
  const [cart, setCart] =
    useState<Cart>(emptyCart);

  const [loading, setLoading] =
    useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const reloadCart = useCallback(
    async (): Promise<void> => {
      try {
        setLoading(true);
        setErrorMessage('');

        const result =
          await cartService.get();

        setCart(result);

        if (
          result.items.length === 0
        ) {
          setErrorMessage(
            'O carrinho está vazio.',
          );
        } else if (
          result.hasUnavailableItems
        ) {
          setErrorMessage(
            'Existem produtos indisponíveis no carrinho.',
          );
        }
      } catch (error: unknown) {
        setErrorMessage(
          getApiErrorMessage(
            error,
            'Não foi possível preparar o checkout.',
          ),
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const confirmOrder =
    useCallback(
      async (): Promise<Order | null> => {
        setErrorMessage('');

        if (
          cart.items.length === 0
        ) {
          setErrorMessage(
            'O carrinho está vazio.',
          );

          return null;
        }

        if (
          cart.hasUnavailableItems
        ) {
          setErrorMessage(
            'Revise os produtos indisponíveis antes de confirmar.',
          );

          return null;
        }

        try {
          setSubmitting(true);

          const order =
            await orderService.create();

          setCart(emptyCart);

          return order;
        } catch (error: unknown) {
          setErrorMessage(
            getApiErrorMessage(
              error,
              'Não foi possível confirmar o pedido.',
            ),
          );

          await reloadCart();

          return null;
        } finally {
          setSubmitting(false);
        }
      },
      [
        cart.hasUnavailableItems,
        cart.items.length,
        reloadCart,
      ],
    );

  useFocusEffect(
    useCallback(() => {
      void reloadCart();
    }, [reloadCart]),
  );

  return {
    cart,
    loading,
    submitting,
    errorMessage,
    reloadCart,
    confirmOrder,
  };
}