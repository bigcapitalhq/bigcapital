import * as Yup from 'yup';
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

const initialValues = {
  subject: 'invoice INV-0002 for AED 0.00',
  message: `Hi Ahmed,

Here’s invoice INV-0002 for AED 0.00

The amount outstanding of AED $100,00 is due on 2 October 2024

View your bill online From your online you can print a PDF or pay your outstanding bills,

If you have any questions, please let us know,

Thanks,
Mohamed`,
  to: ['a.bouhuolia@gmail.com'],
};

interface InvoiceSendMailFormProps {
  children: React.ReactNode;
}

export function InvoiceSendMailForm({ children }: InvoiceSendMailFormProps) {
  const { mutateAsync: sendInvoiceMail } = useSendSaleInvoiceMail();
  const { invoiceId } = useInvoiceSendMailBoot();
  const { name } = useDrawerContext();
  const { closeDrawer } = useDrawerActions();

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
      initialValues={initialValues}
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
