// Query key constants
export const INVENTORY_ADJUSTMENTS = 'INVENTORY_ADJUSTMENTS';
export const INVENTORY_ADJUSTMENT = 'INVENTORY_ADJUSTMENT';

// Query key factory
export const inventoryAdjustmentsKeys = {
  all: () => [INVENTORY_ADJUSTMENTS] as const,
  list: (query?: Record<string, unknown>) =>
    [INVENTORY_ADJUSTMENTS, query] as const,
  detail: (id: number | null | undefined) =>
    [INVENTORY_ADJUSTMENT, id] as const,
};

// Grouped object for use in components/hooks
export const InventoryAdjustmentsQueryKeys = {
  INVENTORY_ADJUSTMENTS,
  INVENTORY_ADJUSTMENT,
} as const;
