import React, { lazy } from 'react';
import { Drawer, DrawerSuspense } from 'components';
import withDrawers from 'containers/Drawer/withDrawers';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { compose } from 'utils';

const ExpenseDrawerContent = lazy(() => import('./ExpenseDrawerContent'));

/**
 * Expense drawer.
 */
function ExpenseDrawer({
  name,

  //#withDrawer
  isOpen,
  payload: { expenseId, title },

  closeDrawer,
}) {
  // Handle close drawer.
  const handleDrawerClose = () => {
    closeDrawer(name);
  };

  return (
    <Drawer isOpen={isOpen} title={title} isClose={handleDrawerClose}>
      <DrawerSuspense>
        <ExpenseDrawerContent expenseId={expenseId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export default compose(withDrawers(), withDrawerActions)(ExpenseDrawer);
