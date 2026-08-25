export interface LockingTransactionsFormValues {
  module: string;
  lock_to_date: string;
  reason: string;
  [key: string]: unknown;
}

export type LockingTransactionsDialogPayload = {
  module?: string;
  isEnabled?: boolean;
};

export type LockingTransactionsContextValue = {
  dialogName: string;
  moduleName: string;
  transactionLocking: unknown;
  isEnabled: boolean;
  createLockingTransactionMutate: (
    values: Record<string, unknown>,
  ) => Promise<unknown>;
};
