import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  productService,
} from '../services/product.service';

import {
  formatCentsForInput,
  parseCurrencyInputToCents,
} from '../utils/currency';

import {
  getApiErrorMessage,
} from '../utils/error';

interface UseEditProductProps {
  productId: string;
}

export function useEditProduct({
  productId,
}: UseEditProductProps) {
  const [name, setName] =
    useState('');

  const [
    description,
    setDescription,
  ] = useState('');

  const [price, setPrice] =
    useState('');

  const [stock, setStock] =
    useState('');

  const [imageUrl, setImageUrl] =
    useState('');

  const [active, setActive] =
    useState(true);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const [
    successMessage,
    setSuccessMessage,
  ] = useState('');

  const loadProduct = useCallback(
    async (): Promise<void> => {
      try {
        setLoading(true);
        setErrorMessage('');

        const product =
          await productService
            .findByIdForAdmin(
              productId,
            );

        setName(product.name);

        setDescription(
          product.description,
        );

        setPrice(
          formatCentsForInput(
            product.priceInCents,
          ),
        );

        setStock(
          String(product.stock),
        );

        setImageUrl(
          product.imageUrl,
        );

        setActive(
          product.active,
        );
      } catch (error: unknown) {
        setErrorMessage(
          getApiErrorMessage(
            error,
            'Não foi possível carregar o produto.',
          ),
        );
      } finally {
        setLoading(false);
      }
    },
    [productId],
  );

  function validateForm():
    string | null {
    if (name.trim().length < 2) {
      return (
        'O nome deve possuir pelo menos ' +
        '2 caracteres.'
      );
    }

    if (
      description.trim().length < 5
    ) {
      return (
        'A descrição deve possuir pelo menos ' +
        '5 caracteres.'
      );
    }

    const priceInCents =
      parseCurrencyInputToCents(
        price,
      );

    if (
      priceInCents === null ||
      priceInCents <= 0
    ) {
      return 'Informe um preço válido.';
    }

    const stockAsNumber =
      Number(stock.trim());

    if (
      !Number.isInteger(
        stockAsNumber,
      ) ||
      stockAsNumber < 0
    ) {
      return (
        'Informe um estoque válido.'
      );
    }

    const normalizedImageUrl =
      imageUrl.trim();

    if (!normalizedImageUrl) {
      return (
        'Informe a URL da imagem.'
      );
    }

    try {
      const parsedUrl = new URL(
        normalizedImageUrl,
      );

      if (
        parsedUrl.protocol !==
          'http:' &&
        parsedUrl.protocol !==
          'https:'
      ) {
        return (
          'Informe uma URL de imagem válida.'
        );
      }
    } catch {
      return (
        'Informe uma URL de imagem válida.'
      );
    }

    return null;
  }

  const saveProduct =
    useCallback(
      async (): Promise<boolean> => {
        setErrorMessage('');
        setSuccessMessage('');

        const validationError =
          validateForm();

        if (validationError) {
          setErrorMessage(
            validationError,
          );

          return false;
        }

        const priceInCents =
          parseCurrencyInputToCents(
            price,
          );

        if (priceInCents === null) {
          setErrorMessage(
            'Informe um preço válido.',
          );

          return false;
        }

        try {
          setSaving(true);

          await productService.update(
            productId,
            {
              name: name.trim(),

              description:
                description.trim(),

              priceInCents,

              stock: Number(
                stock.trim(),
              ),

              imageUrl:
                imageUrl.trim(),

              active,
            },
          );

          setSuccessMessage(
            'Produto atualizado com sucesso.',
          );

          return true;
        } catch (error: unknown) {
          setErrorMessage(
            getApiErrorMessage(
              error,
              'Não foi possível atualizar o produto.',
            ),
          );

          return false;
        } finally {
          setSaving(false);
        }
      },
      [
        active,
        description,
        imageUrl,
        name,
        price,
        productId,
        stock,
      ],
    );

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

  return {
    name,
    description,
    price,
    stock,
    imageUrl,
    active,
    loading,
    saving,
    errorMessage,
    successMessage,
    setName,
    setDescription,
    setPrice,
    setStock,
    setImageUrl,
    setActive,
    loadProduct,
    saveProduct,
  };
}