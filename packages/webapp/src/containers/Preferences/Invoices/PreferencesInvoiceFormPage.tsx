// @ts-nocheck
import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { Formik } from 'formik';
import { Intent } from '@blueprintjs/core';

import { AppToaster } from '@/components';
import { PreferencesInvoiceFormSchema } from './PreferencesInvoiceForm.schema';
import { usePreferencesInvoiceFormContext } from './PreferencesInvoiceFormBoot';
import { PreferencesGeneralForm } from './PreferencesInvoicesForm';
import withDashboardActions from '@/containers/Dashboard/withDashboardActions';

import { compose, transformToForm } from '@/utils';

const defaultValues = {
  termsConditions: '',
  customerNotes: '',
};

/**
 * Preferences - Invoices.
 */
function PreferencesInvoiceFormPage({
  // #withDashboardActions
  changePreferencesPageTitle,
}) {
  const { organization } = usePreferencesInvoiceFormContext();

  useEffect(() => {
    changePreferencesPageTitle(intl.get('preferences.invoices'));
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
        message: intl.get('preferences.invoices.success_message'),
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
      validationSchema={PreferencesInvoiceFormSchema}
      onSubmit={handleFormSubmit}
      component={PreferencesGeneralForm}
    />
  );
}

export default compose(withDashboardActions)(PreferencesInvoiceFormPage);
