import { FormGroup, Position, Classes } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import classNames from 'classnames';
import { FastField, ErrorMessage } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { ExpensesExchangeRateInputField } from './components';
import { SUPPORTED_EXPENSE_PAYMENT_ACCOUNT_TYPES } from './constants';
import styles from './ExpenseForm.module.scss';
import { useExpenseFormContext } from './ExpenseFormPageProvider';
import { customersFieldShouldUpdate, accountsFieldShouldUpdate } from './utils';
import {
  CustomersSelect,
  FInputGroup,
  FormattedMessage as T,
} from '@/components';
import {
  FFormGroup,
  FSelect,
  AccountsSelect,
  FieldRequiredHint,
  Hint,
} from '@/components';
import { useDateInputFormatter } from '@/hooks';
import { tansformDateValue, inputIntent, handleDateChange } from '@/utils';

/**
 * Expense form header.
 */
export function ExpenseFormHeader() {
  const { currencies, accounts, customers } = useExpenseFormContext();
  const dateInputFormatter = useDateInputFormatter();

  return (
    <div className={styles.headerFields}>
      <FastField name={'paymentDate'}>
        {({ form, field: { value }, meta: { error, touched } }: any) => (
          <FormGroup
            label={intl.get('payment_date')}
            labelInfo={<Hint />}
            className={classNames('form-group--select-list', Classes.FILL)}
            intent={inputIntent({ error, touched }) as any}
            helperText={<ErrorMessage name="paymentDate" />}
            inline={true}
          >
            <DateInput
              {...dateInputFormatter}
              value={tansformDateValue(value)}
              onChange={handleDateChange((formattedDate: string) => {
                form.setFieldValue('paymentDate', formattedDate);
              })}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
            />
          </FormGroup>
        )}
      </FastField>

      <FFormGroup
        name={'paymentAccountId'}
        // @ts-expect-error FFormGroup does not declare `items` / `shouldUpdate` / `fastField`
        items={accounts}
        label={intl.get('payment_account')}
        labelInfo={<FieldRequiredHint />}
        inline={true}
        fastField={true}
        shouldUpdate={accountsFieldShouldUpdate}
      >
        <AccountsSelect
          name={'paymentAccountId'}
          items={accounts}
          placeholder={<T id={'select_payment_account'} />}
          filterByTypes={SUPPORTED_EXPENSE_PAYMENT_ACCOUNT_TYPES}
          allowCreate={true}
          fastField={true}
          shouldUpdate={accountsFieldShouldUpdate}
          fill={true}
          buttonProps={{ 'data-testId': 'expense-payment-account-select' }}
        />
      </FFormGroup>

      <FFormGroup
        name={'currencyCode'}
        label={intl.get('currency')}
        className={classNames(Classes.FILL)}
        inline={true}
        fastField={true}
      >
        <FSelect
          name={'currencyCode'}
          items={currencies}
          valueAccessor={'currencyCode'}
          textAccessor={'currencyCode'}
          labelAccessor={'currencyCode'}
          popoverProps={{ minimal: true }}
          fill={true}
          fastField={true}
        />
      </FFormGroup>

      {/* ----------- Exchange rate ----------- */}
      <ExpensesExchangeRateInputField
        name={'exchangeRate'}
        formGroupProps={{ label: ' ', inline: true }}
      />

      {/* ----------- Reference No. ----------- */}
      <FFormGroup
        name={'referenceNo'}
        label={intl.get('reference_no')}
        inline={true}
        fastField
      >
        <FInputGroup
          name={'referenceNo'}
          data-testId={'expense-reference-no-input'}
          fastField
        />
      </FFormGroup>

      {/* ----------- Customer ----------- */}
      <ExpenseFormCustomerSelect customers={customers} />
    </div>
  );
}

type ExpenseFormCustomerSelectProps = {
  customers: Record<string, any>[];
};

/**
 * Customer select field of expense form.
 * @returns {React.ReactNode}
 */
function ExpenseFormCustomerSelect({
  customers,
}: ExpenseFormCustomerSelectProps) {
  return (
    <FormGroup
      label={intl.get('customer')}
      labelInfo={<Hint />}
      inline={true}
      // @ts-expect-error FormGroup does not declare `name` / `fastField` / `shouldUpdateDeps` / `shouldUpdate`
      name={'payeeId'}
      fastField={true}
      shouldUpdateDeps={{ items: customers }}
      shouldUpdate={customersFieldShouldUpdate}
    >
      <CustomersSelect
        name={'payeeId'}
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
