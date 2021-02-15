import { FastField } from 'formik';
import React from 'react';
import ExpenseFormEntriesTable from './ExpenseFormEntriesTable';
import { useExpenseFormContext } from './ExpenseFormPageProvider';

/**
 * Expense form entries field.
 */
export default function ExpenseFormEntriesField({
  linesNumber = 4,
}) {
  const { defaultCategoryEntry } = useExpenseFormContext();

  return (
    <FastField name={'categories'}>
      {({ form, field: { value }, meta: { error, touched } }) => (
        <ExpenseFormEntriesTable
          entries={value}
          error={error}
          onChange={(entries) => {
            form.setFieldValue('categories', entries);
          }}
          defaultEntry={defaultCategoryEntry}
          linesNumber={linesNumber}
        />
      )}
    </FastField>
  );
}
