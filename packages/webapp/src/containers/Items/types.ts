/**
 * Shared form values shape for the Item form.
 * Field names mirror the SDK `CreateItemBody` / `EditItemBody` (camelCase).
 */
export interface ItemFormValues {
  active: boolean;
  name: string;
  type: ItemFormType;
  code: string;
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
}

export type ItemFormType = 'service' | 'non-inventory' | 'inventory';

export type ItemFormSubmitPayload = {
  redirect?: boolean;
};
