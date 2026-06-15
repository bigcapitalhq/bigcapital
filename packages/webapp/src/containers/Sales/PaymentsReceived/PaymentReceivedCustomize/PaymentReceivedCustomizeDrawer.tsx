// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { flow } from 'fp-ts/function';

const PaymentReceivedCustomize = React.lazy(() =>
  import('./PaymentReceivedCustomize').then((m) => ({
    default: m.PaymentReceivedCustomize,
  })),
);

/**
 * PaymentReceived customize drawer.
 * @returns {React.ReactNode}
 */
function PaymentReceivedCustomizeDrawerRoot({
  name,
  // #withDrawer
  isOpen,
  payload,
}) {
  return (
    <Drawer isOpen={isOpen} name={name} size={'100%'} payload={payload}>
      <DrawerSuspense>
        <PaymentReceivedCustomize />
      </DrawerSuspense>
    </Drawer>
  );
}

export const PaymentReceivedCustomizeDrawer = flow(withDrawers())(
  PaymentReceivedCustomizeDrawerRoot,
);
