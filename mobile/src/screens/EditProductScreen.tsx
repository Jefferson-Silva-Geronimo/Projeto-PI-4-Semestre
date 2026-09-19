import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import { useEditProduct } from '../hooks/useEditProduct';

import type {
  AdminStackParamList,
} from '../types/navigation';

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
    loadProduct,
    saveProduct,
  } = useEditProduct({
    productId,
  });

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
          <ActivityIndicator
            size="large"
            color="#2D6CDF"
          />

          <Text style={styles.feedbackText}>
            Carregando produto...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMessage && !name) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContent}>
          <Text
            style={styles.errorText}
            accessibilityRole="alert"
          >
            {errorMessage}
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={() => {
              void loadProduct();
            }}
          >
            <Text style={styles.primaryButtonText}>
              Tentar novamente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>
              Voltar
            </Text>
          </TouchableOpacity>
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
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={saving}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>
              ‹ Voltar
            </Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            Editar produto
          </Text>

          <Text style={styles.subtitle}>
            Atualize as informações do produto selecionado.
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>
              Nome
            </Text>

            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nome do produto"
              placeholderTextColor="#64748B"
              editable={!saving}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              Descrição
            </Text>

            <TextInput
              style={[styles.input, styles.descriptionInput]}
              value={description}
              onChangeText={setDescription}
              placeholder="Descrição do produto"
              placeholderTextColor="#64748B"
              editable={!saving}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.row}>
            <View style={styles.halfFieldLeft}>
              <Text style={styles.label}>
                Preço
              </Text>

              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="49,90"
                placeholderTextColor="#64748B"
                keyboardType="decimal-pad"
                editable={!saving}
              />
            </View>

            <View style={styles.halfFieldRight}>
              <Text style={styles.label}>
                Estoque
              </Text>

              <TextInput
                style={styles.input}
                value={stock}
                onChangeText={setStock}
                placeholder="20"
                placeholderTextColor="#64748B"
                keyboardType="number-pad"
                editable={!saving}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              URL da imagem
            </Text>

            <TextInput
              style={styles.input}
              value={imageUrl}
              onChangeText={setImageUrl}
              placeholder="https://..."
              placeholderTextColor="#64748B"
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!saving}
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

          {errorMessage ? (
            <Text
              style={styles.formErrorText}
              accessibilityRole="alert"
            >
              {errorMessage}
            </Text>
          ) : null}

          {successMessage ? (
            <Text
              style={styles.successText}
              accessibilityRole="alert"
            >
              {successMessage}
            </Text>
          ) : null}

          <TouchableOpacity
            style={[
              styles.saveButton,
              saving ? styles.disabledButton : undefined,
            ]}
            activeOpacity={0.8}
            disabled={saving}
            onPress={() => {
              void handleSave();
            }}
            accessibilityRole="button"
            accessibilityLabel="Salvar alterações do produto"
            accessibilityState={{
              disabled: saving,
              busy: saving,
            }}
          >
            <Text style={styles.saveButtonText}>
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            activeOpacity={0.7}
            disabled={saving}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>
              Cancelar
            </Text>
          </TouchableOpacity>
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
  backText: {
    color: '#2D6CDF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 20,
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
  input: {
    width: '100%',
    height: 56,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  descriptionInput: {
    height: 126,
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
    height: 40,
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
    color: '#DC2626',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  successText: {
    color: '#15803D',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  saveButton: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    backgroundColor: '#2D6CDF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.65,
  },
  cancelButton: {
    width: '100%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#2D6CDF',
    fontSize: 15,
    fontWeight: '600',
  },
  centeredContent: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackText: {
    color: '#475569',
    fontSize: 16,
    marginTop: 18,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    marginBottom: 20,
  },
  primaryButton: {
    height: 50,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#2D6CDF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    height: 48,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  secondaryButtonText: {
    color: '#2D6CDF',
    fontSize: 15,
    fontWeight: '600',
  },
});
