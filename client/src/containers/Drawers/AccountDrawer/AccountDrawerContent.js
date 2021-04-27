import React from 'react';
import { AccountDrawerProvider } from './AccountDrawerProvider';
import AccountDrawerDetails from './AccountDrawerDetails';

/**
 * Account drawer content.
 */
export default function AccountDrawerContent({
  // #ownProp
  accountId,
}) {
  return (
    <AccountDrawerProvider accountId={accountId}>
      <AccountDrawerDetails />
    </AccountDrawerProvider>
  );
}
