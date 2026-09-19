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

import type {
  Cart,
  CartItem,
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

export function useCart() {
  const [cart, setCart] =
    useState<Cart>(emptyCart);

  const [loading, setLoading] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    processingItemId,
    setProcessingItemId,
  ] = useState<string | null>(
    null,
  );

  const [clearing, setClearing] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const loadCart = useCallback(
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
          await cartService.get();

        setCart(result);
      } catch (error: unknown) {
        setErrorMessage(
          getApiErrorMessage(
            error,
            'Não foi possível carregar o carrinho.',
          ),
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  const refreshCart = useCallback(
    async (): Promise<void> => {
      await loadCart({
        refreshing: true,
      });
    },
    [loadCart],
  );

  const updateItem = useCallback(
    async (
      itemId: string,
      quantity: number,
    ): Promise<boolean> => {
      try {
        setProcessingItemId(
          itemId,
        );

        setErrorMessage('');

        const result =
          await cartService.updateItem(
            itemId,
            {
              quantity,
            },
          );

        setCart(result);

        return true;
      } catch (error: unknown) {
        setErrorMessage(
          getApiErrorMessage(
            error,
            'Não foi possível alterar a quantidade.',
          ),
        );

        return false;
      } finally {
        setProcessingItemId(
          null,
        );
      }
    },
    [],
  );

  const incrementItem = useCallback(
    async (
      item: CartItem,
    ): Promise<boolean> => {
      if (
        item.quantity >=
          item.product.stock ||
        item.quantity >= 99
      ) {
        setErrorMessage(
          'Não há estoque suficiente para aumentar a quantidade.',
        );

        return false;
      }

      return updateItem(
        item.id,
        item.quantity + 1,
      );
    },
    [updateItem],
  );

  const decrementItem = useCallback(
    async (
      item: CartItem,
    ): Promise<boolean> => {
      if (item.quantity <= 1) {
        return false;
      }

      return updateItem(
        item.id,
        item.quantity - 1,
      );
    },
    [updateItem],
  );

  const removeItem = useCallback(
    async (
      itemId: string,
    ): Promise<boolean> => {
      try {
        setProcessingItemId(
          itemId,
        );

        setErrorMessage('');

        const result =
          await cartService.removeItem(
            itemId,
          );

        setCart(result);

        return true;
      } catch (error: unknown) {
        setErrorMessage(
          getApiErrorMessage(
            error,
            'Não foi possível remover o produto.',
          ),
        );

        return false;
      } finally {
        setProcessingItemId(
          null,
        );
      }
    },
    [],
  );

  const clearCart = useCallback(
    async (): Promise<boolean> => {
      try {
        setClearing(true);
        setErrorMessage('');

        await cartService.clear();

        setCart(emptyCart);

        return true;
      } catch (error: unknown) {
        setErrorMessage(
          getApiErrorMessage(
            error,
            'Não foi possível limpar o carrinho.',
          ),
        );

        return false;
      } finally {
        setClearing(false);
      }
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      void loadCart();
    }, [loadCart]),
  );

  return {
    cart,
    loading,
    refreshing,
    errorMessage,
    processingItemId,
    clearing,
    loadCart,
    refreshCart,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
  };
}