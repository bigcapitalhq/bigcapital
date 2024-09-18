import React from 'react';
import { Formik, Form } from 'formik';

interface SelectPaymentMethodsFormValues {}

const initialValues: SelectPaymentMethodsFormValues = {};

export const SelectPaymentMethodsForm: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const handleSubmit = (values: SelectPaymentMethodsFormValues) => {};

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <Form>{children}</Form>
    </Formik>
  );
};
