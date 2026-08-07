// @ts-nocheck
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
  const {
    cashflowTransaction: { transactions },
  } = useCashflowTransactionDrawerContext();

  return (
    <CommercialDocEntriesTable
      columns={columns}
      data={transactions}
      styleName={TableStyle.Constrant}
    />
  );
}
