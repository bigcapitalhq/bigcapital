import React from 'react';
import DrawerTemplate from 'containers/Drawers/DrawerTemplate';
import PaperTemplate from 'containers/Drawers/PaperTemplate';
import withDrawers from 'containers/Drawer/withDrawers';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { compose } from 'utils';

function InvoiceDrawer({
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

  const propLabels = {
    labels: {
      name: 'Invoice',
      billedTo: 'Billed to',
      date: 'Invoice date',
      refNo: 'Invoice No.',
      billedFrom: 'Billed from',
      amount: 'Invoice amount',
      dueDate: 'Due date',
    },
  };

  return (
    <DrawerTemplate isOpen={isOpen} isClose={handleDrawerClose}>
      <PaperTemplate labels={propLabels.labels} />
    </DrawerTemplate>
  );
}

export default compose(withDrawers(), withDrawerActions)(InvoiceDrawer);
