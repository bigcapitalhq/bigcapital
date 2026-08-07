export interface UnlockingPartialTransactionsFormValues {
  module: string;
  unlockFromDate: string;
  unlockToDate: string;
  reason: string;
  [key: string]: unknown;
}

export type UnlockingPartialTransactionsDialogPayload = {
  module?: string;
};

export type UnlockingPartialTransactionsContextValue = {
  dialogName: string;
  moduleName: string;
  createUnlockingPartialTransactionsMutate: (
    values: Record<string, unknown>,
  ) => Promise<unknown>;
};
