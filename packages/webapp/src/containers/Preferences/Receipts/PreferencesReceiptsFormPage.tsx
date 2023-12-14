// @ts-nocheck
import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { Formik } from 'formik';
import { Intent } from '@blueprintjs/core';

import { AppToaster } from '@/components';
import { PreferencesReceiptsFormSchema } from './PreferencesReceiptsForm.schema';
import { usePreferencesReceiptsFormContext } from './PreferencesReceiptsFormBoot';
import { PreferencesReceiptsForm } from './PreferencesReceiptsForm';
import withDashboardActions from '@/containers/Dashboard/withDashboardActions';

import { compose, transformToForm } from '@/utils';

const defaultValues = {
  termsConditions: '',
  customerNotes: '',
};

/**
 * Preferences - Receipts.
 */
function PreferencesReceiptsFormPageRoot({
  // #withDashboardActions
  changePreferencesPageTitle,
}) {
  const { organization } = usePreferencesReceiptsFormContext();

  useEffect(() => {
    changePreferencesPageTitle(intl.get('preferences.receipts'));
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
        message: intl.get('preferences.receipts.success_message'),
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
      validationSchema={PreferencesReceiptsFormSchema}
      onSubmit={handleFormSubmit}
      component={PreferencesReceiptsForm}
    />
  );
}

export const PreferencesReceiptsFormPage = compose(withDashboardActions)(
  PreferencesReceiptsFormPageRoot,
);
