export enum BankReconciliationStatus {
  InProgress = 'in_progress',
  Reconciled = 'reconciled',
  Voided = 'voided',
}

export type BankReconciliationTransactionStatus =
  | 'categorized'
  | 'matched'
  | 'manual';

export interface IBankReconciliationTransactionKey {
  referenceType: string;
  referenceId: number;
  index: number;
}

export interface IBankReconciliationTransactionRow {
  key: string;
  accountTransactionId: number | null;
  referenceType: string;
  referenceId: number;
  index: number;
  date: Date | string;
  transactionType: string | null;
  transactionNumber: string | null;
  referenceNumber: string | null;
  note: string | null;
  credit: number;
  debit: number;
  currencyCode: string | null;
  exchangeRate: number | null;
  status: BankReconciliationTransactionStatus;
  isBankFeed: boolean;
  isPreviousOutstanding: boolean;
  isChecked: boolean;
  isReconciled: boolean;
  uncategorizedTransactionIds: number[];
}

export interface IChangedReconciledTransaction {
  key: string;
  referenceType: string;
  referenceId: number;
  index: number;
  snapshotCredit: number;
  snapshotDebit: number;
  currentCredit: number | null;
  currentDebit: number | null;
  difference: number;
}

export interface IBankReconciliationTransactionsResult {
  rows: IBankReconciliationTransactionRow[];
  changedTransactions: IChangedReconciledTransaction[];
}

export interface IBankReconciliationMeta {
  accountId: number;
  accountName: string;
  currencyCode: string;
  accountAmount: number;
  bankBalance: number | null;
  isSupported: boolean;
  unsupportedReason: string | null;
  hasInProgress: boolean;
  inProgressId: number | null;
  lastReconciledEndDate: string | null;
  firstTransactionDate: string | null;
  suggestedStartDate: string;
  suggestedEndDate: string;
  uncategorizedTransactionsCount: number;
}

export interface IBankReconciliationDetailMeta {
  isLatest: boolean;
  canUndo: boolean;
  canDelete: boolean;
  uncategorizedTransactionsCount: number;
  changedTransactions: IChangedReconciledTransaction[];
}

export const BANK_RECONCILIATION_STATUS_LABELS: Record<
  BankReconciliationStatus,
  string
> = {
  [BankReconciliationStatus.InProgress]: 'In progress',
  [BankReconciliationStatus.Reconciled]: 'Reconciled',
  [BankReconciliationStatus.Voided]: 'Voided',
};
