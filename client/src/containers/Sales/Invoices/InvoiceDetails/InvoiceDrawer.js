import React, { lazy } from 'react';
import withDrawers from 'containers/Drawer/withDrawers';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { Drawer, DrawerSuspense } from 'components';
import { compose } from 'utils';

const InvoicesDrawerContent = lazy(() =>
  import('containers/Drawers/PaperTemplate/PaperTemplate'),
);

/**
 *  invoice drawer.
 */
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
    <Drawer isOpen={isOpen} isClose={handleDrawerClose}>
      <DrawerSuspense>
        <InvoicesDrawerContent labels={propLabels.labels} />
      </DrawerSuspense>
    </Drawer>
  );
}

export default compose(withDrawers(), withDrawerActions)(InvoiceDrawer);
