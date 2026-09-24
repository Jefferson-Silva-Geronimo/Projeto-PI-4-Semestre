import {
  ActivityIndicator,
  FlatList,
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

import { useOrders } from '../hooks/useOrders';

import type {
  ClientStackParamList,
} from '../types/navigation';

import type {
  Order,
  OrderStatus,
} from '../types/order';

import {
  formatCurrency,
} from '../utils/currency';

type Props = NativeStackScreenProps<
  ClientStackParamList,
  'Orders'
>;

const statusLabels: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'Aguardando pagamento',
  CONFIRMED: 'Confirmado',
  PROCESSING: 'Em processamento',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
};

export default function OrdersScreen({
  navigation,
}: Props) {
  const {
    orders,
    loading,
    refreshing,
    errorMessage,
    loadOrders,
    refreshOrders,
  } = useOrders();

  function renderOrder({
    item,
  }: {
    item: Order;
  }) {
    return (
      <TouchableOpacity
        style={styles.orderCard}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('OrderDetails', {
            orderId: item.id,
          })
        }
        accessibilityRole="button"
        accessibilityLabel={`Abrir pedido ${item.id}`}
      >
        <View style={styles.orderHeader}>
          <Text style={styles.orderCode}>
            Pedido #{item.id.slice(0, 8).toUpperCase()}
          </Text>

          <Text
            style={[
              styles.status,
              item.status === 'CANCELLED'
                ? styles.cancelledStatus
                : item.status === 'COMPLETED'
                  ? styles.completedStatus
                  : styles.activeStatus,
            ]}
          >
            {statusLabels[item.status]}
          </Text>
        </View>

        <Text style={styles.orderDate}>
          {new Date(item.createdAt).toLocaleString('pt-BR')}
        </Text>

        <View style={styles.orderFooter}>
          <Text style={styles.itemCount}>
            {item.items.length}{' '}
            {item.items.length === 1 ? 'produto' : 'produtos'}
          </Text>

          <Text style={styles.orderTotal}>
            {formatCurrency(item.totalInCents)}
          </Text>
        </View>
      </TouchableOpacity>
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
            Carregando pedidos...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMessage && orders.length === 0) {
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
              void loadOrders();
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
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>
            ‹ Voltar
          </Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Meus pedidos
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={[
          styles.listContent,
          orders.length === 0
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
              void refreshOrders();
            }}
            colors={['#2D6CDF']}
            tintColor="#2D6CDF"
          />
        }
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
              Nenhum pedido encontrado
            </Text>

            <Text style={styles.emptyText}>
              Seus pedidos aparecerão aqui após a confirmação da compra.
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ClientHome')}
            >
              <Text style={styles.primaryButtonText}>
                Ver produtos
              </Text>
            </TouchableOpacity>
          </View>
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
  headerSpacer: {
    width: 50,
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
  orderCard: {
    padding: 18,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderCode: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '700',
  },
  status: {
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: '600',
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
  orderDate: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 10,
  },
  orderFooter: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemCount: {
    color: '#475569',
    fontSize: 14,
  },
  orderTotal: {
    color: '#2D6CDF',
    fontSize: 18,
    fontWeight: '700',
  },
  separator: {
    height: 12,
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
