import React, { lazy } from 'react';
import withDrawers from 'containers/Drawer/withDrawers';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { Drawer, DrawerSuspense } from 'components';
import { compose } from 'utils';

const EstimateDrawerContent = lazy(() =>
  import('containers/Drawers/PaperTemplate/PaperTemplate'),
);

function EstimateDrawer({
  name,
  //#withDrawer
  isOpen,
  payload,

  closeDrawer,
}) {
  // handle close Drawer
  const handleDrawerClose = () => {
    closeDrawer(name);
  };
  return (
    <Drawer isOpen={isOpen} isClose={handleDrawerClose}>
      <DrawerSuspense>
        <EstimateDrawerContent />
      </DrawerSuspense>
    </Drawer>
  );
}

export default compose(withDrawers(), withDrawerActions)(EstimateDrawer);
