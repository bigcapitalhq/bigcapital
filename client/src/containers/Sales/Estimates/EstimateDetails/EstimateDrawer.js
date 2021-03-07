import React, { lazy } from 'react';
import { Drawer, DrawerSuspense } from 'components';
import withDrawers from 'containers/Drawer/withDrawers';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

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

  closeDrawer,
}) {
  // handle close Drawer
  const handleDrawerClose = () => {
    closeDrawer(name);
  };
  return (
    <Drawer isOpen={isOpen} isClose={handleDrawerClose}>
      <DrawerSuspense>
        <EstimateDrawerContent estimateId={estimateId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export default compose(withDrawers(), withDrawerActions)(EstimateDrawer);
