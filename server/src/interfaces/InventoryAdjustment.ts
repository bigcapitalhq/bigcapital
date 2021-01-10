
type IAdjustmentTypes = 'increment' | 'decrement' | 'value_adjustment';

export interface IQuickInventoryAdjustmentDTO {
  date: Date | string;
  type: IAdjustmentTypes,
  adjustmentAccountId: number;
  reason: string;
  description: string;
  referenceNo: string;
  itemId: number;
  quantity: number;
  cost: number;
};

export interface IInventoryAdjustment {
  id?: number,
  date: Date | string;
  adjustmentAccountId: number;
  reason: string;
  description: string;
  referenceNo: string;
  entries: IInventoryAdjustmentEntry[];
  userId: number;
};

export interface IInventoryAdjustmentEntry {
  id?: number,
  adjustmentId?: number,
  index: number,
  itemId: number;
  quantity?: number;
  cost?: number;
  value?: number;
};

export interface IInventoryAdjustmentsFilter{
  page: number,
  pageSize: number,
};