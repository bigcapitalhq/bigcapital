// @ts-nocheck
import React from 'react';
import { Classes, FormGroup, InputGroup, Position } from '@blueprintjs/core';
import { FastField } from 'formik';
import { DateInput } from '@blueprintjs/datetime';
import { FormattedMessage as T } from '@/components';
import classNames from 'classnames';
import {
  momentFormatter,
  transformDateValue,
  handleDateChange,
  inputIntent,
} from '@/utils';
import {
  ErrorMessage,
  FieldRequiredHint,
  CurrencySelectList,
} from '@/components';
import { useExchangeRateFromContext } from './ExchangeRateFormProvider';


export default function ExchangeRateFormFields() {
  const { action, currencies } = useExchangeRateFromContext();

  return (
    <div className={Classes.DIALOG_BODY}>
      {/* ----------- Date ----------- */}
      <FastField name={'date'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'date'} />}
            labelInfo={FieldRequiredHint}
            className={classNames('form-group--select-list', Classes.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="date" />}
            inline={true}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={transformDateValue(value)}
              onChange={handleDateChange((formattedDate) => {
                form.setFieldValue('date', formattedDate);
              })}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              disabled={action === 'edit'}
            />
          </FormGroup>
        )}
      </FastField>
      {/* ----------- Currency Code ----------- */}
      <FastField name={'currency_code'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'currency_code'} />}
            labelInfo={<FieldRequiredHint />}
            className={classNames('form-group--currency', Classes.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="currency_code" />}
            inline={true}
          >
            <CurrencySelectList
              currenciesList={currencies}
              selectedCurrencyCode={value}
              onCurrencySelected={({ currency_code }) => {
                form.setFieldValue('currency_code', currency_code);
              }}
              disabled={action === 'edit'}
            />
          </FormGroup>
        )}
      </FastField>

      {/*------------ Exchange Rate  -----------*/}
      <FastField name={'exchange_rate'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'exchange_rate'} />}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="exchange_rate" />}
            inline={true}
          >
            <InputGroup intent={inputIntent({ error, touched })} {...field} />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}
