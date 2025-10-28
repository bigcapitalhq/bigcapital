// @ts-nocheck
import React from 'react';
import { Formik, Form, FormikHelpers } from 'formik';

export interface ElementCustomizeFormProps<T, Y> {
  initialValues?: T;
  validationSchema?: any;
  onSubmit?: (values: T, formikHelpers: FormikHelpers<T>) => void;
  children?: React.ReactNode;
}

export function ElementCustomizeForm<T>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
}: ElementCustomizeFormProps<T>) {
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
