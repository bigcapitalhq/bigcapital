// @ts-nocheck
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import withDrawers from '@/containers/Drawer/withDrawers';

import { compose } from '@/utils';

const VendorDetailsDrawerContent = React.lazy(() =>
  import('./VendorDetailsDrawerContent'),
);

/**
 * Vendor details drawer.
 */
function VendorDetailsDrawer({
  name,

  // #withDrawer
  isOpen,
  payload: { vendorId },
}) {
  return (
    <Drawer isOpen={isOpen} name={name} size={'750px'}>
      <DrawerSuspense>
        <VendorDetailsDrawerContent vendorId={vendorId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export default compose(withDrawers())(VendorDetailsDrawer);
