import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import PasswordInput from '../components/PasswordInput';
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

        <Text style={styles.title}>Criar conta</Text>

        <Text style={styles.subtitle}>
          Preencha os dados para continuar.
        </Text>

        <View style={styles.form}>
          <TextInput
            style={[
              styles.input,
              errorMessage && styles.inputError,
            ]}
            placeholder="Nome completo"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
            autoComplete="name"
            editable={!loading}
            returnKeyType="next"
          />

          <TextInput
            style={[
              styles.input,
              errorMessage && styles.inputError,
            ]}
            placeholder="Digite seu e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            editable={!loading}
            returnKeyType="next"
          />

          <TextInput
            style={[
              styles.input,
              errorMessage && styles.inputError,
            ]}
            placeholder="Telefone com DDD"
            placeholderTextColor="#64748B"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoComplete="tel"
            maxLength={15}
            editable={!loading}
            returnKeyType="next"
          />

          <PasswordInput
            style={[
              styles.input,
              errorMessage && styles.inputError,
            ]}
            placeholder="Digite sua senha"
            value={password}
            onChangeText={setPassword}
            editable={!loading}
            returnKeyType="next"
          />

          <PasswordInput
            style={[
              styles.input,
              errorMessage && styles.inputError,
            ]}
            placeholder="Confirme sua senha"
            value={passwordConfirmation}
            onChangeText={setPasswordConfirmation}
            editable={!loading}
            returnKeyType="done"
            onSubmitEditing={onRegisterPress}
          />

          {errorMessage ? (
            <Text style={styles.errorText}>
              {errorMessage}
            </Text>
          ) : null}

          {successMessage ? (
            <Text style={styles.successText}>
              {successMessage}
            </Text>
          ) : null}

          <TouchableOpacity
            style={[
              styles.button,
              loading && styles.buttonDisabled,
            ]}
            activeOpacity={0.8}
            onPress={onRegisterPress}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            disabled={loading}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.link}>
              Já possui uma conta? Entrar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}