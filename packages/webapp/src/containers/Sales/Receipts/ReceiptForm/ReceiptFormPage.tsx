import { css } from '@emotion/css';
import React from 'react';
import { useParams } from 'react-router-dom';
import { ReceiptForm } from './ReceiptForm';
import {
  ReceiptFormProvider,
  useReceiptFormContext,
} from './ReceiptFormProvider';
import { DashboardInsider } from '@/components';
import { AutoExchangeRateProvider } from '@/containers/Entries/AutoExchangeProvider';

/**
 * Receipt form page.
 */
export function ReceiptFormPage() {
  const { id } = useParams<{ id?: string }>();
  const receiptId = id ? parseInt(id, 10) : undefined;

  return (
    <ReceiptFormProvider receiptId={receiptId}>
      <AutoExchangeRateProvider>
        <ReceiptFormPageContent />
      </AutoExchangeRateProvider>
    </ReceiptFormProvider>
  );
}

function ReceiptFormPageContent() {
  const { isBootLoading } = useReceiptFormContext();

  return (
    <DashboardInsider
      loading={isBootLoading}
      className={css`
        min-height: calc(100vh - var(--top-offset));
        max-height: calc(100vh - var(--top-offset));
      `}
    >
      <ReceiptForm />
    </DashboardInsider>
  );
}
