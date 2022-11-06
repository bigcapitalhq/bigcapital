// @ts-nocheck
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import withDrawers from '@/containers/Drawer/withDrawers';

import { compose } from '@/utils';

const WarehouseTransferDetailDrawerContent = React.lazy(() =>
  import('./WarehouseTransferDetailDrawerContent'),
);

/**
 * Warehouse transfer detail drawer.
 */
function WarehouseTransferDetailDrawer({
  name,
  // #withDrawer
  isOpen,
  payload: { warehouseTransferId },
}) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      style={{ minWidth: '700px', maxWidth: '900px' }}
      size={'65%'}
    >
      <DrawerSuspense>
        <WarehouseTransferDetailDrawerContent
          warehouseTransferId={warehouseTransferId}
        />
      </DrawerSuspense>
    </Drawer>
  );
}

export default compose(withDrawers())(WarehouseTransferDetailDrawer);
