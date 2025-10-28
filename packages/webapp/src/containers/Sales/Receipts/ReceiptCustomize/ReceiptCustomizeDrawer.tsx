// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { Drawer, DrawerSuspense } from '@/components';
import withDrawers from '@/containers/Drawer/withDrawers';

const ReceiptCustomizeDrawerBody = React.lazy(
  () => import('./ReceiptCustomizeDrawerBody'),
);

/**
 * Receipt customize drawer.
 * @returns {React.ReactNode}
 */
function ReceiptCustomizeDrawerRoot({
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
        <ReceiptCustomizeDrawerBody />
      </DrawerSuspense>
    </Drawer>
  );
}

export const ReceiptCustomizeDrawer = R.compose(withDrawers())(
  ReceiptCustomizeDrawerRoot,
);
