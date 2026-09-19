import {
  useState,
} from 'react';

import {
  productService,
} from '../services/product.service';

import {
  parseCurrencyInputToCents,
} from '../utils/currency';

import {
  getApiErrorMessage,
} from '../utils/error';

export function useCreateProduct() {
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

  function validateForm():
    string | null {
    const normalizedName =
      name.trim();

    const normalizedDescription =
      description.trim();

    const normalizedImageUrl =
      imageUrl.trim();

    if (
      normalizedName.length < 2
    ) {
      return (
        'O nome deve possuir pelo menos ' +
        '2 caracteres.'
      );
    }

    if (
      normalizedDescription.length <
      5
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

    if (!stock.trim()) {
      return (
        'Informe a quantidade em estoque.'
      );
    }

    const stockAsNumber = Number(
      stock.trim(),
    );

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

  async function handleCreateProduct():
    Promise<boolean> {
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
      setLoading(true);

      await productService.create({
        name: name.trim(),
        description:
          description.trim(),

        priceInCents,

        stock: Number(
          stock.trim(),
        ),

        imageUrl:
          imageUrl.trim(),
      });

      setSuccessMessage(
        'Produto cadastrado com sucesso.',
      );

      return true;
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          'Não foi possível cadastrar o produto.',
        ),
      );

      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    name,
    description,
    price,
    stock,
    imageUrl,
    loading,
    errorMessage,
    successMessage,
    setName,
    setDescription,
    setPrice,
    setStock,
    setImageUrl,
    handleCreateProduct,
  };
}