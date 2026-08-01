import type { ApplyVendorCreditToBillsBody } from '@bigcapital/sdk-ts';

export interface ReconcileVendorCreditFormEntry {
  id?: number | string;
  billId: number | string;
  amount: number | string;
  dueAmount?: number;
  formattedBillDate?: string;
  billNumber?: string;
  formattedAmount?: string;
  formattedDueAmount?: string;
  [key: string]: unknown;
}

export interface ReconcileVendorCreditFormValues {
  entries: ReconcileVendorCreditFormEntry[];
  [key: string]: unknown;
}

export type ReconcileVendorCreditDialogPayload = {
  vendorCreditId?: number | null;
};

// Loose VendorCredit shape — see ReconcileCreditNote sibling for rationale.
export interface ReconcileVendorCredit {
  id: number;
  formattedCreditsRemaining?: string;
  creditsRemaining?: number;
  currencyCode?: string;
  [key: string]: unknown;
}

export type ReconcileVendorCreditContextValue = {
  dialogName: string;
  reconcileVendorCredits: ReconcileVendorCreditFormEntry[];
  createReconcileVendorCreditMutate: (
    vars: [number, ApplyVendorCreditToBillsBody],
  ) => Promise<unknown>;
  isEmptyStatus: boolean;
  vendorCredit: ReconcileVendorCredit | undefined;
};
