import { sumBy } from 'lodash';
import moment from 'moment';
import type { CreateRecurringInvoiceBody } from '@bigcapital/sdk-ts';
import { assignEntriesTaxAmount } from '@/containers/Entries/utils';
import { TaxType } from '@/interfaces/TaxRates';
import { repeatValue, toSafeNumber } from '@/utils';

export const MIN_LINES_NUMBER = 1;

export type RecurringInvoiceEntry = {
  index: number;
  itemId: string | number;
  rate: string | number;
  discount: string | number;
  quantity: string | number;
  description: string;
  amount: string | number;
  taxRateId: string | number;
  taxRate: string | number;
  taxAmount: string | number;
};

export type RecurringInvoiceFormValues = {
  customerId: string | number;
  profileName: string;
  referenceNo: string;
  startDate: string;
  endDate: string;
  frequency: 'day' | 'week' | 'month' | 'year';
  repeatInterval: string | number;
  maxOccurrences: string | number;
  dueDays: string | number;

  deliveryMode: 'draft' | 'email';
  emailSubject: string;
  emailMessage: string;
  emailCc: string;
  emailBcc: string;
  attachInvoice: boolean;

  invoiceMessage: string;
  termsConditions: string;
  exchangeRate: string | number;
  currencyCode: string;
  branchId: string | number;
  warehouseId: string | number;
  inclusiveExclusiveTax: TaxType;
  discount: string | number;
  discountType: 'amount' | 'percentage';
  adjustment: string | number;
  entries: RecurringInvoiceEntry[];
};

function formatEmailsForInput(value: unknown): string {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  return typeof value === 'string' ? value : '';
}

export const defaultRecurringInvoiceEntry: RecurringInvoiceEntry = {
  index: 0,
  itemId: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
  amount: '',
  taxRateId: '',
  taxRate: '',
  taxAmount: '',
};

export const defaultRecurringInvoice: RecurringInvoiceFormValues = {
  customerId: '',
  profileName: '',
  referenceNo: '',
  startDate: moment().format('YYYY-MM-DD'),
  endDate: '',
  frequency: 'month',
  repeatInterval: 1,
  maxOccurrences: '',
  dueDays: 0,

  deliveryMode: 'draft',
  emailSubject: '',
  emailMessage: '',
  emailCc: '',
  emailBcc: '',
  attachInvoice: true,

  invoiceMessage: '',
  termsConditions: '',
  exchangeRate: 1,
  currencyCode: '',
  branchId: '',
  warehouseId: '',
  inclusiveExclusiveTax: TaxType.Inclusive,
  discount: '',
  discountType: 'amount',
  adjustment: '',
  entries: [...repeatValue(defaultRecurringInvoiceEntry, MIN_LINES_NUMBER)],
};

/**
 * Transforms a recurring invoice API object into form values.
 */
export function transformRecurringInvoiceToForm(
  recurringInvoice: any,
): RecurringInvoiceFormValues {
  return {
    customerId: recurringInvoice.customerId ?? '',
    profileName: recurringInvoice.profileName ?? '',
    referenceNo: recurringInvoice.referenceNo ?? '',
    startDate: recurringInvoice.startDate
      ? moment(recurringInvoice.startDate).format('YYYY-MM-DD')
      : defaultRecurringInvoice.startDate,
    endDate: recurringInvoice.endDate
      ? moment(recurringInvoice.endDate).format('YYYY-MM-DD')
      : '',
    frequency: recurringInvoice.frequency ?? 'month',
    repeatInterval: recurringInvoice.repeatInterval ?? 1,
    maxOccurrences: recurringInvoice.maxOccurrences ?? '',
    dueDays: recurringInvoice.dueDays ?? 0,

    deliveryMode: recurringInvoice.deliveryMode ?? 'draft',
    emailSubject: recurringInvoice.emailSubject ?? '',
    emailMessage: recurringInvoice.emailMessage ?? '',
    emailCc: formatEmailsForInput(recurringInvoice.emailCc),
    emailBcc: formatEmailsForInput(recurringInvoice.emailBcc),
    attachInvoice: recurringInvoice.attachInvoice ?? true,

    invoiceMessage: recurringInvoice.invoiceMessage ?? '',
    termsConditions: recurringInvoice.termsConditions ?? '',
    exchangeRate: recurringInvoice.exchangeRate ?? 1,
    currencyCode: recurringInvoice.currencyCode ?? '',
    branchId: recurringInvoice.branchId ?? '',
    warehouseId: recurringInvoice.warehouseId ?? '',
    inclusiveExclusiveTax: recurringInvoice.isInclusiveTax
      ? TaxType.Inclusive
      : TaxType.Exclusive,
    discount: recurringInvoice.discount ?? '',
    discountType: recurringInvoice.discountType ?? 'amount',
    adjustment: recurringInvoice.adjustment ?? '',
    entries: (recurringInvoice.entries ?? []).map(
      (entry: any, index: number) => ({
        index,
        itemId: entry.itemId ?? '',
        rate: entry.rate ?? '',
        discount: entry.discount ?? '',
        quantity: entry.quantity ?? '',
        description: entry.description ?? '',
        amount: entry.amount ?? '',
        taxRateId: entry.taxRateId ?? '',
        taxRate: entry.taxRate ?? '',
        taxAmount: entry.taxAmount ?? '',
      }),
    ),
  };
}

/**
 * Transforms form values into the API request body.
 */
export function transformRecurringInvoiceToRequest(
  values: RecurringInvoiceFormValues,
): CreateRecurringInvoiceBody {
  const parseEmails = (value: string): string[] =>
    value
      .split(',')
      .map((email) => email.trim())
      .filter(Boolean);

  return {
    customerId: Number(values.customerId),
    profileName: values.profileName,
    referenceNo: values.referenceNo,
    startDate: values.startDate,
    endDate: values.endDate || undefined,
    frequency: values.frequency,
    repeatInterval: Number(values.repeatInterval) || 1,
    maxOccurrences: values.maxOccurrences
      ? Number(values.maxOccurrences)
      : undefined,
    dueDays: Number(values.dueDays) || 0,

    deliveryMode: values.deliveryMode,
    emailSubject: values.emailSubject || undefined,
    emailMessage: values.emailMessage || undefined,
    emailCc: parseEmails(values.emailCc),
    emailBcc: parseEmails(values.emailBcc),
    attachInvoice: values.attachInvoice,

    invoiceMessage: values.invoiceMessage,
    termsConditions: values.termsConditions,
    exchangeRate: Number(values.exchangeRate) || 1,
    branchId: values.branchId ? Number(values.branchId) : undefined,
    warehouseId: values.warehouseId ? Number(values.warehouseId) : undefined,
    isInclusiveTax: values.inclusiveExclusiveTax === TaxType.Inclusive,
    discount: toSafeNumber(values.discount),
    discountType: values.discountType,
    adjustment: toSafeNumber(values.adjustment),
    entries: values.entries
      .filter((entry) => entry.itemId && entry.quantity)
      .map((entry, index) => ({
        index,
        itemId: Number(entry.itemId),
        description: entry.description,
        quantity: Number(entry.quantity),
        rate: Number(entry.rate),
        discount: toSafeNumber(entry.discount),
        taxRateId: entry.taxRateId ? Number(entry.taxRateId) : undefined,
      })),
  } as unknown as CreateRecurringInvoiceBody;
}

/**
 * Returns entries with computed tax amounts.
 */
export function getRecurringEntriesWithTax(
  values: RecurringInvoiceFormValues,
): Array<RecurringInvoiceEntry & { taxAmount: number }> {
  return assignEntriesTaxAmount(
    values.inclusiveExclusiveTax === TaxType.Inclusive,
    values.entries.map((entry) => ({
      ...entry,
      amount:
        toSafeNumber(entry.amount) ||
        Number(entry.quantity) * Number(entry.rate),
      taxRate: Number(entry.taxRate) || 0,
    })),
  ) as Array<RecurringInvoiceEntry & { taxAmount: number }>;
}

/**
 * Computes the recurring invoice totals.
 */
export function getRecurringInvoiceTotals(values: RecurringInvoiceFormValues) {
  const entries = getRecurringEntriesWithTax(values);
  const subtotal = sumBy(
    entries,
    (entry) =>
      toSafeNumber(entry.amount) || Number(entry.quantity) * Number(entry.rate),
  );
  const taxAmount = sumBy(entries, 'taxAmount');
  const discount =
    values.discountType === 'percentage'
      ? (subtotal * toSafeNumber(values.discount)) / 100
      : toSafeNumber(values.discount);
  const adjustment = toSafeNumber(values.adjustment);
  const total =
    subtotal -
    discount +
    adjustment +
    (values.inclusiveExclusiveTax === TaxType.Exclusive ? taxAmount : 0);

  return { subtotal, taxAmount, discount, adjustment, total };
}
