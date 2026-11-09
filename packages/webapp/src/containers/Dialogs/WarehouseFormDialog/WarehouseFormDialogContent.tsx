import React from 'react';
import '@/style/pages/Warehouses/warehouseFormDialog.scss';
import { WarehouseForm } from './WarehouseForm';
import { WarehouseFormProvider } from './WarehouseFormProvider';

interface WarehouseFormDialogContentProps {
  dialogName: string;
  warehouseId?: number | null;
}

export function WarehouseFormDialogContent({
  dialogName,
  warehouseId,
}: WarehouseFormDialogContentProps): React.ReactElement {
  return (
    <WarehouseFormProvider warehouseId={warehouseId} dialogName={dialogName}>
      <WarehouseForm />
    </WarehouseFormProvider>
  );
}
