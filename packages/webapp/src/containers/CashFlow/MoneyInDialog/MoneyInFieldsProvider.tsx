import React from 'react';
import type { Account } from '@bigcapital/sdk-ts';
import { DialogContent } from '@/components';
import { useAccount } from '@/hooks/query';
import { useMoneyInDailogContext } from './MoneyInDialogProvider';

type MoneyInFieldsContextValue = {
  account: Account | undefined;
};

const MoneyInFieldsContext = React.createContext<
  MoneyInFieldsContextValue | undefined
>(undefined);

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
  const provider: MoneyInFieldsContextValue = {
    account,
  };
  const isLoading = isAccountLoading;

  return (
    <DialogContent isLoading={isLoading}>
      <MoneyInFieldsContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useMoneyInFieldsContext = (): MoneyInFieldsContextValue => {
  const ctx = React.useContext(MoneyInFieldsContext);
  if (!ctx) {
    throw new Error(
      'useMoneyInFieldsContext must be used within MoneyInFieldsProvider',
    );
  }
  return ctx;
};

export { MoneyInFieldsProvider, useMoneyInFieldsContext };
