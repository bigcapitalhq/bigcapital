import type { useCreateBadDebt } from '@/hooks/query';
import type { Account } from '@bigcapital/sdk-ts';

/** Loose invoice shape: form code reads `currencyCode` / `dueAmount` / `invoiceDate`. */
export interface BadDebtInvoice {
  id: number;
  dueAmount?: number;
  currencyCode?: string;
  invoiceDate?: string;
  [key: string]: unknown;
}

export interface BadDebtFormValues {
  expenseAccountId: number | string;
  reason: string;
  amount: number | string;
  // The write-off date (YYYY-MM-DD).
  date: string;
  currencyCode?: string;
  [key: string]: unknown;
}

export type BadDebtDialogPayload = {
  invoiceId?: number | null;
};

export type BadDebtContextValue = {
  accounts: Account[] | undefined;
  invoice: BadDebtInvoice | undefined;
  invoiceId?: number | null;
  dialogName: string;
  createBadDebtMutate: ReturnType<typeof useCreateBadDebt>['mutateAsync'];
};
