import {
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

import AppButton from '../components/AppButton';
import BackButton from '../components/BackButton';
import ChipGroup from '../components/ChipGroup';
import FeedbackMessage from '../components/FeedbackMessage';
import LoadingIndicator from '../components/LoadingIndicator';
import ScreenTitle from '../components/ScreenTitle';
import { useAdminOrders } from '../hooks/useAdminOrders';

import type {
    AdminStackParamList,
} from '../types/navigation';

import {
    orderStatusOptions,
    type Order,
    type OrderStatus,
} from '../types/order';

import { formatCurrency } from '../utils/currency';

type Props = NativeStackScreenProps<
    AdminStackParamList,
    'AdminOrders'
>;

const statusLabels: Record<OrderStatus, string> = {
    PENDING_PAYMENT: 'Aguardando pagamento',
    CONFIRMED: 'Confirmado',
    PROCESSING: 'Em processamento',
    COMPLETED: 'Concluído',
    CANCELLED: 'Cancelado',
};

export default function AdminOrdersScreen({
    navigation,
}: Props) {
    const {
        orders,
        loading,
        refreshing,
        errorMessage,
        statusFilter,
        setStatusFilter,
        loadOrders,
        refreshOrders,
    } = useAdminOrders();

    function renderOrder({ item }: { item: Order }) {
        const code = item.id.slice(0, 8).toUpperCase();
        const createdAt = new Date(item.createdAt).toLocaleString('pt-BR');

        return (
            <TouchableOpacity
                style={styles.orderCard}
                activeOpacity={0.8}
                onPress={() =>
                    navigation.navigate('AdminOrderDetails', {
                        orderId: item.id,
                    })
                }
                accessibilityRole="button"
                accessibilityLabel={`Pedido ${code}, ${item.user.name}, ${
                    statusLabels[item.status]
                }, total ${formatCurrency(item.totalInCents)}, ${createdAt}`}
                accessibilityHint="Abre os detalhes do pedido."
            >
                <View style={styles.orderHeader}>
                    <Text style={styles.orderCode}>
                        Pedido #{code}
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

                <Text style={styles.customerName}>
                    {item.user.name}
                </Text>

                <Text style={styles.customerEmail}>
                    {item.user.email}
                </Text>

                <Text style={styles.orderDate}>
                    {createdAt}
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
                    <LoadingIndicator message="Carregando pedidos..." />
                </View>
            </SafeAreaView>
        );
    }

    if (errorMessage && orders.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centeredContent}>
                    <FeedbackMessage
                        kind="error"
                        message={errorMessage}
                        style={styles.errorText}
                    />

                    <AppButton
                        label="Tentar novamente"
                        onPress={() => void loadOrders()}
                    />

                    <AppButton
                        variant="outline"
                        label="Voltar"
                        style={{ marginTop: 8 }}
                        onPress={() => navigation.goBack()}
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />

                <ScreenTitle style={styles.headerTitle}>Pedidos</ScreenTitle>
                <View style={styles.headerSpacer} />
            </View>

            <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
                <ChipGroup
                    groupLabel="Filtrar por status"
                    options={orderStatusOptions}
                    selected={statusFilter}
                    onSelect={setStatusFilter}
                    allowClear
                />
            </View>

            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={renderOrder}
                contentContainerStyle={[
                    styles.listContent,
                    orders.length === 0 ? styles.emptyListContent : undefined,
                ]}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => void refreshOrders()}
                        colors={['#2D6CDF']}
                        tintColor="#2D6CDF"
                    />
                }
                ListHeaderComponent={
                    errorMessage ? (
                        <FeedbackMessage
                            kind="error"
                            message={errorMessage}
                            style={styles.inlineErrorText}
                        />
                    ) : null
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyTitle}>Nenhum pedido encontrado</Text>
                        <Text style={styles.emptyText}>
                            Os pedidos dos clientes aparecerão aqui.
                        </Text>
                    </View>
                }
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
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
    headerTitle: { color: '#1E293B', fontSize: 18, fontWeight: '700' },
    headerSpacer: { width: 50 },
    listContent: {
        width: '100%',
        maxWidth: 760,
        alignSelf: 'center',
        padding: 20,
        paddingBottom: 40,
    },
    emptyListContent: { flexGrow: 1 },
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
    orderCode: { color: '#1E293B', fontSize: 15, fontWeight: '700' },
    status: {
        overflow: 'hidden',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        fontSize: 12,
        fontWeight: '600',
    },
    activeStatus: { color: '#1D4ED8', backgroundColor: '#DBEAFE' },
    completedStatus: { color: '#15803D', backgroundColor: '#DCFCE7' },
    cancelledStatus: { color: '#B91C1C', backgroundColor: '#FEE2E2' },
    customerName: { color: '#334155', fontSize: 15, fontWeight: '600', marginTop: 12 },
    customerEmail: { color: '#64748B', fontSize: 13, marginTop: 3 },
    orderDate: { color: '#64748B', fontSize: 13, marginTop: 8 },
    orderFooter: {
        marginTop: 16,
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemCount: { color: '#475569', fontSize: 14 },
    orderTotal: { color: '#2D6CDF', fontSize: 18, fontWeight: '700' },
    separator: { height: 12 },
    inlineErrorText: { marginBottom: 14 },
    emptyContainer: { flex: 1, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
    emptyTitle: { color: '#1E293B', fontSize: 22, fontWeight: '700', textAlign: 'center' },
    emptyText: { color: '#64748B', fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: 8 },
    centeredContent: { flex: 1, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center' },
    errorText: { fontSize: 15, lineHeight: 23, textAlign: 'center', marginBottom: 20 },
});
