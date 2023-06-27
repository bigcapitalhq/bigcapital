// @ts-nocheck
import React from 'react';
import { FastField, ErrorMessage } from 'formik';
import { Classes, FormGroup, TextArea, Position } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';
import { FieldRequiredHint, FormattedMessage as T } from '@/components';
import { useAutofocus } from '@/hooks';
import {
  inputIntent,
  momentFormatter,
  transformDateValue,
  handleDateChange,
} from '@/utils';

/**
 *  locking Transactions form fields.
 */
export default function LockingTransactionsFormFields() {
  const reasonFieldRef = useAutofocus();

  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------  Locking Date -----------*/}
      <FastField name={'lock_to_date'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'locking_transactions.dialog.locking_date'} />}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="lock_to_date" />}
            minimal={true}
            className={classNames(CLASSES.FILL, 'form-group--date')}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              onChange={handleDateChange((formattedDate) => {
                form.setFieldValue('lock_to_date', formattedDate);
              })}
              value={transformDateValue(value)}
              popoverProps={{
                position: Position.BOTTOM,
                minimal: true,
              }}
              intent={inputIntent({ error, touched })}
            />
          </FormGroup>
        )}
      </FastField>

      {/*------------ Locking  Reason -----------*/}
      <FastField name={'reason'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'locking_transactions.dialog.reason'} />}
            labelInfo={<FieldRequiredHint />}
            className={'form-group--reason'}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'reason'} />}
          >
            <TextArea
              growVertically={true}
              large={true}
              intent={inputIntent({ error, touched })}
              inputRef={(ref) => (reasonFieldRef.current = ref)}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}
