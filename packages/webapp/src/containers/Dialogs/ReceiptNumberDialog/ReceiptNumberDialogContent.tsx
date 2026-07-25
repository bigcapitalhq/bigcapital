// @ts-nocheck
import React, { useCallback } from 'react';
import intl from 'react-intl-universal';
import { DialogContent } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { ReferenceNumberForm } from '@/containers/JournalNumber/ReferenceNumberForm';
import {
  transformFormToSettings,
  transformSettingsToForm,
} from '@/containers/JournalNumber/utils';
import { useSettingsReceipts, useSaveSettings } from '@/hooks/query';
import { compose, saveInvoke } from '@/utils';

/**
 * Receipt number dialog's content.
 */
function ReceiptNumberDialogContentInner({
  // #ownProps
  receiptId,
  onConfirm,
  initialValues,

  // #withDialogActions
  closeDialog,
}) {
  const [referenceFormValues, setReferenceFormValues] = React.useState(null);

  const { data: receiptSettings, isLoading: isSettingsLoading } =
    useSettingsReceipts();
  const nextNumber = receiptSettings?.nextNumber as number | undefined;
  const numberPrefix = receiptSettings?.numberPrefix as string | undefined;
  const autoIncrement = receiptSettings?.autoIncrement as boolean | undefined;
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
    // Transformes the form values to settings to save it.
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

export const ReceiptNumberDialogContent = compose(withDialogActions)(
  ReceiptNumberDialogContentInner,
);
