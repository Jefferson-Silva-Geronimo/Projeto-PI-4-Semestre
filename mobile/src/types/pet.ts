import type { Species } from './product';

export type PetSize = 'P' | 'M' | 'G';

export const sizeOptions: Array<{
  value: PetSize;
  label: string;
}> = [
  { value: 'P', label: 'Pequeno' },
  { value: 'M', label: 'Médio' },
  { value: 'G', label: 'Grande' },
];

export function getSizeLabel(size: PetSize): string {
  return (
    sizeOptions.find(
      (option) => option.value === size,
    )?.label ?? size
  );
}

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string | null;
  size: PetSize;
  birthDate: string | null;
  weightKg: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PetDTO {
  name: string;
  species: Species;
  breed: string | null;
  size: PetSize;
  birthDate: string | null;
  weightKg: number | null;
  notes: string | null;
}
