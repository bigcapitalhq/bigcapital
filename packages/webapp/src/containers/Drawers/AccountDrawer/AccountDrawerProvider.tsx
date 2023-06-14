// @ts-nocheck
import React from 'react';
import { useAccount, useAccountTransactions } from '@/hooks/query';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { DRAWERS } from '@/constants/drawers';

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

  // Provider.
  const provider = {
    accountId,
    account,
    accounts,
    drawerName: name,
  };

  return (
    <DrawerLoading loading={isAccountLoading || isAccountsLoading}>
      <DrawerHeaderContent name={DRAWERS.ACCOUNT_DETAILS} title={drawerTitle} />
      <AccountDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useAccountDrawerContext = () => React.useContext(AccountDrawerContext);

export { AccountDrawerProvider, useAccountDrawerContext };
