// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { getColumnWidth } from '@/utils';
import { FormatNumberCell, TextOverviewTooltipCell } from '@/components';
import { useReceiptDetailDrawerContext } from './ReceiptDetailDrawerProvider';

export const useReceiptReadonlyEntriesTableColumns = () => {
  // Receipt details drawer context.
  const {
    receipt: { entries },
  } = useReceiptDetailDrawerContext();
  return React.useMemo(
    () => [
      {
        Header: intl.get('product_and_service'),
        accessor: 'item.name',
        Cell: TextOverviewTooltipCell,
        width: 150,
        className: 'name',
        disableSortBy: true,
        textOverview: true,
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
        Header: intl.get('quantity'),
        accessor: 'quantity',
        Cell: FormatNumberCell,
        width: getColumnWidth(entries, 'quantity', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        align: 'right',
        disableSortBy: true,
      },
      {
        Header: intl.get('rate'),
        accessor: 'rate',
        width: getColumnWidth(entries, 'rate_formatted', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        align: 'right',
        disableSortBy: true,
        textOverview: true,
      },
      {
        Header: intl.get('amount'),
        accessor: 'amount',
        width: getColumnWidth(entries, 'total_formatted', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        align: 'right',
        disableSortBy: true,
        textOverview: true,
      },
    ],
    [],
  );
};
