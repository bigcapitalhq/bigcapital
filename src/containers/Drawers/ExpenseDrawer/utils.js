import React from 'react';
import intl from 'react-intl-universal';

import { FormatNumberCell } from '../../../components';

/**
 * Retrieve expense readonly details entries table columns.
 */
export const useExpenseReadEntriesColumns = () =>
  React.useMemo(
    () => [
      {
        Header: intl.get('expense_account'),
        accessor: 'expense_account.name',
        width: 110,
        disableSortBy: true,
        className: 'account',
      },
      {
        Header: intl.get('description'),
        accessor: 'description',
        width: 110,
        disableSortBy: true,
        className: 'description',
      },
      {
        Header: intl.get('amount'),
        accessor: 'amount',
        Cell: FormatNumberCell,
        width: 100,
        disableSortBy: true,
        className: 'amount',
        align: 'right',
      },
    ],
    [],
  );
