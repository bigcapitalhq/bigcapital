import { Knex } from 'knex';
import { Warehouse } from './models/Warehouse.model';
import { WarehouseTransfer } from '../WarehousesTransfers/models/WarehouseTransfer';
import { ModelObject } from 'objection';

export interface IWarehouse {
  id?: number;
}

export interface IWarehouseTransferEntry {
  id?: number;
  index?: number;
  itemId: number;
  description: string;
  quantity: number;
  cost: number;
}
export interface ICreateWarehouseDTO {
  name: string;
  code: string;

  city?: string;
  country?: string;
  address?: string;

  primary?: boolean;
}
export interface IEditWarehouseDTO {
  name: string;
  code: string;
  city: string;
  country: string;
  address: string;
}

export interface IWarehouseTransferEntryDTO {
  index?: number;
  itemId: number;
  description: string;
  quantity: number;
  cost?: number;
}

export interface ICreateWarehouseTransferDTO {
  fromWarehouseId: number;
  toWarehouseId: number;
  transactionNumber: string;
  date: Date;
  transferInitiated: boolean;
  transferDelivered: boolean;
  entries: IWarehouseTransferEntryDTO[];
}
export interface IEditWarehouseTransferDTO {
  fromWarehouseId: number;
  toWarehouseId: number;
  transactionNumber: string;
  date: Date;
  entries: {
    id?: number;
    itemId: number;
    description: string;
    quantity: number;
  }[];
}

export interface IWarehouseEditPayload {
  tenantId: number;
  warehouseId: number;
  warehouseDTO: IEditWarehouseDTO;
  trx: Knex.Transaction;
}

export interface IWarehouseEditedPayload {
  tenantId: number;
  warehouse: IWarehouse;
  warehouseDTO: IEditWarehouseDTO;
  trx: Knex.Transaction;
}

export interface IWarehouseDeletePayload {
  // tenantId: number;
  warehouseId: number;
  trx: Knex.Transaction;
}
export interface IWarehouseDeletedPayload {
  tenantId: number;
  warehouseId: number;
  trx: Knex.Transaction;
}
export interface IWarehouseCreatePayload {
  warehouseDTO: ICreateWarehouseDTO;
  trx: Knex.Transaction;
}

export interface IWarehouseCreatedPayload {
  warehouse: IWarehouse;
  warehouseDTO: ICreateWarehouseDTO;
  trx: Knex.Transaction;
}

export interface IWarehouseTransferCreate {
  trx: Knex.Transaction;
  warehouseTransferDTO: ICreateWarehouseTransferDTO;
  tenantId: number;
}

export interface IWarehouseTransferCreated {
  trx?: Knex.Transaction;
  warehouseTransfer: ModelObject<WarehouseTransfer>;
  warehouseTransferDTO: ICreateWarehouseTransferDTO;
}

export interface IWarehouseTransferEditPayload {
  editWarehouseDTO: IEditWarehouseTransferDTO;
  oldWarehouseTransfer: ModelObject<WarehouseTransfer>;
  trx: Knex.Transaction;
}

export interface IWarehouseTransferEditedPayload {
  editWarehouseDTO: IEditWarehouseTransferDTO;
  oldWarehouseTransfer: ModelObject<WarehouseTransfer>;
  warehouseTransfer: ModelObject<WarehouseTransfer>;
  trx: Knex.Transaction;
}

export interface IWarehouseTransferDeletePayload {
  oldWarehouseTransfer: ModelObject<WarehouseTransfer>;
  trx: Knex.Transaction;
}

export interface IWarehouseTransferDeletedPayload {
  oldWarehouseTransfer: ModelObject<WarehouseTransfer>;
  trx: Knex.Transaction;
}

export interface IGetWarehousesTransfersFilterDTO {
  page: number;
  pageSize: number;
  searchKeyword: string;
}

export interface IItemWarehouseQuantityChange {
  itemId: number;
  warehouseId: number;
  amount: number;
}

export interface IWarehousesActivatePayload {
  // tenantId: number;
}
export interface IWarehousesActivatedPayload {
  // tenantId: number;
  primaryWarehouse: Warehouse;
}

export interface IWarehouseMarkAsPrimaryPayload {
  oldWarehouse: Warehouse;
  trx: Knex.Transaction;
}
export interface IWarehouseMarkedAsPrimaryPayload {
  oldWarehouse: Warehouse;
  markedWarehouse: Warehouse;
  trx: Knex.Transaction;
}

export interface IWarehouseTransferInitiatePayload {
  oldWarehouseTransfer: ModelObject<WarehouseTransfer>;
  trx: Knex.Transaction;
}

export interface IWarehouseTransferInitiatedPayload {
  warehouseTransfer: ModelObject<WarehouseTransfer>;
  oldWarehouseTransfer: ModelObject<WarehouseTransfer>;
  trx: Knex.Transaction;
}

export interface IWarehouseTransferTransferingPayload {
  oldWarehouseTransfer: ModelObject<WarehouseTransfer>;
  trx: Knex.Transaction;
}

export interface IWarehouseTransferTransferredPayload {
  warehouseTransfer: ModelObject<WarehouseTransfer>;
  oldWarehouseTransfer: ModelObject<WarehouseTransfer>;
  trx: Knex.Transaction;
}
