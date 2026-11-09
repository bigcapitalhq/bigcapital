import React from 'react';
import intl from 'react-intl-universal';
import { FormatNumberCell } from '@/components';

/**
 * Warehouse locations columns
 */
export const useWarehouseLocationsColumns = () => {
  return React.useMemo(
    () => [
      {
        id: 'warehouse_name',
        accessor: 'warehouseName',
        Header: intl.get('warehouse_locations.column.warehouse_name'),
        width: 120,
      },
      {
        id: 'warehouse_code',
        accessor: 'warehouseCode',
        Header: intl.get('warehouse_locations.column.warehouse_code'),
        width: 100,
      },
      {
        id: 'quantity',
        accessor: 'quantityOnHandFormatted',
        Header: intl.get('warehouse_locations.column.quantity'),
        Cell: FormatNumberCell,
        align: 'right',
        width: 100,
      },
      {
        id: 'available_for_sale',
        accessor: 'availableForSale',
        Header: intl.get('warehouse_locations.column.available_for_sale'),
        align: 'right',
        width: 100,
      },
    ],
    [],
  );
};
