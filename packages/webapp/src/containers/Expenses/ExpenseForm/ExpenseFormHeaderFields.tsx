// @ts-nocheck
import React from 'react';
import { FormGroup, Position, Classes } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FastField, ErrorMessage } from 'formik';
import { CustomersSelect, FInputGroup, FormattedMessage as T } from '@/components';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';
import {
  momentFormatter,
  tansformDateValue,
  inputIntent,
  handleDateChange,
} from '@/utils';
import { customersFieldShouldUpdate, accountsFieldShouldUpdate } from './utils';
import {
  CurrencySelectList,
  FFormGroup,
  AccountsSelect,
  FieldRequiredHint,
  Hint,
} from '@/components';
import { ExpensesExchangeRateInputField } from './components';
import { useExpenseFormContext } from './ExpenseFormPageProvider';
import { SUPPORTED_EXPENSE_PAYMENT_ACCOUNT_TYPES } from './constants';

/**
 * Expense form header.
 */
export default function ExpenseFormHeader() {
  const { currencies, accounts, customers } = useExpenseFormContext();

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_FIELDS)}>
      <FastField name={'payment_date'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'payment_date'} />}
            labelInfo={<Hint />}
            className={classNames('form-group--select-list', Classes.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="payment_date" />}
            inline={true}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={tansformDateValue(value)}
              onChange={handleDateChange((formattedDate) => {
                form.setFieldValue('payment_date', formattedDate);
              })}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
            />
          </FormGroup>
        )}
      </FastField>

      <FFormGroup
        name={'payment_account_id'}
        items={accounts}
        label={<T id={'payment_account'} />}
        labelInfo={<FieldRequiredHint />}
        inline={true}
        fastField={true}
        shouldUpdate={accountsFieldShouldUpdate}
      >
        <AccountsSelect
          name={'payment_account_id'}
          items={accounts}
          placeholder={<T id={'select_payment_account'} />}
          filterByTypes={SUPPORTED_EXPENSE_PAYMENT_ACCOUNT_TYPES}
          allowCreate={true}
          fastField={true}
          shouldUpdate={accountsFieldShouldUpdate}
          fill={true}
        />
      </FFormGroup>

      <FastField name={'currency_code'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'currency'} />}
            className={classNames(
              'form-group--select-list',
              'form-group--currency',
              Classes.FILL,
            )}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="currency_code" />}
            inline={true}
          >
            <CurrencySelectList
              currenciesList={currencies}
              selectedCurrencyCode={value}
              onCurrencySelected={(currencyItem) => {
                form.setFieldValue('currency_code', currencyItem.currency_code);
              }}
              defaultSelectText={value}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------- Exchange rate ----------- */}
      <ExpensesExchangeRateInputField
        name={'exchange_rate'}
        formGroupProps={{ label: ' ', inline: true }}
      />

      {/* ----------- Reference No. ----------- */}
      <FFormGroup
        name={'reference_no'}
        label={<T id={'reference_no'} />}
        inline={true}
        fastField
      >
        <FInputGroup minimal={true} name={'reference_no'} fastField />
      </FFormGroup>

      {/* ----------- Customer ----------- */}
      <ExpenseFormCustomerSelect />
    </div>
  );
}

/**
 * Customer select field of expense form.
 * @returns {React.ReactNode}
 */
function ExpenseFormCustomerSelect() {
  const { customers } = useExpenseFormContext();

  return (
    <FormGroup
      label={<T id={'customer'} />}
      labelInfo={<Hint />}
      inline={true}
      name={'customer_id'}
      fastField={true}
      shouldUpdateDeps={{ items: customers }}
      shouldUpdate={customersFieldShouldUpdate}
    >
      <CustomersSelect
        name={'customer_id'}
        items={customers}
        placeholder={<T id={'select_customer_account'} />}
        allowCreate={true}
        popoverFill={true}
        fastField={true}
        shouldUpdateDeps={{ items: customers }}
        shouldUpdate={customersFieldShouldUpdate}
      />
    </FormGroup>
  );
}
