// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import { FormatNumberCell, TextOverviewTooltipCell } from '@/components';
import { useExpenseDrawerContext } from './ExpenseDrawerProvider';
import { getColumnWidth } from '@/utils';

/**
 * Retrieve expense readonly details entries table columns.
 */
export const useExpenseReadEntriesColumns = () => {
  // Expense drawer context.
  const {
    expense: { categories },
  } = useExpenseDrawerContext();

  return React.useMemo(
    () => [
      {
        Header: intl.get('expense_account'),
        accessor: 'expense_account.name',
        Cell: TextOverviewTooltipCell,
        width: 110,
        disableSortBy: true,
        textOverview: true,
        className: 'account',
      },
      {
        Header: intl.get('description'),
        accessor: 'description',
        Cell: TextOverviewTooltipCell,
        className: 'description',
        disableSortBy: true,
        textOverview: true,
      },
      {
        Header: intl.get('amount'),
        accessor: 'amount_formatted',
        width: getColumnWidth(categories, 'amount', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        disableSortBy: true,
        className: 'amount',
        align: 'right',
      },
    ],
    [],
  );
};
