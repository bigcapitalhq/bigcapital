import { Intent } from '@blueprintjs/core';
import { pick } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import { useNotifyInvoiceViaSMSContext } from './NotifyInvoiceViaSMSFormProvider';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { NotifyViaSMSForm as NotifyViaSMSFormBase } from '@/containers/NotifyViaSMS/NotifyViaSMSForm';
import { transformErrors } from '@/containers/NotifyViaSMS/utils';
import { compose } from '@/utils';

// `NotifyViaSMSForm` is `@ts-nocheck` with required destructured props; widen
// locally so this dialog can pass only the props it actually uses.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NotifyViaSMSFormProps = {
  initialValues?: any;
  notificationTypes?: any;
  onSubmit?: any;
  onCancel?: any;
  onValuesChange?: any;
  calloutCodes?: any;
  formikProps?: any;
};
const NotifyViaSMSForm =
  NotifyViaSMSFormBase as unknown as React.ComponentType<NotifyViaSMSFormProps>;

interface NotifyViaSMSFormValues {
  notification_key: string;
  [key: string]: unknown;
}

const transformFormValuesToRequest = (
  values: NotifyViaSMSFormValues,
): Record<string, unknown> => {
  return pick(values, ['notification_key']);
};

// Momerize the notification types.
const notificationTypes = [
  {
    key: 'details',
    label: intl.get('sms_notification.invoice_details.type'),
  },
  {
    key: 'reminder',
    label: intl.get('sms_notification.invoice_reminder.type'),
  },
];

interface NotifyInvoiceViaSMSFormProps extends WithDialogActionsProps {}

/**
 * Notify Invoice Via SMS Form.
 */
function NotifyInvoiceViaSMSFormInner({
  closeDialog,
}: NotifyInvoiceViaSMSFormProps): React.ReactElement {
  const {
    createNotifyInvoiceBySMSMutate,
    invoiceId,
    invoiceSMSDetail,
    dialogName,
    notificationType,
    setNotificationType,
  } = useNotifyInvoiceViaSMSContext();

  const [calloutCode, setCalloutCode] = React.useState<number[]>([]);

  // Handles the form submit.
  const handleFormSubmit = (
    values: NotifyViaSMSFormValues,
    {
      setSubmitting,
      setErrors,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      setErrors: (errors: Partial<Record<string, string>>) => void;
    },
  ) => {
    setSubmitting(true);

    // Handle request response success.
    const onSuccess = () => {
      AppToaster.show({
        message: intl.get('notify_invoice_via_sms.dialog.success_message'),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
      closeDialog(dialogName);
    };
    // Handle request response errors.
    const onError = ({
      data: { errors },
    }: {
      data: { errors: Array<{ type: string }> };
    }) => {
      if (errors) {
        transformErrors(errors, { setErrors, setCalloutCode });
      }
      setSubmitting(false);
    };
    // Transformes the form values to request.
    const requestValues = transformFormValuesToRequest(values);

    // Submits invoice SMS notification.
    // @ts-expect-error — invoiceId may be null in theory; dialog is only opened with a real id.
    createNotifyInvoiceBySMSMutate([invoiceId, requestValues])
      .then(onSuccess)
      .catch(onError);
  };
  // Handle the form cancel.
  const handleFormCancel = React.useCallback(() => {
    closeDialog(dialogName);
  }, [closeDialog, dialogName]);

  const initialValues = {
    notification_key: notificationType,
    ...invoiceSMSDetail,
  };
  // Handle form values change.
  const handleValuesChange = (values: NotifyViaSMSFormValues) => {
    if (values.notification_key !== notificationType) {
      setNotificationType(values.notification_key);
    }
  };

  return (
    <NotifyViaSMSForm
      initialValues={initialValues}
      notificationTypes={notificationTypes}
      onSubmit={handleFormSubmit}
      onCancel={handleFormCancel}
      onValuesChange={handleValuesChange}
      calloutCodes={calloutCode}
    />
  );
}

export const NotifyInvoiceViaSMSForm = compose(withDialogActions)(
  NotifyInvoiceViaSMSFormInner,
);
