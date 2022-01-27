import React from 'react';
import intl from 'react-intl-universal';

import clsx from 'classnames';
import { CLASSES } from '../../../../common/classes';

/**
 * Warehouse locations columns
 */
export const useWarehouseLocationsColumns = () => {
  return React.useMemo(
    () => [
      {
        id: 'warehouse_name',
        Header: intl.get('warehouse_locations.column.warehouse_name'),
        width: 120,
      },
      {
        id: 'quantity',
        Header: intl.get('warehouse_locations.column.quantity'),
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
