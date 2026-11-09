import type { useCreatePaymentMade } from '@/hooks/query';
import type { Account, Branch } from '@bigcapital/sdk-ts';

/** Quick payment made bill (loose shape: form code reads camelCase fields). */
export interface QuickPaymentMadeBill {
  id: number;
  dueAmount?: number;
  vendorId?: number | string;
  currencyCode?: string;
  [key: string]: unknown;
}

export interface QuickPaymentMadeFormValues {
  billId: number | string;
  vendorId: number | string;
  paymentAccountId: number | string;
  paymentDate: string;
  reference: string;
  paymentNumber: string;
  amount: number | string;
  exchangeRate: number;
  branchId: number | string;
  currencyCode?: string;
  statement?: string;
  [key: string]: unknown;
}

export type QuickPaymentMadeDialogPayload = {
  billId?: number | null;
};

export type QuickPaymentMadeContextValue = {
  dialogName: string;
  query?: Record<string, unknown>;
  bill: QuickPaymentMadeBill | undefined;
  accounts: Account[] | undefined;
  branches: Branch[] | undefined;
  isBranchesSuccess: boolean;
  createPaymentMadeMutate: ReturnType<
    typeof useCreatePaymentMade
  >['mutateAsync'];
};
