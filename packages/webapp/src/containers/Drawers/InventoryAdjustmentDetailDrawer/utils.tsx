import React from 'react';
import intl from 'react-intl-universal';
import { useInventoryAdjustmentDrawerContext } from './InventoryAdjustmentDrawerProvider';
import { TextOverviewTooltipCell } from '@/components';
import { getColumnWidth } from '@/utils';

export const useInventoryAdjustmentEntriesColumns = () => {
  const { inventoryAdjustment } = useInventoryAdjustmentDrawerContext();
  const entries = inventoryAdjustment?.entries ?? [];

  return React.useMemo(
    () => [
      {
        Header: intl.get('inventory_adjustment.column.product'),
        accessor: 'item.name',
        Cell: TextOverviewTooltipCell,
        width: 100,
        className: 'name',
        disableSortBy: true,
        textOverview: true,
      },
      {
        Header: intl.get('quantity'),
        accessor: 'quantity',
        width: getColumnWidth(entries, 'quantity', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        align: 'right',
        disableSortBy: true,
        textOverview: true,
      },
      {
        Header: intl.get('cost'),
        accessor: 'cost',
        width: getColumnWidth(entries, 'cost', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        align: 'right',
        disableSortBy: true,
        textOverview: true,
      },
      {
        Header: intl.get('value'),
        accessor: 'value',
        width: getColumnWidth(entries, 'value', {
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
