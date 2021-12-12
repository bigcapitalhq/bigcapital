import React from 'react';
import { FastField, ErrorMessage } from 'formik';
import { Classes, FormGroup, TextArea } from '@blueprintjs/core';
import { FieldRequiredHint, FormattedMessage as T } from 'components';
import { inputIntent } from 'utils';

/**
 * Unlocking transactions form fields.
 */
export default function UnlockingTransactionsFormFields() {
  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------ Locking  Reason -----------*/}
      <FastField name={'reason'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'unlocking_transactions.dialog.reason'} />}
            labelInfo={<FieldRequiredHint />}
            className={'form-group--reason'}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'reason'} />}
          >
            <TextArea
              growVertically={true}
              large={true}
              intent={inputIntent({ error, touched })}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}
