// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { Drawer, DrawerSuspense } from '@/components';
import withDrawers from '@/containers/Drawer/withDrawers';

const InvoiceCustomize = React.lazy(() => import('./InvoiceCustomize'));

/**
 * Invoice customize drawer.
 * @returns {React.ReactNode}
 */
function InvoiceCustomizeDrawerRoot({
  name,
  // #withDrawer
  isOpen,
  payload,
}) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      payload={payload}
      size={'calc(100% - 10px)'}
    >
      <DrawerSuspense>
        <InvoiceCustomize />
      </DrawerSuspense>
    </Drawer>
  );
}

export const InvoiceCustomizeDrawer = R.compose(withDrawers())(
  InvoiceCustomizeDrawerRoot,
);
