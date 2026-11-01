export interface UnlockingTransactionsFormValues {
  module: string;
  reason: string;
  [key: string]: unknown;
}

export type UnlockingTransactionsDialogPayload = {
  module?: string;
};

export type UnlockingTransactionsContextValue = {
  dialogName: string;
  moduleName: string;
  cancelLockingTransactionMutate: (
    values: Record<string, unknown>,
  ) => Promise<unknown>;
  // FIXME: latent bug — the form destructures this from context but the
  // provider never supplies it; always undefined at runtime.
  cancelUnLockingPartialTransactionMutate?: (
    values: Record<string, unknown>,
  ) => Promise<unknown>;
};
