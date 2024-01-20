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
  // Expense drawer context.
  const { expense } = useExpenseDrawerContext();

  // Expense readonly entries columns.
  const columns = useExpenseReadEntriesColumns({
    currency: expense.currency_code,
  });

  return (
    <CommercialDocEntriesTable
      columns={columns}
      data={expense.categories}
      styleName={TableStyle.Constrant}
    />
  );
}
