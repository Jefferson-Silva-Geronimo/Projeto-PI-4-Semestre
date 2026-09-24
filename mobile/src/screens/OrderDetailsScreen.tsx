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

import { useOrderDetails } from '../hooks/useOrderDetails';

import type {
  ClientStackParamList,
} from '../types/navigation';

import type {
  OrderStatus,
} from '../types/order';

import {
  formatCurrency,
} from '../utils/currency';

type Props = NativeStackScreenProps<
  ClientStackParamList,
  'OrderDetails'
>;

const statusLabels: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'Aguardando pagamento',
  CONFIRMED: 'Confirmado',
  PROCESSING: 'Em processamento',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
};

export default function OrderDetailsScreen({
  navigation,
  route,
}: Props) {
  const { orderId } = route.params;

  const {
    order,
    loading,
    refreshing,
    errorMessage,
    loadOrder,
    refreshOrder,
  } = useOrderDetails({
    orderId,
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContent}>
          <ActivityIndicator
            size="large"
            color="#2D6CDF"
          />

          <Text style={styles.feedbackText}>
            Carregando pedido...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMessage || !order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContent}>
          <Text
            style={styles.errorText}
            accessibilityRole="alert"
          >
            {errorMessage || 'Pedido não encontrado.'}
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={() => {
              void loadOrder();
            }}
          >
            <Text style={styles.primaryButtonText}>
              Tentar novamente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Orders')}
          >
            <Text style={styles.secondaryButtonText}>
              Ver meus pedidos
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
          onPress={() => navigation.navigate('Orders')}
        >
          <Text style={styles.backText}>
            ‹ Pedidos
          </Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Detalhes do pedido
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              void refreshOrder();
            }}
            colors={['#2D6CDF']}
            tintColor="#2D6CDF"
          />
        }
      >
        <View style={styles.orderSummary}>
          <Text style={styles.orderCode}>
            Pedido #{order.id.slice(0, 8).toUpperCase()}
          </Text>

          <Text style={styles.orderDate}>
            Criado em {new Date(order.createdAt).toLocaleString('pt-BR')}
          </Text>

          <Text
            style={[
              styles.status,
              order.status === 'CANCELLED'
                ? styles.cancelledStatus
                : order.status === 'COMPLETED'
                  ? styles.completedStatus
                  : styles.activeStatus,
            ]}
          >
            {statusLabels[order.status]}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Produtos
        </Text>

        {order.items.map((item) => (
          <View
            key={item.id}
            style={styles.itemCard}
          >
            <Image
              source={{
                uri: item.imageUrl,
              }}
              style={styles.itemImage}
              resizeMode="cover"
              accessibilityLabel={`Imagem do produto ${item.productName}`}
            />

            <View style={styles.itemInformation}>
              <Text
                style={styles.itemName}
                numberOfLines={2}
              >
                {item.productName}
              </Text>

              <Text style={styles.itemDetails}>
                {item.quantity} ×{' '}
                {formatCurrency(item.unitPriceInCents)}
              </Text>

              <Text style={styles.itemSubtotal}>
                {formatCurrency(item.subtotalInCents)}
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>
            Total do pedido
          </Text>

          <Text style={styles.totalValue}>
            {formatCurrency(order.totalInCents)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.catalogButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('ClientHome')}
          accessibilityRole="button"
          accessibilityLabel="Voltar ao catálogo"
        >
          <Text style={styles.catalogButtonText}>
            Voltar ao catálogo
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
    width: 58,
  },
  content: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  orderSummary: {
    padding: 20,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  orderCode: {
    color: '#1E293B',
    fontSize: 20,
    fontWeight: '700',
  },
  orderDate: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 8,
  },
  status: {
    alignSelf: 'flex-start',
    overflow: 'hidden',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 11,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 14,
  },
  activeStatus: {
    color: '#1D4ED8',
    backgroundColor: '#DBEAFE',
  },
  completedStatus: {
    color: '#15803D',
    backgroundColor: '#DCFCE7',
  },
  cancelledStatus: {
    color: '#B91C1C',
    backgroundColor: '#FEE2E2',
  },
  sectionTitle: {
    color: '#1E293B',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
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
    width: 76,
    height: 76,
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
  totalCard: {
    padding: 20,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
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
  catalogButton: {
    width: '100%',
    height: 54,
    borderRadius: 12,
    backgroundColor: '#2D6CDF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  catalogButtonText: {
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
