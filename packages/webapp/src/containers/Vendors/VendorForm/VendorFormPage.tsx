// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { useParams, useHistory } from 'react-router-dom';

import '@/style/pages/Vendors/PageForm.scss';

import { DashboardCard, DashboardInsider } from '@/components';
import { VendorFormProvider, useVendorFormContext } from './VendorFormProvider';
import VendorFormFormik from './VendorFormFormik';

/**
 * Vendor form page loading wrapper.
 * @returns {JSX}
 */
function VendorFormPageLoading({ children }) {
  const { isFormLoading } = useVendorFormContext();

  return (
    <VendorDashboardInsider loading={isFormLoading}>
      {children}
    </VendorDashboardInsider>
  );
}

/**
 * Vendor form page.
 */
export default function VendorFormPage() {
  const history = useHistory();
  const { id } = useParams();

  // Handle the form submit success.
  const handleSubmitSuccess = (values, formArgs, submitPayload) => {
    if (!submitPayload.noRedirect) {
      history.push('/vendors');
    }
  };
  // Handle the form cancel button click.
  const handleFormCancel = () => {
    history.goBack();
  };

  return (
    <VendorFormProvider vendorId={id}>
      <VendorFormPageLoading>
        <DashboardCard page>
          <VendorFormPageFormik
            onSubmitSuccess={handleSubmitSuccess}
            onCancel={handleFormCancel}
          />
        </DashboardCard>
      </VendorFormPageLoading>
    </VendorFormProvider>
  );
}

const VendorFormPageFormik = styled(VendorFormFormik)`
  .page-form {
    &__floating-actions {
      margin-left: -40px;
      margin-right: -40px;
    }
  }
`;

const VendorDashboardInsider = styled(DashboardInsider)`
  padding-bottom: 64px;
`;
