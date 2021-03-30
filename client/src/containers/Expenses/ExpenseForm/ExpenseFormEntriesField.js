import { FastField } from 'formik';
import React from 'react';
import ExpenseFormEntriesTable from './ExpenseFormEntriesTable';
import { defaultExpenseEntry } from './utils';

/**
 * Expense form entries field.
 */
export default function ExpenseFormEntriesField({ linesNumber = 4 }) {
  return (
    <FastField name={'categories'}>
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
