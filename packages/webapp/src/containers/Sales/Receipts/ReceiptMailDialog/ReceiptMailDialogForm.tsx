// @ts-nocheck
import { Formik, FormikBag } from 'formik';
import { castArray } from 'lodash';
import * as R from 'ramda';
import { SendMailNotificationForm } from '@/containers/SendMailNotification';
import { useReceiptMailDialogBoot } from './ReceiptMailDialogBoot';
import { transformToForm } from '@/utils';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { DialogsName } from '@/constants/dialogs';
import { useSendSaleReceiptMail } from '@/hooks/query';

const initialFormValues = {
  from: [],
  to: [],
  subject: '',
  message: '',
};
interface ReceiptMailFormValues {
  from: string[];
  to: string[];
  subject: string;
  message: string;
}

function ReceiptMailDialogFormRoot({ closeDialog }) {
  const { mailOptions, saleReceiptId } = useReceiptMailDialogBoot();
  const { mutateAsync: sendReceiptMail } = useSendSaleReceiptMail();

  const initialValues = {
    ...initialFormValues,
    ...transformToForm(mailOptions, initialFormValues),
    from: mailOptions.from ? castArray(mailOptions.from) : [],
    to: mailOptions.to ? castArray(mailOptions.to) : [],
  };
  const handleSubmit = (
    values: ReceiptMailFormValues,
    { setSubmitting }: FormikBag<ReceiptMailFormValues>,
  ) => {
    setSubmitting(true);
    sendReceiptMail([saleReceiptId, values])
      .then(() => {
        setSubmitting(false);
      })
      .catch((error) => {
        setSubmitting(false);
      });
  };

  const handleClose = () => {
    closeDialog(DialogsName.ReceiptMail);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <SendMailNotificationForm onClose={handleClose} />
    </Formik>
  );
}

export const ReceiptMailDialogForm = R.compose(withDialogActions)(
  ReceiptMailDialogFormRoot,
);
