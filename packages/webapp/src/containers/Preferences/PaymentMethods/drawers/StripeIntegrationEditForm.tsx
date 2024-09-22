import React from 'react';
import * as Yup from 'yup';
import { Formik, FormikHelpers } from 'formik';

interface StripeIntegrationFormValues {
  paymentAccountId: string;
  clearingAccountId: string;
}

const initialValues = {
  paymentAccountId: '',
  clearingAccountId: '',
};

const validationSchema = Yup.object().shape({
  paymentAccountId: Yup.string().required('Payment Account is required'),
  clearingAccountId: Yup.string().required('Clearing Account is required'),
});

interface StripeIntegrationEditFormProps {
  children: React.ReactNode;
}

export function StripeIntegrationEditForm({
  children,
}: StripeIntegrationEditFormProps) {
  const onSubmit = (
    values: StripeIntegrationFormValues,
    { setSubmitting }: FormikHelpers<StripeIntegrationFormValues>,
  ) => {
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <>{children}</>
    </Formik>
  );
}
