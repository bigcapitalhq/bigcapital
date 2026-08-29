import { FastField } from 'formik';
import React from 'react';
import { ExpenseFormEntriesTable } from './ExpenseFormEntriesTable';
import { useExpenseFormContext } from './ExpenseFormPageProvider';
import { defaultExpenseEntry, accountsFieldShouldUpdate } from './utils';
import type { ExpenseEntry, ExpenseFormValues } from './types';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';

type ExpenseFormEntriesFieldProps = {
  linesNumber?: number;
};

/**
 * Expense form entries field.
 */
export function ExpenseFormEntriesField({
  linesNumber = 4,
}: ExpenseFormEntriesFieldProps) {
  const { accounts, projects } = useExpenseFormContext();
  const { featureCan } = useFeatureCan();
  const isLandedCostEnabled = featureCan(Features.LandedCost);

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
      }: any) => (
        <ExpenseFormEntriesTable
          entries={value}
          error={error}
          onChange={(entries: ExpenseEntry[]) => {
            setFieldValue('categories', entries);
          }}
          defaultEntry={defaultExpenseEntry}
          currencyCode={(values as ExpenseFormValues).currencyCode}
          landedCost={isLandedCostEnabled}
        />
      )}
    </FastField>
  );
}
