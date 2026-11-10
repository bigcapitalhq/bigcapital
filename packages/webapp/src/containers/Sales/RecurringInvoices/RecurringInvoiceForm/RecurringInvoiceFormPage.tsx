import { css } from '@emotion/css';
import React from 'react';
import { useParams } from 'react-router-dom';
import { RecurringInvoiceForm } from './RecurringInvoiceForm';
import {
  RecurringInvoiceFormProvider,
  useRecurringInvoiceFormContext,
} from './RecurringInvoiceFormProvider';
import { DashboardInsider } from '@/components';

/**
 * Recurring invoice form page.
 */
export function RecurringInvoiceFormPage() {
  const { id } = useParams<{ id?: string }>();
  const recurringInvoiceId = id ? parseInt(id, 10) : undefined;

  return (
    <RecurringInvoiceFormProvider recurringInvoiceId={recurringInvoiceId}>
      <RecurringInvoiceFormPageContent />
    </RecurringInvoiceFormProvider>
  );
}

function RecurringInvoiceFormPageContent() {
  const { isLoading } = useRecurringInvoiceFormContext();

  return (
    <DashboardInsider
      loading={isLoading}
      name={'recurring-invoice-form'}
      className={css`
        min-height: calc(100vh - var(--top-offset));
        max-height: calc(100vh - var(--top-offset));
      `}
    >
      <RecurringInvoiceForm />
    </DashboardInsider>
  );
}
