import React from 'react';
import { VendorTransactionsPdfDialog } from './dialogs/VendorTransactionsPdfDialog';
import { DialogsName } from '@/constants/dialogs';

export function VendorTransactionsDialogs() {
  return (
    <>
      <VendorTransactionsPdfDialog
        dialogName={DialogsName.VendorTransactionsPdfPreview}
      />
    </>
  );
}
