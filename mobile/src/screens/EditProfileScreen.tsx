import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import PasswordInput from '../components/PasswordInput';
import ScreenHeader from '../components/ScreenHeader';
import { useEditProfile } from '../hooks/useEditProfile';
import { authStyles } from '../theme/authStyles';
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
          <View>
            <Text style={styles.label}>Nome</Text>

            <TextInput
              style={authStyles.input}
              value={form.name}
              onChangeText={form.setName}
              placeholderTextColor="#64748B"
              editable={!form.saving}
            />
          </View>

          <View>
            <Text style={styles.label}>Telefone</Text>

            <TextInput
              style={authStyles.input}
              value={form.phone}
              onChangeText={form.setPhone}
              placeholder="DDD + número"
              placeholderTextColor="#64748B"
              keyboardType="phone-pad"
              maxLength={15}
              editable={!form.saving}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              form.saving ? styles.disabled : undefined,
            ]}
            activeOpacity={0.8}
            disabled={form.saving}
            onPress={() => {
              void form.saveProfile();
            }}
            accessibilityRole="button"
          >
            <Text style={styles.primaryButtonText}>
              Salvar dados
            </Text>
          </TouchableOpacity>

          <Text style={[styles.cardTitle, { marginTop: 12 }]}>
            Alterar senha
          </Text>

          <PasswordInput
            placeholder="Senha atual"
            value={form.currentPassword}
            onChangeText={form.setCurrentPassword}
            editable={!form.saving}
          />

          <PasswordInput
            placeholder="Nova senha"
            value={form.newPassword}
            onChangeText={form.setNewPassword}
            editable={!form.saving}
          />

          <TouchableOpacity
            style={styles.outlineButton}
            activeOpacity={0.8}
            disabled={form.saving}
            onPress={() => {
              void form.changePassword();
            }}
            accessibilityRole="button"
          >
            <Text style={styles.outlineButtonText}>
              Alterar senha
            </Text>
          </TouchableOpacity>

          {form.errorMessage ? (
            <Text
              style={styles.errorText}
              accessibilityRole="alert"
            >
              {form.errorMessage}
            </Text>
          ) : null}

          {form.successMessage ? (
            <Text
              style={[styles.cardText, { color: '#15803D' }]}
              accessibilityRole="alert"
            >
              {form.successMessage}
            </Text>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
