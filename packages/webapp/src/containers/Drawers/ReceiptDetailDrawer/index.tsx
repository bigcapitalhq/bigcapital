import * as FF from 'fp-ts/function';
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers, WithDrawersProps } from '@/containers/Drawer/withDrawers';

const ReceiptDetailDrawerContent = React.lazy(() =>
  import('./ReceiptDetailDrawerContent').then((m) => ({
    default: m.ReceiptDetailDrawerContent,
  })),
);

interface ReceiptDetailDrawerProps extends WithDrawersProps {
  name: string;
}

/**
 * Receipt Detail drawer.
 */
function ReceiptDetailDrawer({
  name,
  // #withDrawer
  isOpen,
  payload,
}: ReceiptDetailDrawerProps) {
  const receiptId = payload?.receiptId as number | undefined;

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

export const index = FF.pipe(ReceiptDetailDrawer, withDrawers());
