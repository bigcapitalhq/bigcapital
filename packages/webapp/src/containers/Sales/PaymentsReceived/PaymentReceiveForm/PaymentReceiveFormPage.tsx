// @ts-nocheck
import React from 'react';
import { useParams } from 'react-router-dom';
import { css } from '@emotion/css';
import {
  PaymentReceiveFormProvider,
  usePaymentReceiveFormContext,
} from './PaymentReceiveFormProvider';
import { PaymentReceivedForm } from './PaymentReceiveForm';
import { DashboardInsider } from '@/components';

/**
 * Payment received form page.
 */
export default function PaymentReceiveFormPage() {
  const { id } = useParams();
  const paymentReceivedId = parseInt(id, 10);

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
