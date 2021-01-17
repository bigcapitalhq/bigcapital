import React, { useState, useCallback, useMemo } from 'react';
import { Classes } from '@blueprintjs/core';
import { Formik } from 'formik';
import classNames from 'classnames';
import NumberFormatFields from './NumberFormatFields';

import { compose } from 'utils';

/**
 * Number format form popover content.
 */
function NumberFormats() {
  const initialValues = useMemo(
    () => ({
      format_money: '',
      show_zero: '',
      show_in_red: '',
      divide_on_1000: '',
      negative_format: '',
      precision: '',
    }),
    [],
  );
  // Handle cancel button click.
  const handleCancelClick = useCallback(() => {}, []);

  // Handle form submit.
  const handleFormSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    const form = { ...values };
  };

  return (
    <div className={'number-format'}>
      <Formik initialValues={initialValues} onSubmit={handleFormSubmit}>
        <NumberFormatFields onCancelClick={handleCancelClick} />
      </Formik>
    </div>
  );
}

export default NumberFormats;
