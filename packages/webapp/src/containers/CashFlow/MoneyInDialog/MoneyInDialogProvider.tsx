// @ts-nocheck
import React, { useState } from 'react';
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

const MoneyInDialogContent = React.createContext();

/**
 * Money in dialog provider.
 */
function MoneyInDialogProvider({
  accountId: defaultAccountId,
  accountType,
  dialogName,
  ...props
}) {
  // Holds the selected account id of the dialog.
  const [accountId, setAccountId] = useState<number | null>(defaultAccountId);

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
    useCashflowAccounts({}, { keepPreviousData: true });

  // Mutation create cashflow transaction.
  const { mutateAsync: createCashflowTransactionMutate } =
    useCreateCashflowTransaction();

  // Handle fetching settings.
  const { isLoading: isSettingsLoading } = useSettingCashFlow();

  // Submit payload.
  const [submitPayload, setSubmitPayload] = React.useState({});

  // Provider data.
  const provider = {
    accounts,
    branches,

    accountId,
    defaultAccountId,
    setAccountId,

    accountType,
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

const useMoneyInDailogContext = () => React.useContext(MoneyInDialogContent);

export { MoneyInDialogProvider, useMoneyInDailogContext };
