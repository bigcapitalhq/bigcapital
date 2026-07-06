// @ts-nocheck
import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Box, DashboardCard, DashboardInsider } from '@/components';
import { CustomerFormFormik, ustomerFormFormik } from './CustomerFormFormik';
import {
  CustomerFormProvider,
  useCustomerFormContext,
} from './CustomerFormProvider';

/**
 * Customer form page.
 * @returns {JSX}
 */
export function CustomerFormPage() {
  const { id } = useParams();
  const customerId = id ? parseInt(id, 10) : undefined;

  return (
    <CustomerFormProvider customerId={customerId}>
      <CustomerFormPageContent />
    </CustomerFormProvider>
  );
}

function CustomerFormPageContent() {
  const history = useHistory();
  const { isFormLoading } = useCustomerFormContext();

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
    <DashboardInsider loading={isFormLoading}>
      <Box mx={'auto'} maxWidth={800}>
        <CustomerFormFormik
          onSubmitSuccess={handleSubmitSuccess}
          onCancel={handleFormCancel}
        />
      </Box>
    </DashboardInsider>
  );
}
