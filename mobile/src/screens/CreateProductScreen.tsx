import { useRef } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import AppButton from '../components/AppButton';
import AppTextField, {
  type TextFieldRef,
} from '../components/AppTextField';
import ChipGroup from '../components/ChipGroup';
import FeedbackMessage from '../components/FeedbackMessage';
import ScreenTitle from '../components/ScreenTitle';
import { useCreateProduct } from '../hooks/useCreateProduct';
import { authStyles as styles } from '../theme/authStyles';

import type { AdminStackParamList } from '../types/navigation';

import {
  categoryOptions,
  speciesOptions,
} from '../types/product';

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
    category,
    species,
    loading,
    errorMessage,
    successMessage,
    setName,
    setDescription,
    setPrice,
    setStock,
    setImageUrl,
    setCategory,
    setSpecies,
    handleCreateProduct,
  } = useCreateProduct();

  const descriptionRef = useRef<TextFieldRef>(null);
  const priceRef = useRef<TextFieldRef>(null);
  const stockRef = useRef<TextFieldRef>(null);
  const imageUrlRef = useRef<TextFieldRef>(null);

  const errorStyle = errorMessage ? styles.inputError : undefined;

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
            <ScreenTitle style={styles.createProductTitle}>
              Cadastrar produto
            </ScreenTitle>

            <Text
              style={styles.createProductSubtitle}
            >
              Preencha os dados para adicionar um
              produto ao catálogo.
            </Text>
          </View>

          <View style={styles.createProductForm}>
            <View style={styles.productField}>
              <AppTextField
                label="Nome do produto"
                style={errorStyle}
                placeholder="Ração Premium Cães Adultos"
                value={name}
                onChangeText={setName}
                autoCapitalize="sentences"
                autoCorrect
                editable={!loading}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() =>
                  descriptionRef.current?.focus()
                }
              />
            </View>

            <View style={styles.productField}>
              <AppTextField
                ref={descriptionRef}
                label="Descrição"
                style={[
                  styles.productDescriptionInput,
                  errorStyle,
                ]}
                placeholder="Descrição do produto"
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
                <AppTextField
                  ref={priceRef}
                  label="Preço (R$)"
                  style={errorStyle}
                  placeholder="49,90"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                  editable={!loading}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() =>
                    stockRef.current?.focus()
                  }
                />
              </View>

              <View
                style={styles.productFieldHalf}
              >
                <AppTextField
                  ref={stockRef}
                  label="Estoque"
                  style={errorStyle}
                  placeholder="20"
                  value={stock}
                  onChangeText={setStock}
                  keyboardType="number-pad"
                  editable={!loading}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() =>
                    imageUrlRef.current?.focus()
                  }
                />
              </View>
            </View>

            <View style={styles.productField}>
              <AppTextField
                ref={imageUrlRef}
                label="URL da imagem"
                style={errorStyle}
                placeholder="https://images.pexels.com/..."
                helperText="Use o endereço direto da imagem, começando com http:// ou https://."
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
            </View>

            <View style={styles.productField}>
              <Text style={styles.productFieldLabel}>
                Categoria
              </Text>

              <ChipGroup
                groupLabel="Categoria"
                options={categoryOptions}
                selected={category}
                onSelect={(value) =>
                  value && setCategory(value)
                }
                disabled={loading}
              />
            </View>

            <View style={styles.productField}>
              <Text style={styles.productFieldLabel}>
                Espécie
              </Text>

              <ChipGroup
                groupLabel="Espécie"
                options={speciesOptions}
                selected={species}
                onSelect={setSpecies}
                allowClear
                allLabel="Todas"
                disabled={loading}
              />
            </View>

            <FeedbackMessage
              kind="error"
              message={errorMessage}
              style={styles.createProductErrorText}
            />

            <FeedbackMessage
              kind="success"
              message={successMessage}
              style={styles.createProductSuccessText}
            />

            <AppButton
              size="large"
              label="Cadastrar produto"
              loading={loading}
              loadingLabel="Cadastrando..."
              style={styles.createProductSubmitButton}
              onPress={onCreateProductPress}
            />

            <AppButton
              variant="link"
              label="Cancelar"
              disabled={loading}
              style={styles.createProductCancelButton}
              onPress={() => navigation.goBack()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
