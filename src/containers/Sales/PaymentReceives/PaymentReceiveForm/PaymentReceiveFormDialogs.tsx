import React from 'react';
import { useFormikContext } from 'formik';
import PaymentReceiveNumberDialog from '@/containers/Dialogs/PaymentReceiveNumberDialog';

/**
 * Payment receive form dialogs.
 */
export default function PaymentReceiveFormDialogs() {
  const { setFieldValue } = useFormikContext();

  const handleUpdatePaymentNumber = ({ incrementNumber, manually }) => {
    setFieldValue('payment_receive_no', incrementNumber);
    setFieldValue('payment_receive_no_manually', manually)
  };

  return (
    <>
      <PaymentReceiveNumberDialog
        dialogName={'payment-receive-number-form'}
        onConfirm={handleUpdatePaymentNumber}
      />
    </>
  );
}
