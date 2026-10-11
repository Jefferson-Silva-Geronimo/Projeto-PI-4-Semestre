import { useRef } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import AppButton from '../components/AppButton';
import AppTextField from '../components/AppTextField';
import ChipGroup from '../components/ChipGroup';
import FeedbackMessage from '../components/FeedbackMessage';
import LoadingIndicator from '../components/LoadingIndicator';
import ScreenHeader from '../components/ScreenHeader';
import { usePetForm } from '../hooks/usePetForm';
import { commonStyles as styles } from '../theme/commonStyles';
import { confirmAction } from '../utils/confirm';

import type { ClientStackParamList } from '../types/navigation';
import { sizeOptions } from '../types/pet';
import { speciesOptions } from '../types/product';

type Props = NativeStackScreenProps<
  ClientStackParamList,
  'PetForm'
>;

export default function PetFormScreen({
  navigation,
  route,
}: Props) {
  const petId = route.params?.petId;

  const form = usePetForm(petId);

  const breedRef = useRef<TextInput>(null);
  const birthDateRef = useRef<TextInput>(null);
  const weightRef = useRef<TextInput>(null);
  const notesRef = useRef<TextInput>(null);

  async function handleSave(): Promise<void> {
    if (await form.save()) {
      navigation.goBack();
    }
  }

  async function handleRemove(): Promise<void> {
    const confirmed = await confirmAction({
      title: 'Excluir pet',
      message: `Deseja excluir ${form.name}?`,
      confirmText: 'Excluir',
      destructive: true,
    });

    if (confirmed && (await form.remove())) {
      navigation.goBack();
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={petId ? 'Editar pet' : 'Novo pet'}
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
              label="Nome"
              value={form.name}
              onChangeText={form.setName}
              placeholder="Nome do pet"
              autoCapitalize="words"
              editable={!form.saving}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => breedRef.current?.focus()}
            />

            <View>
              <Text style={styles.label}>Espécie</Text>

              <ChipGroup
                groupLabel="Espécie"
                options={speciesOptions}
                selected={form.species}
                onSelect={(value) =>
                  value && form.setSpecies(value)
                }
                disabled={form.saving}
              />
            </View>

            <View>
              <Text style={styles.label}>Porte</Text>

              <ChipGroup
                groupLabel="Porte"
                options={sizeOptions}
                selected={form.size}
                onSelect={(value) =>
                  value && form.setSize(value)
                }
                disabled={form.saving}
              />
            </View>

            <AppTextField
              ref={breedRef}
              label="Raça (opcional)"
              value={form.breed}
              onChangeText={form.setBreed}
              placeholder="Ex.: Labrador"
              editable={!form.saving}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => birthDateRef.current?.focus()}
            />

            <AppTextField
              ref={birthDateRef}
              label="Data de nascimento"
              value={form.birthDate}
              onChangeText={form.setBirthDate}
              placeholder="DD/MM/AAAA"
              helperText="Dia, mês e ano."
              keyboardType="number-pad"
              maxLength={10}
              editable={!form.saving}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => weightRef.current?.focus()}
            />

            <AppTextField
              ref={weightRef}
              label="Peso em kg"
              value={form.weight}
              onChangeText={form.setWeight}
              placeholder="8,5"
              keyboardType="decimal-pad"
              editable={!form.saving}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => notesRef.current?.focus()}
            />

            <AppTextField
              ref={notesRef}
              label="Observações"
              value={form.notes}
              onChangeText={form.setNotes}
              placeholder="Alergias, cuidados especiais..."
              multiline
              editable={!form.saving}
            />

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

            {petId ? (
              <AppButton
                variant="danger"
                label="Excluir pet"
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
