import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { appointmentService } from '../services/appointment.service';
import { petService } from '../services/pet.service';
import { serviceService } from '../services/service.service';

import type { Pet } from '../types/pet';
import type { Service } from '../types/service';

import { nextDays } from '../utils/date';
import { getApiErrorMessage } from '../utils/error';

export const bookingDays = nextDays(14);

export function useBooking(serviceId: string) {
  const [service, setService] = useState<Service | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [petId, setPetId] = useState<string | null>(null);
  const [date, setDate] = useState(bookingDays[0]);
  const [slots, setSlots] = useState<string[]>([]);
  const [slot, setSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      setLoading(true);

      Promise.all([
        serviceService.listActive(),
        petService.list(),
      ])
        .then(([services, ownPets]) => {
          setService(
            services.find((item) => item.id === serviceId) ??
              null,
          );

          setPets(ownPets);

          setPetId((current) =>
            ownPets.some((pet) => pet.id === current)
              ? current
              : (ownPets[0]?.id ?? null),
          );
        })
        .catch((error: unknown) => {
          setErrorMessage(
            getApiErrorMessage(
              error,
              'Não foi possível carregar os dados do agendamento.',
            ),
          );
        })
        .finally(() => setLoading(false));
    }, [serviceId]),
  );

  const loadSlots = useCallback(async (): Promise<void> => {
    try {
      setLoadingSlots(true);
      setSlot(null);
      setSlots(
        await appointmentService.availability(serviceId, date),
      );
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          'Não foi possível carregar os horários.',
        ),
      );
    } finally {
      setLoadingSlots(false);
    }
  }, [serviceId, date]);

  useEffect(() => {
    void loadSlots();
  }, [loadSlots]);

  async function submit(): Promise<boolean> {
    if (!petId || !slot) {
      setErrorMessage('Escolha o pet e o horário.');

      return false;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');

      await appointmentService.create({
        petId,
        serviceId,
        scheduledAt: slot,
      });

      return true;
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          'Não foi possível concluir o agendamento.',
        ),
      );

      void loadSlots();

      return false;
    } finally {
      setSubmitting(false);
    }
  }

  return {
    service,
    pets,
    petId,
    date,
    slots,
    slot,
    loading,
    loadingSlots,
    submitting,
    errorMessage,
    setPetId,
    setDate,
    setSlot,
    submit,
  };
}
