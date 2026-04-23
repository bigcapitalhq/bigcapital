// @ts-nocheck
import React from 'react';
import { FastField } from 'formik';
import ExpenseFormPaymentSplitsTable from './ExpenseFormPaymentSplitsTable';
import { accountsFieldShouldUpdate } from './utils';
import { useExpenseFormContext } from './ExpenseFormPageProvider';

/**
 * Expense form payment splits (multi-account payment) field.
 */
export default function ExpenseFormPaymentSplitsField() {
  const { accounts } = useExpenseFormContext();

  return (
    <FastField
      name={'payment_splits'}
      accounts={accounts}
      shouldUpdate={accountsFieldShouldUpdate}
    >
      {({
        form: { values, setFieldValue },
        field: { value },
        meta: { error, touched },
      }) => (
        <ExpenseFormPaymentSplitsTable
          entries={value}
          error={touched ? error : null}
          onChange={(entries) => {
            setFieldValue('payment_splits', entries);
          }}
          currencyCode={values.currency_code}
        />
      )}
    </FastField>
  );
}
