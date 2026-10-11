import {
  useCallback,
  useState,
} from 'react';

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
import ChipGroup from '../components/ChipGroup';
import FeedbackMessage from '../components/FeedbackMessage';
import ListState from '../components/ListState';
import ScreenHeader from '../components/ScreenHeader';
import { useRemoteList } from '../hooks/useRemoteList';
import { appointmentService } from '../services/appointment.service';
import { commonStyles as styles } from '../theme/commonStyles';
import { formatCurrency } from '../utils/currency';
import {
  formatDateKey,
  formatDateKeyLong,
  formatTime,
  nextDays,
} from '../utils/date';
import { getApiErrorMessage } from '../utils/error';

import {
  appointmentStatusLabels,
  type Appointment,
  type AppointmentStatus,
} from '../types/appointment';

import type { AdminStackParamList } from '../types/navigation';
import { getSizeLabel } from '../types/pet';
import { getSpeciesLabel } from '../types/product';

type Props = NativeStackScreenProps<
  AdminStackParamList,
  'AdminAgenda'
>;

const days = nextDays(14);

const nextStatus: Partial<
  Record<AppointmentStatus, AppointmentStatus>
> = {
  SCHEDULED: 'CONFIRMED',
  CONFIRMED: 'COMPLETED',
};

const nextStatusLabel: Partial<
  Record<AppointmentStatus, string>
> = {
  SCHEDULED: 'Confirmar',
  CONFIRMED: 'Concluir',
};

export default function AdminAgendaScreen({
  navigation,
}: Props) {
  const [date, setDate] = useState(days[0]);
  const [actionError, setActionError] = useState('');

  const fetchAgenda = useCallback(
    () => appointmentService.listAgenda(date),
    [date],
  );

  const {
    items: appointments,
    loading,
    refreshing,
    errorMessage,
    load,
    refresh,
  } = useRemoteList(
    fetchAgenda,
    'Não foi possível carregar a agenda.',
  );

  async function handleStatus(
    appointment: Appointment,
    status: AppointmentStatus,
  ): Promise<void> {
    try {
      setActionError('');

      await appointmentService.updateStatus(
        appointment.id,
        status,
      );

      await refresh();
    } catch (error: unknown) {
      setActionError(
        getApiErrorMessage(
          error,
          'Não foi possível atualizar o agendamento.',
        ),
      );
    }
  }

  function renderAppointment({
    item,
  }: {
    item: Appointment;
  }) {
    const advance = nextStatus[item.status];

    const canCancel =
      item.status === 'SCHEDULED' ||
      item.status === 'CONFIRMED';

    const time = formatTime(item.scheduledAt);
    const hasActions = Boolean(advance) || canCancel;

    return (
      <View
        style={styles.card}
        accessible={!hasActions}
        accessibilityLabel={
          hasActions
            ? undefined
            : `${time}, ${item.service.name}, pet ${item.pet.name}, tutor ${
                item.user.name
              }, ${appointmentStatusLabels[item.status]}, ${formatCurrency(
                item.priceInCents,
              )}`
        }
      >
        <Text style={styles.cardTitle}>
          {time} · {item.service.name}
        </Text>

        <Text style={styles.cardText}>
          Pet: {item.pet.name} (
          {getSpeciesLabel(item.pet.species)}, porte{' '}
          {getSizeLabel(item.pet.size)})
        </Text>

        <Text style={styles.cardText}>
          Tutor: {item.user.name}
        </Text>

        <Text style={styles.cardText}>
          {appointmentStatusLabels[item.status]} ·{' '}
          {formatCurrency(item.priceInCents)}
        </Text>

        {advance || canCancel ? (
          <View style={styles.row}>
            {advance ? (
              <AppButton
                variant="outline"
                label={nextStatusLabel[item.status] ?? ''}
                accessibilityLabel={`${
                  nextStatusLabel[item.status] ?? ''
                } agendamento de ${item.pet.name} às ${time}`}
                onPress={() => {
                  void handleStatus(item, advance);
                }}
              />
            ) : null}

            {canCancel ? (
              <AppButton
                variant="danger"
                label="Cancelar"
                accessibilityLabel={`Cancelar agendamento de ${item.pet.name} às ${time}`}
                onPress={() => {
                  void handleStatus(item, 'CANCELLED');
                }}
              />
            ) : null}
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Agenda do dia"
        onBack={() => navigation.goBack()}
      />

      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 12,
        }}
      >
        <ChipGroup
          groupLabel="Dia da agenda"
          options={days.map((day) => ({
            value: day,
            label: formatDateKey(day),
            accessibilityLabel: formatDateKeyLong(day),
          }))}
          selected={date}
          onSelect={(value) => value && setDate(value)}
        />
      </View>

      {loading || (errorMessage && appointments.length === 0) ? (
        <ListState
          loading={loading}
          errorMessage={errorMessage}
          onRetry={() => {
            void load();
          }}
        />
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={renderAppointment}
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
              <FeedbackMessage
                kind="error"
                message={actionError}
                style={styles.errorText}
              />
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text
                style={styles.emptyTitle}
                accessibilityLiveRegion="polite"
              >
                Nenhum agendamento
              </Text>

              <Text style={styles.emptyText}>
                Não há atendimentos marcados para este dia.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
