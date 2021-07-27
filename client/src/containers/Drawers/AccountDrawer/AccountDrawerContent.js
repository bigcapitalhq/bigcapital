import React from 'react';

import 'style/components/Drawers/AccountDrawer.scss';

import { AccountDrawerProvider } from './AccountDrawerProvider';
import AccountDrawerDetails from './AccountDrawerDetails';

/**
 * Account drawer content.
 */
export default function AccountDrawerContent({
  // #ownProp
  accountId,
  name
}) {
  return (
    <AccountDrawerProvider name={name} accountId={accountId}>
      <AccountDrawerDetails />
    </AccountDrawerProvider>
  );
}