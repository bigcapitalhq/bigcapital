import * as FF from 'fp-ts/function';
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';

const EstimateCustomizeDrawerBody = React.lazy(() =>
  import('./EstimateCustomizeDrawerBody').then((m) => ({
    default: m.EstimateCustomizeDrawerBody,
  })),
);

interface EstimateCustomizeDrawerProps {
  name: string;
  isOpen?: boolean;
  payload?: Record<string, any>;
}

/**
 * Estimate customize drawer.
 * @returns {React.ReactNode}
 */
function EstimateCustomizeDrawerRoot({
  name,

  // #withDrawer
  isOpen,
  payload,
}: EstimateCustomizeDrawerProps) {
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

export const EstimateCustomizeDrawer = FF.pipe(
  EstimateCustomizeDrawerRoot,
  withDrawers(),
);
