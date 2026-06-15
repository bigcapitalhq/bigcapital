// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { flow } from 'fp-ts/function';

const EstimateCustomizeDrawerBody = React.lazy(() =>
  import('./EstimateCustomizeDrawerBody').then((m) => ({
    default: m.EstimateCustomizeDrawerBody,
  })),
);

/**
 * Estimate customize drawer.
 * @returns {React.ReactNode}
 */
function EstimateCustomizeDrawerRoot({
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
        <EstimateCustomizeDrawerBody />
      </DrawerSuspense>
    </Drawer>
  );
}

export const EstimateCustomizeDrawer = flow(withDrawers())(
  EstimateCustomizeDrawerRoot,
);
