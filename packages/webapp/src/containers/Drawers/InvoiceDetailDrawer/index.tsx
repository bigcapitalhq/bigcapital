import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers, WithDrawersProps } from '@/containers/Drawer/withDrawers';
import { compose } from '@/utils';

const InvoiceDetailDrawerContent = React.lazy(() =>
  import('./InvoiceDetailDrawerContent').then((m) => ({
    default: m.InvoiceDetailDrawerContent,
  })),
);

interface InvoiceDetailDrawerProps extends WithDrawersProps {
  name: string;
}

/**
 * Invoice Detail drawer.
 */
function InvoiceDetailDrawer({
  name,
  // #withDrawer
  isOpen,
  payload,
}: InvoiceDetailDrawerProps) {
  const invoiceId = payload?.invoiceId as number | undefined;

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
export const index = compose(withDrawers())(InvoiceDetailDrawer);
