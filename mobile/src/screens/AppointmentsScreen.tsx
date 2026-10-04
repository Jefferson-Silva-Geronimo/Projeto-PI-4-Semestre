import {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  RefreshControl,
  SafeAreaView,
  SectionList,
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
import { appointmentService } from '../services/appointment.service';
import { commonStyles as styles } from '../theme/commonStyles';
import { confirmAction } from '../utils/confirm';
import { formatCurrency } from '../utils/currency';
import { formatDateTime } from '../utils/date';
import { getApiErrorMessage } from '../utils/error';

import {
  appointmentStatusLabels,
  type Appointment,
} from '../types/appointment';

import type { ClientStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<
  ClientStackParamList,
  'Appointments'
>;

export default function AppointmentsScreen({
  navigation,
}: Props) {
  const {
    items: appointments,
    loading,
    refreshing,
    errorMessage,
    load,
    refresh,
  } = useRemoteList(
    appointmentService.list,
    'Não foi possível carregar seus agendamentos.',
  );

  const [actionError, setActionError] = useState('');

  const sections = useMemo(() => {
    const open = appointments
      .filter(
        (item) =>
          item.status === 'SCHEDULED' ||
          item.status === 'CONFIRMED',
      )
      .sort(
        (a, b) =>
          a.scheduledAt.localeCompare(b.scheduledAt),
      );

    const history = appointments.filter(
      (item) =>
        item.status === 'COMPLETED' ||
        item.status === 'CANCELLED',
    );

    return [
      { title: 'Próximos', data: open },
      { title: 'Histórico', data: history },
    ].filter((section) => section.data.length > 0);
  }, [appointments]);

  const handleCancel = useCallback(
    async (appointment: Appointment): Promise<void> => {
      const confirmed = await confirmAction({
        title: 'Cancelar agendamento',
        message: `Deseja cancelar ${appointment.service.name} de ${appointment.pet.name}?`,
        confirmText: 'Cancelar agendamento',
        cancelText: 'Voltar',
        destructive: true,
      });

      if (!confirmed) {
        return;
      }

      try {
        setActionError('');

        await appointmentService.cancel(appointment.id);

        await refresh();
      } catch (error: unknown) {
        setActionError(
          getApiErrorMessage(
            error,
            'Não foi possível cancelar o agendamento.',
          ),
        );
      }
    },
    [refresh],
  );

  function renderAppointment({
    item,
  }: {
    item: Appointment;
  }) {
    const canCancel =
      item.status === 'SCHEDULED' ||
      item.status === 'CONFIRMED';

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {item.service.name} · {item.pet.name}
        </Text>

        <Text style={styles.cardText}>
          {formatDateTime(item.scheduledAt)}
        </Text>

        <Text style={styles.cardText}>
          {appointmentStatusLabels[item.status]} ·{' '}
          {formatCurrency(item.priceInCents)}
        </Text>

        {canCancel ? (
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.dangerButton}
              activeOpacity={0.8}
              onPress={() => {
                void handleCancel(item);
              }}
              accessibilityRole="button"
              accessibilityLabel="Cancelar agendamento"
            >
              <Text style={styles.dangerButtonText}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Meus agendamentos"
        onBack={() => navigation.goBack()}
        actionLabel="Novo agendamento"
        onAction={() => navigation.navigate('Services')}
      />

      {loading ||
      (errorMessage && appointments.length === 0) ? (
        <ListState
          loading={loading}
          errorMessage={errorMessage}
          onRetry={() => {
            void load();
          }}
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderAppointment}
          renderSectionHeader={({ section }) => (
            <Text style={styles.label}>{section.title}</Text>
          )}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
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
                Nenhum agendamento
              </Text>

              <Text style={styles.emptyText}>
                Agende um serviço para o seu pet.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
