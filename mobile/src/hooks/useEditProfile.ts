import { useState } from 'react';

import { authService } from '../services/auth.service';

import { getApiErrorMessage } from '../utils/error';
import { isValidPhone } from '../utils/validacoes';

import { useAuth } from './useAuth';

export function useEditProfile() {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  async function saveProfile(): Promise<void> {
    setErrorMessage('');
    setSuccessMessage('');

    if (name.trim().length < 2) {
      setErrorMessage(
        'O nome deve possuir pelo menos 2 caracteres.',
      );

      return;
    }

    if (!isValidPhone(phone)) {
      setErrorMessage('Informe um telefone com DDD.');

      return;
    }

    try {
      setSaving(true);

      await authService.updateProfile({
        name: name.trim(),
        phone: phone.replace(/\D/g, ''),
      });

      await refreshUser();

      setSuccessMessage('Dados atualizados com sucesso.');
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          'Não foi possível atualizar os dados.',
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  async function changePassword(): Promise<void> {
    setErrorMessage('');
    setSuccessMessage('');

    if (!currentPassword) {
      setErrorMessage('Informe a senha atual.');

      return;
    }

    if (newPassword.length < 8 || newPassword.length > 72) {
      setErrorMessage(
        'A nova senha deve possuir de 8 a 72 caracteres.',
      );

      return;
    }

    try {
      setSaving(true);

      await authService.updateProfile({
        currentPassword,
        newPassword,
      });

      setCurrentPassword('');
      setNewPassword('');
      setSuccessMessage('Senha alterada com sucesso.');
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          'Não foi possível alterar a senha.',
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  return {
    name,
    phone,
    currentPassword,
    newPassword,
    saving,
    errorMessage,
    successMessage,
    setName,
    setPhone,
    setCurrentPassword,
    setNewPassword,
    saveProfile,
    changePassword,
  };
}
