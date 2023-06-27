// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { useSaveSettings } from '@/hooks/query';

import { InvoiceNumberDialogProvider } from './InvoiceNumberDialogProvider';
import ReferenceNumberForm from '@/containers/JournalNumber/ReferenceNumberForm';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import withSettings from '@/containers/Settings/withSettings';
import withSettingsActions from '@/containers/Settings/withSettingsActions';
import { compose } from '@/utils';
import {
  transformFormToSettings,
  transformSettingsToForm,
} from '@/containers/JournalNumber/utils';
import { DialogsName } from '@/constants/dialogs';

/**
 * invoice number dialog's content.
 */
function InvoiceNumberDialogContent({
  // #ownProps
  initialValues,
  onConfirm,

  // #withSettings
  nextNumber,
  numberPrefix,
  autoIncrement,

  // #withDialogActions
  closeDialog,
}) {
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
    // Transforms the form values to settings to save it.
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

export default compose(
  withDialogActions,
  withSettingsActions,
  withSettings(({ invoiceSettings }) => ({
    nextNumber: invoiceSettings?.nextNumber,
    numberPrefix: invoiceSettings?.numberPrefix,
    autoIncrement: invoiceSettings?.autoIncrement,
  })),
)(InvoiceNumberDialogContent);
