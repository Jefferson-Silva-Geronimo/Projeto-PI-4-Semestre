import { useState } from 'react';
import axios from 'axios';

import { useAuth } from './useAuth';

export function useLogin() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function validateForm(): string | null {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      return 'Informe o seu e-mail.';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      return 'Digite um e-mail válido.';
    }

    if (!password) {
      return 'Informe a sua senha.';
    }

    if (password.length < 8) {
      return 'A senha deve possuir pelo menos 8 caracteres.';
    }

    return null;
  }

  async function handleLogin() {
    setErrorMessage('');

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return null;
    }

    try {
      setLoading(true);

      const result = await signIn({
        email: email.trim().toLowerCase(),
        password,
      });

      return result;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            'Não foi possível entrar. Verifique sua conexão.'
        );
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
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
    password,
    loading,
    errorMessage,
    setEmail,
    setPassword,
    handleLogin,
  };
}