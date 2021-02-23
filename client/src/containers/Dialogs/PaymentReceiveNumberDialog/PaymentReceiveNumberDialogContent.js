import React, { useCallback } from 'react';
import { DialogContent } from 'components';
import { useSaveSettings, useSettingsPaymentReceives } from 'hooks/query';

import ReferenceNumberForm from 'containers/JournalNumber/ReferenceNumberForm';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withSettingsActions from 'containers/Settings/withSettingsActions';
import withSettings from 'containers/Settings/withSettings';

import { saveInvoke, compose, optionsMapToArray } from 'utils';

/**
 * payment receive number dialog's content.
 */

function PaymentNumberDialogContent({
  // #withSettings
  nextNumber,
  numberPrefix,

  // #withDialogActions
  closeDialog,

  // #ownProps
  onConfirm,
}) {
  const { isLoading: isSettingsLoading } = useSettingsPaymentReceives();
  const { mutateAsync: saveSettingsMutate } = useSaveSettings();

  const handleSubmitForm = (values, { setSubmitting }) => {
    const options = optionsMapToArray(values).map((option) => ({
      key: option.key,
      ...option,
      group: 'payment_receives',
    }));

    saveSettingsMutate({ options })
      .then(() => {
        setSubmitting(false);
        closeDialog('payment-receive-number-form');

        saveInvoke(onConfirm, values);
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  const handleClose = useCallback(() => {
    closeDialog('payment-receive-number-form');
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
  withSettingsActions,
  withSettings(({ paymentReceiveSettings }) => ({
    nextNumber: paymentReceiveSettings?.nextNumber,
    numberPrefix: paymentReceiveSettings?.numberPrefix,
  })),
)(PaymentNumberDialogContent);
