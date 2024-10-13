// @ts-nocheck
import React from 'react';
import { useParams } from 'react-router-dom';
import { css } from '@emotion/css';

import {
  ReceiptFormProvider,
  useReceiptFormContext,
} from './ReceiptFormProvider';
import { AutoExchangeRateProvider } from '@/containers/Entries/AutoExchangeProvider';
import { DashboardInsider } from '@/components';
import { ReceiptForm } from './ReceiptForm';

/**
 * Receipt form page.
 */
export default function ReceiptFormPage() {
  const { id } = useParams();
  const receiptId = parseInt(id, 10);

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
