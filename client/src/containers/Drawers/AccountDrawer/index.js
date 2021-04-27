import React, { lazy } from 'react';
import { Drawer, DrawerSuspense } from 'components';
import withDrawers from 'containers/Drawer/withDrawers';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { compose } from 'utils';

const AccountDrawerContent = lazy(() => import('./AccountDrawerContent'));

/**
 * Account drawer.
 */
function AccountDrawer({
  name,
  //#withDrawer
  isOpen,
  payload: { accountId, title },

  closeDrawer,
}) {
  // Handle close drawer.
  const handleDrawerClose = () => {
    closeDrawer(name);
  };

  return (
    <Drawer isOpen={isOpen} title={title} isClose={handleDrawerClose}>
      <DrawerSuspense>
        <AccountDrawerContent accountId={accountId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export default compose(withDrawers(), withDrawerActions)(AccountDrawer);
