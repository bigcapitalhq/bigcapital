// @ts-nocheck
import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { Formik } from 'formik';
import * as R from 'ramda';
import { Intent } from '@blueprintjs/core';

import { AppToaster } from '@/components';
import { PreferencesCreditNotesFormSchema } from './PreferencesCreditNotesForm.schema';
import { PreferencesCreditNotesForm } from './PreferencesCreditNotesForm';
import withDashboardActions from '@/containers/Dashboard/withDashboardActions';

import { compose, transformToForm, transfromToSnakeCase } from '@/utils';
import withSettings from '@/containers/Settings/withSettings';
import { transferObjectOptionsToArray } from '../Accountant/utils';
import { useSaveSettings } from '@/hooks/query';

const defaultValues = {
  termsConditions: '',
  customerNotes: '',
};

/**
 * Preferences - Credit Notes.
 */
function PreferencesCreditNotesFormPageRoot({
  // #withDashboardActions
  changePreferencesPageTitle,

  // #withSettings
  creditNoteSettings,
}) {
  // Save settings.
  const { mutateAsync: saveSettingMutate } = useSaveSettings();

  useEffect(() => {
    changePreferencesPageTitle(intl.get('preferences.creditNotes'));
  }, [changePreferencesPageTitle]);

  // Initial values.
  const initialValues = {
    ...defaultValues,
    ...transformToForm(creditNoteSettings, defaultValues),
  };
  // Handle the form submit.
  const handleFormSubmit = (values, { setSubmitting }) => {
    const options = R.compose(
      transferObjectOptionsToArray,
      transfromToSnakeCase,
    )({ creditNote: { ...values } });

    // Handle request success.
    const onSuccess = () => {
      AppToaster.show({
        message: intl.get('preferences.credit_notes.success_message'),
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
      validationSchema={PreferencesCreditNotesFormSchema}
      onSubmit={handleFormSubmit}
      component={PreferencesCreditNotesForm}
    />
  );
}

export const PreferencesCreditNotesFormPage = compose(
  withDashboardActions,
  withSettings(({ creditNoteSettings }) => ({
    creditNoteSettings: creditNoteSettings,
  })),
)(PreferencesCreditNotesFormPageRoot);
