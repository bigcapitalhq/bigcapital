// @ts-nocheck
import { Formik, FormikBag } from 'formik';
import { castArray } from 'lodash';
import * as R from 'ramda';
import { SendMailNotificationForm } from '@/containers/SendMailNotification';
import { usePaymentMailDialogBoot } from './PaymentMailDialogBoot';
import { transformToForm } from '@/utils';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { DialogsName } from '@/constants/dialogs';
import { useSendPaymentReceiveMail } from '@/hooks/query';

const initialFormValues = {
  from: [],
  to: [],
  subject: '',
  message: '',
};

interface PaymentMailFormValue {
  from: string[];
  to: string[];
  subject: string;
  message: string;
}

export function PaymentMailDialogFormRoot({
  // #withDialogActions
  closeDialog,
}) {
  const { mailOptions, paymentId } = usePaymentMailDialogBoot();
  const { mutateAsync: sendPaymentMail } = useSendPaymentReceiveMail();

  const initialValues = {
    ...initialFormValues,
    ...transformToForm(mailOptions, initialFormValues),
    from: mailOptions.from ? castArray(mailOptions.from) : [],
    to: mailOptions.to ? castArray(mailOptions.to) : [],
  };
  // Handles the form submitting.
  const handleSubmit = (
    values: PaymentMailFormValue,
    { setSubmitting }: FormikBag<PaymentMailFormValue>,
  ) => {
    setSubmitting(true);
    sendPaymentMail([paymentId, values])
      .then(() => {
        setSubmitting(false);
      })
      .catch((error) => {
        setSubmitting(false);
      });
  };

  const handleClose = () => {
    closeDialog(DialogsName.PaymentMail);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <SendMailNotificationForm onClose={handleClose} />
    </Formik>
  );
}

export const PaymentMailDialogForm = R.compose(withDialogActions)(
  PaymentMailDialogFormRoot,
);
