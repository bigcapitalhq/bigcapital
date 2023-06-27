// @ts-nocheck
import React from 'react';

import { CommercialDocEntriesTable } from '@/components';

import { useExpenseReadEntriesColumns } from './utils';
import { useExpenseDrawerContext } from './ExpenseDrawerProvider';

import { TableStyle } from '@/constants';

/**
 * Expense details table.
 */
export default function ExpenseDrawerTable() {
  // Expense readonly entries columns.
  const columns = useExpenseReadEntriesColumns();

  // Expense drawer context.
  const { expense } = useExpenseDrawerContext();

  return (
    <CommercialDocEntriesTable
      columns={columns}
      data={expense.categories}
      styleName={TableStyle.Constraint}
    />
  );
}
