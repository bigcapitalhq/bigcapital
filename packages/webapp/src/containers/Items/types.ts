/**
 * Shared form values shape for the Item form.
 * Field names mirror the SDK `CreateItemBody` / `EditItemBody` (camelCase).
 */
/**
 * Pending image files selected in the item form.
 * Existing item images are loaded from the item query.
 */
export interface ItemImageFiles {
  front: File | null;
  rear: File | null;
  other: File[];
}

export interface ItemFormValues {
  active: boolean;
  name: string;
  type: ItemFormType;
  code: string;
  reorderPoint: string | number;
  unit: string;
  costPrice: string | number;
  sellPrice: string | number;
  costAccountId: number | string;
  sellAccountId: number | string;
  sellTaxRateId: number | string;
  inventoryAccountId: number | string;
  categoryId: number | string;
  sellable: boolean;
  purchasable: boolean;
  sellDescription: string;
  purchaseDescription: string;
  purchaseTaxRateId: number | string;
  imageFiles: ItemImageFiles;
  removedImageIds: number[];
}

export type ItemFormType = 'service' | 'non-inventory' | 'inventory';

export type ItemFormSubmitPayload = {
  redirect?: boolean;
};
