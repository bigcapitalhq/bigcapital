import React from 'react';
import { useMoneyInDailogContext } from './MoneyInDialogProvider';
import type { Account } from '@bigcapital/sdk-ts';
import { DialogContent } from '@/components';
import { useAccount } from '@/hooks/query';

interface MoneyInFieldsContextValue {
  account?: Account;
}

interface MoneyInFieldsProviderProps {
  children?: React.ReactNode;
}

const MoneyInFieldsContext = React.createContext<MoneyInFieldsContextValue>(
  {} as MoneyInFieldsContextValue,
);

/**
 * Money in dialog provider.
 */
function MoneyInFieldsProvider({ children }: MoneyInFieldsProviderProps) {
  const { accountId } = useMoneyInDailogContext();

  // Fetches the specific account details.
  const { data: account, isLoading: isAccountLoading } = useAccount(accountId, {
    enabled: !!accountId,
  });
  // Provider data.
  const provider: MoneyInFieldsContextValue = {
    account,
  };
  const isLoading = isAccountLoading;

  return (
    <DialogContent isLoading={isLoading}>
      <MoneyInFieldsContext.Provider value={provider}>
        {children}
      </MoneyInFieldsContext.Provider>
    </DialogContent>
  );
}

const useMoneyInFieldsContext = () => React.useContext(MoneyInFieldsContext);

export { MoneyInFieldsProvider, useMoneyInFieldsContext };
