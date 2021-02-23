import React from 'react';
import DrawerTemplate from 'containers/Drawers/DrawerTemplate';
import PaymentPaperTemplate from 'containers/Drawers/PaymentPaperTemplate/PaymentPaperTemplate';
import withDrawers from 'containers/Drawer/withDrawers';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { compose } from 'utils';

function PaymentReceiveDrawer({
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
      <PaymentPaperTemplate />
    </DrawerTemplate>
  );
}

export default compose(withDrawers(), withDrawerActions)(PaymentReceiveDrawer);
