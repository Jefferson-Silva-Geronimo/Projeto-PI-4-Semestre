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

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useCreateProduct } from '../hooks/useCreateProduct';
import { authStyles as styles } from '../theme/authStyles';

import type { AdminStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<
  AdminStackParamList,
  'CreateProduct'
>;

export default function CreateProductScreen({
  navigation,
}: Props) {
  const {
    name,
    description,
    price,
    stock,
    imageUrl,
    loading,
    errorMessage,
    successMessage,
    setName,
    setDescription,
    setPrice,
    setStock,
    setImageUrl,
    handleCreateProduct,
  } = useCreateProduct();

  async function onCreateProductPress() {
    const productWasCreated =
      await handleCreateProduct();

    if (!productWasCreated) {
      return;
    }

    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.createProductKeyboardView}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={
            styles.createProductContent
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.createProductHeader}>
            <Text style={styles.createProductTitle}>
              Cadastrar produto
            </Text>

            <Text
              style={styles.createProductSubtitle}
            >
              Preencha os dados para adicionar um
              produto ao catálogo.
            </Text>
          </View>

          <View style={styles.createProductForm}>
            <View style={styles.productField}>
              <Text style={styles.productFieldLabel}>
                Nome
              </Text>

              <TextInput
                style={[
                  styles.input,
                  errorMessage
                    ? styles.inputError
                    : undefined,
                ]}
                placeholder="Nome do produto"
                placeholderTextColor="#64748B"
                value={name}
                onChangeText={setName}
                autoCapitalize="sentences"
                autoCorrect
                editable={!loading}
                returnKeyType="next"
              />
            </View>

            <View style={styles.productField}>
              <Text style={styles.productFieldLabel}>
                Descrição
              </Text>

              <TextInput
                style={[
                  styles.input,
                  styles.productDescriptionInput,
                  errorMessage
                    ? styles.inputError
                    : undefined,
                ]}
                placeholder="Descrição do produto"
                placeholderTextColor="#64748B"
                value={description}
                onChangeText={setDescription}
                autoCapitalize="sentences"
                autoCorrect
                editable={!loading}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.productFieldsRow}>
              <View
                style={styles.productFieldHalf}
              >
                <Text
                  style={styles.productFieldLabel}
                >
                  Preço
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    errorMessage
                      ? styles.inputError
                      : undefined,
                  ]}
                  placeholder="Ex.: 49,90"
                  placeholderTextColor="#64748B"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                  editable={!loading}
                  returnKeyType="next"
                />
              </View>

              <View
                style={styles.productFieldHalf}
              >
                <Text
                  style={styles.productFieldLabel}
                >
                  Estoque
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    errorMessage
                      ? styles.inputError
                      : undefined,
                  ]}
                  placeholder="Ex.: 20"
                  placeholderTextColor="#64748B"
                  value={stock}
                  onChangeText={setStock}
                  keyboardType="number-pad"
                  editable={!loading}
                  returnKeyType="next"
                />
              </View>
            </View>

            <View style={styles.productField}>
              <Text style={styles.productFieldLabel}>
                URL da imagem
              </Text>

              <TextInput
                style={[
                  styles.input,
                  errorMessage
                    ? styles.inputError
                    : undefined,
                ]}
                placeholder="https://images.pexels.com/..."
                placeholderTextColor="#64748B"
                value={imageUrl}
                onChangeText={setImageUrl}
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={
                  onCreateProductPress
                }
              />

              <Text style={styles.productFieldHelper}>
                Use o endereço direto da imagem,
                começando com http:// ou https://.
              </Text>
            </View>

            {errorMessage ? (
              <Text
                style={styles.createProductErrorText}
                accessibilityRole="alert"
              >
                {errorMessage}
              </Text>
            ) : null}

            {successMessage ? (
              <Text
                style={
                  styles.createProductSuccessText
                }
                accessibilityRole="alert"
              >
                {successMessage}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[
                styles.createProductSubmitButton,
                loading
                  ? styles.buttonDisabled
                  : undefined,
              ]}
              activeOpacity={0.8}
              disabled={loading}
              onPress={onCreateProductPress}
              accessibilityRole="button"
              accessibilityLabel="Cadastrar produto"
              accessibilityState={{
                disabled: loading,
                busy: loading,
              }}
            >
              <Text style={styles.buttonText}>
                {loading
                  ? 'Cadastrando...'
                  : 'Cadastrar produto'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                styles.createProductCancelButton
              }
              activeOpacity={0.7}
              disabled={loading}
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Cancelar cadastro e voltar"
            >
              <Text
                style={
                  styles.createProductCancelText
                }
              >
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}