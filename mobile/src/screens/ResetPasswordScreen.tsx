import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

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

        <Text style={styles.title}>
          Criar nova senha
        </Text>

        <Text style={styles.subtitle}>
          Escolha uma nova senha para acessar
          sua conta.
        </Text>

        <View style={styles.form}>
          <TextInput
            style={[
              styles.input,
              errorMessage
                ? styles.inputError
                : undefined,
            ]}
            placeholder="Digite a nova senha"
            placeholderTextColor="#64748B"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
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
            placeholder="Confirme a nova senha"
            placeholderTextColor="#64748B"
            value={passwordConfirmation}
            onChangeText={setPasswordConfirmation}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
            returnKeyType="done"
            onSubmitEditing={
              onResetPasswordPress
            }
          />

          <Text style={styles.helperText}>
            A senha deve possuir pelo menos 8
            caracteres.
          </Text>

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
            onPress={onResetPasswordPress}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading
                ? 'Alterando...'
                : 'Alterar senha'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            disabled={loading}
            onPress={() =>
              navigation.navigate('Login')
            }
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