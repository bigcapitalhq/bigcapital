// @ts-nocheck
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { flow } from 'fp-ts/function';

const PaymentMadeDetailContent = React.lazy(() =>
  import('./PaymentMadeDetailContent').then((m) => ({
    default: m.PaymentMadeDetailContent,
  })),
);

/**
 * Payment made detail drawer.
 */
function PaymentMadeDetailDrawer({
  name,
  // #withDrawer
  isOpen,
  payload: { paymentMadeId },
}) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      size={'65%'}
      style={{ minWidth: '700px', maxWidth: '900px' }}
    >
      <DrawerSuspense>
        <PaymentMadeDetailContent paymentMadeId={paymentMadeId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export const index = flow(withDrawers())(PaymentMadeDetailDrawer);
