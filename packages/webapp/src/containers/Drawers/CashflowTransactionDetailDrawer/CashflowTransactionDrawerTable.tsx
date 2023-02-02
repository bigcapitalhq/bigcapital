// @ts-nocheck
import React from 'react';

import { CommercialDocEntriesTable } from '@/components';

import { useCashflowTransactionColumns } from './utils';
import { useCashflowTransactionDrawerContext } from './CashflowTransactionDrawerProvider';

/**
 * Cashflow transaction drawer table.
 */
export default function CashflowTransactionDrawerTable() {
  const columns = useCashflowTransactionColumns();
  const {
    cashflowTransaction: { transactions },
  } = useCashflowTransactionDrawerContext();

  return <CommercialDocEntriesTable columns={columns} data={transactions} />;
}
