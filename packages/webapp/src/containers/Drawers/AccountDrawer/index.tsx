import * as FF from 'fp-ts/function';
import React, { lazy } from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers, WithDrawersProps } from '@/containers/Drawer/withDrawers';

const AccountDrawerContent = lazy(() =>
  import('./AccountDrawerContent').then((m) => ({
    default: m.AccountDrawerContent,
  })),
);

interface AccountDrawerProps extends WithDrawersProps {
  name: string;
}

/**
 * Account drawer.
 */
function AccountDrawer({
  name,
  // #withDrawer
  isOpen,
  payload,
}: AccountDrawerProps) {
  const accountId = payload?.accountId as number | undefined;

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

export const index = FF.pipe(AccountDrawer, withDrawers());
