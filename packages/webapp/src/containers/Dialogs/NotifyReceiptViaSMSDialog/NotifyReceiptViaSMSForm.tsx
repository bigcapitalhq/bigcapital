import { Intent } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import intl from 'react-intl-universal';
import { useNotifyReceiptViaSMSContext } from './NotifyReceiptViaSMSFormProvider';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import {
  NotifyViaSMSForm,
  type NotifyViaSMSFormValues,
} from '@/containers/NotifyViaSMS/NotifyViaSMSForm';
import { transformErrors } from '@/containers/NotifyViaSMS/utils';

const notificationType = {
  key: 'sale-receipt-details',
  label: intl.get('sms_notification.receipt_details.type'),
};

interface NotifyReceiptViaSMSFormProps extends WithDialogActionsProps {}

/**
 * Notify Receipt Via SMS Form.
 */
function NotifyReceiptViaSMSFormInner({
  closeDialog,
}: NotifyReceiptViaSMSFormProps): React.ReactElement {
  const {
    dialogName,
    receiptId,
    receiptSMSDetail,
    createNotifyReceiptBySMSMutate,
  } = useNotifyReceiptViaSMSContext();

  const [calloutCode, setCalloutCode] = React.useState<number[]>([]);

  // Handles the form submit.
  const handleFormSubmit = (
    _values: NotifyViaSMSFormValues,
    {
      setErrors,
    }: {
      setErrors: (errors: Partial<Record<string, string>>) => void;
    },
  ) => {
    // Handle request response success.
    const onSuccess = () => {
      AppToaster.show({
        message: intl.get('notify_receipt_via_sms.dialog.success_message'),
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
    // @ts-expect-error — receiptId may be null in theory; dialog only opens with real id.
    createNotifyReceiptBySMSMutate(receiptId).then(onSuccess).catch(onError);
  };
  // Handle the form cancel.
  const handleFormCancel = () => {
    closeDialog(dialogName);
  };
  // Initial values. `NotifyViaSMSForm` expects camelCase field keys.
  const initialValues = React.useMemo(
    () => ({
      customerName: receiptSMSDetail.customerName ?? '',
      customerPhoneNumber: receiptSMSDetail.customerPhoneNumber ?? '',
      smsMessage: receiptSMSDetail.smsMessage ?? '',
      notificationKey: notificationType.key,
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

export const NotifyReceiptViaSMSForm = FF.pipe(
  NotifyReceiptViaSMSFormInner,
  withDialogActions,
);
