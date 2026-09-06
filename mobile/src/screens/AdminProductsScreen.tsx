import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAdminProducts } from '../hooks/useAdminProducts';
import { authStyles as styles } from '../theme/authStyles';

import type { AdminStackParamList } from '../types/navigation';
import type { Product } from '../types/product';

type Props = NativeStackScreenProps<
  AdminStackParamList,
  'AdminProducts'
>;

export default function AdminProductsScreen({
  navigation,
}: Props) {
  const {
    products,
    loading,
    errorMessage,
    loadProducts,
  } = useAdminProducts();

  function formatPrice(priceInCents: number) {
    return (priceInCents / 100).toLocaleString(
      'pt-BR',
      {
        style: 'currency',
        currency: 'BRL',
      }
    );
  }

  function renderProduct({
    item,
  }: {
    item: Product;
  }) {
    return (
      <View style={styles.productCard}>
        <Image
          source={{
            uri: item.imageUrl,
          }}
          style={styles.productImage}
          resizeMode="cover"
          accessibilityLabel={`Imagem do produto ${item.name}`}
        />

        <View style={styles.productInformation}>
          <Text
            style={styles.productName}
            numberOfLines={2}
          >
            {item.name}
          </Text>

          <Text style={styles.productPrice}>
            {formatPrice(item.priceInCents)}
          </Text>

          <Text style={styles.productStock}>
            Estoque: {item.stock}
          </Text>

          <Text
            style={[
              styles.productStatus,
              item.active
                ? styles.activeStatus
                : styles.inactiveStatus,
            ]}
          >
            {item.active ? 'Ativo' : 'Inativo'}
          </Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={styles.productsCenteredContent}
        >
          <ActivityIndicator
            size="large"
            color="#2D6CDF"
          />

          <Text style={styles.productsFeedbackText}>
            Carregando produtos...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMessage) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={styles.productsCenteredContent}
        >
          <Text
            style={styles.productsErrorText}
            accessibilityRole="alert"
          >
            {errorMessage}
          </Text>

          <TouchableOpacity
            style={styles.productsRetryButton}
            activeOpacity={0.8}
            onPress={() => void loadProducts()}
            accessibilityRole="button"
            accessibilityLabel="Tentar carregar os produtos novamente"
          >
            <Text style={styles.buttonText}>
              Tentar novamente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Voltar para a página anterior"
          >
            <Text style={styles.link}>
              Voltar
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.productsHeader}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Voltar para a área administrativa"
        >
          <Text style={styles.productsBackText}>
            ‹ Voltar
          </Text>
        </TouchableOpacity>

        <View style={styles.productsHeaderText}>
          <Text style={styles.productsTitle}>
            Produtos
          </Text>

          <Text style={styles.productsSubtitle}>
            Gerencie o catálogo do pet shop.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.createProductButton}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('CreateProduct')
          }
          accessibilityRole="button"
          accessibilityLabel="Cadastrar novo produto"
        >
          <Text
            style={styles.createProductButtonText}
          >
            Novo produto
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        contentContainerStyle={[
          styles.productsListContent,
          products.length === 0
            ? styles.productsEmptyListContent
            : undefined,
        ]}
        ItemSeparatorComponent={() => (
          <View style={styles.productSeparator} />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View
            style={styles.productsEmptyContainer}
          >
            <Text
              style={styles.productsEmptyTitle}
            >
              Nenhum produto cadastrado
            </Text>

            <Text
              style={styles.productsEmptyText}
            >
              Cadastre o primeiro produto para
              iniciar o catálogo.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}