import React from 'react';

import { Drawer, DrawerSuspense } from 'components';
import withDrawers from 'containers/Drawer/withDrawers';

import { compose } from 'utils';

const InventoryAdjustmentDrawerContent = React.lazy(() =>
  import('./InventoryAdjustmentDrawerContent'),
);

/**
 * Inventory adjustment detail drawer.
 */
function InventoryAdjustmentDetailDrawer({
  name,
  // #withDrawer
  isOpen,
  payload: { inventoryId },
}) {
  return (
    <Drawer isOpen={isOpen} name={name} size={'750px'}>
      <DrawerSuspense>
        <InventoryAdjustmentDrawerContent inventoryId={inventoryId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export default compose(withDrawers())(InventoryAdjustmentDetailDrawer);
