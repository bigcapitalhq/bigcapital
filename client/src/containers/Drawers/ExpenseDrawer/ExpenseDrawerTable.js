import React from 'react';

import intl from 'react-intl-universal';
import { DataTable, Money } from 'components';

/**
 * Expense details table.
 */
export default function ExpenseDrawerTable({
  expense: { currency_code, categories },
}) {
  const columns = React.useMemo(
    () => [
      {
        Header: intl.get('expense_account'),
        accessor: 'expense_account.name',
        width: 110,
      },
      {
        Header: intl.get('amount'),
        accessor: ({ amount }) => (
          <Money amount={amount} currency={currency_code} />
        ),
        width: 100,
      },
      {
        Header: intl.get('description'),
        accessor: 'description',
        width: 110,
      },
    ],
    [],
  );

  return (
    <div className="expense-drawer__content--table">
      <DataTable columns={columns} data={categories} />
    </div>
  );
}
