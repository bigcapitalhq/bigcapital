// @ts-nocheck
import React from 'react';
import { DialogContent } from '@/components';
import { useAccount } from '@/hooks/query';
import { useMoneyInDailogContext } from './MoneyInDialogProvider';

const MoneyInFieldsContext = React.createContext();

/**
 * Money in dialog provider.
 */
function MoneyInFieldsProvider({ ...props }) {
  const { accountId } = useMoneyInDailogContext();

  // Fetches the specific account details.
  const { data: account, isLoading: isAccountLoading } = useAccount(accountId, {
    enabled: !!accountId,
  });
  // Provider data.
  const provider = {
    account,
  };
  const isLoading = isAccountLoading;

  return (
    <DialogContent isLoading={isLoading}>
      <MoneyInFieldsContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useMoneyInFieldsContext = () => React.useContext(MoneyInFieldsContext);

export { MoneyInFieldsProvider, useMoneyInFieldsContext };
