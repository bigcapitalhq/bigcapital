import type { Account, Branch, Item, Warehouse } from '@bigcapital/sdk-ts';
import type { CreateQuickInventoryAdjustmentBody } from '@bigcapital/sdk-ts';

export interface InventoryAdjustmentFormValues {
  date: string;
  type: 'increment' | 'decrement';
  adjustmentAccountId: string | number;
  itemId: string | number;
  reason: string;
  cost: string | number;
  quantity: string | number;
  referenceNo: string;
  quantityOnHand: string | number;
  newQuantity?: string | number;
  publish: boolean;
  branchId: string | number;
  warehouseId: string | number;
}

export type InventoryAdjustmentDialogPayload = {
  action?: string;
  itemId?: number | null;
};

export type SubmitPayload = {
  publish?: boolean;
};

export type InventoryAdjustmentContextValue = {
  item: Item | undefined;
  itemId: number | null | undefined;
  branches: Branch[];
  warehouses: Warehouse[];
  accounts: Account[];
  dialogName: string;
  submitPayload: SubmitPayload;
  isBranchesSuccess: boolean;
  isWarehousesSuccess: boolean;
  isAccountsLoading: boolean;
  isItemLoading: boolean;
  isFeatureLoading: boolean;
  isWarehouesLoading: boolean;
  isBranchesLoading: boolean;
  createInventoryAdjMutate: (
    values: CreateQuickInventoryAdjustmentBody,
  ) => Promise<unknown>;
  setSubmitPayload: (payload: SubmitPayload) => void;
};
