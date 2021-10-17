import React from 'react';
import { DialogContent } from 'components';
import { useAccounts, useCreateCashflowTransaction } from 'hooks/query';

const MoneyInDialogContent = React.createContext();

/**
 * Money out dialog provider.
 */
function MoneyOutProvider({ accountId, dialogName, ...props }) {
  // Fetches accounts list.
  const {
    isFetching: isAccountFetching,
    isLoading: isAccountsLoading,
    data: accounts,
  } = useAccounts();

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

const useMoneyOutDialogContext = () => React.useContext(MoneyInDialogContent);
export { MoneyOutProvider, useMoneyOutDialogContext };
