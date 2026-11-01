// Query key constants
import { ITEM_WAREHOUSES_LOCATION } from '../items/query-keys';
export { ITEM_WAREHOUSES_LOCATION } from '../items/query-keys';
export const WAREHOUSE_TRANSFERS = 'WAREHOUSE_TRANSFERS';
export const WAREHOUSE_TRANSFER = 'WAREHOUSE_TRANSFER';

// Query key factory
export const warehousesTransfersKeys = {
  all: () => [WAREHOUSE_TRANSFERS] as const,
  list: (query?: Record<string, unknown>) =>
    [WAREHOUSE_TRANSFERS, query] as const,
  detail: (id: number | null | undefined) => [WAREHOUSE_TRANSFER, id] as const,
};

// Grouped object for use in components/hooks
export const WarehousesTransfersQueryKeys = {
  WAREHOUSE_TRANSFERS,
  WAREHOUSE_TRANSFER,
  ITEM_WAREHOUSES_LOCATION,
} as const;
