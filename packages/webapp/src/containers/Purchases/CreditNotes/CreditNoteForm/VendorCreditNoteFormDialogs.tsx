import { useFormikContext } from 'formik';
import React from 'react';
import type { VendorCreditFormValues } from './utils';
import { index as VendorCreditNumberDialog } from '@/containers/Dialogs/VendorCreditNumberDialog';

type VendorCreditNumberFormSettings = {
  incrementNumber?: string;
  manually?: boolean;
};

/**
 * Vendor credit form dialog.
 */
export function VendorCreditNoteFormDialogs() {
  const { setFieldValue } = useFormikContext<VendorCreditFormValues>();

  // Update the form once the vendor credit number form submit confirm.
  const handleVendorCreditNumberFormConfirm = ({
    incrementNumber,
    manually,
  }: VendorCreditNumberFormSettings) => {
    setFieldValue('vendorCreditNumber', incrementNumber || '');
    setFieldValue('vendorCreditNumberManually', manually);
  };

  return (
    <React.Fragment>
      <VendorCreditNumberDialog
        dialogName={'vendor-credit-form'}
        onConfirm={handleVendorCreditNumberFormConfirm}
      />
    </React.Fragment>
  );
}
