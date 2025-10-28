import { Knex } from 'knex';
import { InventoryTransaction } from '../models/InventoryTransaction';

export const ComputeItemCostQueue = 'ComputeItemCostQueue';
export const ComputeItemCostQueueJob = 'ComputeItemCostQueueJob';

export const WriteInventoryTransactionsGLEntriesQueue =
  'WriteInventoryTransactionsGLEntriesQueue';
export const WriteInventoryTransactionsGLEntriesQueueJob =
  'WriteInventoryTransactionsGLEntriesQueueJob';

export interface IInventoryItemCostMeta {
  itemId: number;
  valuation: number;
  quantity: number;
  average: number;
}

export interface IInventoryCostLotsGLEntriesWriteEvent {
  startingDate: Date;
  trx: Knex.Transaction;
}

export type TInventoryTransactionDirection = 'IN' | 'OUT';

export type TCostMethod = 'FIFO' | 'LIFO' | 'AVG';

export interface IInventoryTransactionMeta {
  id?: number;
  transactionNumber: string;
  description: string;
}

export interface IInventoryCostLotAggregated {
  cost: number;
  quantity: number;
}

export interface IItemsQuantityChanges {
  itemId: number;
  balanceChange: number;
}

export interface IInventoryTransactionsCreatedPayload {
  inventoryTransactions: InventoryTransaction[];
  trx: Knex.Transaction;
}

export interface IInventoryTransactionsDeletedPayload {
  oldInventoryTransactions: InventoryTransaction[];
  transactionId: number;
  transactionType: string;
  trx: Knex.Transaction;
}

export interface IInventoryItemCostScheduledPayload {
  startingDate: Date | string;
  itemId: number;
}

export interface IComputeItemCostJobStartedPayload {
  startingDate: Date | string;
  itemId: number;
}
export interface IComputeItemCostJobCompletedPayload {
  startingDate: Date | string;
  itemId: number;
}
