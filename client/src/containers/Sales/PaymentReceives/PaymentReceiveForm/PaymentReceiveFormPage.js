import React from 'react';
import { useParams } from 'react-router-dom';

import { PaymentReceiveFormProvider } from './PaymentReceiveFormProvider';
import PaymentReceiveForm from './PaymentReceiveForm';

/**
 * Payment receive form page.
 */
export default function PaymentReceiveFormPage() {
  const { id: paymentReceiveId } = useParams();

  return (
    <PaymentReceiveFormProvider paymentReceiveId={paymentReceiveId}>
      <PaymentReceiveForm paymentReceiveId={paymentReceiveId} />
    </PaymentReceiveFormProvider>
  );
}
