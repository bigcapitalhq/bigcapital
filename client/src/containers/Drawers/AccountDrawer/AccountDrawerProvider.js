import React from 'react';
import { useAccount, useAccountTransactions } from 'hooks/query';
import { DrawerHeaderContent, DashboardInsider } from 'components';

const AccountDrawerContext = React.createContext();

/**
 * Account drawer provider.
 */
function AccountDrawerProvider({ accountId, name, ...props }) {
  // Fetches the specific account details.
  const { data: account, isLoading: isAccountLoading } = useAccount(accountId, {
    enabled: !!accountId,
  });

  // Load the specific account transactions.
  const { data: accounts, isLoading: isAccountsLoading } =
    useAccountTransactions(accountId, {
      enabled: !!accountId,
    });

  // Drawer title.
  const drawerTitle = `${account.name} ${account.code}`;

  // provider.
  const provider = {
    accountId,
    account,
    accounts,
    drawerName: name,
  };

  return (
    <DashboardInsider loading={isAccountLoading || isAccountsLoading}>
      <DrawerHeaderContent name={'account-drawer'} title={drawerTitle} />
      <AccountDrawerContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useAccountDrawerContext = () => React.useContext(AccountDrawerContext);

export { AccountDrawerProvider, useAccountDrawerContext };
