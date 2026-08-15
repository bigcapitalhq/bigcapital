// Query key constants
export const SALE_INVOICES = 'SALE_INVOICES';
export const SALE_INVOICE = 'SALE_INVOICE';
export const SALE_INVOICES_DUE = 'SALE_INVOICES_DUE';
export const SALE_INVOICE_SMS_DETAIL = 'SALE_INVOICE_SMS_DETAIL';
export const NOTIFY_SALE_INVOICE_BY_SMS = 'NOTIFY_SALE_INVOICE_BY_SMS';
export const BAD_DEBT = 'BAD_DEBT';
export const CANCEL_BAD_DEBT = 'CANCEL_BAD_DEBT';
export const SALE_INVOICE_PAYMENT_TRANSACTIONS =
  'SALE_INVOICE_PAYMENT_TRANSACTIONS';
export const SALE_INVOICE_DEFAULT_OPTIONS = 'SALE_INVOICE_DEFAULT_OPTIONS';

// Query key factory
export const invoicesKeys = {
  all: () => [SALE_INVOICES] as const,
  list: (query?: Record<string, unknown>) => [SALE_INVOICES, query] as const,
  detail: (id: number | null | undefined) => [SALE_INVOICE, id] as const,
  due: (customerId?: number | string | null) =>
    [SALE_INVOICES, SALE_INVOICES_DUE, customerId] as const,
  paymentTransactions: (id: number | null | undefined) =>
    [SALE_INVOICE_PAYMENT_TRANSACTIONS, id] as const,
  smsDetail: (id: number | null | undefined) =>
    [SALE_INVOICE_SMS_DETAIL, id] as const,
  html: (id: number | null | undefined) => ['SALE_INVOICE_HTML', id] as const,
  state: () => ['SALE_INVOICE_STATE'] as const,
  brandingTemplate: (id: number | null | undefined) =>
    ['SALE_INVOICE_BRANDING_TEMPLATE', id] as const,
  defaultOptions: (id: number | null | undefined) =>
    [SALE_INVOICE_DEFAULT_OPTIONS, id] as const,
  badDebt: (id: number | null | undefined) => [BAD_DEBT, id] as const,
  cancelBadDebt: (id: number | null | undefined) =>
    [CANCEL_BAD_DEBT, id] as const,
  notifyBySms: (id: number | null | undefined) =>
    [NOTIFY_SALE_INVOICE_BY_SMS, id] as const,
};

// Grouped object for use in components/hooks
export const InvoicesQueryKeys = {
  SALE_INVOICES,
  SALE_INVOICE,
  SALE_INVOICES_DUE,
  SALE_INVOICE_SMS_DETAIL,
  NOTIFY_SALE_INVOICE_BY_SMS,
  BAD_DEBT,
  CANCEL_BAD_DEBT,
  SALE_INVOICE_PAYMENT_TRANSACTIONS,
  SALE_INVOICE_DEFAULT_OPTIONS,
} as const;
