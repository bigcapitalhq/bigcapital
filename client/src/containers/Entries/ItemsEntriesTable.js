import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Button, Intent, Position, Tooltip } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import { Hint, Icon, DataTableEditable } from 'components';
import {
  InputGroupCell,
  MoneyFieldCell,
  ItemsListCell,
  PercentFieldCell,
  DivFieldCell,
} from 'components/DataTableCells';
import { formattedAmount, saveInvoke } from 'utils';

// Actions cell renderer component.
const ActionsCellRenderer = ({
  row: { index },
  column: { id },
  cell: { value },
  data,
  payload,
}) => {
  if (data.length <= index + 1) {
    return '';
  }
  const onRemoveRole = () => {
    payload.removeRow(index);
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
};

// Total cell renderer.
const TotalCellRenderer = (content, type) => (props) => {
  if (props.data.length === props.row.index + 1) {
    const total = props.data.reduce((total, entry) => {
      const amount = parseInt(entry[type], 10);
      const computed = amount ? total + amount : total;

      return computed;
    }, 0);
    return <span>{formattedAmount(total, 'USD')}</span>;
  }
  return content(props);
};

const calculateDiscount = (discount, quantity, rate) =>
  quantity * rate - (quantity * rate * discount) / 100;

const CellRenderer = (content, type) => (props) => {
  if (props.data.length === props.row.index + 1) {
    return '';
  }
  return content(props);
};

const ItemHeaderCell = () => (
  <>
    <T id={'product_and_service'} />
    <Hint />
  </>
);

export default function ItemsEntriesTable({
  //#ownProps
  items,
  entries,
  errors,
  onUpdateData,
  onClickRemoveRow,
  onClickAddNewRow,
  onClickClearAllLines,
  filterPurchasableItems = false,
  filterSellableItems = false,
}) {
  const [rows, setRows] = useState([]);
  const { formatMessage } = useIntl();

  useEffect(() => {
    setRows([...entries.map((e) => ({ ...e }))]);
  }, [entries]);

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'index',
        Cell: ({ row: { index } }) => <span>{index + 1}</span>,
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
        disableSortBy: true,
        width: 180,
        filterPurchasable: filterPurchasableItems,
        filterSellable: filterSellableItems,
      },
      {
        Header: formatMessage({ id: 'description' }),
        accessor: 'description',
        Cell: InputGroupCell,
        disableSortBy: true,
        className: 'description',
        width: 100,
      },

      {
        Header: formatMessage({ id: 'quantity' }),
        accessor: 'quantity',
        Cell: CellRenderer(InputGroupCell, 'quantity'),
        disableSortBy: true,
        width: 80,
        className: 'quantity',
      },
      {
        Header: formatMessage({ id: 'rate' }),
        accessor: 'rate',
        Cell: TotalCellRenderer(MoneyFieldCell, 'rate'),
        disableSortBy: true,
        width: 80,
        className: 'rate',
      },
      {
        Header: formatMessage({ id: 'discount' }),
        accessor: 'discount',
        Cell: CellRenderer(PercentFieldCell, InputGroupCell),
        disableSortBy: true,
        width: 80,
        className: 'discount',
      },
      {
        Header: formatMessage({ id: 'total' }),
        accessor: (row) =>
          calculateDiscount(row.discount, row.quantity, row.rate),
        Cell: TotalCellRenderer(DivFieldCell, 'total'),
        disableSortBy: true,
        width: 120,
        className: 'total',
      },
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
    [formatMessage],
  );

  const handleUpdateData = useCallback(
    (rowIndex, columnId, value) => {
      const newRows = rows.map((row, index) => {
        if (index === rowIndex) {
          const newRow = { ...rows[rowIndex], [columnId]: value };
          return {
            ...newRow,
            total: calculateDiscount(
              newRow.discount,
              newRow.quantity,
              newRow.rate,
            ),
          };
        }
        return row;
      });
      saveInvoke(onUpdateData, newRows);
    },
    [rows, onUpdateData],
  );

  const handleRemoveRow = useCallback(
    (rowIndex) => {
      if (rows.length <= 1) {
        return;
      }
      const removeIndex = parseInt(rowIndex, 10);
      saveInvoke(onClickRemoveRow, removeIndex);
    },
    [rows, onClickRemoveRow],
  );

  const onClickNewRow = (event) => {
    saveInvoke(onClickAddNewRow, event);
  };

  const handleClickClearAllLines = (event) => {
    saveInvoke(onClickClearAllLines, event);
  };

  const rowClassNames = useCallback(
    (row) => ({
      'row--total': rows.length === row.index + 1,
    }),
    [rows],
  );

  return (
    <DataTableEditable
      className={classNames(CLASSES.DATATABLE_EDITOR_ITEMS_ENTRIES)}
      columns={columns}
      data={rows}
      rowClassNames={rowClassNames}
      sticky={true}
      payload={{
        items,
        errors: errors || [],
        updateData: handleUpdateData,
        removeRow: handleRemoveRow,
        autoFocus: ['item_id', 0],
      }}
      actions={
        <>
          <Button
            small={true}
            className={'button--secondary button--new-line'}
            onClick={onClickNewRow}
          >
            <T id={'new_lines'} />
          </Button>

          <Button
            small={true}
            className={'button--secondary button--clear-lines ml1'}
            onClick={handleClickClearAllLines}
          >
            <T id={'clear_all_lines'} />
          </Button>
        </>
      }
    />
  );
}
