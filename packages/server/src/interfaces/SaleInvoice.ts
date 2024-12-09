import { Knex } from 'knex';
import { ISystemUser, IAccount, ITaxTransaction } from '@/interfaces';
import { CommonMailOptions, CommonMailOptionsDTO } from './Mailable';
import { IDynamicListFilter } from '@/interfaces/DynamicFilter';
import { IItemEntry, IItemEntryDTO } from './ItemEntry';
import { AttachmentLinkDTO } from './Attachments';

export interface PaymentIntegrationTransactionLink {
  id: number;
  enable: true;
  paymentIntegrationId: number;
  referenceType: string;
  referenceId: number;
}

export interface PaymentIntegrationTransactionLinkEventPayload {
  tenantId: number;
  enable: true;
  paymentIntegrationId: number;
  referenceType: string;
  referenceId: number;
  saleInvoiceId: number;
  trx?: Knex.Transaction;
}

export interface PaymentIntegrationTransactionLinkDeleteEventPayload {
  tenantId: number;
  enable: true;
  paymentIntegrationId: number;
  referenceType: string;
  referenceId: number;
  oldSaleInvoiceId: number;
  trx?: Knex.Transaction;
}

export interface ISaleInvoice {
  id: number;
  amount: number;
  amountLocal?: number;
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

  writtenoffAmount?: number;
  writtenoffAmountLocal?: number;
  writtenoffExpenseAccountId?: number;
  writtenoffExpenseAccount?: IAccount;

  taxAmountWithheld: number;
  taxAmountWithheldLocal: number;
  taxes: ITaxTransaction[];

  total: number;
  totalLocal: number;

  subtotal: number;
  subtotalLocal: number;
  subtotalExludingTax: number;

  termsConditions: string;
  invoiceMessage: string;

  pdfTemplateId?: number;

  paymentMethods?: Array<PaymentIntegrationTransactionLink>;

  adjustment?: number;
  adjustmentLocal?: number | null;

  discount?: number;
  discountAmount?: number;
  discountAmountLocal?: number | null;
}

export enum DiscountType {
  Percentage = 'percentage',
  Amount = 'amount',
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
  isTaxExclusive: boolean;
  entries: IItemEntryDTO[];
  delivered: boolean;

  warehouseId?: number | null;
  projectId?: number;
  branchId?: number | null;

  isInclusiveTax?: boolean;

  attachments?: AttachmentLinkDTO[];

  // # Discount
  discount?: number;
  discountType?: DiscountType;

  // # Adjustments
  adjustments?: string;
}

export interface ISaleInvoiceCreateDTO extends ISaleInvoiceDTO {
  fromEstimateId: number;
}

export interface ISaleInvoiceEditDTO extends ISaleInvoiceDTO {}

export interface ISalesInvoicesFilter extends IDynamicListFilter {
  page: number;
  pageSize: number;
  searchKeyword?: string;
  filterQuery?: (q: Knex.QueryBuilder) => void;
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

export interface ISaleInvoiceCreatingPaylaod {
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
  oldSaleInvoice: ISaleInvoice;
  saleInvoiceId: number;
}

export interface ISaleInvoiceDeletingPayload {
  tenantId: number;
  oldSaleInvoice: ISaleInvoice;
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
  trx: Knex.Transaction;
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

export interface SaleInvoiceMailOptions extends CommonMailOptions {
  attachInvoice?: boolean;
  formatArgs?: Record<string, any>;
}

export interface SaleInvoiceMailState extends SaleInvoiceMailOptions {
  invoiceNo: string;

  invoiceDate: string;
  invoiceDateFormatted: string;

  dueDate: string;
  dueDateFormatted: string;

  total: number;
  totalFormatted: string;

  subtotal: number;
  subtotalFormatted: number;

  companyName: string;
  companyLogoUri: string;

  customerName: string;

  // # Invoice entries
  entries?: Array<{ label: string; total: string; quantity: string | number }>;
}

export interface SendInvoiceMailDTO extends CommonMailOptionsDTO {
  attachInvoice?: boolean;
}

export interface ISaleInvoiceNotifyPayload {
  tenantId: number;
  saleInvoiceId: number;
  messageDTO: SendInvoiceMailDTO;
}

export interface ISaleInvoiceMailSend {
  tenantId: number;
  saleInvoiceId: number;
  messageOptions: SendInvoiceMailDTO;
  formattedMessageOptions: SaleInvoiceMailOptions;
}

export interface ISaleInvoiceMailSent {
  tenantId: number;
  saleInvoiceId: number;
  messageOptions: SendInvoiceMailDTO;
}

// Invoice Pdf Document
export interface InvoicePdfLine {
  item: string;
  description: string;
  rate: string;
  quantity: string;
  total: string;
}

export interface InvoicePdfTax {
  label: string;
  amount: string;
}

export interface InvoicePdfTemplateAttributes {
  primaryColor: string;
  secondaryColor: string;

  companyName: string;

  showCompanyLogo: boolean;
  companyLogo: string;

  dueDate: string;
  dueDateLabel: string;
  showDueDate: boolean;

  dateIssue: string;
  dateIssueLabel: string;
  showDateIssue: boolean;

  invoiceNumberLabel: string;
  invoiceNumber: string;
  showInvoiceNumber: boolean;

  // Customer Address
  showCustomerAddress: boolean;
  customerAddress: string;

  // Company address
  showCompanyAddress: boolean;
  companyAddress: string;
  billedToLabel: string;

  lineItemLabel: string;
  lineDescriptionLabel: string;
  lineRateLabel: string;
  lineTotalLabel: string;

  totalLabel: string;
  subtotalLabel: string;
  discountLabel: string;
  paymentMadeLabel: string;

  showTotal: boolean;
  showSubtotal: boolean;
  showDiscount: boolean;
  showTaxes: boolean;
  showPaymentMade: boolean;

  total: string;
  subtotal: string;
  discount: string;
  paymentMade: string;

  // Due Amount
  dueAmount: string;
  showDueAmount: boolean;
  dueAmountLabel: string;

  termsConditionsLabel: string;
  showTermsConditions: boolean;
  termsConditions: string;

  lines: InvoicePdfLine[];
  taxes: InvoicePdfTax[];

  statementLabel: string;
  showStatement: boolean;
  statement: string;
}

export interface ISaleInvocieState {
  defaultTemplateId: number;
}
