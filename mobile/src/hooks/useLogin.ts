import {
  useState,
} from 'react';

import { useAuth } from './useAuth';

import {
  getApiErrorMessage,
} from '../utils/error';

export function useLogin() {
  const { signIn } = useAuth();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  function validateForm():
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

    if (!password) {
      return 'Informe a sua senha.';
    }

    if (password.length < 8) {
      return (
        'A senha deve possuir pelo menos ' +
        '8 caracteres.'
      );
    }

    return null;
  }

  async function handleLogin() {
    setErrorMessage('');

    const validationError =
      validateForm();

    if (validationError) {
      setErrorMessage(
        validationError,
      );

      return null;
    }

    try {
      setLoading(true);

      return await signIn({
        email: email
          .trim()
          .toLowerCase(),

        password,
      });
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          'Não foi possível entrar.',
        ),
      );

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