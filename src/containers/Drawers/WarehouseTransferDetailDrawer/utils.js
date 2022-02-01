import React from 'react';
import intl from 'react-intl-universal';

import {
  Icon,
  FormattedMessage as T,
  FormatNumberCell,
  Choose,
} from '../../../components';

export const useWarehouseTransferReadOnlyEntriesColumns = () =>
  React.useMemo(
    () => [
      {
        Header: intl.get('warehouse_transfer.column.item_name'),
        accessor: 'item.name',
        width: 150,
        className: 'name',
        disableSortBy: true,
      },
      {
        Header: intl.get('warehouse_transfer.column.transfer_quantity'),
        accessor: 'quantity',
        Cell: FormatNumberCell,
        width: 100,
        align: 'right',
        disableSortBy: true,
      },
    ],
    [],
  );
