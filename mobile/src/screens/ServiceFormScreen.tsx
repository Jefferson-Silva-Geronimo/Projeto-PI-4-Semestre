import {
  ActivityIndicator,
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

import ScreenHeader from '../components/ScreenHeader';
import { useServiceForm } from '../hooks/useServiceForm';
import { authStyles } from '../theme/authStyles';
import { commonStyles as styles } from '../theme/commonStyles';
import { confirmAction } from '../utils/confirm';

import type { AdminStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<
  AdminStackParamList,
  'ServiceForm'
>;

export default function ServiceFormScreen({
  navigation,
  route,
}: Props) {
  const serviceId = route.params?.serviceId;

  const form = useServiceForm(serviceId);

  async function handleSave(): Promise<void> {
    if (await form.save()) {
      navigation.goBack();
    }
  }

  async function handleRemove(): Promise<void> {
    const confirmed = await confirmAction({
      title: 'Excluir serviço',
      message: `Deseja excluir ${form.name}?`,
      confirmText: 'Excluir',
      destructive: true,
    });

    if (confirmed && (await form.remove())) {
      navigation.goBack();
    }
  }

  const priceFields = [
    {
      label: 'Preço porte P',
      value: form.priceSmall,
      onChange: form.setPriceSmall,
    },
    {
      label: 'Preço porte M',
      value: form.priceMedium,
      onChange: form.setPriceMedium,
    },
    {
      label: 'Preço porte G',
      value: form.priceLarge,
      onChange: form.setPriceLarge,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={serviceId ? 'Editar serviço' : 'Novo serviço'}
        onBack={() => navigation.goBack()}
      />

      {form.loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2D6CDF" />
        </View>
      ) : (
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
                placeholder="Ex.: Banho e tosa"
                placeholderTextColor="#64748B"
                editable={!form.saving}
              />
            </View>

            <View>
              <Text style={styles.label}>Descrição</Text>

              <TextInput
                style={[
                  authStyles.input,
                  {
                    height: 96,
                    paddingTop: 14,
                    textAlignVertical: 'top',
                  },
                ]}
                value={form.description}
                onChangeText={form.setDescription}
                placeholder="O que está incluso no serviço"
                placeholderTextColor="#64748B"
                multiline
                editable={!form.saving}
              />
            </View>

            <View>
              <Text style={styles.label}>
                Duração (minutos)
              </Text>

              <TextInput
                style={authStyles.input}
                value={form.duration}
                onChangeText={form.setDuration}
                placeholder="60"
                placeholderTextColor="#64748B"
                keyboardType="number-pad"
                editable={!form.saving}
              />

              <Text style={styles.helper}>
                Use múltiplos de 30 minutos.
              </Text>
            </View>

            {priceFields.map((field) => (
              <View key={field.label}>
                <Text style={styles.label}>{field.label}</Text>

                <TextInput
                  style={authStyles.input}
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder="Ex.: 50,00"
                  placeholderTextColor="#64748B"
                  keyboardType="decimal-pad"
                  editable={!form.saving}
                />
              </View>
            ))}

            {form.errorMessage ? (
              <Text
                style={styles.errorText}
                accessibilityRole="alert"
              >
                {form.errorMessage}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                form.saving ? styles.disabled : undefined,
              ]}
              activeOpacity={0.8}
              disabled={form.saving}
              onPress={() => {
                void handleSave();
              }}
              accessibilityRole="button"
            >
              <Text style={styles.primaryButtonText}>
                {form.saving ? 'Salvando...' : 'Salvar'}
              </Text>
            </TouchableOpacity>

            {serviceId ? (
              <TouchableOpacity
                style={styles.dangerButton}
                activeOpacity={0.8}
                disabled={form.saving}
                onPress={() => {
                  void handleRemove();
                }}
                accessibilityRole="button"
              >
                <Text style={styles.dangerButtonText}>
                  Excluir serviço
                </Text>
              </TouchableOpacity>
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
