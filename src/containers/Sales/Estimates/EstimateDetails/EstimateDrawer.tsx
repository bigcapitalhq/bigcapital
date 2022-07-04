import React, { lazy } from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import withDrawers from 'containers/Drawer/withDrawers';

import { compose } from 'utils';

const EstimateDrawerContent = lazy(() => import('./EstimateDrawerContent'));

/**
 *  Estimate drawer.
 */
function EstimateDrawer({
  name,
  //#withDrawer
  isOpen,
  payload: { estimateId },
}) {
  return (
    <Drawer isOpen={isOpen} name={name}>
      <DrawerSuspense>
        <EstimateDrawerContent estimateId={estimateId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export default compose(withDrawers())(EstimateDrawer);
