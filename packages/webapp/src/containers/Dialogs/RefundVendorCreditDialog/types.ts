import type {
  AccountsList,
  BranchesListResponse,
  CreateRefundVendorCreditBody,
} from '@bigcapital/sdk-ts';

export interface RefundVendorCreditFormValues {
  depositAccountId: string | number;
  date: string;
  refundDate?: string;
  referenceNo: string;
  description: string;
  amount: string | number;
  exchangeRate: number;
  branchId?: number | string;
  currencyCode?: string;
  creditsRemaining?: number;
  [key: string]: unknown;
}

export type RefundVendorCreditDialogPayload = {
  vendorCreditId?: number | null;
};

export interface RefundVendorCreditSummary {
  id: number;
  creditsRemaining: number;
  currencyCode: string;
  amount: number;
}

export type RefundVendorCreditContextValue = {
  vendorCredit: RefundVendorCreditSummary | undefined;
  accounts: AccountsList | undefined;
  branches: BranchesListResponse | undefined;
  dialogName: string;
  isBranchesSuccess: boolean;
  createRefundVendorCreditMutate: (
    vars: [number, CreateRefundVendorCreditBody],
  ) => Promise<unknown>;
};
