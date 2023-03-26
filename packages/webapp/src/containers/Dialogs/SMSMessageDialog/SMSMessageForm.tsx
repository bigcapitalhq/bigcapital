// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Formik } from 'formik';
import { omit } from 'lodash';
import { Intent } from '@blueprintjs/core';

import { AppToaster } from '@/components';

import SMSMessageFormContent from './SMSMessageFormContent';
import { CreateSMSMessageFormSchema } from './SMSMessageForm.schema';
import { useSMSMessageDialogContext } from './SMSMessageDialogProvider';
import { transformErrors } from './utils';

import withDialogActions from '@/containers/Dialog/withDialogActions';

import { compose, transformToForm } from '@/utils';

const defaultInitialValues = {
  notification_key: '',
  is_notification_enabled: '',
  message_text: '',
};

/**
 * SMS Message form.
 */
function SMSMessageForm({
  // #withDialogActions
  closeDialog,
}) {
  const { dialogName, smsNotification, editSMSNotificationMutate } =
    useSMSMessageDialogContext();

  // Initial form values.
  const initialValues = {
    ...defaultInitialValues,
    ...transformToForm(smsNotification, defaultInitialValues),
    notification_key: smsNotification.key,
    message_text: smsNotification.sms_message,
  };

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    const form = {
      ...omit(values, ['is_notification_enabled', 'sms_message']),
      notification_key: smsNotification.key,
    };
    // Handle request response success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get('sms_message.dialog.success_message'),
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
    editSMSNotificationMutate(form).then(onSuccess).catch(onError);
  };

  return (
    <Formik
      validationSchema={CreateSMSMessageFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={SMSMessageFormContent}
    />
  );
}

export default compose(withDialogActions)(SMSMessageForm);
