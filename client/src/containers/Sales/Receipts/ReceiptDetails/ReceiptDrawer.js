import React, { lazy } from 'react';
import withDrawers from 'containers/Drawer/withDrawers';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { Drawer, DrawerSuspense } from 'components';
import { compose } from 'utils';

const ReceiptDrawerContent = lazy(() =>
  import('containers/Drawers/PaperTemplate/PaperTemplate'),
);

/**
 *  receipt drawer.
 */
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
      <Drawer isOpen={isOpen} isClose={handleDrawerClose}>
        <DrawerSuspense>
          <ReceiptDrawerContent labels={propLabels.labels} />
        </DrawerSuspense>
      </Drawer>
    </div>
  );
};

export default compose(withDrawers(), withDrawerActions)(ReceiptDrawer);
