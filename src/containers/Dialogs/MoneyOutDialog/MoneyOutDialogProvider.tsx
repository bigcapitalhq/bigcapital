// @ts-nocheck
import React from 'react';
import { DialogContent } from '@/components';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import {
  useAccounts,
  useAccount,
  useBranches,
  useCreateCashflowTransaction,
  useCashflowAccounts,
  useSettingCashFlow,
} from '@/hooks/query';

const MoneyInDialogContent = React.createContext();

/**
 * Money out dialog provider.
 */
function MoneyOutProvider({ accountId, accountType, dialogName, ...props }) {
  // Features guard.
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);

  // Fetches accounts list.
  const { isLoading: isAccountsLoading, data: accounts } = useAccounts();

  // Fetches the specific account details.
  const { data: account, isLoading: isAccountLoading } = useAccount(accountId, {
    enabled: !!accountId,
  });

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches({}, { enabled: isBranchFeatureCan });

  // Fetch cash flow list .
  const { data: cashflowAccounts, isLoading: isCashFlowAccountsLoading } =
    useCashflowAccounts({}, { keepPreviousData: true });

  const { mutateAsync: createCashflowTransactionMutate } =
    useCreateCashflowTransaction();

  // Handle fetching settings.
  const { isLoading: isSettingsLoading } = useSettingCashFlow();

  // Submit payload.
  const [submitPayload, setSubmitPayload] = React.useState({});

  //  provider.
  const provider = {
    accounts,
    account,
    accountId,
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

  return (
    <DialogContent
      isLoading={
        isAccountsLoading ||
        isCashFlowAccountsLoading ||
        isBranchesLoading ||
        isSettingsLoading
      }
    >
      <MoneyInDialogContent.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useMoneyOutDialogContext = () => React.useContext(MoneyInDialogContent);
export { MoneyOutProvider, useMoneyOutDialogContext };
