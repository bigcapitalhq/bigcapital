import React from 'react';

import { DataTable, If, FormattedMessage as T } from 'components';

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

  return (
    <div className="cashflow-drawer__content-table">
      <DataTable columns={columns} data={transactions} />
    </div>
  );
}
