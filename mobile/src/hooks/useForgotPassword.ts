import {
  useState,
} from 'react';

import {
  authService,
} from '../services/auth.service';

import type {
  ForgotPasswordResponse,
} from '../types/auth';

import {
  getApiErrorMessage,
} from '../utils/error';

export function useForgotPassword() {
  const [email, setEmail] =
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

  function validateEmail():
    string | null {
    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) {
      return 'Informe o seu e-mail.';
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailPattern.test(
        normalizedEmail,
      )
    ) {
      return 'Digite um e-mail válido.';
    }

    return null;
  }

  async function handleForgotPassword():
    Promise<
      ForgotPasswordResponse | null
    > {
    setErrorMessage('');
    setSuccessMessage('');

    const validationError =
      validateEmail();

    if (validationError) {
      setErrorMessage(
        validationError,
      );

      return null;
    }

    try {
      setLoading(true);

      const result =
        await authService.forgotPassword(
          email
            .trim()
            .toLowerCase(),
        );

      setSuccessMessage(
        result.message ||
          'Solicitação realizada com sucesso.',
      );

      return result;
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          'Não foi possível solicitar a recuperação.',
        ),
      );

      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    loading,
    errorMessage,
    successMessage,
    setEmail,
    handleForgotPassword,
  };
}