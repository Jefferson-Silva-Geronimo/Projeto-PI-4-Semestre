import {
  useState,
} from 'react';

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
import { getApiErrorMessage } from '../utils/error';

import type { AdminStackParamList } from '../types/navigation';
import type { Service } from '../types/service';

type Props = NativeStackScreenProps<
  AdminStackParamList,
  'AdminServices'
>;

export default function AdminServicesScreen({
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
    serviceService.listAll,
    'Não foi possível carregar os serviços.',
  );

  const [actionError, setActionError] = useState('');

  async function handleToggle(
    service: Service,
  ): Promise<void> {
    try {
      setActionError('');

      await serviceService.updateStatus(
        service.id,
        !service.active,
      );

      await refresh();
    } catch (error: unknown) {
      setActionError(
        getApiErrorMessage(
          error,
          'Não foi possível alterar o status do serviço.',
        ),
      );
    }
  }

  function renderService({ item }: { item: Service }) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.name}</Text>

        <Text style={styles.cardText}>
          {item.durationMinutes} min ·{' '}
          {item.active ? 'Ativo' : 'Inativo'}
        </Text>

        <Text style={styles.cardPrice}>
          P {formatCurrency(item.priceSmallInCents)} · M{' '}
          {formatCurrency(item.priceMediumInCents)} · G{' '}
          {formatCurrency(item.priceLargeInCents)}
        </Text>

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.outlineButton}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('ServiceForm', {
                serviceId: item.id,
              })
            }
            accessibilityRole="button"
            accessibilityLabel={`Editar ${item.name}`}
          >
            <Text style={styles.outlineButtonText}>
              Editar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={
              item.active
                ? styles.dangerButton
                : styles.outlineButton
            }
            activeOpacity={0.8}
            onPress={() => {
              void handleToggle(item);
            }}
            accessibilityRole="button"
            accessibilityLabel={
              item.active
                ? `Inativar ${item.name}`
                : `Ativar ${item.name}`
            }
          >
            <Text
              style={
                item.active
                  ? styles.dangerButtonText
                  : styles.outlineButtonText
              }
            >
              {item.active ? 'Inativar' : 'Ativar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Serviços"
        subtitle="Gerencie os serviços oferecidos."
        onBack={() => navigation.goBack()}
        actionLabel="Novo serviço"
        onAction={() => navigation.navigate('ServiceForm', {})}
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
          ListHeaderComponent={
            actionError ? (
              <Text
                style={styles.errorText}
                accessibilityRole="alert"
              >
                {actionError}
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyTitle}>
                Nenhum serviço cadastrado
              </Text>

              <Text style={styles.emptyText}>
                Cadastre o primeiro serviço do pet shop.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
