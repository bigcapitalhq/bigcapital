import { Intent } from '@blueprintjs/core';
import { Formik, FormikHelpers } from 'formik';
import * as R from 'ramda';
import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { transferObjectOptionsToArray } from '../Accountant/utils';
import { PreferencesInvoiceFormSchema } from './PreferencesInvoiceForm.schema';
import { usePreferencesInvoiceFormContext } from './PreferencesInvoiceFormBoot';
import { PreferencesInvoicesForm } from './PreferencesInvoicesForm';
import type { InvoicesPreferencesFormValues } from './types';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import { AppToaster } from '@/components';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { useSaveSettings } from '@/hooks/query';
import { compose, transformToForm, transfromToSnakeCase } from '@/utils';

const defaultValues: InvoicesPreferencesFormValues = {
  termsConditions: '',
  customerNotes: '',
};

type PreferencesInvoiceFormPageInnerProps = Pick<
  WithDashboardActionsProps,
  'changePreferencesPageTitle'
>;

/**
 * Preferences - Invoices.
 */
function PreferencesInvoiceFormPageInner({
  // #withDashboardActions
  changePreferencesPageTitle,
}: PreferencesInvoiceFormPageInnerProps) {
  const { invoiceSettings } = usePreferencesInvoiceFormContext();
  // Save settings.
  const { mutateAsync: saveSettingMutate } = useSaveSettings();

  useEffect(() => {
    changePreferencesPageTitle(intl.get('preferences.invoices'));
  }, [changePreferencesPageTitle]);

  // Initial values.
  const initialValues = {
    ...defaultValues,
    ...transformToForm(invoiceSettings, defaultValues),
  };
  // Handle the form submit.
  const handleFormSubmit = (
    values: InvoicesPreferencesFormValues,
    { setSubmitting }: FormikHelpers<InvoicesPreferencesFormValues>,
  ) => {
    const options = R.compose(
      transferObjectOptionsToArray,
      transfromToSnakeCase,
    )({ salesInvoices: { ...values } });

    // Handle request success.
    const onSuccess = () => {
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
    saveSettingMutate({ options }).then(onSuccess).catch(onError);
  };

  return (
    <Formik<InvoicesPreferencesFormValues>
      initialValues={initialValues}
      validationSchema={PreferencesInvoiceFormSchema}
      onSubmit={handleFormSubmit}
      component={PreferencesInvoicesForm}
    />
  );
}

export const PreferencesInvoiceFormPage = compose(withDashboardActions)(
  PreferencesInvoiceFormPageInner,
);
