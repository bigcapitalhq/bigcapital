import React from 'react';
import intl from 'react-intl-universal';

import { Intent } from '@blueprintjs/core';
import { AppToaster } from 'components';

import NotifyViaSMSForm from '../../NotifyViaSMS/NotifyViaSMSForm';
import { useNotifyPaymentReceiveViaSMSContext } from './NotifyPaymentReceiveViaFormProvider';

import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose } from 'utils';

/**
 * Notify Payment Recive Via SMS Form.
 */
function NotifyPaymentReceiveViaSMSForm({
  // #withDialogActions
  closeDialog,
}) {
  const {
    dialogName,
    paymentReceiveId,
    paymentReceiveMSDetail,
    createNotifyPaymentReceivetBySMSMutate,
  } = useNotifyPaymentReceiveViaSMSContext();

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    // Handle request response success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get(
          'notify_payment_receive_via_sms.dialog.success_message',
        ),
        intent: Intent.SUCCESS,
      });
      closeDialog(dialogName);
    };

    // Handle request response errors.
    const onError = ({}) => {
      setSubmitting(false);
    };
    createNotifyPaymentReceivetBySMSMutate([paymentReceiveId, values])
      .then(onSuccess)
      .catch(onError);
  };

  return (
    <NotifyViaSMSForm
      NotificationDetail={paymentReceiveMSDetail}
      NotificationName={dialogName}
      onSubmit={handleFormSubmit}
    />
  );
}
export default compose(withDialogActions)(NotifyPaymentReceiveViaSMSForm);
