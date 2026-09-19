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

import { useAuth } from '../hooks/useAuth';
import { useClientProducts } from '../hooks/useClientProducts';

import type {
  ClientStackParamList,
} from '../types/navigation';

import type {
  Product,
} from '../types/product';

import {
  formatCurrency,
} from '../utils/currency';

type Props = NativeStackScreenProps<
  ClientStackParamList,
  'ClientHome'
>;

export default function ClientHomeScreen({
  navigation,
}: Props) {
  const {
    user,
    signOut,
  } = useAuth();

  const {
    products,
    loading,
    refreshing,
    errorMessage,
    loadProducts,
    refreshProducts,
  } = useClientProducts();

  async function handleLogout(): Promise<void> {
    await signOut();
  }

  function handleOpenProduct(
    product: Product,
  ): void {
    navigation.navigate('ProductDetails', {
      productId: product.id,
    });
  }

  function renderProduct({
    item,
  }: {
    item: Product;
  }) {
    const isUnavailable = !item.available;

    return (
      <TouchableOpacity
        style={styles.productCard}
        activeOpacity={0.8}
        onPress={() => handleOpenProduct(item)}
        accessibilityRole="button"
        accessibilityLabel={`Abrir detalhes do produto ${item.name}`}
        accessibilityHint="Abre a página com as informações completas do produto."
      >
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

          <Text
            style={styles.productDescription}
            numberOfLines={2}
          >
            {item.description}
          </Text>

          <Text style={styles.productPrice}>
            {formatCurrency(item.priceInCents)}
          </Text>

          <Text
            style={
              isUnavailable
                ? styles.unavailableStatus
                : styles.availableStatus
            }
          >
            {isUnavailable
              ? 'Indisponível'
              : 'Disponível'}
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
            Carregando produtos...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMessage) {
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
            accessibilityRole="button"
            accessibilityLabel="Tentar carregar os produtos novamente"
          >
            <Text style={styles.primaryButtonText}>
              Tentar novamente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.7}
            onPress={() => {
              void handleLogout();
            }}
            accessibilityRole="button"
            accessibilityLabel="Sair da conta"
          >
            <Text style={styles.secondaryButtonText}>
              Sair da conta
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.welcome}>
          <Text style={styles.logo}>
            PETSHOP
          </Text>

          <Text style={styles.title}>
            Olá, {user?.name}
          </Text>

          <Text style={styles.subtitle}>
            Confira os produtos disponíveis.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            void handleLogout();
          }}
          accessibilityRole="button"
          accessibilityLabel="Sair da conta"
        >
          <Text style={styles.logoutText}>
            Sair
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickActionButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Cart')}
          accessibilityRole="button"
          accessibilityLabel="Abrir carrinho"
        >
          <Text style={styles.quickActionTitle}>
            Carrinho
          </Text>

          <Text style={styles.quickActionDescription}>
            Revise os itens selecionados
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Orders')}
          accessibilityRole="button"
          accessibilityLabel="Abrir meus pedidos"
        >
          <Text style={styles.quickActionTitle}>
            Meus pedidos
          </Text>

          <Text style={styles.quickActionDescription}>
            Consulte seu histórico
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
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              Nenhum produto disponível
            </Text>

            <Text style={styles.emptyText}>
              O catálogo ainda não possui produtos disponíveis.
            </Text>
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
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  welcome: {
    flex: 1,
    paddingRight: 16,
  },
  logo: {
    color: '#2D6CDF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  title: {
    color: '#1E293B',
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  logoutText: {
    color: '#2D6CDF',
    fontSize: 15,
    fontWeight: '600',
    paddingTop: 4,
  },
  quickActions: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
    flexDirection: 'row',
  },
  quickActionButton: {
    flex: 1,
    minHeight: 82,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginRight: 8,
  },
  quickActionTitle: {
    color: '#2D6CDF',
    fontSize: 15,
    fontWeight: '700',
  },
  quickActionDescription: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
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
  productCard: {
    minHeight: 150,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  productImage: {
    width: 110,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    marginRight: 14,
  },
  productInformation: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  productName: {
    color: '#1E293B',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  productDescription: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  productPrice: {
    color: '#2D6CDF',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  availableStatus: {
    overflow: 'hidden',
    color: '#15803D',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: '600',
  },
  unavailableStatus: {
    overflow: 'hidden',
    color: '#B91C1C',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: '600',
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: '#1E293B',
    fontSize: 20,
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
