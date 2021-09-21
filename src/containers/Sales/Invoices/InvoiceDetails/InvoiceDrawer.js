import React, { lazy } from 'react';
import withDrawers from 'containers/Drawer/withDrawers';

import { Drawer, DrawerSuspense } from 'components';
import { compose } from 'utils';

const InvoicesDrawerContent = lazy(() => import('./InvoiceDrawerContent'));

/**
 *  invoice drawer.
 */
function InvoiceDrawer({
  name,
  //#withDrawer
  isOpen,
  payload: { invoiceId },

}) {
  
  return (
    <Drawer isOpen={isOpen} name={name}>
      <DrawerSuspense>
        <InvoicesDrawerContent invoiceId={invoiceId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export default compose(withDrawers())(InvoiceDrawer);
