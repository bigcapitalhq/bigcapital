// @ts-nocheck
import React from 'react';
import * as R from 'ramda';

import { Drawer, DrawerSuspense } from '@/components';
import withDrawers from '@/containers/Drawer/withDrawers';

const InvoiceCustomizeContent = React.lazy(
  () => import('./InvoiceCustomizeContent'),
);

/**
 * Refund credit note detail.
 * @returns
 */
function InvoiceCustomizeDrawerRoot({
  name,
  // #withDrawer
  isOpen,
  payload: {},
}) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      size={'100%'}
    >
      <DrawerSuspense>
        <InvoiceCustomizeContent />
      </DrawerSuspense>
    </Drawer>
  );
}

export const InvoiceCustomizeDrawer = R.compose(withDrawers())(
  InvoiceCustomizeDrawerRoot,
);
