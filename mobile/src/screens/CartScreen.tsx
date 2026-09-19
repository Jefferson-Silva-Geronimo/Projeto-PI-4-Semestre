import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import { useCart } from '../hooks/useCart';
import { confirmAction } from '../utils/confirm';

import type {
  CartItem,
} from '../types/cart';

import type {
  ClientStackParamList,
} from '../types/navigation';

import {
  formatCurrency,
} from '../utils/currency';

type Props = NativeStackScreenProps<
  ClientStackParamList,
  'Cart'
>;

export default function CartScreen({
  navigation,
}: Props) {
  const {
    cart,
    loading,
    refreshing,
    errorMessage,
    processingItemId,
    clearing,
    loadCart,
    refreshCart,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
  } = useCart();

  async function handleRemoveItem(
    item: CartItem,
  ): Promise<void> {
    const confirmed = await confirmAction({
      title: 'Remover produto',
      message: `Deseja remover ${item.product.name} do carrinho?`,
      confirmText: 'Remover',
      destructive: true,
    });

    if (confirmed) {
      await removeItem(item.id);
    }
  }

  async function handleClearCart(): Promise<void> {
    const confirmed = await confirmAction({
      title: 'Limpar carrinho',
      message: 'Deseja remover todos os produtos do carrinho?',
      confirmText: 'Limpar',
      destructive: true,
    });

    if (confirmed) {
      await clearCart();
    }
  }

  function renderItem({
    item,
  }: {
    item: CartItem;
  }) {
    const processing = processingItemId === item.id;

    return (
      <View style={styles.itemCard}>
        <Image
          source={{
            uri: item.product.imageUrl,
          }}
          style={styles.itemImage}
          resizeMode="cover"
          accessibilityLabel={`Imagem do produto ${item.product.name}`}
        />

        <View style={styles.itemInformation}>
          <Text
            style={styles.itemName}
            numberOfLines={2}
          >
            {item.product.name}
          </Text>

          <Text style={styles.itemUnitPrice}>
            {formatCurrency(item.product.priceInCents)} por unidade
          </Text>

          <Text
            style={
              item.available
                ? styles.availableText
                : styles.unavailableText
            }
          >
            {item.available
              ? 'Disponível'
              : 'Produto indisponível ou estoque insuficiente'}
          </Text>

          <View style={styles.itemFooter}>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                activeOpacity={0.7}
                disabled={processing || item.quantity <= 1}
                onPress={() => {
                  void decrementItem(item);
                }}
                accessibilityRole="button"
                accessibilityLabel={`Diminuir quantidade de ${item.product.name}`}
                accessibilityState={{
                  disabled: processing || item.quantity <= 1,
                }}
              >
                <Text style={styles.quantityButtonText}>
                  −
                </Text>
              </TouchableOpacity>

              <Text style={styles.quantityValue}>
                {processing ? '...' : item.quantity}
              </Text>

              <TouchableOpacity
                style={styles.quantityButton}
                activeOpacity={0.7}
                disabled={
                  processing ||
                  !item.product.active ||
                  item.quantity >= item.product.stock ||
                  item.quantity >= 99
                }
                onPress={() => {
                  void incrementItem(item);
                }}
                accessibilityRole="button"
                accessibilityLabel={`Aumentar quantidade de ${item.product.name}`}
                accessibilityState={{
                  disabled:
                    processing ||
                    !item.product.active ||
                    item.quantity >= item.product.stock ||
                    item.quantity >= 99,
                }}
              >
                <Text style={styles.quantityButtonText}>
                  +
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.itemSubtotal}>
              {formatCurrency(item.subtotalInCents)}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            disabled={processing}
            onPress={() => {
              void handleRemoveItem(item);
            }}
            accessibilityRole="button"
            accessibilityLabel={`Remover ${item.product.name} do carrinho`}
          >
            <Text style={styles.removeText}>
              Remover
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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
            Carregando carrinho...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMessage && cart.items.length === 0) {
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
              void loadCart();
            }}
            accessibilityRole="button"
            accessibilityLabel="Tentar carregar o carrinho novamente"
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
            accessibilityLabel="Voltar"
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
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Text style={styles.backText}>
            ‹ Voltar
          </Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Carrinho
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          disabled={cart.items.length === 0 || clearing}
          onPress={() => {
            void handleClearCart();
          }}
          accessibilityRole="button"
          accessibilityLabel="Limpar carrinho"
          accessibilityState={{
            disabled: cart.items.length === 0 || clearing,
          }}
        >
          <Text
            style={[
              styles.clearText,
              cart.items.length === 0 || clearing
                ? styles.disabledText
                : undefined,
            ]}
          >
            {clearing ? 'Limpando...' : 'Limpar'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cart.items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          cart.items.length === 0
            ? styles.emptyListContent
            : undefined,
        ]}
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              void refreshCart();
            }}
            colors={['#2D6CDF']}
            tintColor="#2D6CDF"
          />
        }
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          errorMessage ? (
            <Text
              style={styles.inlineErrorText}
              accessibilityRole="alert"
            >
              {errorMessage}
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              Seu carrinho está vazio
            </Text>

            <Text style={styles.emptyText}>
              Adicione produtos do catálogo para iniciar seu pedido.
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ClientHome')}
              accessibilityRole="button"
              accessibilityLabel="Voltar ao catálogo"
            >
              <Text style={styles.primaryButtonText}>
                Ver produtos
              </Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          cart.items.length > 0 ? (
            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Itens
                </Text>

                <Text style={styles.summaryValue}>
                  {cart.totalItems}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>
                  Total
                </Text>

                <Text style={styles.totalValue}>
                  {formatCurrency(cart.totalInCents)}
                </Text>
              </View>

              {cart.hasUnavailableItems ? (
                <Text
                  style={styles.checkoutWarning}
                  accessibilityRole="alert"
                >
                  Revise os itens indisponíveis antes de continuar.
                </Text>
              ) : null}

              <TouchableOpacity
                style={[
                  styles.checkoutButton,
                  cart.hasUnavailableItems
                    ? styles.disabledButton
                    : undefined,
                ]}
                activeOpacity={0.8}
                disabled={cart.hasUnavailableItems}
                onPress={() => navigation.navigate('Checkout')}
                accessibilityRole="button"
                accessibilityLabel="Continuar para o resumo do pedido"
                accessibilityState={{
                  disabled: cart.hasUnavailableItems,
                }}
              >
                <Text style={styles.checkoutButtonText}>
                  Continuar
                </Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
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
    fontSize: 18,
    fontWeight: '700',
  },
  clearText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledText: {
    color: '#94A3B8',
  },
  listContent: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  itemCard: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
  },
  itemImage: {
    width: 96,
    height: 110,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    marginRight: 14,
  },
  itemInformation: {
    flex: 1,
  },
  itemName: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '700',
  },
  itemUnitPrice: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 5,
  },
  availableText: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  unavailableText: {
    color: '#B91C1C',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
    marginTop: 6,
  },
  itemFooter: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 34,
    height: 34,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: '#2D6CDF',
    fontSize: 19,
    fontWeight: '700',
  },
  quantityValue: {
    minWidth: 40,
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  itemSubtotal: {
    color: '#2D6CDF',
    fontSize: 15,
    fontWeight: '700',
  },
  removeText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 12,
  },
  separator: {
    height: 12,
  },
  summary: {
    marginTop: 20,
    padding: 20,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    color: '#64748B',
    fontSize: 15,
  },
  summaryValue: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '600',
  },
  totalLabel: {
    color: '#1E293B',
    fontSize: 18,
    fontWeight: '700',
  },
  totalValue: {
    color: '#2D6CDF',
    fontSize: 22,
    fontWeight: '700',
  },
  checkoutWarning: {
    color: '#B91C1C',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  checkoutButton: {
    width: '100%',
    height: 54,
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: '#2D6CDF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
    opacity: 0.7,
  },
  inlineErrorText: {
    color: '#DC2626',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  emptyContainer: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: '#1E293B',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
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
