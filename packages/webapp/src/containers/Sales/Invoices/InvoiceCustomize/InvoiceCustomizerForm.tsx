import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import React from 'react';

const validationSchema = Yup.object().shape({
  invoiceNumber: Yup.string().required('Invoice number is required'),
  customerName: Yup.string().required('Customer name is required'),
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive'),
});

interface InvoiceCustomizeFormProps {
  children: React.ReactNode;
}

export function InvoiceCustomizeForm({ children }: InvoiceCustomizeFormProps) {
  return (
    <Formik
      initialValues={{ invoiceNumber: '', customerName: '', amount: '' }}
      validationSchema={validationSchema}
      onSubmit={(values) => {}}
    >
      <Form>{children}</Form>
    </Formik>
  );
}
