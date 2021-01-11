type IAdjustmentTypes = 'increment' | 'decrement';

export interface IQuickInventoryAdjustmentDTO {
  date: Date | string;
  type: IAdjustmentTypes;
  adjustmentAccountId: number;
  reason: string;
  description: string;
  referenceNo: string;
  itemId: number;
  quantity: number;
  cost: number;
  publish: boolean;
}

export interface IInventoryAdjustment {
  id?: number;
  date: Date | string;
  adjustmentAccountId: number;
  reason: string;
  description: string;
  referenceNo: string;
  inventoryDirection?: 'IN' | 'OUT';
  entries: IInventoryAdjustmentEntry[];
  userId: number;
  publishedAt?: Date|null;
}

export interface IInventoryAdjustmentEntry {
  id?: number;
  adjustmentId?: number;
  index: number;
  itemId: number;
  quantity?: number;
  cost?: number;
  value?: number;
}

export interface IInventoryAdjustmentsFilter {
  page: number;
  pageSize: number;
}
