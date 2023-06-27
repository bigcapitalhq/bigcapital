// @ts-nocheck
import React, { useCallback } from 'react';
import intl from 'react-intl-universal';

import { DialogContent } from '@/components';

import { useSettingsReceipts, useSaveSettings } from '@/hooks/query';
import ReferenceNumberForm from '@/containers/JournalNumber/ReferenceNumberForm';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import withSettings from '@/containers/Settings/withSettings';

import { compose, saveInvoke } from '@/utils';
import {
  transformFormToSettings,
  transformSettingsToForm,
} from '@/containers/JournalNumber/utils';

/**
 * Receipt number dialog's content.
 */
function ReceiptNumberDialogContent({
  // #ownProps
  receiptId,
  onConfirm,
  initialValues,

  // #withSettings
  nextNumber,
  numberPrefix,
  autoIncrement,

  // #withDialogActions
  closeDialog,
}) {
  const [referenceFormValues, setReferenceFormValues] = React.useState(null);

  const { isLoading: isSettingsLoading } = useSettingsReceipts();
  const { mutateAsync: saveSettingsMutate } = useSaveSettings();

  // Handle the form submit.
  const handleSubmitForm = (values, { setSubmitting }) => {
    const handleSuccess = () => {
      setSubmitting(false);
      closeDialog('receipt-number-form');
      saveInvoke(onConfirm, values);
    };
    const handleErrors = () => {
      setSubmitting(false);
    };
    if (values.incrementMode === 'manual-transaction') {
      handleSuccess();
      return;
    }
    // Transforms the form values to settings to save it.
    const options = transformFormToSettings(values, 'sales_receipts');

    saveSettingsMutate({ options }).then(handleSuccess).catch(handleErrors);
  };

  const handleClose = useCallback(() => {
    closeDialog('receipt-number-form');
  }, [closeDialog]);

  // Handle form change.
  const handleChange = (values) => {
    setReferenceFormValues(values);
  };

  // Description.
  const description =
    referenceFormValues?.incrementMode === 'auto'
      ? intl.get('receipt.auto_increment.auto')
      : intl.get('receipt.auto_increment.manually');

  return (
    <DialogContent isLoading={isSettingsLoading}>
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
        onChange={handleChange}
        description={description}
      />
    </DialogContent>
  );
}

export default compose(
  withDialogActions,
  withSettings(({ receiptSettings }) => ({
    nextNumber: receiptSettings?.nextNumber,
    numberPrefix: receiptSettings?.numberPrefix,
    autoIncrement: receiptSettings?.autoIncrement,
  })),
)(ReceiptNumberDialogContent);
