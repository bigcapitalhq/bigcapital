import React from 'react';
import { DialogContent } from 'components';
import { useAccounts } from 'hooks/query';

const MoneyInDialogContent = React.createContext();

/**
 * Money out dialog provider.
 */
function MoneyOutProvider({ accountId, dialogName, ...props }) {
  // Fetches accounts list.
  const { isFetching: isAccountsLoading, data: accounts } = useAccounts();

  // Submit payload.
  const [submitPayload, setSubmitPayload] = React.useState({});

  //  provider.
  const provider = {
    accounts,
    accountId,
    isAccountsLoading,

    submitPayload,
    dialogName,

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
