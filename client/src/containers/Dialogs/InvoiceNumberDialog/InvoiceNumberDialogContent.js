import React from 'react';
import { useSaveSettings } from 'hooks/query';

import { InvoiceNumberDialogProvider } from './InvoiceNumberDialogProvider';
import ReferenceNumberForm from 'containers/JournalNumber/ReferenceNumberForm';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withSettings from 'containers/Settings/withSettings';
import withSettingsActions from 'containers/Settings/withSettingsActions';
import { compose } from 'utils';
import {
  transformFormToSettings,
  transformSettingsToForm,
} from 'containers/JournalNumber/utils';

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

  // Handle the submit form.
  const handleSubmitForm = (values, { setSubmitting }) => {
    // Handle the form success.
    const handleSuccess = () => {
      setSubmitting(false);
      closeDialog('invoice-number-form');
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

    // Save the goddamn settings.
    saveSettings({ options }).then(handleSuccess).catch(handleErrors);
  };

  // Handle the dialog close.
  const handleClose = () => {
    closeDialog('invoice-number-form');
  };

  return (
    <InvoiceNumberDialogProvider>
      <ReferenceNumberForm
        initialValues={{
          ...transformSettingsToForm({
            nextNumber,
            numberPrefix,
            autoIncrement,
          }),
          ...initialValues,
        }}
        onSubmit={handleSubmitForm}
        onClose={handleClose}
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
