// @ts-nocheck
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { compose } from '@/utils';

const RefundCreditNoteDrawerContent = React.lazy(() =>
  import('./RefundCreditNoteDrawerContent').then((m) => ({
    default: m.RefundCreditNoteDrawerContent,
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
        <RefundCreditNoteDrawerContent
          refundTransactionId={refundTransactionId}
        />
      </DrawerSuspense>
    </Drawer>
  );
}
export const index = compose(withDrawers())(RefundCreditNoteDetailDrawer);
