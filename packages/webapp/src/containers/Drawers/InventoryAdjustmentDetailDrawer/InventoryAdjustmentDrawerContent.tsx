import React from 'react';
import { InventoryAdjustmentDetail } from './InventoryAdjustmentDetail';
import { InventoryAdjustmentDrawerProvider } from './InventoryAdjustmentDrawerProvider';
import { DrawerBody } from '@/components';

interface InventoryAdjustmentDrawerContentProps {
  inventoryId: number | undefined;
}

/**
 * Inventory adjustment drawer content.
 */
export function InventoryAdjustmentDrawerContent({
  inventoryId,
}: InventoryAdjustmentDrawerContentProps) {
  return (
    <InventoryAdjustmentDrawerProvider inventoryId={inventoryId}>
      <DrawerBody>
        <InventoryAdjustmentDetail />
      </DrawerBody>
    </InventoryAdjustmentDrawerProvider>
  );
}
