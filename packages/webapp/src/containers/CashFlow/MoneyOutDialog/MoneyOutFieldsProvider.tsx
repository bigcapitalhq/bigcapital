import React from 'react';
import type { Account } from '@bigcapital/sdk-ts';
import { DialogContent } from '@/components';
import { useAccount } from '@/hooks/query';
import { useMoneyOutDialogContext } from './MoneyOutDialogProvider';

type MoneyOutFieldsContextValue = {
  account: Account | undefined;
};

const MoneyOutFieldsContext = React.createContext<
  MoneyOutFieldsContextValue | undefined
>(undefined);

/**
 * Money out fields dialog provider.
 */
function MoneyOutFieldsProvider({ ...props }) {
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
      <MoneyOutFieldsContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useMoneyOutFieldsContext = (): MoneyOutFieldsContextValue => {
  const ctx = React.useContext(MoneyOutFieldsContext);
  if (!ctx) {
    throw new Error(
      'useMoneyOutFieldsContext must be used within MoneyOutFieldsProvider',
    );
  }
  return ctx;
};

export { MoneyOutFieldsProvider, useMoneyOutFieldsContext };
