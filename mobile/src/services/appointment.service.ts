import { api } from './api';

import type {
  Appointment,
  AppointmentStatus,
  CreateAppointmentDTO,
} from '../types/appointment';

export const appointmentService = {
  async availability(
    serviceId: string,
    date: string,
  ): Promise<string[]> {
    const response = await api.get<{
      slots: string[];
    }>('/appointments/availability', {
      params: { serviceId, date },
    });

    return response.data.slots;
  },

  async create(
    data: CreateAppointmentDTO,
  ): Promise<Appointment> {
    const response = await api.post<Appointment>(
      '/appointments',
      data,
    );

    return response.data;
  },

  async list(): Promise<Appointment[]> {
    const response = await api.get<Appointment[]>(
      '/appointments',
    );

    return response.data;
  },

  async cancel(
    appointmentId: string,
  ): Promise<Appointment> {
    const response = await api.patch<Appointment>(
      `/appointments/${appointmentId}/cancel`,
    );

    return response.data;
  },

  async listAgenda(
    date: string,
  ): Promise<Appointment[]> {
    const response = await api.get<Appointment[]>(
      '/appointments/admin',
      { params: { date } },
    );

    return response.data;
  },

  async updateStatus(
    appointmentId: string,
    status: AppointmentStatus,
  ): Promise<Appointment> {
    const response = await api.patch<Appointment>(
      `/appointments/${appointmentId}/status`,
      { status },
    );

    return response.data;
  },
};
