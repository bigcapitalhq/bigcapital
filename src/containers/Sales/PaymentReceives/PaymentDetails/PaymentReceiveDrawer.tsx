import React, { lazy } from 'react';
import withDrawers from '@/containers/Drawer/withDrawers';
import { Drawer, DrawerSuspense } from '@/components';

import { compose } from '@/utils';

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

}) {
  
  return (
    <Drawer isOpen={isOpen} name={name}>
      <DrawerSuspense>
        <PaymentReceiveDrawerContent paymentReceiveId={paymentReceiveId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export default compose(withDrawers())(PaymentReceiveDrawer);
