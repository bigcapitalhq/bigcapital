import { Knex } from 'knex';
import {
  CommonMailOptions,
  CommonMailOptionsDTO,
  ISystemUser,
} from '@/interfaces';
import { ILedgerEntry } from './Ledger';
import { ISaleInvoice } from './SaleInvoice';

export interface IPaymentReceive {
  id?: number;
  customerId: number;
  paymentDate: Date;
  amount: number;
  currencyCode: string;
  exchangeRate: number;
  referenceNo: string;
  depositAccountId: number;
  paymentReceiveNo: string;
  statement: string;
  entries: IPaymentReceiveEntry[];
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  localAmount?: number;
  branchId?: number;
}
export interface IPaymentReceiveCreateDTO {
  customerId: number;
  paymentDate: Date;
  amount: number;
  exchangeRate: number;
  referenceNo: string;
  depositAccountId: number;
  paymentReceiveNo?: string;
  statement: string;
  entries: IPaymentReceiveEntryDTO[];

  branchId?: number;
}

export interface IPaymentReceiveEditDTO {
  customerId: number;
  paymentDate: Date;
  amount: number;
  exchangeRate: number;
  referenceNo: string;
  depositAccountId: number;
  paymentReceiveNo?: string;
  statement: string;
  entries: IPaymentReceiveEntryDTO[];
  branchId?: number;
}

export interface IPaymentReceiveEntry {
  id?: number;
  paymentReceiveId: number;
  invoiceId: number;
  paymentAmount: number;

  invoice?: ISaleInvoice;
}

export interface IPaymentReceiveEntryDTO {
  id?: number;
  index: number;
  paymentReceiveId: number;
  invoiceId: number;
  paymentAmount: number;
}

export interface IPaymentReceivesFilter extends IDynamicListFilterDTO {
  stringifiedFilterRoles?: string;
}

export interface IPaymentReceivePageEntry {
  invoiceId: number;
  entryType: string;
  invoiceNo: string;
  dueAmount: number;
  amount: number;
  totalPaymentAmount: number;
  paymentAmount: number;
  currencyCode: string;
  date: Date | string;
}

export interface IPaymentReceiveEditPage {
  paymentReceive: IPaymentReceive;
  entries: IPaymentReceivePageEntry[];
}

export interface IPaymentsReceiveService {
  validateCustomerHasNoPayments(
    tenantId: number,
    customerId: number
  ): Promise<void>;
}

export interface IPaymentReceiveSmsDetails {
  customerName: string;
  customerPhoneNumber: string;
  smsMessage: string;
}

export interface IPaymentReceiveCreatingPayload {
  tenantId: number;
  paymentReceiveDTO: IPaymentReceiveCreateDTO;
  trx: Knex.Transaction;
}

export interface IPaymentReceiveCreatedPayload {
  tenantId: number;
  paymentReceive: IPaymentReceive;
  paymentReceiveId: number;
  authorizedUser: ISystemUser;
  trx: Knex.Transaction;
}

export interface IPaymentReceiveEditedPayload {
  tenantId: number;
  paymentReceiveId: number;
  paymentReceive: IPaymentReceive;
  oldPaymentReceive: IPaymentReceive;
  authorizedUser: ISystemUser;
  trx: Knex.Transaction;
}

export interface IPaymentReceiveEditingPayload {
  tenantId: number;
  oldPaymentReceive: IPaymentReceive;
  paymentReceiveDTO: IPaymentReceiveEditDTO;
  trx: Knex.Transaction;
}

export interface IPaymentReceiveDeletingPayload {
  tenantId: number;
  oldPaymentReceive: IPaymentReceive;
  trx: Knex.Transaction;
}
export interface IPaymentReceiveDeletedPayload {
  tenantId: number;
  paymentReceiveId: number;
  oldPaymentReceive: IPaymentReceive;
  authorizedUser: ISystemUser;
  trx: Knex.Transaction;
}

export enum PaymentReceiveAction {
  Create = 'Create',
  Edit = 'Edit',
  Delete = 'Delete',
  View = 'View',
  NotifyBySms = 'NotifyBySms',
}

export type IPaymentReceiveGLCommonEntry = Pick<
  ILedgerEntry,
  | 'debit'
  | 'credit'
  | 'currencyCode'
  | 'exchangeRate'
  | 'transactionId'
  | 'transactionType'
  | 'transactionNumber'
  | 'referenceNumber'
  | 'date'
  | 'userId'
  | 'createdAt'
  | 'branchId'
>;

export interface PaymentReceiveMailOpts extends CommonMailOptions {}

export interface PaymentReceiveMailOptsDTO extends CommonMailOptionsDTO {}

export interface PaymentReceiveMailPresendEvent {
  tenantId: number;
  paymentReceiveId: number;
  messageOptions: PaymentReceiveMailOptsDTO;
}
