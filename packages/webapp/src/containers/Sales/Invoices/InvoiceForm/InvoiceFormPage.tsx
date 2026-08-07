import { css } from '@emotion/css';
import React from 'react';
import { useParams } from 'react-router-dom';
import { InvoiceForm } from './InvoiceForm';
import {
  InvoiceFormProvider,
  useInvoiceFormContext,
} from './InvoiceFormProvider';
import { DashboardInsider } from '@/components';
import { AutoExchangeRateProvider } from '@/containers/Entries/AutoExchangeProvider';

/**
 * Invoice form page.
 */
export function InvoiceFormPage() {
  const { id } = useParams<{ id?: string }>();
  const invoiceId = id ? parseInt(id, 10) : undefined;

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
