import { Knex } from 'knex';
import { IDynamicListFilter } from '../DynamicListing/DynamicFilter/DynamicFilter.types';
import { RecurringInvoice } from './models/RecurringInvoice';

export const RECURRING_INVOICES_QUEUE = 'recurring-invoices';
export const RECURRING_INVOICES_SCAN_JOB = 'scan-recurring-invoices';
export const RECURRING_INVOICES_PROCESS_TENANT_JOB =
  'process-tenant-recurring-invoices';

export enum RecurringInvoiceAction {
  View = 'View',
  Create = 'Create',
  Edit = 'Edit',
  Delete = 'Delete',
}

export enum RecurringInvoiceStatus {
  Active = 'active',
  Paused = 'paused',
  Completed = 'completed',
}

export enum RecurringInvoiceFrequency {
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
}

export enum RecurringInvoiceDeliveryMode {
  Draft = 'draft',
  Email = 'email',
}

export const RECURRING_INVOICE_REFERENCE_TYPE = 'RecurringInvoice';

export const ERRORS = {
  RECURRING_INVOICE_NOT_FOUND: 'RECURRING_INVOICE_NOT_FOUND',
  RECURRING_INVOICE_PROFILE_NAME_REQUIRED:
    'RECURRING_INVOICE_PROFILE_NAME_REQUIRED',
  RECURRING_INVOICE_START_DATE_REQUIRED:
    'RECURRING_INVOICE_START_DATE_REQUIRED',
  RECURRING_INVOICE_END_DATE_INVALID: 'RECURRING_INVOICE_END_DATE_INVALID',
  RECURRING_INVOICE_ALREADY_COMPLETED: 'RECURRING_INVOICE_ALREADY_COMPLETED',
  RECURRING_INVOICE_ALREADY_PAUSED: 'RECURRING_INVOICE_ALREADY_PAUSED',
  RECURRING_INVOICE_NOT_PAUSED: 'RECURRING_INVOICE_NOT_PAUSED',
  RECURRING_INVOICE_CUSTOMER_EMAIL_REQUIRED:
    'RECURRING_INVOICE_CUSTOMER_EMAIL_REQUIRED',
  RECURRING_INVOICE_END_CONDITION_REACHED:
    'RECURRING_INVOICE_END_CONDITION_REACHED',
  RECURRING_INVOICE_OCCURRENCE_ALREADY_EXISTS:
    'RECURRING_INVOICE_OCCURRENCE_ALREADY_EXISTS',
  RECURRING_INVOICE_AUTO_INCREMENT_REQUIRED:
    'RECURRING_INVOICE_AUTO_INCREMENT_REQUIRED',
};

export interface IRecurringInvoicesFilter extends IDynamicListFilter {
  page: number;
  pageSize: number;
  searchKeyword?: string;
  filterQuery?: (q: Knex.QueryBuilder) => void;
}

export interface IRecurringInvoiceCreatedPayload {
  recurringInvoice: RecurringInvoice;
  recurringInvoiceId: number;
  trx: Knex.Transaction;
}

export interface IRecurringInvoiceEditedPayload {
  recurringInvoice: RecurringInvoice;
  oldRecurringInvoice: RecurringInvoice;
  recurringInvoiceId: number;
  trx: Knex.Transaction;
}

export interface IRecurringInvoiceDeletedPayload {
  oldRecurringInvoice: RecurringInvoice;
  recurringInvoiceId: number;
  trx: Knex.Transaction;
}

export interface IRecurringInvoiceGeneratedPayload {
  recurringInvoice: RecurringInvoice;
  saleInvoiceId: number;
  invoiceDate: string;
  trx?: Knex.Transaction;
}

export interface IRecurringInvoicesTenantJobPayload {
  organizationId: string;
  userId: number;
}
