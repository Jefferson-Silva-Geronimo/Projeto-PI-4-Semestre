import { useRef } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  TextInput,
  View,
} from 'react-native';

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import AppButton from '../components/AppButton';
import AppTextField, {
  type TextFieldRef,
} from '../components/AppTextField';
import FeedbackMessage from '../components/FeedbackMessage';
import LoadingIndicator from '../components/LoadingIndicator';
import ScreenHeader from '../components/ScreenHeader';
import { useServiceForm } from '../hooks/useServiceForm';
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

  const descriptionRef = useRef<TextFieldRef>(null);
  const durationRef = useRef<TextFieldRef>(null);
  const priceSmallRef = useRef<TextFieldRef>(null);
  const priceMediumRef = useRef<TextFieldRef>(null);
  const priceLargeRef = useRef<TextFieldRef>(null);

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
      label: 'Preço porte pequeno (P)',
      value: form.priceSmall,
      onChange: form.setPriceSmall,
      ref: priceSmallRef,
      next: priceMediumRef,
    },
    {
      label: 'Preço porte médio (M)',
      value: form.priceMedium,
      onChange: form.setPriceMedium,
      ref: priceMediumRef,
      next: priceLargeRef,
    },
    {
      label: 'Preço porte grande (G)',
      value: form.priceLarge,
      onChange: form.setPriceLarge,
      ref: priceLargeRef,
      next: undefined,
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
          <LoadingIndicator />
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
            <AppTextField
              label="Nome do serviço"
              value={form.name}
              onChangeText={form.setName}
              placeholder="Banho e tosa"
              autoCapitalize="sentences"
              editable={!form.saving}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() =>
                descriptionRef.current?.focus()
              }
            />

            <AppTextField
              ref={descriptionRef}
              label="Descrição"
              value={form.description}
              onChangeText={form.setDescription}
              placeholder="O que está incluso no serviço"
              multiline
              editable={!form.saving}
            />

            <AppTextField
              ref={durationRef}
              label="Duração em minutos"
              value={form.duration}
              onChangeText={form.setDuration}
              placeholder="60"
              helperText="Use múltiplos de 30 minutos."
              keyboardType="number-pad"
              editable={!form.saving}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() =>
                priceSmallRef.current?.focus()
              }
            />

            {priceFields.map((field) => (
              <AppTextField
                key={field.label}
                ref={field.ref}
                label={field.label}
                value={field.value}
                onChangeText={field.onChange}
                placeholder="50,00"
                keyboardType="decimal-pad"
                editable={!form.saving}
                returnKeyType={field.next ? 'next' : 'done'}
                blurOnSubmit={!field.next}
                onSubmitEditing={() =>
                  field.next?.current?.focus()
                }
              />
            ))}

            <FeedbackMessage
              kind="error"
              message={form.errorMessage}
              style={styles.errorText}
            />

            <AppButton
              size="large"
              label="Salvar"
              loading={form.saving}
              loadingLabel="Salvando..."
              onPress={() => {
                void handleSave();
              }}
            />

            {serviceId ? (
              <AppButton
                variant="danger"
                label="Excluir serviço"
                disabled={form.saving}
                onPress={() => {
                  void handleRemove();
                }}
              />
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
