import React from 'react';
import { Drawer, DrawerSuspense } from 'components';
import withDrawers from 'containers/Drawer/withDrawers';

import { compose } from 'utils';

const ReceiptDetailDrawerContent = React.lazy(() =>
  import('./ReceiptDetailDrawerContent'),
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
    <Drawer isOpen={isOpen} name={name} size={'750px'}>
      <DrawerSuspense>
        <ReceiptDetailDrawerContent receipt={receiptId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export default compose(withDrawers())(ReceiptDetailDrawer);
