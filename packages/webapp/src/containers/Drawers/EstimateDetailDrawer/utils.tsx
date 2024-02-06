// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { getColumnWidth } from '@/utils';
import { TextOverviewTooltipCell } from '@/components';
import { useEstimateDetailDrawerContext } from './EstimateDetailDrawerProvider';

/**
 * Retrieve table columns of estimate readonly entries details.
 */
export const useEstimateReadonlyEntriesColumns = () => {
  // estimate details drawer context.
  const {
    estimate: { entries },
  } = useEstimateDetailDrawerContext();

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
        accessor: 'quantity_formatted',
        width: getColumnWidth(entries, 'quantity_formatted', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        align: 'right',
        disableSortBy: true,
        textOverview: true,
      },
      {
        Header: intl.get('rate'),
        accessor: 'rate_formatted',
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
        accessor: 'total_formatted',
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
