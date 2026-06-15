// @ts-nocheck
import React, { lazy } from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { flow } from 'fp-ts/function';

const AccountDrawerContent = lazy(() =>
  import('./AccountDrawerContent').then((m) => ({
    default: m.AccountDrawerContent,
  })),
);

/**
 * Account drawer.
 */
function AccountDrawer({
  name,
  // #withDrawer
  isOpen,
  payload: { accountId },
}) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      style={{ minWidth: '700px', maxWidth: '900px' }}
      size={'65%'}
    >
      <DrawerSuspense>
        <AccountDrawerContent name={name} accountId={accountId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export const index = flow(withDrawers())(AccountDrawer);
