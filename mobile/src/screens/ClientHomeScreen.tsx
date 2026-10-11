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
import ChipGroup from '../components/ChipGroup';
import FeedbackMessage from '../components/FeedbackMessage';
import LoadingIndicator from '../components/LoadingIndicator';
import OfflineNotice from '../components/OfflineNotice';
import ScreenTitle from '../components/ScreenTitle';
import { useAuth } from '../hooks/useAuth';
import { useClientProducts } from '../hooks/useClientProducts';

import type {
  ClientStackParamList,
} from '../types/navigation';

import {
  categoryOptions,
  type Product,
  type Species,
} from '../types/product';

import { colors } from '../theme/tokens';

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
    offline,
    search,
    category,
    species,
    setSearch,
    setCategory,
    setSpecies,
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
        accessibilityLabel={`${item.name}. ${formatCurrency(item.priceInCents)}. ${
          isUnavailable ? 'Indisponível' : 'Disponível'
        }. ${item.description}`}
        accessibilityHint="Abre os detalhes do produto."
      >
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
          <LoadingIndicator message="Carregando produtos..." />
        </View>
      </SafeAreaView>
    );
  }

  if (
    errorMessage &&
    products.length === 0 &&
    !search &&
    !category &&
    !species
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
            variant="link"
            label="Sair da conta"
            style={{ marginTop: 8 }}
            onPress={() => {
              void handleLogout();
            }}
          />
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

          <ScreenTitle style={styles.title}>
            {`Olá, ${user?.name ?? ''}`}
          </ScreenTitle>

          <Text style={styles.subtitle}>
            Confira os produtos disponíveis.
          </Text>
        </View>

        <AppButton
          variant="link"
          label="Sair"
          accessibilityLabel="Sair da conta"
          onPress={() => {
            void handleLogout();
          }}
        />
      </View>

      {offline ? <OfflineNotice /> : null}

      <View style={styles.filters}>
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

        <ChipGroup
          groupLabel="Filtrar por categoria"
          options={categoryOptions}
          selected={category}
          onSelect={setCategory}
          allowClear
        />

        <ChipGroup
          groupLabel="Filtrar por espécie"
          options={speciesFilterOptions}
          selected={species}
          onSelect={setSpecies}
          allowClear
          allLabel="Cão e gato"
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
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              Nenhum produto encontrado
            </Text>

            <Text style={styles.emptyText}>
              Ajuste a busca ou os filtros para ver outros produtos.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const speciesFilterOptions: Array<{
  value: Species;
  label: string;
}> = [
  { value: 'CAO', label: 'Cão' },
  { value: 'GATO', label: 'Gato' },
];

const styles = StyleSheet.create({
  filters: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 10,
  },
  searchInput: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.borderControl,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
  },
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
  errorText: {
    color: '#DC2626',
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    marginBottom: 20,
  },
});
