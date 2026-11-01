// Query key constants
export const WAREHOUSES = 'WAREHOUSES';
export const WAREHOUSE = 'WAREHOUSE';

// Query key factory
export const warehousesKeys = {
  all: () => [WAREHOUSES] as const,
  list: (query?: Record<string, unknown>) => [WAREHOUSES, query] as const,
  detail: (id: number | string | null | undefined) => [WAREHOUSE, id] as const,
};

// Grouped object for use in components/hooks
export const WarehousesQueryKeys = {
  WAREHOUSES,
  WAREHOUSE,
} as const;
