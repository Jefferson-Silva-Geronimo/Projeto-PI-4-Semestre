import {
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
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
import {
  useAdminProducts,
  type ProductStatusFilter,
} from '../hooks/useAdminProducts';
import { useProductStatus } from '../hooks/useProductStatus';
import { confirmAction } from '../utils/confirm';

import type {
  AdminStackParamList,
} from '../types/navigation';

import type {
  Product,
} from '../types/product';

import {
  formatCurrency,
} from '../utils/currency';

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
    refreshing,
    errorMessage,
    search,
    statusFilter,
    setSearch,
    setStatusFilter,
    loadProducts,
    refreshProducts,
  } = useAdminProducts();

  const {
    processingProductId,
    errorMessage: statusErrorMessage,
    changeStatus,
    removeProduct,
  } = useProductStatus();

  async function handleDelete(
    product: Product,
  ): Promise<void> {
    const confirmed = await confirmAction({
      title: 'Excluir produto',
      message: `Deseja excluir ${product.name} definitivamente? O produto será removido dos carrinhos e os pedidos já feitos não serão afetados.`,
      confirmText: 'Excluir',
      destructive: true,
    });

    if (!confirmed) {
      return;
    }

    const removed = await removeProduct(
      product.id,
    );

    if (removed) {
      await loadProducts({
        refreshing: true,
      });
    }
  }

  async function handleChangeStatus(
    product: Product,
  ): Promise<void> {
    const nextActive = !product.active;

    const confirmed = await confirmAction({
      title: nextActive
        ? 'Reativar produto'
        : 'Inativar produto',
      message: nextActive
        ? `Deseja reativar ${product.name}?`
        : `Deseja inativar ${product.name}? O produto deixará de aparecer no catálogo do cliente.`,
      confirmText: nextActive
        ? 'Reativar'
        : 'Inativar',
      destructive: !nextActive,
    });

    if (!confirmed) {
      return;
    }

    const changed = await changeStatus(
      product.id,
      nextActive,
    );

    if (changed) {
      await loadProducts({
        refreshing: true,
      });
    }
  }

  function renderProduct({
    item,
  }: {
    item: Product;
  }) {
    const processing = processingProductId === item.id;

    return (
      <View style={styles.productCard}>
        <Image
          source={{
            uri: item.imageUrl,
          }}
          style={styles.productImage}
          resizeMode="cover"
          accessible={false}
          importantForAccessibility="no"
        />

        <View style={styles.productInformation}>
          <Text
            style={styles.productName}
            numberOfLines={2}
          >
            {item.name}
          </Text>

          <Text style={styles.productPrice}>
            {formatCurrency(item.priceInCents)}
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

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.editButton}
              activeOpacity={0.8}
              disabled={processing}
              onPress={() =>
                navigation.navigate('EditProduct', {
                  productId: item.id,
                })
              }
              accessibilityRole="button"
              accessibilityLabel={`Editar ${item.name}`}
            >
              <Text style={styles.editButtonText}>
                Editar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statusButton,
                item.active
                  ? styles.deactivateButton
                  : styles.activateButton,
              ]}
              activeOpacity={0.8}
              disabled={processing}
              onPress={() => {
                void handleChangeStatus(item);
              }}
              accessibilityRole="button"
              accessibilityLabel={
                item.active
                  ? `Inativar ${item.name}`
                  : `Reativar ${item.name}`
              }
              accessibilityState={{
                disabled: processing,
                busy: processing,
              }}
            >
              <Text style={styles.statusButtonText}>
                {processing
                  ? 'Aguarde...'
                  : item.active
                    ? 'Inativar'
                    : 'Reativar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              activeOpacity={0.8}
              disabled={processing}
              onPress={() => {
                void handleDelete(item);
              }}
              accessibilityRole="button"
              accessibilityLabel={`Excluir ${item.name}`}
            >
              <Text style={styles.deleteButtonText}>
                Excluir
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContent}>
          <LoadingIndicator message="Carregando produtos..." />
        </View>
      </SafeAreaView>
    );
  }

  if (
    errorMessage &&
    products.length === 0 &&
    !search &&
    statusFilter === 'ALL'
  ) {
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
            onPress={() => {
              void loadProducts();
            }}
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

        <View style={styles.headerInformation}>
          <ScreenTitle style={styles.title}>
            Produtos
          </ScreenTitle>

          <Text style={styles.subtitle}>
            Gerencie o catálogo do pet shop.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.createButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('CreateProduct')}
          accessibilityRole="button"
          accessibilityLabel="Novo produto"
        >
          <Text style={styles.createButtonText}>
            Novo
          </Text>
        </TouchableOpacity>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produto"
          placeholderTextColor="#64748B"
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Buscar produto"
          accessibilityRole="search"
        />

        <ChipGroup<ProductStatusFilter>
          groupLabel="Filtrar produtos por situação"
          options={statusOptions}
          selected={statusFilter}
          onSelect={(value) =>
            setStatusFilter(value ?? 'ALL')
          }
        />
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        contentContainerStyle={[
          styles.listContent,
          products.length === 0
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
              void refreshProducts();
            }}
            colors={['#2D6CDF']}
            tintColor="#2D6CDF"
          />
        }
        ListHeaderComponent={
          statusErrorMessage || errorMessage ? (
            <FeedbackMessage
              kind="error"
              message={statusErrorMessage || errorMessage}
              style={styles.inlineErrorText}
            />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              Nenhum produto cadastrado
            </Text>

            <Text style={styles.emptyText}>
              Cadastre o primeiro produto para iniciar o catálogo.
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const statusOptions: Array<{
  value: ProductStatusFilter;
  label: string;
}> = [
  { value: 'ALL', label: 'Todos' },
  { value: 'ACTIVE', label: 'Ativos' },
  { value: 'INACTIVE', label: 'Inativos' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerInformation: {
    marginBottom: 14,
  },
  title: {
    color: '#1E293B',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#64748B',
    fontSize: 15,
    marginTop: 4,
  },
  createButton: {
    minHeight: 48,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#2D6CDF',
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  searchInput: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#738298',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
    marginTop: 14,
    marginBottom: 12,
  },
  deleteButton: {
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
  },
  listContent: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  productCard: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
  },
  productImage: {
    width: 104,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    marginRight: 14,
  },
  productInformation: {
    flex: 1,
  },
  productName: {
    color: '#1E293B',
    fontSize: 17,
    fontWeight: '700',
  },
  productPrice: {
    color: '#2D6CDF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 5,
  },
  productStock: {
    color: '#475569',
    fontSize: 14,
    marginTop: 5,
  },
  productStatus: {
    alignSelf: 'flex-start',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  activeStatus: {
    color: '#15803D',
    backgroundColor: '#DCFCE7',
  },
  inactiveStatus: {
    color: '#B91C1C',
    backgroundColor: '#FEE2E2',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  editButton: {
    minWidth: 82,
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#2D6CDF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  statusButton: {
    minWidth: 90,
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deactivateButton: {
    backgroundColor: '#DC2626',
  },
  activateButton: {
    backgroundColor: '#15803D',
  },
  statusButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
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
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: '#1E293B',
    fontSize: 21,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 8,
  },
  centeredContent: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    marginBottom: 20,
  },
});
