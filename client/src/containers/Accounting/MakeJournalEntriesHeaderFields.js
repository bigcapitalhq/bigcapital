import React, { useCallback } from 'react';
import {
  InputGroup,
  FormGroup,
  Position,
  ControlGroup,
} from '@blueprintjs/core';
import { FastField, ErrorMessage } from 'formik';
import { DateInput } from '@blueprintjs/datetime';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';

import { CLASSES } from 'common/classes';
import { momentFormatter, tansformDateValue, saveInvoke } from 'utils';
import {
  Hint,
  FieldHint,
  FieldRequiredHint,
  Icon,
  InputPrependButton,
  CurrencySelectList,
} from 'components';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withCurrencies from 'containers/Currencies/withCurrencies';

import { compose, inputIntent, handleDateChange } from 'utils';

function MakeJournalEntriesHeader({
  // #ownProps
  manualJournal,
  onJournalNumberChanged,

  // #withCurrencies
  currenciesList,

  // #withDialog
  openDialog,
}) {
  const handleJournalNumberChange = useCallback(() => {
    openDialog('journal-number-form', {});
  }, [openDialog]);

  // Handle journal number field blur event.
  const handleJournalNumberChanged = (event) => {
    saveInvoke(onJournalNumberChanged, event.currentTarget.value);
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_FIELDS)}>
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

      <FastField name={'journal_number'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'journal_no'} />}
            labelInfo={
              <>
                <FieldRequiredHint />
                <FieldHint />
              </>
            }
            className={'form-group--journal-number'}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="journal_number" />}
            fill={true}
            inline={true}
          >
            <ControlGroup fill={true}>
              <InputGroup
                fill={true}
                {...field}
                onBlur={handleJournalNumberChanged}
              />
              <InputPrependButton
                buttonProps={{
                  onClick: handleJournalNumberChange,
                  icon: <Icon icon={'settings-18'} />,
                }}
                tooltip={true}
                tooltipProps={{
                  content: 'Setting your auto-generated journal number',
                  position: Position.BOTTOM_LEFT,
                }}
              />
            </ControlGroup>
          </FormGroup>
        )}
      </FastField>

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

      <FastField name={'journal_type'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'journal_type'} />}
            className={classNames(
              'form-group--account-type',
              CLASSES.FILL,
            )}
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

      <FastField name={'currency'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'currency'} />}
            className={classNames(
              'form-group--currency',
              CLASSES.FILL,
            )}
            inline={true}
          >
            <CurrencySelectList
              currenciesList={currenciesList}
              selectedCurrencyCode={value}
              onCurrencySelected={(currencyItem) => {
                form.setFieldValue('currency_code', currencyItem.currency_code);
              }}
              defaultSelectText={value}
            />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}

export default compose(
  withDialogActions,
  withCurrencies(({ currenciesList }) => ({
    currenciesList,
  })),
)(MakeJournalEntriesHeader);
