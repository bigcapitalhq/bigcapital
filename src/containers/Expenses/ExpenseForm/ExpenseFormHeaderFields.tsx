import React from 'react';
import {
  InputGroup,
  FormGroup,
  ControlGroup,
  Position,
  Classes,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FastField, ErrorMessage } from 'formik';
import { FormattedMessage as T } from '@/components';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import {
  momentFormatter,
  tansformDateValue,
  inputIntent,
  handleDateChange,
} from 'utils';
import { customersFieldShouldUpdate, accountsFieldShouldUpdate } from './utils';
import {
  CurrencySelectList,
  CustomerSelectField,
  AccountsSelectList,
  FieldRequiredHint,
  Hint,
} from '@/components';
import { ExpensesExchangeRateInputField } from './components';
import { ACCOUNT_PARENT_TYPE } from 'common/accountTypes';
import { useExpenseFormContext } from './ExpenseFormPageProvider';

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

      <FastField
        name={'payment_account_id'}
        accounts={accounts}
        shouldUpdate={accountsFieldShouldUpdate}
      >
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'payment_account'} />}
            className={classNames(
              'form-group--payment_account',
              'form-group--select-list',
              Classes.FILL,
            )}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'payment_account_id'} />}
            inline={true}
          >
            <AccountsSelectList
              accounts={accounts}
              onAccountSelected={(account) => {
                form.setFieldValue('payment_account_id', account.id);
              }}
              defaultSelectText={<T id={'select_payment_account'} />}
              selectedAccountId={value}
              filterByParentTypes={[ACCOUNT_PARENT_TYPE.CURRENT_ASSET]}
              allowCreate={true}
            />
          </FormGroup>
        )}
      </FastField>

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

      <FastField name={'reference_no'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'reference_no'} />}
            className={classNames('form-group--ref_no', Classes.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="reference_no" />}
            inline={true}
          >
            <InputGroup minimal={true} {...field} />
          </FormGroup>
        )}
      </FastField>

      <FastField
        name={'customer_id'}
        customers={customers}
        shouldUpdate={customersFieldShouldUpdate}
      >
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'customer'} />}
            className={classNames('form-group--select-list', Classes.FILL)}
            labelInfo={<Hint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'assign_to_customer'} />}
            inline={true}
          >
            <CustomerSelectField
              contacts={customers}
              selectedContactId={value}
              defaultSelectText={<T id={'select_customer_account'} />}
              onContactSelected={(customer) => {
                form.setFieldValue('customer_id', customer.id);
              }}
              allowCreate={true}
              popoverFill={true}
            />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}
