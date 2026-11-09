import { Button, Menu, MenuItem } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { find, get } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import {
  MoneyFieldCell,
  Icon,
  ItemsListCell,
  InputGroupCell,
} from '@/components';
import { Align, CellType } from '@/constants';

interface WarehouseTransferEntryRow {
  itemId?: number | string;
  warehouses?: Array<{
    warehouseId: number;
    quantityOnHandFormatted?: string;
  }>;
}

interface RemoveRowPayload {
  removeRow: (rowIndex: number) => void;
}

interface WarehousePayload {
  sourceWarehouseId: number | string;
  destinationWarehouseId: number | string;
}

interface CellProps<TPayload> {
  row: { index: number; original: WarehouseTransferEntryRow };
  payload: TPayload;
}

/**
 * Actions cell renderer component.
 */
export function ActionsCellRenderer({
  row: { index },
  payload: { removeRow },
}: CellProps<RemoveRowPayload>) {
  const onRemoveRole = () => {
    removeRow(index);
  };

  const exampleMenu = (
    <Menu>
      <MenuItem
        onClick={onRemoveRole}
        text={intl.get('warehouse_transfer.entries.remove_row')}
      />
    </Menu>
  );

  return (
    <Popover2 content={exampleMenu} placement="left-start">
      <Button
        icon={<Icon icon={'more-13'} iconSize={13} />}
        className="m12"
        minimal={true}
      />
    </Popover2>
  );
}
ActionsCellRenderer.cellType = CellType.Button;

function SourceWarehouseAccessorCell({
  row: { original },
  payload,
}: CellProps<WarehousePayload>) {
  // Ignore display zero if the item not selected yet.
  if (!original.itemId) return '';

  const warehouse = find(
    original.warehouses,
    (w) => w.warehouseId === payload.sourceWarehouseId,
  );
  return get(warehouse, 'quantityOnHandFormatted', '0');
}

function DistentionWarehouseAccessorCell({
  row: { original },
  payload,
}: CellProps<WarehousePayload>) {
  // Ignore display zero if the item not selected yet.
  if (!original.itemId) return '';

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
        id: 'itemId',
        Header: intl.get('warehouse_transfer.column.item_name'),
        accessor: 'itemId',
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
        id: 'sourceWarehouse',
        Header: intl.get('warehouse_transfer.column.source_warehouse'),
        accessor: 'sourceWarehouse',
        disableSortBy: true,
        Cell: SourceWarehouseAccessorCell,
        align: Align.Right,
        width: 100,
      },
      {
        id: 'destinationWarehouse',
        Header: intl.get('warehouse_transfer.column.destination_warehouse'),
        accessor: 'destinationWarehouse',
        Cell: DistentionWarehouseAccessorCell,
        disableSortBy: true,
        align: Align.Right,
        width: 100,
      },
      {
        Header: intl.get('warehouse_transfer.column.transfer_quantity'),
        accessor: 'quantity',
        Cell: MoneyFieldCell,
        disableSortBy: true,
        align: Align.Right,
        width: 100,
      },
      {
        Header: intl.get('warehouse_transfer.column.cost_price'),
        accessor: 'cost',
        Cell: MoneyFieldCell,
        disableSortBy: true,
        align: Align.Right,
        width: 80,
      },
      {
        Header: '',
        accessor: 'action',
        Cell: ActionsCellRenderer,
        disableSortBy: true,
        disableResizing: true,
        width: 45,
        align: Align.Center,
      },
    ],
    [],
  );
};
