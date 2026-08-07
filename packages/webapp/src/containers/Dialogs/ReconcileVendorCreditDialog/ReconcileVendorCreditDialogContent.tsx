import React from 'react';
import { ReconcileVendorCreditForm } from './ReconcileVendorCreditForm';
import { ReconcileVendorCreditFormProvider } from './ReconcileVendorCreditFormProvider';

interface ReconcileVendorCreditDialogContentProps {
  dialogName: string;
  vendorCreditId?: number | null;
}

export function ReconcileVendorCreditDialogContent({
  dialogName,
  vendorCreditId,
}: ReconcileVendorCreditDialogContentProps): React.ReactElement {
  return (
    <ReconcileVendorCreditFormProvider
      vendorCreditId={vendorCreditId}
      dialogName={dialogName}
    >
      <ReconcileVendorCreditForm />
    </ReconcileVendorCreditFormProvider>
  );
}
