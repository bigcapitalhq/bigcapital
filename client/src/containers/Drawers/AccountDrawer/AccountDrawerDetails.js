import React from 'react';

import AccountDrawerActionBar from './AccountDrawerActionBar';
import AccountDrawerHeader from './AccountDrawerHeader';
import AccountDrawerTable from './AccountDrawerTable';
import { useAccountDrawerContext } from './AccountDrawerProvider';

import 'style/components/Drawer/AccountDrawer.scss';

/**
 * Account view details.
 */
export default function AccountDrawerDetails() {
  const { account, accounts } = useAccountDrawerContext();

  return (
    <div className={'account-drawer'}>
      <AccountDrawerActionBar account={account} />
      <AccountDrawerHeader account={account} />
      <AccountDrawerTable />
    </div>
  );
}
