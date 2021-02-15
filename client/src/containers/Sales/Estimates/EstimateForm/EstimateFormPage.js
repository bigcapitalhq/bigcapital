import React from 'react';
import { useParams } from 'react-router-dom';
 
import 'style/pages/SaleEstimate/PageForm.scss';

import EstimateForm from './EstimateForm';
import { EstimateFormProvider } from './EstimateFormProvider';

/**
 * Estimate form page.
 */
export default function EstimateFormPage() {
  const { id } = useParams();

  return (
    <EstimateFormProvider estimateId={id}>
      <EstimateForm />
    </EstimateFormProvider>
  );
}