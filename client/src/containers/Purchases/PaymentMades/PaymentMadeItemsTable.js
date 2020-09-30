import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Button, Intent, Position, Tooltip } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { Icon, DataTable } from 'components';
import moment from 'moment';

import { compose, formattedAmount, transformUpdatedRows } from 'utils';
import {
  MoneyFieldCell,
  DivFieldCell,
  EmptyDiv,
} from 'components/DataTableCells';

import withBills from '../Bill/withBills';
import { omit, pick } from 'lodash';

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

const CellRenderer = (content, type) => (props) => {
  if (props.data.length === props.row.index + 1) {
    return '';
  }
  return content(props);
};

const TotalCellRederer = (content, type) => (props) => {
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

function PaymentMadeItemsTable({
  //#ownProps
  onClickRemoveRow,
  onClickAddNewRow,
  onClickClearAllLines,
  entries,
  formik: { errors, setFieldValue, values },
}) {
  const [rows, setRows] = useState([]);
  const [entrie, setEntrie] = useState([]);
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
      },
      {
        Header: formatMessage({ id: 'Date' }),
        id: 'bill_date',
        accessor: (r) => moment(r.bill_date).format('YYYY MMM DD'),
        Cell: CellRenderer(EmptyDiv, 'bill_date'),
        disableSortBy: true,
        disableResizing: true,
        width: 250,
      },

      {
        Header: formatMessage({ id: 'bill_number' }),
        accessor: (row) => `#${row.bill_number}`,
        Cell: CellRenderer(EmptyDiv, 'bill_number'),
        disableSortBy: true,
        className: 'bill_number',
      },
      {
        Header: formatMessage({ id: 'bill_amount' }),
        accessor: 'amount',
        Cell: CellRenderer(DivFieldCell, 'amount'),
        disableSortBy: true,
        width: 100,
        className: '',
      },
      {
        Header: formatMessage({ id: 'amount_due' }),
        accessor: 'due_amount',
        Cell: TotalCellRederer(DivFieldCell, 'due_amount'),
        disableSortBy: true,
        width: 150,
        className: '',
      },
      {
        Header: formatMessage({ id: 'payment_amount' }),
        accessor: 'payment_amount',
        Cell: TotalCellRederer(MoneyFieldCell, 'payment_amount'),

        disableSortBy: true,
        width: 150,
        className: '',
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
          index: index - 1,
        })),
      );
      onClickRemoveRow && onClickRemoveRow(removeIndex);
    },
    [entrie, setFieldValue, onClickRemoveRow],
  );

  const onClickNewRow = () => {
    onClickAddNewRow && onClickAddNewRow();
  };

  const handleClickClearAllLines = () => {
    onClickClearAllLines && onClickClearAllLines();
  };

  const rowClassNames = useCallback((row) => {
    return { 'row--total': rows.length === row.index + 1 };
  });

  const handleUpdateData = useCallback(
    (rowIndex, columnId, value) => {
      const newRows = rows.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...rows[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      });
      // setRows(newRows);
      setFieldValue(
        'entries',
        newRows,
        // .map((row) => ({
        //   ...pick(row, ['payment_amount']),
        //   invoice_id: row.id,
        // })),
      );
    },
    [rows, setFieldValue, setRows],
  );
  return (
    <div className={'estimate-form__table'}>
      <DataTable
        columns={columns}
        data={rows}
        rowClassNames={rowClassNames}
        spinnerProps={false}
        payload={{
          errors: errors.entries || [],
          updateData: handleUpdateData,
          removeRow: handleRemoveRow,
        }}
      />
      <div className={'mt1'}>
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

export default compose()(PaymentMadeItemsTable);
// withBills(({}) => ({}))
