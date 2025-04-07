import { Knex } from 'knex';
import { SaleReceipt } from '../models/SaleReceipt';
import { CommonMailOptionsDTO } from '@/modules/MailNotification/MailNotification.types';
import { CommonMailOptions } from '@/modules/MailNotification/MailNotification.types';
import { TenantJobPayload } from '@/interfaces/Tenant';
import { CreateSaleReceiptDto, EditSaleReceiptDto } from '../dtos/SaleReceipt.dto';

export interface ISalesReceiptsFilter {
  filterQuery?: (query: any) => void;
}

export interface ISaleReceiptSmsDetails {
  customerName: string;
  customerPhoneNumber: string;
  smsMessage: string;
}
export interface ISaleReceiptCreatingPayload {
  saleReceiptDTO: CreateSaleReceiptDto;
  trx: Knex.Transaction;
}

export interface ISaleReceiptCreatedPayload {
  // tenantId: number;
  saleReceipt: SaleReceipt;
  saleReceiptId: number;
  saleReceiptDTO: CreateSaleReceiptDto;
  trx: Knex.Transaction;
}

export interface ISaleReceiptEditedPayload {
  oldSaleReceipt: SaleReceipt;
  saleReceipt: SaleReceipt;
  saleReceiptDTO: EditSaleReceiptDto;
  trx: Knex.Transaction;
}

export interface ISaleReceiptEditingPayload {
  oldSaleReceipt: SaleReceipt;
  saleReceiptDTO: EditSaleReceiptDto;
  trx: Knex.Transaction;
}
export interface ISaleReceiptEventClosedPayload {
  saleReceiptId: number;
  saleReceipt: SaleReceipt;
  trx: Knex.Transaction;
}

export interface ISaleReceiptEventClosingPayload {
  oldSaleReceipt: SaleReceipt;
  trx: Knex.Transaction;
}

export interface ISaleReceiptEventDeletedPayload {
  tenantId: number;
  saleReceiptId: number;
  oldSaleReceipt: SaleReceipt;
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
  oldSaleReceipt: SaleReceipt;
  trx: Knex.Transaction;
}

export interface SaleReceiptMailOpts extends CommonMailOptions {
  attachReceipt: boolean;
}

export interface SaleReceiptMailOptsDTO extends CommonMailOptionsDTO {
  attachReceipt?: boolean;
}

export interface ISaleReceiptMailPresend {
  tenantId: number;
  saleReceiptId: number;
  messageOptions: SaleReceiptMailOptsDTO;
}

export interface ISaleReceiptBrandingTemplateAttributes {
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

  // Total
  total: string;
  totalLabel: string;
  showTotal: boolean;

  // Subtotal
  subtotal: string;
  subtotalLabel: string;
  showSubtotal: boolean;

  // Customer Note
  showCustomerNote: boolean;
  customerNote: string;
  customerNoteLabel: string;

  // Terms & Conditions
  showTermsConditions: boolean;
  termsConditions: string;
  termsConditionsLabel: string;

  // Lines
  lines: Array<{
    item: string;
    description: string;
    rate: string;
    quantity: string;
    total: string;
  }>;

  // Receipt Number
  showReceiptNumber: boolean;
  receiptNumberLabel: string;
  receiptNumebr: string;

  // Receipt Date
  receiptDate: string;
  showReceiptDate: boolean;
  receiptDateLabel: string;
}

export interface ISaleReceiptState {
  defaultTemplateId: number;
}

export interface SaleReceiptSendMailPayload extends TenantJobPayload {
  messageOpts: SaleReceiptMailOptsDTO;
  saleReceiptId: number;
}
