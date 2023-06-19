import { Knex } from 'knex';
import { ISystemUser, IAccount } from '@/interfaces';
import { IDynamicListFilter } from '@/interfaces/DynamicFilter';
import { IItemEntry, IItemEntryDTO } from './ItemEntry';

export interface ISaleInvoice {
  id: number;
  balance: number;
  paymentAmount: number;
  currencyCode: string;
  exchangeRate?: number;
  invoiceDate: Date;
  dueDate: Date;
  dueAmount: number;
  overdueDays: number;
  customerId: number;
  referenceNo: string;
  invoiceNo: string;
  isWrittenoff: boolean;
  entries: IItemEntry[];
  deliveredAt: string | Date;
  userId: number;
  createdAt: Date;
  isDelivered: boolean;

  warehouseId?: number;
  branchId?: number;
  projectId?: number;

  localAmount?: number;

  localWrittenoffAmount?: number;
  writtenoffExpenseAccountId?: number;

  writtenoffExpenseAccount?: IAccount;
}

export interface ISaleInvoiceDTO {
  invoiceDate: Date;
  dueDate: Date;
  referenceNo: string;
  invoiceNo: string;
  customerId: number;
  exchangeRate?: number;
  invoiceMessage: string;
  termsConditions: string;
  entries: IItemEntryDTO[];
  delivered: boolean;

  warehouseId?: number | null;
  projectId?: number;
  branchId?: number | null;
}

export interface ISaleInvoiceCreateDTO extends ISaleInvoiceDTO {
  fromEstimateId: number;
}

export interface ISaleInvoiceEditDTO extends ISaleInvoiceDTO {}

export interface ISalesInvoicesFilter extends IDynamicListFilter {
  page: number;
  pageSize: number;
  searchKeyword?: string;
}

export interface ISalesInvoicesService {
  validateCustomerHasNoInvoices(
    tenantId: number,
    customerId: number
  ): Promise<void>;
}

export interface ISaleInvoiceWriteoffDTO {
  expenseAccountId: number;
  date: Date;
  reason: string;
}

export type InvoiceNotificationType = 'details' | 'reminder';

export interface ISaleInvoiceCreatedPayload {
  tenantId: number;
  saleInvoice: ISaleInvoice;
  saleInvoiceDTO: ISaleInvoiceCreateDTO;
  saleInvoiceId: number;
  authorizedUser: ISystemUser;
  trx: Knex.Transaction;
}

export interface ISaleInvoiceCreatingPayload {
  tenantId: number;
  saleInvoiceDTO: ISaleInvoiceCreateDTO;
  trx: Knex.Transaction;
}

export interface ISaleInvoiceEditedPayload {
  tenantId: number;
  saleInvoice: ISaleInvoice;
  oldSaleInvoice: ISaleInvoice;
  saleInvoiceDTO: ISaleInvoiceEditDTO;
  saleInvoiceId: number;
  authorizedUser: ISystemUser;
  trx: Knex.Transaction;
}

export interface ISaleInvoiceEditingPayload {
  tenantId: number;
  oldSaleInvoice: ISaleInvoice;
  saleInvoiceDTO: ISaleInvoiceEditDTO;
  trx: Knex.Transaction;
}

export interface ISaleInvoiceDeletePayload {
  tenantId: number;
  saleInvoice: ISaleInvoice;
  saleInvoiceId: number;
  trx: Knex.Transaction;
}

export interface ISaleInvoiceDeletedPayload {
  tenantId: number;
  oldSaleInvoice: ISaleInvoice;
  saleInvoiceId: number;
  trx: Knex.Transaction;
}

export interface ISaleInvoiceWriteoffCreatePayload {
  tenantId: number;
  saleInvoiceId: number;
  saleInvoice: ISaleInvoice;
  writeoffDTO: ISaleInvoiceWriteoffDTO;
  trx: Knex.Transaction;
}

export interface ISaleInvoiceWriteoffCreatedPayload {
  tenantId: number;
  saleInvoiceId: number;
  saleInvoice: ISaleInvoice;
  writeoffDTO: ISaleInvoiceCreatedPayload;
}

export interface ISaleInvoiceWrittenOffCancelPayload {
  tenantId: number;
  saleInvoice: ISaleInvoice;
  trx: Knex.Transaction;
}

export interface ISaleInvoiceWrittenOffCanceledPayload {
  tenantId: number;
  saleInvoice: ISaleInvoice;
  trx: Knex.Transaction;
}

export interface ISaleInvoiceEventDeliveredPayload {
  tenantId: number;
  saleInvoiceId: number;
  saleInvoice: ISaleInvoice;
}

export interface ISaleInvoiceDeliveringPayload {
  tenantId: number;
  oldSaleInvoice: ISaleInvoice;
  trx: Knex.Transaction;
}

export enum SaleInvoiceAction {
  Create = 'Create',
  Edit = 'Edit',
  Delete = 'Delete',
  View = 'View',
  Writeoff = 'Writeoff',
  NotifyBySms = 'NotifyBySms',
}
