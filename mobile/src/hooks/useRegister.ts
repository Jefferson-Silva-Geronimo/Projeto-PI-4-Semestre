import {
  useState,
} from 'react';

import {
  authService,
} from '../services/auth.service';

import {
  getApiErrorMessage,
} from '../utils/error';

export function useRegister() {
  const [name, setName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [
    passwordConfirmation,
    setPasswordConfirmation,
  ] = useState('');

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

    const normalizedEmail =
      email.trim().toLowerCase();

    if (
      normalizedName.length < 2
    ) {
      return (
        'O nome deve possuir pelo menos ' +
        '2 caracteres.'
      );
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

    if (password.length < 8) {
      return (
        'A senha deve possuir pelo menos ' +
        '8 caracteres.'
      );
    }

    if (password.length > 72) {
      return (
        'A senha deve possuir no máximo ' +
        '72 caracteres.'
      );
    }

    if (!passwordConfirmation) {
      return 'Confirme a sua senha.';
    }

    if (
      password !==
      passwordConfirmation
    ) {
      return (
        'As senhas não são iguais.'
      );
    }

    return null;
  }

  async function handleRegister():
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

    try {
      setLoading(true);

      await authService.register({
        name: name.trim(),

        email: email
          .trim()
          .toLowerCase(),

        password,
      });

      setSuccessMessage(
        'Cadastro realizado com sucesso.',
      );

      return true;
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          'Não foi possível realizar o cadastro.',
        ),
      );

      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    name,
    email,
    password,
    passwordConfirmation,
    loading,
    errorMessage,
    successMessage,
    setName,
    setEmail,
    setPassword,
    setPasswordConfirmation,
    handleRegister,
  };
}