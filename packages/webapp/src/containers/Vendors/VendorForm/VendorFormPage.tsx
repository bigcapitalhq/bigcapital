import { FormikHelpers } from 'formik';
import { useParams, useHistory } from 'react-router-dom';
import { VendorFormFormik } from './VendorFormFormik';
import { VendorFormProvider, useVendorFormContext } from './VendorFormProvider';
import type { VendorFormValues } from './utils';
import type { VendorFormSubmitPayload } from './VendorFormProvider';
import { Box, DashboardInsider } from '@/components';

/**
 * Vendor form page loading wrapper.
 */
function VendorFormPageLoading({ children }: { children: React.ReactNode }) {
  const { isFormLoading } = useVendorFormContext();

  return (
    <DashboardInsider loading={isFormLoading}>{children}</DashboardInsider>
  );
}

/**
 * Vendor form page.
 */
export function VendorFormPage() {
  const history = useHistory();
  const { id } = useParams<{ id?: string }>();
  const vendorId = id ? parseInt(id, 10) : undefined;

  // Handle the form submit success.
  const handleSubmitSuccess = (
    _values: VendorFormValues,
    _formArgs: FormikHelpers<VendorFormValues>,
    submitPayload: VendorFormSubmitPayload,
  ) => {
    if (!submitPayload.noRedirect) {
      history.push('/vendors');
    }
  };
  // Handle the form cancel button click.
  const handleFormCancel = () => {
    history.goBack();
  };

  return (
    <VendorFormProvider vendorId={vendorId}>
      <VendorFormPageLoading>
        <Box mx={'auto'} maxWidth={800}>
          <VendorFormFormik
            onSubmitSuccess={handleSubmitSuccess}
            onCancel={handleFormCancel}
          />
        </Box>
      </VendorFormPageLoading>
    </VendorFormProvider>
  );
}
