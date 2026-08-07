import { Intent } from '@blueprintjs/core';
import { Formik, FormikHelpers } from 'formik';
import * as R from 'ramda';
import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { transferObjectOptionsToArray } from '../Accountant/utils';
import { PreferencesReceiptsForm } from './PreferencesReceiptsForm';
import { PreferencesReceiptsFormSchema } from './PreferencesReceiptsForm.schema';
import { usePreferencesReceiptsFormContext } from './PreferencesReceiptsFormBoot';
import type { ReceiptsPreferencesFormValues } from './types';
import { AppToaster } from '@/components';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import { useSaveSettings } from '@/hooks/query';
import { compose, transformToForm, transfromToSnakeCase } from '@/utils';

const defaultValues: ReceiptsPreferencesFormValues = {
  termsConditions: '',
  receiptMessage: '',
};

type PreferencesReceiptsFormPageRootProps = Pick<
  WithDashboardActionsProps,
  'changePreferencesPageTitle'
>;

/**
 * Preferences - Receipts.
 */
function PreferencesReceiptsFormPageRoot({
  // #withDashboardActions
  changePreferencesPageTitle,
}: PreferencesReceiptsFormPageRootProps) {
  const { receiptSettings } = usePreferencesReceiptsFormContext();
  // Save settings.
  const { mutateAsync: saveSettingMutate } = useSaveSettings();

  useEffect(() => {
    changePreferencesPageTitle(intl.get('preferences.receipts'));
  }, [changePreferencesPageTitle]);

  // Initial values.
  const initialValues: ReceiptsPreferencesFormValues = {
    ...defaultValues,
    ...transformToForm(receiptSettings, defaultValues),
  };
  // Handle the form submit.
  const handleFormSubmit = (
    values: ReceiptsPreferencesFormValues,
    { setSubmitting }: FormikHelpers<ReceiptsPreferencesFormValues>,
  ) => {
    const options = R.compose(
      transferObjectOptionsToArray,
      transfromToSnakeCase,
    )({ salesReceipts: { ...values } });

    // Handle request success.
    const onSuccess = () => {
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
    saveSettingMutate({ options }).then(onSuccess).catch(onError);
  };

  return (
    <Formik<ReceiptsPreferencesFormValues>
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
