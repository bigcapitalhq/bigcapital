import { css } from '@emotion/css';
import React from 'react';
import { useParams } from 'react-router-dom';
import { PaymentReceivedForm } from './PaymentReceiveForm';
import {
  PaymentReceiveFormProvider,
  usePaymentReceiveFormContext,
} from './PaymentReceiveFormProvider';
import { DashboardInsider } from '@/components';

/**
 * Payment received form page.
 */
export function PaymentReceiveFormPage() {
  const { id } = useParams<{ id?: string }>();
  const paymentReceivedId = id ? parseInt(id, 10) : undefined;

  return (
    <PaymentReceiveFormProvider paymentReceiveId={paymentReceivedId}>
      <PaymentReceivedFormPageContent />
    </PaymentReceiveFormProvider>
  );
}

function PaymentReceivedFormPageContent() {
  const { isBootLoading } = usePaymentReceiveFormContext();

  return (
    <DashboardInsider
      loading={isBootLoading}
      className={css`
        min-height: calc(100vh - var(--top-offset));
        max-height: calc(100vh - var(--top-offset));
      `}
    >
      <PaymentReceivedForm />
    </DashboardInsider>
  );
}
