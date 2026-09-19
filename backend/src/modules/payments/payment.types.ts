export interface CreatePreferenceItemDTO {
  productId: string;
  quantity: number;
}

export interface CreatePreferenceDTO {
  items: CreatePreferenceItemDTO[];
}
