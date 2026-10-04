import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

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
        <Text style={styles.cardTitle}>{item.name}</Text>

        <Text style={styles.cardText}>
          {item.description}
        </Text>

        <Text style={styles.cardText}>
          Duração: {item.durationMinutes} min
        </Text>

        <Text style={styles.cardPrice}>
          P {formatCurrency(item.priceSmallInCents)} · M{' '}
          {formatCurrency(item.priceMediumInCents)} · G{' '}
          {formatCurrency(item.priceLargeInCents)}
        </Text>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            { marginTop: 8 },
          ]}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('BookAppointment', {
              serviceId: item.id,
            })
          }
          accessibilityRole="button"
          accessibilityLabel={`Agendar ${item.name}`}
        >
          <Text style={styles.primaryButtonText}>
            Agendar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Serviços"
        subtitle="Banho, tosa e cuidados para o seu pet."
        onBack={() => navigation.goBack()}
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
