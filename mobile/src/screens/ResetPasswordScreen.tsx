import { useRef } from 'react';

import {
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import AppButton from '../components/AppButton';
import FeedbackMessage from '../components/FeedbackMessage';
import PasswordInput from '../components/PasswordInput';
import ScreenTitle from '../components/ScreenTitle';
import { useResetPassword } from '../hooks/useResetPassword';
import { authStyles as styles } from '../theme/authStyles';
import type { AuthStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<
  AuthStackParamList,
  'ResetPassword'
>;

export default function ResetPasswordScreen({
  navigation,
  route,
}: Props) {
  const { token } = route.params;

  const {
    password,
    passwordConfirmation,
    loading,
    errorMessage,
    successMessage,
    setPassword,
    setPasswordConfirmation,
    handleResetPassword,
  } = useResetPassword({
    token,
  });

  const confirmationRef = useRef<TextInput>(null);

  const errorStyle = errorMessage ? styles.inputError : undefined;

  async function onResetPasswordPress() {
    const passwordWasReset =
      await handleResetPassword();

    if (!passwordWasReset) {
      return;
    }

    navigation.popToTop();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>
          PETSHOP
        </Text>

        <ScreenTitle style={styles.title}>
          Criar nova senha
        </ScreenTitle>

        <Text style={styles.subtitle}>
          Escolha uma nova senha para acessar
          sua conta.
        </Text>

        <View style={styles.form}>
          <PasswordInput
            label="Nova senha"
            style={errorStyle}
            placeholder="Digite a nova senha"
            autoComplete="new-password"
            textContentType="newPassword"
            value={password}
            onChangeText={setPassword}
            editable={!loading}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => confirmationRef.current?.focus()}
          />

          <PasswordInput
            ref={confirmationRef}
            label="Confirmar nova senha"
            style={errorStyle}
            placeholder="Repita a nova senha"
            autoComplete="new-password"
            textContentType="newPassword"
            value={passwordConfirmation}
            onChangeText={setPasswordConfirmation}
            editable={!loading}
            returnKeyType="done"
            onSubmitEditing={onResetPasswordPress}
          />

          <Text style={styles.helperText}>
            A senha deve possuir pelo menos 8
            caracteres.
          </Text>

          <FeedbackMessage
            kind="error"
            message={errorMessage}
            style={styles.errorText}
          />

          <FeedbackMessage
            kind="success"
            message={successMessage}
            style={styles.successText}
          />

          <AppButton
            size="large"
            label="Alterar senha"
            loading={loading}
            loadingLabel="Alterando..."
            onPress={onResetPasswordPress}
            style={{ marginTop: 8 }}
          />

          <AppButton
            variant="link"
            label="Voltar para o login"
            disabled={loading}
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
