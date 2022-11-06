// @ts-nocheck
import React from 'react';

import WarehouseActivateForm from './WarehouseActivateForm';
import { WarehouseActivateFormProvider } from './WarehouseActivateFormProvider';

export default function WarehouseActivateDialogContent({
  // #ownProps
  dialogName,
}) {
  return (
    <WarehouseActivateFormProvider dialogName={dialogName}>
      <WarehouseActivateForm />
    </WarehouseActivateFormProvider>
  );
}
