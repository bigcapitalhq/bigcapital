// @ts-nocheck
import { x } from '@xstyled/emotion';
import { Formik } from 'formik';
import React from 'react';
import { getSetupOrganizationValidation } from './SetupOrganization.schema';
import { SetupOrganizationForm } from './SetupOrganizationForm';
import { FormattedMessage as T } from '@/components';
import { useOrganizationSetup, useSettingsOrganization } from '@/hooks/query';
import { setCookie, transfromToSnakeCase } from '@/utils';

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
export function SetupOrganizationPage({ wizard }) {
  const { mutateAsync: organizationSetupMutate } = useOrganizationSetup();
  const { data: organizationSettings } = useSettingsOrganization();

  // Validation schema.
  const validationSchema = getSetupOrganizationValidation();

  // Initialize values.
  const initialValues = {
    ...defaultValues,
    ...(organizationSettings
      ? {
          name: organizationSettings.name ?? defaultValues.name,
          location: organizationSettings.location ?? defaultValues.location,
          baseCurrency:
            organizationSettings.baseCurrency ?? defaultValues.baseCurrency,
          language: organizationSettings.language ?? defaultValues.language,
          fiscalYear:
            organizationSettings.fiscalYear ?? defaultValues.fiscalYear,
          timezone: organizationSettings.timezone ?? defaultValues.timezone,
        }
      : {}),
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
