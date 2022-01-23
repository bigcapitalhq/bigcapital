import React from 'react';
import { CLASSES } from 'common/classes';
import { MoneyFieldCell, FormatDateCell, AppToaster, T } from 'components';
import { InputGroupCell, ItemsListCell } from 'components/DataTableCells';

// Index table cell.
export function IndexTableCell({ row: { index } }) {
  return <span>{index + 1}</span>;
}

/**
 * Retrieves warehouse transfer table columns.
 * @returns
 */
export const useWarehouseTransferTableColumns = () => {
  return React.useMemo(
    () => [
      {
        Header: '#',
        accessor: 'index',
        Cell: IndexTableCell,
        width: 40,
        disableResizing: true,
        disableSortBy: true,
        className: 'index',
      },
      {
        id: 'item_id',
        Header: 'Item Name',
        accessor: 'item_id',
        Cell: ItemsListCell,
        disableSortBy: true,
        width: '120',
        className: 'item',
        fieldProps: { allowCreate: true },
      },
      {
        id: 'source_warehouse',
        Header: 'Source Warehouse',
        accessor: 'source_warehouse',
        disableSortBy: true,
        align: 'right',
        width: '100',
      },
      {
        id: 'destination_warehouse',
        Header: 'Destination Warehouse',
        accessor: 'destination_warehouse',
        disableSortBy: true,
        align: 'right',
        width: '100',
      },
      {
        Header: 'Transfer Quantity',
        accessor: 'quantity',
        Cell: MoneyFieldCell,
        disableSortBy: true,
        align: 'right',
        width: '150',
      },
    ],
    [],
  );
};
