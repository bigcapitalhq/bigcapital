import { FormGroup, Position, Classes } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { css } from '@emotion/css';
import { useTheme } from '@emotion/react';
import type { Theme } from '@xstyled/emotion';
import classNames from 'classnames';
import { FastField, ErrorMessage } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { ExpensesExchangeRateInputField } from './components';
import { SUPPORTED_EXPENSE_PAYMENT_ACCOUNT_TYPES } from './constants';
import { useExpenseFormContext } from './ExpenseFormPageProvider';
import { customersFieldShouldUpdate, accountsFieldShouldUpdate } from './utils';
import {
  CustomersSelect,
  FInputGroup,
  Stack,
  FormattedMessage as T,
} from '@/components';
import {
  FFormGroup,
  FSelect,
  AccountsSelect,
  FieldRequiredHint,
  Hint,
} from '@/components';
import { CLASSES } from '@/constants/classes';
import { useDateInputFormatter } from '@/hooks';
import { tansformDateValue, inputIntent, handleDateChange } from '@/utils';

const getFieldsStyle = (theme: Theme) => css`
  .${theme.bpPrefix}-form-group {
    margin-bottom: 0;

    &.${theme.bpPrefix}-inline {
      max-width: 450px;
    }
    .${theme.bpPrefix}-label {
      min-width: 150px;
      font-weight: 500;
    }
    .${theme.bpPrefix}-form-content {
      width: 100%;
    }
  }
`;

/**
 * Expense form header.
 */
export function ExpenseFormHeader() {
  const { currencies, accounts, customers } = useExpenseFormContext();
  const theme = useTheme() as unknown as Theme;
  const fieldsClassName = getFieldsStyle(theme);
  const dateInputFormatter = useDateInputFormatter();

  return (
    <Stack spacing={18} flex={1} className={fieldsClassName}>
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
    </Stack>
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
      name={'customerId'}
      fastField={true}
      shouldUpdateDeps={{ items: customers }}
      shouldUpdate={customersFieldShouldUpdate}
    >
      <CustomersSelect
        name={'customerId'}
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
