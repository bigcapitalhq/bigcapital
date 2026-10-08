import * as FF from 'fp-ts/function';
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers, WithDrawersProps } from '@/containers/Drawer/withDrawers';

const RefundCreditNoteDrawerContent = React.lazy(() =>
  import('./RefundCreditNoteDrawerContent').then((m) => ({
    default: m.RefundCreditNoteDrawerContent,
  })),
);

interface RefundCreditNoteDetailDrawerProps extends WithDrawersProps {
  name: string;
}

/**
 * Refund credit note detail.
 */
function RefundCreditNoteDetailDrawer({
  name,
  // #withDrawer
  isOpen,
  payload,
}: RefundCreditNoteDetailDrawerProps) {
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
        <RefundCreditNoteDrawerContent
          refundTransactionId={refundTransactionId}
        />
      </DrawerSuspense>
    </Drawer>
  );
}
export const index = FF.pipe(RefundCreditNoteDetailDrawer, withDrawers());
