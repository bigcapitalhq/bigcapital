// @ts-nocheck
import * as FF from 'fp-ts/function';
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';

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

export const index = FF.pipe(RefundCreditNoteDetailDrawer, withDrawers());
