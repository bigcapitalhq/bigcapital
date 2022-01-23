import React from 'react';

import '../../../style/pages/WarehouseTransfers/PageForm.scss'
import WarehouseTransferForm from './WarehouseTransferForm';
import { WarehouseTransferFormProvider } from './WarehouseTransferFormProvider';

/**
 * WarehouseTransfer form page.
 */
export default function WarehouseTransferFormPage() {
  return (
    <WarehouseTransferFormProvider warehouseTransferId={null}>
      <WarehouseTransferForm />
    </WarehouseTransferFormProvider>
  );
}
