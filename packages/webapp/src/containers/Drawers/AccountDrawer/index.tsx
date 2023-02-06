// @ts-nocheck
import React, { lazy } from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import withDrawers from '@/containers/Drawer/withDrawers';

import { compose } from '@/utils';

const AccountDrawerContent = lazy(() => import('./AccountDrawerContent'));

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

export default compose(withDrawers())(AccountDrawer);
