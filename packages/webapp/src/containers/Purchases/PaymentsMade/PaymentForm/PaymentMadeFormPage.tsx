import React from 'react';
import { useParams } from 'react-router-dom';
import { PaymentMadeForm } from './PaymentMadeForm';
import { PaymentMadeFormProvider } from './PaymentMadeFormProvider';
import { DRAWERS } from '@/constants/drawers';
import { index as BillDrawer } from '@/containers/Drawers/BillDrawer';

import '@/style/pages/PaymentMade/PageForm.scss';

/**
 * Payment made - Page form.
 */
export function PaymentMadeFormPage() {
  const { id } = useParams<{ id?: string }>();
  const paymentMadeId = id ? Number(id) : undefined;

  return (
    <PaymentMadeFormProvider paymentMadeId={paymentMadeId}>
      <PaymentMadeForm />
      <BillDrawer name={DRAWERS.BILL_DETAILS} />
    </PaymentMadeFormProvider>
  );
}
