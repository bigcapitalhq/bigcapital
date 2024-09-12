// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { Drawer, DrawerSuspense } from '@/components';
import withDrawers from '@/containers/Drawer/withDrawers';

const EstimateCustomizeDrawerBody = React.lazy(
  () => import('./EstimateCustomizeDrawerBody'),
);

/**
 * Estimate customize drawer.
 * @returns {React.ReactNode}
 */
function EstimateCustomizeDrawerRoot({
  name,

  // #withDrawer
  isOpen,
  payload: {},
}) {
  return (
    <Drawer isOpen={isOpen} name={name} size={'100%'}>
      <DrawerSuspense>
        <EstimateCustomizeDrawerBody />
      </DrawerSuspense>
    </Drawer>
  );
}

export const EstimateCustomizeDrawer = R.compose(withDrawers())(
  EstimateCustomizeDrawerRoot,
);
