// @ts-nocheck
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import withDrawers from '@/containers/Drawer/withDrawers';

import { compose } from '@/utils';

const InvoiceDetailDrawerContent = React.lazy(() =>
  import('./InvoiceDetailDrawerContent'),
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
export default compose(withDrawers())(InvoiceDetailDrawer);
