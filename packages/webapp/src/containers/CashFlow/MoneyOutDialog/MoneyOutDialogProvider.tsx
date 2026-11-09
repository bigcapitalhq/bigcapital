import { keepPreviousData } from '@tanstack/react-query';
import React, { useState } from 'react';
import type {
  AccountsList,
  BankingAccountsListResponse,
  BranchesListResponse,
  CreateCashflowTransactionBody,
} from '@bigcapital/sdk-ts';
import { DialogContent } from '@/components';
import { Features } from '@/constants';
import {
  useAccounts,
  useBranches,
  useCreateCashflowTransaction,
  useCashflowAccounts,
  useSettingCashFlow,
} from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

interface SubmitPayload {
  publish?: boolean;
  [key: string]: unknown;
}

export interface MoneyOutDialogContentValue {
  accounts: AccountsList;
  branches: BranchesListResponse;
  accountId: number | null;
  defaultAccountId?: number | null;
  setAccountId: React.Dispatch<React.SetStateAction<number | null>>;
  accountType?: string | null;
  isAccountsLoading: boolean;
  isBranchesSuccess: boolean;
  cashflowAccounts: BankingAccountsListResponse;
  submitPayload: SubmitPayload;
  dialogName?: string;
  createCashflowTransactionMutate: (
    body: CreateCashflowTransactionBody,
  ) => Promise<void>;
  setSubmitPayload: React.Dispatch<React.SetStateAction<SubmitPayload>>;
}

interface MoneyOutProviderProps {
  accountId?: number | null;
  accountType?: string | null;
  dialogName?: string;
  children?: React.ReactNode;
}

const MoneyOutDialogContentContext =
  React.createContext<MoneyOutDialogContentValue>(
    {} as MoneyOutDialogContentValue,
  );

/**
 * Money out dialog provider.
 */
function MoneyOutProvider({
  accountId: defaultAccountId,
  accountType,
  dialogName,
  children,
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

  // Fetch cash flow list.
  const { data: cashflowAccounts, isLoading: isCashFlowAccountsLoading } =
    useCashflowAccounts({}, { placeholderData: keepPreviousData });

  // Mutation to create a new cashflow account.
  const { mutateAsync: createCashflowTransactionMutate } =
    useCreateCashflowTransaction();

  // Handle fetching settings.
  const { isLoading: isSettingsLoading } = useSettingCashFlow();

  // Submit payload.
  const [submitPayload, setSubmitPayload] = useState<SubmitPayload>({});

  // Provider data.
  const provider: MoneyOutDialogContentValue = {
    accountId,
    setAccountId,
    defaultAccountId,

    accounts: (accounts ?? []) as AccountsList,
    accountType,
    branches: (branches ?? []) as BranchesListResponse,
    isAccountsLoading,
    isBranchesSuccess,

    cashflowAccounts: (cashflowAccounts ?? []) as BankingAccountsListResponse,

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
      <MoneyOutDialogContentContext.Provider value={provider}>
        {children}
      </MoneyOutDialogContentContext.Provider>
    </DialogContent>
  );
}

const useMoneyOutDialogContext = () =>
  React.useContext(MoneyOutDialogContentContext);

export { MoneyOutProvider, useMoneyOutDialogContext };
