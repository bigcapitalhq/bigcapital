import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers, WithDrawersProps } from '@/containers/Drawer/withDrawers';
import { compose } from '@/utils';

const InventoryAdjustmentDrawerContent = React.lazy(() =>
  import('./InventoryAdjustmentDrawerContent').then((m) => ({
    default: m.InventoryAdjustmentDrawerContent,
  })),
);

interface InventoryAdjustmentDetailDrawerProps extends WithDrawersProps {
  name: string;
}

/**
 * Inventory adjustment detail drawer.
 */
function InventoryAdjustmentDetailDrawer({
  name,
  isOpen,
  payload,
}: InventoryAdjustmentDetailDrawerProps) {
  const inventoryId = payload?.inventoryId as number | undefined;

  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      style={{ minWidth: '700px', maxWidth: '900px' }}
      size={'65%'}
    >
      <DrawerSuspense>
        <InventoryAdjustmentDrawerContent inventoryId={inventoryId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export const index = compose(withDrawers())(InventoryAdjustmentDetailDrawer);
