import { Knex } from 'knex';
import { IItemEntry } from './ItemEntry';
import { CommonMailOptions, CommonMailOptionsDTO } from './Mailable';
import { AttachmentLinkDTO } from './Attachments';
import { DiscountType } from './SaleInvoice';

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

  subtotal?: number;
  subtotalLocal?: number;

  total?: number;
  totalLocal?: number;

  discountAmount: number;
  discountPercentage?: number | null;
  
  adjustment?: number;
  adjustmentLocal?: number | null;

  discountAmountLocal?: number | null;
}

export interface ISalesReceiptsFilter {
  filterQuery?: (query: any) => void;
}

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
  attachments?: AttachmentLinkDTO[];

  discount?: number;
  discountType?: DiscountType;
  
  adjustment?: number;
}

export interface ISalesReceiptsService {
  createSaleReceipt(
    tenantId: number,
    saleReceiptDTO: ISaleReceiptDTO
  ): Promise<void>;

  editSaleReceipt(tenantId: number, saleReceiptId: number): Promise<void>;

  deleteSaleReceipt(tenantId: number, saleReceiptId: number): Promise<void>;

  salesReceiptsList(
    tennatid: number,
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
  saleReceiptDTO: ISaleReceiptDTO;
  trx: Knex.Transaction;
}

export interface ISaleReceiptEditedPayload {
  tenantId: number;
  oldSaleReceipt: number;
  saleReceipt: ISaleReceipt;
  saleReceiptId: number;
  saleReceiptDTO: ISaleReceiptDTO;
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