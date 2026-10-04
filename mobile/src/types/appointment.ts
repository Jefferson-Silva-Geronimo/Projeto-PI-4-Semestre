import type { PetSize } from './pet';
import type { Species } from './product';

export type AppointmentStatus =
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED';

export const appointmentStatusLabels: Record<
  AppointmentStatus,
  string
> = {
  SCHEDULED: 'Agendado',
  CONFIRMED: 'Confirmado',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
};

export interface Appointment {
  id: string;
  scheduledAt: string;
  durationMinutes: number;
  priceInCents: number;
  status: AppointmentStatus;
  pet: {
    id: string;
    name: string;
    species: Species;
    breed: string | null;
    size: PetSize;
  };
  service: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateAppointmentDTO {
  petId: string;
  serviceId: string;
  scheduledAt: string;
}
