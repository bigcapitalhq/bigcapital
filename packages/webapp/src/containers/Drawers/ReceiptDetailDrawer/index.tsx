// @ts-nocheck
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { flow } from 'fp-ts/function';

const ReceiptDetailDrawerContent = React.lazy(() =>
  import('./ReceiptDetailDrawerContent').then((m) => ({
    default: m.ReceiptDetailDrawerContent,
  })),
);

/**
 * Receipt Detail drawer.
 */
function ReceiptDetailDrawer({
  name,
  // #withDrawer
  isOpen,
  payload: { receiptId },
}) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      style={{ minWidth: '700px', maxWidth: '900px' }}
      size={'65%'}
    >
      <DrawerSuspense>
        <ReceiptDetailDrawerContent receiptId={receiptId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export const index = flow(withDrawers())(ReceiptDetailDrawer);
