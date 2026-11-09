// Query key constants
export const ITEMS = 'ITEMS';
export const ITEM = 'ITEM';
export const ITEMS_CATEGORIES = 'ITEMS_CATEGORIES';
export const ITEM_CATEGORY = 'ITEM_CATEGORY';
export const ITEM_ASSOCIATED_WITH_INVOICES = 'ITEM_ASSOCIATED_WITH_INVOICES';
export const ITEM_ASSOCIATED_WITH_ESTIMATES = 'ITEM_ASSOCIATED_WITH_ESTIMATES';
export const ITEM_ASSOCIATED_WITH_RECEIPTS = 'ITEM_ASSOCIATED_WITH_RECEIPTS';
export const ITEMS_ASSOCIATED_WITH_BILLS = 'ITEMS_ASSOCIATED_WITH_BILLS';
export const ITEM_WAREHOUSES_LOCATION = 'ITEM_WAREHOUSES_LOCATION';
export const ITEM_INVENTORY_COST = 'ITEM_INVENTORY_COST';

// Query key factory
export const itemsKeys = {
  all: () => [ITEMS] as const,
  list: (query?: Record<string, unknown>) => [ITEMS, query] as const,
  detail: (id: number | null | undefined) => [ITEM, id] as const,
  categories: () => [ITEMS_CATEGORIES] as const,
  category: (id: number | null | undefined) => [ITEM_CATEGORY, id] as const,
  associatedInvoices: (id: number | null | undefined) =>
    [ITEM_ASSOCIATED_WITH_INVOICES, id] as const,
  associatedEstimates: (id: number | null | undefined) =>
    [ITEM_ASSOCIATED_WITH_ESTIMATES, id] as const,
  associatedReceipts: (id: number | null | undefined) =>
    [ITEM_ASSOCIATED_WITH_RECEIPTS, id] as const,
  associatedBills: (id: number | null | undefined) =>
    [ITEMS_ASSOCIATED_WITH_BILLS, id] as const,
  warehousesLocation: (id: number | null | undefined) =>
    [ITEM_WAREHOUSES_LOCATION, id] as const,
  inventoryCost: (query?: Record<string, unknown>) =>
    [ITEM_INVENTORY_COST, query] as const,
};

// Grouped object for use in components/hooks
export const ItemsQueryKeys = {
  ITEMS,
  ITEM,
  ITEMS_CATEGORIES,
  ITEM_CATEGORY,
  ITEM_ASSOCIATED_WITH_INVOICES,
  ITEM_ASSOCIATED_WITH_ESTIMATES,
  ITEM_ASSOCIATED_WITH_RECEIPTS,
  ITEMS_ASSOCIATED_WITH_BILLS,
  ITEM_WAREHOUSES_LOCATION,
  ITEM_INVENTORY_COST,
} as const;
