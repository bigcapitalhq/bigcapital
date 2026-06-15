import React, { useState } from 'react';
import type {
  AccountsList,
  BranchesListResponse,
  BankingAccountsListResponse,
  CreateCashflowTransactionBody,
} from '@bigcapital/sdk-ts';
import { DialogContent } from '@/components';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import {
  useCreateCashflowTransaction,
  useAccounts,
  useBranches,
  useCashflowAccounts,
  useSettingCashFlow,
} from '@/hooks/query';

type MoneyInSubmitPayload = Record<string, unknown>;

type MoneyInDialogContextValue = {
  accountId: number | null;
  setAccountId: React.Dispatch<React.SetStateAction<number | null>>;
  defaultAccountId: number | undefined;
  accountType: string | undefined;
  dialogName: string | undefined;
  accounts: AccountsList | undefined;
  branches: BranchesListResponse | undefined;
  cashflowAccounts: BankingAccountsListResponse | undefined;
  isAccountsLoading: boolean;
  isBranchesSuccess: boolean;
  submitPayload: MoneyInSubmitPayload;
  setSubmitPayload: React.Dispatch<React.SetStateAction<MoneyInSubmitPayload>>;
  createCashflowTransactionMutate: (
    values: CreateCashflowTransactionBody,
  ) => Promise<void>;
};

type MoneyInDialogProviderProps = {
  accountId?: number;
  accountType?: string;
  dialogName?: string;
  children?: React.ReactNode;
};

const MoneyInDialogContent = React.createContext<
  MoneyInDialogContextValue | undefined
>(undefined);

/**
 * Money in dialog provider.
 */
function MoneyInDialogProvider({
  accountId: defaultAccountId,
  accountType,
  dialogName,
  ...props
}: MoneyInDialogProviderProps) {
  // Holds the selected account id of the dialog.
  const [accountId, setAccountId] = useState<number | null>(
    defaultAccountId ?? null,
  );

  // Detarmines whether the feature is enabled.
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);

  // Fetches accounts list.
  const { isLoading: isAccountsLoading, data: accounts } = useAccounts();

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches({}, { enabled: isBranchFeatureCan });

  // Fetch cash flow list.
  const { data: cashflowAccountsData, isLoading: isCashFlowAccountsLoading } =
    useCashflowAccounts(
      {},
      { placeholderData: (previousData) => previousData },
    );
  const cashflowAccounts = cashflowAccountsData as
    | BankingAccountsListResponse
    | undefined;

  // Mutation create cashflow transaction.
  const { mutateAsync: createCashflowTransactionMutate } =
    useCreateCashflowTransaction();

  // Handle fetching settings.
  const { isLoading: isSettingsLoading } = useSettingCashFlow();

  // Submit payload.
  const [submitPayload, setSubmitPayload] =
    React.useState<MoneyInSubmitPayload>({});

  // Provider data.
  const provider: MoneyInDialogContextValue = {
    accounts,
    branches,

    accountId,
    defaultAccountId,
    setAccountId,

    accountType,
    isAccountsLoading: isAccountsLoading ?? false,
    isBranchesSuccess: isBranchesSuccess ?? false,

    cashflowAccounts,

    submitPayload,
    dialogName,

    createCashflowTransactionMutate,
    setSubmitPayload,
  };

  const isLoading =
    isAccountsLoading ||
    isCashFlowAccountsLoading ||
    isBranchesLoading ||
    isSettingsLoading;

  return (
    <DialogContent isLoading={isLoading}>
      <MoneyInDialogContent.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useMoneyInDailogContext = (): MoneyInDialogContextValue => {
  const ctx = React.useContext(MoneyInDialogContent);
  if (!ctx) {
    throw new Error(
      'useMoneyInDailogContext must be used within MoneyInDialogProvider',
    );
  }
  return ctx;
};

export { MoneyInDialogProvider, useMoneyInDailogContext };
