import { Currency } from '@bigcapital/sdk-ts';
import type {
  useCreateAccount,
  useEditAccount,
  useAccounts,
  useAccountsTypes,
  useAccount,
} from '@/hooks/query';

export interface AccountFormValues {
  accountType: string;
  parentAccountId: number | string | null;
  name: string;
  code: string;
  description: string;
  currencyCode: string;
  subaccount: boolean;
  [key: string]: unknown;
}

export interface AccountDialogPayload {
  action?: string;
  accountId?: number | null;
  accountType?: string;
  parentAccountId?: number | string;
  [key: string]: unknown;
}

export interface AccountDialogFieldsDisabled {
  accountType: boolean;
}

export type AccountDialogContextValue = {
  dialogName: string;
  payload: AccountDialogPayload;
  fieldsDisabled: AccountDialogFieldsDisabled;
  currencies: Currency[] | undefined;
  createAccountMutate: ReturnType<typeof useCreateAccount>['mutateAsync'];
  editAccountMutate: ReturnType<typeof useEditAccount>['mutateAsync'];
  accounts: ReturnType<typeof useAccounts>['data'];
  accountsTypes: ReturnType<typeof useAccountsTypes>['data'];
  account: ReturnType<typeof useAccount>['data'];
  isAccountsLoading: boolean;
  isCurrenciesLoading: boolean;
  isNewMode: boolean;
};
