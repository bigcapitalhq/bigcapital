import React from 'react';
import { DataTable } from 'components';
import { useExpenseReadEntriesColumns } from './utils';
import { useExpenseDrawerContext } from './ExpenseDrawerProvider';

/**
 * Expense details table.
 */
export default function ExpenseDrawerTable() {
  const columns = useExpenseReadEntriesColumns();
  const { expense } = useExpenseDrawerContext();

  return (
    <div className="expense-drawer__content--table">
      <DataTable columns={columns} data={expense.categories} />
    </div>
  );
}
