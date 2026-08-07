import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers, WithDrawersProps } from '@/containers/Drawer/withDrawers';
import { compose } from '@/utils';

const PaymentReceiveDetailContent = React.lazy(() =>
  import('./PaymentReceiveDetailContent').then((m) => ({
    default: m.PaymentReceiveDetailContent,
  })),
);

interface PaymentReceiveDetailDrawerProps extends WithDrawersProps {
  name: string;
}

/**
 * Payment receive detail drawer.
 */
function PaymentReceiveDetailDrawer({
  name,
  // #withDrawer
  isOpen,
  payload,
}: PaymentReceiveDetailDrawerProps) {
  const paymentReceiveId = payload?.paymentReceiveId as number | undefined;

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

export const index = compose(withDrawers())(PaymentReceiveDetailDrawer);
