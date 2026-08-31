import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { useSMSMessageDialogContext } from './SMSMessageDialogProvider';
import { CreateSMSMessageFormSchema } from './SMSMessageForm.schema';
import { SMSMessageFormContent } from './SMSMessageFormContent';
import { transformErrors } from './utils';
import type { SMSMessageFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose, transformToForm } from '@/utils';

const defaultInitialValues: SMSMessageFormValues = {
  notificationKey: '',
  isNotificationEnabled: false,
  messageText: '',
};

interface SMSMessageFormProps extends WithDialogActionsProps {}

/**
 * SMS Message form.
 */
function SMSMessageFormInner({
  closeDialog,
}: SMSMessageFormProps): React.ReactElement {
  const { dialogName, smsNotification, editSMSNotificationMutate } =
    useSMSMessageDialogContext();

  // Initial form values.
  const initialValues: SMSMessageFormValues = {
    ...defaultInitialValues,
    ...(transformToForm(
      smsNotification as unknown as Record<string, unknown>,
      defaultInitialValues,
    ) as Partial<SMSMessageFormValues>),
    notificationKey: smsNotification.key,
    messageText: (smsNotification.smsMessage as string) ?? '',
  };

  // Handles the form submit.
  const handleFormSubmit = (
    values: SMSMessageFormValues,
    { setSubmitting, setErrors }: FormikHelpers<SMSMessageFormValues>,
  ) => {
    const form = {
      key: smsNotification.key,
      values: {
        message_text: values.messageText,
        is_notification_enabled: values.isNotificationEnabled,
      },
    };
    // Handle request response success.
    const onSuccess = () => {
      AppToaster.show({
        message: intl.get('sms_message.dialog.success_message'),
        intent: Intent.SUCCESS,
      });
      closeDialog(dialogName);
    };
    // Handle request response errors.
    const onError = ({
      data: { errors },
    }: {
      data: { errors: Array<{ type: string }> };
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

export const SMSMessageForm = compose(withDialogActions)(SMSMessageFormInner);
