// @ts-nocheck
import { Formik } from 'formik';
import { castArray } from 'lodash';
import * as R from 'ramda';
import { SendMailNotificationForm } from '@/containers/SendMailNotification';
import { useInvoiceMailDialogBoot } from './InvoiceMailDialogBoot';
import { transformToForm } from '@/utils';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { DialogsName } from '@/constants/dialogs';
import { useSendSaleInvoiceMail } from '@/hooks/query';

const initialFormValues = {
  from: [],
  to: [],
  subject: '',
  message: '',
};

interface InvoiceMailFormValues {
  from: string[];
  to: string[];
  subject: string;
  message: string;
  attachInvoice: boolean;
}

function InvoiceMailDialogFormRoot({
  // #withDialogActions
  closeDialog,
}) {
  const { mailOptions, saleInvoiceId } = useInvoiceMailDialogBoot();
  const { mutateAsync: sendInvoiceMail } = useSendSaleInvoiceMail();

  const initialValues = {
    ...initialFormValues,
    ...transformToForm(mailOptions, initialFormValues),
    from: mailOptions.from ? castArray(mailOptions.from) : [],
    to: mailOptions.to ? castArray(mailOptions.to) : [],
  };
  // Handle the form submitting.
  const handleSubmit = (values: InvoiceMailFormValues, { setSubmitting }) => {
    setSubmitting(true);
    sendInvoiceMail([saleInvoiceId, values])
      .then(() => {
        setSubmitting(false);
      })
      .catch(() => {
        setSubmitting(false);
      });
  };
  // Handle the close button click.
  const handleClose = () => {
    closeDialog(DialogsName.InvoiceMail);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <SendMailNotificationForm onClose={handleClose} />
    </Formik>
  );
}

export const InvoiceMailDialogForm = R.compose(withDialogActions)(
  InvoiceMailDialogFormRoot,
);
