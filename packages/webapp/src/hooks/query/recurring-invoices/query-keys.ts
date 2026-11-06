export const RECURRING_INVOICES = 'RECURRING_INVOICES';
export const RECURRING_INVOICE = 'RECURRING_INVOICE';
export const RECURRING_INVOICE_INVOICES = 'RECURRING_INVOICE_INVOICES';
export const RECURRING_INVOICE_STATE = 'RECURRING_INVOICE_STATE';

export const recurringInvoicesKeys = {
  all: () => [RECURRING_INVOICES] as const,
  list: (query?: Record<string, unknown>) =>
    [RECURRING_INVOICES, query] as const,
  detail: (id: number | null | undefined) => [RECURRING_INVOICE, id] as const,
  invoices: (id: number | null | undefined, query?: Record<string, unknown>) =>
    [RECURRING_INVOICE_INVOICES, id, query] as const,
  state: () => [RECURRING_INVOICE_STATE] as const,
};
