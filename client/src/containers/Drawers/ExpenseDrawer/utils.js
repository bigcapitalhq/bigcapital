import React from 'react';
import intl from 'react-intl-universal';

export const useExpenseReadEntriesColumns = () =>
  React.useMemo(
    () => [
      {
        Header: intl.get('expense_account'),
        accessor: 'expense_account.name',
        width: 110,
        disableSortBy: true,
      },
      {
        Header: intl.get('description'),
        accessor: 'description',
        width: 110,
        disableSortBy: true,
      },
      {
        Header: intl.get('amount'),
        accessor: 'amount',
        width: 100,
        disableSortBy: true,
      },
    ],
    [],
  );
