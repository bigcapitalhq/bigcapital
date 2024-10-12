// @ts-nocheck
import React from 'react';
import { useParams } from 'react-router-dom';
import { css } from '@emotion/css';
import { InvoiceForm } from './InvoiceForm';
import {
  InvoiceFormProvider,
  useInvoiceFormContext,
} from './InvoiceFormProvider';
import { AutoExchangeRateProvider } from '@/containers/Entries/AutoExchangeProvider';
import { DashboardInsider } from '@/components';

/**
 * Invoice form page.
 */
export default function InvoiceFormPage() {
  const { id } = useParams();
  const invoiceId = parseInt(id, 10);

  return (
    <InvoiceFormProvider invoiceId={invoiceId}>
      <AutoExchangeRateProvider>
        <InvoiceFormPageContent />
      </AutoExchangeRateProvider>
    </InvoiceFormProvider>
  );
}

function InvoiceFormPageContent() {
  const { isBootLoading } = useInvoiceFormContext();

  return (
    <DashboardInsider
      loading={isBootLoading}
      className={css`
        min-height: calc(100vh - var(--top-offset));
        max-height: calc(100vh - var(--top-offset));
      `}
    >
      <InvoiceForm />
    </DashboardInsider>
  );
}
