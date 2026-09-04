import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

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

  async function onLoginPress() {
    await handleLogin();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>
          PETSHOP
        </Text>

        <Text style={styles.title}>
          Bem-vindo
        </Text>

        <Text style={styles.subtitle}>
          Entre com suas credenciais para continuar.
        </Text>

        <View style={styles.form}>
          <TextInput
            style={[
              styles.input,
              errorMessage
                ? styles.inputError
                : undefined,
            ]}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#64748B"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            returnKeyType="next"
          />

          <TextInput
            style={[
              styles.input,
              errorMessage
                ? styles.inputError
                : undefined,
            ]}
            placeholder="Digite sua senha"
            placeholderTextColor="#64748B"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            value={password}
            onChangeText={setPassword}
            editable={!loading}
            returnKeyType="done"
            onSubmitEditing={onLoginPress}
          />

          {errorMessage ? (
            <Text
              style={styles.errorText}
              accessibilityRole="alert"
            >
              {errorMessage}
            </Text>
          ) : null}

          <TouchableOpacity
            style={[
              styles.button,
              loading
                ? styles.buttonDisabled
                : undefined,
            ]}
            activeOpacity={0.8}
            onPress={onLoginPress}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Entrar no aplicativo"
            accessibilityState={{
              disabled: loading,
              busy: loading,
            }}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            disabled={loading}
            onPress={() =>
              navigation.navigate('ForgotPassword')
            }
            accessibilityRole="button"
            accessibilityLabel="Recuperar senha"
          >
            <Text style={styles.link}>
              Esqueci minha senha
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            disabled={loading}
            onPress={() =>
              navigation.navigate('Register')
            }
            accessibilityRole="button"
            accessibilityLabel="Criar uma nova conta"
          >
            <Text style={styles.link}>
              Criar conta
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}