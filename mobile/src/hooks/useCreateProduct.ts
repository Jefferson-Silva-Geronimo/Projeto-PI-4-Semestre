import { useState } from 'react';
import axios from 'axios';

import { productService } from '../services/product.service';

export function useCreateProduct() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  function validateForm(): string | null {
    const normalizedName = name.trim();
    const normalizedDescription = description.trim();
    const normalizedImageUrl = imageUrl.trim();

    if (!normalizedName) {
      return 'Informe o nome do produto.';
    }

    if (!normalizedDescription) {
      return 'Informe a descrição do produto.';
    }

    if (!price.trim()) {
      return 'Informe o preço do produto.';
    }

    const normalizedPrice = price
      .trim()
      .replace(',', '.');

    const priceAsNumber = Number(normalizedPrice);

    if (
      !Number.isFinite(priceAsNumber) ||
      priceAsNumber <= 0
    ) {
      return 'Informe um preço válido.';
    }

    if (!stock.trim()) {
      return 'Informe a quantidade em estoque.';
    }

    const stockAsNumber = Number(stock.trim());

    if (
      !Number.isInteger(stockAsNumber) ||
      stockAsNumber < 0
    ) {
      return 'Informe um estoque válido.';
    }

    if (!normalizedImageUrl) {
      return 'Informe a URL da imagem.';
    }

    return null;
  }

  async function handleCreateProduct(): Promise<boolean> {
    setErrorMessage('');
    setSuccessMessage('');

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return false;
    }

    try {
      setLoading(true);

      const priceAsNumber = Number(
        price.trim().replace(',', '.')
      );

      const priceInCents = Math.round(
        priceAsNumber * 100
      );

      await productService.create({
        name: name.trim(),
        description: description.trim(),
        priceInCents,
        stock: Number(stock.trim()),
        imageUrl: imageUrl.trim(),
      });

      setSuccessMessage(
        'Produto cadastrado com sucesso.'
      );

      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            'Não foi possível cadastrar o produto.'
        );
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          'Ocorreu um erro ao cadastrar o produto.'
        );
      }

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