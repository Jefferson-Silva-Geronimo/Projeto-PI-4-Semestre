import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import ChipGroup from '../components/ChipGroup';
import ScreenHeader from '../components/ScreenHeader';
import { bookingDays, useBooking } from '../hooks/useBooking';
import { commonStyles as styles } from '../theme/commonStyles';
import { formatCurrency } from '../utils/currency';
import { formatDateKey, formatTime } from '../utils/date';

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
          <ActivityIndicator size="large" color="#2D6CDF" />
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
          <Text style={styles.errorText}>
            {booking.errorMessage || 'Serviço não encontrado.'}
          </Text>
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

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('PetForm', {})}
          >
            <Text style={styles.primaryButtonText}>
              Adicionar pet
            </Text>
          </TouchableOpacity>
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
          <Text style={styles.label}>Pet</Text>

          <ChipGroup
            options={booking.pets.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            selected={booking.petId}
            onSelect={booking.setPetId}
          />
        </View>

        <View>
          <Text style={styles.label}>Data</Text>

          <ChipGroup
            options={bookingDays.map((day) => ({
              value: day,
              label: formatDateKey(day),
            }))}
            selected={booking.date}
            onSelect={(value) =>
              value && booking.setDate(value)
            }
          />
        </View>

        <View>
          <Text style={styles.label}>Horário</Text>

          {booking.loadingSlots ? (
            <ActivityIndicator color="#2D6CDF" />
          ) : booking.slots.length === 0 ? (
            <Text style={styles.helper}>
              Nenhum horário livre nesta data.
            </Text>
          ) : (
            <ChipGroup
              options={booking.slots.map((value) => ({
                value,
                label: formatTime(value),
              }))}
              selected={booking.slot}
              onSelect={booking.setSlot}
            />
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resumo</Text>

          <Text style={styles.cardText}>
            {booking.service.name} para {pet?.name}
          </Text>

          <Text style={styles.cardPrice}>{price}</Text>

          <Text style={styles.helper}>
            Pagamento no atendimento, na loja.
          </Text>
        </View>

        {booking.errorMessage ? (
          <Text
            style={styles.errorText}
            accessibilityRole="alert"
          >
            {booking.errorMessage}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[
            styles.primaryButton,
            booking.submitting || !booking.slot
              ? styles.disabled
              : undefined,
          ]}
          activeOpacity={0.8}
          disabled={booking.submitting || !booking.slot}
          onPress={() => {
            void handleSubmit();
          }}
          accessibilityRole="button"
        >
          <Text style={styles.primaryButtonText}>
            {booking.submitting
              ? 'Agendando...'
              : 'Confirmar agendamento'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
