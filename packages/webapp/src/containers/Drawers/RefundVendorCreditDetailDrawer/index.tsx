// @ts-nocheck
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { compose } from '@/utils';

const RefundVendorCreditDrawerContent = React.lazy(() =>
  import('./RefundVendorCreditDrawerContent').then((m) => ({
    default: m.RefundVendorCreditDrawerContent,
  })),
);

/**
 * Refund credit note detail.
 * @returns
 */
function RefundCreditNoteDetailDrawer({
  name,
  // #withDrawer
  isOpen,
  payload: { refundTransactionId },
}) {
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

export const index = compose(withDrawers())(RefundCreditNoteDetailDrawer);
