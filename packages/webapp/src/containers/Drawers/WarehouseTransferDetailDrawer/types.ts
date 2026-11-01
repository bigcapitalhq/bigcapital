import type { WarehouseTransfer } from '@bigcapital/sdk-ts';

export type WarehouseTransferDetailDrawerContextValue = {
  warehouseTransfer: WarehouseTransfer | undefined;
  warehouseTransferId: number | null | undefined;
};
