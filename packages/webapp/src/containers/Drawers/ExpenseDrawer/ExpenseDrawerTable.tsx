import React from 'react';
import { useExpenseDrawerContext } from './ExpenseDrawerProvider';
import { useExpenseReadEntriesColumns } from './utils';
import { CommercialDocEntriesTable } from '@/components';
import { TableStyle } from '@/constants';

/**
 * Expense drawer table.
 */
export function ExpenseDrawerTable() {
  // Expense readonly entries columns.
  const columns = useExpenseReadEntriesColumns();

  // Expense drawer context.
  const { expense } = useExpenseDrawerContext();

  return (
    <CommercialDocEntriesTable
      columns={columns}
      data={expense?.categories ?? []}
      styleName={TableStyle.Constrant}
    />
  );
}
