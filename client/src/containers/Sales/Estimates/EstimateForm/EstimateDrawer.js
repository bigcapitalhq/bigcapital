import React from 'react';
import DrawerTemplate from 'containers/Drawers/DrawerTemplate';
import PaperTemplate from 'containers/Drawers/PaperTemplate';
import withDrawers from 'containers/Drawer/withDrawers';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { compose } from 'utils';

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
    <DrawerTemplate isOpen={isOpen} isClose={handleDrawerClose}>
      <PaperTemplate />
    </DrawerTemplate>
  );
}

export default compose(withDrawers(), withDrawerActions)(EstimateDrawer);
