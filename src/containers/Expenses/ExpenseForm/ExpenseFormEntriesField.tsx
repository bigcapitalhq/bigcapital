// @ts-nocheck
import { FastField } from 'formik';
import React from 'react';
import ExpenseFormEntriesTable from './ExpenseFormEntriesTable';
import { useExpenseFormContext } from './ExpenseFormPageProvider';
import { defaultExpenseEntry, accountsFieldShouldUpdate } from './utils';

/**
 * Expense form entries field.
 */
export default function ExpenseFormEntriesField({ linesNumber = 4 }) {
  // Expense form context.
  const { accounts, projects } = useExpenseFormContext();

  return (
    <FastField
      name={'categories'}
      accounts={accounts}
      projects={projects}
      shouldUpdate={accountsFieldShouldUpdate}
    >
      {({
        form: { values, setFieldValue },
        field: { value },
        meta: { error, touched },
      }) => (
        <ExpenseFormEntriesTable
          entries={value}
          error={error}
          onChange={(entries) => {
            setFieldValue('categories', entries);
          }}
          defaultEntry={defaultExpenseEntry}
          linesNumber={linesNumber}
          currencyCode={values.currency_code}
        />
      )}
    </FastField>
  );
}
