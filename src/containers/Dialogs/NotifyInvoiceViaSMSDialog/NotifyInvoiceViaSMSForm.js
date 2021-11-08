import React from 'react';
import intl from 'react-intl-universal';

import { Intent } from '@blueprintjs/core';
import { AppToaster } from 'components';

import NotifyViaSMSForm from '../../NotifyViaSMS/NotifyViaSMSForm';
import { useNotifyInvoiceViaSMSContext } from './NotifyInvoiceViaSMSFormProvider';
import { transformErrors } from '../../../containers/NotifyViaSMS/utils';

import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose } from 'utils';

/**
 * Notify Invoice Via SMS Form.
 */
function NotifyInvoiceViaSMSForm({
  // #withDialogActions
  closeDialog,
}) {
  const {
    createNotifyInvoiceBySMSMutate,
    invoiceId,
    invoiceSMSDetail,
    dialogName,
  } = useNotifyInvoiceViaSMSContext();

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    // Handle request response success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get('notify_via_sms.dialog.success_message'),
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
    createNotifyInvoiceBySMSMutate([invoiceId, values])
      .then(onSuccess)
      .catch(onError);
  };

  return (
    <NotifyViaSMSForm
      NotificationDetail={invoiceSMSDetail}
      NotificationName={dialogName}
      onSubmit={handleFormSubmit}
    />
  );
}

export default compose(withDialogActions)(NotifyInvoiceViaSMSForm);
