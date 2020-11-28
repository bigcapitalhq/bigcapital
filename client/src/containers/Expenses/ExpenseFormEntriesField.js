import { FastField } from 'formik';
import React from 'react';
import ExpenseFormEntries from './ExpenseFormEntries';

export default function ExpenseFormEntriesField({

}) {
  return (
    <FastField name={'categories'}>
      {({ form, field: { value }, meta: { error, touched } }) => (
        <ExpenseFormEntries
          entries={value}
          error={error}
          onChange={(entries) => {
            form.setFieldValue('categories', entries)
          }}
        />
      )}
    </FastField>
  )
}