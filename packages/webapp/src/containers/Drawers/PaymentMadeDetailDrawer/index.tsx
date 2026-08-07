import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers, WithDrawersProps } from '@/containers/Drawer/withDrawers';
import { compose } from '@/utils';

const PaymentMadeDetailContent = React.lazy(() =>
  import('./PaymentMadeDetailContent').then((m) => ({
    default: m.PaymentMadeDetailContent,
  })),
);

interface PaymentMadeDetailDrawerProps extends WithDrawersProps {
  name: string;
}

/**
 * Payment made detail drawer.
 */
function PaymentMadeDetailDrawer({
  name,
  // #withDrawer
  isOpen,
  payload,
}: PaymentMadeDetailDrawerProps) {
  const paymentMadeId = payload?.paymentMadeId as number | undefined;

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

export const index = compose(withDrawers())(PaymentMadeDetailDrawer);
