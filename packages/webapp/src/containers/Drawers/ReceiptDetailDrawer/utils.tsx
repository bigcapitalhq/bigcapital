import React from 'react';
import intl from 'react-intl-universal';
import { useReceiptDetailDrawerContext } from './ReceiptDetailDrawerProvider';
import { FormatNumberCell, TextOverviewTooltipCell } from '@/components';
import { getColumnWidth } from '@/utils';

export const useReceiptReadonlyEntriesTableColumns = () => {
  // Receipt details drawer context.
  const { receipt } = useReceiptDetailDrawerContext();
  const entries = receipt?.entries ?? [];

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
        accessor: 'quantityFormatted',
        width: getColumnWidth(entries, 'quantityFormatted', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        align: 'right',
        disableSortBy: true,
      },
      {
        Header: intl.get('rate'),
        accessor: 'rate',
        width: getColumnWidth(entries, 'rate', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        align: 'right',
        disableSortBy: true,
        textOverview: true,
      },
      {
        id: 'discount',
        Header: 'Discount',
        accessor: 'discountFormatted',
        align: 'right',
        disableSortBy: true,
        textOverview: true,
        width: getColumnWidth(entries, 'discountFormatted', {
          minWidth: 60,
          magicSpacing: 5,
        }),
      },
      {
        Header: intl.get('amount'),
        accessor: 'totalFormatted',
        width: getColumnWidth(entries, 'totalFormatted', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        align: 'right',
        disableSortBy: true,
        textOverview: true,
      },
    ],
    [entries],
  );
};
