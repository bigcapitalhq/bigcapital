import React from 'react';
import { useFormikContext } from 'formik';
import PaymentReceiveNumberDialog from 'containers/Dialogs/PaymentReceiveNumberDialog';
import { transactionNumber } from 'utils';

/**
 * Payment receive form dialogs.
 */
export default function PaymentReceiveFormDialogs() {
  const { setFieldValue } = useFormikContext();

  const handleUpdatePaymentNumber = (values) => {
    setFieldValue(
      'payment_receive_no',
      transactionNumber(values.number_prefix, values.next_number),
    );
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
