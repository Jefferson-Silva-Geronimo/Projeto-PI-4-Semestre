import { useRef } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import AppButton from '../components/AppButton';
import AppTextField, {
  type TextFieldRef,
} from '../components/AppTextField';
import BackButton from '../components/BackButton';
import ChipGroup from '../components/ChipGroup';
import FeedbackMessage from '../components/FeedbackMessage';
import LoadingIndicator from '../components/LoadingIndicator';
import ScreenTitle from '../components/ScreenTitle';
import { useEditProduct } from '../hooks/useEditProduct';
import { sizes } from '../theme/tokens';

import type {
  AdminStackParamList,
} from '../types/navigation';

import {
  categoryOptions,
  speciesOptions,
} from '../types/product';

type Props = NativeStackScreenProps<
  AdminStackParamList,
  'EditProduct'
>;

export default function EditProductScreen({
  navigation,
  route,
}: Props) {
  const { productId } = route.params;

  const {
    name,
    description,
    price,
    stock,
    imageUrl,
    category,
    species,
    active,
    loading,
    saving,
    errorMessage,
    successMessage,
    setName,
    setDescription,
    setPrice,
    setStock,
    setImageUrl,
    setActive,
    setCategory,
    setSpecies,
    loadProduct,
    saveProduct,
  } = useEditProduct({
    productId,
  });

  const descriptionRef = useRef<TextFieldRef>(null);
  const priceRef = useRef<TextFieldRef>(null);
  const stockRef = useRef<TextFieldRef>(null);
  const imageUrlRef = useRef<TextFieldRef>(null);

  async function handleSave(): Promise<void> {
    const saved = await saveProduct();

    if (saved) {
      navigation.goBack();
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContent}>
          <LoadingIndicator message="Carregando produto..." />
        </View>
      </SafeAreaView>
    );
  }

  if (errorMessage && !name) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContent}>
          <FeedbackMessage
            kind="error"
            message={errorMessage}
            style={styles.errorText}
          />

          <AppButton
            label="Tentar novamente"
            onPress={() => {
              void loadProduct();
            }}
          />

          <AppButton
            variant="outline"
            label="Voltar"
            style={{ marginTop: 8 }}
            onPress={() => navigation.goBack()}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <BackButton onPress={() => navigation.goBack()} />

          <ScreenTitle style={styles.title}>
            Editar produto
          </ScreenTitle>

          <Text style={styles.subtitle}>
            Atualize as informações do produto selecionado.
          </Text>

          <View style={styles.field}>
            <AppTextField
              label="Nome do produto"
              value={name}
              onChangeText={setName}
              placeholder="Ração Premium Cães Adultos"
              editable={!saving}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() =>
                descriptionRef.current?.focus()
              }
            />
          </View>

          <View style={styles.field}>
            <AppTextField
              ref={descriptionRef}
              label="Descrição"
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Descrição do produto"
              editable={!saving}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.row}>
            <View style={styles.halfFieldLeft}>
              <AppTextField
                ref={priceRef}
                label="Preço (R$)"
                value={price}
                onChangeText={setPrice}
                placeholder="49,90"
                keyboardType="decimal-pad"
                editable={!saving}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() =>
                  stockRef.current?.focus()
                }
              />
            </View>

            <View style={styles.halfFieldRight}>
              <AppTextField
                ref={stockRef}
                label="Estoque"
                value={stock}
                onChangeText={setStock}
                placeholder="20"
                keyboardType="number-pad"
                editable={!saving}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() =>
                  imageUrlRef.current?.focus()
                }
              />
            </View>
          </View>

          <View style={styles.field}>
            <AppTextField
              ref={imageUrlRef}
              label="URL da imagem"
              value={imageUrl}
              onChangeText={setImageUrl}
              placeholder="https://..."
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!saving}
              returnKeyType="done"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              Categoria
            </Text>

            <ChipGroup
              groupLabel="Categoria"
              options={categoryOptions}
              selected={category}
              onSelect={(value) =>
                value && setCategory(value)
              }
              disabled={saving}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              Espécie
            </Text>

            <ChipGroup
              groupLabel="Espécie"
              options={speciesOptions}
              selected={species}
              onSelect={setSpecies}
              allowClear
              allLabel="Todas"
              disabled={saving}
            />
          </View>

          <View style={styles.statusCard}>
            <View style={styles.statusInformation}>
              <Text style={styles.statusTitle}>
                Produto ativo
              </Text>

              <Text style={styles.statusDescription}>
                Produtos inativos não aparecem no catálogo do cliente.
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.statusToggle,
                active
                  ? styles.statusToggleActive
                  : styles.statusToggleInactive,
              ]}
              activeOpacity={0.8}
              disabled={saving}
              onPress={() => setActive(!active)}
              accessibilityRole="switch"
              accessibilityLabel={`Situação do produto: ${
                active ? 'Ativo' : 'Inativo'
              }`}
              accessibilityState={{
                checked: active,
                disabled: saving,
              }}
            >
              <Text style={styles.statusToggleText}>
                {active ? 'Ativo' : 'Inativo'}
              </Text>
            </TouchableOpacity>
          </View>

          <FeedbackMessage
            kind="error"
            message={errorMessage}
            style={styles.formErrorText}
          />

          <FeedbackMessage
            kind="success"
            message={successMessage}
            style={styles.successText}
          />

          <AppButton
            size="large"
            label="Salvar alterações"
            loading={saving}
            loadingLabel="Salvando..."
            style={styles.saveButton}
            onPress={() => {
              void handleSave();
            }}
          />

          <AppButton
            variant="link"
            label="Cancelar"
            disabled={saving}
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: 650,
    alignSelf: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    color: '#1E293B',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#64748B',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
    marginBottom: 26,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  descriptionInput: {
    minHeight: 126,
    paddingTop: 16,
    paddingBottom: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  halfFieldLeft: {
    flex: 1,
    marginRight: 7,
  },
  halfFieldRight: {
    flex: 1,
    marginLeft: 7,
  },
  statusCard: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  statusInformation: {
    flex: 1,
    paddingRight: 14,
  },
  statusTitle: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '700',
  },
  statusDescription: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  statusToggle: {
    minWidth: 82,
    minHeight: sizes.minTouch,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusToggleActive: {
    backgroundColor: '#15803D',
  },
  statusToggleInactive: {
    backgroundColor: '#DC2626',
  },
  statusToggleText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  formErrorText: {
    marginBottom: 16,
  },
  successText: {
    marginBottom: 16,
  },
  saveButton: {
    width: '100%',
  },
  cancelButton: {
    width: '100%',
    marginTop: 8,
  },
  centeredContent: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    marginBottom: 20,
  },
});
