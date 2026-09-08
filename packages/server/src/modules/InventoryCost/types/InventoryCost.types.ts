import { Knex } from 'knex';
import { InventoryTransaction } from '../models/InventoryTransaction';
import { IItemEntryTransactionType } from '../../TransactionItemEntry/ItemEntry.types';

export interface IInventoryTransactionItemEntry {
  id?: number;
  itemId: number;
  quantity: number;
  rate: number;
  costAccountId?: number;
  warehouseId?: number;
  description?: string;
}

export interface IInventoryTransactionFromItemsEntries {
  transactionId: number;
  transactionType: IItemEntryTransactionType;
  transactionNumber?: string;
  exchangeRate: number;
  date: Date | string;
  direction: TInventoryTransactionDirection;
  entries: IInventoryTransactionItemEntry[];
  createdAt: Date;
  warehouseId?: number;
}

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

export interface IInventoryTransaction {
  itemId: number;
  quantity: number | null;
  rate: number;
  transactionType: IItemEntryTransactionType;
  transactionId: number;
  direction: TInventoryTransactionDirection;
  date: Date | string;
  entryId: number;
  costAccountId?: number;
  createdAt: Date;
  warehouseId?: number | null;
  meta: IInventoryTransactionMeta;
}

export interface IInventoryTransactionRecord {
  date?: Date | string;
  direction?: TInventoryTransactionDirection;
  itemId?: number;
  quantity?: number | null;
  rate?: number;
  transactionType?: string;
  transactionId?: number;
  costAccountId?: number;
  entryId?: number;
  createdAt?: Date;
  warehouseId?: number;
  meta?: IInventoryTransactionMeta;
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
