import type { PetSize } from './pet';

export interface Service {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  priceSmallInCents: number;
  priceMediumInCents: number;
  priceLargeInCents: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceDTO {
  name: string;
  description: string;
  durationMinutes: number;
  priceSmallInCents: number;
  priceMediumInCents: number;
  priceLargeInCents: number;
}

export function getServicePrice(
  service: Service,
  size: PetSize,
): number {
  if (size === 'P') {
    return service.priceSmallInCents;
  }

  if (size === 'M') {
    return service.priceMediumInCents;
  }

  return service.priceLargeInCents;
}
