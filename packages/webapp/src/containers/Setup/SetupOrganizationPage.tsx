// @ts-nocheck
import React from 'react';
import { Formik } from 'formik';
import { FormattedMessage as T } from '@/components';
import { x } from '@xstyled/emotion';

import SetupOrganizationForm from './SetupOrganizationForm';

import { useOrganizationSetup } from '@/hooks/query';
import withSettingsActions from '@/containers/Settings/withSettingsActions';

import { getSetupOrganizationValidation } from './SetupOrganization.schema';
import { setCookie, compose, transfromToSnakeCase } from '@/utils';

// Initial values.
const defaultValues = {
  name: '',
  location: '',
  baseCurrency: '',
  language: 'en',
  fiscalYear: '',
  timezone: '',
};

/**
 * Setup organization form.
 */
function SetupOrganizationPage({ wizard }) {
  const { mutateAsync: organizationSetupMutate } = useOrganizationSetup();

  // Validation schema.
  const validationSchema = getSetupOrganizationValidation();

  // Initialize values.
  const initialValues = {
    ...defaultValues,
  };

  // Handle the form submit.
  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    organizationSetupMutate({ ...transfromToSnakeCase(values) })
      .then((response) => {
        setSubmitting(false);

        // Sets locale cookie to next boot cycle.
        setCookie('locale', values.language);
        wizard.next();
      })
      .catch((erros) => {
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

export default compose(withSettingsActions)(SetupOrganizationPage);
