import { AttachmentLinkDTO } from '@/modules/Attachments/Attachments.types';
import { Knex } from 'knex';
import { PaymentReceived } from '../models/PaymentReceived';

export interface IPaymentReceivedCreateDTO {
  customerId: number;
  paymentDate: Date | string;
  amount: number;
  exchangeRate: number;
  referenceNo: string;
  depositAccountId: number;
  paymentReceiveNo?: string;
  statement: string;
  entries: IPaymentReceivedEntryDTO[];

  branchId?: number;
  attachments?: AttachmentLinkDTO[];
}

export interface IPaymentReceivedEditDTO {
  customerId: number;
  paymentDate: Date;
  amount: number;
  exchangeRate: number;
  referenceNo: string;
  depositAccountId: number;
  paymentReceiveNo?: string;
  statement: string;
  entries: IPaymentReceivedEntryDTO[];
  branchId?: number;
  attachments?: AttachmentLinkDTO[];
}

export interface IPaymentReceivedEntryDTO {
  id?: number;
  index?: number;
  paymentReceiveId?: number;
  invoiceId: number;
  paymentAmount: number;
}

// export interface IPaymentsReceivedFilter extends IDynamicListFilterDTO {
//   stringifiedFilterRoles?: string;
//   filterQuery?: (trx: Knex.Transaction) => void;
// }

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

export interface IPaymentReceivedEditPage {
  paymentReceive: PaymentReceived;
  entries: IPaymentReceivePageEntry[];
}

export interface IPaymentsReceivedService {
  validateCustomerHasNoPayments(
    tenantId: number,
    customerId: number,
  ): Promise<void>;
}

export interface IPaymentReceivedSmsDetails {
  customerName: string;
  customerPhoneNumber: string;
  smsMessage: string;
}

export interface IPaymentReceivedCreatingPayload {
  tenantId: number;
  paymentReceiveDTO: IPaymentReceivedCreateDTO;
  trx: Knex.Transaction;
}

export interface IPaymentReceivedCreatedPayload {
  // tenantId: number;
  paymentReceive: PaymentReceived;
  paymentReceiveId: number;
  // authorizedUser: ISystemUser;
  paymentReceiveDTO: IPaymentReceivedCreateDTO;
  trx: Knex.Transaction;
}

export interface IPaymentReceivedEditedPayload {
  // tenantId: number;
  paymentReceiveId: number;
  paymentReceive: PaymentReceived;
  oldPaymentReceive: PaymentReceived;
  paymentReceiveDTO: IPaymentReceivedEditDTO;
  // authorizedUser: ISystemUser;
  trx: Knex.Transaction;
}

export interface IPaymentReceivedEditingPayload {
  // tenantId: number;
  oldPaymentReceive: PaymentReceived;
  paymentReceiveDTO: IPaymentReceivedEditDTO;
  trx: Knex.Transaction;
}

export interface IPaymentReceivedDeletingPayload {
  // tenantId: number;
  oldPaymentReceive: PaymentReceived;
  trx: Knex.Transaction;
}
export interface IPaymentReceivedDeletedPayload {
  // tenantId: number;
  paymentReceiveId: number;
  oldPaymentReceive: PaymentReceived;
  // authorizedUser: ISystemUser;
  trx: Knex.Transaction;
}

export enum PaymentReceiveAction {
  Create = 'Create',
  Edit = 'Edit',
  Delete = 'Delete',
  View = 'View',
  NotifyBySms = 'NotifyBySms',
}

// export type IPaymentReceiveGLCommonEntry = Pick<
//   ILedgerEntry,
//   | 'debit'
//   | 'credit'
//   | 'currencyCode'
//   | 'exchangeRate'
//   | 'transactionId'
//   | 'transactionType'
//   | 'transactionNumber'
//   | 'referenceNumber'
//   | 'date'
//   | 'userId'
//   | 'createdAt'
//   | 'branchId'
// >;

// export interface PaymentReceiveMailOpts extends CommonMailOptions {}

// export interface PaymentReceiveMailOptsDTO extends CommonMailOptionsDTO {}

// export interface PaymentReceiveMailPresendEvent {
//   tenantId: number;
//   paymentReceiveId: number;
//   messageOptions: PaymentReceiveMailOptsDTO;
// }

export interface PaymentReceivedPdfLineItem {
  item: string;
  description: string;
  rate: string;
  quantity: string;
  total: string;
}

export interface PaymentReceivedPdfTax {
  label: string;
  amount: string;
}

export interface PaymentReceivedPdfTemplateAttributes {
  primaryColor: string;
  secondaryColor: string;
  showCompanyLogo: boolean;
  companyLogo: string;
  companyName: string;

  // Customer Address
  showCustomerAddress: boolean;
  customerAddress: string;

  // Company address
  showCompanyAddress: boolean;
  companyAddress: string;
  billedToLabel: string;

  total: string;
  totalLabel: string;
  showTotal: boolean;

  subtotal: string;
  subtotalLabel: string;
  showSubtotal: boolean;

  lines: Array<{
    invoiceNumber: string;
    invoiceAmount: string;
    paidAmount: string;
  }>;

  showPaymentReceivedNumber: boolean;
  paymentReceivedNumberLabel: string;
  paymentReceivedNumebr: string;

  paymentReceivedDate: string;
  showPaymentReceivedDate: boolean;
  paymentReceivedDateLabel: string;
}

export interface IPaymentReceivedState {
  defaultTemplateId: number;
}
