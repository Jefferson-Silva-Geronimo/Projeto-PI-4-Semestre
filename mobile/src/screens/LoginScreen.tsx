import { useRef } from 'react';

import {
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import AppButton from '../components/AppButton';
import AppTextField from '../components/AppTextField';
import FeedbackMessage from '../components/FeedbackMessage';
import PasswordInput from '../components/PasswordInput';
import ScreenTitle from '../components/ScreenTitle';
import { useLogin } from '../hooks/useLogin';
import { authStyles as styles } from '../theme/authStyles';
import type { AuthStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<
  AuthStackParamList,
  'Login'
>;

export default function LoginScreen({
  navigation,
}: Props) {
  const {
    email,
    password,
    loading,
    errorMessage,
    setEmail,
    setPassword,
    handleLogin,
  } = useLogin();

  const passwordRef = useRef<TextInput>(null);

  async function onLoginPress() {
    await handleLogin();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>
          PETSHOP
        </Text>

        <ScreenTitle style={styles.title}>
          Bem-vindo
        </ScreenTitle>

        <Text style={styles.subtitle}>
          Entre com suas credenciais para continuar.
        </Text>

        <View style={styles.form}>
          <AppTextField
            label="E-mail"
            style={errorMessage ? styles.inputError : undefined}
            placeholder="nome@exemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          <PasswordInput
            ref={passwordRef}
            label="Senha"
            style={errorMessage ? styles.inputError : undefined}
            placeholder="Digite sua senha"
            autoComplete="current-password"
            textContentType="password"
            value={password}
            onChangeText={setPassword}
            editable={!loading}
            returnKeyType="done"
            onSubmitEditing={onLoginPress}
          />

          <FeedbackMessage
            kind="error"
            message={errorMessage}
            style={styles.errorText}
          />

          <AppButton
            size="large"
            label="Entrar"
            loading={loading}
            loadingLabel="Entrando..."
            onPress={onLoginPress}
            style={{ marginTop: 8 }}
          />

          <AppButton
            variant="link"
            label="Esqueci minha senha"
            disabled={loading}
            onPress={() => navigation.navigate('ForgotPassword')}
          />

          <AppButton
            variant="link"
            label="Criar conta"
            disabled={loading}
            onPress={() => navigation.navigate('Register')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
