import { unescape } from 'lodash';
import moment from 'moment';
import intl from 'react-intl-universal';
import type {
  BankReconciliationResponse,
  BankReconciliationTransactionResponse,
} from '@bigcapital/sdk-ts';
import type { ApiError } from 'openapi-typescript-fetch';

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
  return intl.get('banking.reconciliation.date_range', {
    startDate: formatReconciliationDate(startDate),
    endDate: formatReconciliationDate(endDate),
  });
};

/**
 * Formats a display date using the app's Moment locale.
 */
export const formatReconciliationDate = (
  date: string | Date | null | undefined,
): string => {
  return date ? moment(date).format(RECONCILIATION_DATE_FORMAT) : '';
};

export const formatReconciliationAccountPrompt = (
  accountName: string,
): string => {
  const message = intl.get('banking.reconciliation.empty_history_hint', {
    accountName,
  });
  // Intl escapes variables containing "<". React renders this as plain text.
  return accountName.includes('<') ? unescape(message) : message;
};

interface ReconciliationApiError {
  type?: string;
  payload?: {
    required_start_date?: unknown;
    requiredStartDate?: unknown;
  };
}

export const getReconciliationErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  const errors: ReconciliationApiError[] | undefined = (
    error as ApiError | undefined
  )?.data?.errors;
  const entry = Array.isArray(errors)
    ? errors.find(
        (item) =>
          typeof item?.type === 'string' &&
          item.type.startsWith('BANK_RECONCILIATION_'),
      )
    : undefined;
  const requiredStartDate =
    entry?.payload?.required_start_date ?? entry?.payload?.requiredStartDate;

  let key = entry ? `error.${entry.type}` : fallback;
  let values: { date: string } | undefined;
  if (
    entry?.type === 'BANK_RECONCILIATION_PERIOD_INVALID' &&
    typeof requiredStartDate === 'string' &&
    moment(requiredStartDate, 'YYYY-MM-DD', true).isValid()
  ) {
    key = 'error.required_start_date';
    values = { date: formatReconciliationDate(requiredStartDate) };
  } else if (
    entry?.type === 'BANK_RECONCILIATION_NOT_IN_PROGRESS' &&
    fallback === 'undo_error'
  ) {
    key = 'error.undo_completed_only';
  }
  return (
    intl.get(`banking.reconciliation.${key}`, values) ||
    intl.get(`banking.reconciliation.${fallback}`)
  );
};

export const getReconciliationStatusLabel = (status: string): string =>
  intl.get(`banking.reconciliation.status.${status}`) ||
  intl.get('banking.reconciliation.unknown_status');

export const getReconciliationTransactionStatusLabel = (
  status: string,
): string =>
  intl.get(`banking.reconciliation.transaction_status.${status}`) ||
  intl.get('banking.reconciliation.unknown_status');

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
