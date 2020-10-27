import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Button, Intent, Position, Tooltip } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { Icon, DataTable } from 'components';
import moment from 'moment';
import { useQuery } from 'react-query';
import { useParams, useHistory } from 'react-router-dom';

import { compose, formattedAmount, transformUpdatedRows } from 'utils';
import {
  InputGroupCell,
  MoneyFieldCell,
  ItemsListCell,
  DivFieldCell,
  EmptyDiv,
} from 'components/DataTableCells';
import withInvoices from '../Invoice/withInvoices';
import withInvoiceActions from '../Invoice/withInvoiceActions';

import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useUpdateEffect } from 'hooks';

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

function PaymentReceiveItemsTable({
  //#ownProps
  onClickRemoveRow,
  onClickAddNewRow,
  onClickClearAllLines,
  entries,
  formik: { errors, setFieldValue, values },

  dueInvoices,
  customer_id,
  invoices,
}) {
  const [rows, setRows] = useState([]);
  const { formatMessage } = useIntl();

  useEffect(() => {
    setRows([...dueInvoices.map((e) => ({ ...e })), ...invoices, {}]);
  }, [invoices]);

  // useEffect(() => {
  //   setRows([...dueInvoices.map((e) => ({ ...e })), {}]);

  //   setEntrie([
  //     ...dueInvoices.map((e) => {
  //       return { id: e.id, payment_amount: e.payment_amount };
  //     }),
  //   ]);
  // }, [dueInvoices]);

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
        id: 'invoice_date',
        accessor: (r) => moment(r.invoice_date).format('YYYY MMM DD'),
        Cell: CellRenderer(EmptyDiv, 'invoice_date'),
        disableSortBy: true,
        disableResizing: true,
        width: 250,
      },

      {
        Header: formatMessage({ id: 'invocie_number' }),
        accessor: (row) => `#${row.invoice_no}`,
        Cell: CellRenderer(EmptyDiv, 'invoice_no'),
        disableSortBy: true,
        className: '',
      },
      {
        Header: formatMessage({ id: 'invoice_amount' }),
        accessor: 'balance',
        Cell: CellRenderer(DivFieldCell, 'balance'),
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
    [rows, setFieldValue, onClickRemoveRow],
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
      setRows(newRows);
      setFieldValue(
        'entries',
        newRows.map((row) => ({
          ...pick(row, ['payment_amount']),
          invoice_id: row.id,
        })),
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

export default compose(
  withInvoices(({ dueInvoices }) => ({
    dueInvoices,
  })),
)(PaymentReceiveItemsTable);
