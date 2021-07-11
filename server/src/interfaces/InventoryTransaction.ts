export type TInventoryTransactionDirection = 'IN' | 'OUT';

export interface IInventoryTransaction {
  id?: number;
  date: Date | string;
  direction: TInventoryTransactionDirection;
  itemId: number;
  quantity: number;
  rate: number;
  transactionType: string;
  transcationTypeFormatted: string;
  transactionId: number;
  entryId: number;
  costAccountId: number;
  meta?: IInventoryTransactionMeta;
  costLotAggregated?: IInventoryCostLotAggregated;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IInventoryTransactionMeta {
  id?: number;
  transactionNumber: string;
  description: string;
}

export interface IInventoryCostLotAggregated {
  cost: number,
  quantity: number,
};

export interface IInventoryLotCost {
  id?: number;
  date: Date;
  direction: string;
  itemId: number;
  quantity: number;
  rate: number;
  remaining: number;
  cost: number;
  transactionType: string;
  transactionId: number;
  costAccountId: number;
  entryId: number;
  createdAt: Date;
}

export interface IItemsQuantityChanges {
  itemId: number;
  balanceChange: number;
}
