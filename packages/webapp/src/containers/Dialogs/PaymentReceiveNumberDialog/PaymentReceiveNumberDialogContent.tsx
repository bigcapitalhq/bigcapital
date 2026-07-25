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
import { useSaveSettings, useSettingsPaymentReceives } from '@/hooks/query';
import { saveInvoke, compose } from '@/utils';

/**
 * Payment receive number dialog's content.
 */
function PaymentNumberDialogContent({
  // #withDialogActions
  closeDialog,

  // #ownProps
  onConfirm,
  initialValues,
}) {
  const [referenceFormValues, setReferenceFormValues] = React.useState(null);

  const { data: paymentReceiveSettings, isLoading: isSettingsLoading } =
    useSettingsPaymentReceives();
  const nextNumber = paymentReceiveSettings?.nextNumber as number | undefined;
  const numberPrefix = paymentReceiveSettings?.numberPrefix as
    | string
    | undefined;
  const autoIncrement = paymentReceiveSettings?.autoIncrement as
    | boolean
    | undefined;
  const { mutateAsync: saveSettingsMutate } = useSaveSettings();

  const initialFormValues = {
    ...transformSettingsToForm({
      nextNumber,
      numberPrefix,
      autoIncrement,
    }),
    ...initialValues,
  };

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

  // Handle form change.
  const handleChange = (values) => {
    setReferenceFormValues(values);
  };

  // Description.
  const description =
    referenceFormValues?.incrementMode === 'auto'
      ? intl.get('payment_receive.auto_increment.auto')
      : intl.get('payment_receive.auto_increment.manually');

  return (
    <DialogContent isLoading={isSettingsLoading}>
      <ReferenceNumberForm
        initialValues={initialFormValues}
        onSubmit={handleSubmitForm}
        onClose={handleClose}
        onChange={handleChange}
        description={description}
      />
    </DialogContent>
  );
}

export const PaymentReceiveNumberDialogContent = compose(
  withDialogActions,
)(PaymentNumberDialogContent);
