import { useRef } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
} from 'react-native';

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import AppButton from '../components/AppButton';
import AppTextField from '../components/AppTextField';
import FeedbackMessage from '../components/FeedbackMessage';
import PasswordInput from '../components/PasswordInput';
import ScreenHeader from '../components/ScreenHeader';
import { useEditProfile } from '../hooks/useEditProfile';
import { commonStyles as styles } from '../theme/commonStyles';

import type { ClientStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<
  ClientStackParamList,
  'EditProfile'
>;

export default function EditProfileScreen({
  navigation,
}: Props) {
  const form = useEditProfile();

  const phoneRef = useRef<TextInput>(null);
  const newPasswordRef = useRef<TextInput>(null);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Editar perfil"
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === 'ios' ? 'padding' : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
        >
          <AppTextField
            label="Nome"
            value={form.name}
            onChangeText={form.setName}
            autoComplete="name"
            textContentType="name"
            autoCapitalize="words"
            editable={!form.saving}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => phoneRef.current?.focus()}
          />

          <AppTextField
            ref={phoneRef}
            label="Telefone"
            value={form.phone}
            onChangeText={form.setPhone}
            placeholder="11 91234-5678"
            helperText="Com DDD."
            keyboardType="phone-pad"
            autoComplete="tel"
            textContentType="telephoneNumber"
            maxLength={15}
            editable={!form.saving}
            returnKeyType="done"
          />

          <AppButton
            label="Salvar dados"
            loading={form.saving}
            onPress={() => {
              void form.saveProfile();
            }}
          />

          <Text
            style={[styles.cardTitle, { marginTop: 12 }]}
            accessibilityRole="header"
          >
            Alterar senha
          </Text>

          <PasswordInput
            label="Senha atual"
            value={form.currentPassword}
            onChangeText={form.setCurrentPassword}
            autoComplete="current-password"
            textContentType="password"
            editable={!form.saving}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => newPasswordRef.current?.focus()}
          />

          <PasswordInput
            ref={newPasswordRef}
            label="Nova senha"
            value={form.newPassword}
            onChangeText={form.setNewPassword}
            autoComplete="new-password"
            textContentType="newPassword"
            editable={!form.saving}
            returnKeyType="done"
          />

          <AppButton
            variant="outline"
            label="Alterar senha"
            loading={form.saving}
            onPress={() => {
              void form.changePassword();
            }}
          />

          <FeedbackMessage
            kind="error"
            message={form.errorMessage}
            style={styles.errorText}
          />

          <FeedbackMessage
            kind="success"
            message={form.successMessage}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
