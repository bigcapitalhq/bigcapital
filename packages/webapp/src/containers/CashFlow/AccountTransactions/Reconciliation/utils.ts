import moment from 'moment';
import type {
  BankReconciliationResponse,
  BankReconciliationTransactionResponse,
} from '@bigcapital/sdk-ts';

export const RECONCILIATION_TOLERANCE = 0.005;

export type ReconciliationTransactionFilter = 'all' | 'payments' | 'deposits';

export const RECONCILIATION_DATE_FORMAT = 'DD MMM YYYY';

/**
 * Formats a reconciliation period, e.g. "01 Nov 2026 to 30 Nov 2026".
 */
export const formatReconciliationPeriod = (
  startDate: string | Date,
  endDate: string | Date,
): string => {
  return `${moment(startDate).format(RECONCILIATION_DATE_FORMAT)} to ${moment(
    endDate,
  ).format(RECONCILIATION_DATE_FORMAT)}`;
};

/**
 * Formats the date a reconciliation was completed.
 */
export const formatReconciledDate = (
  reconciledAt: string | Date | null | undefined,
): string => {
  return reconciledAt
    ? moment(reconciledAt).format(RECONCILIATION_DATE_FORMAT)
    : '';
};

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
