// @ts-nocheck
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import withDrawers from '@/containers/Drawer/withDrawers';

import { compose } from '@/utils';

const CustomerDetailsDrawerContent = React.lazy(() =>
  import('./CustomerDetailsDrawerContent'),
);

/**
 * Contact detail drawer.
 */
function CustomerDetailsDrawer({
  name,

  // #withDrawer
  isOpen,
  payload: { customerId },
}) {
  return (
    <Drawer isOpen={isOpen} name={name} size={'750px'}>
      <DrawerSuspense>
        <CustomerDetailsDrawerContent customerId={customerId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export default compose(withDrawers())(CustomerDetailsDrawer);
