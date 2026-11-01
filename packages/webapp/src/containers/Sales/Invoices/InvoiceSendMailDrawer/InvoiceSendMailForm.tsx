import { Intent } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { Form, Formik, FormikHelpers } from 'formik';
import { InvoiceSendMailFormValues } from './_types';
import { useInvoiceSendMailBoot } from './InvoiceSendMailContentBoot';
import { InvoiceSendMailFormSchema } from './InvoiceSendMailForm.schema';
import { AppToaster } from '@/components';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useSendSaleInvoiceMail } from '@/hooks/query';
import { useDrawerActions } from '@/hooks/state';
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
