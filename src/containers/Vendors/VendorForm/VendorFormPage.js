import React from 'react';
import { useParams } from 'react-router-dom';

import 'style/pages/Vendors/PageForm.scss';

import { DashboardCard } from 'components';
import VendorFrom from './VendorForm';

import { VendorFormProvider } from './VendorFormProvider';

/**
 * Vendor form page.
 */
function VendorFormPage() {
  const { id } = useParams();
  
  return (
    <VendorFormProvider vendorId={id}>
      <DashboardCard page>
        <VendorFrom />
      </DashboardCard>
    </VendorFormProvider>
  );
}

export default VendorFormPage;
