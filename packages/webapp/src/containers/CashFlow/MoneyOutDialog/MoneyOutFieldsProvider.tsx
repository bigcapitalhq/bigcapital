import React from 'react';
import { useMoneyOutDialogContext } from './MoneyOutDialogProvider';
import type { Account } from '@bigcapital/sdk-ts';
import { DialogContent } from '@/components';
import { useAccount } from '@/hooks/query';

interface MoneyOutFieldsContextValue {
  account?: Account;
}

interface MoneyOutFieldsProviderProps {
  children?: React.ReactNode;
}

const MoneyOutFieldsContext = React.createContext<MoneyOutFieldsContextValue>(
  {} as MoneyOutFieldsContextValue,
);

/**
 * Money out fields dialog provider.
 */
function MoneyOutFieldsProvider({ children }: MoneyOutFieldsProviderProps) {
  const { accountId } = useMoneyOutDialogContext();

  // Fetches the specific account details.
  const { data: account, isLoading: isAccountLoading } = useAccount(accountId, {
    enabled: !!accountId,
  });
  // Provider data.
  const provider: MoneyOutFieldsContextValue = {
    account,
  };
  const isLoading = isAccountLoading;

  return (
    <DialogContent isLoading={isLoading}>
      <MoneyOutFieldsContext.Provider value={provider}>
        {children}
      </MoneyOutFieldsContext.Provider>
    </DialogContent>
  );
}

const useMoneyOutFieldsContext = () => React.useContext(MoneyOutFieldsContext);

export { MoneyOutFieldsProvider, useMoneyOutFieldsContext };
