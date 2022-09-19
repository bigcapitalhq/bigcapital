// @ts-nocheck
import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { DashboardCard, DashboardInsider } from '@/components';

import CustomerFormFormik from './CustomerFormFormik';
import {
  CustomerFormProvider,
  useCustomerFormContext,
} from './CustomerFormProvider';

/**
 * Customer form page loading.
 * @returns {JSX}
 */
function CustomerFormPageLoading({ children }) {
  const { isFormLoading } = useCustomerFormContext();

  return (
    <CustomerDashboardInsider loading={isFormLoading}>
      {children}
    </CustomerDashboardInsider>
  );
}

/**
 * Customer form page.
 * @returns {JSX}
 */
export default function CustomerFormPage() {
  const history = useHistory();
  const { id } = useParams();

  const customerId = parseInt(id, 10);

  // Handle the form submit success.
  const handleSubmitSuccess = (values, formArgs, submitPayload) => {
    if (!submitPayload.noRedirect) {
      history.push('/customers');
    }
  };
  // Handle the form cancel button click.
  const handleFormCancel = () => {
    history.goBack();
  };

  return (
    <CustomerFormProvider customerId={customerId}>
      <CustomerFormPageLoading>
        <DashboardCard page>
          <CustomerFormPageFormik
            onSubmitSuccess={handleSubmitSuccess}
            onCancel={handleFormCancel}
          />
        </DashboardCard>
      </CustomerFormPageLoading>
    </CustomerFormProvider>
  );
}

const CustomerFormPageFormik = styled(CustomerFormFormik)`
  .page-form {
    &__floating-actions {
      margin-left: -40px;
      margin-right: -40px;
    }
  }
`;

const CustomerDashboardInsider = styled(DashboardInsider)`
  padding-bottom: 64px;
`;
