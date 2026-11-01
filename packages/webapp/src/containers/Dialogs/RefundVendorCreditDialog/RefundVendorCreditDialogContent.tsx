import React from 'react';
import '@/style/pages/RefundVendorCredit/RefundVendorCredit.scss';
import { RefundVendorCreditForm } from './RefundVendorCreditForm';
import { RefundVendorCreditFormProvider } from './RefundVendorCreditFormProvider';

interface RefundVendorCreditDialogContentProps {
  dialogName: string;
  vendorCreditId?: number | null;
}

export function RefundVendorCreditDialogContent({
  dialogName,
  vendorCreditId,
}: RefundVendorCreditDialogContentProps): React.ReactElement {
  return (
    <RefundVendorCreditFormProvider
      vendorCreditId={vendorCreditId}
      dialogName={dialogName}
    >
      <RefundVendorCreditForm />
    </RefundVendorCreditFormProvider>
  );
}
