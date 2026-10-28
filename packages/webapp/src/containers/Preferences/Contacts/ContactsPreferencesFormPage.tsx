import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import * as FF from 'fp-ts/function';
import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { ContactsPreferencesSchema } from './ContactsPreferences.schema';
import {
  ContactsPreferencesForm,
  type ContactsPreferencesFormValues,
} from './ContactsPreferencesForm';
import { useContactsPreferencesFormContext } from './ContactsPreferencesFormProvider';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import { AppToaster } from '@/components';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';

const defaultFormValues: ContactsPreferencesFormValues = {
  customerAutoIncrement: true,
  customerNumberPrefix: 'CUST-',
  customerNextNumber: '00001',
  vendorAutoIncrement: true,
  vendorNumberPrefix: 'VEND-',
  vendorNextNumber: '00001',
};

interface ContactsPreferencesFormPageProps extends WithDashboardActionsProps {}

function ContactsPreferencesFormPageInner({
  changePreferencesPageTitle,
}: ContactsPreferencesFormPageProps): React.ReactElement {
  const { customersSettings, vendorsSettings, saveSettingMutate } =
    useContactsPreferencesFormContext();

  const initialValues: ContactsPreferencesFormValues = {
    customerAutoIncrement:
      (customersSettings?.autoIncrement as boolean | undefined) ??
      defaultFormValues.customerAutoIncrement,
    customerNumberPrefix:
      (customersSettings?.numberPrefix as string | undefined) ??
      defaultFormValues.customerNumberPrefix,
    customerNextNumber:
      customersSettings?.nextNumber != null
        ? String(customersSettings.nextNumber)
        : defaultFormValues.customerNextNumber,
    vendorAutoIncrement:
      (vendorsSettings?.autoIncrement as boolean | undefined) ??
      defaultFormValues.vendorAutoIncrement,
    vendorNumberPrefix:
      (vendorsSettings?.numberPrefix as string | undefined) ??
      defaultFormValues.vendorNumberPrefix,
    vendorNextNumber:
      vendorsSettings?.nextNumber != null
        ? String(vendorsSettings.nextNumber)
        : defaultFormValues.vendorNextNumber,
  };

  useEffect(() => {
    changePreferencesPageTitle(intl.get('preferences.contacts'));
  }, [changePreferencesPageTitle]);

  const handleFormSubmit = (
    values: ContactsPreferencesFormValues,
    { setSubmitting }: FormikHelpers<ContactsPreferencesFormValues>,
  ) => {
    const options = [
      {
        group: 'customers',
        key: 'auto_increment',
        value: values.customerAutoIncrement,
      },
      {
        group: 'customers',
        key: 'number_prefix',
        value: values.customerNumberPrefix.trim(),
      },
      {
        group: 'customers',
        key: 'next_number',
        value: values.customerNextNumber.trim(),
      },
      {
        group: 'vendors',
        key: 'auto_increment',
        value: values.vendorAutoIncrement,
      },
      {
        group: 'vendors',
        key: 'number_prefix',
        value: values.vendorNumberPrefix.trim(),
      },
      {
        group: 'vendors',
        key: 'next_number',
        value: values.vendorNextNumber.trim(),
      },
    ];

    const onSuccess = () => {
      AppToaster.show({
        message: intl.get('pref.contacts.success_message'),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
    };

    const onError = () => {
      setSubmitting(false);
    };
    saveSettingMutate({ options }).then(onSuccess).catch(onError);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ContactsPreferencesSchema}
      onSubmit={handleFormSubmit}
      component={ContactsPreferencesForm}
    />
  );
}

export const ContactsPreferencesFormPage = FF.pipe(
  ContactsPreferencesFormPageInner,
  withDashboardActions,
);
