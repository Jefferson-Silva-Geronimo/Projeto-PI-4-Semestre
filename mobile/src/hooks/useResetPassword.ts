import { useState } from 'react';
import axios from 'axios';

import { authService } from '../services/auth.service';

interface UseResetPasswordProps {
  token: string;
}

export function useResetPassword({
  token,
}: UseResetPasswordProps) {
  const [password, setPassword] = useState('');
  const [
    passwordConfirmation,
    setPasswordConfirmation,
  ] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] =
    useState('');

  function validateForm(): string | null {
    if (!token) {
      return 'Token de recuperação não informado.';
    }

    if (!password) {
      return 'Informe a nova senha.';
    }

    if (password.length < 8) {
      return 'A senha deve possuir pelo menos 8 caracteres.';
    }

    if (!passwordConfirmation) {
      return 'Confirme a nova senha.';
    }

    if (password !== passwordConfirmation) {
      return 'As senhas não são iguais.';
    }

    return null;
  }

  async function handleResetPassword(): Promise<boolean> {
    setErrorMessage('');
    setSuccessMessage('');

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return false;
    }

    try {
      setLoading(true);

      const result = await authService.resetPassword({
        token,
        password,
      });

      setSuccessMessage(
        result.message ?? 'Senha alterada com sucesso.'
      );

      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            'Não foi possível alterar a senha.'
        );
      } else {
        setErrorMessage(
          'Ocorreu um erro. Tente novamente.'
        );
      }

      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    password,
    passwordConfirmation,
    loading,
    errorMessage,
    successMessage,
    setPassword,
    setPasswordConfirmation,
    handleResetPassword,
  };
}