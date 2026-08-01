import type { useCreatePaymentReceive } from '@/hooks/query';
import type { Account, Branch, SettingsGroup } from '@bigcapital/sdk-ts';

/** Quick payment receive invoice (loose shape: form code reads camelCase fields). */
export interface QuickPaymentReceiveInvoice {
  id: number;
  dueAmount?: number;
  customerId?: number | string;
  currencyCode?: string;
  [key: string]: unknown;
}

export interface QuickPaymentReceiveFormValues {
  invoiceId: number | string;
  customerId: number | string;
  depositAccountId: number | string;
  paymentReceiveNo: string;
  paymentDate: string;
  referenceNo: string;
  amount: number | string;
  exchangeRate: number;
  branchId: number | string;
  currencyCode?: string;
  statement?: string;
  [key: string]: unknown;
}

export type QuickPaymentReceiveDialogPayload = {
  invoiceId?: number | null;
};

export type QuickPaymentReceiveContextValue = {
  dialogName: string;
  baseCurrency?: string;
  query?: Record<string, unknown>;
  accounts: Account[] | undefined;
  branches: Branch[] | undefined;
  invoice: QuickPaymentReceiveInvoice | undefined;
  isAccountsLoading: boolean;
  isSettingsLoading: boolean;
  isBranchesSuccess: boolean;
  paymentReceiveSettings: SettingsGroup | undefined;
  createPaymentReceiveMutate: ReturnType<
    typeof useCreatePaymentReceive
  >['mutateAsync'];
};
