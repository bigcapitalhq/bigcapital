import type React from 'react';
import type {
  CreateWarehouseTransferBody,
  EditWarehouseTransferBody,
  Item,
  Warehouse,
  WarehouseTransfer,
} from '@bigcapital/sdk-ts';

export interface WarehouseTransferEntry {
  index: number;
  itemId: number | string;
  sourceWarehouse: number | string;
  destinationWarehouse: number | string;
  description: string;
  quantity: number | string;
  cost?: number;
  warehouses?: WarehouseTransferEntryWarehouse[];
}

export interface WarehouseTransferEntryWarehouse {
  warehouseId: number;
  quantityOnHand: number;
  quantityOnHandFormatted: string;
}

export interface WarehouseTransferFormValues {
  date: string;
  transactionNumber: string;
  fromWarehouseId: number | string;
  toWarehouseId: number | string;
  reason: string;
  transferInitiated: string | boolean;
  transferDelivered: string | boolean;
  entries: WarehouseTransferEntry[];
}

export interface WarehouseTransferItemCostQuery {
  date: string;
  itemsIds: number[];
}

export interface WarehouseTransferSubmitPayload {
  redirect?: boolean;
  initiate?: boolean;
  deliver?: boolean;
  resetForm?: boolean;
}

export interface WarehouseTransferFormContextValue {
  items: Item[];
  warehouses: Warehouse[] | undefined;
  warehouseTransfer: WarehouseTransfer | undefined;

  isItemsFetching: boolean;
  isWarehouesFetching: boolean;

  isNewMode: boolean;
  submitPayload: WarehouseTransferSubmitPayload | undefined;
  setSubmitPayload: React.Dispatch<
    React.SetStateAction<WarehouseTransferSubmitPayload | undefined>
  >;

  createWarehouseTransferMutate: (
    values: CreateWarehouseTransferBody,
  ) => Promise<void>;
  editWarehouseTransferMutate: (
    args: [number, EditWarehouseTransferBody],
  ) => Promise<void>;

  inventoryItemsCost: unknown;
  isItemsCostLoading: boolean;
  isItemsCostFetching: boolean;
  isItemsCostSuccess: boolean;
  itemCostQuery: WarehouseTransferItemCostQuery | null;
  setItemCostQuery: React.Dispatch<
    React.SetStateAction<WarehouseTransferItemCostQuery | null>
  >;

  warehouseTransferSettings:
    | import('@bigcapital/sdk-ts').SettingsGroup
    | undefined;
}
