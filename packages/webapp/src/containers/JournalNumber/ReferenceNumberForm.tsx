import { Intent, Button, Classes } from '@blueprintjs/core';
import { Formik, Form, FormikHelpers } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import '@/style/pages/ReferenceNumber/ReferenceNumber.scss';
import { ReferenceNumberFormContent } from './ReferenceNumberFormContent';
import { transformValuesToForm } from './utils';
import type { ReferenceNumberFormValues } from './types';
import { FormattedMessage as T, FormObserver } from '@/components';
import { saveInvoke, transformToForm } from '@/utils';

const initialFormValues: ReferenceNumberFormValues = {
  incrementMode: 'auto',
  numberPrefix: '',
  nextNumber: '',
  onceManualNumber: '',
};

// Validation schema.
const validationSchema = Yup.object().shape({
  incrementMode: Yup.string(),
  numberPrefix: Yup.string(),
  nextNumber: Yup.number(),
  onceManualNumber: Yup.string(),
});

export interface ReferenceNumberFormProps {
  initialValues?: Partial<ReferenceNumberFormValues>;
  description?: React.ReactNode;
  onSubmit?: (
    values: ReferenceNumberFormValues & { transactionNumber: string },
    methods: FormikHelpers<ReferenceNumberFormValues>,
  ) => void;
  onClose?: () => void;
  onChange?: (values: ReferenceNumberFormValues) => void;
}

/**
 * Reference number form.
 */
export function ReferenceNumberForm({
  initialValues,
  description,
  onSubmit,
  onClose,
  onChange,
}: ReferenceNumberFormProps) {
  // Initial values.
  const formInitialValues = {
    ...initialFormValues,
    ...transformToForm(initialValues, initialFormValues),
  };
  // Handle the form submit.
  const handleSubmit = (
    values: ReferenceNumberFormValues,
    methods: FormikHelpers<ReferenceNumberFormValues>,
  ) => {
    const parsed = transformValuesToForm(values);
    saveInvoke(onSubmit, { ...values, ...parsed }, methods);
  };

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values }) => (
        <Form className={'reference-number-form'}>
          <div className={Classes.DIALOG_BODY}>
            <p className="paragraph">{description}</p>
            <ReferenceNumberFormContent />
          </div>

          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button onClick={onClose}>
                <T id={'cancel'} />
              </Button>
              <Button
                intent={Intent.PRIMARY}
                type="submit"
                loading={isSubmitting}
              >
                <T id={'submit'} />
              </Button>
            </div>
          </div>

          <FormObserver values={values} onChange={onChange} />
        </Form>
      )}
    </Formik>
  );
}
