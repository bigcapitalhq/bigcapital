import { keepPreviousData } from '@tanstack/react-query';
import React, { useState } from 'react';
import type {
  AccountsList,
  BankingAccountsListResponse,
  BranchesListResponse,
  CreateCashflowTransactionBody,
  SettingsGroup,
} from '@bigcapital/sdk-ts';
import { DialogContent } from '@/components';
import { Features } from '@/constants';
import {
  useCreateCashflowTransaction,
  useAccounts,
  useBranches,
  useCashflowAccounts,
  useSettingCashFlow,
} from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

interface SubmitPayload {
  publish?: boolean;
  [key: string]: unknown;
}

export interface MoneyInDialogContentValue {
  accounts: AccountsList;
  branches: BranchesListResponse;
  accountId: number | null;
  defaultAccountId?: number | null;
  setAccountId: React.Dispatch<React.SetStateAction<number | null>>;
  accountType?: string | null;
  isAccountsLoading: boolean;
  isBranchesSuccess: boolean;
  cashflowAccounts: BankingAccountsListResponse;
  cashflowSettings: SettingsGroup | undefined;
  submitPayload: SubmitPayload;
  dialogName?: string;
  createCashflowTransactionMutate: (
    body: CreateCashflowTransactionBody,
  ) => Promise<void>;
  setSubmitPayload: React.Dispatch<React.SetStateAction<SubmitPayload>>;
}

interface MoneyInDialogProviderProps {
  accountId?: number | null;
  accountType?: string | null;
  dialogName?: string;
  children?: React.ReactNode;
}

const MoneyInDialogContent = React.createContext<MoneyInDialogContentValue>(
  {} as MoneyInDialogContentValue,
);

/**
 * Money in dialog provider.
 */
function MoneyInDialogProvider({
  accountId: defaultAccountId,
  accountType,
  dialogName,
  children,
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
  const { data: cashflowAccounts, isLoading: isCashFlowAccountsLoading } =
    useCashflowAccounts({}, { placeholderData: keepPreviousData });

  // Mutation create cashflow transaction.
  const { mutateAsync: createCashflowTransactionMutate } =
    useCreateCashflowTransaction();

  // Handle fetching settings.
  const { isLoading: isSettingsLoading, data: cashflowSettings } =
    useSettingCashFlow();

  // Submit payload.
  const [submitPayload, setSubmitPayload] = useState<SubmitPayload>({});

  // Provider data.
  const provider: MoneyInDialogContentValue = {
    accounts: (accounts ?? []) as AccountsList,
    branches: (branches ?? []) as BranchesListResponse,

    accountId,
    defaultAccountId,
    setAccountId,

    accountType,
    isAccountsLoading,
    isBranchesSuccess,

    cashflowAccounts: (cashflowAccounts ?? []) as BankingAccountsListResponse,

    cashflowSettings,

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
      <MoneyInDialogContent.Provider value={provider}>
        {children}
      </MoneyInDialogContent.Provider>
    </DialogContent>
  );
}

const useMoneyInDailogContext = () => React.useContext(MoneyInDialogContent);

export { MoneyInDialogProvider, useMoneyInDailogContext };
