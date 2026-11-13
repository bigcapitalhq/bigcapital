import type { Knex } from 'knex';
import type { Batch } from '../models/Batch';
import type { CreateBatchDto } from '../dtos/CreateBatch.dto';
import type { EditBatchDto } from '../dtos/EditBatch.dto';

export enum BatchStatus {
  Active = 'active',
  ExpiringSoon = 'expiring_soon',
  Expired = 'expired',
  Depleted = 'depleted',
}

export const BATCH_STATUSES = [
  BatchStatus.Active,
  BatchStatus.ExpiringSoon,
  BatchStatus.Expired,
  BatchStatus.Depleted,
];

/**
 * The number of days before the expiry date a batch is considered
 * "expiring soon".
 */
export const BATCH_EXPIRING_SOON_DAYS = 30;

export const BATCHES_ERRORS = {
  BATCH_NOT_FOUND: 'BATCH_NOT_FOUND',
  BATCH_NUMBER_EXISTS: 'BATCH_NUMBER_EXISTS',
  BATCH_ITEM_NOT_FOUND: 'BATCH_ITEM_NOT_FOUND',
  BATCH_ITEM_NOT_INVENTORY: 'BATCH_ITEM_NOT_INVENTORY',
  BATCH_ITEM_MISMATCH: 'BATCH_ITEM_MISMATCH',
  BATCH_INSUFFICIENT_QUANTITY: 'BATCH_INSUFFICIENT_QUANTITY',
  BATCH_HAS_ASSOCIATED_TRANSACTIONS: 'BATCH_HAS_ASSOCIATED_TRANSACTIONS',
  BATCH_INVALID_EXPIRY_DATE: 'BATCH_INVALID_EXPIRY_DATE',
  BATCH_QUANTITY_INVALID: 'BATCH_QUANTITY_INVALID',
  BATCH_ALLOCATION_QUANTITY_MISMATCH: 'BATCH_ALLOCATION_QUANTITY_MISMATCH',
  BATCH_ALLOCATION_INVALID_QUANTITY: 'BATCH_ALLOCATION_INVALID_QUANTITY',
  BATCH_ALLOCATION_DUPLICATE: 'BATCH_ALLOCATION_DUPLICATE',
};

export interface IBatchBalance {
  quantityIn: number;
  quantityOut: number;
  quantityOnHand: number;
}

export interface IBatchWithBalance extends IBatchBalance {
  id: number;
  itemId: number;
  batchNumber: string;
  batchRef?: string | null;
  manufacturedDate?: string | Date | null;
  expiryDate?: string | Date | null;
  quantity: number;
  status: BatchStatus;
  createdAt?: Date;
  updatedAt?: Date;
  item?: {
    id: number;
    name: string;
    code?: string | null;
    type?: string;
  };
}

export interface IGetBatchesFilter {
  itemId?: number;
  itemsIds?: number[];
  search?: string;
  status?: BatchStatus;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}

export interface IBatchCreatingPayload {
  batchDTO: CreateBatchDto;
  trx: Knex.Transaction;
}

export interface IBatchCreatedPayload {
  batch: Batch;
  batchId: number;
  batchDTO: CreateBatchDto;
  trx: Knex.Transaction;
}

export interface IBatchEditingPayload {
  batchId: number;
  batchDTO: EditBatchDto;
  oldBatch: Batch;
  trx: Knex.Transaction;
}

export interface IBatchEditedPayload {
  batch: Batch;
  batchId: number;
  batchDTO: EditBatchDto;
  oldBatch: Batch;
  trx: Knex.Transaction;
}

export interface IBatchDeletingPayload {
  batchId: number;
  oldBatch: Batch;
  trx: Knex.Transaction;
}

export interface IBatchDeletedPayload {
  batchId: number;
  oldBatch: Batch;
  trx: Knex.Transaction;
}
