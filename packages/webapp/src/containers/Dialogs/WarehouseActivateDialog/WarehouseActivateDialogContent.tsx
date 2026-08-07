import React from 'react';
import { WarehouseActivateForm } from './WarehouseActivateForm';
import { WarehouseActivateFormProvider } from './WarehouseActivateFormProvider';

interface WarehouseActivateDialogContentProps {
  dialogName: string;
}

export function WarehouseActivateDialogContent({
  dialogName,
}: WarehouseActivateDialogContentProps): React.ReactElement {
  return (
    <WarehouseActivateFormProvider dialogName={dialogName}>
      <WarehouseActivateForm />
    </WarehouseActivateFormProvider>
  );
}
