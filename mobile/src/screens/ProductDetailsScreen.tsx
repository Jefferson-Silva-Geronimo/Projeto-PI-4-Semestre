import {
  ActivityIndicator,
  Image,
  RefreshControl,
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

import { useAddToCart } from '../hooks/useAddToCart';
import { useProductDetails } from '../hooks/useProductDetails';

import type {
  ClientStackParamList,
} from '../types/navigation';

import {
  formatCurrency,
} from '../utils/currency';

type Props = NativeStackScreenProps<
  ClientStackParamList,
  'ProductDetails'
>;

export default function ProductDetailsScreen({
  navigation,
  route,
}: Props) {
  const { productId } = route.params;

  const {
    product,
    loading,
    refreshing,
    errorMessage,
    loadProduct,
    refreshProduct,
  } = useProductDetails({
    productId,
  });

  const {
    quantity,
    loading: addingToCart,
    errorMessage: cartErrorMessage,
    successMessage,
    incrementQuantity,
    decrementQuantity,
    addToCart,
  } = useAddToCart({
    productId,
    maximumQuantity: product?.stock ?? 1,
  });

  async function handleAddToCart(): Promise<void> {
    const added = await addToCart();

    if (added) {
      navigation.navigate('Cart');
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

  if (errorMessage || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContent}>
          <Text
            style={styles.errorText}
            accessibilityRole="alert"
          >
            {errorMessage || 'Produto não encontrado.'}
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={() => {
              void loadProduct();
            }}
            accessibilityRole="button"
            accessibilityLabel="Tentar carregar o produto novamente"
          >
            <Text style={styles.primaryButtonText}>
              Tentar novamente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Voltar para o catálogo"
          >
            <Text style={styles.secondaryButtonText}>
              Voltar ao catálogo
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const unavailable = !product.available;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Voltar para o catálogo"
        >
          <Text style={styles.backText}>
            ‹ Voltar
          </Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Detalhes do produto
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Cart')}
          accessibilityRole="button"
          accessibilityLabel="Abrir carrinho"
        >
          <Text style={styles.cartText}>
            Carrinho
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              void refreshProduct();
            }}
            colors={['#2D6CDF']}
            tintColor="#2D6CDF"
          />
        }
      >
        <Image
          source={{
            uri: product.imageUrl,
          }}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel={`Imagem do produto ${product.name}`}
        />

        <View style={styles.information}>
          <Text style={styles.name}>
            {product.name}
          </Text>

          <Text style={styles.price}>
            {formatCurrency(product.priceInCents)}
          </Text>

          <Text
            style={[
              styles.status,
              unavailable
                ? styles.unavailableStatus
                : styles.availableStatus,
            ]}
          >
            {unavailable
              ? 'Indisponível'
              : 'Disponível'}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>
            Descrição
          </Text>

          <Text style={styles.description}>
            {product.description}
          </Text>

          <View style={styles.stockContainer}>
            <Text style={styles.stockLabel}>
              Estoque disponível
            </Text>

            <Text style={styles.stockValue}>
              {product.stock}{' '}
              {product.stock === 1
                ? 'unidade'
                : 'unidades'}
            </Text>
          </View>

          {!unavailable ? (
            <View style={styles.quantitySection}>
              <Text style={styles.sectionTitle}>
                Quantidade
              </Text>

              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  activeOpacity={0.7}
                  disabled={quantity <= 1 || addingToCart}
                  onPress={decrementQuantity}
                  accessibilityRole="button"
                  accessibilityLabel="Diminuir quantidade"
                  accessibilityState={{
                    disabled: quantity <= 1 || addingToCart,
                  }}
                >
                  <Text style={styles.quantityButtonText}>
                    −
                  </Text>
                </TouchableOpacity>

                <Text style={styles.quantityValue}>
                  {quantity}
                </Text>

                <TouchableOpacity
                  style={styles.quantityButton}
                  activeOpacity={0.7}
                  disabled={
                    quantity >= product.stock ||
                    quantity >= 99 ||
                    addingToCart
                  }
                  onPress={incrementQuantity}
                  accessibilityRole="button"
                  accessibilityLabel="Aumentar quantidade"
                  accessibilityState={{
                    disabled:
                      quantity >= product.stock ||
                      quantity >= 99 ||
                      addingToCart,
                  }}
                >
                  <Text style={styles.quantityButtonText}>
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          {cartErrorMessage ? (
            <Text
              style={styles.actionErrorText}
              accessibilityRole="alert"
            >
              {cartErrorMessage}
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
              styles.addButton,
              unavailable || addingToCart
                ? styles.disabledButton
                : undefined,
            ]}
            activeOpacity={0.8}
            disabled={unavailable || addingToCart}
            onPress={() => {
              void handleAddToCart();
            }}
            accessibilityRole="button"
            accessibilityLabel={
              unavailable
                ? 'Produto indisponível'
                : 'Adicionar produto ao carrinho'
            }
            accessibilityState={{
              disabled: unavailable || addingToCart,
              busy: addingToCart,
            }}
          >
            <Text style={styles.addButtonText}>
              {unavailable
                ? 'Produto indisponível'
                : addingToCart
                  ? 'Adicionando...'
                  : 'Adicionar ao carrinho'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    minHeight: 64,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backText: {
    color: '#2D6CDF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#1E293B',
    fontSize: 17,
    fontWeight: '700',
  },
  cartText: {
    color: '#2D6CDF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    paddingBottom: 40,
  },
  image: {
    width: '100%',
    height: 320,
    backgroundColor: '#E2E8F0',
  },
  information: {
    padding: 24,
  },
  name: {
    color: '#1E293B',
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
  },
  price: {
    color: '#2D6CDF',
    fontSize: 25,
    fontWeight: '700',
    marginTop: 12,
  },
  status: {
    alignSelf: 'flex-start',
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 14,
  },
  availableStatus: {
    color: '#15803D',
    backgroundColor: '#DCFCE7',
  },
  unavailableStatus: {
    color: '#B91C1C',
    backgroundColor: '#FEE2E2',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 24,
  },
  sectionTitle: {
    color: '#334155',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
  },
  description: {
    color: '#475569',
    fontSize: 16,
    lineHeight: 25,
  },
  stockContainer: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stockLabel: {
    color: '#475569',
    fontSize: 14,
  },
  stockValue: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '700',
  },
  quantitySection: {
    marginTop: 24,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 46,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: '#2D6CDF',
    fontSize: 24,
    fontWeight: '700',
  },
  quantityValue: {
    minWidth: 60,
    color: '#1E293B',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  actionErrorText: {
    color: '#DC2626',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 20,
  },
  successText: {
    color: '#15803D',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 20,
  },
  addButton: {
    width: '100%',
    height: 56,
    marginTop: 28,
    borderRadius: 12,
    backgroundColor: '#2D6CDF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
    opacity: 0.7,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
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
