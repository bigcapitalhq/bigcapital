// @ts-nocheck
import React from 'react';
import { useParams } from 'react-router-dom';

import '@/style/pages/SaleEstimate/PageForm.scss';

import EstimateForm from './EstimateForm';
import { EstimateFormProvider } from './EstimateFormProvider';
import { AutoExchangeRateProvider } from '@/containers/Entries/AutoExchangeProvider';

/**
 * Estimate form page.
 */
export default function EstimateFormPage() {
  const { id } = useParams();
  const idInteger = parseInt(id, 10);

  return (
    <EstimateFormProvider estimateId={idInteger}>
      <AutoExchangeRateProvider>
        <EstimateForm />
      </AutoExchangeRateProvider>
    </EstimateFormProvider>
  );
}
