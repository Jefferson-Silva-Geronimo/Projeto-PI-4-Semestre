import {
  ActivityIndicator,
  Image,
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

import { useCheckout } from '../hooks/useCheckout';

import type {
  ClientStackParamList,
} from '../types/navigation';

import {
  formatCurrency,
} from '../utils/currency';

type Props = NativeStackScreenProps<
  ClientStackParamList,
  'Checkout'
>;

export default function CheckoutScreen({
  navigation,
}: Props) {
  const {
    cart,
    loading,
    submitting,
    errorMessage,
    reloadCart,
    confirmOrder,
  } = useCheckout();

  async function handleConfirmOrder(): Promise<void> {
    const order = await confirmOrder();

    if (!order) {
      return;
    }

    navigation.replace('OrderDetails', {
      orderId: order.id,
    });
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
            Preparando o resumo do pedido...
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
              void reloadCart();
            }}
            accessibilityRole="button"
            accessibilityLabel="Tentar carregar o resumo novamente"
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
            accessibilityLabel="Voltar ao carrinho"
          >
            <Text style={styles.secondaryButtonText}>
              Voltar ao carrinho
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
          disabled={submitting}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Voltar ao carrinho"
        >
          <Text style={styles.backText}>
            ‹ Voltar
          </Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Resumo do pedido
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          Revise sua compra
        </Text>

        <Text style={styles.subtitle}>
          Confira os produtos e os valores antes de confirmar o pedido.
        </Text>

        {cart.items.map((item) => (
          <View
            key={item.id}
            style={styles.itemCard}
          >
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

              <Text style={styles.itemDetails}>
                {item.quantity} ×{' '}
                {formatCurrency(item.product.priceInCents)}
              </Text>

              <Text style={styles.itemSubtotal}>
                {formatCurrency(item.subtotalInCents)}
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Quantidade de itens
            </Text>

            <Text style={styles.summaryValue}>
              {cart.totalItems}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>
              Total do pedido
            </Text>

            <Text style={styles.totalValue}>
              {formatCurrency(cart.totalInCents)}
            </Text>
          </View>
        </View>

        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>
            Pagamento
          </Text>

          <Text style={styles.noticeText}>
            Nesta etapa, o pedido será confirmado sem pagamento online. A integração com o Mercado Pago será adicionada posteriormente.
          </Text>
        </View>

        {errorMessage ? (
          <Text
            style={styles.inlineErrorText}
            accessibilityRole="alert"
          >
            {errorMessage}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[
            styles.confirmButton,
            submitting ||
            cart.items.length === 0 ||
            cart.hasUnavailableItems
              ? styles.disabledButton
              : undefined,
          ]}
          activeOpacity={0.8}
          disabled={
            submitting ||
            cart.items.length === 0 ||
            cart.hasUnavailableItems
          }
          onPress={() => {
            void handleConfirmOrder();
          }}
          accessibilityRole="button"
          accessibilityLabel="Confirmar pedido"
          accessibilityState={{
            disabled:
              submitting ||
              cart.items.length === 0 ||
              cart.hasUnavailableItems,
            busy: submitting,
          }}
        >
          <Text style={styles.confirmButtonText}>
            {submitting
              ? 'Confirmando pedido...'
              : 'Confirmar pedido'}
          </Text>
        </TouchableOpacity>
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
    fontSize: 18,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 50,
  },
  content: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    color: '#1E293B',
    fontSize: 26,
    fontWeight: '700',
  },
  subtitle: {
    color: '#64748B',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
    marginBottom: 22,
  },
  itemCard: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    marginBottom: 12,
  },
  itemImage: {
    width: 78,
    height: 78,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    marginRight: 12,
  },
  itemInformation: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '700',
  },
  itemDetails: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 5,
  },
  itemSubtotal: {
    color: '#2D6CDF',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 6,
  },
  summaryCard: {
    padding: 18,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: '#64748B',
    fontSize: 14,
  },
  summaryValue: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '600',
  },
  totalLabel: {
    color: '#1E293B',
    fontSize: 17,
    fontWeight: '700',
  },
  totalValue: {
    color: '#2D6CDF',
    fontSize: 22,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  noticeCard: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginTop: 16,
  },
  noticeTitle: {
    color: '#1E40AF',
    fontSize: 15,
    fontWeight: '700',
  },
  noticeText: {
    color: '#1E3A8A',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },
  inlineErrorText: {
    color: '#DC2626',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 18,
  },
  confirmButton: {
    width: '100%',
    height: 56,
    marginTop: 22,
    borderRadius: 12,
    backgroundColor: '#2D6CDF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
    opacity: 0.7,
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
    textAlign: 'center',
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
