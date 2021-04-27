import React from 'react';
import { useAccount, useAccountTransactions } from 'hooks/query';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

const AccountDrawerContext = React.createContext();

/**
 * Account drawer provider.
 */
function AccountDrawerProvider({ accountId, ...props }) {
  // Fetches the specific account details.
  const { data: account, isLoading: isAccountLoading } = useAccount(accountId, {
    enabled: !!accountId,
  });

  // Load the specific account transactions.
  const {
    data: accounts,
    isLoading: isAccountsLoading,
  } = useAccountTransactions(accountId, {
    enabled: !!accountId,
  });

  // provider.
  const provider = {
    accountId,
    account,
    accounts,
  };

  return (
    <DashboardInsider loading={isAccountLoading || isAccountsLoading}>
      <AccountDrawerContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useAccountDrawerContext = () => React.useContext(AccountDrawerContext);

export { AccountDrawerProvider, useAccountDrawerContext };
