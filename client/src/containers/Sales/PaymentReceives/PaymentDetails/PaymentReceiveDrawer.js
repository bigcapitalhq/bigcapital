import React, { lazy } from 'react';
import withDrawers from 'containers/Drawer/withDrawers';
import withDrawerActions from 'containers/Drawer/withDrawerActions';
import { Drawer, DrawerSuspense } from 'components';

import { compose } from 'utils';

const PaymentReceiveDrawerContent = lazy(() =>
  import('./PaymentReceiveDrawerContent'),
);

/**
 *  payment receive drawer.
 */
function PaymentReceiveDrawer({
  name,
  //#withDrawer
  isOpen,
  payload: { paymentReceiveId },

  closeDrawer,
}) {
  // handle close Drawer
  const handleDrawerClose = () => {
    closeDrawer(name);
  };

  return (
    <Drawer isOpen={isOpen} isClose={handleDrawerClose}>
      <DrawerSuspense>
        <PaymentReceiveDrawerContent paymentReceiveId={paymentReceiveId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export default compose(withDrawers(), withDrawerActions)(PaymentReceiveDrawer);
