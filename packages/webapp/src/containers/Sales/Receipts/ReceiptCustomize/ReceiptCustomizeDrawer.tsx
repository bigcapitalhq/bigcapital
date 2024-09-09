// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { Drawer, DrawerSuspense } from '@/components';
import withDrawers from '@/containers/Drawer/withDrawers';

const ReceiptCustomizeContent = React.lazy(
  () => import('./ReceiptCustomizeContent'),
);

/**
 * Receipt customize drawer.
 * @returns {React.ReactNode}
 */
function ReceiptCustomizeDrawerRoot({
  name,
  // #withDrawer
  isOpen,
  payload: {},
}) {
  return (
    <Drawer isOpen={isOpen} name={name} size={'100%'}>
      <DrawerSuspense>
        <ReceiptCustomizeContent />
      </DrawerSuspense>
    </Drawer>
  );
}

export const ReceiptCustomizeDrawer = R.compose(withDrawers())(
  ReceiptCustomizeDrawerRoot,
);
