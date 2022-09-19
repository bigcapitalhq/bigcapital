// @ts-nocheck
import React from 'react';
 
import '@/style/pages/Items/ItemAdjustmentDialog.scss';
 
import { InventoryAdjustmentFormProvider } from './InventoryAdjustmentFormProvider';
import InventoryAdjustmentForm from './InventoryAdjustmentForm';

/**
 * Inventory adjustment form dialog content.
 */
export default function InventoryAdjustmentFormDialogContent({
  // #ownProps
  dialogName,
  itemId
}) {
  return (
    <InventoryAdjustmentFormProvider itemId={itemId} dialogName={dialogName}>
      <InventoryAdjustmentForm />
    </InventoryAdjustmentFormProvider>
  );
}
