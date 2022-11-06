// @ts-nocheck
import React from 'react';

import { DrawerBody } from '@/components';
import { InventoryAdjustmentDrawerProvider } from './InventoryAdjustmentDrawerProvider';
import InventoryAdjustmentDetail from './InventoryAdjustmentDetail';

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
