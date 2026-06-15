// @ts-nocheck
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { flow } from 'fp-ts/function';

const WarehouseTransferDetailDrawerContent = React.lazy(() =>
  import('./WarehouseTransferDetailDrawerContent').then((m) => ({
    default: m.WarehouseTransferDetailDrawerContent,
  })),
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

export const index = flow(withDrawers())(
  WarehouseTransferDetailDrawer,
);
