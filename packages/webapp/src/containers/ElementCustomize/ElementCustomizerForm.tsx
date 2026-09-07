import { Formik, Form } from 'formik';
import type { FormikHelpers, FormikValues } from 'formik';
import React from 'react';

export interface ElementCustomizeFormProps<T, Y = T> {
  initialValues?: T;
  validationSchema?: any;
  onSubmit?: (values: T, formikHelpers: FormikHelpers<T>) => void;
  children?: React.ReactNode;
}

export function ElementCustomizeForm<T extends FormikValues>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
}: ElementCustomizeFormProps<T>) {
  return (
    <Formik<T>
      initialValues={{ ...initialValues } as T}
      validationSchema={validationSchema}
      onSubmit={(value, helpers) => onSubmit && onSubmit(value, helpers)}
    >
      <Form>{children}</Form>
    </Formik>
  );
}
