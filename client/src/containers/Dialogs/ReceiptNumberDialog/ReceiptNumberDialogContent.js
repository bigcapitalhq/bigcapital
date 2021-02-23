import React, { useCallback } from 'react';
import { DialogContent } from 'components';

import { useSettingsReceipts, useSaveSettings } from 'hooks/query';
import ReferenceNumberForm from 'containers/JournalNumber/ReferenceNumberForm';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withSettings from 'containers/Settings/withSettings';

import { compose, optionsMapToArray, saveInvoke } from 'utils';

/**
 * Receipt number dialog's content.
 */

function ReceiptNumberDialogContent({
  // #ownProps
  receiptId, 
  onConfirm,

  // #withSettings
  nextNumber,
  numberPrefix,

  // #withDialogActions
  closeDialog,
}) {
  const { isLoading: isSettingsLoading } = useSettingsReceipts();
  const { mutateAsync: saveSettingsMutate } = useSaveSettings();

  const handleSubmitForm = (values, { setSubmitting }) => {
    const options = optionsMapToArray(values).map((option) => ({
      key: option.key,
      ...option,
      group: 'sales_receipts',
    }));

    saveSettingsMutate({ options })
      .then(() => {
        setSubmitting(false);
        closeDialog('receipt-number-form');
        saveInvoke(onConfirm, values)
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  const handleClose = useCallback(() => {
    closeDialog('receipt-number-form');
  }, [closeDialog]);

  return (
    <DialogContent isLoading={isSettingsLoading}>
      <ReferenceNumberForm
        initialNumber={nextNumber}
        initialPrefix={numberPrefix}
        onSubmit={handleSubmitForm}
        onClose={handleClose}
      />
    </DialogContent>
  );
}

export default compose(
  withDialogActions,
  withSettings(({ receiptSettings }) => ({
    nextNumber: receiptSettings?.nextNumber,
    numberPrefix: receiptSettings?.numberPrefix,
  })),
)(ReceiptNumberDialogContent);
