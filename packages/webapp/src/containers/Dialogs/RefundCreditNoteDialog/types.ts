import type {
  AccountsList,
  BranchesListResponse,
  CreateRefundCreditNoteBody,
} from '@bigcapital/sdk-ts';

export interface RefundCreditNoteFormValues {
  fromAccountId: string | number;
  date: string;
  referenceNo: string;
  description: string;
  amount: string | number;
  exchangeRate: number;
  branchId?: number | string;
  currencyCode?: string;
  creditsRemaining?: number;
  [key: string]: unknown;
}

export type RefundCreditNoteDialogPayload = {
  creditNoteId?: number | null;
};

// Local shape built by the provider — a subset of `CreditNote` plus `amount`.
export interface RefundCreditNoteSummary {
  id: number;
  creditsRemaining: number;
  currencyCode: string;
  amount: number;
}

export type RefundCreditNoteContextValue = {
  creditNote: RefundCreditNoteSummary | undefined;
  accounts: AccountsList | undefined;
  branches: BranchesListResponse | undefined;
  dialogName: string;
  isBranchesSuccess: boolean;
  createRefundCreditNoteMutate: (
    vars: [number, CreateRefundCreditNoteBody],
  ) => Promise<unknown>;
};
