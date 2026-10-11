import {
  SafeAreaView,
  Text,
  View,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import AppButton from '../components/AppButton';
import AppTextField from '../components/AppTextField';
import FeedbackMessage from '../components/FeedbackMessage';
import ScreenTitle from '../components/ScreenTitle';
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

        <ScreenTitle style={styles.title}>
          Recuperar senha
        </ScreenTitle>

        <Text style={styles.subtitle}>
          Informe seu e-mail para receber as
          instruções de recuperação.
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
            returnKeyType="send"
            onSubmitEditing={onForgotPasswordPress}
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
            label="Enviar recuperação"
            loading={loading}
            loadingLabel="Enviando..."
            onPress={onForgotPasswordPress}
            style={{ marginTop: 8 }}
          />

          <AppButton
            variant="link"
            label="Voltar para o login"
            disabled={loading}
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
