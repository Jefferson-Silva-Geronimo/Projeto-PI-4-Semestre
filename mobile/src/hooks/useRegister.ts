import { useState } from 'react';
import axios from 'axios';

import { authService } from '../services/auth.service';

export function useRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] =
    useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  function validateForm() {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName) {
      return 'Informe o seu nome.';
    }

    if (normalizedName.length < 3) {
      return 'O nome deve possuir pelo menos 3 caracteres.';
    }

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

    if (!passwordConfirmation) {
      return 'Confirme a sua senha.';
    }

    if (password !== passwordConfirmation) {
      return 'As senhas não são iguais.';
    }

    return null;
  }

  async function handleRegister() {
    setErrorMessage('');
    setSuccessMessage('');

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return false;
    }

    try {
      setLoading(true);

      await authService.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      setSuccessMessage('Cadastro realizado com sucesso.');

      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            'Não foi possível realizar o cadastro.'
        );
      } else {
        setErrorMessage('Ocorreu um erro. Tente novamente.');
      }

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