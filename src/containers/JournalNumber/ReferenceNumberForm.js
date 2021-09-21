import React, { useMemo } from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { FormattedMessage as T } from 'components';
import { Intent, Button, Classes } from '@blueprintjs/core';

import 'style/pages/ReferenceNumber/ReferenceNumber.scss';

import { FormObserver } from 'components';
import ReferenceNumberFormContent from './ReferenceNumberFormContent';
import { transformValuesToForm } from './utils';
import { saveInvoke } from 'utils';

/**
 * Reference number form.
 */
export default function ReferenceNumberForm({
  onSubmit,
  onClose,
  initialValues,
  description,
  onChange,
}) {
  // Validation schema.
  const validationSchema = Yup.object().shape({
    incrementMode: Yup.string(),
    numberPrefix: Yup.string(),
    nextNumber: Yup.number(),
    manualTransactionNo: Yup.string(),
  });
  // Initial values.
  const formInitialValues = useMemo(
    () => ({
      ...initialValues,
      incrementMode:
        initialValues.incrementMode === 'auto' &&
        initialValues.manualTransactionNo
          ? 'manual-transaction'
          : initialValues.incrementMode,
    }),
    [initialValues],
  );
  // Handle the form submit.
  const handleSubmit = (values, methods) => {
    const parsed = transformValuesToForm(values);
    saveInvoke(onSubmit, { ...parsed, ...values }, methods);
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
