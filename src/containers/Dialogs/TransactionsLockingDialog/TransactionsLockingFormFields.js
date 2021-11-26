import React from 'react';
import { FastField, ErrorMessage } from 'formik';
import { Classes, FormGroup, TextArea, Position } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import { FieldRequiredHint, FormattedMessage as T } from 'components';
import { useAutofocus } from 'hooks';
import {
  inputIntent,
  momentFormatter,
  tansformDateValue,
  handleDateChange,
} from 'utils';

/**
 * Transactions locking form fields.
 */
export default function TransactionsLockingFormFields() {
  const dateFieldRef = useAutofocus();

  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------ Date -----------*/}
      <FastField name={'date'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'date'} />}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="date" />}
            minimal={true}
            className={classNames(CLASSES.FILL, 'form-group--date')}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              onChange={handleDateChange((formattedDate) => {
                form.setFieldValue('date', formattedDate);
              })}
              value={tansformDateValue(value)}
              popoverProps={{
                position: Position.BOTTOM,
                minimal: true,
              }}
              intent={inputIntent({ error, touched })}
              inputRef={(ref) => (dateFieldRef.current = ref)}
            />
          </FormGroup>
        )}
      </FastField>
      {/*------------  reasons -----------*/}
      <FastField name={'reason'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'reason'} />}
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
