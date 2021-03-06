import React, { lazy } from 'react';
import withDrawers from 'containers/Drawer/withDrawers';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { Drawer, DrawerSuspense } from 'components';
import { compose } from 'utils';

const ReceiptDrawerContent = lazy(() => import('./ReceiptDrawerContent'));

/**
 *  receipt drawer.
 */
const ReceiptDrawer = ({
  name,
  //#withDrawer
  isOpen,
  payload: { receiptId },

  closeDrawer,
}) => {
  // handle close Drawer
  const handleDrawerClose = () => {
    closeDrawer(name);
  };

  return (
    <div>
      <Drawer isOpen={isOpen} isClose={handleDrawerClose}>
        <DrawerSuspense>
          <ReceiptDrawerContent receiptId={receiptId} />
        </DrawerSuspense>
      </Drawer>
    </div>
  );
};

export default compose(withDrawers(), withDrawerActions)(ReceiptDrawer);
