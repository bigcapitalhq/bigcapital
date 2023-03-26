// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { FormGroup, TextArea, Classes } from '@blueprintjs/core';
import { FastField, ErrorMessage } from 'formik';
import { FormattedMessage as T } from '@/components';
import { inputIntent } from '@/utils';

export default function CustomerNotePanel({ errors, touched, getFieldProps }) {
  return (
    <div className={'tab-panel--note'}>
      <FastField name={'note'}>
        {({ field, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'note'} />}
            className={classNames('form-group--note', Classes.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="payment_date" />}
          >
            <TextArea {...field} />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}
