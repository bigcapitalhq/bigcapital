// @ts-nocheck
import { Formik, FormikBag } from 'formik';
import * as R from 'ramda';
import { Intent } from '@blueprintjs/core';
import { useReceiptMailDialogBoot } from './ReceiptMailDialogBoot';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { DialogsName } from '@/constants/dialogs';
import { useSendSaleReceiptMail } from '@/hooks/query';
import { ReceiptMailDialogFormContent } from './ReceiptMailDialogFormContent';
import {
  initialMailNotificationValues,
  MailNotificationFormValues,
  transformMailFormToInitialValues,
  transformMailFormToRequest,
} from '@/containers/SendMailNotification/utils';
import { AppToaster } from '@/components';

const initialFormValues = {
  ...initialMailNotificationValues,
  attachReceipt: true,
};
interface ReceiptMailFormValues extends MailNotificationFormValues {
  attachReceipt: boolean;
}

interface ReceiptMailDialogFormProps {
  onFormSubmit?: () => void;
  onCancelClick?: () => void;
}

export function ReceiptMailDialogForm({
  // #props
  onFormSubmit,
  onCancelClick,
}: ReceiptMailDialogFormProps) {
  const { mailOptions, saleReceiptId } = useReceiptMailDialogBoot();
  const { mutateAsync: sendReceiptMail } = useSendSaleReceiptMail();

  // Transformes mail options to initial form values.
  const initialValues = transformMailFormToInitialValues(
    mailOptions,
    initialFormValues,
  );
  // Handle the form submitting.
  const handleSubmit = (
    values: ReceiptMailFormValues,
    { setSubmitting }: FormikBag<ReceiptMailFormValues>,
  ) => {
    const reqValues = transformMailFormToRequest(values);

    setSubmitting(true);
    sendReceiptMail([saleReceiptId, reqValues])
      .then(() => {
        AppToaster.show({
          message: 'The mail notification has been sent successfully.',
          intent: Intent.SUCCESS,
        });
        setSubmitting(false);
        onFormSubmit && onFormSubmit(values);
      })
      .catch(() => {
        AppToaster.show({
          message: 'Something went wrong.',
          intent: Intent.DANGER,
        });
        setSubmitting(false);
      });
  };
  // Handle the close button click.
  const handleClose = () => {
    onCancelClick && onCancelClick();
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <ReceiptMailDialogFormContent onClose={handleClose} />
    </Formik>
  );
}
