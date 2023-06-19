import { Knex } from 'knex';
import { IItem } from './Item';
import { ISaleInvoice } from './SaleInvoice';
import { ISaleReceipt } from './SaleReceipt';

export type TInventoryTransactionDirection = 'IN' | 'OUT';

export interface IInventoryTransaction {
  id?: number;
  date: Date | string;
  direction: TInventoryTransactionDirection;
  itemId: number;
  quantity: number | null;
  rate: number;
  transactionType: string;
  transactionTypeFormatted?: string;
  transactionId: number;
  costAccountId?: number;
  entryId: number;
  meta?: IInventoryTransactionMeta;
  costLotAggregated?: IInventoryCostLotAggregated;
  createdAt?: Date;
  updatedAt?: Date;
  warehouseId?: number;
}

export interface IInventoryTransactionMeta {
  id?: number;
  transactionNumber: string;
  description: string;
}

export interface IInventoryCostLotAggregated {
  cost: number;
  quantity: number;
}

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

  exchangeRate: number;
  currencyCode: string;
  item?: IItem;

  invoice?: ISaleInvoice;
  receipt?: ISaleReceipt;
}

export interface IItemsQuantityChanges {
  itemId: number;
  balanceChange: number;
}

export interface IInventoryTransactionsCreatedPayload {
  tenantId: number;
  inventoryTransactions: IInventoryTransaction[];
  trx: Knex.Transaction;
}

export interface IInventoryTransactionsDeletedPayload {
  tenantId: number;
  oldInventoryTransactions: IInventoryTransaction[];
  transactionId: number;
  transactionType: string;
  trx: Knex.Transaction;
}

export interface IInventoryItemCostScheduledPayload {
  startingDate: Date | string;
  itemId: number;
  tenantId: number;
}

export interface IComputeItemCostJobStartedPayload {
  startingDate: Date | string;
  itemId: number;
  tenantId: number;
}
export interface IComputeItemCostJobCompletedPayload {
  startingDate: Date | string;
  itemId: number;
  tenantId: number;
}
