import {
  useCallback,
  useState,
} from 'react';

import {
  productService,
} from '../services/product.service';

import {
  getApiErrorMessage,
} from '../utils/error';

export function useProductStatus() {
  const [
    processingProductId,
    setProcessingProductId,
  ] = useState<string | null>(
    null,
  );

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const changeStatus =
    useCallback(
      async (
        productId: string,
        active: boolean,
      ): Promise<boolean> => {
        try {
          setProcessingProductId(
            productId,
          );

          setErrorMessage('');

          await productService.updateStatus(
            productId,
            {
              active,
            },
          );

          return true;
        } catch (error: unknown) {
          setErrorMessage(
            getApiErrorMessage(
              error,
              active
                ? 'Não foi possível reativar o produto.'
                : 'Não foi possível inativar o produto.',
            ),
          );

          return false;
        } finally {
          setProcessingProductId(
            null,
          );
        }
      },
      [],
    );

  return {
    processingProductId,
    errorMessage,
    changeStatus,
  };
}