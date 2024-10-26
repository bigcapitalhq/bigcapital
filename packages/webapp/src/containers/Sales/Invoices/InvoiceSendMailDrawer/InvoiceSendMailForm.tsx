import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';
import { css } from '@emotion/css';

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
  cc: [],
  bcc: [],
};
interface InvoiceSendMailFormValues {
  subject: string;
  message: string;
  to: string;
  cc: string;
}

const InvoiceSendMailFormSchema = Yup.object().shape({
  subject: Yup.string().required('Subject is required'),
  message: Yup.string().required('Message is required'),
  to: Yup.string().email('Invalid email').required('To address is required'),
  cc: Yup.string().email('Invalid email'),
});

interface InvoiceSendMailFormProps {
  children: React.ReactNode;
}

export function InvoiceSendMailForm({ children }: InvoiceSendMailFormProps) {
  //
  const handleSubmit = (
    values: InvoiceSendMailFormValues,
    { setSubmitting }: FormikHelpers<InvoiceSendMailFormValues>,
  ) => {};

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
