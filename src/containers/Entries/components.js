import React from 'react';
import intl from 'react-intl-universal';
import { MenuItem, Menu, Button, Position } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';

import { Align, CellType } from 'common';
import { Hint, Icon, FormattedMessage as T } from 'components';
import { formattedAmount } from 'utils';
import {
  InputGroupCell,
  MoneyFieldCell,
  ItemsListCell,
  PercentFieldCell,
  NumericInputCell,
  CheckBoxFieldCell,
} from 'components/DataTableCells';

/**
 * Item header cell.
 */
export function ItemHeaderCell() {
  return (
    <>
      <T id={'product_and_service'} />
      <Hint
        content={<T id={'item_entries.products_services.hint'} />}
        tooltipProps={{ boundary: 'window', position: Position.RIGHT }}
      />
    </>
  );
}

/**
 * Actions cell renderer component.
 */
export function ActionsCellRenderer({
  row: { index },
  payload: { removeRow },
}) {
  const onRemoveRole = () => {
    removeRow(index);
  };

  const exampleMenu = (
    <Menu>
      <MenuItem onClick={onRemoveRole} text={'item_entries.remove_row'} />
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
ActionsCellRenderer.cellType = CellType.Button;

/**
 * Total accessor.
 */
export function TotalCell({ payload: { currencyCode }, value }) {
  return <span>{formattedAmount(value, currencyCode, { noZero: true })}</span>;
}

/**
 * Landed cost header cell.
 */
const LandedCostHeaderCell = () => {
  return (
    <>
      <T id={'landed'} />
      <Hint content={<T id={'item_entries.landed.hint'} />} />
    </>
  );
};

/**
 * Retrieve editable items entries columns.
 */
export function useEditableItemsEntriesColumns({ landedCost }) {
  return React.useMemo(
    () => [
      {
        Header: ItemHeaderCell,
        id: 'item_id',
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
        Header: intl.get('quantity'),
        accessor: 'quantity',
        Cell: NumericInputCell,
        disableSortBy: true,
        width: 70,
        align: Align.Right,
      },
      {
        Header: intl.get('rate'),
        accessor: 'rate',
        Cell: MoneyFieldCell,
        disableSortBy: true,
        width: 70,
        align: Align.Right,
      },
      {
        Header: intl.get('discount'),
        accessor: 'discount',
        Cell: PercentFieldCell,
        disableSortBy: true,
        width: 60,
        align: Align.Right,
      },
      {
        Header: intl.get('total'),
        accessor: 'amount',
        Cell: TotalCell,
        disableSortBy: true,
        width: 100,
        align: Align.Right,
      },
      ...(landedCost
        ? [
            {
              Header: LandedCostHeaderCell,
              accessor: 'landed_cost',
              Cell: CheckBoxFieldCell,
              width: 100,
              disabledAccessor: 'landed_cost_disabled',
              disableSortBy: true,
              disableResizing: true,
              align: Align.Center,
            },
          ]
        : []),
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
}
