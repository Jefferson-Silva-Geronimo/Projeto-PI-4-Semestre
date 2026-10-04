import { api } from './api';

import type { Pet, PetDTO } from '../types/pet';

export const petService = {
  async list(): Promise<Pet[]> {
    const response = await api.get<Pet[]>('/pets');

    return response.data;
  },

  async findById(petId: string): Promise<Pet> {
    const response = await api.get<Pet>(
      `/pets/${petId}`,
    );

    return response.data;
  },

  async create(data: PetDTO): Promise<Pet> {
    const response = await api.post<Pet>(
      '/pets',
      data,
    );

    return response.data;
  },

  async update(
    petId: string,
    data: PetDTO,
  ): Promise<Pet> {
    const response = await api.patch<Pet>(
      `/pets/${petId}`,
      data,
    );

    return response.data;
  },

  async remove(petId: string): Promise<void> {
    await api.delete(`/pets/${petId}`);
  },
};
