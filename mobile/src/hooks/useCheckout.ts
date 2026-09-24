import {
  useCallback,
  useState,
} from 'react';

import {
  Platform,
} from 'react-native';

import * as WebBrowser from 'expo-web-browser';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  cartService,
} from '../services/cart.service';

import {
  MERCADOPAGO_RETURN_URL,
} from '../config/payment';

import {
  paymentService,
} from '../services/payment.service';

import type {
  Cart,
} from '../types/cart';

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

  const startCheckout =
    useCallback(
      async (): Promise<string | null> => {
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

          const checkout =
            await paymentService.createCheckout();

          setCart(emptyCart);

          try {
            if (Platform.OS === 'web') {
              await WebBrowser.openBrowserAsync(
                checkout.initPoint,
              );
            } else {
              await WebBrowser.openAuthSessionAsync(
                checkout.initPoint,
                MERCADOPAGO_RETURN_URL,
              );
            }
          } catch {
            setErrorMessage(
              'O pedido foi criado. Acesse os pedidos para retomar o pagamento.',
            );
          }

          return checkout.orderId;
        } catch (error: unknown) {
          setErrorMessage(
            getApiErrorMessage(
              error,
              'Não foi possível iniciar o pagamento.',
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
    startCheckout,
  };
}
