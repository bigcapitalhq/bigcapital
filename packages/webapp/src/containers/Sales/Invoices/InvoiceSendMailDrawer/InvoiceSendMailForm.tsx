import { Form, Formik, FormikHelpers } from 'formik';
import { css } from '@emotion/css';
import { Intent } from '@blueprintjs/core';
import { InvoiceSendMailFormValues } from './_types';
import { InvoiceSendMailFormSchema } from './InvoiceSendMailForm.schema';
import { useSendSaleInvoiceMail } from '@/hooks/query';
import { AppToaster } from '@/components';
import { useInvoiceSendMailBoot } from './InvoiceSendMailContentBoot';
import { useDrawerActions } from '@/hooks/state';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { transformToForm } from '@/utils';

const initialValues: InvoiceSendMailFormValues = {
  subject: '',
  message: '',
  to: [],
  cc: [],
  bcc: [],
  attachPdf: true,
};

interface InvoiceSendMailFormProps {
  children: React.ReactNode;
}

export function InvoiceSendMailForm({ children }: InvoiceSendMailFormProps) {
  const { mutateAsync: sendInvoiceMail } = useSendSaleInvoiceMail();
  const { invoiceId, invoiceMailState } = useInvoiceSendMailBoot();

  const { name } = useDrawerContext();
  const { closeDrawer } = useDrawerActions();

  const _initialValues: InvoiceSendMailFormValues = {
    ...initialValues,
    ...transformToForm(invoiceMailState, initialValues),
  };
  const handleSubmit = (
    values: InvoiceSendMailFormValues,
    { setSubmitting }: FormikHelpers<InvoiceSendMailFormValues>,
  ) => {
    setSubmitting(true);
    sendInvoiceMail({ id: invoiceId, values: { ...values } })
      .then(() => {
        AppToaster.show({
          message: 'The invoice mail has been sent to the customer.',
          intent: Intent.SUCCESS,
        });
        setSubmitting(false);
        closeDrawer(name);
      })
      .catch((error) => {
        setSubmitting(false);
        AppToaster.show({
          message: 'Something went wrong!',
          intent: Intent.SUCCESS,
        });
      });
  };

  return (
    <Formik
      initialValues={_initialValues}
      validationSchema={InvoiceSendMailFormSchema}
      onSubmit={handleSubmit}
    >
      <Form
        className={css`
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        `}
      >
        {children}
      </Form>
    </Formik>
  );
}
