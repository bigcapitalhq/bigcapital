// @ts-nocheck
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { flow } from 'fp-ts/function';

const PaymentReceiveDetailContent = React.lazy(() =>
  import('./PaymentReceiveDetailContent').then((m) => ({
    default: m.PaymentReceiveDetailContent,
  })),
);

/**
 * Payment receive detail drawer
 */
function PaymentReceiveDetailDrawer({
  name,
  // #withDrawer
  isOpen,
  payload: { paymentReceiveId },
}) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      size={'65%'}
      style={{ minWidth: '700px', maxWidth: '900px' }}
    >
      <DrawerSuspense>
        <PaymentReceiveDetailContent paymentReceiveId={paymentReceiveId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export const index = flow(withDrawers())(PaymentReceiveDetailDrawer);
