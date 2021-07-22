import React from 'react';
import { Drawer, DrawerSuspense } from 'components';
import withDrawers from 'containers/Drawer/withDrawers';

import { compose } from 'utils';

const BillDrawerContent = React.lazy(() => import('./BillDrawerContent'));

/**
 * Bill drawer.
 */
function BillDrawer({
  name,
  // #withDrawer
  isOpen,
  payload: { billId },
}) {
  return (
    <Drawer isOpen={isOpen} name={name} size={'750px'}>
      <DrawerSuspense>
        <BillDrawerContent bill={billId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export default compose(withDrawers())(BillDrawer);
