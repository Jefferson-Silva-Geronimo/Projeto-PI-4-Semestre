import { api } from './api';

import type {
  Service,
  ServiceDTO,
} from '../types/service';

export const serviceService = {
  async listActive(): Promise<Service[]> {
    const response = await api.get<Service[]>(
      '/services',
    );

    return response.data;
  },

  async listAll(): Promise<Service[]> {
    const response = await api.get<Service[]>(
      '/services/admin',
    );

    return response.data;
  },

  async findByIdForAdmin(
    serviceId: string,
  ): Promise<Service> {
    const response = await api.get<Service>(
      `/services/admin/${serviceId}`,
    );

    return response.data;
  },

  async create(data: ServiceDTO): Promise<Service> {
    const response = await api.post<Service>(
      '/services',
      data,
    );

    return response.data;
  },

  async update(
    serviceId: string,
    data: ServiceDTO,
  ): Promise<Service> {
    const response = await api.patch<Service>(
      `/services/${serviceId}`,
      data,
    );

    return response.data;
  },

  async updateStatus(
    serviceId: string,
    active: boolean,
  ): Promise<Service> {
    const response = await api.patch<Service>(
      `/services/${serviceId}/status`,
      { active },
    );

    return response.data;
  },

  async remove(serviceId: string): Promise<void> {
    await api.delete(`/services/${serviceId}`);
  },
};
