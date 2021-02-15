import React, { useCallback } from 'react';
import { useSaveSettings } from 'hooks/query';

import { InvoiceNumberDialogProvider } from './InvoiceNumberDialogProvider';
import ReferenceNumberForm from 'containers/JournalNumber/ReferenceNumberForm';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withSettings from 'containers/Settings/withSettings';
import withSettingsActions from 'containers/Settings/withSettingsActions';
// import withInvoicesActions from 'containers/Sales/Invoice/withInvoiceActions';

import { compose, optionsMapToArray } from 'utils';

/**
 * invoice number dialog's content.
 */

function InvoiceNumberDialogContent({
  // #withSettings
  nextNumber,
  numberPrefix,
 
  // #withDialogActions
  closeDialog,
}) {
  const { mutateAsync: saveSettings } = useSaveSettings();

  const handleSubmitForm = (values, { setSubmitting }) => {
    const options = optionsMapToArray(values).map((option) => {
      return { key: option.key, ...option, group: 'sales_invoices' };
    });

    saveSettings({ options })
      .then(() => {
        setSubmitting(false);
        closeDialog('invoice-number-form');
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  // Handle the dialog close.
  const handleClose = useCallback(() => {
    closeDialog('invoice-number-form');
  }, [closeDialog]);

  return (
    <InvoiceNumberDialogProvider>
      <ReferenceNumberForm
        initialNumber={nextNumber}
        initialPrefix={numberPrefix}
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
  })),
  // withInvoicesActions,
)(InvoiceNumberDialogContent);
