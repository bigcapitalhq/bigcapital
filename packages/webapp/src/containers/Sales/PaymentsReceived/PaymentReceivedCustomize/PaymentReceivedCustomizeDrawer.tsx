// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { Drawer, DrawerSuspense } from '@/components';
import withDrawers from '@/containers/Drawer/withDrawers';

const PaymentReceivedCustomize = React.lazy(
  () => import('./PaymentReceivedCustomize'),
);

/**
 * PaymentReceived customize drawer.
 * @returns {React.ReactNode}
 */
function PaymentReceivedCustomizeDrawerRoot({
  name,
  // #withDrawer
  isOpen,
  payload
}) {
  return (
    <Drawer isOpen={isOpen} name={name} size={'100%'} payload={payload}>
      <DrawerSuspense>
        <PaymentReceivedCustomize />
      </DrawerSuspense>
    </Drawer>
  );
}

export const PaymentReceivedCustomizeDrawer = R.compose(withDrawers())(
  PaymentReceivedCustomizeDrawerRoot,
);
