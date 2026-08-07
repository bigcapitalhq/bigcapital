import { css } from '@emotion/css';
import React from 'react';
import { useParams } from 'react-router-dom';
import { CreditNoteForm } from './CreditNoteForm';
import {
  CreditNoteFormProvider,
  useCreditNoteFormContext,
} from './CreditNoteFormProvider';
import { DashboardInsider } from '@/components';
import { AutoExchangeRateProvider } from '@/containers/Entries/AutoExchangeProvider';

/**
 * Credit note form page.
 */
export function CreditNoteFormPage() {
  const { id } = useParams<{ id?: string }>();
  const idAsInteger = id ? parseInt(id, 10) : undefined;

  return (
    <CreditNoteFormProvider creditNoteId={idAsInteger}>
      <AutoExchangeRateProvider>
        <CreditNoteFormPageContent />
      </AutoExchangeRateProvider>
    </CreditNoteFormProvider>
  );
}

function CreditNoteFormPageContent() {
  const { isBootLoading } = useCreditNoteFormContext();

  return (
    <DashboardInsider
      loading={isBootLoading}
      className={css`
        min-height: calc(100vh - var(--top-offset));
        max-height: calc(100vh - var(--top-offset));
      `}
    >
      <CreditNoteForm />
    </DashboardInsider>
  );
}
