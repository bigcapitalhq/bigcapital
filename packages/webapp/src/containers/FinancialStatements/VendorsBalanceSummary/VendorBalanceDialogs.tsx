import React from 'react';
import { VendorBalancePdfDialog } from './dialogs/VendorBalancePdfDialog';
import { DialogsName } from '@/constants/dialogs';

export function VendorBalanceDialogs() {
  return (
    <>
      <VendorBalancePdfDialog
        dialogName={DialogsName.VendorBalancePdfPreview}
      />
    </>
  );
}
