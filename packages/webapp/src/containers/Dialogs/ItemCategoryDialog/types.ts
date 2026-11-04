import type {
  CreateItemCategoryBody,
  EditItemCategoryBody,
  ItemCategory,
} from '@bigcapital/sdk-ts';

export const ITEM_COST_METHODS = ['AVG', 'FIFO', 'LIFO'] as const;

export type ItemCostMethod = (typeof ITEM_COST_METHODS)[number];

export const DEFAULT_ITEM_COST_METHOD: ItemCostMethod = 'AVG';

export function normalizeItemCostMethod(value?: string | null): ItemCostMethod {
  const normalizedValue = String(value ?? '')
    .trim()
    .toUpperCase();

  return (ITEM_COST_METHODS as readonly string[]).includes(normalizedValue)
    ? (normalizedValue as ItemCostMethod)
    : DEFAULT_ITEM_COST_METHOD;
}

export interface ItemCategoryFormValues {
  name: string;
  description: string;
  // The SDK body requires these but the form has no UI for them — kept as
  // empty defaults to satisfy the type. The transformFormToRequest helper
  // coerces them to the SDK body shape at submit time.
  costAccountId: string | number;
  sellAccountId: string | number;
  inventoryAccountId: string | number;
  costMethod: ItemCostMethod;
}

export type ItemCategoryDialogPayload = {
  action?: 'edit' | 'new' | string;
  id?: number | null;
};

export type ItemCategoryContextValue = {
  itemCategoryId: number | null | undefined;
  dialogName: string;
  itemCategory: ItemCategory | undefined;
  isItemCategoryLoading: boolean;
  createItemCategoryMutate: (
    values: CreateItemCategoryBody,
  ) => Promise<unknown>;
  editItemCategoryMutate: (
    vars: [number, EditItemCategoryBody],
  ) => Promise<unknown>;
  isNewMode: boolean;
  isEditMode: boolean;
};
