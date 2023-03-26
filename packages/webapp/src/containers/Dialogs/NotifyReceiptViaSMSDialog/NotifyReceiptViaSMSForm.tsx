// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import { Intent } from '@blueprintjs/core';
import { AppToaster } from '@/components';

import NotifyViaSMSForm from '@/containers/NotifyViaSMS/NotifyViaSMSForm';
import { useNotifyReceiptViaSMSContext } from './NotifyReceiptViaSMSFormProvider';
import { transformErrors } from '@/containers/NotifyViaSMS/utils';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

const notificationType = {
  key: 'sale-receipt-details',
  label: intl.get('sms_notification.receipt_details.type'),
};

/**
 * Notify Receipt Via SMS Form.
 */
function NotifyReceiptViaSMSForm({
  // #withDialogActions
  closeDialog,
}) {
  const {
    dialogName,
    receiptId,
    receiptSMSDetail,
    createNotifyReceiptBySMSMutate,
  } = useNotifyReceiptViaSMSContext();

  const [calloutCode, setCalloutCode] = React.useState([]);
  
  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    // Handle request response success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get('notify_receipt_via_sms.dialog.success_message'),
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
        transformErrors(errors, { setErrors, setCalloutCode });
      }
      setSubmitting(false);
    };
    createNotifyReceiptBySMSMutate([receiptId, values])
      .then(onSuccess)
      .catch(onError);
  };
  // Handle the form cancel.
  const handleFormCancel = () => {
    closeDialog(dialogName);
  };
  // Initial values.
  const initialValues = React.useMemo(
    () => ({
      ...receiptSMSDetail,
      notification_key: notificationType.key,
    }),
    [receiptSMSDetail],
  );

  return (
    <NotifyViaSMSForm
      initialValues={initialValues}
      notificationTypes={notificationType}
      onSubmit={handleFormSubmit}
      onCancel={handleFormCancel}
      calloutCodes={calloutCode}
    />
  );
}

export default compose(withDialogActions)(NotifyReceiptViaSMSForm);
