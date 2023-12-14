// @ts-nocheck
import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { Formik } from 'formik';
import { Intent } from '@blueprintjs/core';

import { AppToaster } from '@/components';
import { PreferencesEstimatesFormSchema } from './PreferencesEstimatesForm.schema';
import { usePreferencesInvoiceFormContext } from './PreferencesEstimatesFormBoot';
import { PreferencesEstimatesForm } from './PreferencesEstimatesForm';
import withDashboardActions from '@/containers/Dashboard/withDashboardActions';

import { compose, transformToForm } from '@/utils';

const defaultValues = {
  termsConditions: '',
  customerNotes: '',
};

/**
 * Preferences - .
 */
function PreferencesEstimatesFormPageRoot({
  // #withDashboardActions
  changePreferencesPageTitle,
}) {
  const { organization } = usePreferencesInvoiceFormContext();

  useEffect(() => {
    changePreferencesPageTitle(intl.get('preferences.estimates'));
  }, [changePreferencesPageTitle]);

  // Initial values.
  const initialValues = {
    ...defaultValues,
    ...transformToForm(organization.metadata, defaultValues),
  };
  // Handle the form submit.
  const handleFormSubmit = (values, { setSubmitting }) => {
    // Handle request success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get('preferences.estimates.success_message'),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
    };
    // Handle request error.
    const onError = () => {
      setSubmitting(false);
    };
    // updateOrganization({ ...values })
    //   .then(onSuccess)
    //   .catch(onError);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={PreferencesEstimatesFormSchema}
      onSubmit={handleFormSubmit}
      component={PreferencesEstimatesForm}
    />
  );
}

export const PreferencesEstimatesFormPage = compose(withDashboardActions)(
  PreferencesEstimatesFormPageRoot,
);
