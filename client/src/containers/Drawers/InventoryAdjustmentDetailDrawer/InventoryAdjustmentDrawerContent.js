import React from 'react';

import InventoryAdjustmentDetail from './InventoryAdjustmentDetail';
import { InventoryAdjustmentDrawerProvider } from './InventoryAdjustmentDrawerProvider';

/**
 * Inventory adjustment drawer content.
 */
export default function InventoryAdjustmentDrawerContent({ inventoryId }) {
  return (
    <InventoryAdjustmentDrawerProvider inventoryId={inventoryId}>
      <InventoryAdjustmentDetail />
    </InventoryAdjustmentDrawerProvider>
  );
}
