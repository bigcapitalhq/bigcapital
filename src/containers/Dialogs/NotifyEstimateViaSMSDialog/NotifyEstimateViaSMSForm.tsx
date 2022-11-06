// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import { Intent } from '@blueprintjs/core';
import { AppToaster } from '@/components';

import NotifyViaSMSForm from '@/containers/NotifyViaSMS/NotifyViaSMSForm';
import { useEstimateViaSMSContext } from './NotifyEstimateViaSMSFormProvider';
import { transformErrors } from '@/containers/NotifyViaSMS/utils';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

const notificationType = {
  key: 'sale-estimate-details',
  label: intl.get('sms_notification.estimate_details.type'),
};

function NotifyEstimateViaSMSForm({
  // #withDialogActions
  closeDialog,
}) {
  const {
    estimateId,
    dialogName,
    estimateSMSDetail,
    createNotifyEstimateBySMSMutate,
  } = useEstimateViaSMSContext();

  const [calloutCode, setCalloutCode] = React.useState([]);

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);

    // Handle request response success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get('notify_estimate_via_sms.dialog.success_message'),
        intent: Intent.SUCCESS,
      });
      closeDialog(dialogName);
      setSubmitting(false);
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
    createNotifyEstimateBySMSMutate([estimateId, values])
      .then(onSuccess)
      .catch(onError);
  };

  const initialValues = {
    ...estimateSMSDetail,
    notification_key: notificationType.key,
  };
  // Handle the form cancel.
  const handleFormCancel = () => {
    closeDialog(dialogName);
  };

  return (
    <NotifyViaSMSForm
      initialValues={initialValues}
      notificationTypes={[notificationType]}
      onCancel={handleFormCancel}
      onSubmit={handleFormSubmit}
      calloutCodes={calloutCode}
    />
  );
}

export default compose(withDialogActions)(NotifyEstimateViaSMSForm);
