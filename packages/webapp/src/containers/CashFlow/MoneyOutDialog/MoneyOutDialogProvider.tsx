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
  useAccounts,
  useBranches,
  useCreateCashflowTransaction,
  useCashflowAccounts,
  useSettingCashFlow,
} from '@/hooks/query';

type MoneyOutSubmitPayload = Record<string, unknown>;

type MoneyOutDialogContextValue = {
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
  submitPayload: MoneyOutSubmitPayload;
  setSubmitPayload: React.Dispatch<React.SetStateAction<MoneyOutSubmitPayload>>;
  createCashflowTransactionMutate: (
    values: CreateCashflowTransactionBody,
  ) => Promise<void>;
};

type MoneyOutProviderProps = {
  accountId?: number;
  accountType?: string;
  dialogName?: string;
  children?: React.ReactNode;
};

const MoneyInDialogContent = React.createContext<
  MoneyOutDialogContextValue | undefined
>(undefined);

/**
 * Money out dialog provider.
 */
function MoneyOutProvider({
  accountId: defaultAccountId,
  accountType,
  dialogName,
  ...props
}: MoneyOutProviderProps) {
  // Holds the selected account id of the dialog.
  const [accountId, setAccountId] = useState<number | null>(
    defaultAccountId ?? null,
  );

  // Features guard.
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

  // Fetch cash flow list .
  const { data: cashflowAccountsData, isLoading: isCashFlowAccountsLoading } =
    useCashflowAccounts(
      {},
      { placeholderData: (previousData) => previousData },
    );
  const cashflowAccounts = cashflowAccountsData as
    | BankingAccountsListResponse
    | undefined;

  // Mutation to create a new cashflow account.
  const { mutateAsync: createCashflowTransactionMutate } =
    useCreateCashflowTransaction();

  // Handle fetching settings.
  const { isLoading: isSettingsLoading } = useSettingCashFlow();

  // Submit payload.
  const [submitPayload, setSubmitPayload] =
    React.useState<MoneyOutSubmitPayload>({});

  // Provider data.
  const provider: MoneyOutDialogContextValue = {
    accountId,
    setAccountId,
    defaultAccountId,

    accounts,
    accountType,
    branches,
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

const useMoneyOutDialogContext = (): MoneyOutDialogContextValue => {
  const ctx = React.useContext(MoneyInDialogContent);
  if (!ctx) {
    throw new Error(
      'useMoneyOutDialogContext must be used within MoneyOutProvider',
    );
  }
  return ctx;
};

export { MoneyOutProvider, useMoneyOutDialogContext };
