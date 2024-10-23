import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';
import { css } from '@emotion/css';

const initialValues = {
  subject: '',
  message: '',
  to: '',
  cc: '',
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
