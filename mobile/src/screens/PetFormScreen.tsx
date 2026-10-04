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

import ChipGroup from '../components/ChipGroup';
import ScreenHeader from '../components/ScreenHeader';
import { usePetForm } from '../hooks/usePetForm';
import { authStyles } from '../theme/authStyles';
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
                placeholder="Nome do pet"
                placeholderTextColor="#64748B"
                editable={!form.saving}
              />
            </View>

            <View>
              <Text style={styles.label}>Espécie</Text>

              <ChipGroup
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
                options={sizeOptions}
                selected={form.size}
                onSelect={(value) =>
                  value && form.setSize(value)
                }
                disabled={form.saving}
              />
            </View>

            <View>
              <Text style={styles.label}>Raça</Text>

              <TextInput
                style={authStyles.input}
                value={form.breed}
                onChangeText={form.setBreed}
                placeholder="Opcional"
                placeholderTextColor="#64748B"
                editable={!form.saving}
              />
            </View>

            <View>
              <Text style={styles.label}>Nascimento</Text>

              <TextInput
                style={authStyles.input}
                value={form.birthDate}
                onChangeText={form.setBirthDate}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#64748B"
                keyboardType="number-pad"
                maxLength={10}
                editable={!form.saving}
              />
            </View>

            <View>
              <Text style={styles.label}>Peso (kg)</Text>

              <TextInput
                style={authStyles.input}
                value={form.weight}
                onChangeText={form.setWeight}
                placeholder="Ex.: 8,5"
                placeholderTextColor="#64748B"
                keyboardType="decimal-pad"
                editable={!form.saving}
              />
            </View>

            <View>
              <Text style={styles.label}>Observações</Text>

              <TextInput
                style={[
                  authStyles.input,
                  {
                    height: 96,
                    paddingTop: 14,
                    textAlignVertical: 'top',
                  },
                ]}
                value={form.notes}
                onChangeText={form.setNotes}
                placeholder="Alergias, cuidados especiais..."
                placeholderTextColor="#64748B"
                multiline
                editable={!form.saving}
              />
            </View>

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

            {petId ? (
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
                  Excluir pet
                </Text>
              </TouchableOpacity>
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
