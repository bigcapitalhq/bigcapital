// @ts-nocheck
import React from 'react';
import { Formik, Form, FormikHelpers } from 'formik';

export interface InvoiceCustomizeFormProps<T> {
  initialValues?: T;
  validationSchema?: any;
  onSubmit?: (values: T, formikHelpers: FormikHelpers<T>) => void;
  children?: React.ReactNode;
}

export function InvoiceCustomizeForm<T>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
}: InvoiceCustomizeFormProps<T>) {
  return (
    <Formik<T>
      initialValues={{ ...initialValues }}
      validationSchema={validationSchema}
      onSubmit={(value, helpers) => onSubmit && onSubmit(value, helpers)}
    >
      <Form>{children}</Form>
    </Formik>
  );
}
