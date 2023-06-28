// @ts-nocheck
import React, { useState } from 'react';
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

const MoneyInDialogContent = React.createContext();

/**
 * Money out dialog provider.
 */
function MoneyOutProvider({
  accountId: defaultAccountId,
  accountType,
  dialogName,
  ...props
}) {
  // Holds the selected account id of the dialog.
  const [accountId, setAccountId] = useState<number | null>(defaultAccountId);

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
  const { data: cashflowAccounts, isLoading: isCashFlowAccountsLoading } =
    useCashflowAccounts({}, { keepPreviousData: true });

  // Mutation to create a new cashflow account.
  const { mutateAsync: createCashflowTransactionMutate } =
    useCreateCashflowTransaction();

  // Handle fetching settings.
  const { isLoading: isSettingsLoading } = useSettingCashFlow();

  // Submit payload.
  const [submitPayload, setSubmitPayload] = React.useState({});

  // Provider data.
  const provider = {
    accountId,
    setAccountId,
    defaultAccountId,

    accounts,
    accountType,
    branches,
    isAccountsLoading,
    isBranchesSuccess,

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

const useMoneyOutDialogContext = () => React.useContext(MoneyInDialogContent);
export { MoneyOutProvider, useMoneyOutDialogContext };
