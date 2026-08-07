import React from 'react';
import { useParams } from 'react-router-dom';

import '@/style/pages/WarehouseTransfers/PageForm.scss';
import { WarehouseTransferForm } from './WarehouseTransferForm';
import { WarehouseTransferFormProvider } from './WarehouseTransferFormProvider';

/**
 * WarehouseTransfer form page.
 */
export function WarehouseTransferFormPage() {
  const { id } = useParams<{ id?: string }>();
  const idAsInteger = id ? parseInt(id, 10) : undefined;
  return (
    <WarehouseTransferFormProvider warehouseTransferId={idAsInteger}>
      <WarehouseTransferForm />
    </WarehouseTransferFormProvider>
  );
}
