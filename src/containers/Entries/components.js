import React from 'react';
import intl from 'react-intl-universal';
import { Tooltip, Button, Intent, Position } from '@blueprintjs/core';
import { Hint, Icon, FormattedMessage as T } from 'components';
import { formattedAmount, safeSumBy } from 'utils';
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
 * Item column footer cell.
 */
export function ItemFooterCell() {
  return (
    <span>
      <T id={'total'} />
    </span>
  );
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

  return (
    <Tooltip content={<T id={'remove_the_line'} />} position={Position.LEFT}>
      <Button
        icon={<Icon icon={'times-circle'} iconSize={14} />}
        iconSize={14}
        className="m12"
        intent={Intent.DANGER}
        onClick={onRemoveRole}
      />
    </Tooltip>
  );
}

/**
 * Quantity total footer cell.
 */
export function QuantityTotalFooterCell({ rows }) {
  const quantity = safeSumBy(rows, 'original.quantity');
  return <span>{quantity}</span>;
}

/**
 * Total footer cell.
 */
export function TotalFooterCell({ payload: { currencyCode }, rows }) {
  const total = safeSumBy(rows, 'original.amount');
  return <span>{formattedAmount(total, currencyCode)}</span>;
}

/**
 * Total accessor.
 */
export function TotalCell({ payload: { currencyCode }, value }) {
  return <span>{formattedAmount(value, currencyCode, { noZero: true })}</span>;
}

// Index table cell.
export function IndexTableCell({ row: { index } }) {
  return <span>{index + 1}</span>;
}

/**
 * Landed cost header cell.
 */
const LandedCostHeaderCell = () => {
  return (
    <>
      <T id={'Landed'} />
      <Hint content={<T id={'item_entries.landed.hint'} />} />
    </>
  );
};

/**
 * Retrieve editable items entries columns.
 */
export function useEditableItemsEntriesColumns({
  landedCost,
}) {
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
        Header: ItemHeaderCell,
        id: 'item_id',
        accessor: 'item_id',
        Cell: ItemsListCell,
        Footer: ItemFooterCell,
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
        Footer: QuantityTotalFooterCell,
        disableSortBy: true,
        width: 70,
        className: 'quantity',
      },
      {
        Header: intl.get('rate'),
        accessor: 'rate',
        Cell: MoneyFieldCell,
        disableSortBy: true,
        width: 70,
        className: 'rate',
      },
      {
        Header: intl.get('discount'),
        accessor: 'discount',
        Cell: PercentFieldCell,
        disableSortBy: true,
        width: 60,
        className: 'discount',
      },
      {
        Header: intl.get('total'),
        Footer: TotalFooterCell,
        accessor: 'amount',
        Cell: TotalCell,
        disableSortBy: true,
        width: 100,
        className: 'total',
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
              className: 'landed-cost',
            },
          ]
        : []),
      {
        Header: '',
        accessor: 'action',
        Cell: ActionsCellRenderer,
        className: 'actions',
        disableSortBy: true,
        disableResizing: true,
        width: 45,
      },
    ],
    [],
  );
}
