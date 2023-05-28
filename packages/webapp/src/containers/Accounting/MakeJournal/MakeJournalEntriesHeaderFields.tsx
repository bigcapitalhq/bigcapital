// @ts-nocheck
import React from 'react';
import {
  InputGroup,
  FormGroup,
  Position,
  ControlGroup,
} from '@blueprintjs/core';
import { FastField, ErrorMessage, useFormikContext } from 'formik';
import { DateInput } from '@blueprintjs/datetime';
import * as R from 'ramda';
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
  FieldHint,
  FieldRequiredHint,
  Icon,
  InputPrependButton,
  CurrencySelectList,
  FormattedMessage as T,
  FInputGroup,
  FFormGroup,
} from '@/components';
import { useMakeJournalFormContext } from './MakeJournalProvider';
import { JournalExchangeRateInputField } from './components';
import { currenciesFieldShouldUpdate } from './utils';

import withSettings from '@/containers/Settings/withSettings';
import withDialogActions from '@/containers/Dialog/withDialogActions';

/**
 * Journal number field of make journal form.
 */
const MakeJournalTransactionNoField = R.compose(
  withDialogActions,
  withSettings(({ manualJournalsSettings }) => ({
    journalAutoIncrement: manualJournalsSettings?.autoIncrement,
  })),
)(
  ({
    // #withDialog
    openDialog,

    // #withSettings
    journalAutoIncrement,
  }) => {
    const { setFieldValue, values } = useFormikContext();

    const handleJournalNumberChange = () => {
      openDialog('journal-number-form');
    };
    const handleJournalNoBlur = (event) => {
      const newValue = event.target.value;

      if (values.journal_number !== newValue && journalAutoIncrement) {
        openDialog('journal-number-form', {
          initialFormValues: {
            onceManualNumber: newValue,
            incrementMode: 'manual-transaction',
          },
        });
      }
      if (!journalAutoIncrement) {
        setFieldValue('journal_number', newValue);
        setFieldValue('journal_number_manually', newValue);
      }
    };

    return (
      <FFormGroup
        name={'journal_number'}
        label={<T id={'journal_no'} />}
        labelInfo={
          <>
            <FieldRequiredHint />
            <FieldHint />
          </>
        }
        fill={true}
        inline={true}
        fastField={true}
      >
        <ControlGroup fill={true}>
          <FInputGroup
            name={'journal_number'}
            fill={true}
            asyncControl={true}
            onBlur={handleJournalNoBlur}
            fastField={true}
            onChange={() => {}}
          />
          <InputPrependButton
            buttonProps={{
              onClick: handleJournalNumberChange,
              icon: <Icon icon={'settings-18'} />,
            }}
            tooltip={true}
            tooltipProps={{
              content: <T id={'setting_your_auto_generated_journal_number'} />,
              position: Position.BOTTOM_LEFT,
            }}
          />
        </ControlGroup>
      </FFormGroup>
    );
  },
);

/**
 * Make journal entries header.
 */
export default function MakeJournalEntriesHeader({}) {
  const { currencies } = useMakeJournalFormContext();

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
      <FastField
        name={'currency_code'}
        currencies={currencies}
        shouldUpdate={currenciesFieldShouldUpdate}
      >
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'currency'} />}
            className={classNames('form-group--currency', CLASSES.FILL)}
            inline={true}
          >
            <CurrencySelectList
              currenciesList={currencies}
              selectedCurrencyCode={value}
              onCurrencySelected={(currencyItem) => {
                form.setFieldValue('currency_code', currencyItem.currency_code);
                form.setFieldValue('exchange_rate', '');
              }}
              defaultSelectText={value}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------- Exchange rate ----------- */}
      <JournalExchangeRateInputField
        name={'exchange_rate'}
        formGroupProps={{ label: ' ', inline: true }}
      />
    </div>
  );
}
