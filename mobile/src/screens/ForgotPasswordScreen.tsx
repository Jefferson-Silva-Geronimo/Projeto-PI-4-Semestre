import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useForgotPassword } from '../hooks/useForgotPassword';
import { authStyles as styles } from '../theme/authStyles';
import type { AuthStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<
  AuthStackParamList,
  'ForgotPassword'
>;

export default function ForgotPasswordScreen({
  navigation,
}: Props) {
  const {
    email,
    loading,
    errorMessage,
    successMessage,
    setEmail,
    handleForgotPassword,
  } = useForgotPassword();

  async function onForgotPasswordPress() {
    const result = await handleForgotPassword();

    if (!result?.token) {
      return;
    }

    navigation.navigate('ResetPassword', {
      token: result.token,
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>
          PETSHOP
        </Text>

        <Text style={styles.title}>
          Recuperar senha
        </Text>

        <Text style={styles.subtitle}>
          Informe seu e-mail para receber as
          instruções de recuperação.
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
            returnKeyType="send"
            onSubmitEditing={
              onForgotPasswordPress
            }
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
              loading
                ? styles.buttonDisabled
                : undefined,
            ]}
            activeOpacity={0.8}
            disabled={loading}
            onPress={onForgotPasswordPress}
          >
            <Text style={styles.buttonText}>
              {loading
                ? 'Enviando...'
                : 'Enviar recuperação'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            disabled={loading}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.link}>
              Voltar para o login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}