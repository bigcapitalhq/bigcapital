import type {
  BankReconciliationResponse,
  BankReconciliationTransactionResponse,
} from '@bigcapital/sdk-ts';

export const RECONCILIATION_TOLERANCE = 0.005;

export type ReconciliationTransactionFilter = 'all' | 'payments' | 'deposits';

export const getReconciliationDifference = (
  endingBalance: number | null | undefined,
  clearedBalance: number,
): number => Number(endingBalance ?? 0) - clearedBalance;

export const isReconciliationBalanced = (
  endingBalance: number | null | undefined,
  clearedBalance: number,
): boolean =>
  Math.abs(getReconciliationDifference(endingBalance, clearedBalance)) <=
  RECONCILIATION_TOLERANCE;

export const formatMoney = (
  value: number | null | undefined,
  currencyCode?: string | null,
): string => {
  if (value === null || value === undefined) return '';

  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return Number(value).toFixed(2);
  }
};

export const getStatusIntent = (
  status: BankReconciliationResponse['status'],
): 'none' | 'primary' | 'success' | 'warning' | 'danger' => {
  switch (status) {
    case 'in_progress':
      return 'warning';
    case 'reconciled':
      return 'success';
    case 'voided':
      return 'danger';
    default:
      return 'none';
  }
};

export const filterTransactions = (
  transactions: BankReconciliationTransactionResponse[],
  filter: ReconciliationTransactionFilter,
): BankReconciliationTransactionResponse[] => {
  if (filter === 'payments') {
    return transactions.filter((transaction) => transaction.credit > 0);
  }
  if (filter === 'deposits') {
    return transactions.filter((transaction) => transaction.debit > 0);
  }
  return transactions;
};
