import React from 'react';
import intl from 'react-intl-universal';
import { useExpenseDrawerContext } from './ExpenseDrawerProvider';
import { FormatNumberCell, TextOverviewTooltipCell } from '@/components';
import { getColumnWidth } from '@/utils';

/**
 * Retrieve expense readonly details entries table columns.
 */
export const useExpenseReadEntriesColumns = () => {
  // Expense drawer context.
  const { expense } = useExpenseDrawerContext();
  const categories = expense?.categories ?? [];

  return React.useMemo(
    () => [
      {
        Header: intl.get('expense_account'),
        accessor: 'expenseAccount.name',
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
        accessor: 'amountFormatted',
        width: getColumnWidth(categories, 'amount', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        disableSortBy: true,
        className: 'amount',
        align: 'right',
      },
    ],
    [categories],
  );
};
