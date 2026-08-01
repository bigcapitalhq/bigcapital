import { Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { useNotifyPaymentReceiveViaSMSContext } from './NotifyPaymentReceiveViaFormProvider';
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

const notificationType = {
  key: 'payment-receive-details',
  label: intl.get('sms_notification.payment_details.type'),
};

interface NotifyPaymentReceiveViaSMSFormProps extends WithDialogActionsProps {}

/**
 * Notify Payment Recive Via SMS Form.
 */
function NotifyPaymentReceiveViaSMSFormInner({
  closeDialog,
}: NotifyPaymentReceiveViaSMSFormProps): React.ReactElement {
  const {
    dialogName,
    paymentReceiveId,
    paymentReceiveMSDetail,
    createNotifyPaymentReceivetBySMSMutate,
  } = useNotifyPaymentReceiveViaSMSContext();

  const [calloutCode, setCalloutCode] = React.useState<number[]>([]);

  // Handles the form submit.
  const handleFormSubmit = (
    values: NotifyViaSMSFormValues,
    {
      setErrors,
    }: {
      setErrors: (errors: Partial<Record<string, string>>) => void;
    },
  ) => {
    // Handle request response success.
    const onSuccess = () => {
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
      data: { errors },
    }: {
      data: { errors: Array<{ type: string }> };
    }) => {
      if (errors) {
        transformErrors(errors, { setErrors, setCalloutCode });
      }
    };
    // @ts-expect-error — paymentReceiveId may be null in theory; dialog only opens with real id.
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
    () => ({
      ...paymentReceiveMSDetail,
      notification_key: notificationType.key,
    }),
    [paymentReceiveMSDetail],
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
export const NotifyPaymentReceiveViaSMSForm = compose(withDialogActions)(
  NotifyPaymentReceiveViaSMSFormInner,
);
