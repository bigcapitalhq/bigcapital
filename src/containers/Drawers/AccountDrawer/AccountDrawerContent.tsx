// @ts-nocheck
import React from 'react';
import { DrawerBody } from '@/components';

import '@/style/components/Drawers/AccountDrawer.scss';

import { AccountDrawerProvider } from './AccountDrawerProvider';
import AccountDrawerDetails from './AccountDrawerDetails';

/**
 * Account drawer content.
 */
export default function AccountDrawerContent({
  // #ownProp
  accountId,
  name,
}) {
  return (
    <AccountDrawerProvider name={name} accountId={accountId}>
      <DrawerBody>
        <AccountDrawerDetails />
      </DrawerBody>
    </AccountDrawerProvider>
  );
}
