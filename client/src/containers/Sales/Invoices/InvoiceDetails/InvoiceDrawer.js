import React, { lazy } from 'react';
import withDrawers from 'containers/Drawer/withDrawers';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

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

  closeDrawer,
}) {
  // handle close Drawer
  const handleDrawerClose = () => {
    closeDrawer(name);
  };

  return (
    <Drawer isOpen={isOpen} isClose={handleDrawerClose}>
      <DrawerSuspense>
        <InvoicesDrawerContent invoiceId={invoiceId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export default compose(withDrawers(), withDrawerActions)(InvoiceDrawer);
