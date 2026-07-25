import { Intent } from '@blueprintjs/core';
import { Formik, FormikHelpers } from 'formik';
import * as R from 'ramda';
import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { transferObjectOptionsToArray } from '../Accountant/utils';
import { PreferencesCreditNotesForm } from './PreferencesCreditNotesForm';
import { PreferencesCreditNotesFormSchema } from './PreferencesCreditNotesForm.schema';
import { usePreferencesCreditNotesFormContext } from './PreferencesCreditNotesFormBoot';
import type { CreditNotesPreferencesFormValues } from './types';
import { AppToaster } from '@/components';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import { useSaveSettings } from '@/hooks/query';
import { compose, transformToForm, transfromToSnakeCase } from '@/utils';

const defaultValues: CreditNotesPreferencesFormValues = {
  termsConditions: '',
  customerNotes: '',
};

type PreferencesCreditNotesFormPageRootProps = Pick<
  WithDashboardActionsProps,
  'changePreferencesPageTitle'
>;

/**
 * Preferences - Credit Notes.
 */
function PreferencesCreditNotesFormPageRoot({
  // #withDashboardActions
  changePreferencesPageTitle,
}: PreferencesCreditNotesFormPageRootProps) {
  const { creditNoteSettings } = usePreferencesCreditNotesFormContext();
  // Save settings.
  const { mutateAsync: saveSettingMutate } = useSaveSettings();

  useEffect(() => {
    changePreferencesPageTitle(intl.get('preferences.creditNotes'));
  }, [changePreferencesPageTitle]);

  // Initial values.
  const initialValues: CreditNotesPreferencesFormValues = {
    ...defaultValues,
    ...transformToForm(creditNoteSettings, defaultValues),
  };
  // Handle the form submit.
  const handleFormSubmit = (
    values: CreditNotesPreferencesFormValues,
    { setSubmitting }: FormikHelpers<CreditNotesPreferencesFormValues>,
  ) => {
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
    <Formik<CreditNotesPreferencesFormValues>
      initialValues={initialValues}
      validationSchema={PreferencesCreditNotesFormSchema}
      onSubmit={handleFormSubmit}
      component={PreferencesCreditNotesForm}
    />
  );
}

export const PreferencesCreditNotesFormPage = compose(withDashboardActions)(
  PreferencesCreditNotesFormPageRoot,
);
