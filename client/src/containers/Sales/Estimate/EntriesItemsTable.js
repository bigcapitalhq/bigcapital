import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { omit } from 'lodash';
import { Button, Intent, Position, Tooltip } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import classNames from 'classnames';

import { CLASSES } from 'common/classes';
import { Hint, Icon } from 'components';
import DataTable from 'components/DataTable';
import {
  InputGroupCell,
  MoneyFieldCell,
  EstimatesListFieldCell,
  PercentFieldCell,
  DivFieldCell,
} from 'components/DataTableCells';

import withItems from 'containers/Items/withItems';
import { compose, formattedAmount } from 'utils';

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

const TotalEstimateCellRederer = (content, type) => (props) => {
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

const ItemHeaderCell = () => {
  return (
    <>
      <T id={'product_and_service'} />
      <Hint />
    </>
  );
};

function EstimateTable({
  //#withitems
  itemsCurrentPage,

  //#ownProps
  onClickRemoveRow,
  onClickAddNewRow,
  onClickClearAllLines,
  entries,
  formik: { errors, setFieldValue, values },
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
        Cell: EstimatesListFieldCell,
        disableSortBy: true,
        width: 180,
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
        Cell: TotalEstimateCellRederer(MoneyFieldCell, 'rate'),
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
        Cell: TotalEstimateCellRederer(DivFieldCell, 'total'),
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
      const newRow = rows.map((row, index) => {
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
      setFieldValue(
        'entries',
        newRow.map((row) => ({
          ...omit(row, ['total']),
        })),
      );
    },
    [rows, setFieldValue],
  );

  const handleRemoveRow = useCallback(
    (rowIndex) => {
      if (rows.length <= 1) {
        return;
      }

      const removeIndex = parseInt(rowIndex, 10);
      const newRows = rows.filter((row, index) => index !== removeIndex);
      setFieldValue(
        'entries',
        newRows.map((row, index) => ({
          ...omit(row),
          index: index + 1,
        })),
      );
      onClickRemoveRow && onClickRemoveRow(removeIndex);
    },
    [rows, setFieldValue, onClickRemoveRow],
  );

  const onClickNewRow = () => {
    onClickAddNewRow && onClickAddNewRow();
  };

  const handleClickClearAllLines = () => {
    onClickClearAllLines && onClickClearAllLines();
  };

  const rowClassNames = useCallback(
    (row) => ({
      'row--total': rows.length === row.index + 1,
    }),
    [rows],
  );

  return (
    <div className={classNames(
      CLASSES.DATATABLE_EDITOR,
      CLASSES.DATATABLE_EDITOR_ITEMS_ENTRIES,
    )}>
      <DataTable
        columns={columns}
        data={rows}
        rowClassNames={rowClassNames}
        payload={{
          products: itemsCurrentPage,
          errors: errors.entries || [],
          updateData: handleUpdateData,
          removeRow: handleRemoveRow,
        }}
      />
      <div className={classNames(CLASSES.DATATABLE_EDITOR_ACTIONS, 'mt1')}>
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
      </div>
    </div>
  );
}

export default compose(
  withItems(({ itemsCurrentPage }) => ({
    itemsCurrentPage,
  })),
)(EstimateTable);
