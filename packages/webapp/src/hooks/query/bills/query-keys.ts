// Query key constants
export const BILLS = 'BILLS';
export const BILL = 'BILL';
export const BILLS_DUE = 'BILLS_DUE';
export const BILLS_PAYMENT_TRANSACTIONS = 'BILLS_PAYMENT_TRANSACTIONS';

// Query key factory
export const billsKeys = {
  all: () => [BILLS] as const,
  list: (query?: Record<string, unknown>) => [BILLS, query] as const,
  detail: (id: number | null | undefined) => [BILL, id] as const,
  due: (vendorId?: number | null) => [BILLS, BILLS_DUE, vendorId] as const,
  paymentTransactions: (id: number | null | undefined) =>
    [BILLS_PAYMENT_TRANSACTIONS, id] as const,
};

// Grouped object for use in components/hooks
export const BillsQueryKeys = {
  BILLS,
  BILL,
  BILLS_DUE,
  BILLS_PAYMENT_TRANSACTIONS,
} as const;
