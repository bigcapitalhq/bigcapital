// @ts-nocheck
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { flow } from 'fp-ts/function';

const InvoiceDetailDrawerContent = React.lazy(() =>
  import('./InvoiceDetailDrawerContent').then((m) => ({
    default: m.InvoiceDetailDrawerContent,
  })),
);

/**
 * Invoice Detail drawer.
 */
function InvoiceDetailDrawer({
  name,
  // #withDrawer
  isOpen,
  payload: { invoiceId },
}) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      style={{ minWidth: '700px', maxWidth: '1000px' }}
      size={'65%'}
    >
      <DrawerSuspense>
        <InvoiceDetailDrawerContent invoiceId={invoiceId} />
      </DrawerSuspense>
    </Drawer>
  );
}
export const index = flow(withDrawers())(InvoiceDetailDrawer);
