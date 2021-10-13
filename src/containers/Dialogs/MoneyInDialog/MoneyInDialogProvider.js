import React from 'react';
import { DialogContent } from 'components';
import { useCreateCashflowTransaction, useAccounts } from 'hooks/query';

const MoneyInDialogContent = React.createContext();

/**
 * Money in dialog provider.
 */
function MoneyInDialogProvider({ accountId, dialogName, ...props }) {
  // Fetches accounts list.
  const { isFetching: isAccountsLoading, data: accounts } = useAccounts();

  const { mutateAsync: createCashflowTransactionMutate } =
    useCreateCashflowTransaction();

  // Submit payload.
  const [submitPayload, setSubmitPayload] = React.useState({});

  //  provider.
  const provider = {
    accounts,
    accountId,
    isAccountsLoading,

    submitPayload,
    dialogName,

    createCashflowTransactionMutate,
    setSubmitPayload,
  };

  return (
    <DialogContent isLoading={isAccountsLoading}>
      <MoneyInDialogContent.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useMoneyInDailogContext = () => React.useContext(MoneyInDialogContent);

export { MoneyInDialogProvider, useMoneyInDailogContext };
