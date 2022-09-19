// @ts-nocheck
import React from 'react';
import { useParams } from 'react-router-dom';

import { PaymentReceiveFormProvider } from './PaymentReceiveFormProvider';
import PaymentReceiveForm from './PaymentReceiveForm';

/**
 * Payment receive form page.
 */
export default function PaymentReceiveFormPage() {
  const { id: paymentReceiveId } = useParams();
  const paymentReceiveIdInt = parseInt(paymentReceiveId, 10);

  return (
    <PaymentReceiveFormProvider paymentReceiveId={paymentReceiveIdInt}>
      <PaymentReceiveForm paymentReceiveId={paymentReceiveIdInt} />
    </PaymentReceiveFormProvider>
  );
}
