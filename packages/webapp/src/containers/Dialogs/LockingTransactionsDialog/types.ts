export interface LockingTransactionsFormValues {
  module: string;
  lockToDate: string;
  reason: string;
  [key: string]: unknown;
}

export type LockingTransactionsDialogPayload = {
  module?: string;
  isEnabled?: boolean;
  /** Prefills the lock date, e.g. the end of the month being locked. */
  lockToDate?: string;
};

export type LockingTransactionsContextValue = {
  dialogName: string;
  moduleName: string;
  transactionLocking: unknown;
  isEnabled: boolean;
  lockToDate?: string;
  createLockingTransactionMutate: (
    values: Record<string, unknown>,
  ) => Promise<unknown>;
};
