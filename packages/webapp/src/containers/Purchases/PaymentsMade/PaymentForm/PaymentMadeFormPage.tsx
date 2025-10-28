// @ts-nocheck
import React from 'react';
import { useParams } from 'react-router-dom';

import PaymentMadeForm from './PaymentMadeForm';
import { PaymentMadeFormProvider } from './PaymentMadeFormProvider';

import '@/style/pages/PaymentMade/PageForm.scss';

/**
 * Payment made - Page form.
 */
export default function PaymentMadeFormPage() {
  const { id: paymentMadeId } = useParams();

  return (
    <PaymentMadeFormProvider paymentMadeId={paymentMadeId}>
      <PaymentMadeForm />
    </PaymentMadeFormProvider>
  );
}
