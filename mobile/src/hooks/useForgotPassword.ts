import { useState } from 'react';
import axios from 'axios';

import { authService } from '../services/auth.service';

interface ForgotPasswordResult {
  message: string;
  token?: string;
}

export function useForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  function validateEmail(): string | null {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      return 'Informe o seu e-mail.';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      return 'Digite um e-mail válido.';
    }

    return null;
  }

  async function handleForgotPassword(): Promise<
    ForgotPasswordResult | null
  > {
    setErrorMessage('');
    setSuccessMessage('');

    const validationError = validateEmail();

    if (validationError) {
      setErrorMessage(validationError);
      return null;
    }

    try {
      setLoading(true);

      const normalizedEmail = email.trim().toLowerCase();

      const result: ForgotPasswordResult =
        await authService.forgotPassword(normalizedEmail);

      setSuccessMessage(
        result.message ||
          'As instruções de recuperação foram geradas.'
      );

      return result;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            'Não foi possível solicitar a recuperação.'
        );
      } else {
        setErrorMessage(
          'Ocorreu um erro. Tente novamente.'
        );
      }

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