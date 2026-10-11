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
import { useRegister } from '../hooks/useRegister';
import { authStyles as styles } from '../theme/authStyles';
import type { AuthStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<
  AuthStackParamList,
  'Register'
>;

export default function RegisterScreen({
  navigation,
}: Props) {
  const {
    name,
    email,
    phone,
    password,
    passwordConfirmation,
    loading,
    errorMessage,
    successMessage,
    setName,
    setEmail,
    setPhone,
    setPassword,
    setPasswordConfirmation,
    handleRegister,
  } = useRegister();

  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmationRef = useRef<TextInput>(null);

  const errorStyle = errorMessage ? styles.inputError : undefined;

  async function onRegisterPress() {
    const registered = await handleRegister();

    if (!registered) {
      return;
    }

    navigation.replace('Login');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>PETSHOP</Text>

        <ScreenTitle style={styles.title}>Criar conta</ScreenTitle>

        <Text style={styles.subtitle}>
          Preencha os dados para continuar.
        </Text>

        <View style={styles.form}>
          <AppTextField
            label="Nome completo"
            style={errorStyle}
            placeholder="Maria da Silva"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
            autoComplete="name"
            textContentType="name"
            editable={!loading}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => emailRef.current?.focus()}
          />

          <AppTextField
            ref={emailRef}
            label="E-mail"
            style={errorStyle}
            placeholder="nome@exemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            editable={!loading}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => phoneRef.current?.focus()}
          />

          <AppTextField
            ref={phoneRef}
            label="Telefone"
            style={errorStyle}
            placeholder="11 91234-5678"
            helperText="Com DDD."
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoComplete="tel"
            textContentType="telephoneNumber"
            maxLength={15}
            editable={!loading}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          <PasswordInput
            ref={passwordRef}
            label="Senha"
            style={errorStyle}
            placeholder="Digite sua senha"
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
            label="Confirmar senha"
            style={errorStyle}
            placeholder="Repita a senha"
            autoComplete="new-password"
            textContentType="newPassword"
            value={passwordConfirmation}
            onChangeText={setPasswordConfirmation}
            editable={!loading}
            returnKeyType="done"
            onSubmitEditing={onRegisterPress}
          />

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
            label="Cadastrar"
            loading={loading}
            loadingLabel="Cadastrando..."
            onPress={onRegisterPress}
            style={{ marginTop: 8 }}
          />

          <AppButton
            variant="link"
            label="Já possui uma conta? Entrar"
            disabled={loading}
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
