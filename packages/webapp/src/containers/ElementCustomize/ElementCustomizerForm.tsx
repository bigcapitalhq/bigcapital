import { Formik, Form } from 'formik';
import React from 'react';
import type { FormikConfig, FormikHelpers, FormikValues } from 'formik';

export interface ElementCustomizeFormProps<T extends FormikValues> {
  initialValues?: T;
  validationSchema?: FormikConfig<T>['validationSchema'];
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
