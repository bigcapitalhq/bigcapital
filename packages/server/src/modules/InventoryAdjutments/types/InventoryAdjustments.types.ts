import { Knex } from 'knex';
import { InventoryAdjustment } from '../models/InventoryAdjustment';
import { CreateQuickInventoryAdjustmentDto } from '../dtos/CreateQuickInventoryAdjustment.dto';

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
export interface IInventoryAdjustmentsFilter {
  page: number;
  pageSize: number;
}

export interface IInventoryAdjustmentEventCreatedPayload {
  inventoryAdjustment: InventoryAdjustment;
  inventoryAdjustmentId: number;
  trx: Knex.Transaction;
}
export interface IInventoryAdjustmentCreatingPayload {
  quickAdjustmentDTO: CreateQuickInventoryAdjustmentDto;
  trx: Knex.Transaction;
}

export interface IInventoryAdjustmentEventPublishedPayload {
  inventoryAdjustmentId: number;
  inventoryAdjustment: InventoryAdjustment;
  trx: Knex.Transaction;
}

export interface IInventoryAdjustmentPublishingPayload {
  trx: Knex.Transaction;
  oldInventoryAdjustment: InventoryAdjustment;
}
export interface IInventoryAdjustmentEventDeletedPayload {
  inventoryAdjustmentId: number;
  oldInventoryAdjustment: InventoryAdjustment;
  trx: Knex.Transaction;
}

export interface IInventoryAdjustmentDeletingPayload {
  oldInventoryAdjustment: InventoryAdjustment;
  trx: Knex.Transaction;
}

export enum InventoryAdjustmentAction {
  CREATE = 'Create',
  EDIT = 'Edit',
  DELETE = 'Delete',
  VIEW = 'View',
}
