import React from 'react';
import { DrawerBody } from 'components';

import InventoryAdjustmentDetail from './InventoryAdjustmentDetail';
import { InventoryAdjustmentDrawerProvider } from './InventoryAdjustmentDrawerProvider';

/**
 * Inventory adjustment drawer content.
 */
export default function InventoryAdjustmentDrawerContent({ inventoryId }) {
  return (
    <InventoryAdjustmentDrawerProvider inventoryId={inventoryId}>
      <DrawerBody>
        <InventoryAdjustmentDetail />
      </DrawerBody>
    </InventoryAdjustmentDrawerProvider>
  );
}
