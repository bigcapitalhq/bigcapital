// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { InvoiceNumberDialogProvider } from './InvoiceNumberDialogProvider';
import { DialogsName } from '@/constants/dialogs';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { ReferenceNumberForm } from '@/containers/JournalNumber/ReferenceNumberForm';
import {
  transformFormToSettings,
  transformSettingsToForm,
} from '@/containers/JournalNumber/utils';
import { useSaveSettings, useSettingsInvoices } from '@/hooks/query';
import { compose } from '@/utils';

/**
 * invoice number dialog's content.
 */
function InvoiceNumberDialogContentInner({
  // #ownProps
  initialValues,
  onConfirm,

  // #withDialogActions
  closeDialog,
}) {
  const { data: invoiceSettings } = useSettingsInvoices();
  const nextNumber = invoiceSettings?.nextNumber as number | undefined;
  const numberPrefix = invoiceSettings?.numberPrefix as string | undefined;
  const autoIncrement = invoiceSettings?.autoIncrement as boolean | undefined;

  const { mutateAsync: saveSettings } = useSaveSettings();
  const [referenceFormValues, setReferenceFormValues] = React.useState(null);

  // Handle the submit form.
  const handleSubmitForm = (values, { setSubmitting }) => {
    // Handle the form success.
    const handleSuccess = () => {
      setSubmitting(false);
      closeDialog(DialogsName.InvoiceNumberSettings);
      onConfirm(values);
    };
    // Handle the form errors.
    const handleErrors = () => {
      setSubmitting(false);
    };
    if (values.incrementMode === 'manual-transaction') {
      handleSuccess();
      return;
    }
    // Transformes the form values to settings to save it.
    const options = transformFormToSettings(values, 'sales_invoices');

    // Save the settings.
    saveSettings({ options }).then(handleSuccess).catch(handleErrors);
  };
  // Handle the dialog close.
  const handleClose = () => {
    closeDialog(DialogsName.InvoiceNumberSettings);
  };
  // Handle form change.
  const handleChange = (values) => {
    setReferenceFormValues(values);
  };
  // Description.
  const description =
    referenceFormValues?.incrementMode === 'auto'
      ? intl.get('invoice.auto_increment.auto')
      : intl.get('invoice.auto_increment.manually');

  const initialFormValues = {
    ...transformSettingsToForm({
      nextNumber,
      numberPrefix,
      autoIncrement,
    }),
    ...initialValues,
  };

  return (
    <InvoiceNumberDialogProvider>
      <ReferenceNumberForm
        initialValues={initialFormValues}
        description={description}
        onSubmit={handleSubmitForm}
        onClose={handleClose}
        onChange={handleChange}
      />
    </InvoiceNumberDialogProvider>
  );
}

export const InvoiceNumberDialogContent = compose(withDialogActions)(
  InvoiceNumberDialogContentInner,
);
