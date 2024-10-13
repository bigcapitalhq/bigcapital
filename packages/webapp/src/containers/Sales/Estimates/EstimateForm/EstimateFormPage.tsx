// @ts-nocheck
import React from 'react';
import { useParams } from 'react-router-dom';
import { css } from '@emotion/css';

import EstimateForm from './EstimateForm';
import {
  EstimateFormProvider,
  useEstimateFormContext,
} from './EstimateFormProvider';
import { AutoExchangeRateProvider } from '@/containers/Entries/AutoExchangeProvider';
import { DashboardInsider } from '@/components';

/**
 * Estimate form page.
 */
export default function EstimateFormPage() {
  const { id } = useParams();
  const idInteger = parseInt(id, 10);

  return (
    <EstimateFormProvider estimateId={idInteger}>
      <AutoExchangeRateProvider>
        <EstimateFormPageContent />
      </AutoExchangeRateProvider>
    </EstimateFormProvider>
  );
}

export function EstimateFormPageContent() {
  const { isBootLoading } = useEstimateFormContext();

  return (
    <DashboardInsider
      loading={isBootLoading}
      className={css`
        min-height: calc(100vh - var(--top-offset));
        max-height: calc(100vh - var(--top-offset));
      `}
    >
      <EstimateForm />
    </DashboardInsider>
  );
}
