// @ts-nocheck
import React from 'react';
import { InputGroup, FormGroup, Position } from '@blueprintjs/core';
import { FastField, ErrorMessage, useFormikContext } from 'formik';
import { DateInput } from '@blueprintjs/datetime';
import classNames from 'classnames';

import { CLASSES } from '@/constants/classes';
import {
  momentFormatter,
  inputIntent,
  handleDateChange,
  tansformDateValue,
} from '@/utils';
import {
  Hint,
  FieldRequiredHint,
  Icon,
  FSelect,
  FormattedMessage as T,
  FFormGroup,
} from '@/components';
import { useMakeJournalFormContext } from './MakeJournalProvider';
import { JournalExchangeRateInputField } from './components';
import { MakeJournalTransactionNoField } from './MakeJournalTransactionNoField';

/**
 * Make journal entries header.
 */
export default function MakeJournalEntriesHeader({}) {
  const { currencies } = useMakeJournalFormContext();
  const form = useFormikContext();

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_FIELDS)}>
      {/*------------ Posting date -----------*/}
      <FastField name={'date'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'posting_date'} />}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="date" />}
            minimal={true}
            inline={true}
            className={classNames(CLASSES.FILL)}
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
              inputProps={{
                leftIcon: <Icon icon={'date-range'} />,
              }}
            />
          </FormGroup>
        )}
      </FastField>

      {/*------------ Journal number -----------*/}
      <MakeJournalTransactionNoField />

      {/*------------ Reference -----------*/}
      <FastField name={'reference'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'reference'} />}
            labelInfo={
              <Hint
                content={<T id={'journal_reference_hint'} />}
                position={Position.RIGHT}
              />
            }
            className={'form-group--reference'}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="reference" />}
            fill={true}
            inline={true}
          >
            <InputGroup fill={true} {...field} />
          </FormGroup>
        )}
      </FastField>

      {/*------------ Journal type  -----------*/}
      <FastField name={'journal_type'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'journal_type'} />}
            className={classNames('form-group--account-type', CLASSES.FILL)}
            inline={true}
          >
            <InputGroup
              intent={inputIntent({ error, touched })}
              fill={true}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>

      {/*------------ Currency  -----------*/}
      <FFormGroup
        name={'currency_code'}
        label={<T id={'currency'} />}
        inline
        fastField
      >
        <FSelect
          name={'currency_code'}
          items={currencies}
          onItemChange={(currencyItem) => {
            form.setFieldValue('currency_code', currencyItem.currency_code);
            form.setFieldValue('exchange_rate', '');
          }}
          popoverProps={{
            inline: true,
            minimal: true,
            captureDismiss: true,
          }}
          valueAccessor={'currency_code'}
          labelAccessor={'currency_name'}
          textAccessor={'currency_code'}
          fastField
        />
      </FFormGroup>

      {/* ----------- Exchange rate ----------- */}
      <JournalExchangeRateInputField
        name={'exchange_rate'}
        formGroupProps={{ label: ' ', inline: true }}
      />
    </div>
  );
}
