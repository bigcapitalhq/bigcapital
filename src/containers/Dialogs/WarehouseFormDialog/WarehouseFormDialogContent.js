import React from 'react';

import '../../../style/pages/Warehouses/warehouseFormDialog.scss';
import { WarehouseFormProvider } from './WarehouseFormProvider';
import WarehouseForm from './WarehouseForm';

/**
 * Warehouse form dialog content.
 */
export default function WarehouseFormDialogContent({
  // #ownProps
  dialogName,
}) {
  return (
    <WarehouseFormProvider dialogName={dialogName}>
      <WarehouseForm />
    </WarehouseFormProvider>
  );
}
