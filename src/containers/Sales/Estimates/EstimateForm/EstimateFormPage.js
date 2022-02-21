import React from 'react';
import { useParams } from 'react-router-dom';

import 'style/pages/SaleEstimate/PageForm.scss';

import EstimateForm from './EstimateForm';
import { EstimateFormProvider } from './EstimateFormProvider';
import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';
import { compose } from 'utils';

/**
 * Estimate form page.
 */
function EstimateFormPage({
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const { id } = useParams();
  const idInteger = parseInt(id, 10);

  return (
    <EstimateFormProvider estimateId={idInteger} baseCurrency={base_currency}>
      <EstimateForm />
    </EstimateFormProvider>
  );
}
export default compose(withCurrentOrganization())(EstimateFormPage);
