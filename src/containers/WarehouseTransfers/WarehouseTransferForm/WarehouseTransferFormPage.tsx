// @ts-nocheck
import React from 'react';
import { useParams } from 'react-router-dom';

import '@/style/pages/WarehouseTransfers/PageForm.scss';
import WarehouseTransferForm from './WarehouseTransferForm';
import { WarehouseTransferFormProvider } from './WarehouseTransferFormProvider';

/**
 * WarehouseTransfer form page.
 */
export default function WarehouseTransferFormPage() {
  const { id } = useParams();
  const idAsInteger = parseInt(id, 10);
  return (
    <WarehouseTransferFormProvider warehouseTransferId={idAsInteger}>
      <WarehouseTransferForm />
    </WarehouseTransferFormProvider>
  );
}
