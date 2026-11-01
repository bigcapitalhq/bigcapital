import * as FF from 'fp-ts/function';
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers, WithDrawersProps } from '@/containers/Drawer/withDrawers';

const RefundVendorCreditDrawerContent = React.lazy(() =>
  import('./RefundVendorCreditDrawerContent').then((m) => ({
    default: m.RefundVendorCreditDrawerContent,
  })),
);

interface RefundVendorCreditDetailDrawerProps extends WithDrawersProps {
  name: string;
}

/**
 * Refund vendor credit detail.
 */
function RefundVendorCreditDetailDrawer({
  name,
  // #withDrawer
  isOpen,
  payload,
}: RefundVendorCreditDetailDrawerProps) {
  const refundTransactionId = payload?.refundTransactionId as
    | number
    | undefined;

  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      style={{ minWidth: '700px', maxWidth: '750px' }}
      size={'65%'}
    >
      <DrawerSuspense>
        <RefundVendorCreditDrawerContent
          refundTransactionId={refundTransactionId}
        />
      </DrawerSuspense>
    </Drawer>
  );
}

export const index = FF.pipe(RefundVendorCreditDetailDrawer, withDrawers());
