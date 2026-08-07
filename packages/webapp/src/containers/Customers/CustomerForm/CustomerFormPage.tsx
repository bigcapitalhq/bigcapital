import { useParams, useHistory } from 'react-router-dom';
import { CustomerFormFormik } from './CustomerFormFormik';
import {
  CustomerFormProvider,
  useCustomerFormContext,
} from './CustomerFormProvider';
import type { CustomerFormValues } from './utils';
import { Box, DashboardInsider } from '@/components';
import type { FormikHelpers } from 'formik';

type CustomerFormSubmitPayload = {
  noRedirect?: boolean;
};

/**
 * Customer form page.
 */
export function CustomerFormPage() {
  const { id } = useParams<{ id?: string }>();
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

  const handleSubmitSuccess = (
    _values: CustomerFormValues,
    _formArgs: FormikHelpers<CustomerFormValues>,
    submitPayload: CustomerFormSubmitPayload,
  ) => {
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
