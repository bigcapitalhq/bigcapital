import { Knex } from 'knex';
import { IItem } from './Item';

type IAdjustmentTypes = 'increment' | 'decrement';

export interface IQuickInventoryAdjustmentDTO {
  date: Date;
  type: IAdjustmentTypes;
  adjustmentAccountId: number;
  reason: string;
  description: string;
  referenceNo: string;
  itemId: number;
  quantity: number;
  cost: number;
  publish: boolean;

  warehouseId?: number;
  branchId?: number;
}

export interface IInventoryAdjustment {
  id?: number;
  date: Date;
  adjustmentAccountId: number;
  reason: string;
  description: string;
  type: string;
  referenceNo: string;
  inventoryDirection?: 'IN' | 'OUT';
  entries: IInventoryAdjustmentEntry[];
  userId: number;
  publishedAt?: Date | null;
  createdAt?: Date;
  isPublished: boolean;

  branchId?: number;
  warehouseId?: number;
}

export interface IInventoryAdjustmentEntry {
  id?: number;
  adjustmentId?: number;
  index: number;
  itemId: number;
  quantity?: number;
  cost?: number;
  value?: number;

  item?: IItem;
}

export interface IInventoryAdjustmentsFilter {
  page: number;
  pageSize: number;
}

export interface IInventoryAdjustmentEventCreatedPayload {
  tenantId: number;
  inventoryAdjustment: IInventoryAdjustment;
  inventoryAdjustmentId: number;
  trx: Knex.Transaction;
}
export interface IInventoryAdjustmentCreatingPayload {
  tenantId: number;
  quickAdjustmentDTO: IQuickInventoryAdjustmentDTO;
  trx: Knex.Transaction;
}

export interface IInventoryAdjustmentEventPublishedPayload {
  tenantId: number;
  inventoryAdjustmentId: number;
  inventoryAdjustment: IInventoryAdjustment;
  trx: Knex.Transaction;
}

export interface IInventoryAdjustmentPublishingPayload {
  trx: Knex.Transaction;
  tenantId: number;
  oldInventoryAdjustment: IInventoryAdjustment;
}
export interface IInventoryAdjustmentEventDeletedPayload {
  tenantId: number;
  inventoryAdjustmentId: number;
  oldInventoryAdjustment: IInventoryAdjustment;
  trx: Knex.Transaction;
}

export interface IInventoryAdjustmentDeletingPayload {
  tenantId: number;
  oldInventoryAdjustment: IInventoryAdjustment;
  trx: Knex.Transaction;
}

export enum InventoryAdjustmentAction {
  CREATE = 'Create',
  EDIT = 'Edit',
  DELETE = 'Delete',
  VIEW = 'View',
}
