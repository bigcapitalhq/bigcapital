import type { ApplyCreditNoteToInvoicesBody } from '@bigcapital/sdk-ts';

export interface ReconcileCreditNoteFormEntry {
  id?: number | string;
  invoiceId: number | string;
  amount: number | string;
  balance?: number;
  formattedInvoiceDate?: string;
  invoiceNo?: string;
  formattedAmount?: string;
  formattedDueAmount?: string;
  [key: string]: unknown;
}

export interface ReconcileCreditNoteFormValues {
  entries: ReconcileCreditNoteFormEntry[];
  [key: string]: unknown;
}

export type ReconcileCreditNoteDialogPayload = {
  creditNoteId?: number | null;
};

// Loose CreditNote shape — matches the camelCase runtime response from the
// `useReconcileCreditNote` / `useCreditNote` queries (both now
// `enableCamelCaseTransform: true`).
export interface ReconcileCreditNote {
  id: number;
  formattedCreditsRemaining?: string;
  creditsRemaining?: number;
  currencyCode?: string;
  [key: string]: unknown;
}

export type ReconcileCreditNoteContextValue = {
  dialogName: string;
  reconcileCreditNotes: ReconcileCreditNoteFormEntry[];
  createReconcileCreditNoteMutate: (
    vars: [number, ApplyCreditNoteToInvoicesBody],
  ) => Promise<unknown>;
  isEmptyStatus: boolean;
  creditNote: ReconcileCreditNote | undefined;
  creditNoteId: number | null;
};
