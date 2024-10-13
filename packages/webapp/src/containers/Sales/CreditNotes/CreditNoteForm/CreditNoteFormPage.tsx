// @ts-nocheck
import React from 'react';
import { useParams } from 'react-router-dom';
import { css } from '@emotion/css';
import CreditNoteForm from './CreditNoteForm';
import {
  CreditNoteFormProvider,
  useCreditNoteFormContext,
} from './CreditNoteFormProvider';
import { AutoExchangeRateProvider } from '@/containers/Entries/AutoExchangeProvider';
import { DashboardInsider } from '@/components';

/**
 * Credit note form page.
 */
export default function CreditNoteFormPage() {
  const { id } = useParams();
  const idAsInteger = parseInt(id, 10);

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
