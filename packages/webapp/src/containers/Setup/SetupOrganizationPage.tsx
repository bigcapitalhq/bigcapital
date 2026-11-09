import { x } from '@xstyled/emotion';
import { Formik, FormikHelpers } from 'formik';
import { getSetupOrganizationValidation } from './SetupOrganization.schema';
import { SetupOrganizationForm } from './SetupOrganizationForm';
import type { SetupOrganizationFormValues } from './SetupOrganization.schema';
import { useOrganizationSetup } from '@/hooks/query';
import { setCookie, transfromToSnakeCase } from '@/utils';

// Initial values.
const defaultValues: SetupOrganizationFormValues = {
  name: '',
  location: '',
  baseCurrency: '',
  language: 'en',
  fiscalYear: '',
  timezone: '',
};

export interface SetupOrganizationPageProps {
  wizard?: {
    next?: () => void;
  };
}

/**
 * Setup organization form.
 */
export function SetupOrganizationPage({ wizard }: SetupOrganizationPageProps) {
  const { mutateAsync: organizationSetupMutate } = useOrganizationSetup();

  // Validation schema.
  const validationSchema = getSetupOrganizationValidation();

  // Initialize values.
  const initialValues: SetupOrganizationFormValues = { ...defaultValues };

  // Handle the form submit.
  const handleSubmit = (
    values: SetupOrganizationFormValues,
    { setSubmitting }: FormikHelpers<SetupOrganizationFormValues>,
  ) => {
    organizationSetupMutate({ ...transfromToSnakeCase(values) })
      .then(() => {
        setSubmitting(false);

        // Sets locale cookie to next boot cycle.
        setCookie('locale', values.language);
        wizard?.next?.();
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  return (
    <x.div
      maxWidth={'600px'}
      w="100%"
      mx="auto"
      pt={'45px'}
      pb={'20px'}
      px={'25px'}
    >
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        component={SetupOrganizationForm}
        onSubmit={handleSubmit}
      />
    </x.div>
  );
}
