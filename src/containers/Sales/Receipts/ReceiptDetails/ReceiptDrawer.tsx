import React, { lazy } from 'react';
import withDrawers from '@/containers/Drawer/withDrawers';

import { Drawer, DrawerSuspense } from '@/components';
import { compose } from '@/utils';

const ReceiptDrawerContent = lazy(() => import('./ReceiptDrawerContent'));

/**
 *  receipt drawer.
 */
const ReceiptDrawer = ({
  name,
  //#withDrawer
  isOpen,
  payload: { receiptId },
}) => {
  return (
    <div>
      <Drawer isOpen={isOpen} name={name}>
        <DrawerSuspense>
          <ReceiptDrawerContent receiptId={receiptId} />
        </DrawerSuspense>
      </Drawer>
    </div>
  );
};

export default compose(withDrawers())(ReceiptDrawer);
