import * as FF from 'fp-ts/function';
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';

const PaymentReceivedCustomize = React.lazy(() =>
  import('./PaymentReceivedCustomize').then((m) => ({
    default: m.PaymentReceivedCustomize,
  })),
);

interface PaymentReceivedCustomizeDrawerProps {
  name: string;
  isOpen?: boolean;
  payload?: Record<string, any>;
}

/**
 * PaymentReceived customize drawer.
 * @returns {React.ReactNode}
 */
function PaymentReceivedCustomizeDrawerRoot({
  name,
  // #withDrawer
  isOpen,
  payload,
}: PaymentReceivedCustomizeDrawerProps) {
  return (
    <Drawer isOpen={isOpen} name={name} size={'100%'} payload={payload}>
      <DrawerSuspense>
        <PaymentReceivedCustomize />
      </DrawerSuspense>
    </Drawer>
  );
}

export const PaymentReceivedCustomizeDrawer = FF.pipe(
  PaymentReceivedCustomizeDrawerRoot,
  withDrawers(),
);
