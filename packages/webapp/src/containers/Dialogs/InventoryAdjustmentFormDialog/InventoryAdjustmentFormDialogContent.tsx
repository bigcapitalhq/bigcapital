import React from 'react';
import '@/style/pages/Items/ItemAdjustmentDialog.scss';
import { InventoryAdjustmentForm } from './InventoryAdjustmentForm';
import { InventoryAdjustmentFormProvider } from './InventoryAdjustmentFormProvider';

interface InventoryAdjustmentFormDialogContentProps {
  dialogName: string;
  itemId?: number | null;
}

export function InventoryAdjustmentFormDialogContent({
  dialogName,
  itemId,
}: InventoryAdjustmentFormDialogContentProps): React.ReactElement {
  return (
    <InventoryAdjustmentFormProvider itemId={itemId} dialogName={dialogName}>
      <InventoryAdjustmentForm />
    </InventoryAdjustmentFormProvider>
  );
}
