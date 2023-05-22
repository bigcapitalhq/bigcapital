// @ts-nocheck
import React from 'react';
import { useFormikContext } from 'formik';
import PaymentReceiveNumberDialog from '@/containers/Dialogs/PaymentReceiveNumberDialog';

/**
 * Payment receive form dialogs.
 */
export default function PaymentReceiveFormDialogs() {
  const { setFieldValue } = useFormikContext();

  const handleUpdatePaymentNumber = (settings) => {
    setFieldValue('payment_receive_no', settings.transactionNumber);
    setFieldValue('payment_receive_no_manually', settings.transactionNumber);
  };

  return (
    <PaymentReceiveNumberDialog
      dialogName={'payment-receive-number-form'}
      onConfirm={handleUpdatePaymentNumber}
    />
  );
}
