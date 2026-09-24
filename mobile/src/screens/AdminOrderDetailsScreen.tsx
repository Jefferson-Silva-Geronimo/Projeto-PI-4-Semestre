import {
  ActivityIndicator,
  Alert,
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

import { useAdminOrderDetails } from '../hooks/useAdminOrderDetails';

import type {
  AdminStackParamList,
} from '../types/navigation';

import type {
  OrderStatus,
} from '../types/order';

import { formatCurrency } from '../utils/currency';

type Props = NativeStackScreenProps<
  AdminStackParamList,
  'AdminOrderDetails'
>;

const statusLabels: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'Aguardando pagamento',
  CONFIRMED: 'Confirmado',
  PROCESSING: 'Em processamento',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
};

export default function AdminOrderDetailsScreen({
  navigation,
  route,
}: Props) {
  const { orderId } = route.params;

  const {
    order,
    loading,
    refreshing,
    updating,
    errorMessage,
    loadOrder,
    refreshOrder,
    updateStatus,
  } = useAdminOrderDetails({ orderId });

  function confirmStatus(status: OrderStatus): void {
    Alert.alert(
      'Atualizar pedido',
      `Deseja alterar o pedido para “${statusLabels[status]}”?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: status === 'CANCELLED' ? 'destructive' : 'default',
          onPress: () => void updateStatus(status),
        },
      ],
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContent}>
          <ActivityIndicator size="large" color="#2D6CDF" />
          <Text style={styles.feedbackText}>Carregando pedido...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMessage && !order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContent}>
          <Text style={styles.errorText} accessibilityRole="alert">
            {errorMessage}
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => void loadOrder()}>
            <Text style={styles.primaryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.secondaryButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return null;
  }

  const canProcess = order.status === 'CONFIRMED';
  const canComplete = order.status === 'PROCESSING';
  const canCancel = order.status === 'CONFIRMED' || order.status === 'PROCESSING';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹ Pedidos</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do pedido</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void refreshOrder()}
            colors={['#2D6CDF']}
            tintColor="#2D6CDF"
          />
        }
      >
        <View style={styles.summaryCard}>
          <Text style={styles.orderCode}>
            Pedido #{order.id.slice(0, 8).toUpperCase()}
          </Text>
          <Text style={styles.customerName}>{order.user.name}</Text>
          <Text style={styles.customerEmail}>{order.user.email}</Text>
          <Text style={styles.orderDate}>
            {new Date(order.createdAt).toLocaleString('pt-BR')}
          </Text>
          <Text style={styles.status}>{statusLabels[order.status]}</Text>
        </View>

        <Text style={styles.sectionTitle}>Produtos</Text>

        {order.items.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            <View style={styles.itemInformation}>
              <Text style={styles.itemName}>{item.productName}</Text>
              <Text style={styles.itemDetails}>
                {item.quantity} × {formatCurrency(item.unitPriceInCents)}
              </Text>
              <Text style={styles.itemSubtotal}>
                {formatCurrency(item.subtotalInCents)}
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(order.totalInCents)}</Text>
        </View>

        {errorMessage ? (
          <Text style={styles.inlineErrorText} accessibilityRole="alert">
            {errorMessage}
          </Text>
        ) : null}

        <View style={styles.actions}>
          {canProcess ? (
            <TouchableOpacity
              style={styles.primaryAction}
              disabled={updating}
              onPress={() => confirmStatus('PROCESSING')}
            >
              <Text style={styles.actionText}>Iniciar processamento</Text>
            </TouchableOpacity>
          ) : null}

          {canComplete ? (
            <TouchableOpacity
              style={styles.completeAction}
              disabled={updating}
              onPress={() => confirmStatus('COMPLETED')}
            >
              <Text style={styles.actionText}>Concluir pedido</Text>
            </TouchableOpacity>
          ) : null}

          {canCancel ? (
            <TouchableOpacity
              style={styles.cancelAction}
              disabled={updating}
              onPress={() => confirmStatus('CANCELLED')}
            >
              <Text style={styles.actionText}>Cancelar pedido</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { minHeight: 64, paddingHorizontal: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backText: { color: '#2D6CDF', fontSize: 16, fontWeight: '600' },
  headerTitle: { color: '#1E293B', fontSize: 18, fontWeight: '700' },
  headerSpacer: { width: 58 },
  content: { width: '100%', maxWidth: 720, alignSelf: 'center', padding: 20, paddingBottom: 40 },
  summaryCard: { padding: 20, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0' },
  orderCode: { color: '#1E293B', fontSize: 20, fontWeight: '700' },
  customerName: { color: '#334155', fontSize: 16, fontWeight: '600', marginTop: 14 },
  customerEmail: { color: '#64748B', fontSize: 13, marginTop: 3 },
  orderDate: { color: '#64748B', fontSize: 13, marginTop: 8 },
  status: { alignSelf: 'flex-start', color: '#1D4ED8', backgroundColor: '#DBEAFE', paddingHorizontal: 11, paddingVertical: 6, borderRadius: 11, fontSize: 12, fontWeight: '600', marginTop: 14 },
  sectionTitle: { color: '#1E293B', fontSize: 18, fontWeight: '700', marginTop: 24, marginBottom: 12 },
  itemCard: { padding: 12, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', marginBottom: 12 },
  itemImage: { width: 76, height: 76, borderRadius: 10, backgroundColor: '#E2E8F0', marginRight: 12 },
  itemInformation: { flex: 1, justifyContent: 'center' },
  itemName: { color: '#1E293B', fontSize: 15, fontWeight: '700' },
  itemDetails: { color: '#64748B', fontSize: 13, marginTop: 5 },
  itemSubtotal: { color: '#2D6CDF', fontSize: 15, fontWeight: '700', marginTop: 6 },
  totalCard: { padding: 20, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  totalLabel: { color: '#1E293B', fontSize: 17, fontWeight: '700' },
  totalValue: { color: '#2D6CDF', fontSize: 22, fontWeight: '700' },
  inlineErrorText: { color: '#DC2626', fontSize: 14, lineHeight: 20, marginTop: 18 },
  actions: { marginTop: 22 },
  primaryAction: { height: 54, borderRadius: 12, backgroundColor: '#2D6CDF', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  completeAction: { height: 54, borderRadius: 12, backgroundColor: '#15803D', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  cancelAction: { height: 54, borderRadius: 12, backgroundColor: '#DC2626', alignItems: 'center', justifyContent: 'center' },
  actionText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  centeredContent: { flex: 1, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center' },
  feedbackText: { color: '#475569', fontSize: 16, marginTop: 18 },
  errorText: { color: '#DC2626', fontSize: 15, lineHeight: 23, textAlign: 'center', marginBottom: 20 },
  primaryButton: { height: 50, paddingHorizontal: 24, borderRadius: 12, backgroundColor: '#2D6CDF', alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  secondaryButton: { height: 48, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  secondaryButtonText: { color: '#2D6CDF', fontSize: 15, fontWeight: '600' },
});
