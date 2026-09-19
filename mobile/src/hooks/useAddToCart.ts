import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  cartService,
} from '../services/cart.service';

import {
  getApiErrorMessage,
} from '../utils/error';

interface UseAddToCartProps {
  productId: string;
  maximumQuantity: number;
}

export function useAddToCart({
  productId,
  maximumQuantity,
}: UseAddToCartProps) {
  const [quantity, setQuantity] =
    useState(1);

  const [loading, setLoading] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const [
    successMessage,
    setSuccessMessage,
  ] = useState('');

  useEffect(() => {
    setQuantity((currentQuantity) => {
      const maximumAllowed =
        Math.min(
          maximumQuantity,
          99,
        );

      if (maximumAllowed < 1) {
        return 1;
      }

      return Math.min(
        currentQuantity,
        maximumAllowed,
      );
    });
  }, [maximumQuantity]);

  const incrementQuantity =
    useCallback((): void => {
      setErrorMessage('');
      setSuccessMessage('');

      setQuantity(
        (currentQuantity) =>
          Math.min(
            currentQuantity + 1,
            maximumQuantity,
            99,
          ),
      );
    }, [maximumQuantity]);

  const decrementQuantity =
    useCallback((): void => {
      setErrorMessage('');
      setSuccessMessage('');

      setQuantity(
        (currentQuantity) =>
          Math.max(
            currentQuantity - 1,
            1,
          ),
      );
    }, []);

  const addToCart = useCallback(
    async (): Promise<boolean> => {
      setErrorMessage('');
      setSuccessMessage('');

      if (maximumQuantity <= 0) {
        setErrorMessage(
          'O produto está indisponível.',
        );

        return false;
      }

      if (
        quantity < 1 ||
        quantity > maximumQuantity ||
        quantity > 99
      ) {
        setErrorMessage(
          'A quantidade selecionada é inválida.',
        );

        return false;
      }

      try {
        setLoading(true);

        await cartService.addItem({
          productId,
          quantity,
        });

        setSuccessMessage(
          'Produto adicionado ao carrinho.',
        );

        return true;
      } catch (error: unknown) {
        setErrorMessage(
          getApiErrorMessage(
            error,
            'Não foi possível adicionar o produto ao carrinho.',
          ),
        );

        return false;
      } finally {
        setLoading(false);
      }
    },
    [
      maximumQuantity,
      productId,
      quantity,
    ],
  );

  return {
    quantity,
    loading,
    errorMessage,
    successMessage,
    incrementQuantity,
    decrementQuantity,
    addToCart,
  };
}