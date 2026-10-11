import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
} from 'react-native';

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import AppButton from '../components/AppButton';
import ListState from '../components/ListState';
import ScreenHeader from '../components/ScreenHeader';
import { useRemoteList } from '../hooks/useRemoteList';
import { serviceService } from '../services/service.service';
import { commonStyles as styles } from '../theme/commonStyles';
import { formatCurrency } from '../utils/currency';

import type { ClientStackParamList } from '../types/navigation';
import type { Service } from '../types/service';

type Props = NativeStackScreenProps<
  ClientStackParamList,
  'Services'
>;

export default function ServicesScreen({
  navigation,
}: Props) {
  function handleBack(): void {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('ClientHome');
  }
  const {
    items: services,
    loading,
    refreshing,
    errorMessage,
    load,
    refresh,
  } = useRemoteList(
    serviceService.listActive,
    'Não foi possível carregar os serviços.',
  );

  function renderService({ item }: { item: Service }) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle} accessibilityRole="header">
          {item.name}
        </Text>

        <Text style={styles.cardText}>
          {item.description}
        </Text>

        <Text style={styles.cardText}>
          Duração: {item.durationMinutes} min
        </Text>

        <Text
          style={styles.cardPrice}
          accessibilityLabel={`Preços: pequeno ${formatCurrency(
            item.priceSmallInCents,
          )}, médio ${formatCurrency(
            item.priceMediumInCents,
          )}, grande ${formatCurrency(item.priceLargeInCents)}`}
        >
          P {formatCurrency(item.priceSmallInCents)} · M{' '}
          {formatCurrency(item.priceMediumInCents)} · G{' '}
          {formatCurrency(item.priceLargeInCents)}
        </Text>

        <AppButton
          label="Agendar"
          accessibilityLabel={`Agendar ${item.name}`}
          style={{ marginTop: 8 }}
          onPress={() =>
            navigation.navigate('BookAppointment', {
              serviceId: item.id,
            })
          }
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Serviços"
        subtitle="Banho, tosa e cuidados para o seu pet."
        onBack={handleBack}
      />

      {loading || (errorMessage && services.length === 0) ? (
        <ListState
          loading={loading}
          errorMessage={errorMessage}
          onRetry={() => {
            void load();
          }}
        />
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={renderService}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                void refresh();
              }}
              colors={['#2D6CDF']}
              tintColor="#2D6CDF"
            />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyTitle}>
                Nenhum serviço disponível
              </Text>

              <Text style={styles.emptyText}>
                Volte mais tarde para conferir os serviços.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
