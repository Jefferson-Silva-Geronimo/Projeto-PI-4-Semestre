import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import AppButton from '../components/AppButton';
import ChipGroup from '../components/ChipGroup';
import FeedbackMessage from '../components/FeedbackMessage';
import LoadingIndicator from '../components/LoadingIndicator';
import ScreenHeader from '../components/ScreenHeader';
import { bookingDays, useBooking } from '../hooks/useBooking';
import { commonStyles as styles } from '../theme/commonStyles';
import { formatCurrency } from '../utils/currency';
import {
  formatDateKey,
  formatDateKeyLong,
  formatTime,
} from '../utils/date';

import type { ClientStackParamList } from '../types/navigation';
import { getServicePrice } from '../types/service';

type Props = NativeStackScreenProps<
  ClientStackParamList,
  'BookAppointment'
>;

export default function BookAppointmentScreen({
  navigation,
  route,
}: Props) {
  const booking = useBooking(route.params.serviceId);

  const pet = booking.pets.find(
    (item) => item.id === booking.petId,
  );

  async function handleSubmit(): Promise<void> {
    if (await booking.submit()) {
      Alert.alert(
        'Agendamento realizado',
        'Seu horário foi reservado. O pagamento é feito no atendimento, na loja.',
      );

      navigation.replace('Appointments');
    }
  }

  if (booking.loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <LoadingIndicator />
        </View>
      </SafeAreaView>
    );
  }

  if (!booking.service) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title="Agendar serviço"
          onBack={() => navigation.goBack()}
        />

        <View style={styles.centered}>
          <FeedbackMessage
            kind="error"
            message={booking.errorMessage || 'Serviço não encontrado.'}
            style={styles.errorText}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (booking.pets.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title={booking.service.name}
          onBack={() => navigation.goBack()}
        />

        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>
            Cadastre um pet primeiro
          </Text>

          <Text style={styles.emptyText}>
            Para agendar, precisamos saber quem será atendido.
          </Text>

          <AppButton
            label="Adicionar pet"
            onPress={() => navigation.navigate('PetForm', {})}
          />
        </View>
      </SafeAreaView>
    );
  }

  const price = pet
    ? formatCurrency(getServicePrice(booking.service, pet.size))
    : '-';

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={booking.service.name}
        subtitle={`Duração: ${booking.service.durationMinutes} min`}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.label} accessibilityRole="header">
            Pet
          </Text>

          <ChipGroup
            groupLabel="Pet"
            options={booking.pets.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            selected={booking.petId}
            onSelect={booking.setPetId}
          />
        </View>

        <View>
          <Text style={styles.label} accessibilityRole="header">
            Data
          </Text>

          <ChipGroup
            groupLabel="Data"
            options={bookingDays.map((day) => ({
              value: day,
              label: formatDateKey(day),
              accessibilityLabel: formatDateKeyLong(day),
            }))}
            selected={booking.date}
            onSelect={(value) =>
              value && booking.setDate(value)
            }
          />
        </View>

        <View>
          <Text style={styles.label} accessibilityRole="header">
            Horário
          </Text>

          {booking.loadingSlots ? (
            <LoadingIndicator
              size="small"
              message="Carregando horários..."
            />
          ) : booking.slots.length === 0 ? (
            <Text
              style={styles.helper}
              accessibilityLiveRegion="polite"
            >
              Nenhum horário livre nesta data.
            </Text>
          ) : (
            <ChipGroup
              groupLabel="Horário"
              options={booking.slots.map((value) => ({
                value,
                label: formatTime(value),
              }))}
              selected={booking.slot}
              onSelect={booking.setSlot}
            />
          )}
        </View>

        <View
          style={styles.card}
          accessible
          accessibilityLabel={`Resumo: ${booking.service.name} para ${pet?.name}, ${price}. Pagamento no atendimento, na loja.`}
        >
          <Text style={styles.cardTitle}>Resumo</Text>

          <Text style={styles.cardText}>
            {booking.service.name} para {pet?.name}
          </Text>

          <Text style={styles.cardPrice}>{price}</Text>

          <Text style={styles.helper}>
            Pagamento no atendimento, na loja.
          </Text>
        </View>

        <FeedbackMessage
          kind="error"
          message={booking.errorMessage}
          style={styles.errorText}
        />

        <AppButton
          size="large"
          label="Confirmar agendamento"
          loading={booking.submitting}
          loadingLabel="Agendando..."
          disabled={!booking.slot}
          onPress={() => {
            void handleSubmit();
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
