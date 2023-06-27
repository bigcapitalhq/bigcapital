import { Knex } from 'knex';

export interface IWarehouse {
  id?: number;
}
export interface IWarehouseTransfer {
  id?: number;
  date: Date;
  fromWarehouseId: number;
  toWarehouseId: number;
  reason?: string;
  transactionNumber: string;
  entries: IWarehouseTransferEntry[];
  transferInitiatedAt?: Date;
  transferDeliveredAt?: Date;

  isInitiated?: boolean;
  isTransferred?: boolean; 
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
  tenantId: number;
  warehouseId: number;
  trx: Knex.Transaction;
}
export interface IWarehouseDeletedPayload {
  tenantId: number;
  warehouseId: number;
  trx: Knex.Transaction;
}
export interface IWarehouseCreatePayload {
  tenantId: number;
  warehouseDTO: ICreateWarehouseDTO;
  trx: Knex.Transaction;
}

export interface IWarehouseCreatedPayload {
  tenantId: number;
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
  trx: Knex.Transaction;
  warehouseTransfer: IWarehouseTransfer;
  warehouseTransferDTO: ICreateWarehouseTransferDTO;
  tenantId: number;
}

export interface IWarehouseTransferEditPayload {
  tenantId: number;
  editWarehouseDTO: IEditWarehouseTransferDTO;
  oldWarehouseTransfer: IWarehouseTransfer;
  trx: Knex.Transaction;
}

export interface IWarehouseTransferEditedPayload {
  tenantId: number;
  editWarehouseDTO: IEditWarehouseTransferDTO;
  oldWarehouseTransfer: IWarehouseTransfer;
  warehouseTransfer: IWarehouseTransfer;
  trx: Knex.Transaction;
}

export interface IWarehouseTransferDeletePayload {
  tenantId: number;
  oldWarehouseTransfer: IWarehouseTransfer;
  trx: Knex.Transaction;
}

export interface IWarehouseTransferDeletedPayload {
  tenantId: number;
  warehouseTransfer: IWarehouseTransfer;
  oldWarehouseTransfer: IWarehouseTransfer;
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
  tenantId: number;
}
export interface IWarehousesActivatedPayload {
  tenantId: number;
  primaryWarehouse: IWarehouse;
}

export interface IWarehouseMarkAsPrimaryPayload {
  tenantId: number;
  oldWarehouse: IWarehouse;
  trx: Knex.Transaction;
}
export interface IWarehouseMarkedAsPrimaryPayload {
  tenantId: number;
  oldWarehouse: IWarehouse;
  markedWarehouse: IWarehouse;
  trx: Knex.Transaction;
}

export interface IWarehouseTransferInitiatePayload {
  tenantId: number;
  oldWarehouseTransfer: IWarehouseTransfer;
  trx: Knex.Transaction;
}


export interface IWarehouseTransferInitiatedPayload {
  tenantId: number;
  warehouseTransfer: IWarehouseTransfer;
  oldWarehouseTransfer: IWarehouseTransfer;
  trx: Knex.Transaction;
}

export interface IWarehouseTransferTransferringPayload {
  tenantId: number;
  oldWarehouseTransfer: IWarehouseTransfer;
  trx: Knex.Transaction;
}

export interface IWarehouseTransferTransferredPayload {
  tenantId: number;
  warehouseTransfer: IWarehouseTransfer;
  oldWarehouseTransfer: IWarehouseTransfer;
  trx: Knex.Transaction;
}
