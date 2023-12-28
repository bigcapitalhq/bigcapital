// @ts-nocheck
import { Formik } from 'formik';
import { castArray } from 'lodash';
import * as R from 'ramda';
import { useInvoiceMailDialogBoot } from './InvoiceMailDialogBoot';
import { transformToForm } from '@/utils';
import { DialogsName } from '@/constants/dialogs';
import { useSendSaleInvoiceMail } from '@/hooks/query';
import { InvoiceMailDialogFormContent } from './InvoiceMailDialogFormContent';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { InvoiceMailFormSchema } from './InvoiceMailDialogForm.schema';

const initialFormValues = {
  from: [],
  to: [],
  subject: '',
  body: '',
  attachInvoice: true,
};

interface InvoiceMailFormValues {
  from: string[];
  to: string[];
  subject: string;
  body: string;
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
    <Formik
      initialValues={initialValues}
      validationSchema={InvoiceMailFormSchema}
      onSubmit={handleSubmit}
    >
      <InvoiceMailDialogFormContent onClose={handleClose} />
    </Formik>
  );
}

export const InvoiceMailDialogForm = R.compose(withDialogActions)(
  InvoiceMailDialogFormRoot,
);
