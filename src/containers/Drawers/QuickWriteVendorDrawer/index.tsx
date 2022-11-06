// @ts-nocheck
import React from 'react';
import * as R from 'ramda';

import { Drawer, DrawerSuspense } from '@/components';
import withDrawers from '@/containers/Drawer/withDrawers';

const QuickWriteVendorDrawerContent = React.lazy(() =>
  import('./QuickWriteVendorDrawerContent'),
);

/**
 * Quick Write vendor.
 */
function QuickWriteVendorDrawer({
  name,

  // #withDrawer
  isOpen,
  payload,
}) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      style={{ minWidth: '700px', maxWidth: '900px' }}
      size={'80%'}
      payload={payload}
    >
      <DrawerSuspense>
        <QuickWriteVendorDrawerContent displayName={payload.displayName} />
      </DrawerSuspense>
    </Drawer>
  );
}

export default R.compose(withDrawers())(QuickWriteVendorDrawer);
