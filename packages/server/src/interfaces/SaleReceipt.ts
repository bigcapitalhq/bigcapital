import { Knex } from 'knex';
import { IItemEntry } from './ItemEntry';

export interface ISaleReceipt {
  id?: number;
  customerId: number;
  depositAccountId: number;
  receiptDate: Date;
  sendToEmail: string;
  referenceNo: string;
  receiptMessage: string;
  receiptNumber: string;
  amount: number;
  currencyCode: string;
  exchangeRate: number;
  statement: string;
  closedAt: Date | string;

  createdAt: Date;
  updatedAt: Date;
  userId: number;

  branchId?: number;
  warehouseId?: number;

  localAmount?: number;
  entries?: IItemEntry[];
}

export interface ISalesReceiptsFilter {}

export interface ISaleReceiptDTO {
  customerId: number;
  exchangeRate?: number;
  depositAccountId: number;
  receiptDate: Date;
  sendToEmail: string;
  referenceNo?: string;
  receiptNumber?: string;
  receiptMessage: string;
  statement: string;
  closed: boolean;
  entries: any[];
  branchId?: number;
}

export interface ISalesReceiptsService {
  createSaleReceipt(
    tenantId: number,
    saleReceiptDTO: ISaleReceiptDTO
  ): Promise<void>;

  editSaleReceipt(tenantId: number, saleReceiptId: number): Promise<void>;

  deleteSaleReceipt(tenantId: number, saleReceiptId: number): Promise<void>;

  salesReceiptsList(
    tenantid: number,
    salesReceiptsFilter: ISalesReceiptsFilter
  ): Promise<{
    salesReceipts: ISaleReceipt[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }>;

  validateCustomerHasNoReceipts(
    tenantId: number,
    customerId: number
  ): Promise<void>;
}

export interface ISaleReceiptSmsDetails {
  customerName: string;
  customerPhoneNumber: string;
  smsMessage: string;
}
export interface ISaleReceiptCreatingPayload {
  saleReceiptDTO: ISaleReceiptDTO;
  tenantId: number;
  trx: Knex.Transaction;
}

export interface ISaleReceiptCreatedPayload {
  tenantId: number;
  saleReceipt: ISaleReceipt;
  saleReceiptId: number;
  trx: Knex.Transaction;
}

export interface ISaleReceiptEditedPayload {
  tenantId: number;
  oldSaleReceipt: number;
  saleReceipt: ISaleReceipt;
  saleReceiptId: number;
  trx: Knex.Transaction;
}

export interface ISaleReceiptEditingPayload {
  tenantId: number;
  oldSaleReceipt: ISaleReceipt;
  saleReceiptDTO: ISaleReceiptDTO;
  trx: Knex.Transaction;
}
export interface ISaleReceiptEventClosedPayload {
  tenantId: number;
  saleReceiptId: number;
  saleReceipt: ISaleReceipt;
  trx: Knex.Transaction;
}

export interface ISaleReceiptEventClosingPayload {
  tenantId: number;
  oldSaleReceipt: ISaleReceipt;
  trx: Knex.Transaction;
}

export interface ISaleReceiptEventDeletedPayload {
  tenantId: number;
  saleReceiptId: number;
  oldSaleReceipt: ISaleReceipt;
  trx: Knex.Transaction;
}

export enum SaleReceiptAction {
  Create = 'Create',
  Edit = 'Edit',
  Delete = 'Delete',
  View = 'View',
  NotifyBySms = 'NotifyBySms',
}

export interface ISaleReceiptDeletingPayload {
  tenantId: number;
  oldSaleReceipt: ISaleReceipt;
  trx: Knex.Transaction;
}
