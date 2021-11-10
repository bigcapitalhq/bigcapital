import React from 'react';
import intl from 'react-intl-universal';

import { Intent } from '@blueprintjs/core';
import { AppToaster } from 'components';

import NotifyViaSMSForm from '../../NotifyViaSMS/NotifyViaSMSForm';
import { useNotifyPaymentReceiveViaSMSContext } from './NotifyPaymentReceiveViaFormProvider';
import { transformErrors } from '../../../containers/NotifyViaSMS/utils';

import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose } from 'utils';

const notificationType = {
  key: 'payment-receive-details',
  label: 'Payment receive thank you.',
};

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
    const onError = ({
      response: {
        data: { errors },
      },
    }) => {
      if (errors) {
        transformErrors(errors, { setErrors });
      }
      setSubmitting(false);
    };
    createNotifyPaymentReceivetBySMSMutate([paymentReceiveId, values])
      .then(onSuccess)
      .catch(onError);
  };
  // Handle the form cancel.
  const handleFormCancel = () => {
    closeDialog(dialogName);
  };

  // Form initial values.
  const initialValues = React.useMemo(
    () => ({ ...paymentReceiveMSDetail }),
    [paymentReceiveMSDetail],
  );

  return (
    <NotifyViaSMSForm
      initialValues={initialValues}
      notificationTypes={notificationType}
      onSubmit={handleFormSubmit}
      onCancel={handleFormCancel}
    />
  );
}
export default compose(withDialogActions)(NotifyPaymentReceiveViaSMSForm);
