// @ts-nocheck
import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { Formik } from 'formik';
import { Intent } from '@blueprintjs/core';

import '@/style/pages/Preferences/GeneralForm.scss';

import { AppToaster } from '@/components';
import { PreferencesGeneralForm as GeneralForm } from './GeneralForm';
import { PreferencesGeneralSchema } from './General.schema';
import { useGeneralFormContext } from './GeneralFormProvider';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';

import { transformToForm } from '@/utils';
import { flow } from 'fp-ts/function';

const defaultValues = {
  name: '',
  industry: '',
  location: '',
  base_currency: '',
  language: '',
  fiscal_year: '',
  date_format: '',
  timezone: '',
  tax_number: '',
  address: {},
};

/**
 * Preferences - General form Page.
 */
function GeneralFormPageInner({
  // #withDashboardActions
  changePreferencesPageTitle,
}) {
  const { updateOrganization, organization } = useGeneralFormContext();

  useEffect(() => {
    changePreferencesPageTitle(intl.get('general'));
  }, [changePreferencesPageTitle]);

  // Initial values.
  const initialValues = {
    ...defaultValues,
    ...transformToForm(organization.metadata, defaultValues),
  };
  // Handle the form submit.
  const handleFormSubmit = (values, { setSubmitting, resetForm }) => {
    // Handle request success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get('preferences.general.success_message'),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);

      // Reboot the application if the application's language is mutated.
      if (organization.metadata?.language !== values.language) {
        window.location.reload();
      }
    };
    // Handle request error.
    const onError = (errors) => {
      setSubmitting(false);
    };
    updateOrganization({ ...values })
      .then(onSuccess)
      .catch(onError);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={PreferencesGeneralSchema}
      onSubmit={handleFormSubmit}
      component={GeneralForm}
    />
  );
}

export const GeneralFormPage = flow(withDashboardActions)(
  GeneralFormPageInner,
);
