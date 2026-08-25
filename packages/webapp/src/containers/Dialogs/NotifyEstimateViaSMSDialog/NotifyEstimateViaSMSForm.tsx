import { Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { useEstimateViaSMSContext } from './NotifyEstimateViaSMSFormProvider';
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
  key: 'sale-estimate-details',
  label: intl.get('sms_notification.estimate_details.type'),
};

interface NotifyEstimateViaSMSFormProps extends WithDialogActionsProps {}

function NotifyEstimateViaSMSFormInner({
  closeDialog,
}: NotifyEstimateViaSMSFormProps): React.ReactElement {
  const {
    estimateId,
    dialogName,
    estimateSMSDetail,
    createNotifyEstimateBySMSMutate,
  } = useEstimateViaSMSContext();

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
        message: intl.get('notify_estimate_via_sms.dialog.success_message'),
        intent: Intent.SUCCESS,
      });
      closeDialog(dialogName);
      setSubmitting(false);
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
    // @ts-expect-error — estimateId may be null in theory; dialog only opens with real id.
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

export const NotifyEstimateViaSMSForm = compose(withDialogActions)(
  NotifyEstimateViaSMSFormInner,
);
