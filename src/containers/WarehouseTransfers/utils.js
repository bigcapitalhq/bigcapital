import React from 'react';
import intl from 'react-intl-universal';
import { find, get } from 'lodash';
import { Button, Menu, MenuItem } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';

import { MoneyFieldCell, Icon, T } from 'components';
import { InputGroupCell, ItemsListCell } from 'components/DataTableCells';

// Index table cell.
export function IndexTableCell({ row: { index } }) {
  return <span>{index + 1}</span>;
}

/**
 * Actions cell renderer component.
 */
export function ActionsCellRenderer({
  row: { index },
  column: { id },
  cell: { value },
  data,
  payload: { removeRow },
}) {
  const onRemoveRole = () => {
    removeRow(index);
  };

  const exampleMenu = (
    <Menu>
      <MenuItem onClick={onRemoveRole} text="Remove line" />
    </Menu>
  );

  return (
    <Popover2 content={exampleMenu} placement="left-start">
      <Button
        icon={<Icon icon={'more-13'} iconSize={13} />}
        iconSize={14}
        className="m12"
        minimal={true}
      />
    </Popover2>
  );
}

function SourceWarehouseAccessorCell({ row: { original }, payload }) {
  // Ignore display zero if the item not selected yet.
  if (!original.item_id) return '';

  const warehouse = find(
    original.warehouses,
    (w) => w.warehouseId === payload.sourceWarehouseId,
  );
  return get(warehouse, 'quantityOnHandFormatted', '0');
}

function DistentionWarehouseAccessorCell({ row: { original }, payload }) {
  // Ignore display zero if the item not selected yet.
  if (!original.item_id) return '';

  const warehouse = find(
    original.warehouses,
    (w) => w.warehouseId === payload.destinationWarehouseId,
  );
  return get(warehouse, 'quantityOnHandFormatted', '0');
}

/**
 * Retrieves warehouse transfer table columns.
 * @returns
 */
export const useWarehouseTransferTableColumns = () => {
  return React.useMemo(
    () => [
      {
        id: 'item_id',
        Header: intl.get('warehouse_transfer.column.item_name'),
        accessor: 'item_id',
        Cell: ItemsListCell,
        disableSortBy: true,
        width: 130,
        className: 'item',
        fieldProps: { allowCreate: true },
      },
      {
        Header: intl.get('description'),
        accessor: 'description',
        Cell: InputGroupCell,
        disableSortBy: true,
        className: 'description',
        width: 120,
      },
      {
        id: 'source_warehouse',
        Header: intl.get('warehouse_transfer.column.source_warehouse'),
        accessor: 'source_warehouse',
        disableSortBy: true,
        Cell: SourceWarehouseAccessorCell,
        align: 'right',
        width: 120,
      },
      {
        id: 'destination_warehouse',
        Header: intl.get('warehouse_transfer.column.destination_warehouse'),
        accessor: 'destination_warehouse',
        Cell: DistentionWarehouseAccessorCell,
        disableSortBy: true,
        align: 'right',
        width: 120,
      },
      {
        Header: intl.get('warehouse_transfer.column.transfer_quantity'),
        accessor: 'quantity',
        Cell: MoneyFieldCell,
        disableSortBy: true,
        align: 'right',
        width: 100,
      },
      {
        Header: intl.get('warehouse_transfer.column.cost_price'),
        accessor: 'cost',
        Cell: MoneyFieldCell,
        disableSortBy: true,
        align: 'right',
        width: 100,
      },
      {
        Header: '',
        accessor: 'action',
        Cell: ActionsCellRenderer,
        disableSortBy: true,
        disableResizing: true,
        width: 45,
      },
    ],
    [],
  );
};
