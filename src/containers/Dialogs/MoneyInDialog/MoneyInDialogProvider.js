import React from 'react';
import { DialogContent } from 'components';
import {
  useCreateCashflowTransaction,
  useAccounts,
  useCashflowAccounts,
} from 'hooks/query';

const MoneyInDialogContent = React.createContext();

/**
 * Money in dialog provider.
 */
function MoneyInDialogProvider({
  accountId,
  accountType,
  dialogName,
  ...props
}) {
  // Fetches accounts list.
  const { isFetching: isAccountsLoading, data: accounts } = useAccounts();

  // Fetch cash flow list .
  const { data: cashflowAccounts, isLoading: isCashFlowAccountsLoading } =
    useCashflowAccounts({}, { keepPreviousData: true });

  const { mutateAsync: createCashflowTransactionMutate } =
    useCreateCashflowTransaction();

  // Submit payload.
  const [submitPayload, setSubmitPayload] = React.useState({});

  //  provider.
  const provider = {
    accounts,
    accountId,
    accountType,
    isAccountsLoading,

    cashflowAccounts,

    submitPayload,
    dialogName,

    createCashflowTransactionMutate,
    setSubmitPayload,
  };

  return (
    <DialogContent isLoading={isAccountsLoading || isCashFlowAccountsLoading}>
      <MoneyInDialogContent.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useMoneyInDailogContext = () => React.useContext(MoneyInDialogContent);

export { MoneyInDialogProvider, useMoneyInDailogContext };
