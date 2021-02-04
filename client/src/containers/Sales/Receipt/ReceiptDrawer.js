import React from 'react';
import DrawerTemplate from 'containers/Drawers/DrawerTemplate';
import PaperTemplate from 'containers/Drawers/PaperTemplate';
import withDrawers from 'containers/Drawer/withDrawers';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { compose } from 'utils';

const ReceiptDrawer = ({
  name,
  //#withDrawer
  isOpen,
  payload,

  closeDrawer,
}) => {
  // handle close Drawer
  const handleDrawerClose = () => {
    closeDrawer(name);
  };

  const propLabels = {
    labels: {
      name: 'Receipt',
      billedTo: 'Billed to',
      date: 'Receipt date',
      refNo: 'Receipt No.',
      billedFrom: 'Billed from',
      amount: 'Receipt amount',
      dueDate: 'Due date',
    },
  };

  return (
    <div>
      <DrawerTemplate isOpen={isOpen} isClose={handleDrawerClose}>
        <PaperTemplate labels={propLabels.labels} />
      </DrawerTemplate>
    </div>
  );
};

export default compose(withDrawers(), withDrawerActions)(ReceiptDrawer);
