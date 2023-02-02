// @ts-nocheck
import React, { useCallback } from 'react';
import { Formik, Form } from 'formik';

import '@/style/pages/FinancialStatements/NumberFormatDropdown.scss';

import NumberFormatFields from './NumberFormatFields';
import NumberFormatFooter from './NumberFormatFooter';

/**
 * Number format form popover content.
 */
export default function NumberFormatDropdown({
  numberFormat = {},
  onSubmit,
  submitDisabled = false,
}) {
  const initialValues = {
    formatMoney: 'total',
    showZero: false,
    showInRed: false,
    divideOn1000: false,
    negativeFormat: 'mines',
    precision: 2,
    ...numberFormat
  };
  // Handle cancel button click.
  const handleCancelClick = useCallback(() => {}, []);

  // Handle form submit.
  const handleFormSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    onSubmit(values);
  };

  return (
    <div className={'number-format-dropdown'}>
      <Formik initialValues={initialValues} onSubmit={handleFormSubmit}>
        <Form>
          <NumberFormatFields onCancelClick={handleCancelClick} />
          <NumberFormatFooter submitDisabled={submitDisabled} />
        </Form>
      </Formik>
    </div>
  );
}
