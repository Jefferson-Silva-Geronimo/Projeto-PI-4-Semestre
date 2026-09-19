import {
  ActivityIndicator,
  Alert,
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

import { useAdminProducts } from '../hooks/useAdminProducts';
import { useProductStatus } from '../hooks/useProductStatus';

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
    loadProducts,
    refreshProducts,
  } = useAdminProducts();

  const {
    processingProductId,
    errorMessage: statusErrorMessage,
    changeStatus,
  } = useProductStatus();

  function handleChangeStatus(product: Product): void {
    const nextActive = !product.active;

    Alert.alert(
      nextActive ? 'Reativar produto' : 'Inativar produto',
      nextActive
        ? `Deseja reativar ${product.name}?`
        : `Deseja inativar ${product.name}? O produto deixará de aparecer no catálogo do cliente.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: nextActive ? 'Reativar' : 'Inativar',
          style: nextActive ? 'default' : 'destructive',
          onPress: () => {
            void (async () => {
              const changed = await changeStatus(
                product.id,
                nextActive,
              );

              if (changed) {
                await loadProducts({
                  refreshing: true,
                });
              }
            })();
          },
        },
      ],
    );
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
              onPress={() => handleChangeStatus(item)}
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
          </View>
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
            Carregando produtos...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMessage && products.length === 0) {
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
              void loadProducts();
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

        <View style={styles.headerInformation}>
          <Text style={styles.title}>
            Produtos
          </Text>

          <Text style={styles.subtitle}>
            Gerencie o catálogo do pet shop.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.createButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('CreateProduct')}
          accessibilityRole="button"
          accessibilityLabel="Cadastrar novo produto"
        >
          <Text style={styles.createButtonText}>
            Novo
          </Text>
        </TouchableOpacity>
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
            <Text
              style={styles.inlineErrorText}
              accessibilityRole="alert"
            >
              {statusErrorMessage || errorMessage}
            </Text>
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
  backText: {
    color: '#2D6CDF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 14,
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
    height: 46,
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
    marginTop: 14,
  },
  editButton: {
    minWidth: 82,
    height: 38,
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
    height: 38,
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
