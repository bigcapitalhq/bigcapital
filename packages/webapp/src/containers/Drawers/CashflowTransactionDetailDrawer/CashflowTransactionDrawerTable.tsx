import React from 'react';
import { useCashflowTransactionDrawerContext } from './CashflowTransactionDrawerProvider';
import { useCashflowTransactionColumns } from './utils';
import { CommercialDocEntriesTable } from '@/components';
import { TableStyle } from '@/constants';

/**
 * Cashflow transaction drawer table.
 */
export function CashflowTransactionDrawerTable() {
  const columns = useCashflowTransactionColumns();
  const { cashflowTransaction } = useCashflowTransactionDrawerContext();

  return (
    <CommercialDocEntriesTable
      columns={columns}
      data={cashflowTransaction?.transactions ?? []}
      styleName={TableStyle.Constrant}
    />
  );
}
