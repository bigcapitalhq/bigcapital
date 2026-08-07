import { useFormikContext } from 'formik';
import React from 'react';
import { ExcessPaymentDialog } from './dialogs/ExcessPaymentDialog';
import type { PaymentReceiveFormValues } from './utils';
import { index as PaymentReceiveNumberDialog } from '@/containers/Dialogs/PaymentReceiveNumberDialog';

type PaymentNumberDialogSettings = {
  transactionNumber: string;
  incrementMode: string;
};

/**
 * Payment receive form dialogs.
 */
export function PaymentReceiveFormDialogs() {
  const { setFieldValue } = useFormikContext<PaymentReceiveFormValues>();

  const handleUpdatePaymentNumber = (settings: PaymentNumberDialogSettings) => {
    setFieldValue('paymentReceiveNo', settings.transactionNumber);
    setFieldValue('paymentReceiveNoManually', '');

    if (settings.incrementMode !== 'auto') {
      setFieldValue('paymentReceiveNoManually', settings.transactionNumber);
    }
  };

  return (
    <>
      <PaymentReceiveNumberDialog
        dialogName={'payment-receive-number-form'}
        onConfirm={handleUpdatePaymentNumber}
      />
      <ExcessPaymentDialog dialogName={'payment-received-excessed-payment'} />
    </>
  );
}
