import React, { useCallback } from 'react';
import { DialogContent } from 'components';
import { useSaveSettings, useSettingsPaymentReceives } from 'hooks/query';

import ReferenceNumberForm from 'containers/JournalNumber/ReferenceNumberForm';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withSettingsActions from 'containers/Settings/withSettingsActions';
import withSettings from 'containers/Settings/withSettings';

import { saveInvoke, compose } from 'utils';
import {
  transformFormToSettings,
  transformSettingsToForm,
} from 'containers/JournalNumber/utils';

/**
 * Payment receive number dialog's content.
 */
function PaymentNumberDialogContent({
  // #withSettings
  nextNumber,
  numberPrefix,
  autoIncrement,

  // #withDialogActions
  closeDialog,

  // #ownProps
  onConfirm,
  initialValues
}) {
  const { isLoading: isSettingsLoading } = useSettingsPaymentReceives();
  const { mutateAsync: saveSettingsMutate } = useSaveSettings();

  // Handle submit form.
  const handleSubmitForm = (values, { setSubmitting }) => {
    // Transformes the form values to settings to save it.
    const options = transformFormToSettings(values, 'payment_receives');

    const handleSuccess = () => {
      setSubmitting(false);
      closeDialog('payment-receive-number-form');

      saveInvoke(onConfirm, values);
    };
    const handleErrors = () => {
      setSubmitting(false);
    };
    if (values.incrementMode === 'manual-transaction') {
      handleSuccess();
      return;
    }
    saveSettingsMutate({ options }).then(handleSuccess).catch(handleErrors);
  };

  const handleClose = useCallback(() => {
    closeDialog('payment-receive-number-form');
  }, [closeDialog]);

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
    autoIncrement: paymentReceiveSettings?.autoIncrement,
  })),
)(PaymentNumberDialogContent);
