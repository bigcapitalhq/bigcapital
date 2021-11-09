import React from 'react';
import intl from 'react-intl-universal';

import { Intent } from '@blueprintjs/core';
import { AppToaster } from 'components';

import NotifyViaSMSForm from '../../NotifyViaSMS/NotifyViaSMSForm';
import { useEstimateViaSMSContext } from './NotifyEstimateViaSMSFormProvider';
import { transformErrors } from '../../../containers/NotifyViaSMS/utils';

import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose } from 'utils';

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
      transformErrors(errors);
      setSubmitting(false);
    };
    createNotifyEstimateBySMSMutate([estimateId, values])
      .then(onSuccess)
      .then(onError);
  };

  return (
    <NotifyViaSMSForm
      NotificationDetail={estimateSMSDetail}
      NotificationName={dialogName}
      onSubmit={handleFormSubmit}
    />
  );
}

export default compose(withDialogActions)(NotifyEstimateViaSMSForm);
