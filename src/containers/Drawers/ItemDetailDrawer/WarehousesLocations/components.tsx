// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { FormatNumberCell, FormattedMessage as T } from '@/components';

/**
 * Warehouse locations columns
 */
export const useWarehouseLocationsColumns = () => {
  return React.useMemo(
    () => [
      {
        id: 'warehouse_name',
        accessor: 'warehouse_name',
        Header: intl.get('warehouse_locations.column.warehouse_name'),
        width: 120,
      },
      {
        id: 'warehouse_code',
        accessor: 'warehouse_code',
        Header: intl.get('warehouse_locations.column.warehouse_code'),
        width: 100,
      },
      {
        id: 'quantity',
        accessor: 'quantity_on_hand_formatted',
        Header: intl.get('warehouse_locations.column.quantity'),
        Cell: FormatNumberCell,
        align: 'right',
        width: 100,
      },
      {
        id: 'available_for_sale',
        Header: intl.get('warehouse_locations.column.available_for_sale'),
        align: 'right',
        width: 100,
      },
    ],
    [],
  );
};
