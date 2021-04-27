import React, { lazy } from 'react';
import { Drawer, DrawerSuspense } from 'components';
import withDrawers from 'containers/Drawer/withDrawers';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { compose } from 'utils';

const ManualJournalDrawerContent = lazy(() =>
  import('./ManualJournalDrawerContent'),
);

/**
 * Manual journal drawer.
 */
function ManualJournalDrawer({
  name,

  //#withDrawer
  isOpen,
  payload: { manualJournalId, title },

  closeDrawer,
}) {
  // Handle close drawer.
  const handleDrawerClose = () => {
    closeDrawer(name);
  };
  return (
    <Drawer isOpen={isOpen} title={title} isClose={handleDrawerClose}>
      <DrawerSuspense>
        <ManualJournalDrawerContent manualJournalId={manualJournalId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export default compose(withDrawers(), withDrawerActions)(ManualJournalDrawer);
