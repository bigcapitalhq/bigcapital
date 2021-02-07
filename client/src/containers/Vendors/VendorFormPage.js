import React from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { DashboardCard } from 'components';
import VendorFrom from './VendorForm';

import { VendorFormProvider } from './VendorFormProvider';

/**
 * Vendor form page.
 */
function VendorFormPage() {
  const { id } = useParams();
  const history = useHistory();
 
  return (
    <VendorFormProvider vendorId={id}>
      <DashboardCard page>
        <VendorFrom />
      </DashboardCard>
    </VendorFormProvider>
  );
}

export default VendorFormPage;
