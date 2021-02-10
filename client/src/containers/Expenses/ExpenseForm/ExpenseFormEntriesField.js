import { FastField } from 'formik';
import React from 'react';
import ExpenseFormEntries from './ExpenseFormEntries';
import { orderingLinesIndexes, repeatValue } from 'utils';

export default function ExpenseFormEntriesField({
  defaultRow,
  linesNumber = 4,
}) {
  return (
    <FastField name={'categories'}>
      {({ form, field: { value }, meta: { error, touched } }) => (
        <ExpenseFormEntries
          entries={value}
          error={error}
          onChange={(entries) => {
            form.setFieldValue('categories', entries);
          }}
          onClickAddNewRow={() => {
            form.setFieldValue('categories', [...value, defaultRow]);
          }}
          onClickClearAllLines={() => {
            form.setFieldValue(
              'categories', 
              orderingLinesIndexes([...repeatValue(defaultRow, linesNumber)])
            );
          }}
        />
      )}
    </FastField>
  );
}
