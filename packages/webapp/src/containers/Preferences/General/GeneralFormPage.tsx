import { Intent } from '@blueprintjs/core';
import { Formik, FormikHelpers } from 'formik';
import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import '@/style/pages/Preferences/GeneralForm.scss';
import { PreferencesGeneralSchema } from './General.schema';
import { PreferencesGeneralForm as GeneralForm } from './GeneralForm';
import { useGeneralFormContext } from './GeneralFormProvider';
import type { GeneralFormValues } from './types';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import { AppToaster } from '@/components';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { compose, transformToForm } from '@/utils';

const defaultValues: GeneralFormValues = {
  name: '',
  industry: '',
  location: '',
  baseCurrency: '',
  language: '',
  fiscalYear: '',
  dateFormat: '',
  timezone: '',
  taxNumber: '',
  address: {},
};

type GeneralFormPageInnerProps = Pick<
  WithDashboardActionsProps,
  'changePreferencesPageTitle'
>;

/**
 * Preferences - General form Page.
 */
function GeneralFormPageInner({
  // #withDashboardActions
  changePreferencesPageTitle,
}: GeneralFormPageInnerProps) {
  const ctx = useGeneralFormContext()!;
  const { updateOrganization, organization } = ctx;

  useEffect(() => {
    changePreferencesPageTitle(intl.get('general'));
  }, [changePreferencesPageTitle]);

  // Initial values.
  const initialValues: GeneralFormValues = {
    ...defaultValues,
    ...(transformToForm(
      organization?.metadata,
      defaultValues,
    ) as Partial<GeneralFormValues>),
  };

  // Handle the form submit.
  const handleFormSubmit = (
    values: GeneralFormValues,
    { setSubmitting, resetForm }: FormikHelpers<GeneralFormValues>,
  ) => {
    // Handle request success.
    const onSuccess = () => {
      AppToaster.show({
        message: intl.get('preferences.general.success_message'),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);

      // Reboot the application if the application's language is mutated.
      if (organization?.metadata?.language !== values.language) {
        window.location.reload();
      }
    };
    // Handle request error.
    const onError = () => {
      setSubmitting(false);
    };
    updateOrganization({ ...values })
      .then(onSuccess)
      .catch(onError);
  };

  return (
    <Formik<GeneralFormValues>
      initialValues={initialValues}
      validationSchema={PreferencesGeneralSchema}
      onSubmit={handleFormSubmit}
      component={GeneralForm}
    />
  );
}

export const GeneralFormPage =
  compose(withDashboardActions)(GeneralFormPageInner);
