import React, { useMemo } from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { FormattedMessage as T } from 'react-intl';
import { Button, Classes } from '@blueprintjs/core';
import { Intent } from '@blueprintjs/core';
import { saveInvoke } from 'utils';
import ReferenceNumberFormContent from './ReferenceNumberFormContent';

/**
 * Reference number form.
 */
export default function ReferenceNumberForm({
  onSubmit,
  onClose,
  initialPrefix,
  initialNumber,
}) {
  const validationSchema = Yup.object().shape({
    // mode: Yup.string(),
    number_prefix: Yup.string(),
    next_number: Yup.number(),
  });

  const initialValues = useMemo(
    () => ({
      number_prefix: initialPrefix || '',
      next_number: initialNumber || '',
    }),
    [initialPrefix, initialNumber],
  );

  const handleSubmit = (values) => {
    debugger;
    saveInvoke(onSubmit, values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className={Classes.DIALOG_BODY}>
            <p className="paragraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
              tincidunt porta quam,
            </p>

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
                disabled={isSubmitting}
              >
                <T id={'submit'} />
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
