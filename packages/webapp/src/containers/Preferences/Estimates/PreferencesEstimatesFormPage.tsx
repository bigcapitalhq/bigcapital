// @ts-nocheck
import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { Formik } from 'formik';
import { Intent } from '@blueprintjs/core';
import * as R from 'ramda';

import { AppToaster } from '@/components';
import { PreferencesEstimatesFormSchema } from './PreferencesEstimatesForm.schema';
import { PreferencesEstimatesForm } from './PreferencesEstimatesForm';
import withDashboardActions from '@/containers/Dashboard/withDashboardActions';
import withSettings from '@/containers/Settings/withSettings';

import { transferObjectOptionsToArray } from '../Accountant/utils';
import { compose, transformToForm, transfromToSnakeCase } from '@/utils';
import { useSaveSettings } from '@/hooks/query';

const defaultValues = {
  termsConditions: '',
  customerNotes: '',
};

/**
 * Preferences estimates form.
 */
function PreferencesEstimatesFormPageRoot({
  // #withDashboardActions
  changePreferencesPageTitle,

  // #withSettings
  estimatesSettings,
}) {
  // Save Organization Settings.
  const { mutateAsync: saveSettingMutate } = useSaveSettings();

  useEffect(() => {
    changePreferencesPageTitle(intl.get('preferences.estimates'));
  }, [changePreferencesPageTitle]);

  // Initial values.
  const initialValues = {
    ...defaultValues,
    ...transformToForm(estimatesSettings, defaultValues),
  };
  // Handle the form submit.
  const handleFormSubmit = (values, { setSubmitting }) => {
    const options = R.compose(
      transferObjectOptionsToArray,
      transfromToSnakeCase,
    )({ salesEstimates: { ...values } });

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
    saveSettingMutate({ options }).then(onSuccess).catch(onError);
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

export const PreferencesEstimatesFormPage = compose(
  withDashboardActions,
  withSettings(({ estimatesSettings }) => ({
    estimatesSettings: estimatesSettings,
  })),
)(PreferencesEstimatesFormPageRoot);
