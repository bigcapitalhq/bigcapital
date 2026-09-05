import { Intent } from '@blueprintjs/core';
import { Formik, FormikHelpers } from 'formik';
import * as R from 'ramda';
import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { transferObjectOptionsToArray } from '../Accountant/utils';
import { PreferencesEstimatesForm } from './PreferencesEstimatesForm';
import { PreferencesEstimatesFormSchema } from './PreferencesEstimatesForm.schema';
import { usePreferencesEstimatesFormContext } from './PreferencesEstimatesFormBoot';
import type { EstimatesPreferencesFormValues } from './types';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import { AppToaster } from '@/components';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { useSaveSettings } from '@/hooks/query';
import { compose, transformToForm, transfromToSnakeCase } from '@/utils';

const defaultValues: EstimatesPreferencesFormValues = {
  termsConditions: '',
  customerNotes: '',
};

type PreferencesEstimatesFormPageRootProps = Pick<
  WithDashboardActionsProps,
  'changePreferencesPageTitle'
>;

/**
 * Preferences estimates form.
 */
function PreferencesEstimatesFormPageRoot({
  // #withDashboardActions
  changePreferencesPageTitle,
}: PreferencesEstimatesFormPageRootProps) {
  const { estimatesSettings } = usePreferencesEstimatesFormContext();
  // Save Organization Settings.
  const { mutateAsync: saveSettingMutate } = useSaveSettings();

  useEffect(() => {
    changePreferencesPageTitle(intl.get('preferences.estimates'));
  }, [changePreferencesPageTitle]);

  // Initial values.
  const initialValues: EstimatesPreferencesFormValues = {
    ...defaultValues,
    ...transformToForm(estimatesSettings, defaultValues),
  };
  // Handle the form submit.
  const handleFormSubmit = (
    values: EstimatesPreferencesFormValues,
    { setSubmitting }: FormikHelpers<EstimatesPreferencesFormValues>,
  ) => {
    const options = R.compose(
      transferObjectOptionsToArray,
      transfromToSnakeCase,
    )({ salesEstimates: { ...values } });

    // Handle request success.
    const onSuccess = () => {
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
    <Formik<EstimatesPreferencesFormValues>
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
