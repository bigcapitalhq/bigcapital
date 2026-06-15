// @ts-nocheck
import React from 'react';
import * as R from 'ramda';

import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { flow } from 'fp-ts/function';

const QuickWriteVendorDrawerContent = React.lazy(() =>
  import('./QuickWriteVendorDrawerContent').then((m) => ({
    default: m.QuickWriteVendorDrawerContent,
  })),
);

/**
 * Quick Write vendor.
 */
function QuickWriteVendorDrawer({
  name,

  // #withDrawer
  isOpen,
  payload: { displayName, autofillRef },
}) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      style={{ minWidth: '700px', maxWidth: '900px' }}
      size={'80%'}
    >
      <DrawerSuspense>
        <QuickWriteVendorDrawerContent
          displayName={displayName}
          autofillRef={autofillRef}
        />
      </DrawerSuspense>
    </Drawer>
  );
}

export const index = flow(withDrawers())(QuickWriteVendorDrawer);
