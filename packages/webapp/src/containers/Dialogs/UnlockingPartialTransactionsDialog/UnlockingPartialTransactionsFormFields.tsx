// @ts-nocheck
import React from 'react';
import { FastField, ErrorMessage } from 'formik';
import { Classes, FormGroup, TextArea, Position } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';
import {
  FieldRequiredHint,
  Col,
  Row,
  FormattedMessage as T,
} from '@/components';
import {
  inputIntent,
  momentFormatter,
  transformDateValue,
  handleDateChange,
} from '@/utils';
import { useAutofocus } from '@/hooks';

/**
 * Parial Unlocking transactions form fields.
 */
export default function UnlockingPartialTransactionsFormFields() {
  const reasonFieldRef = useAutofocus();

  return (
    <div className={Classes.DIALOG_BODY}>
      <Row>
        <Col xs={6}>
          {/*------------  Unlocking from date  -----------*/}
          <FastField name={'unlock_from_date'}>
            {({ form, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={
                  <T id={'unlocking_partial_transactions.dialog.from_date'} />
                }
                labelInfo={<FieldRequiredHint />}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name="unlock_from_date" />}
                minimal={true}
                className={classNames(CLASSES.FILL, 'form-group--date')}
              >
                <DateInput
                  {...momentFormatter('YYYY/MM/DD')}
                  onChange={handleDateChange((formattedDate) => {
                    form.setFieldValue('unlock_from_date', formattedDate);
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
        </Col>

        <Col xs={6}>
          {/*------------  Unlocking from date  -----------*/}
          <FastField name={'unlock_to_date'}>
            {({ form, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={
                  <T id={'unlocking_partial_transactions.dialog.to_date'} />
                }
                labelInfo={<FieldRequiredHint />}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name="unlock_to_date" />}
                minimal={true}
                className={classNames(CLASSES.FILL, 'form-group--date')}
              >
                <DateInput
                  {...momentFormatter('YYYY/MM/DD')}
                  onChange={handleDateChange((formattedDate) => {
                    form.setFieldValue('unlock_to_date', formattedDate);
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
        </Col>
      </Row>

      {/*------------ unLocking  reason -----------*/}
      <FastField name={'reason'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'unlocking_partial_transactions.dialog.reason'} />}
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
